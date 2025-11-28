import { init, id, tx } from "@instantdb/react";

// InstantDB App ID - create one at https://instantdb.com
const APP_ID = import.meta.env.VITE_INSTANT_APP_ID;

console.log("InstantDB APP_ID:", APP_ID ? "configured" : "NOT CONFIGURED");

if (!APP_ID || APP_ID === "your-app-id-here") {
  console.warn(
    "⚠️ InstantDB App ID not configured!\n" +
    "1. Go to https://instantdb.com and create an app\n" +
    "2. Create a .env file with: VITE_INSTANT_APP_ID=your-app-id\n" +
    "3. Restart the dev server"
  );
}

// Define the schema type for TypeScript
type Schema = {
  notes: {
    id: string;
    ownerId: string;
    title: string;
    content: string;
    createdAt: number;
    updatedAt: number;
  };
  folders: {
    id: string;
    ownerId: string;
    name: string;
    color?: string;
  };
  tags: {
    id: string;
    ownerId: string;
    name: string;
    color?: string;
  };
};

// Initialize the database (will fail silently without valid APP_ID)
export const db = init<Schema>({ appId: APP_ID || "placeholder" });

// Export utilities
export { id, tx };

// Helper to generate IDs
export const generateId = () => id();

// Check if InstantDB is configured
export const isConfigured = () => !!APP_ID && APP_ID !== "your-app-id-here";
