import { useState, useEffect, useCallback, useMemo } from "react";
import { AuthModal } from "./components/AuthModal";
import { Sidebar } from "./components/Sidebar";
import { NoteList } from "./components/NoteList";
import { NoteEditor } from "./components/NoteEditor";
import { useAuth } from "./hooks/useAuth";
import { useNotes, useTodayNotes, useThisWeekNotes } from "./hooks/useNotes";
import { useFolders } from "./hooks/useFolders";
import { useTags } from "./hooks/useTags";
import { useTheme } from "./hooks/useTheme";
import { isConfigured } from "./db/instant";

type View = "all" | "today" | "week" | "folder" | "tag";

function App() {
  const { 
    userId, 
    isLoading: authLoading, 
    showAuthModal, 
    generateNewId, 
    setExistingId, 
    logout, 
    copyUserId 
  } = useAuth();

  const { 
    notes, 
    isLoading: notesLoading, 
    createNote, 
    updateNote, 
    deleteNote,
    moveToFolder 
  } = useNotes(userId);
  
  const { todayNotes } = useTodayNotes(userId);
  const { thisWeekNotes } = useThisWeekNotes(userId);
  
  const { 
    folders, 
    createFolder, 
    deleteFolder 
  } = useFolders(userId);
  
  const { tags } = useTags(userId);
  
  const { theme, toggleTheme } = useTheme();

  const [view, setView] = useState<View>("all");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Filter notes based on current view
  const filteredNotes = useMemo(() => {
    switch (view) {
      case "today":
        return todayNotes;
      case "week":
        return thisWeekNotes;
      case "folder":
        if (!selectedFolderId) return notes;
        return notes.filter(note => note.folderId === selectedFolderId);
      case "tag":
        // Tags not implemented yet with simple approach
        return notes;
      default:
        return notes;
    }
  }, [view, notes, todayNotes, thisWeekNotes, selectedFolderId]);

  // Get selected note
  const selectedNote = useMemo(() => {
    return notes.find(n => n.id === selectedNoteId) || null;
  }, [notes, selectedNoteId]);

  // Create new note
  const handleCreateNote = useCallback(async () => {
    const noteId = await createNote();
    if (noteId) {
      setSelectedNoteId(noteId);
    }
  }, [createNote]);

  // Delete note
  const handleDeleteNote = useCallback(async (noteId: string) => {
    await deleteNote(noteId);
    if (selectedNoteId === noteId) {
      setSelectedNoteId(null);
    }
  }, [deleteNote, selectedNoteId]);

  // Copy user ID with feedback
  const handleCopyUserId = useCallback(async () => {
    await copyUserId();
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  }, [copyUserId]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === "n") {
          e.preventDefault();
          handleCreateNote();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleCreateNote]);

  // Show setup screen if InstantDB not configured
  if (!isConfigured()) {
    return (
      <div 
        className="h-full flex items-center justify-center p-8"
        style={{ backgroundColor: "var(--color-bg-primary)" }}
      >
        <div 
          className="max-w-md text-center p-8 rounded-2xl"
          style={{ backgroundColor: "var(--color-bg-secondary)", border: "1px solid var(--color-border)" }}
        >
          <div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
            style={{ backgroundColor: "var(--color-accent-muted)" }}
          >
            <svg className="w-8 h-8" style={{ color: "var(--color-accent)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold mb-2" style={{ color: "var(--color-text-primary)" }}>
            Setup Required
          </h1>
          <p className="mb-6" style={{ color: "var(--color-text-secondary)" }}>
            To use Notes, you need to configure InstantDB for real-time sync.
          </p>
          <div 
            className="text-left p-4 rounded-xl mb-6 font-mono text-sm"
            style={{ backgroundColor: "var(--color-bg-tertiary)" }}
          >
            <p style={{ color: "var(--color-text-muted)" }}># 1. Create app at instantdb.com</p>
            <p style={{ color: "var(--color-text-muted)" }}># 2. Create .env file:</p>
            <p style={{ color: "var(--color-text-primary)" }}>VITE_INSTANT_APP_ID=your-id</p>
            <p style={{ color: "var(--color-text-muted)" }}># 3. Restart dev server</p>
          </div>
          <a
            href="https://instantdb.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors"
            style={{ backgroundColor: "var(--color-accent)", color: "white" }}
          >
            Go to InstantDB
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    );
  }

  // Show loading screen
  if (authLoading) {
    return (
      <div 
        className="h-full flex items-center justify-center"
        style={{ backgroundColor: "var(--color-bg-primary)" }}
      >
        <div 
          className="w-8 h-8 border-2 rounded-full animate-spin"
          style={{ 
            borderColor: "var(--color-border)",
            borderTopColor: "var(--color-accent)"
          }}
        />
      </div>
    );
  }

  // Show auth modal
  if (showAuthModal) {
    return (
      <AuthModal
        onGenerate={generateNewId}
        onSubmit={setExistingId}
      />
    );
  }

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <Sidebar
        view={view}
        selectedFolderId={selectedFolderId}
        selectedTagId={selectedTagId}
        folders={folders}
        tags={tags}
        notes={notes}
        todayCount={todayNotes.length}
        weekCount={thisWeekNotes.length}
        allCount={notes.length}
        theme={theme}
        onViewChange={setView}
        onSelectFolder={setSelectedFolderId}
        onSelectTag={setSelectedTagId}
        onCreateFolder={(name) => createFolder(name)}
        onDeleteFolder={deleteFolder}
        onToggleTheme={toggleTheme}
        onLogout={logout}
        onCopyUserId={handleCopyUserId}
      />

      {/* Note List */}
      <div className="w-80">
        <NoteList
          notes={filteredNotes}
          folders={folders}
          selectedNoteId={selectedNoteId}
          onSelectNote={setSelectedNoteId}
          onCreateNote={handleCreateNote}
          onDeleteNote={handleDeleteNote}
          isLoading={notesLoading}
        />
      </div>

      {/* Editor */}
      <NoteEditor
        note={selectedNote}
        folders={folders}
        onUpdateNote={updateNote}
        onMoveToFolder={moveToFolder}
      />

      {/* Copy feedback toast */}
      {copyFeedback && (
        <div 
          className="fixed bottom-4 right-4 px-4 py-2 rounded-lg text-sm flex items-center gap-2 animate-fade-in"
          style={{ 
            backgroundColor: "var(--color-bg-tertiary)",
            color: "var(--color-text-primary)",
            border: "1px solid var(--color-border)"
          }}
        >
          <svg className="w-4 h-4" style={{ color: "var(--color-success)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Secret key copied!
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;
