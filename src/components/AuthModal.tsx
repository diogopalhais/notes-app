import { useState } from "react";

interface AuthModalProps {
  onGenerate: () => void;
  onSubmit: (id: string) => void;
}

export function AuthModal({ onGenerate, onSubmit }: AuthModalProps) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"choose" | "enter">("choose");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const trimmed = inputValue.trim();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    if (!uuidRegex.test(trimmed)) {
      setError("Invalid format. Please enter a valid UUID.");
      return;
    }
    
    onSubmit(trimmed);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ backgroundColor: "var(--color-bg-primary)" }}>
      <div 
        className="w-full max-w-md rounded-2xl p-8"
        style={{ backgroundColor: "var(--color-bg-secondary)", border: "1px solid var(--color-border)" }}
      >
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ backgroundColor: "var(--color-accent-muted)" }}
          >
            <svg className="w-8 h-8" style={{ color: "var(--color-accent)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold" style={{ color: "var(--color-text-primary)" }}>
            Notes
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            A minimal markdown notes app
          </p>
        </div>

        {mode === "choose" ? (
          <div className="space-y-4">
            <button
              onClick={onGenerate}
              className="w-full py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              style={{ 
                backgroundColor: "var(--color-accent)", 
                color: "white",
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--color-accent-hover)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--color-accent)"}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Start Fresh
            </button>
            
            <button
              onClick={() => setMode("enter")}
              className="w-full py-3 px-4 rounded-xl font-medium transition-colors"
              style={{ 
                backgroundColor: "var(--color-bg-tertiary)", 
                color: "var(--color-text-primary)",
                border: "1px solid var(--color-border)"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--color-bg-hover)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--color-bg-tertiary)"}
            >
              I have a secret key
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Enter your secret key
              </label>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setError("");
                }}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                className="w-full px-4 py-3 rounded-xl text-sm font-mono outline-none transition-colors"
                style={{ 
                  backgroundColor: "var(--color-bg-tertiary)",
                  color: "var(--color-text-primary)",
                  border: error ? "1px solid var(--color-error)" : "1px solid var(--color-border)"
                }}
                autoFocus
              />
              {error && (
                <p className="mt-2 text-sm" style={{ color: "var(--color-error)" }}>
                  {error}
                </p>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setMode("choose");
                  setInputValue("");
                  setError("");
                }}
                className="flex-1 py-3 px-4 rounded-xl font-medium transition-colors"
                style={{ 
                  backgroundColor: "var(--color-bg-tertiary)", 
                  color: "var(--color-text-primary)",
                  border: "1px solid var(--color-border)"
                }}
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-xl font-medium transition-colors"
                style={{ 
                  backgroundColor: "var(--color-accent)", 
                  color: "white",
                }}
              >
                Continue
              </button>
            </div>
          </form>
        )}

        {/* Info text */}
        <p className="mt-6 text-xs text-center" style={{ color: "var(--color-text-muted)" }}>
          Your secret key syncs your notes across devices.
          <br />
          Keep it safe — it's the only way to access your notes.
        </p>
      </div>
    </div>
  );
}

