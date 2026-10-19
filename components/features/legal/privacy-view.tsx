import { LegalPageLayout } from "./legal-page-layout";
import { LegalSection } from "./legal-section";

export function PrivacyView() {
  return (
    <LegalPageLayout title="Privacy Policy" updatedAt="August 19, 2026">
      <LegalSection title="1. Information We Collect">
        We collect the information you provide when creating an account (name, email, role), the code and answers you submit for assignments, and behavioral signals such as paste frequency and typing activity used to support academic integrity checks.
      </LegalSection>
      <LegalSection title="2. How We Use Information">
        We use this information to operate the Service: authenticating you, grading submissions, powering the AI tutor, gamification features, and class leaderboards, and improving the platform.
      </LegalSection>
      <LegalSection title="3. AI Providers">
        When you use the AI tutor, your messages and relevant assignment context are sent to the configured AI provider (e.g. Groq, OpenAI, Anthropic, or Google) to generate a response.
      </LegalSection>
      <LegalSection title="4. Data Sharing">
        Your instructor can view your submissions, scores, and behavioral signals for classes you are enrolled in. We do not sell personal data to third parties.
      </LegalSection>
      <LegalSection title="5. Data Retention">
        We retain account and submission data for as long as your account is active, or as needed to provide the Service.
      </LegalSection>
      <LegalSection title="6. Your Choices">
        You can leave a class at any time, which removes your enrollment. Contact the project maintainers to request deletion of your account and associated data.
      </LegalSection>
    </LegalPageLayout>
  );
}
