# Notes

A minimal, aesthetic markdown notes app with real-time sync across devices.

## Features

- **Markdown Editor** - CodeMirror 6 with syntax highlighting
- **Preview Mode** - Toggle to see rendered markdown
- **Folders** - Organize notes into folders
- **Tags** - Tag notes for easy filtering
- **Today View** - Quick access to today's notes
- **Search** - Find notes by title or content
- **Dark/Light Theme** - Toggle between themes
- **Offline Support** - Works without internet, syncs when back online
- **Multi-device Sync** - Real-time sync via InstantDB
- **UUID Auth** - Simple secret key for multi-device access

## Setup

### 1. Create an InstantDB App

1. Go to [instantdb.com](https://instantdb.com)
2. Create a new app
3. Copy your App ID

### 2. Configure Environment

Create a `.env` file in the root:

```bash
VITE_INSTANT_APP_ID=your-app-id-here
```

### 3. Install & Run

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘N` | New note |
| `⌘P` | Toggle preview |
| `⌘S` | Save note |

## Tech Stack

- **React 19** + **Vite 7**
- **InstantDB** - Real-time database with offline support
- **CodeMirror 6** - Markdown editor
- **react-markdown** - Markdown preview
- **TailwindCSS** - Styling

## Project Structure

```
src/
├── components/
│   ├── AuthModal.tsx     # UUID auth
│   ├── Editor.tsx        # CodeMirror editor
│   ├── FolderTree.tsx    # Folder navigation
│   ├── NoteEditor.tsx    # Editor + preview wrapper
│   ├── NoteList.tsx      # Note list with search
│   ├── Preview.tsx       # Markdown preview
│   └── Sidebar.tsx       # Main sidebar
├── db/
│   └── instant.ts        # InstantDB config
├── hooks/
│   ├── useAuth.ts        # UUID auth
│   ├── useFolders.ts     # Folder operations
│   ├── useNotes.ts       # Note CRUD
│   ├── useTags.ts        # Tag operations
│   └── useTheme.ts       # Theme toggle
├── App.tsx
├── main.tsx
└── index.css             # Tailwind + theme vars
```

## Multi-device Sync

1. Generate a secret key on your first device
2. Copy the key (sidebar → "Copy Secret Key")
3. On another device, enter the same key to sync notes

**Important:** Keep your secret key safe - it's the only way to access your notes!

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repo
3. Add environment variable: `VITE_INSTANT_APP_ID=your-app-id`
4. Deploy

### Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) and import your repo
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variable: `VITE_INSTANT_APP_ID=your-app-id`
6. Deploy

### Cloudflare Pages

1. Push your code to GitHub
2. Go to Cloudflare Dashboard → Pages
3. Connect your repo
4. Build command: `npm run build`
5. Build output directory: `dist`
6. Add environment variable: `VITE_INSTANT_APP_ID=your-app-id`
7. Deploy

### Manual (Any Static Host)

```bash
npm run build
# Upload the `dist` folder to your host
```

## Future Plans

- [ ] Mobile app (React Native)
- [ ] Desktop app (Electron/Tauri)
- [ ] Export to `.md` files
- [ ] Note templates
- [ ] Vim keybindings
