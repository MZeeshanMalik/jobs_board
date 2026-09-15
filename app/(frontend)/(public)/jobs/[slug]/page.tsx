// app/jobs/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import JobDetailClient from "./job-detail-client";
import { fetchJobBySlug } from "@/lib/api/jobs";
import { jobKeys } from "@/lib/api/query-keys";
import { extractPlainText } from "@/lib/job-utils";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await fetchJobBySlug(slug).catch(() => null);

  if (!job) {
    return {
      title: "Job Not Found",
      description: "The job you are looking for does not exist.",
    };
  }

  const description =
    job.metaDescription ||
    extractPlainText(job.contentJson, 155) ||
    `${job.title} at ${job.companyName}.`;

  return {
    title: `${job.title} at ${job.companyName}`,
    description,
    keywords: [job.title, job.companyName, ...job.skills].filter(Boolean),
    alternates: { canonical: `/jobs/${job.slug}` },
    openGraph: {
      title: `${job.title} at ${job.companyName}`,
      description,
      type: "article",
      url: `/jobs/${job.slug}`,
      ...(job.companyLogoUrl ? { images: [job.companyLogoUrl] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${job.title} at ${job.companyName}`,
      description,
    },
  };
}

export default async function JobDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const queryClient = new QueryClient();

  const job = await queryClient.fetchQuery({
    queryKey: jobKeys.detail(slug),
    queryFn: () => fetchJobBySlug(slug),
  });

  if (!job) notFound();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <JobDetailClient slug={slug} initialJob={job} />
    </HydrationBoundary>
  );
}
