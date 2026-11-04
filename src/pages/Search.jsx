import { useMemo, useState } from 'react'
import { Search as SearchIcon, X, Clock3 } from 'lucide-react'
import { tracks, categories, artists, albumsCatalog, playlists } from '../data/catalog'
import { usePlayer } from '../context/PlayerContext'
import { useToast } from '../context/ToastContext'
import TrackRow from '../components/TrackRow'

function load(key, fb) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fb } catch { return fb } }
function save(v) { try { localStorage.setItem('sp_recent', JSON.stringify(v)) } catch {} }

export default function Search({ openSong, openAlbum, openArtist, openPlaylistPicker, openPlaylist }) {
  const [q, setQ] = useState('')
  const [tab, setTab] = useState('All')
  const [recent, setRecent] = useState(() => load('sp_recent', ['Neon Coast', 'Chill', 'Night Drive']))
  const { startTrack, playAll } = usePlayer()
  const { toast } = useToast()

  const results = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return []
    return tracks.filter(t => t.title.toLowerCase().includes(s) || t.artist.toLowerCase().includes(s) || t.album.toLowerCase().includes(s) || t.genre.toLowerCase().includes(s))
  }, [q])

  const matchedArtists = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return []
    return artists.filter(a => a.name.toLowerCase().includes(s))
  }, [q])

  const matchedAlbums = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return []
    return albumsCatalog.filter(a => a.name.toLowerCase().includes(s) || a.artist.toLowerCase().includes(s))
  }, [q])

  const matchedPlaylists = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return []
    return playlists.filter(p => p.name.toLowerCase().includes(s))
  }, [q])

  const pick = (term) => {
    const next_ = [term, ...recent.filter(r => r !== term)].slice(0, 8)
    setRecent(next_); save(next_)
  }

  return (
    <div className="pb-40 md:pb-8">
      <header className="sticky top-0 z-30 bg-[#121212]/95 backdrop-blur-md px-4 pt-3 pb-2">
        <h1 className="text-[22px] md:text-3xl font-bold mb-3">Search</h1>
        <div className="flex items-center gap-2 bg-white rounded-md px-3 py-2.5 text-black">
          <SearchIcon size={20} className="shrink-0" />
          <input autoFocus={false} value={q} onChange={e => setQ(e.target.value)} placeholder="What do you want to listen to?"
            className="flex-1 min-w-0 bg-transparent outline-none text-[15px] placeholder:text-[#616161]" />
          {q && <button aria-label="Clear" onClick={() => setQ('')} className="p-1"><X size={20} /></button>}
        </div>
      </header>

      {q.trim() ? (
        <div className="mt-2">
          <div className="flex gap-2 px-4 py-2 overflow-x-auto no-scrollbar">
            {['All', 'Songs', 'Artists', 'Albums', 'Playlists'].map(t => (
              <button key={t} onClick={() => setTab(t)} className={`text-[13px] font-medium px-3.5 py-1.5 rounded-full whitespace-nowrap ${tab === t ? 'bg-spot text-black' : 'bg-white/10 hover:bg-white/20'}`}>{t}</button>
            ))}
          </div>

          {(tab === 'All' || tab === 'Songs') && results.length > 0 && (
            <section className="mt-1">
              {tab === 'All' && <h2 className="px-4 text-base font-bold py-1">Songs</h2>}
              {results.map((t, i) => (
                <TrackRow key={t.id} track={t} index={i} queueIds={results.map(x => x.id)} openSong={openSong} openAlbum={openAlbum} openArtist={openArtist} openPlaylistPicker={openPlaylistPicker} />
              ))}
            </section>
          )}

          {(tab === 'All' || tab === 'Artists') && matchedArtists.length > 0 && (
            <section className="mt-4">
              <h2 className="px-4 text-base font-bold py-1">Artists</h2>
              {matchedArtists.map(a => (
                <button key={a.name} onClick={() => openArtist(a.name)} className="flex items-center gap-3 w-full px-4 py-2 hover:bg-white/5 text-left">
                  <img src={a.img} alt="" className="w-11 h-11 rounded-full object-cover bg-elev" />
                  <span className="flex-1 min-w-0"><span className="block truncate text-[15px]">{a.name}</span><span className="block text-[13px] text-muted">Artist</span></span>
                  <span className="text-[13px] font-bold border border-white/40 rounded-full px-3 py-1">Follow</span>
                </button>
              ))}
            </section>
          )}

          {(tab === 'All' || tab === 'Albums') && matchedAlbums.length > 0 && (
            <section className="mt-4">
              <h2 className="px-4 text-base font-bold py-1">Albums</h2>
              {matchedAlbums.map(a => (
                <button key={a.name} onClick={() => openAlbum(a.name)} className="flex items-center gap-3 w-full px-4 py-2 hover:bg-white/5 text-left">
                  <img src={a.cover} alt="" className="w-11 h-11 rounded-md object-cover bg-elev" />
                  <span className="flex-1 min-w-0"><span className="block truncate text-[15px]">{a.name}</span><span className="block text-[13px] text-muted">Album • {a.artist} • {a.year}</span></span>
                </button>
              ))}
            </section>
          )}

          {(tab === 'All' || tab === 'Playlists') && matchedPlaylists.length > 0 && (
            <section className="mt-4">
              <h2 className="px-4 text-base font-bold py-1">Playlists</h2>
              {matchedPlaylists.map(p => (
                <button key={p.id} onClick={() => openPlaylist(p.id)} className="flex items-center gap-3 w-full px-4 py-2 hover:bg-white/5 text-left">
                  <img src={p.cover} alt="" className="w-11 h-11 rounded-md object-cover bg-elev" />
                  <span className="flex-1 min-w-0"><span className="block truncate text-[15px]">{p.name}</span><span className="block text-[13px] text-muted">Playlist • {p.owner} • {p.trackIds.length} songs</span></span>
                </button>
              ))}
            </section>
          )}

          {results.length === 0 && matchedArtists.length === 0 && matchedAlbums.length === 0 && matchedPlaylists.length === 0 && (
            <div className="px-4 py-16 text-center">
              <p className="text-xl font-bold">No results found for “{q}”</p>
              <p className="text-muted mt-2 text-sm">Please make sure your words are spelled correctly, or use fewer keywords.</p>
            </div>
          )}
        </div>
      ) : (
        <>
          {recent.length > 0 && (
            <section className="mt-4">
              <div className="flex items-center justify-between px-4 mb-2">
                <h2 className="text-lg font-bold">Recent searches</h2>
                <button onClick={() => { setRecent([]); save([]) }} className="text-[13px] text-muted hover:text-white">Clear all</button>
              </div>
              {recent.map(r => (
                <button key={r} onClick={() => { setQ(r); pick(r) }} className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-white/5">
                  <Clock3 size={20} className="text-muted shrink-0" />
                  <span className="flex-1 truncate">{r}</span>
                  <span onClick={e => { e.stopPropagation(); const n = recent.filter(x => x !== r); setRecent(n); save(n) }} className="px-3 text-muted text-sm">Clear</span>
                </button>
              ))}
            </section>
          )}
          <section className="mt-6">
            <h2 className="px-4 text-lg font-bold mb-3">Trending searches</h2>
            <div className="flex gap-2 px-4 overflow-x-auto no-scrollbar">
              {['Pop', 'Electronic', 'Neon Coast', 'Workout', 'Chill', 'Jazz'].map(t => (
                <button key={t} onClick={() => { setQ(t); pick(t) }} className="text-[13px] bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-full whitespace-nowrap">{t}</button>
              ))}
            </div>
          </section>
          <section className="mt-6">
            <h2 className="px-4 text-lg font-bold mb-3">Browse all</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 px-4">
              {categories.map(c => (
                <button key={c.name} onClick={() => { setQ(c.name); pick(c.name) }} className="relative h-24 rounded-lg overflow-hidden text-left active:scale-[.98] transition" style={{ background: c.color }}>
                  <span className="absolute top-2.5 left-3 font-bold text-[15px] drop-shadow">{c.name}</span>
                  <span className="absolute -right-3 -bottom-2 w-16 h-16 rounded-md rotate-[25deg] bg-black/25 shadow-lg flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z" /></svg>
                  </span>
                </button>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
