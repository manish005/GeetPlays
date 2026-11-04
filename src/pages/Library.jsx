import { useState } from 'react'
import { ArrowDownNarrowWide, Plus, Heart } from 'lucide-react'
import { playlists, tracks, albumsCatalog, artists } from '../data/catalog'
import { usePlayer } from '../context/PlayerContext'
import { useUser } from '../context/UserContext'
import Cover from '../components/Cover'
import TrackRow from '../components/TrackRow'

const FILTERS = ['All', 'Playlists', 'Artists', 'Albums']

export default function Library({ openPlaylist, openLiked, openArtist, openAlbum }) {
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const { liked } = usePlayer()
  const { customPlaylists, profile } = useUser()

  const showPlaylists = filter === 'All' || filter === 'Playlists'
  const showArtists = filter === 'All' || filter === 'Artists'
  const showAlbums = filter === 'All' || filter === 'Albums'

  const q = query.toLowerCase()
  const match = (s) => !q || s.toLowerCase().includes(q)

  return (
    <div className="pb-40 md:pb-8">
      <header className="sticky top-0 z-30 bg-[#121212]/95 backdrop-blur-md px-4 pt-3 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-[#8D67AB] text-black font-bold flex items-center justify-center text-sm">{(profile.name || 'G')[0].toUpperCase()}</span>
          <h1 className="text-[22px] font-bold">Your Library</h1>
        </div>
        <button className="p-2 text-muted hover:text-white" aria-label="Add"><Plus size={22} /></button>
      </header>

      <div className="flex gap-2 px-4 py-2 overflow-x-auto no-scrollbar">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-[13px] font-medium px-3.5 py-1.5 rounded-full whitespace-nowrap ${filter === f ? 'bg-spot text-black' : 'bg-white/10 hover:bg-white/20'}`}>{f}</button>
        ))}
      </div>

      <div className="flex items-center gap-3 px-4 py-1">
        <span className="flex items-center gap-2 text-muted text-[13px] shrink-0"><ArrowDownNarrowWide size={16} /> Recents</span>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search in Your Library"
          className="flex-1 min-w-0 bg-elev rounded-md px-3 py-1.5 text-[13px] outline-none placeholder:text-muted" />
      </div>

      <div className="mt-1">
        {match('Liked Songs') && (
          <button onClick={openLiked} className="flex items-center gap-3 w-full px-4 py-2 hover:bg-white/5 text-left">
            <span className="w-12 h-12 rounded-md bg-gradient-to-br from-[#450AF5] via-[#C4EFE9] to-[#F7F3E6] flex items-center justify-center shrink-0">
              <Heart size={22} fill="#fff" className="text-white" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-[15px] truncate">Liked Songs</span>
              <span className="block text-[13px] text-muted truncate">Playlist • {liked.size} songs</span>
            </span>
          </button>
        )}

        {showPlaylists && [...customPlaylists, ...playlists].filter(p => match(p.name)).map(p => (
          <button key={p.id} onClick={() => openPlaylist(p.id)} className="flex items-center gap-3 w-full px-4 py-2 hover:bg-white/5 text-left">
            <Cover src={p.cover} alt={p.name} className="w-12 h-12 shrink-0" />
            <span className="flex-1 min-w-0">
              <span className="block text-[15px] truncate">{p.name}</span>
              <span className="block text-[13px] text-muted truncate">Playlist • {p.owner}</span>
            </span>
          </button>
        ))}

        {showArtists && artists.filter(a => match(a.name)).slice(0, 8).map(a => (
          <button key={a.name} onClick={() => openArtist(a.name)} className="flex items-center gap-3 w-full px-4 py-2 hover:bg-white/5 text-left">
            <Cover src={a.img} alt={a.name} className="w-12 h-12 shrink-0" rounded="rounded-full" />
            <span className="flex-1 min-w-0">
              <span className="block text-[15px] truncate">{a.name}</span>
              <span className="block text-[13px] text-muted">Artist</span>
            </span>
          </button>
        ))}

        {showAlbums && albumsCatalog.filter(a => match(a.name) || match(a.artist)).map(a => (
          <button key={a.name} onClick={() => openAlbum(a.name)} className="flex items-center gap-3 w-full px-4 py-2 hover:bg-white/5 text-left">
            <Cover src={a.cover} alt={a.name} className="w-12 h-12 shrink-0" />
            <span className="flex-1 min-w-0">
              <span className="block text-[15px] truncate">{a.name}</span>
              <span className="block text-[13px] text-muted truncate">Album • {a.artist} • {a.year}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
