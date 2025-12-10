import { useState, useEffect, useCallback, useRef } from "react";
import { Editor } from "./Editor";
import { Preview } from "./Preview";
import type { Note } from "../hooks/useNotes";
import type { Folder } from "../hooks/useFolders";

interface NoteEditorProps {
  note: Note | null;
  folders: Folder[];
  onUpdateNote: (noteId: string, updates: { title?: string; content?: string }) => void;
  onMoveToFolder: (noteId: string, folderId: string | null) => void;
}

export function NoteEditor({ note, folders, onUpdateNote, onMoveToFolder }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showFolderMenu, setShowFolderMenu] = useState(false);
  const folderMenuRef = useRef<HTMLDivElement>(null);
  const prevNoteIdRef = useRef<string | undefined>(note?.id);

  // Get the current folder object from folderId
  const currentFolder = note?.folderId 
    ? folders.find(f => f.id === note.folderId) ?? null
    : null;

  // Sync local state with note prop when note ID changes
  if (note?.id !== prevNoteIdRef.current) {
    prevNoteIdRef.current = note?.id;
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle("");
      setContent("");
    }
  }

  // Close folder menu when clicking outside
  useEffect(() => {
    if (!showFolderMenu) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (folderMenuRef.current && !folderMenuRef.current.contains(e.target as Node)) {
        setShowFolderMenu(false);
      }
    };

    // Use setTimeout to avoid immediate trigger
    const timer = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showFolderMenu]);

  // Auto-save with debounce
  const saveNote = useCallback(async () => {
    if (!note) return;
    
    setIsSaving(true);
    await onUpdateNote(note.id, { title, content });
    setIsSaving(false);
  }, [note, title, content, onUpdateNote]);

  // Debounced auto-save
  useEffect(() => {
    if (!note) return;
    
    const timer = setTimeout(() => {
      if (title !== note.title || content !== note.content) {
        saveNote();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [title, content, note, saveNote]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === "p") {
          e.preventDefault();
          setShowPreview(!showPreview);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showPreview]);

  const handleFolderSelect = (folderId: string | null) => {
    if (note) {
      onMoveToFolder(note.id, folderId);
    }
    setShowFolderMenu(false);
  };

  if (!note) {
    return (
      <div 
        className="flex-1 flex items-center justify-center"
        style={{ backgroundColor: "var(--color-bg-primary)" }}
      >
        <div className="text-center">
          <svg 
            className="w-16 h-16 mx-auto mb-4"
            style={{ color: "var(--color-text-muted)" }}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <p style={{ color: "var(--color-text-muted)" }}>
            Select a note or create a new one
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
            Press <kbd className="px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: "var(--color-bg-tertiary)" }}>⌘N</kbd> to create
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex-1 flex flex-col"
      style={{ backgroundColor: "var(--color-bg-primary)" }}
    >
      {/* Header */}
      <div 
        className="flex items-center gap-4 px-6 py-4"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled"
          className="flex-1 text-xl font-semibold bg-transparent outline-none"
          style={{ color: "var(--color-text-primary)" }}
        />
        
        <div className="flex items-center gap-2">
          {isSaving && (
            <span 
              className="text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              Saving...
            </span>
          )}

          {/* Folder selector */}
          <div className="relative" ref={folderMenuRef}>
            <button
              onClick={() => setShowFolderMenu(!showFolderMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors"
              style={{
                backgroundColor: currentFolder ? "var(--color-bg-tertiary)" : "transparent",
                color: "var(--color-text-secondary)",
                border: "1px solid var(--color-border)"
              }}
              onMouseEnter={(e) => {
                if (!currentFolder) {
                  e.currentTarget.style.backgroundColor = "var(--color-bg-hover)";
                }
              }}
              onMouseLeave={(e) => {
                if (!currentFolder) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              {currentFolder ? (
                <>
                  <div 
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ backgroundColor: currentFolder.color || "var(--color-accent)" }}
                  />
                  <span style={{ color: "var(--color-text-primary)" }}>{currentFolder.name}</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  <span>Add to folder</span>
                </>
              )}
              <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown menu */}
            {showFolderMenu && (
              <div 
                className="absolute right-0 top-full mt-1 w-48 py-1 rounded-lg shadow-lg z-50"
                style={{ 
                  backgroundColor: "var(--color-bg-secondary)",
                  border: "1px solid var(--color-border)"
                }}
              >
                {/* Remove from folder option */}
                {currentFolder && (
                  <>
                    <button
                      onClick={() => handleFolderSelect(null)}
                      className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors"
                      style={{ color: "var(--color-text-secondary)" }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--color-bg-hover)"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Remove from folder
                    </button>
                    <div 
                      className="my-1 mx-2"
                      style={{ borderTop: "1px solid var(--color-border)" }}
                    />
                  </>
                )}
                
                {folders.length === 0 ? (
                  <div 
                    className="px-3 py-2 text-sm"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    No folders yet
                  </div>
                ) : (
                  folders.map((folder) => (
                    <button
                      key={folder.id}
                      onClick={() => handleFolderSelect(folder.id)}
                      className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors"
                      style={{ 
                        color: note.folderId === folder.id ? "var(--color-accent)" : "var(--color-text-primary)",
                        backgroundColor: note.folderId === folder.id ? "var(--color-accent-muted)" : "transparent"
                      }}
                      onMouseEnter={(e) => {
                        if (note.folderId !== folder.id) {
                          e.currentTarget.style.backgroundColor = "var(--color-bg-hover)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (note.folderId !== folder.id) {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }
                      }}
                    >
                      <div 
                        className="w-3 h-3 rounded-sm shrink-0"
                        style={{ backgroundColor: folder.color || "var(--color-accent)" }}
                      />
                      <span className="truncate">{folder.name}</span>
                      {note.folderId === folder.id && (
                        <svg className="w-4 h-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors"
            style={{
              backgroundColor: showPreview ? "var(--color-accent-muted)" : "var(--color-bg-tertiary)",
              color: showPreview ? "var(--color-accent)" : "var(--color-text-secondary)",
            }}
          >
            {showPreview ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {showPreview ? (
          <Preview content={content} />
        ) : (
          <Editor
            content={content}
            onChange={setContent}
            onSave={saveNote}
          />
        )}
      </div>
    </div>
  );
}
