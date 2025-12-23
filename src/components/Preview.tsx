import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { isTauri } from "../hooks/useTauri";
import type { ComponentPropsWithoutRef } from "react";

interface PreviewProps {
  content: string;
}

// Custom link component that opens URLs in external browser
function ExternalLink({ href, children, ...props }: ComponentPropsWithoutRef<"a">) {
  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!href) return;
    
    // Only handle http/https links externally
    if (href.startsWith("http://") || href.startsWith("https://")) {
      e.preventDefault();
      
      if (isTauri()) {
        try {
          const { open } = await import("@tauri-apps/plugin-shell");
          await open(href);
        } catch {
          // Fallback if plugin not available
          window.open(href, "_blank", "noopener,noreferrer");
        }
      } else {
        window.open(href, "_blank", "noopener,noreferrer");
      }
    }
  };

  return (
    <a 
      href={href} 
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
}

export function Preview({ content }: PreviewProps) {
  return (
    <div 
      className="h-full overflow-auto p-6"
      style={{ backgroundColor: "var(--color-bg-primary)" }}
    >
      <div className="max-w-3xl mx-auto markdown-preview">
        <Markdown 
          remarkPlugins={[remarkGfm]}
          components={{
            a: ExternalLink
          }}
        >
          {content || "*Start writing...*"}
        </Markdown>
      </div>
    </div>
  );
}

