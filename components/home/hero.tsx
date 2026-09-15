export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-pink-50 via-pink-50/60 to-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-rose-200/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-pink-200/50 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-rose-700 ring-1 ring-rose-200 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-2" />
            Trusted by thousands across Pakistan
          </span>

          <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
            Find Your Dream Job in{" "}
            <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Pakistan
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the latest job opportunities from top companies across
            Pakistan.
          </p>
        </div>

        <form
          className="mt-8 sm:mt-10 max-w-4xl mx-auto"
          role="search"
          aria-label="Job search"
          action="/jobs"
          method="get"
        >
          <div className="bg-white rounded-2xl shadow-lg shadow-rose-100/50 border border-pink-100 p-2 sm:p-3">
            <div className="flex flex-col lg:flex-row gap-2 lg:gap-3">
              {/* Keyword */}
              <div className="relative flex-1">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-400 pointer-events-none"
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
                  name="q"
                  placeholder="Search jobs, companies, or skills"
                  aria-label="Search jobs"
                  className="w-full pl-10 pr-3 py-3 text-sm sm:text-base rounded-xl bg-pink-50/50 border border-transparent focus:border-rose-300 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:outline-none placeholder:text-gray-400 transition-colors"
                />
              </div>

              {/* Location */}
              <div className="relative lg:w-64">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <input
                  type="text"
                  name="city"
                  placeholder="City or location"
                  aria-label="City or location"
                  className="w-full pl-10 pr-3 py-3 text-sm sm:text-base rounded-xl bg-pink-50/50 border border-transparent focus:border-rose-300 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:outline-none placeholder:text-gray-400 transition-colors"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-rose-600 text-white font-medium text-sm sm:text-base hover:bg-rose-700 active:bg-rose-800 transition-colors shadow-sm shadow-rose-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 whitespace-nowrap"
              >
                <svg
                  className="w-4 h-4"
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
                Search Jobs
              </button>
            </div>
          </div>

          {/* Quick tags */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-gray-500 mr-1">Popular:</span>
            {["Remote", "Engineering", "Design", "Marketing", "Lahore"].map(
              (tag) => (
                <a
                  key={tag}
                  href={`/jobs?q=${encodeURIComponent(tag)}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-700 border border-pink-100 hover:border-rose-300 hover:text-rose-600 transition-colors"
                >
                  {tag}
                </a>
              ),
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
