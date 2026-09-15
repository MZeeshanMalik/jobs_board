// components/pagination.tsx
"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  total,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const go = (page: number) => {
    onPageChange(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-6 border-t border-gray-100"
      aria-label="Job listings pagination"
    >
      <p className="text-sm text-gray-600 order-2 sm:order-1">
        Showing{" "}
        <span className="font-medium text-gray-900">{startIndex + 1}</span> to{" "}
        <span className="font-medium text-gray-900">{endIndex}</span> of{" "}
        <span className="font-medium text-gray-900">{total}</span> jobs
      </p>

      <div className="order-1 sm:order-2 flex items-center gap-1">
        <PageBtn
          onClick={() => go(currentPage - 1)}
          disabled={currentPage === 1}
          label="Previous page"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </PageBtn>

        {pages.map((p, i) =>
          p === "..." ? (
            <span
              key={`e-${i}`}
              className="inline-flex items-center justify-center w-9 h-9 text-gray-400"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => go(p)}
              aria-current={currentPage === p ? "page" : undefined}
              aria-label={`Go to page ${p}`}
              className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${
                currentPage === p
                  ? "bg-rose-600 text-white shadow-sm"
                  : "border border-gray-200 text-gray-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
              }`}
            >
              {p}
            </button>
          ),
        )}

        <PageBtn
          onClick={() => go(currentPage + 1)}
          disabled={currentPage === totalPages}
          label="Next page"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </PageBtn>
      </div>
    </nav>
  );
}

function PageBtn({
  children,
  onClick,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 text-gray-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 disabled:hover:border-gray-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
    >
      {children}
    </button>
  );
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  const maxVisible = 5;
  const pages: (number | "...")[] = [];

  if (total <= maxVisible + 2) {
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }

  if (current <= 3) {
    for (let i = 1; i <= 4; i++) pages.push(i);
    pages.push("...");
    pages.push(total);
  } else if (current >= total - 2) {
    pages.push(1, "...");
    for (let i = total - 3; i <= total; i++) pages.push(i);
  } else {
    pages.push(1, "...");
    for (let i = current - 1; i <= current + 1; i++) pages.push(i);
    pages.push("...", total);
  }
  return pages;
}
