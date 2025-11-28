import { useState, useMemo } from "react";
import type { Note } from "../hooks/useNotes";
import type { Folder } from "../hooks/useFolders";

interface NoteListProps {
  notes: Note[];
  folders: Folder[];
  selectedNoteId: string | null;
  onSelectNote: (noteId: string) => void;
  onCreateNote: () => void;
  onDeleteNote: (noteId: string) => void;
  isLoading?: boolean;
}

export function NoteList({
  notes,
  folders,
  selectedNoteId,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
  isLoading,
}: NoteListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Create a map of folder ID to folder for quick lookup
  const folderMap = useMemo(() => {
    const map = new Map<string, Folder>();
    folders.forEach(f => map.set(f.id, f));
    return map;
  }, [folders]);

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) {
      return [...notes].sort((a, b) => b.updatedAt - a.updatedAt);
    }
    
    const query = searchQuery.toLowerCase();
    return notes
      .filter(
        note =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query)
      )
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes, searchQuery]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getPreview = (content: string) => {
    // Remove markdown syntax and get first ~80 chars
    const cleaned = content
      .replace(/^#+\s+/gm, "")
      .replace(/\*\*|__/g, "")
      .replace(/\*|_/g, "")
      .replace(/`{1,3}[^`]*`{1,3}/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, "")
      .replace(/^[-*+]\s+/gm, "")
      .replace(/^\d+\.\s+/gm, "")
      .replace(/\n+/g, " ")
      .trim();
    
    return cleaned.length > 80 ? cleaned.slice(0, 80) + "..." : cleaned;
  };

  const getNoteFolder = (note: Note) => {
    if (!note.folderId) return null;
    return folderMap.get(note.folderId) || null;
  };

  return (
    <div 
      className="flex flex-col h-full"
      style={{ 
        backgroundColor: "var(--color-bg-secondary)",
        borderRight: "1px solid var(--color-border)"
      }}
    >
      {/* Header */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold" style={{ color: "var(--color-text-primary)" }}>
            Notes
          </h2>
          <button
            onClick={onCreateNote}
            className="p-2 rounded-lg transition-colors"
            style={{ color: "var(--color-text-secondary)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-bg-hover)";
              e.currentTarget.style.color = "var(--color-text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--color-text-secondary)";
            }}
            title="New note (⌘N)"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <svg 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "var(--color-text-muted)" }}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-10 pr-4 py-2 rounded-lg text-sm outline-none transition-colors"
            style={{ 
              backgroundColor: "var(--color-bg-tertiary)",
              color: "var(--color-text-primary)",
              border: "1px solid var(--color-border)"
            }}
          />
        </div>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-auto px-2 pb-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div 
              className="w-6 h-6 border-2 rounded-full animate-spin"
              style={{ 
                borderColor: "var(--color-border)",
                borderTopColor: "var(--color-accent)"
              }}
            />
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              {searchQuery ? "No notes found" : "No notes yet"}
            </p>
            {!searchQuery && (
              <button
                onClick={onCreateNote}
                className="mt-2 text-sm"
                style={{ color: "var(--color-accent)" }}
              >
                Create your first note
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredNotes.map((note) => {
              const folder = getNoteFolder(note);
              return (
                <div
                  key={note.id}
                  onClick={() => onSelectNote(note.id)}
                  className="group p-3 rounded-lg cursor-pointer transition-colors"
                  style={{
                    backgroundColor: selectedNoteId === note.id ? "var(--color-bg-active)" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedNoteId !== note.id) {
                      e.currentTarget.style.backgroundColor = "var(--color-bg-hover)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedNoteId !== note.id) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 
                      className="font-medium text-sm truncate flex-1"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {note.title || "Untitled"}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNote(note.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded transition-opacity"
                      style={{ color: "var(--color-text-muted)" }}
                      onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-error)"}
                      onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-text-muted)"}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <p 
                    className="text-xs mt-1 line-clamp-2"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {getPreview(note.content) || "Empty note"}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span 
                      className="text-xs"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {formatDate(note.updatedAt)}
                    </span>
                    {folder && (
                      <span 
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{ 
                          backgroundColor: folder.color ? `${folder.color}20` : "var(--color-bg-tertiary)",
                          color: folder.color || "var(--color-text-secondary)"
                        }}
                      >
                        {folder.name}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
