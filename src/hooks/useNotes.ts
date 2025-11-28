import { db, id, tx } from "../db/instant";

export interface Note {
  id: string;
  ownerId: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  folderId?: string;
}

export function useNotes(ownerId: string | null) {
  const query = ownerId
    ? {
        notes: {
          $: { where: { ownerId } },
        },
      }
    : null;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { isLoading, error, data } = db.useQuery(query as any);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const notes = ((data as any)?.notes || []) as Note[];

  const createNote = async (title: string = "Untitled", content: string = "") => {
    if (!ownerId) return null;
    
    const noteId = id();
    const now = Date.now();
    
    await db.transact(
      tx.notes[noteId].update({
        ownerId,
        title,
        content,
        createdAt: now,
        updatedAt: now,
      })
    );
    
    return noteId;
  };

  const updateNote = async (noteId: string, updates: { title?: string; content?: string }) => {
    if (!ownerId) return;
    
    await db.transact(
      tx.notes[noteId].update({
        ...updates,
        updatedAt: Date.now(),
      })
    );
  };

  const deleteNote = async (noteId: string) => {
    if (!ownerId) return;
    await db.transact(tx.notes[noteId].delete());
  };

  const moveToFolder = async (noteId: string, folderId: string | null) => {
    if (!ownerId) return;
    
    await db.transact(
      tx.notes[noteId].update({
        folderId: folderId || "",
        updatedAt: Date.now(),
      })
    );
  };

  return {
    notes,
    isLoading,
    error,
    createNote,
    updateNote,
    deleteNote,
    moveToFolder,
  };
}

export function useTodayNotes(ownerId: string | null) {
  const { notes, isLoading, error } = useNotes(ownerId);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStart = today.getTime();
  const todayEnd = todayStart + 24 * 60 * 60 * 1000;
  
  const todayNotes = notes.filter(
    note => note.updatedAt >= todayStart && note.updatedAt < todayEnd
  );
  
  return { todayNotes, isLoading, error };
}

export function useThisWeekNotes(ownerId: string | null) {
  const { notes, isLoading, error } = useNotes(ownerId);
  
  const today = new Date();
  const dayOfWeek = today.getDay();
  // Get start of week (Sunday = 0, so we go back dayOfWeek days)
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - dayOfWeek);
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);
  
  const thisWeekNotes = notes.filter(
    note => note.updatedAt >= weekStart.getTime() && note.updatedAt < weekEnd.getTime()
  );
  
  return { thisWeekNotes, isLoading, error };
}

