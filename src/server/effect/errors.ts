import { Data } from "effect";

/**
 * Authentication errors
 */
export class UnauthorizedError extends Data.TaggedError("UnauthorizedError")<{
  readonly message: string;
}> {}

export class AuthError extends Data.TaggedError("AuthError")<{
  readonly message: string;
  readonly cause?: unknown;
}> {}

/**
 * Database errors
 */
export class DatabaseError extends Data.TaggedError("DatabaseError")<{
  readonly message: string;
  readonly cause?: unknown;
}> {}

export class NotFoundError extends Data.TaggedError("NotFoundError")<{
  readonly entity: string;
  readonly id?: string;
}> {}

/**
 * LLM/AI errors
 */
export class LLMError extends Data.TaggedError("LLMError")<{
  readonly message: string;
  readonly cause?: unknown;
}> {}

export class LLMConfigError extends Data.TaggedError("LLMConfigError")<{
  readonly message: string;
}> {}

/**
 * Validation errors
 */
export class ValidationError extends Data.TaggedError("ValidationError")<{
  readonly message: string;
  readonly field?: string;
}> {}

/**
 * Analysis errors
 */
export class AnalysisError extends Data.TaggedError("AnalysisError")<{
  readonly message: string;
  readonly conversationId?: string;
  readonly cause?: unknown;
}> {}

/**
 * External service errors
 */
export class EmailError extends Data.TaggedError("EmailError")<{
  readonly message: string;
  readonly cause?: unknown;
}> {}

/**
 * Union type for all app errors
 */
export type AppError =
  | UnauthorizedError
  | AuthError
  | DatabaseError
  | NotFoundError
  | LLMError
  | LLMConfigError
  | ValidationError
  | AnalysisError
  | EmailError;
