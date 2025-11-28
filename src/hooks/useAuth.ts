import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "notes-app-user-id";

export function useAuth() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Check localStorage for existing UUID
    const storedId = localStorage.getItem(STORAGE_KEY);
    if (storedId) {
      setUserId(storedId);
      setShowAuthModal(false);
    } else {
      setShowAuthModal(true);
    }
    setIsLoading(false);
  }, []);

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

