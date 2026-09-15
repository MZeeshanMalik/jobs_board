// components/rich-text-renderer.tsx
import { JSX, ReactNode } from "react";

type LexicalNode = {
  type?: string;
  text?: string;
  format?: number | string;
  tag?: string;
  url?: string;
  listType?: string;
  children?: LexicalNode[];
  root?: LexicalNode;
  [key: string]: unknown;
};

const FORMAT_BOLD = 1;
const FORMAT_ITALIC = 2;

function renderText(node: LexicalNode): ReactNode {
  const text = node.text ?? "";
  const format = typeof node.format === "number" ? node.format : 0;

  let element: ReactNode = text;
  if (format & FORMAT_BOLD) element = <strong>{element}</strong>;
  if (format & FORMAT_ITALIC) element = <em>{element}</em>;
  return element;
}

function renderNode(
  node: LexicalNode | null | undefined,
  key: string,
): ReactNode {
  if (!node || typeof node !== "object") return null;

  switch (node.type) {
    case "text":
      return <span key={key}>{renderText(node)}</span>;

    case "linebreak":
      return <br key={key} />;

    case "paragraph":
      return (
        <p key={key} className="text-gray-700 leading-relaxed mb-4">
          {node.children?.map((c, i) => renderNode(c, `${key}-${i}`))}
        </p>
      );

    case "heading": {
      const tag = (node.tag ?? "h2") as keyof JSX.IntrinsicElements;
      const classes: Record<string, string> = {
        h1: "text-2xl font-bold text-gray-900 mt-8 mb-4",
        h2: "text-xl font-semibold text-gray-900 mt-8 mb-3",
        h3: "text-lg font-semibold text-gray-900 mt-6 mb-3",
        h4: "text-base font-semibold text-gray-900 mt-4 mb-2",
        h5: "text-sm font-semibold text-gray-900 mt-4 mb-2",
        h6: "text-sm font-semibold text-gray-900 mt-4 mb-2",
      };
      const Tag = tag;
      return (
        <Tag key={key} className={classes[tag] ?? classes.h2}>
          {node.children?.map((c, i) => renderNode(c, `${key}-${i}`))}
        </Tag>
      );
    }

    case "list": {
      const Tag = node.listType === "number" ? "ol" : "ul";
      const listClass =
        node.listType === "number"
          ? "list-decimal list-inside space-y-1.5 mb-4 text-gray-700 pl-2"
          : "list-disc list-inside space-y-1.5 mb-4 text-gray-700 pl-2";
      return (
        <Tag key={key} className={listClass}>
          {node.children?.map((c, i) => renderNode(c, `${key}-${i}`))}
        </Tag>
      );
    }

    case "listitem":
      return (
        <li key={key} className="leading-relaxed">
          {node.children?.map((c, i) => renderNode(c, `${key}-${i}`))}
        </li>
      );

    case "quote":
      return (
        <blockquote
          key={key}
          className="border-l-4 border-rose-300 pl-4 italic text-gray-600 my-4"
        >
          {node.children?.map((c, i) => renderNode(c, `${key}-${i}`))}
        </blockquote>
      );

    case "link": {
      const safe = isValidHttpUrl(node.url);
      if (!safe) {
        return (
          <span key={key} className="text-gray-700">
            {node.children?.map((c, i) => renderNode(c, `${key}-${i}`))}
          </span>
        );
      }
      return (
        <a
          key={key}
          href={node.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="text-rose-600 hover:text-rose-700 underline underline-offset-2"
        >
          {node.children?.map((c, i) => renderNode(c, `${key}-${i}`))}
        </a>
      );
    }

    case "root":
      return (
        <div key={key}>
          {node.children?.map((c, i) => renderNode(c, `${key}-${i}`))}
        </div>
      );

    default: {
      if (node.children) {
        return (
          <div key={key}>
            {node.children.map((c, i) => renderNode(c, `${key}-${i}`))}
          </div>
        );
      }
      // Last resort — render text if present
      if (typeof node.text === "string" && node.text.length > 0) {
        return <span key={key}>{node.text}</span>;
      }
      return null;
    }
  }
}

function isValidHttpUrl(value?: string): boolean {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

interface RichTextRendererProps {
  contentJson: string;
}

export default function RichTextRenderer({
  contentJson,
}: RichTextRendererProps) {
  if (!contentJson) return null;

  let parsed: LexicalNode | null = null;
  try {
    let value: unknown = JSON.parse(contentJson);
    if (typeof value === "string") value = JSON.parse(value);
    parsed = value as LexicalNode;
  } catch (err) {
    console.error("[RichTextRenderer] parse failed:", err);
    return null;
  }

  if (!parsed) return null;

  // 👇 THE FIX: unwrap `{ root: {...} }`
  const top = parsed.root ?? parsed;

  return <div className="prose-custom">{renderNode(top, "root")}</div>;
}
