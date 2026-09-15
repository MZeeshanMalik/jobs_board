// components/jobs/LexicalRenderer.tsx
"use client";

import { useEffect, useRef } from "react";

interface LexicalRendererProps {
  content: string;
  className?: string;
}

export default function LexicalRenderer({
  content,
  className = "",
}: LexicalRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !content) return;

    try {
      const data = JSON.parse(content);
      const root = data.root || data;

      let html = "";

      if (root.children && Array.isArray(root.children)) {
        html = root.children.map((child: any) => renderNode(child)).join("");
      }

      containerRef.current.innerHTML = html;
    } catch (error) {
      console.error("Error rendering lexical content:", error);
      containerRef.current.innerHTML = `<p class="text-red-600">Error rendering content</p>`;
    }
  }, [content]);

  if (!content) {
    return <p className="text-gray-500">No description provided.</p>;
  }

  return <div ref={containerRef} className={className} />;
}

function renderNode(node: any): string {
  if (!node) return "";

  switch (node.type) {
    case "heading": {
      const tag = node.tag || "h2";
      const text = node.children?.map((c: any) => renderNode(c)).join("") || "";
      const size =
        tag === "h1"
          ? "text-4xl"
          : tag === "h2"
            ? "text-3xl"
            : tag === "h3"
              ? "text-2xl"
              : "text-xl";
      return `<${tag} class="${size} font-bold text-gray-900 mt-6 mb-3">${text}</${tag}>`;
    }

    case "paragraph": {
      const text = node.children?.map((c: any) => renderNode(c)).join("") || "";
      if (!text.trim()) return "";
      return `<p class="text-gray-600 leading-relaxed mb-4">${text}</p>`;
    }

    case "text": {
      return renderTextNode(node);
    }

    case "tab": {
      return "&nbsp;&nbsp;&nbsp;&nbsp;";
    }

    case "list": {
      const tag = node.listType === "number" ? "ol" : "ul";
      const items =
        node.children
          ?.map((child: any) => {
            const content =
              child.children?.map((c: any) => renderNode(c)).join("") || "";
            return `<li class="text-gray-600 mb-1">${content}</li>`;
          })
          .join("") || "";
      const listClass =
        node.listType === "number" ? "list-decimal" : "list-disc";
      return `<${tag} class="${listClass} pl-6 mb-4 space-y-1">${items}</${tag}>`;
    }

    case "listitem": {
      return node.children?.map((c: any) => renderNode(c)).join("") || "";
    }

    case "code": {
      const code = node.children?.map((c: any) => c.text || "").join("") || "";
      return `<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4"><code class="text-sm font-mono">${code}</code></pre>`;
    }

    // ✅ TABLE SUPPORT
    case "table": {
      const rows =
        node.children?.map((row: any) => renderNode(row)).join("") || "";
      return `<div class="overflow-x-auto mb-6">
        <table class="w-full border-collapse border border-gray-200">
          <tbody>${rows}</tbody>
        </table>
      </div>`;
    }

    case "tablerow": {
      const cells =
        node.children?.map((cell: any) => renderNode(cell)).join("") || "";
      return `<tr>${cells}</tr>`;
    }

    case "tablecell": {
      const content =
        node.children?.map((c: any) => renderNode(c)).join("") || "";

      // Determine if it's a header cell (headerState: 1, 2, or 3)
      const isHeader = node.headerState && node.headerState > 0;

      // Get cell attributes
      const colSpan = node.colSpan ? `colspan="${node.colSpan}"` : "";
      const rowSpan = node.rowSpan ? `rowspan="${node.rowSpan}"` : "";

      const tag = isHeader ? "th" : "td";
      const bgColor = node.backgroundColor
        ? `background-color: ${node.backgroundColor};`
        : "";
      const className = isHeader
        ? "bg-pink-50 text-gray-900 font-semibold p-3 border border-gray-200 text-left"
        : "text-gray-600 p-3 border border-gray-200";

      return `<${tag} ${colSpan} ${rowSpan} class="${className}" style="${bgColor}">${content}</${tag}>`;
    }

    case "quote": {
      const text = node.children?.map((c: any) => renderNode(c)).join("") || "";
      return `<blockquote class="border-l-4 border-pink-400 pl-4 py-2 my-4 bg-pink-50 rounded-r-lg text-pink-800">${text}</blockquote>`;
    }

    case "link": {
      const text = node.children?.map((c: any) => renderNode(c)).join("") || "";
      return `<a href="${node.url}" target="_blank" rel="noopener noreferrer" class="text-pink-600 hover:text-pink-700 underline">${text}</a>`;
    }

    case "image": {
      return `<img src="${node.src}" alt="${node.alt || ""}" class="max-w-full h-auto rounded-lg my-4" />`;
    }

    case "horizontalrule": {
      return `<hr class="my-8 border-t-2 border-gray-200" />`;
    }

    default: {
      // If node has children, process them
      if (node.children && Array.isArray(node.children)) {
        return node.children.map((child: any) => renderNode(child)).join("");
      }
      return "";
    }
  }
}

function renderTextNode(node: any): string {
  if (!node.text) return "";

  let text = node.text;

  // Apply formatting
  if (node.format === 1) text = `<strong>${text}</strong>`;
  if (node.format === 2) text = `<em>${text}</em>`;
  if (node.format === 3) text = `<strong><em>${text}</em></strong>`;
  if (node.format === 4) text = `<u>${text}</u>`;
  if (node.format === 8) text = `<s>${text}</s>`;

  return text;
}
