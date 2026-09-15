// plugins/TableColumnResizePlugin.tsx
"use client";

import { useEffect, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNearestNodeFromDOMNode } from "lexical";
import { $isTableCellNode, $isTableNode, TableCellNode } from "@lexical/table";

const MIN_COLUMN_WIDTH = 60;

/**
 * Adds a draggable resize handle to the right edge of every <th>/<td> in
 * every table so columns can be resized by dragging. Persists the width on
 * TableCellNode so it round-trips through save/load (editorState.toJSON()).
 *
 * This has no equivalent shipped in @lexical/react — Lexical's official
 * Playground implements the same idea inline, so we replicate the pattern
 * here rather than relying on a package export that doesn't exist.
 */
export default function TableColumnResizePlugin(): null {
  const [editor] = useLexicalComposerContext();
  const draggingRef = useRef<{
    cellKey: string;
    tableKey: string;
    columnIndex: number;
    startX: number;
    startWidth: number;
    currentWidth: number;
  } | null>(null);

  useEffect(() => {
    const rootElement = editor.getRootElement();
    if (!rootElement) return;

    const handles: HTMLDivElement[] = [];

    const attachHandles = () => {
      // Clear any stale handles from a previous render pass
      handles.forEach((h) => h.remove());
      handles.length = 0;

      const tables = rootElement.querySelectorAll("table");
      tables.forEach((table) => {
        const firstRowCells = table.querySelectorAll(
          "tr:first-child > th, tr:first-child > td",
        );
        firstRowCells.forEach((cell, columnIndex) => {
          const cellEl = cell as HTMLElement;
          if (getComputedStyle(cellEl).position === "static") {
            cellEl.style.position = "relative";
          }

          const handle = document.createElement("div");
          handle.setAttribute("data-resize-handle", "true");
          handle.style.position = "absolute";
          handle.style.top = "0";
          handle.style.right = "-3px";
          handle.style.width = "6px";
          handle.style.height = "100%";
          handle.style.cursor = "col-resize";
          handle.style.zIndex = "10";
          handle.style.userSelect = "none";

          handle.addEventListener("mouseenter", () => {
            handle.style.background = "rgba(37, 99, 235, 0.4)";
          });
          handle.addEventListener("mouseleave", () => {
            if (!draggingRef.current) handle.style.background = "transparent";
          });

          handle.addEventListener("mousedown", (e) => {
            e.preventDefault();
            e.stopPropagation();

            editor.getEditorState().read(() => {
              const cellNode = $getNearestNodeFromDOMNode(cellEl);
              if (!cellNode || !$isTableCellNode(cellNode)) return;
              const tableNode = cellNode.getParents().find($isTableNode);
              if (!tableNode) return;

              draggingRef.current = {
                cellKey: cellNode.getKey(),
                tableKey: tableNode.getKey(),
                columnIndex,
                startX: e.clientX,
                startWidth: cellEl.getBoundingClientRect().width,
                currentWidth: cellEl.getBoundingClientRect().width,
              };
            });

            handle.style.background = "rgba(37, 99, 235, 0.6)";
          });

          cellEl.appendChild(handle);
          handles.push(handle);
        });
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const dragging = draggingRef.current;
      if (!dragging) return;

      const deltaX = e.clientX - dragging.startX;
      const newWidth = Math.max(MIN_COLUMN_WIDTH, dragging.startWidth + deltaX);
      dragging.currentWidth = newWidth;

      // During drag: update the DOM directly for instant, smooth visual feedback.
      // We deliberately do NOT call editor.update() here — doing so on every
      // mousemove (which fires dozens of times/sec) floods Lexical's undo
      // history and reconciliation loop, and would also re-trigger
      // registerUpdateListener → attachHandles(), tearing down the handle
      // mid-drag. The actual node width is committed once, on mouseup.
      const tables = rootElement.querySelectorAll("table");
      tables.forEach((tableEl) => {
        const rows = tableEl.querySelectorAll("tr");
        rows.forEach((row) => {
          const cell = row.children[dragging.columnIndex] as
            | HTMLElement
            | undefined;
          if (cell) {
            cell.style.width = `${newWidth}px`;
          }
        });
      });
    };

    const handleMouseUp = () => {
      const dragging = draggingRef.current;
      if (!dragging) return;

      const finalWidth = dragging.currentWidth ?? dragging.startWidth;

      // Commit once, to the Lexical node — this is what persists in
      // editorState.toJSON() and survives save/reload.
      editor.update(() => {
        const rootTables = rootElement.querySelectorAll("table");
        rootTables.forEach((tableEl) => {
          const rows = tableEl.querySelectorAll("tr");
          rows.forEach((row) => {
            const cell = row.children[dragging.columnIndex] as
              | HTMLElement
              | undefined;
            if (!cell) return;
            const node = $getNearestNodeFromDOMNode(cell);
            if (node && $isTableCellNode(node)) {
              const tableNode = node.getParents().find($isTableNode);
              if (tableNode && tableNode.getKey() === dragging.tableKey) {
                (node as TableCellNode).setWidth(finalWidth);
              }
            }
          });
        });
      });

      draggingRef.current = null;
      handles.forEach((h) => (h.style.background = "transparent"));
    };

    // Rebuild handles whenever the editor content changes (tables added/removed/edited),
    // but NOT while actively dragging — width updates from handleMouseMove also go through
    // editor.update(), which would otherwise trigger this listener and tear down/rebuild the
    // very handle the user has their mouse down on mid-drag, breaking the drag.
    const unregister = editor.registerUpdateListener(() => {
      if (draggingRef.current) return;
      requestAnimationFrame(attachHandles);
    });

    attachHandles();
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      unregister();
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      handles.forEach((h) => h.remove());
    };
  }, [editor]);

  return null;
}
