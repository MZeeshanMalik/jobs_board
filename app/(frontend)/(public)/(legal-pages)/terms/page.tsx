// app/terms/page.tsx
import type { Metadata } from "next";
import LegalLayout from "@/components/legal/legal-layout";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the terms and conditions for using JobBoard. Rules for job seekers, employers, and visitors using our platform in Pakistan.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Service | JobBoard",
    description: "Terms and conditions for using JobBoard.",
    type: "website",
    url: "/terms",
  },
};

const UPDATED = "January 1, 2025";

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      updated={UPDATED}
      intro="These terms govern your use of JobBoard. By accessing our website or services, you agree to them. Please read carefully."
      sections={[
        {
          heading: "1. Acceptance of Terms",
          body: (
            <p>
              By using JobBoard, you confirm that you are at least 13 years old
              and legally able to enter into this agreement. If you use JobBoard
              on behalf of an organization, you confirm you have authority to
              bind that organization to these terms.
            </p>
          ),
        },
        {
          heading: "2. Your Account",
          body: (
            <>
              <p>When you create an account, you agree to:</p>
              <ul>
                <li>Provide accurate and complete information.</li>
                <li>Keep your login credentials secure and confidential.</li>
                <li>Notify us immediately of any unauthorized use.</li>
                <li>Be responsible for all activity under your account.</li>
              </ul>
              <p>
                We may suspend or terminate accounts that violate these terms or
                pose a risk to other users.
              </p>
            </>
          ),
        },
        {
          heading: "3. Acceptable Use",
          body: (
            <>
              <p>
                You agree <strong>not</strong> to:
              </p>
              <ul>
                <li>Post false, misleading, or fraudulent job listings.</li>
                <li>Impersonate another person or company.</li>
                <li>Scrape, harvest, or bulk-download user data.</li>
                <li>Upload viruses, malware, or harmful code.</li>
                <li>Harass, discriminate, or send unsolicited spam.</li>
                <li>Violate any applicable laws or regulations.</li>
              </ul>
              <p>
                Violations may result in immediate account removal and legal
                action where appropriate.
              </p>
            </>
          ),
        },
        {
          heading: "4. Job Listings and Applications",
          body: (
            <p>
              JobBoard hosts content from employers. We are not a party to any
              employment relationship and do not guarantee the accuracy,
              legitimacy, or quality of any listing. Verify all employer details
              before applying or sharing personal information. We are not
              responsible for decisions made by employers or candidates.
            </p>
          ),
        },
        {
          heading: "5. Intellectual Property",
          body: (
            <p>
              All content, trademarks, and technology on JobBoard are owned by
              us or our licensors. You may not copy, modify, distribute, or
              reverse-engineer our platform without written permission. You
              retain ownership of content you post (e.g. resumes) but grant us a
              license to display it as needed to provide our services.
            </p>
          ),
        },
        {
          heading: "6. Third-Party Links",
          body: (
            <p>
              Our site may link to third-party websites. We do not control and
              are not responsible for their content, policies, or practices.
              Visiting third-party sites is at your own risk.
            </p>
          ),
        },
        {
          heading: "7. Disclaimers",
          body: (
            <p>
              JobBoard is provided "as is" and "as available" without warranties
              of any kind, express or implied. We do not guarantee uninterrupted
              access, error-free operation, or that listings will result in
              employment. Use the platform at your own discretion.
            </p>
          ),
        },
        {
          heading: "8. Limitation of Liability",
          body: (
            <p>
              To the maximum extent permitted by law, JobBoard is not liable for
              any indirect, incidental, special, or consequential damages
              arising from your use of the platform — including lost profits,
              data, or opportunities.
            </p>
          ),
        },
        {
          heading: "9. Termination",
          body: (
            <p>
              You may stop using JobBoard at any time and delete your account.
              We may suspend or terminate your access immediately if you breach
              these terms or if we discontinue the service.
            </p>
          ),
        },
        {
          heading: "10. Changes to Terms",
          body: (
            <p>
              We may update these terms occasionally. Material changes will be
              communicated by updating the "Last updated" date. Continued use
              after changes means you accept the new terms.
            </p>
          ),
        },
        {
          heading: "11. Governing Law",
          body: (
            <p>
              These terms are governed by the laws of the Islamic Republic of
              Pakistan. Any dispute will be subject to the exclusive
              jurisdiction of the courts of Lahore, Pakistan.
            </p>
          ),
        },
        {
          heading: "12. Contact",
          body: (
            <p>
              Questions about these terms? Email{" "}
              <a href="mailto:legal@jobboard.pk">legal@jobboard.pk</a> or use
              our <a href="/contact">contact page</a>.
            </p>
          ),
        },
      ]}
    />
  );
}
