import { ReactNode } from "react";

type CalloutType = "info" | "warning" | "error" | "success" | "tip";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

const config: Record<
  CalloutType,
  {
    icon: string;
    label: string;
    classes: string;
    titleClass: string;
    borderClass: string;
  }
> = {
  info: {
    icon: "ℹ",
    label: "Info",
    classes: "bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100",
    titleClass: "text-blue-700 dark:text-blue-300",
    borderClass: "border-blue-400 dark:border-blue-600",
  },
  warning: {
    icon: "⚠",
    label: "Warning",
    classes:
      "bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-100",
    titleClass: "text-amber-700 dark:text-amber-300",
    borderClass: "border-amber-400 dark:border-amber-500",
  },
  error: {
    icon: "✕",
    label: "Error",
    classes: "bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-100",
    titleClass: "text-red-700 dark:text-red-300",
    borderClass: "border-red-400 dark:border-red-600",
  },
  success: {
    icon: "✓",
    label: "Success",
    classes:
      "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100",
    titleClass: "text-emerald-700 dark:text-emerald-300",
    borderClass: "border-emerald-400 dark:border-emerald-600",
  },
  tip: {
    icon: "💡",
    label: "Tip",
    classes:
      "bg-violet-50 dark:bg-violet-950/40 text-violet-900 dark:text-violet-100",
    titleClass: "text-violet-700 dark:text-violet-300",
    borderClass: "border-violet-400 dark:border-violet-600",
  },
};

export function Callout({ type = "info", title, children }: CalloutProps) {
  const { icon, label, classes, titleClass, borderClass } = config[type];
  const displayTitle = title ?? label;

  return (
    <aside
      role="note"
      aria-label={displayTitle}
      className={`
        my-6 flex gap-3 rounded-lg border-l-4 px-4 py-3.5 text-sm leading-relaxed
        ${classes} ${borderClass}
      `}
    >
      {/* Icon */}
      <span
        aria-hidden="true"
        className={`mt-0.5 shrink-0 text-base font-semibold ${titleClass}`}
      >
        {icon}
      </span>

      {/* Content */}
      <div className="min-w-0">
        <p className={`mb-1 font-semibold ${titleClass}`}>{displayTitle}</p>
        <div className="prose-sm [&>p]:m-0">{children}</div>
      </div>
    </aside>
  );
}
