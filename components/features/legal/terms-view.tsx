import { LegalPageLayout } from "./legal-page-layout";
import { LegalSection } from "./legal-section";

export function TermsView() {
  return (
    <LegalPageLayout title="Terms of Service" updatedAt="August 19, 2026">
      <LegalSection title="1. Acceptance of Terms">
        By creating an account or using PACE (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.
      </LegalSection>
      <LegalSection title="2. Accounts">
        You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. Each account is tied to a single email address and role (student, instructor, or admin).
      </LegalSection>
      <LegalSection title="3. Acceptable Use">
        You agree not to misuse the Service, including attempting to bypass academic integrity safeguards, sharing another user&apos;s submissions as your own, or interfering with the normal operation of the platform.
      </LegalSection>
      <LegalSection title="4. Content and Submissions">
        Code and content you submit remain yours. By submitting, you grant instructors and the Service the right to store, display, and evaluate that content for the purpose of grading and instruction.
      </LegalSection>
      <LegalSection title="5. Termination">
        We may suspend or terminate accounts that violate these terms. You may stop using the Service at any time.
      </LegalSection>
      <LegalSection title="6. Changes">
        We may update these terms from time to time. Continued use of the Service after changes take effect constitutes acceptance of the revised terms.
      </LegalSection>
      <LegalSection title="7. Contact">
        Questions about these terms can be sent to the project maintainers via the GitHub repository.
      </LegalSection>
    </LegalPageLayout>
  );
}
