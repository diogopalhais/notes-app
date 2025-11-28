import { useState, useEffect } from "react";

type Theme = "dark" | "light";

const STORAGE_KEY = "notes-app-theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      return stored;
    }
    // Default to dark
    return "dark";
  });

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    
    if (theme === "light") {
      root.style.setProperty("--color-bg-primary", "#ffffff");
      root.style.setProperty("--color-bg-secondary", "#f9fafb");
      root.style.setProperty("--color-bg-tertiary", "#f3f4f6");
      root.style.setProperty("--color-bg-hover", "#e5e7eb");
      root.style.setProperty("--color-bg-active", "#d1d5db");
      root.style.setProperty("--color-border", "#e5e7eb");
      root.style.setProperty("--color-border-subtle", "#f3f4f6");
      root.style.setProperty("--color-text-primary", "#111827");
      root.style.setProperty("--color-text-secondary", "#4b5563");
      root.style.setProperty("--color-text-muted", "#9ca3af");
      root.style.setProperty("--color-accent-muted", "#dbeafe");
    } else {
      root.style.setProperty("--color-bg-primary", "#0d0d0d");
      root.style.setProperty("--color-bg-secondary", "#141414");
      root.style.setProperty("--color-bg-tertiary", "#1a1a1a");
      root.style.setProperty("--color-bg-hover", "#242424");
      root.style.setProperty("--color-bg-active", "#2a2a2a");
      root.style.setProperty("--color-border", "#2a2a2a");
      root.style.setProperty("--color-border-subtle", "#1f1f1f");
      root.style.setProperty("--color-text-primary", "#fafafa");
      root.style.setProperty("--color-text-secondary", "#a1a1a1");
      root.style.setProperty("--color-text-muted", "#6b6b6b");
      root.style.setProperty("--color-accent-muted", "#1e3a5f");
    }

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(t => t === "dark" ? "light" : "dark");
  };

  return { theme, toggleTheme };
}

