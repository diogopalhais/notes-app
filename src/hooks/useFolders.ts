import { db, id, tx } from "../db/instant";

export interface Folder {
  id: string;
  ownerId: string;
  name: string;
  color?: string;
}

const FOLDER_COLORS = [
  "#3b82f6", // blue
  "#22c55e", // green
  "#eab308", // yellow
  "#ef4444", // red
  "#a855f7", // purple
  "#f97316", // orange
  "#06b6d4", // cyan
  "#ec4899", // pink
];

export function useFolders(ownerId: string | null) {
  const query = ownerId
    ? {
        folders: {
          $: { where: { ownerId } },
        },
      }
    : null;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { isLoading, error, data } = db.useQuery(query as any);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const folders = ((data as any)?.folders || []) as Folder[];

  // Debug: log folders data
  console.log("useFolders - ownerId:", ownerId, "isLoading:", isLoading, "error:", error, "folders:", folders, "data:", data);

  const createFolder = async (name: string, color?: string) => {
    if (!ownerId) return null;
    
    const folderId = id();
    const folderColor = color || FOLDER_COLORS[Math.floor(Math.random() * FOLDER_COLORS.length)];
    
    await db.transact(
      tx.folders[folderId].update({
        ownerId,
        name,
        color: folderColor,
      })
    );
    
    return folderId;
  };

  const updateFolder = async (folderId: string, updates: { name?: string; color?: string }) => {
    if (!ownerId) return;
    await db.transact(tx.folders[folderId].update(updates));
  };

  const deleteFolder = async (folderId: string) => {
    if (!ownerId) return;
    await db.transact(tx.folders[folderId].delete());
  };

  return {
    folders,
    isLoading,
    error,
    createFolder,
    updateFolder,
    deleteFolder,
    FOLDER_COLORS,
  };
}
