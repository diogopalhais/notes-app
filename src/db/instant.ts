import { init, id, tx, i } from "@instantdb/react";

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

// Define the schema using InstantDB's schema builder
const schema = i.schema({
  entities: {
    notes: i.entity({
      ownerId: i.string(),
      title: i.string(),
      content: i.string(),
      createdAt: i.number(),
      updatedAt: i.number(),
    }),
    folders: i.entity({
      ownerId: i.string(),
      name: i.string(),
      color: i.string().optional(),
    }),
    tags: i.entity({
      ownerId: i.string(),
      name: i.string(),
      color: i.string().optional(),
    }),
  },
});

// Initialize the database (will fail silently without valid APP_ID)
export const db = init({ appId: APP_ID || "placeholder", schema, devtool: false });

// Export utilities
export { id, tx };

// Helper to generate IDs
export const generateId = () => id();

// Check if InstantDB is configured
export const isConfigured = () => !!APP_ID && APP_ID !== "your-app-id-here";
