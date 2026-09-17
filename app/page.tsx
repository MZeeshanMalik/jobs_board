// app/page.tsx
import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Hero from "@/components/home/hero";
import FeaturedJobs from "@/components/home/featured-jobs";
import { fetchFeaturedJobs } from "@/lib/api/jobs";
import { homeJobKeys } from "@/lib/api/query-keys";

export const metadata: Metadata = {
  title: "Latest Jobs in Pakistan | Find Jobs & Career Opportunities",
  description:
    "Find the latest jobs in Pakistan from top companies. Explore private jobs, IT jobs, remote jobs, and career opportunities in Lahore, Karachi, Islamabad, and across Pakistan.",
  keywords: [
    "jobs in Pakistan",
    "Pakistani job board",
    "careers Pakistan",
    "remote jobs Pakistan",
    "Lahore jobs",
    "Karachi jobs",
    "Islamabad jobs",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Latest Jobs in Pakistan | Find Jobs & Career Opportunities",
    description:
      "Find the latest jobs in Pakistan from top companies. Explore private jobs, IT jobs, remote jobs, and career opportunities across Pakistan.",
    type: "website",
    url: "/",
  },
};

const FEATURED_LIMIT = 5;

export default async function HomePage() {
  const queryClient = new QueryClient();

  await queryClient
    .prefetchQuery({
      queryKey: homeJobKeys.featured(FEATURED_LIMIT),
      queryFn: () => fetchFeaturedJobs(FEATURED_LIMIT),
    })
    .catch(() => {
      // Fail soft — client will retry; page still renders
    });

  // SEO: ItemList of the top jobs on the home page
  const featured =
    queryClient.getQueryData<Awaited<ReturnType<typeof fetchFeaturedJobs>>>(
      homeJobKeys.featured(FEATURED_LIMIT),
    ) ?? [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: featured.slice(0, 5).map((job, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `/jobs/${job.slug}`,
      name: job.title,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main>
        <Hero />
        <HydrationBoundary state={dehydrate(queryClient)}>
          <FeaturedJobs />
        </HydrationBoundary>
      </main>
    </>
  );
}
