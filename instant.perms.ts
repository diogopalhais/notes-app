// InstantDB Permission Rules
// These rules run server-side and CANNOT be bypassed by clients
// Push these with: npx instant-cli push-perms

import type { InstantRules } from "@instantdb/react";

const rules = {
  // Block access to $users table - users cannot query other users
  $users: {
    allow: {
      view: "false",
      create: "false",
      update: "false",
      delete: "false",
    },
  },

  // Notes: only owner can read/write their own notes
  notes: {
    allow: {
      // User can view only if they own the note
      view: "auth.id != null && data.ownerId == auth.id",
      // User can create only if setting themselves as owner
      create: "auth.id != null && newData.ownerId == auth.id",
      // User can update only their own notes, and cannot change ownerId
      update: "auth.id != null && data.ownerId == auth.id && newData.ownerId == auth.id",
      // User can delete only their own notes
      delete: "auth.id != null && data.ownerId == auth.id",
    },
  },

  // Folders: only owner can read/write their own folders
  folders: {
    allow: {
      view: "auth.id != null && data.ownerId == auth.id",
      create: "auth.id != null && newData.ownerId == auth.id",
      update: "auth.id != null && data.ownerId == auth.id && newData.ownerId == auth.id",
      delete: "auth.id != null && data.ownerId == auth.id",
    },
  },

  // Tags: only owner can read/write their own tags
  tags: {
    allow: {
      view: "auth.id != null && data.ownerId == auth.id",
      create: "auth.id != null && newData.ownerId == auth.id",
      update: "auth.id != null && data.ownerId == auth.id && newData.ownerId == auth.id",
      delete: "auth.id != null && data.ownerId == auth.id",
    },
  },
} satisfies InstantRules;

export default rules;
