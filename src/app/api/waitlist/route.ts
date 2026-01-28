import { NextRequest, NextResponse } from "next/server";
import { Effect } from "effect";
import { ValidationError, EmailError } from "@/server/effect/errors";

/**
 * Send email via Resend
 */
const sendEmail = (params: {
  name: string;
  email: string;
}) =>
  Effect.gen(function* () {
    const { name, email } = params;

    const emailContent = `
New Waitlist Signup for LinkedInbox Pro!

Name: ${name}
Email: ${email}
Timestamp: ${new Date().toISOString()}

This user has joined the waitlist for lifetime access ($5).
Follow up with payment instructions.
    `.trim();

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      // Log for development, don't fail
      console.log("[Waitlist] RESEND_API_KEY not set - logging signup:");
      console.log(emailContent);
      return { success: true, method: "logged" as const };
    }

    console.log("[Waitlist] Sending email via Resend...");

    const fromAddress = process.env.RESEND_FROM_EMAIL || "valentin@linkedinbox.co";
    const toAddress = process.env.RESEND_TO_EMAIL || "valentin@linkedinbox.co";

    const response = yield* Effect.tryPromise({
      try: () =>
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            from: fromAddress,
            to: toAddress,
            subject: `🎉 New Waitlist Signup: ${name}`,
            text: emailContent,
            reply_to: email,
          }),
        }),
      catch: (error) =>
        new EmailError({
          message: "Failed to send email",
          cause: error,
        }),
    });

    const responseText = yield* Effect.tryPromise({
      try: () => response.text(),
      catch: () => new EmailError({ message: "Failed to read response" }),
    });

    if (!response.ok) {
      console.error("[Waitlist] Resend error:", response.status, responseText);
      return yield* Effect.fail(
        new EmailError({
          message: `Resend API error: ${response.status}`,
          cause: responseText,
        })
      );
    }

    console.log("[Waitlist] Email sent successfully:", responseText);
    return { success: true, method: "resend" as const };
  });

/**
 * POST /api/waitlist
 * Adds a user to the waitlist and sends notification email
 */
const waitlistProgram = (body: { email?: string; name?: string }) =>
  Effect.gen(function* () {
    const { email, name } = body;

    // Validate input
    if (!email || !name) {
      return yield* Effect.fail(
        new ValidationError({
          message: "Email and name are required",
        })
      );
    }

    // Send notification email
    const result = yield* sendEmail({ name, email });

    return { success: true, method: result.method };
  });

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));

  const program = waitlistProgram(body);

  const result = await Effect.runPromise(program).catch((error) => {
    if (error instanceof ValidationError) {
      return { _error: true, message: error.message, status: 400 };
    }
    if (error instanceof EmailError) {
      // Log email errors but don't fail the request (user still joined)
      console.error("[Waitlist] Email error:", error.message, error.cause);
      return { success: true, emailFailed: true };
    }
    console.error("[Waitlist] Unexpected error:", error);
    return { _error: true, message: "Internal server error", status: 500 };
  });

  if ("_error" in result) {
    return NextResponse.json(
      { error: result.message },
      { status: result.status }
    );
  }

  return NextResponse.json(result);
}
