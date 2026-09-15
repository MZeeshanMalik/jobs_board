// components/layout/navbar.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchJobs } from "@/lib/api/jobs";
import { jobKeys } from "@/lib/api/query-keys";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/jobs", label: "Jobs" },
  { href: "/about", label: "About" },
];

interface Suggestion {
  slug: string;
  title: string;
  location: string;
}

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false); // mobile menu
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounce input → 250ms
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 250);
    return () => clearTimeout(t);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // Suggestions query
  const { data: suggestions = [], isFetching } = useQuery({
    queryKey: jobKeys.list({
      q: debounced,
      limit: 6,
      status: "published",
      isActive: true,
    }),
    queryFn: () =>
      fetchJobs({
        q: debounced,
        limit: 6,
        status: "published",
        isActive: true,
      }),
    enabled: debounced.length >= 2,
    staleTime: 30_000,
    select: (res): Suggestion[] =>
      (res.jobs ?? []).map((j) => ({
        slug: j.slug,
        title: j.title,
        company: j.companyName,
        location:
          j.jobLocationType === "REMOTE"
            ? "Remote"
            : j.locations?.[0]
              ? `${j.locations[0].city}, ${j.locations[0].country}`
              : "",
      })),
  });

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = query.trim();
    setShowSuggestions(false);
    setOpen(false);
    if (q) router.push(`/jobs?q=${encodeURIComponent(q)}`);
    else router.push("/jobs");
  };

  const goToSuggestion = (s: Suggestion) => {
    setShowSuggestions(false);
    setQuery("");
    setOpen(false);
    router.push(`/jobs/${s.slug}`);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === "Enter") submit();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h <= 0 ? suggestions.length - 1 : h - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlight >= 0) goToSuggestion(suggestions[highlight]);
      else submit();
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <div className="flex items-center gap-3 h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-gray-900 hover:text-rose-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-md shrink-0"
            aria-label="JobBoard home"
          >
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 text-white text-sm font-bold">
              J
            </span>
            <span className="hidden sm:inline text-base lg:text-lg tracking-tight">
              Job<span className="text-rose-600">Board</span>
            </span>
          </Link>
          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1 shrink-0">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:text-rose-600 hover:bg-rose-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          {/* Desktop search */}
          <div
            ref={wrapperRef}
            className="hidden md:flex flex-1 max-w-xl relative"
          >
            <form
              onSubmit={submit}
              className="w-full"
              role="search"
              aria-label="Job search"
            >
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowSuggestions(true);
                    setHighlight(-1);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={onKeyDown}
                  placeholder="Search jobs, companies, or skills"
                  aria-label="Search jobs"
                  aria-autocomplete="list"
                  aria-expanded={showSuggestions}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-pink-50/60 border border-transparent focus:border-rose-300 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:outline-none placeholder:text-gray-400 transition-colors"
                />
              </div>
            </form>

            {/* Suggestions dropdown */}
            {showSuggestions && debounced.length >= 2 && (
              <div
                role="listbox"
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-pink-100 shadow-lg shadow-rose-100/40 overflow-hidden"
              >
                {isFetching && suggestions.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    Searching…
                  </div>
                ) : suggestions.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    No jobs found for{" "}
                    <span className="font-medium text-gray-700">
                      "{debounced}"
                    </span>
                  </div>
                ) : (
                  <ul className="max-h-80 overflow-y-auto">
                    {suggestions.map((s, i) => (
                      <li key={s.slug}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={i === highlight}
                          onMouseEnter={() => setHighlight(i)}
                          onClick={() => goToSuggestion(s)}
                          className={`w-full text-left px-4 py-2.5 flex items-start gap-3 transition-colors ${
                            i === highlight
                              ? "bg-rose-50"
                              : "hover:bg-rose-50/60"
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {s.title}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {s.location ? ` • ${s.location}` : ""}
                            </p>
                          </div>
                          <svg
                            className="w-4 h-4 text-rose-400 shrink-0 mt-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <button
                  type="button"
                  onClick={() => submit()}
                  className="w-full px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 border-t border-pink-100 text-left transition-colors"
                >
                  See all results for "{debounced}" →
                </button>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="md:hidden ml-auto inline-flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-rose-50 hover:text-rose-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            {open ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div id="mobile-menu" className="md:hidden pb-4">
            {/* Mobile search */}
            <form
              onSubmit={submit}
              role="search"
              aria-label="Job search"
              className="pt-2"
            >
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search jobs, companies, or skills"
                  aria-label="Search jobs"
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg bg-pink-50/60 border border-transparent focus:border-rose-300 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:outline-none placeholder:text-gray-400 transition-colors"
                />
              </div>
            </form>

            <ul className="flex flex-col gap-1 pt-3 mt-3 border-t border-gray-100">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
