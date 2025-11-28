import { db, id, tx } from "../db/instant";

export interface Tag {
  id: string;
  ownerId: string;
  name: string;
  color?: string;
  notes?: { id: string; title: string }[];
}

const TAG_COLORS = [
  "#3b82f6", // blue
  "#22c55e", // green
  "#eab308", // yellow
  "#ef4444", // red
  "#a855f7", // purple
  "#f97316", // orange
  "#06b6d4", // cyan
  "#ec4899", // pink
];

export function useTags(ownerId: string | null) {
  const query = ownerId
    ? {
        tags: {
          $: { where: { ownerId } },
        },
      }
    : null;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { isLoading, error, data } = db.useQuery(query as any);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tags = ((data as any)?.tags || []) as Tag[];

  const createTag = async (name: string, color?: string) => {
    if (!ownerId) return null;
    
    const tagId = id();
    const tagColor = color || TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];
    
    await db.transact(
      tx.tags[tagId].update({
        ownerId,
        name,
        color: tagColor,
      })
    );
    
    return tagId;
  };

  const updateTag = async (tagId: string, updates: { name?: string; color?: string }) => {
    if (!ownerId) return;
    await db.transact(tx.tags[tagId].update(updates));
  };

  const deleteTag = async (tagId: string) => {
    if (!ownerId) return;
    await db.transact(tx.tags[tagId].delete());
  };

  return {
    tags,
    isLoading,
    error,
    createTag,
    updateTag,
    deleteTag,
    TAG_COLORS,
  };
}

