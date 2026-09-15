// JobArticleEditor.tsx
"use client";

import { useCallback, useState } from "react";
import type { JSX } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import type { InitialConfigType } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { $getRoot, type EditorState } from "lexical";

import theme from "./theme";
import { editorNodes } from "./node";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import TableColumnResizePlugin from "./plugins/TableColumnResizePlugin";
import "./editor.css";

function onError(error: Error): void {
  console.error("Lexical error:", error);
}

export interface JobArticleEditorProps {
  /** Stringified Lexical JSON, for editing an existing article */
  initialState?: string;
  /** Called with the latest stringified Lexical JSON on every change */
  onSave?: (jsonString: string) => void;
}

export default function JobArticleEditor({
  initialState,
  onSave,
}: JobArticleEditorProps): JSX.Element {
  const [charCount, setCharCount] = useState(0);

  const initialConfig: InitialConfigType = {
    namespace: "JobArticleEditor",
    theme,
    onError,
    nodes: editorNodes,
    editorState: initialState || undefined,
  };

  const handleChange = useCallback(
    (editorState: EditorState) => {
      editorState.read(() => {
        const root = $getRoot();
        setCharCount(root.getTextContent().length);
      });
      const json = JSON.stringify(editorState.toJSON());
      onSave?.(json);
    },
    [onSave],
  );

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-shell">
        <ToolbarPlugin />
        <div className="editor-container">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="editor-input" spellCheck={true} />
            }
            placeholder={
              <div className="editor-placeholder">
                Write the job article here… use ## for headings, ** for bold,
                etc.
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <AutoLinkPlugin />
          <TablePlugin
            hasCellMerge
            hasCellBackgroundColor
            hasHorizontalScroll
          />
          <TableColumnResizePlugin />
          <TabIndentationPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <OnChangePlugin onChange={handleChange} ignoreSelectionChange />
        </div>
        <div className="editor-footer">
          <span>{charCount} characters</span>
        </div>
      </div>
    </LexicalComposer>
  );
}
