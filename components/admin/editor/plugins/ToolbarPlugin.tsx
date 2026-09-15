// plugins/ToolbarPlugin.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import type { JSX } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  $setSelection,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  $createParagraphNode,
  type TextFormatType,
  type LexicalNode,
  type RangeSelection,
} from "lexical";
import {
  $isHeadingNode,
  $createHeadingNode,
  $createQuoteNode,
  type HeadingTagType,
} from "@lexical/rich-text";
import {
  $isListNode,
  ListNode,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { $setBlocksType } from "@lexical/selection";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import { TOGGLE_LINK_COMMAND, $isLinkNode } from "@lexical/link";
import {
  INSERT_TABLE_COMMAND,
  $getTableCellNodeFromLexicalNode,
  $getTableNodeFromLexicalNodeOrThrow,
  $insertTableRowAtSelection,
  $insertTableColumnAtSelection,
  $deleteTableRowAtSelection,
  $deleteTableColumnAtSelection,
  TableCellNode,
} from "@lexical/table";
import { $createCodeNode } from "@lexical/code";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
  Table as TableIcon,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";
import { $createImageNode } from "../nodes/ImageNode";

const LowPriority = 1;

type BlockType =
  | "paragraph"
  | "h1"
  | "h2"
  | "h3"
  | "quote"
  | "code"
  | "bullet"
  | "number"
  | string;

function getSelectedNode(selection: RangeSelection): LexicalNode {
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) return anchorNode;
  const isBackward = selection.isBackward();
  return isBackward ? focusNode : anchorNode;
}

export default function ToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const [blockType, setBlockType] = useState<BlockType>("paragraph");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [activeCell, setActiveCell] = useState<TableCellNode | null>(null);
  const [showTableInsertPanel, setShowTableInsertPanel] = useState(false);
  const [tableRows, setTableRows] = useState("3");
  const [tableCols, setTableCols] = useState("3");

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsCode(selection.hasFormat("code"));

      const node = getSelectedNode(selection);
      const parent = node.getParent();
      setIsLink($isLinkNode(parent) || $isLinkNode(node));

      const cellNode = $getTableCellNodeFromLexicalNode(node);
      setActiveCell(cellNode);

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode,
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          setBlockType(type);
        }
      }
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => updateToolbar());
      }),
      editor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority,
      ),
    );
  }, [editor, updateToolbar]);

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
    } else {
      formatParagraph();
    }
  };

  const formatBulletList = () => {
    if (blockType !== "bullet") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== "number") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    } else {
      formatParagraph();
    }
  };

  const formatCodeBlock = () => {
    if (blockType !== "code") {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createCodeNode());
        }
      });
    } else {
      formatParagraph();
    }
  };

  const applyTextFormat = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const insertLink = useCallback(() => {
    if (isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
      return;
    }

    // Capture the selection BEFORE window.prompt() steals focus —
    // prompt() blocks the main thread and the editor loses its selection,
    // so we must read it now and re-apply it after the prompt resolves.
    let savedSelection: RangeSelection | null = null;
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        savedSelection = selection.clone();
      }
    });

    if (!savedSelection) {
      window.alert("Select some text first, then click the link button.");
      return;
    }

    const url = window.prompt("Enter URL:", "https://");
    if (!url) return;

    editor.update(() => {
      if (savedSelection) {
        $setSelection(savedSelection);
      }
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
    });
  }, [editor, isLink]);

  const insertTable = () => {
    // No window.prompt() here — some browsers/environments silently suppress
    // native dialogs (auto-block after repeated calls, or the page has other
    // scripts triggering dialogs), which makes prompt() unreliable. Instead
    // we toggle a small inline panel with real <input> fields.
    setShowTableInsertPanel((v) => !v);
  };

  const confirmInsertTable = () => {
    const rows = Math.max(1, Math.min(50, parseInt(tableRows, 10) || 3));
    const columns = Math.max(1, Math.min(20, parseInt(tableCols, 10) || 3));

    editor.dispatchCommand(INSERT_TABLE_COMMAND, {
      columns: String(columns),
      rows: String(rows),
      includeHeaders: true,
    });

    setShowTableInsertPanel(false);
  };

  const insertImage = () => {
    const url = window.prompt("Image URL:");
    if (!url) return;
    const altText =
      window.prompt("Alt text (for accessibility/SEO):", "") || "";
    editor.update(() => {
      const imageNode = $createImageNode({ src: url, altText });
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.insertNodes([imageNode]);
      }
    });
  };

  const addRow = () => editor.update(() => $insertTableRowAtSelection(true));
  const removeRow = () => editor.update(() => $deleteTableRowAtSelection());
  const addColumn = () =>
    editor.update(() => $insertTableColumnAtSelection(true));
  const removeColumn = () =>
    editor.update(() => $deleteTableColumnAtSelection());
  const removeTable = () => {
    editor.update(() => {
      if (!activeCell) return;
      const tableNode = $getTableNodeFromLexicalNodeOrThrow(activeCell);
      tableNode.remove();
    });
  };

  const CELL_COLORS: Array<{ label: string; value: string | null }> = [
    { label: "None", value: null },
    { label: "Yellow", value: "#fef9c3" },
    { label: "Green", value: "#dcfce7" },
    { label: "Blue", value: "#dbeafe" },
    { label: "Pink", value: "#fce7f3" },
    { label: "Gray", value: "#f3f4f6" },
  ];

  const setCellColor = (color: string | null) => {
    editor.update(() => {
      activeCell?.setBackgroundColor(color);
    });
  };

  return (
    <>
      <div className="toolbar" ref={toolbarRef}>
        <button
          type="button"
          className="toolbar-item"
          disabled={!canUndo}
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
          aria-label="Undo"
        >
          <Undo2 size={18} />
        </button>
        <button
          type="button"
          className="toolbar-item"
          disabled={!canRedo}
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
          aria-label="Redo"
        >
          <Redo2 size={18} />
        </button>

        <span className="divider" />

        <button
          type="button"
          className="toolbar-item"
          onClick={formatParagraph}
          aria-label="Paragraph"
        >
          <Pilcrow size={18} />
        </button>
        <button
          type="button"
          className="toolbar-item"
          onClick={() => formatHeading("h1")}
          aria-label="H1"
        >
          <Heading1 size={18} />
        </button>
        <button
          type="button"
          className="toolbar-item"
          onClick={() => formatHeading("h2")}
          aria-label="H2"
        >
          <Heading2 size={18} />
        </button>
        <button
          type="button"
          className="toolbar-item"
          onClick={() => formatHeading("h3")}
          aria-label="H3"
        >
          <Heading3 size={18} />
        </button>

        <span className="divider" />

        <button
          type="button"
          className={"toolbar-item " + (isBold ? "active" : "")}
          onClick={() => applyTextFormat("bold")}
          aria-label="Bold"
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          className={"toolbar-item " + (isItalic ? "active" : "")}
          onClick={() => applyTextFormat("italic")}
          aria-label="Italic"
        >
          <Italic size={18} />
        </button>
        <button
          type="button"
          className={"toolbar-item " + (isUnderline ? "active" : "")}
          onClick={() => applyTextFormat("underline")}
          aria-label="Underline"
        >
          <Underline size={18} />
        </button>
        <button
          type="button"
          className={"toolbar-item " + (isStrikethrough ? "active" : "")}
          onClick={() => applyTextFormat("strikethrough")}
          aria-label="Strikethrough"
        >
          <Strikethrough size={18} />
        </button>
        <button
          type="button"
          className={"toolbar-item " + (isCode ? "active" : "")}
          onClick={() => applyTextFormat("code")}
          aria-label="Inline code"
        >
          <Code size={18} />
        </button>
        <button
          type="button"
          className={"toolbar-item " + (isLink ? "active" : "")}
          onClick={insertLink}
          aria-label="Insert link"
        >
          <LinkIcon size={18} />
        </button>

        <span className="divider" />

        <button
          type="button"
          className="toolbar-item"
          onClick={formatBulletList}
          aria-label="Bullet list"
        >
          <List size={18} />
        </button>
        <button
          type="button"
          className="toolbar-item"
          onClick={formatNumberedList}
          aria-label="Numbered list"
        >
          <ListOrdered size={18} />
        </button>
        <button
          type="button"
          className="toolbar-item"
          onClick={formatQuote}
          aria-label="Quote"
        >
          <Quote size={18} />
        </button>
        <button
          type="button"
          className="toolbar-item"
          onClick={formatCodeBlock}
          aria-label="Code block"
        >
          <Code size={18} />
        </button>

        <span className="divider" />

        <button
          type="button"
          className={"toolbar-item " + (showTableInsertPanel ? "active" : "")}
          onClick={insertTable}
          aria-label="Insert table"
          title="Insert table"
        >
          <TableIcon size={18} />
        </button>
        <button
          type="button"
          className="toolbar-item"
          onClick={insertImage}
          aria-label="Insert image"
        >
          <ImageIcon size={18} />
        </button>
      </div>

      {showTableInsertPanel && (
        <div className="toolbar table-toolbar">
          <span className="table-toolbar-label">Insert table —</span>

          <label className="table-toolbar-inline-label">
            Rows
            <input
              type="number"
              min={1}
              max={50}
              value={tableRows}
              onChange={(e) => setTableRows(e.target.value)}
              className="table-toolbar-input"
            />
          </label>

          <label className="table-toolbar-inline-label">
            Columns
            <input
              type="number"
              min={1}
              max={20}
              value={tableCols}
              onChange={(e) => setTableCols(e.target.value)}
              className="table-toolbar-input"
            />
          </label>

          <button
            type="button"
            onClick={confirmInsertTable}
            className="table-toolbar-confirm-btn"
          >
            Insert
          </button>
          <button
            type="button"
            onClick={() => setShowTableInsertPanel(false)}
            className="toolbar-item"
            aria-label="Cancel"
            title="Cancel"
          >
            ✕
          </button>
        </div>
      )}

      {activeCell && (
        <div className="toolbar table-toolbar">
          <span className="table-toolbar-label">Table:</span>

          <button
            type="button"
            className="toolbar-item"
            onClick={addRow}
            aria-label="Add row below"
            title="Add row below"
          >
            <Plus size={14} />
            <span className="table-toolbar-text">Row</span>
          </button>
          <button
            type="button"
            className="toolbar-item"
            onClick={removeRow}
            aria-label="Remove row"
            title="Remove current row"
          >
            <Minus size={14} />
            <span className="table-toolbar-text">Row</span>
          </button>

          <span className="divider" />

          <button
            type="button"
            className="toolbar-item"
            onClick={addColumn}
            aria-label="Add column right"
            title="Add column right"
          >
            <Plus size={14} />
            <span className="table-toolbar-text">Col</span>
          </button>
          <button
            type="button"
            className="toolbar-item"
            onClick={removeColumn}
            aria-label="Remove column"
            title="Remove current column"
          >
            <Minus size={14} />
            <span className="table-toolbar-text">Col</span>
          </button>

          <span className="divider" />

          <span className="table-toolbar-label">Color:</span>
          {CELL_COLORS.map((c) => (
            <button
              key={c.label}
              type="button"
              title={c.label}
              onClick={() => setCellColor(c.value)}
              className="table-color-swatch"
              style={{
                background: c.value || "#fff",
                backgroundImage:
                  c.value === null
                    ? "linear-gradient(45deg, transparent 45%, #f87171 45%, #f87171 55%, transparent 55%)"
                    : undefined,
              }}
            />
          ))}

          <span className="divider" />

          <button
            type="button"
            className="toolbar-item"
            onClick={removeTable}
            aria-label="Delete table"
            title="Delete table"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </>
  );
}
