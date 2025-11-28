import { useState, useMemo } from "react";
import type { Folder } from "../hooks/useFolders";
import type { Note } from "../hooks/useNotes";

interface FolderTreeProps {
  folders: Folder[];
  notes: Note[];
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  onCreateFolder: (name: string) => void;
  onDeleteFolder: (folderId: string) => void;
}

export function FolderTree({
  folders,
  notes,
  selectedFolderId,
  onSelectFolder,
  onCreateFolder,
  onDeleteFolder,
}: FolderTreeProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  // Debug
  console.log("FolderTree - folders:", folders, "notes:", notes);

  // Create a map of folder ID to note count
  const noteCountMap = useMemo(() => {
    const map = new Map<string, number>();
    notes.forEach(note => {
      if (note.folderId) {
        map.set(note.folderId, (map.get(note.folderId) || 0) + 1);
      }
    });
    return map;
  }, [notes]);

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName("");
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between px-2 py-1">
        <span 
          className="text-xs font-medium uppercase tracking-wider"
          style={{ color: "var(--color-text-muted)" }}
        >
          Folders
        </span>
        <button
          onClick={() => setIsCreating(true)}
          className="p-1 rounded transition-colors"
          style={{ color: "var(--color-text-muted)" }}
          onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-text-primary)"}
          onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-text-muted)"}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreateFolder} className="px-2 py-1">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name"
            className="w-full px-2 py-1 text-sm rounded outline-none"
            style={{ 
              backgroundColor: "var(--color-bg-tertiary)",
              color: "var(--color-text-primary)",
              border: "1px solid var(--color-accent)"
            }}
            autoFocus
            onBlur={() => {
              if (!newFolderName.trim()) {
                setIsCreating(false);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setIsCreating(false);
                setNewFolderName("");
              }
            }}
          />
        </form>
      )}

      {folders.map((folder) => {
        const noteCount = noteCountMap.get(folder.id) || 0;
        const isSelected = selectedFolderId === folder.id;
        
        return (
          <div
            key={folder.id}
            className="group flex items-center gap-2 py-1.5 px-2 rounded-lg cursor-pointer transition-colors"
            style={{
              backgroundColor: isSelected ? "var(--color-bg-active)" : "transparent",
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = "var(--color-bg-hover)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
            onClick={() => onSelectFolder(folder.id)}
          >
            <div
              className="w-3 h-3 rounded-sm shrink-0"
              style={{ backgroundColor: folder.color || "var(--color-accent)" }}
            />
            
            <span 
              className="flex-1 text-sm truncate"
              style={{ color: "var(--color-text-primary)" }}
            >
              {folder.name}
            </span>
            
            {noteCount > 0 && (
              <span 
                className="text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                {noteCount}
              </span>
            )}
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete folder "${folder.name}"?`)) {
                  onDeleteFolder(folder.id);
                }
              }}
              className="opacity-0 group-hover:opacity-100 p-1 rounded transition-opacity"
              style={{ color: "var(--color-text-muted)" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-error)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-text-muted)"}
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        );
      })}

      {folders.length === 0 && !isCreating && (
        <p 
          className="text-xs px-2 py-2"
          style={{ color: "var(--color-text-muted)" }}
        >
          No folders yet
        </p>
      )}
    </div>
  );
}
