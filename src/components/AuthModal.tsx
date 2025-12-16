import { useState } from "react";

interface AuthModalProps {
  onSendMagicLink: (email: string) => Promise<void>;
  onVerifyCode: (email: string, code: string) => Promise<void>;
}

export function AuthModal({ onSendMagicLink, onVerifyCode }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"email" | "code">("email");

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const trimmed = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(trimmed)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    try {
      await onSendMagicLink(trimmed);
      setStep("code");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const trimmedCode = code.trim();
    if (!trimmedCode) {
      setError("Please enter the code from your email");
      return;
    }
    
    setIsLoading(true);
    try {
      await onVerifyCode(email.trim().toLowerCase(), trimmedCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid or expired code");
    } finally {
      setIsLoading(false);
    }
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

        {step === "email" ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Sign in with your email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
                style={{ 
                  backgroundColor: "var(--color-bg-tertiary)",
                  color: "var(--color-text-primary)",
                  border: error ? "1px solid var(--color-error)" : "1px solid var(--color-border)"
                }}
                autoFocus
                disabled={isLoading}
              />
              {error && (
                <p className="mt-2 text-sm" style={{ color: "var(--color-error)" }}>
                  {error}
                </p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              style={{ 
                backgroundColor: isLoading ? "var(--color-bg-tertiary)" : "var(--color-accent)", 
                color: isLoading ? "var(--color-text-muted)" : "white",
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              {isLoading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Sign-in Code
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="text-center mb-4">
              <div 
                className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3"
                style={{ backgroundColor: "var(--color-success-muted, rgba(34, 197, 94, 0.1))" }}
              >
                <svg className="w-6 h-6" style={{ color: "var(--color-success)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                We sent a code to
              </p>
              <p className="font-medium" style={{ color: "var(--color-text-primary)" }}>
                {email}
              </p>
            </div>

            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Enter the code from your email
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError("");
                }}
                placeholder="Enter code"
                className="w-full px-4 py-3 rounded-xl text-sm text-center tracking-widest font-mono outline-none transition-colors"
                style={{ 
                  backgroundColor: "var(--color-bg-tertiary)",
                  color: "var(--color-text-primary)",
                  border: error ? "1px solid var(--color-error)" : "1px solid var(--color-border)",
                  fontSize: "1.25rem",
                  letterSpacing: "0.5em",
                }}
                autoFocus
                disabled={isLoading}
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
                  setStep("email");
                  setCode("");
                  setError("");
                }}
                className="flex-1 py-3 px-4 rounded-xl font-medium transition-colors"
                style={{ 
                  backgroundColor: "var(--color-bg-tertiary)", 
                  color: "var(--color-text-primary)",
                  border: "1px solid var(--color-border)"
                }}
                disabled={isLoading}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 px-4 rounded-xl font-medium transition-colors"
                style={{ 
                  backgroundColor: isLoading ? "var(--color-bg-tertiary)" : "var(--color-accent)", 
                  color: isLoading ? "var(--color-text-muted)" : "white",
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
              >
                {isLoading ? "Verifying..." : "Verify"}
              </button>
            </div>

            <button
              type="button"
              onClick={async () => {
                setError("");
                setIsLoading(true);
                try {
                  await onSendMagicLink(email.trim().toLowerCase());
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Failed to resend");
                } finally {
                  setIsLoading(false);
                }
              }}
              className="w-full text-sm py-2 transition-colors"
              style={{ color: "var(--color-text-muted)" }}
              disabled={isLoading}
            >
              Didn't receive it? <span style={{ color: "var(--color-accent)" }}>Resend code</span>
            </button>
          </form>
        )}

        {/* Security info */}
        <div className="mt-6 pt-6" style={{ borderTop: "1px solid var(--color-border)" }}>
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "var(--color-success)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              Your notes are securely encrypted and only accessible with your account.
              No one else can read your notes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
