// app/privacy/page.tsx
import type { Metadata } from "next";
import LegalLayout from "@/components/legal/legal-layout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how JobBoard collects, uses, and protects your personal information. Our commitment to privacy and data protection for job seekers and employers in Pakistan.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy | JobBoard",
    description:
      "How JobBoard collects, uses, and protects your personal information.",
    type: "website",
    url: "/privacy",
  },
};

const UPDATED = "January 1, 2025";

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      updated={UPDATED}
      intro="At JobBoard, your privacy matters. This policy explains what information we collect, how we use it, and the choices you have. We keep it simple and transparent."
      sections={[
        {
          heading: "1. Information We Collect",
          body: (
            <>
              <p>We collect information in three ways:</p>
              <ul>
                <li>
                  <strong>Information you provide</strong> — name, email, phone
                  number, resume, work history, and other details you enter when
                  applying for jobs or creating an account.
                </li>
                <li>
                  <strong>Information from employers</strong> — job listings,
                  company details, and application responses.
                </li>
                <li>
                  <strong>Information collected automatically</strong> — IP
                  address, browser type, device information, pages visited, and
                  cookies (see our <a href="/cookies">Cookie Policy</a> for
                  details).
                </li>
              </ul>
            </>
          ),
        },
        {
          heading: "2. How We Use Your Information",
          body: (
            <>
              <p>We use your information to:</p>
              <ul>
                <li>
                  Provide job search, applications, and employer matching.
                </li>
                <li>Send service-related notifications and account updates.</li>
                <li>
                  Improve our platform, prevent fraud, and ensure security.
                </li>
                <li>Comply with legal obligations and enforce our terms.</li>
              </ul>
              <p>
                We do <strong>not</strong> sell your personal information to
                third parties.
              </p>
            </>
          ),
        },
        {
          heading: "3. Sharing Your Information",
          body: (
            <>
              <p>We share information only in these cases:</p>
              <ul>
                <li>
                  <strong>With employers</strong> — when you apply for a job, we
                  share your application details with that employer.
                </li>
                <li>
                  <strong>With service providers</strong> — hosting, analytics,
                  and email providers who process data on our behalf.
                </li>
                <li>
                  <strong>For legal reasons</strong> — when required by law or
                  to protect our rights and users' safety.
                </li>
              </ul>
            </>
          ),
        },
        {
          heading: "4. Your Rights",
          body: (
            <>
              <p>You have the right to:</p>
              <ul>
                <li>Access, correct, or delete your personal information.</li>
                <li>Withdraw consent for marketing communications.</li>
                <li>Request a copy of your data in a portable format.</li>
                <li>Object to certain processing activities.</li>
              </ul>
              <p>
                To exercise any of these rights, email{" "}
                <a href="mailto:privacy@jobboard.pk">privacy@jobboard.pk</a>.
              </p>
            </>
          ),
        },
        {
          heading: "5. Data Security",
          body: (
            <p>
              We use industry-standard measures such as encryption in transit,
              hashed passwords, and access controls to protect your data. No
              system is 100% secure, so we cannot guarantee absolute security —
              but we take this seriously and continually improve our practices.
            </p>
          ),
        },
        {
          heading: "6. Data Retention",
          body: (
            <p>
              We keep your information for as long as your account is active or
              as needed to provide services. When you delete your account, we
              remove or anonymize your personal data within a reasonable period,
              except where we must keep it to comply with the law.
            </p>
          ),
        },
        {
          heading: "7. Children's Privacy",
          body: (
            <p>
              JobBoard is not intended for children under 13. We do not
              knowingly collect personal information from children. If you
              believe a child has provided us with personal data, contact us so
              we can delete it.
            </p>
          ),
        },
        {
          heading: "8. Changes to This Policy",
          body: (
            <p>
              We may update this policy from time to time. When we do, we'll
              change the "Last updated" date at the top of this page. Continued
              use of JobBoard after changes means you accept the updated policy.
            </p>
          ),
        },
        {
          heading: "9. Contact Us",
          body: (
            <p>
              Questions? Reach us at{" "}
              <a href="mailto:privacy@jobboard.pk">privacy@jobboard.pk</a> or
              through our <a href="/contact">contact page</a>.
            </p>
          ),
        },
      ]}
    />
  );
}
