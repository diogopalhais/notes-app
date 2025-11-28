import { useEffect, useRef, useCallback } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from "@codemirror/view";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { syntaxHighlighting, HighlightStyle } from "@codemirror/language";
import { tags } from "@lezer/highlight";

// Custom dark theme highlighting
const darkHighlightStyle = HighlightStyle.define([
  { tag: tags.heading1, color: "#fafafa", fontWeight: "bold", fontSize: "1.5em" },
  { tag: tags.heading2, color: "#fafafa", fontWeight: "bold", fontSize: "1.3em" },
  { tag: tags.heading3, color: "#fafafa", fontWeight: "bold", fontSize: "1.1em" },
  { tag: tags.heading, color: "#fafafa", fontWeight: "bold" },
  { tag: tags.strong, color: "#fafafa", fontWeight: "bold" },
  { tag: tags.emphasis, color: "#fafafa", fontStyle: "italic" },
  { tag: tags.strikethrough, color: "#6b6b6b", textDecoration: "line-through" },
  { tag: tags.link, color: "#3b82f6" },
  { tag: tags.url, color: "#3b82f6" },
  { tag: tags.monospace, color: "#22c55e", fontFamily: "var(--font-mono)" },
  { tag: tags.quote, color: "#a1a1a1", fontStyle: "italic" },
  { tag: tags.list, color: "#a1a1a1" },
  { tag: tags.meta, color: "#6b6b6b" },
  { tag: tags.processingInstruction, color: "#6b6b6b" },
]);

// Custom theme
const darkTheme = EditorView.theme({
  "&": {
    backgroundColor: "transparent",
    color: "#fafafa",
  },
  ".cm-content": {
    caretColor: "#3b82f6",
    fontFamily: "var(--font-mono)",
  },
  ".cm-cursor": {
    borderLeftColor: "#3b82f6",
  },
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
    backgroundColor: "#2a4a7a",
  },
  ".cm-activeLine": {
    backgroundColor: "#1a1a1a",
  },
  ".cm-gutters": {
    backgroundColor: "transparent",
    color: "#6b6b6b",
    border: "none",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "transparent",
    color: "#a1a1a1",
  },
});

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  onSave?: () => void;
}

export function Editor({ content, onChange, onSave }: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  const handleChange = useCallback((update: { state: EditorState; docChanged: boolean }) => {
    if (update.docChanged) {
      onChange(update.state.doc.toString());
    }
  }, [onChange]);

  useEffect(() => {
    if (!editorRef.current) return;

    const customKeymap = keymap.of([
      {
        key: "Mod-s",
        run: () => {
          onSave?.();
          return true;
        },
      },
    ]);

    const state = EditorState.create({
      doc: content,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        history(),
        markdown({
          base: markdownLanguage,
          codeLanguages: languages,
        }),
        syntaxHighlighting(darkHighlightStyle),
        darkTheme,
        keymap.of([...defaultKeymap, ...historyKeymap]),
        customKeymap,
        EditorView.updateListener.of(handleChange),
        EditorView.lineWrapping,
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, []); // Only run once on mount

  // Update content when it changes externally
  useEffect(() => {
    if (viewRef.current) {
      const currentContent = viewRef.current.state.doc.toString();
      if (currentContent !== content) {
        viewRef.current.dispatch({
          changes: {
            from: 0,
            to: currentContent.length,
            insert: content,
          },
        });
      }
    }
  }, [content]);

  return (
    <div 
      ref={editorRef} 
      className="h-full overflow-auto"
      style={{ backgroundColor: "var(--color-bg-primary)" }}
    />
  );
}

