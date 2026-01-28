import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | LinkedInbox",
  description: "Terms and Conditions for LinkedInbox - LinkedIn outreach analytics platform",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
        <p className="text-zinc-400 mb-12">Last updated: January 2026</p>

        <div className="prose prose-invert prose-zinc max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">SOFTWARE LICENSE AGREEMENT (SaaS)</h2>
            <p className="text-zinc-300 leading-relaxed">
              This SOFTWARE LICENSE AGREEMENT ("AGREEMENT") is entered into between LinkedInbox and its subsidiaries 
              (collectively referred to as "LinkedInbox," "we," "our company") and the individual or legal entity 
              subscribing to the software and/or services under this Agreement and/or an applicable order form 
              ("you" or "Client", and together with LinkedInbox, the "Parties"), and governs the Client's access 
              to and use of the software and/or services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">1. Preamble</h2>
            <p className="text-zinc-300 leading-relaxed">
              LinkedInbox has developed and owns a software solution called LinkedInbox, which analyzes LinkedIn 
              outreach conversations and cold messaging performance. This solution is provided to clients as 
              Software-as-a-Service (SaaS). This Agreement governs the relationship between LinkedInbox and its 
              clients regarding subscription, access, and usage of the services by end users.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">2. Acceptance of Terms of Service</h2>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>By subscribing to LinkedInbox's services, the Client accepts these Terms of Service (ToS).</li>
              <li>The Client confirms they are authorized to represent their organization and accept these ToS on its behalf.</li>
              <li>The ToS may be updated, and renewals will be subject to the version in force at the time of renewal.</li>
              <li>This Agreement may be made available through Stripe or another online payment platform, and acceptance of the ToS may occur via a confirmation click during subscription.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">3. Software Access & Restrictions</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              LinkedInbox grants a limited, non-transferable, non-exclusive right to access and use the software 
              via a web browser. Nothing in this Agreement transfers intellectual property rights.
            </p>
            <p className="text-zinc-300 mb-2">It is prohibited to:</p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Modify, alter, or create derivative works.</li>
              <li>Resell or commercially exploit the service without written consent.</li>
              <li>Use automated tools to monitor or extract content.</li>
              <li>Host or distribute fraudulent, abusive, or illegal content.</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed mt-4">
              Access to the service is subject to applicable laws, and LinkedInbox reserves the right to suspend 
              accounts for violations.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">4. Data Protection & GDPR / Swiss LPD Compliance</h2>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>LinkedInbox complies with the GDPR and Swiss LPD.</li>
              <li>A separate Data Processing Agreement (DPA) is provided upon request.</li>
              <li>Clients will be informed in case of a security breach, and corrective actions will be implemented immediately.</li>
              <li>Data transfers outside the EU/EEA follow Standard Contractual Clauses (SCCs).</li>
              <li>Subprocessors: LinkedInbox may engage subprocessors to deliver the service. Any changes will be notified to the client, who can object if sensitive data is involved.</li>
              <li>Clients may request access, correction, deletion, or portability of their personal data.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">5. Subscription & Termination Policy</h2>
            
            <h3 className="text-xl font-medium text-white mt-6 mb-3">Duration & Renewal:</h3>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Monthly subscriptions renew automatically each month.</li>
              <li>Annual subscriptions renew each year.</li>
            </ul>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">Notice Period:</h3>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>1 month before the end of an annual subscription.</li>
              <li>10 days for a monthly subscription.</li>
            </ul>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">Non-payment:</h3>
            <p className="text-zinc-300">Account suspension after 30 days of unpaid dues.</p>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">Termination:</h3>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Clients may cancel subscriptions directly via Stripe or by sending a written request to hello@linkedinbox.co.</li>
              <li>No refunds are provided for early termination of annual subscriptions, except in cases of duly justified force majeure.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">6. Taxes & Billing</h2>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Clients in Switzerland: Prices include Swiss VAT.</li>
              <li>Clients outside Switzerland: Prices are exclusive of tax. The client is responsible for any applicable taxes in their jurisdiction.</li>
              <li>Payments are processed via Stripe (credit card, direct debit) and must be completed within 30 days of invoice issuance.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">7. AI Responsibility Disclaimer</h2>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>LinkedInbox does not guarantee the accuracy of AI-generated analysis or responses.</li>
              <li>The Client is solely responsible for decisions made based on AI-generated insights.</li>
              <li>LinkedInbox accepts no liability for errors, bias, or AI "hallucinations".</li>
              <li>It is strongly recommended that each analysis be reviewed before making business decisions.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">8. Client Verification (KYC)</h2>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>LinkedInbox may require identity verification to prevent fraud.</li>
              <li>This applies especially to clients outside Switzerland/EU or in sensitive jurisdictions.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">9. Service Suspension</h2>
            <p className="text-zinc-300 mb-2">LinkedInbox reserves the right to suspend an account in case of:</p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Non-payment after 30 days.</li>
              <li>Serious violations of the Terms (e.g., fraudulent or illegal content, resource abuse).</li>
              <li>Failure to comply with confidentiality and data protection obligations.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">10. Backups & Data Retrieval</h2>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>LinkedInbox does not guarantee backups beyond standard security measures.</li>
              <li>Clients are responsible for regular data backups.</li>
              <li>Upon written request within 10 days after termination, LinkedInbox may provide a copy of stored data.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">11. Limitation of Liability</h2>
            <p className="text-zinc-300 mb-2">LinkedInbox is not liable for:</p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Technical failures or service interruptions.</li>
              <li>AI-generated errors or inaccuracies.</li>
              <li>The Client's non-compliance with obligations.</li>
              <li>Force majeure (e.g., natural disasters, DDoS attacks).</li>
            </ul>
            <p className="text-zinc-300 mt-4">
              LinkedInbox's financial liability is limited to amounts paid by the Client in the last 12 months.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">12. Arbitration & Jurisdiction</h2>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Any dispute will be settled through arbitration in Geneva, Switzerland.</li>
              <li>The courts of Geneva have exclusive jurisdiction in case of litigation.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">13. Activation & Termination of the Agreement</h2>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>The Agreement is effective upon subscription to the service.</li>
              <li>Termination is subject to the conditions outlined in Section 5.</li>
              <li>Data will be deleted within 10 days after termination, unless legally required otherwise.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">14. Impressum</h2>
            <div className="text-zinc-300 space-y-2">
              <p><strong>Company Name:</strong> LinkedInbox (Incorporation in progress)</p>
              <p><strong>Business Address:</strong> Business address available upon request. LinkedInbox is currently operating in pre-incorporation phase from Geneva, Switzerland.</p>
              <p><strong>Email:</strong> hello@linkedinbox.co</p>
              <p><strong>Website:</strong> www.linkedinbox.co</p>
              <p className="mt-4"><strong>Company Representative:</strong></p>
              <p>Valentin Garnier, CEO</p>
              <p><strong>Place of jurisdiction:</strong> Geneva, Switzerland</p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Disclaimer</h2>
            <p className="text-zinc-300 leading-relaxed">
              Despite careful content control, we assume no liability for the content of external links. 
              The operators of linked pages are solely responsible for their content. LinkedInbox is not 
              responsible for the accuracy of AI-generated content and recommends review before making 
              business decisions based on the analysis provided.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
