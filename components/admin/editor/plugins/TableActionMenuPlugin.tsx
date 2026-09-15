// plugins/TableActionMenuPlugin.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { JSX } from "react";
import { createPortal } from "react-dom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_LOW,
} from "lexical";
import {
  $getTableCellNodeFromLexicalNode,
  $getTableNodeFromLexicalNodeOrThrow,
  $getTableRowIndexFromTableCellNode,
  $getTableColumnIndexFromTableCellNode,
  $insertTableRowAtSelection,
  $insertTableColumnAtSelection,
  $deleteTableRowAtSelection,
  $deleteTableColumnAtSelection,
  TableCellNode,
} from "@lexical/table";
import { Plus, Trash2, Palette, MoreVertical } from "lucide-react";

const CELL_COLORS = [
  { label: "None", value: null },
  { label: "Yellow", value: "#fef9c3" },
  { label: "Green", value: "#dcfce7" },
  { label: "Blue", value: "#dbeafe" },
  { label: "Pink", value: "#fce7f3" },
  { label: "Gray", value: "#f3f4f6" },
];

/**
 * Renders a small ⋮ button in the corner of whichever table cell the caret is
 * currently in, opening a menu with row/column insert & delete and cell
 * background color. Position is recalculated on selection change and scroll.
 */
export default function TableActionMenuPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [activeCell, setActiveCell] = useState<TableCellNode | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [colorMenuOpen, setColorMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const updateMenuPosition = useCallback(
    (cellNode: TableCellNode | null) => {
      if (!cellNode) {
        setMenuPosition(null);
        return;
      }
      const cellDOM = editor.getElementByKey(cellNode.getKey());
      if (!cellDOM) {
        setMenuPosition(null);
        return;
      }
      const rect = cellDOM.getBoundingClientRect();
      setMenuPosition({
        top: rect.top + window.scrollY + 4,
        left: rect.right + window.scrollX - 26,
      });
    },
    [editor],
  );

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) {
            setActiveCell(null);
            updateMenuPosition(null);
            return;
          }
          const node = selection.anchor.getNode();
          const cellNode = $getTableCellNodeFromLexicalNode(node);
          setActiveCell(cellNode);
          updateMenuPosition(cellNode);
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => false,
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, updateMenuPosition]);

  // Reposition on scroll/resize since we use fixed-document coordinates
  useEffect(() => {
    const handle = () => {
      if (activeCell) {
        editor.getEditorState().read(() => updateMenuPosition(activeCell));
      }
    };
    window.addEventListener("scroll", handle, true);
    window.addEventListener("resize", handle);
    return () => {
      window.removeEventListener("scroll", handle, true);
      window.removeEventListener("resize", handle);
    };
  }, [activeCell, editor, updateMenuPosition]);

  // Close menu when clicking outside it
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setColorMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const runTableCommand = (fn: () => void) => {
    editor.update(fn);
    setMenuOpen(false);
    setColorMenuOpen(false);
  };

  const insertRowAbove = () =>
    runTableCommand(() => $insertTableRowAtSelection(false));
  const insertRowBelow = () =>
    runTableCommand(() => $insertTableRowAtSelection(true));
  const insertColLeft = () =>
    runTableCommand(() => $insertTableColumnAtSelection(false));
  const insertColRight = () =>
    runTableCommand(() => $insertTableColumnAtSelection(true));
  const deleteRow = () => runTableCommand(() => $deleteTableRowAtSelection());
  const deleteColumn = () =>
    runTableCommand(() => $deleteTableColumnAtSelection());

  const deleteTable = () =>
    runTableCommand(() => {
      if (!activeCell) return;
      const tableNode = $getTableNodeFromLexicalNodeOrThrow(activeCell);
      tableNode.remove();
    });

  const setCellColor = (color: string | null) =>
    runTableCommand(() => {
      if (!activeCell) return;
      activeCell.setBackgroundColor(color);
    });

  if (!activeCell || !menuPosition) return null;

  return createPortal(
    <div
      ref={menuRef}
      style={{
        position: "absolute",
        top: menuPosition.top,
        left: menuPosition.left,
        zIndex: 50,
      }}
    >
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Table cell options"
        style={{
          width: 20,
          height: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: 4,
          cursor: "pointer",
          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
        }}
      >
        <MoreVertical size={12} />
      </button>

      {menuOpen && (
        <div
          style={{
            marginTop: 4,
            background: "#fff",
            border: "1px solid #e2e2e2",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
            minWidth: 190,
            padding: 4,
            fontSize: 13,
          }}
        >
          <MenuItem
            icon={<Plus size={14} />}
            label="Insert row above"
            onClick={insertRowAbove}
          />
          <MenuItem
            icon={<Plus size={14} />}
            label="Insert row below"
            onClick={insertRowBelow}
          />
          <MenuItem
            icon={<Plus size={14} />}
            label="Insert column left"
            onClick={insertColLeft}
          />
          <MenuItem
            icon={<Plus size={14} />}
            label="Insert column right"
            onClick={insertColRight}
          />
          <Divider />
          <MenuItem
            icon={<Trash2 size={14} />}
            label="Delete row"
            onClick={deleteRow}
            danger
          />
          <MenuItem
            icon={<Trash2 size={14} />}
            label="Delete column"
            onClick={deleteColumn}
            danger
          />
          <MenuItem
            icon={<Trash2 size={14} />}
            label="Delete table"
            onClick={deleteTable}
            danger
          />
          <Divider />
          <div style={{ position: "relative" }}>
            <MenuItem
              icon={<Palette size={14} />}
              label="Background color"
              onClick={() => setColorMenuOpen((v) => !v)}
            />
            {colorMenuOpen && (
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  padding: "6px 10px",
                }}
              >
                {CELL_COLORS.map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    title={c.label}
                    onClick={() => setCellColor(c.value)}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      border: "1px solid #ccc",
                      background: c.value || "#fff",
                      cursor: "pointer",
                      backgroundImage:
                        c.value === null
                          ? "linear-gradient(45deg, transparent 45%, #f87171 45%, #f87171 55%, transparent 55%)"
                          : undefined,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: JSX.Element;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        width: "100%",
        padding: "6px 10px",
        background: "transparent",
        border: "none",
        borderRadius: 4,
        cursor: "pointer",
        textAlign: "left",
        fontSize: 13,
        color: danger ? "#dc2626" : "#1a1a1a",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {icon}
      {label}
    </button>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "#eee", margin: "4px 0" }} />;
}
