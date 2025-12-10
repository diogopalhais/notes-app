import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "notes-app-user-id";

function getStoredUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function useAuth() {
  const storedId = getStoredUserId();
  const [userId, setUserId] = useState<string | null>(storedId);
  const [isLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(!storedId);

  const generateNewId = useCallback(() => {
    const newId = uuidv4();
    localStorage.setItem(STORAGE_KEY, newId);
    setUserId(newId);
    setShowAuthModal(false);
    return newId;
  }, []);

  const setExistingId = useCallback((id: string) => {
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error("Invalid UUID format");
    }
    localStorage.setItem(STORAGE_KEY, id);
    setUserId(id);
    setShowAuthModal(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUserId(null);
    setShowAuthModal(true);
  }, []);

  const copyUserId = useCallback(async () => {
    if (userId) {
      await navigator.clipboard.writeText(userId);
    }
  }, [userId]);

  return {
    userId,
    isLoading,
    showAuthModal,
    generateNewId,
    setExistingId,
    logout,
    copyUserId,
  };
}

