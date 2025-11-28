import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PreviewProps {
  content: string;
}

export function Preview({ content }: PreviewProps) {
  return (
    <div 
      className="h-full overflow-auto p-6"
      style={{ backgroundColor: "var(--color-bg-primary)" }}
    >
      <div className="max-w-3xl mx-auto markdown-preview">
        <Markdown remarkPlugins={[remarkGfm]}>
          {content || "*Start writing...*"}
        </Markdown>
      </div>
    </div>
  );
}

