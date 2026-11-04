import { useCallback, useEffect, useState } from 'react'
import { PlayerProvider, usePlayer } from './context/PlayerContext'
import { UserProvider, useUser } from './context/UserContext'
import { ToastProvider, useToast } from './context/ToastContext'
import BottomNav from './components/BottomNav'
import MiniPlayer from './components/MiniPlayer'
import PlayerSheet from './components/PlayerSheet'
import Sidebar from './components/Sidebar'
import DesktopBar from './components/DesktopBar'
import { Modal, Field, inputCls } from './components/ui'
import Home from './pages/Home'
import Search from './pages/Search'
import Library from './pages/Library'
import PlaylistPage from './pages/PlaylistPage'
import Auth from './pages/Auth'
import ArtistPage from './pages/ArtistPage'
import AlbumPage from './pages/AlbumPage'
import SongPage from './pages/SongPage'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import History from './pages/History'
import Notifications from './pages/Notifications'
import Browse, { GenrePage } from './pages/Browse'
import Queue from './pages/Queue'
import Lyrics from './pages/Lyrics'
import Settings from './pages/Settings'
import Premium from './pages/Premium'
import Admin from './pages/Admin'

function Shell() {
  const [view, setView] = useState({ name: 'home', id: null })
  const [createOpen, setCreateOpen] = useState(false)
  const [pickerFor, setPickerFor] = useState(null)
  const { user, customPlaylists, addToPlaylist, logout } = useUser()
  const { toast } = useToast()

  const go = useCallback((name) => setView({ name, id: null }), [])
  const openPlaylist = useCallback((id) => setView({ name: 'playlist', id }), [])
  const openLiked = useCallback(() => setView({ name: 'playlist', id: 'liked' }), [])
  const openArtistPlaylist = useCallback((name) => setView({ name: 'playlist', id: `ap-${name}` }), [])
  const openArtist = useCallback((name) => setView({ name: 'artist', id: name }), [])
  const openAlbum = useCallback((name) => setView({ name: 'album', id: name }), [])
  const openSong = useCallback((id) => setView({ name: 'song', id }), [])
  const openGenre = useCallback((name) => setView({ name: 'genre', id: name }), [])
  const goBack = useCallback(() => setView({ name: 'home', id: null }), [])
  const openPlaylistPicker = useCallback((trackId) => setPickerFor(trackId), [])

  // Admin guard: only admins can open Admin dashboard (as a page, not a button)
  const isAdmin = user?.role === 'admin' || user?.email === 'admin@geetplays.com'

  const navKey = view.name

  useEffect(() => {
    const on = (e) => { if (e.key === 'Escape') setPickerFor(null) }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [])

  useEffect(() => {
    if (view.name === 'admin' && !isAdmin) {
      setView({ name: 'home', id: null })
      toast('Admin access required — sign in as admin@geetplays.com')
    }
  }, [view.name, isAdmin])

  if (!user) {
    return (
      <div className="min-h-dvh bg-ink text-white">
        <Auth go={go} />
      </div>
    )
  }

  const pass = { openSong, openAlbum, openArtist, openPlaylistPicker, openArtistPlaylist }

  return (
    <div className="h-dvh flex flex-col bg-ink text-white overflow-hidden">
      <div className="flex flex-1 min-h-0">
        <Sidebar view={navKey} go={go} openPlaylist={openPlaylist} openLiked={openLiked} openArtist={openArtist} openAlbum={openAlbum}
          createOpen={createOpen} setCreateOpen={setCreateOpen} />
        {/* Full-width main: fills remaining space, no max-width cap */}
        <main
          className="flex-1 min-w-0 w-full bg-panel md:rounded-lg md:m-2 md:ml-0 overflow-y-auto no-scrollbar overflow-x-hidden relative"
          id="main-scroll"
        >
          <div className="w-full min-w-0">
            {view.name === 'home' && <Home openPlaylist={openPlaylist} openArtistPlaylist={openArtistPlaylist} {...pass} go={go} />}
            {view.name === 'search' && <Search {...pass} />}
            {view.name === 'library' && <Library openPlaylist={openPlaylist} openLiked={openLiked} openArtist={openArtist} openAlbum={openAlbum} />}
            {view.name === 'playlist' && <PlaylistPage id={view.id} goBack={goBack} {...pass} />}
            {view.name === 'artist' && <ArtistPage name={view.id} goBack={goBack} {...pass} />}
            {view.name === 'album' && <AlbumPage name={view.id} goBack={goBack} {...pass} />}
            {view.name === 'song' && <SongPage id={view.id} goBack={goBack} {...pass} />}
            {view.name === 'browse' && <Browse goBack={goBack} openGenre={openGenre} openPlaylist={openPlaylist} openAlbum={openAlbum} openSong={openSong} />}
            {view.name === 'genre' && <GenrePage name={view.id} goBack={goBack} openAlbum={openAlbum} openArtist={openArtist} openPlaylist={openPlaylist} />}
            {view.name === 'profile' && <Profile openPlaylist={openPlaylist} openArtist={openArtist} go={go} />}
            {view.name === 'edit-profile' && <EditProfile goBack={() => setView({ name: 'profile', id: null })} />}
            {view.name === 'history' && <History goBack={goBack} />}
            {view.name === 'notifications' && <Notifications goBack={goBack} />}
            {view.name === 'queue' && <Queue goBack={goBack} />}
            {view.name === 'lyrics' && <Lyrics goBack={goBack} />}
            {view.name === 'settings' && <Settings goBack={goBack} openPremium={() => go('premium')} logout={logout} />}
            {view.name === 'premium' && <Premium goBack={goBack} />}
            {view.name === 'admin' && <Admin goBack={goBack} />}
          </div>
        </main>
      </div>
      <DesktopBar go={go} />
      <MiniPlayer />
      <BottomNav view={navKey} go={go} />
      <PlayerSheet go={go} />

      <Modal open={!!pickerFor} onClose={() => setPickerFor(null)} title="Add to playlist">
        {customPlaylists.length === 0 ? (
          <p className="text-muted text-sm">No playlists yet. Create one from Your Library (+).</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {customPlaylists.map(p => (
              <li key={p.id}>
                <button onClick={() => { addToPlaylist(p.id, pickerFor); toast(`Added to “${p.name}”`); setPickerFor(null) }}
                  className="w-full flex items-center gap-3 p-2.5 rounded-md hover:bg-white/10 text-left">
                  <img src={p.cover} alt="" className="w-10 h-10 rounded-md object-cover bg-elev" />
                  <span className="min-w-0"><span className="block truncate text-[15px]">{p.name}</span><span className="block text-[13px] text-muted">{p.trackIds.length} songs</span></span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <UserProvider>
        <PlayerProvider>
          <Shell />
        </PlayerProvider>
      </UserProvider>
    </ToastProvider>
  )
}
