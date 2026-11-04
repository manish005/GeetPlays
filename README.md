# GeetPlays

Mobile-first music streaming web app inspired by Spotify. Original brand (GeetPlays), original components, original artwork seeds — no Spotify assets copied.

## Run locally

```bash
cd spotify-clone
npm install
npm run dev
```

Open `http://localhost:5173` — mobile view is primary (bottom nav, mini player, full-screen sheet), desktop adds sidebar + bottom bar.

## Features

- **Home**: Netflix-style full-width banner carousel (auto-advance + dot nav, no arrows), era carousels (90s / 80s / Gen Z), artist carousels by genre, language pills (English, Hindi, Marathi, Gujarati, Punjabi, Haryanvi, Tamil, Telugu, Kannada, Bhojpuri, …) that filter all content.
- **Player**: WebAudio synth engine (no audio files), play/pause/next/prev, seek, shuffle, repeat 0/1/all, volume + mute, like, queue, lyrics sync, full-screen mobile sheet.
- **Catalog**: 40 tracks, 23 artists, albums, playlists, moods/genres, trending top-10.
- **Pages**: Home, Search, Browse, Library, Playlist, Artist, Album, Song, Profile, Edit Profile, History, Notifications, Queue, Lyrics, Settings, Premium, Admin, Genre.
- **Auth**: login/signup/forgot/reset, guest mode, admin (`admin@geetplays.com` / `Admin@2026`).

## Design system

- Dark theme: `#000000` bg, `#121212` panel, `#181818` card, `#242424` elevated, `#1ED760` accent, `#B3B3B3` secondary, `#777777` muted.
- Spacing: 8px grid; mobile 16px, tablet 24px, desktop 32px horizontal padding.
- Typography: Inter-style system sans; greeting 32px desktop, sections 21–24px, cards 14–15px.

## Offline

Service worker caches app shell + album covers; player data (liked/history/playlists) in localStorage; WebAudio synth needs no files.

## Deploy

```bash
vercel --prod   # requires Vercel login
```

## Repo

```bash
git init
git add .
git commit -m "feat: GeetPlays music streaming clone"
git branch -M main
git remote add origin <github-repo-url>
git push -u origin main
```
