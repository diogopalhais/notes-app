import { FolderTree } from "./FolderTree";
import type { Folder } from "../hooks/useFolders";
import type { Tag } from "../hooks/useTags";
import type { Note } from "../hooks/useNotes";

type View = "all" | "today" | "week" | "folder" | "tag";

function NavItem({
  icon,
  label,
  count,
  isActive,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  count?: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left"
      style={{
        backgroundColor: isActive ? "var(--color-bg-active)" : "transparent",
        color: isActive ? "var(--color-text-primary)" : "var(--color-text-secondary)",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = "var(--color-bg-hover)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = "transparent";
        }
      }}
    >
      {icon}
      <span className="flex-1 text-sm">{label}</span>
      {count !== undefined && (
        <span 
          className="text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

interface SidebarProps {
  view: View;
  selectedFolderId: string | null;
  selectedTagId: string | null;
  folders: Folder[];
  tags: Tag[];
  notes: Note[];
  todayCount: number;
  weekCount: number;
  allCount: number;
  theme: "dark" | "light";
  userEmail: string | null;
  onViewChange: (view: View) => void;
  onSelectFolder: (folderId: string | null) => void;
  onSelectTag: (tagId: string | null) => void;
  onCreateFolder: (name: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onToggleTheme: () => void;
  onLogout: () => void;
}

export function Sidebar({
  view,
  selectedFolderId,
  selectedTagId,
  folders,
  tags,
  notes,
  todayCount,
  weekCount,
  allCount,
  theme,
  userEmail,
  onViewChange,
  onSelectFolder,
  onSelectTag,
  onCreateFolder,
  onDeleteFolder,
  onToggleTheme,
  onLogout,
}: SidebarProps) {
  return (
    <div 
      className="w-64 flex flex-col h-full"
      style={{ 
        backgroundColor: "var(--color-bg-secondary)",
        borderRight: "1px solid var(--color-border)"
      }}
    >
      {/* Navigation */}
      <div className="p-6 flex-1 overflow-auto px-3 space-y-6">
        {/* Main nav */}
        <div className="space-y-1">
          <NavItem
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
            label="All Notes"
            count={allCount}
            isActive={view === "all"}
            onClick={() => {
              onViewChange("all");
              onSelectFolder(null);
              onSelectTag(null);
            }}
          />
          <NavItem
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            label="Today"
            count={todayCount}
            isActive={view === "today"}
            onClick={() => {
              onViewChange("today");
              onSelectFolder(null);
              onSelectTag(null);
            }}
          />
          <NavItem
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            }
            label="This Week"
            count={weekCount}
            isActive={view === "week"}
            onClick={() => {
              onViewChange("week");
              onSelectFolder(null);
              onSelectTag(null);
            }}
          />
        </div>

        {/* Folders */}
        <FolderTree
          folders={folders}
          notes={notes}
          selectedFolderId={view === "folder" ? selectedFolderId : null}
          onSelectFolder={(folderId) => {
            if (folderId) {
              onViewChange("folder");
              onSelectFolder(folderId);
            } else {
              onViewChange("all");
              onSelectFolder(null);
            }
          }}
          onCreateFolder={onCreateFolder}
          onDeleteFolder={onDeleteFolder}
        />

        {/* Tags */}
        {tags.length > 0 && (
          <div className="space-y-1">
            <span 
              className="text-xs font-medium uppercase tracking-wider px-2"
              style={{ color: "var(--color-text-muted)" }}
            >
              Tags
            </span>
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => {
                  onViewChange("tag");
                  onSelectTag(tag.id);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-left"
                style={{
                  backgroundColor: view === "tag" && selectedTagId === tag.id 
                    ? "var(--color-bg-active)" 
                    : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!(view === "tag" && selectedTagId === tag.id)) {
                    e.currentTarget.style.backgroundColor = "var(--color-bg-hover)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!(view === "tag" && selectedTagId === tag.id)) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                <span 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: tag.color || "var(--color-accent)" }}
                />
                <span 
                  className="text-sm flex-1"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {tag.name}
                </span>
                <span 
                  className="text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {tag.notes?.length || 0}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div 
        className="p-3 space-y-1"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        {/* User info */}
        {userEmail && (
          <div 
            className="flex items-center gap-2 px-3 py-2 mb-2"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-sm truncate" title={userEmail}>{userEmail}</span>
          </div>
        )}
        <button
          onClick={onToggleTheme}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left"
          style={{ color: "var(--color-text-secondary)" }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--color-bg-hover)"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          {theme === "dark" ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
          <span className="text-sm">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left"
          style={{ color: "var(--color-text-secondary)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-bg-hover)";
            e.currentTarget.style.color = "var(--color-error)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "var(--color-text-secondary)";
          }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
}

