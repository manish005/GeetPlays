import { useState } from 'react'
import { Heart, MoreHorizontal, ListPlus, Play, Info, Disc3, Mic2, ListMusic, Share2 } from 'lucide-react'
import { fmt } from '../data/catalog'
import { usePlayer } from '../context/PlayerContext'
import Cover from './Cover'

export default function TrackRow({ track, index, queueIds, showAlbum = true, openSong, openAlbum, openArtist, openPlaylistPicker }) {
  const { currentId, playing, startTrack, liked, toggleLike, togglePlay } = usePlayer()
  const [menuOpen, setMenuOpen] = useState(false)
  const isCurrent = currentId === track.id
  const isLiked = liked.has(track.id)

  return (
    <div className="group relative flex items-center gap-3 px-4 py-2 active:bg-white/10 cursor-pointer min-h-[56px]"
      onClick={() => { if (isCurrent) togglePlay(); else startTrack(track.id, queueIds) }}>
      <span className={`w-4 text-center text-sm ${isCurrent ? 'text-spot' : 'text-muted'}`}>
        {isCurrent && playing
          ? <span className="inline-flex items-end gap-[2px] h-3.5"><span className="w-[3px] bg-spot animate-pulse h-3.5" /><span className="w-[3px] bg-spot animate-pulse h-2" /><span className="w-[3px] bg-spot animate-pulse h-3" /></span>
          : index != null ? index + 1 : ''}
      </span>
      <Cover src={track.cover} alt={track.title} className="w-10 h-10 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className={`truncate text-[15px] ${isCurrent ? 'text-spot' : 'text-white'}`}>{track.title}</p>
        <p className="truncate text-[13px] text-muted">{track.artist}{showAlbum ? ` • ${track.album}` : ''}</p>
      </div>
      <button aria-label="Like" onClick={e => { e.stopPropagation(); toggleLike(track.id) }}
        className={`p-2 ${isLiked ? 'text-spot' : 'text-muted opacity-0 group-hover:opacity-100 max-md:opacity-100'}`}>
        <Heart size={18} fill={isLiked ? '#1ED760' : 'none'} />
      </button>
      <span className="text-[13px] text-muted w-8 text-right">{fmt(track.dur)}</span>
      <button aria-label="More" onClick={e => { e.stopPropagation(); setMenuOpen(!menuOpen) }} className="p-2 text-muted">
        <MoreHorizontal size={18} />
      </button>
      {menuOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={e => { e.stopPropagation(); setMenuOpen(false) }} />
          <div className="absolute right-4 top-12 z-20 w-56 bg-elev rounded-lg shadow-2xl py-1.5" onClick={e => e.stopPropagation()}>
            {openSong && <button onClick={() => { setMenuOpen(false); openSong(track.id) }} className="w-full text-left px-3.5 py-2 text-[14px] hover:bg-white/10 flex items-center gap-2.5"><Play size={15} /> Go to song</button>}
            {openArtist && <button onClick={() => { setMenuOpen(false); openArtist(track.artist) }} className="w-full text-left px-3.5 py-2 text-[14px] hover:bg-white/10 flex items-center gap-2.5"><Mic2 size={15} /> Go to artist</button>}
            {openAlbum && <button onClick={() => { setMenuOpen(false); openAlbum(track.album) }} className="w-full text-left px-3.5 py-2 text-[14px] hover:bg-white/10 flex items-center gap-2.5"><Disc3 size={15} /> Go to album</button>}
            {openPlaylistPicker && <button onClick={() => { setMenuOpen(false); openPlaylistPicker(track.id) }} className="w-full text-left px-3.5 py-2 text-[14px] hover:bg-white/10 flex items-center gap-2.5"><ListPlus size={15} /> Add to playlist</button>}
            <button onClick={() => { setMenuOpen(false); navigator.clipboard?.writeText(location.href); }} className="w-full text-left px-3.5 py-2 text-[14px] hover:bg-white/10 flex items-center gap-2.5"><Share2 size={15} /> Share</button>
          </div>
        </>
      )}
    </div>
  )
}
