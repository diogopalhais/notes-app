import { db } from "../db/instant";

export function useAuth() {
  // Use InstantDB's built-in auth - secure, server-validated tokens
  const { isLoading, user, error } = db.useAuth();

  const userId = user?.id || null;
  const userEmail = user?.email || null;
  const showAuthModal = !isLoading && !user;

  // Send magic link email for passwordless auth
  const sendMagicLink = async (email: string) => {
    await db.auth.sendMagicCode({ email });
  };

  // Verify the magic code from email
  const verifyMagicCode = async (email: string, code: string) => {
    await db.auth.signInWithMagicCode({ email, code });
  };

  // Sign out
  const logout = () => {
    db.auth.signOut();
  };

  // Copy user ID to clipboard (for backup/sharing)
  const copyUserId = async () => {
    if (userId) {
      await navigator.clipboard.writeText(userId);
    }
  };

  return {
    userId,
    userEmail,
    isLoading,
    error,
    showAuthModal,
    sendMagicLink,
    verifyMagicCode,
    logout,
    copyUserId,
  };
}
