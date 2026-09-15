// app/cookies/page.tsx
import type { Metadata } from "next";
import LegalLayout from "@/components/legal/legal-layout";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Learn how JobBoard uses cookies and similar technologies, and how you can control them. Simple and transparent cookie policy for our Pakistani job platform.",
  alternates: { canonical: "/cookies" },
  openGraph: {
    title: "Cookie Policy | JobBoard",
    description: "How JobBoard uses cookies and similar technologies.",
    type: "website",
    url: "/cookies",
  },
};

const UPDATED = "January 1, 2025";

export default function CookiesPage() {
  return (
    <LegalLayout
      title="Cookie Policy"
      updated={UPDATED}
      intro="Cookies help JobBoard run smoothly and improve your experience. This page explains what cookies we use, why, and how you can control them."
      sections={[
        {
          heading: "1. What Are Cookies?",
          body: (
            <p>
              Cookies are small text files stored on your device by websites you
              visit. They help sites remember your preferences, keep you logged
              in, and understand how people use the site. We also use similar
              technologies like <strong>localStorage</strong> and{" "}
              <strong>pixel tags</strong> — the rules below apply to those too.
            </p>
          ),
        },
        {
          heading: "2. Types of Cookies We Use",
          body: (
            <>
              <p>
                <strong>Essential cookies</strong> — required for the site to
                work. These handle login sessions, security tokens, and form
                submissions. You can't disable these without breaking the site.
              </p>
              <p>
                <strong>Preference cookies</strong> — remember your settings
                like language, city filter, or dark mode so you don't have to
                set them every visit.
              </p>
              <p>
                <strong>Analytics cookies</strong> — help us understand which
                pages are popular, where users drop off, and how to improve the
                experience. We use aggregated, non-identifying data.
              </p>
              <p>
                <strong>Marketing cookies</strong> — used (only with your
                consent) to show relevant ads on other sites and measure
                campaign performance.
              </p>
            </>
          ),
        },
        {
          heading: "3. Third-Party Cookies",
          body: (
            <>
              <p>
                Some cookies are set by trusted third parties we use, such as:
              </p>
              <ul>
                <li>Google Analytics — anonymous usage statistics.</li>
                <li>Payment processors — if you purchase a paid service.</li>
                <li>Embedded content — e.g. YouTube videos on job posts.</li>
              </ul>
              <p>
                These providers have their own privacy and cookie policies. We
                recommend reviewing them.
              </p>
            </>
          ),
        },
        {
          heading: "4. How Long Cookies Last",
          body: (
            <>
              <p>
                <strong>Session cookies</strong> — deleted when you close your
                browser.
              </p>
              <p>
                <strong>Persistent cookies</strong> — remain for a set period
                (usually up to 12 months) or until you delete them.
              </p>
            </>
          ),
        },
        {
          heading: "5. Managing Cookies",
          body: (
            <>
              <p>You can control or delete cookies in several ways:</p>
              <ul>
                <li>
                  Browser settings — most browsers let you block or delete
                  cookies. Look under "Privacy" or "Security".
                </li>
                <li>
                  Opt-out tools — for analytics, Google offers a browser add-on.
                </li>
                <li>
                  Incognito or private mode — prevents new cookies from being
                  stored after your session.
                </li>
              </ul>
              <p>
                Note: blocking essential cookies may prevent parts of JobBoard
                (like logging in) from working correctly.
              </p>
            </>
          ),
        },
        {
          heading: "6. Do Not Track",
          body: (
            <p>
              Some browsers send a "Do Not Track" signal. There's no standard
              for how sites should respond, so we currently do not alter our
              behavior in response to DNT signals. You can still control cookies
              via the methods above.
            </p>
          ),
        },
        {
          heading: "7. Changes to This Policy",
          body: (
            <p>
              We may update this Cookie Policy when we add or change
              technologies. Check the "Last updated" date at the top for the
              latest version.
            </p>
          ),
        },
        {
          heading: "8. Contact",
          body: (
            <p>
              Questions about cookies? Email{" "}
              <a href="mailto:privacy@jobboard.pk">privacy@jobboard.pk</a> or
              visit our <a href="/contact">contact page</a>.
            </p>
          ),
        },
      ]}
    />
  );
}
