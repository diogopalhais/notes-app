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
- **Secure Email Auth** - Magic link authentication (passwordless)
- **Server-side Security** - Permission rules prevent unauthorized access
- **Native Desktop App** - Multiplatform via Tauri (macOS, Windows, Linux)

## Setup

### 1. Create an InstantDB App

1. Go to [instantdb.com](https://instantdb.com)
2. Create a new app
3. Copy your App ID

### 2. Configure Permissions (IMPORTANT for Security)

In your InstantDB dashboard, go to **Permissions** and add these rules:

```json
{
  "$users": {
    "allow": {
      "view": "false",
      "create": "false",
      "update": "false",
      "delete": "false"
    }
  },
  "notes": {
    "allow": {
      "view": "auth.id != null && data.ownerId == auth.id",
      "create": "auth.id != null && newData.ownerId == auth.id",
      "update": "auth.id != null && data.ownerId == auth.id && newData.ownerId == auth.id",
      "delete": "auth.id != null && data.ownerId == auth.id"
    }
  },
  "folders": {
    "allow": {
      "view": "auth.id != null && data.ownerId == auth.id",
      "create": "auth.id != null && newData.ownerId == auth.id",
      "update": "auth.id != null && data.ownerId == auth.id && newData.ownerId == auth.id",
      "delete": "auth.id != null && data.ownerId == auth.id"
    }
  },
  "tags": {
    "allow": {
      "view": "auth.id != null && data.ownerId == auth.id",
      "create": "auth.id != null && newData.ownerId == auth.id",
      "update": "auth.id != null && data.ownerId == auth.id && newData.ownerId == auth.id",
      "delete": "auth.id != null && data.ownerId == auth.id"
    }
  }
}
```

These rules ensure:
- Users cannot access the `$users` table
- Users can only read/write their own notes, folders, and tags
- The `ownerId` cannot be changed after creation

### 3. Configure Environment

Create a `.env` file in the root:

```bash
VITE_INSTANT_APP_ID=your-app-id-here
```

### 4. Install & Run (Web)

```bash
npm install
npm run dev
```

Open http://localhost:5173

---

## Desktop App (Tauri)

The app includes a native desktop version built with [Tauri](https://tauri.app/), supporting **macOS**, **Windows**, and **Linux**.

### Prerequisites

1. **Rust** - Install via [rustup.rs](https://rustup.rs):
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. **Platform-specific dependencies:**

   **macOS:**
   ```bash
   xcode-select --install
   ```

   **Windows:**
   - [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) with "C++ build tools" workload
   - [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) (pre-installed on Windows 11)

   **Linux (Ubuntu/Debian):**
   ```bash
   sudo apt update
   sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev
   ```

   **Linux (Fedora):**
   ```bash
   sudo dnf install webkit2gtk4.1-devel openssl-devel curl wget file libappindicator-gtk3-devel librsvg2-devel
   sudo dnf group install "C Development Tools and Libraries"
   ```

### Run Desktop App (Development)

```bash
npm run tauri:dev
```

This starts both the Vite dev server and the Tauri native window with hot reload.

### Build Desktop App (Production)

```bash
npm run tauri:build
```

This creates native installers in `src-tauri/target/release/bundle/`:
- **macOS**: `.app` and `.dmg`
- **Windows**: `.exe` and `.msi`
- **Linux**: `.deb`, `.AppImage`, and `.rpm`

### Debug Build

```bash
npm run tauri:build:debug
```

Creates a debug build with developer tools enabled.

---

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
- **Tauri 2** - Native desktop app

## Project Structure

```
src/
├── components/
│   ├── AuthModal.tsx     # Email magic link auth
│   ├── Editor.tsx        # CodeMirror editor
│   ├── FolderTree.tsx    # Folder navigation
│   ├── NoteEditor.tsx    # Editor + preview wrapper
│   ├── NoteList.tsx      # Note list with search
│   ├── Preview.tsx       # Markdown preview
│   └── Sidebar.tsx       # Main sidebar
├── db/
│   └── instant.ts        # InstantDB config
├── hooks/
│   ├── useAuth.ts        # InstantDB auth
│   ├── useFolders.ts     # Folder operations
│   ├── useNotes.ts       # Note CRUD
│   ├── useTags.ts        # Tag operations
│   ├── useTauri.ts       # Tauri environment detection
│   └── useTheme.ts       # Theme toggle
├── App.tsx
├── main.tsx
└── index.css             # Tailwind + theme vars
src-tauri/
├── src/
│   ├── lib.rs            # Tauri backend
│   └── main.rs           # Entry point
├── icons/                # App icons for all platforms
├── Cargo.toml            # Rust dependencies
└── tauri.conf.json       # Tauri configuration
instant.perms.ts          # Permission rules (for reference)
```

## Multi-device Sync

1. Sign in with your email on any device
2. Check your email for the magic code
3. Enter the code to authenticate
4. Your notes will automatically sync across all devices where you're signed in

**Security:** Your notes are protected by server-side permission rules. Only you can access your notes - no one else can read them, even with direct database access.

## Deployment

### Web Deployment

#### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repo
3. Add environment variable: `VITE_INSTANT_APP_ID=your-app-id`
4. Deploy

#### Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) and import your repo
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variable: `VITE_INSTANT_APP_ID=your-app-id`
6. Deploy

#### Cloudflare Pages

1. Push your code to GitHub
2. Go to Cloudflare Dashboard → Pages
3. Connect your repo
4. Build command: `npm run build`
5. Build output directory: `dist`
6. Add environment variable: `VITE_INSTANT_APP_ID=your-app-id`
7. Deploy

#### Manual (Any Static Host)

```bash
npm run build
# Upload the `dist` folder to your host
```

### Desktop App Distribution

After running `npm run tauri:build`, distribute the appropriate installer:
- **macOS**: Share the `.dmg` file
- **Windows**: Share the `.msi` or `.exe` installer
- **Linux**: Share the `.AppImage`, `.deb`, or `.rpm` package

## CI/CD for Desktop Builds

For automated cross-platform builds, add a GitHub Actions workflow:

```yaml
# .github/workflows/release.yml
name: Release
on:
  push:
    tags: ['v*']

jobs:
  release:
    permissions:
      contents: write
    strategy:
      fail-fast: false
      matrix:
        platform: [macos-latest, ubuntu-22.04, windows-latest]
    runs-on: ${{ matrix.platform }}
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          
      - name: Install Rust
        uses: dtolnay/rust-action@stable
        
      - name: Install dependencies (Ubuntu)
        if: matrix.platform == 'ubuntu-22.04'
        run: |
          sudo apt-get update
          sudo apt-get install -y libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf
          
      - name: Install npm dependencies
        run: npm ci
        
      - name: Build
        uses: tauri-apps/tauri-action@v0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          VITE_INSTANT_APP_ID: ${{ secrets.VITE_INSTANT_APP_ID }}
        with:
          tagName: v__VERSION__
          releaseName: 'Notes v__VERSION__'
          releaseBody: 'See the assets to download this version and install.'
          releaseDraft: true
          prerelease: false
```

## Future Plans

- [x] Desktop app (Tauri) ✅
- [ ] Mobile app (React Native / Tauri Mobile)
- [ ] Export to `.md` files
- [ ] Note templates
- [ ] Vim keybindings
