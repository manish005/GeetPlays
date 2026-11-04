import { useMemo, useState } from 'react'
import { ArrowLeft, Play, Heart, Shuffle, MoreHorizontal, ArrowUp, ArrowDown, X, Pencil, Trash2, Search } from 'lucide-react'
import { playlistById, trackById, fmt, artistPlaylistById } from '../data/catalog'
import { usePlayer } from '../context/PlayerContext'
import { useUser } from '../context/UserContext'
import { useToast } from '../context/ToastContext'
import { Modal, Field, inputCls, Menu } from '../components/ui'
import Cover from '../components/Cover'
import TrackRow from '../components/TrackRow'

export default function PlaylistPage({ id, goBack, openPlaylist, openSong, openAlbum, openArtist }) {
  const { playAll, playPlaylist, liked, toggleLike, currentId } = usePlayer()
  const { customPlaylists, updatePlaylist, addToPlaylist, removeFromPlaylist, reorderPlaylist, deletePlaylist } = useUser()
  const { toast } = useToast()
  const [sort, setSort] = useState('default')
  const [q, setQ] = useState('')
  const [editOpen, setEditOpen] = useState(false)
  const [form, setForm] = useState({ name: '', desc: '' })
  const [menuOpen, setMenuOpen] = useState(false)

  const custom = customPlaylists.find(p => p.id === id)
  const builtIn = playlistById[id] || artistPlaylistById[id]

  if (id === 'liked') {
    const ids = [...liked].filter(tid => trackById[tid])
    const sorted = sortList(ids, sort, q)
    return (
      <div className="w-full min-w-0 pb-40 md:pb-8">
        <PlaylistHero
          title="Liked Songs" desc="" cover={null} count={ids.length} goBack={goBack}
          liked={true} onLike={() => {}}
          onPlay={() => playAll(ids)}
          isCustom={false}
          menuOpen={false}
        />
        <PlaylistTools sort={sort} setSort={setSort} q={q} setQ={setQ} />
        {sorted.length === 0 && <p className="px-4 py-10 text-muted">Songs you like will live here.</p>}
        {sorted.map((tid, i) => {
          const t = trackById[tid]; if (!t) return null
          return <TrackRow key={tid} track={t} index={i} queueIds={ids} />
        })}
      </div>
    )
  }

  const p = custom || builtIn
  if (!p) return <p className="p-6 text-muted">Playlist not found. <button className="underline" onClick={goBack}>Go back</button></p>
  const tracks = p.trackIds.map(t => trackById[t]).filter(Boolean)
  const ids = tracks.map(t => t.id)
  const sortedIds = sortList(ids, sort, q)
  const isLiked = liked.has(p.id)
  const isCustom = !!custom
  const totalDur = tracks.reduce((s, t) => s + t.dur, 0)
  const durLabel = `${Math.floor(totalDur / 3600)}h ${Math.floor(totalDur % 3600 / 60)}m`

  const doRename = (e) => { e.preventDefault(); updatePlaylist(id, { name: form.name, desc: form.desc }); setEditOpen(false); toast('Playlist updated') }

  return (
    <div className="pb-40 md:pb-8">
      <PlaylistHero
        title={p.name} desc={p.desc} cover={p.cover} count={tracks.length} goBack={goBack}
        liked={isLiked} onLike={() => { toggleLike(p.id); toast(isLiked ? 'Removed from library' : 'Saved to your library') }}
        onPlay={() => ids.length && playPlaylist(ids[0] ? id : id, currentId)}
        owner={p.owner} durLabel={durLabel} visibility={p.visibility}
        isCustom={isCustom}
        onEdit={() => { setForm({ name: p.name, desc: p.desc || '' }); setEditOpen(true) }}
        onDelete={() => { deletePlaylist(id); toast('Playlist deleted'); goBack() }}
        menuOpen={menuOpen} setMenuOpen={setMenuOpen}
      />
      <PlaylistTools sort={sort} setSort={setSort} q={q} setQ={setQ} />
      {isCustom && (
        <div>
          {sortedIds.map((tid, i) => {
            const t = trackById[tid]; if (!t) return null
            const idx = ids.indexOf(tid)
            return (
              <div key={tid} className="flex items-center">
                <div className="flex-1 min-w-0"><TrackRow track={t} index={i} queueIds={ids} /></div>
                <div className="flex flex-col -ml-1">
                  <button aria-label="Move up" onClick={() => reorderPlaylist(id, idx, Math.max(0, idx - 1))} className="p-1.5 text-muted hover:text-white"><ArrowUp size={14} /></button>
                  <button aria-label="Move down" onClick={() => reorderPlaylist(id, idx, Math.min(ids.length - 1, idx + 1))} className="p-1.5 text-muted hover:text-white"><ArrowDown size={14} /></button>
                </div>
                <button aria-label="Remove" onClick={() => { removeFromPlaylist(id, tid); toast('Removed from playlist') }} className="p-2 text-muted hover:text-white mr-1"><X size={16} /></button>
              </div>
            )
          })}
          {ids.length === 0 && <p className="px-4 py-10 text-muted">No songs yet. Add some from Search or the “+” menu on any track.</p>}
        </div>
      )}
      {!isCustom && sortedIds.map((tid, i) => {
        const t = trackById[tid]; if (!t) return null
        return <TrackRow key={tid} track={t} index={i} queueIds={ids} />
      })}

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit playlist">
        <form onSubmit={doRename} className="flex flex-col gap-4">
          <Field label="Name"><input autoFocus value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} /></Field>
          <Field label="Description"><textarea value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} className={`${inputCls} min-h-[80px]`} /></Field>
          <button type="submit" className="w-full bg-spot text-black font-bold rounded-full py-3">Save</button>
        </form>
      </Modal>
    </div>
  )
}

function sortList(ids, sort, q) {
  let list = q.trim() ? ids.filter(id => { const t = trackById[id]; return t && `${t.title} ${t.artist} ${t.album}`.toLowerCase().includes(q.toLowerCase()) }) : [...ids]
  if (sort === 'title') list.sort((a, b) => trackById[a]?.title.localeCompare(trackById[b]?.title || ''))
  if (sort === 'artist') list.sort((a, b) => trackById[a]?.artist.localeCompare(trackById[b]?.artist || ''))
  if (sort === 'album') list.sort((a, b) => trackById[a]?.album.localeCompare(trackById[b]?.album || ''))
  return list
}

function PlaylistTools({ sort, setSort, q, setQ }) {
  return (
    <div className="flex items-center gap-3 px-4 md:px-8 py-3 mt-1 mb-4 w-full">
      <div className="flex items-center gap-2 bg-elev rounded-full px-4 py-2.5 flex-1 min-w-0">
        <Search size={16} className="text-muted shrink-0" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Find in playlist" className="bg-transparent outline-none text-[13px] w-full placeholder:text-muted" />
      </div>
      <select value={sort} onChange={e => setSort(e.target.value)} className="bg-elev rounded-full px-3.5 py-2.5 text-[13px] outline-none shrink-0">
        <option value="default">Custom order</option>
        <option value="title">Title A–Z</option>
        <option value="artist">Artist A–Z</option>
        <option value="album">Album A–Z</option>
      </select>
    </div>
  )
}

function PlaylistHero({ title, desc, cover, count, goBack, liked, onLike, onPlay, owner, durLabel, visibility, isCustom, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const durText = durLabel ? `${count} songs, ${durLabel}` : `${count} songs`
  return (
    <div className="relative w-full">
      {/* Gradient backdrop */}
      <div className="absolute inset-0 h-[420px] md:h-[480px] bg-gradient-to-b from-[#5038E6]/70 via-[#2a1a4e]/60 to-[#121212] pointer-events-none" />
      {/* Back: pinned top-left with safe area */}
      <button aria-label="Back" onClick={goBack}
        className="absolute z-20 p-2.5 rounded-full bg-black/50 backdrop-blur hover:bg-black/70"
        style={{ top: 'max(16px, env(safe-area-inset-top))', left: '16px' }}>
        <ArrowLeft size={22} />
      </button>

      {/* Single vertical flow — no absolute overlaps */}
      <div className="relative z-10 flex flex-col items-center md:items-start gap-3 px-4 md:px-8 pt-16 md:pt-20 pb-4 w-full">
        {cover ? (
          <Cover src={cover} alt={title} className="w-44 h-44 md:w-56 md:h-56 shadow-2xl" rounded="rounded-lg" />
        ) : (
          <span className="w-44 h-44 md:w-56 md:h-56 rounded-lg bg-gradient-to-br from-[#450AF5] via-[#C4EFE9] to-[#F7F3E6] flex items-center justify-center shadow-2xl">
            <Heart size={80} fill="#fff" className="text-white" />
          </span>
        )}

        <p className="text-[11px] md:text-xs font-bold tracking-[0.14em] text-white/80 uppercase mt-2">Playlist</p>
        <h1 className="text-3xl md:text-6xl font-black tracking-tight leading-tight text-center md:text-left w-full">{title}</h1>
        {desc && <p className="text-muted text-sm md:text-base text-center md:text-left w-full">{desc}</p>}
        <p className="text-sm text-center md:text-left w-full">
          <span className="font-semibold">{owner || 'Spotify'}</span>{' '}
          <span className="text-muted">• {durText}{visibility ? ` • ${visibility}` : ''}</span>
        </p>

        {/* Actions row: secondary left, play right */}
        <div className="flex items-center justify-between w-full mt-2">
          <div className="flex items-center gap-4">
            <button onClick={onLike} aria-label="Save" className={liked ? 'text-spot' : 'text-muted hover:text-white'}>
              <Heart size={26} fill={liked ? '#1ED760' : 'none'} />
            </button>
            <button aria-label="Shuffle play" className="text-muted hover:text-white"><Shuffle size={24} /></button>
            <div className="relative">
              <button aria-label="More" onClick={() => setMenuOpen(!menuOpen)} className="text-muted hover:text-white"><MoreHorizontal size={28} /></button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute left-0 top-9 z-20 w-48 bg-elev rounded-lg shadow-2xl py-1.5">
                    {isCustom ? (<>
                      <button onClick={() => { onEdit && onEdit(); setMenuOpen(false) }} className="w-full text-left px-3.5 py-2 text-[14px] hover:bg-white/10 flex items-center gap-2.5"><Pencil size={15} /> Edit details</button>
                      <button onClick={() => { onDelete && onDelete() }} className="w-full text-left px-3.5 py-2 text-[14px] hover:bg-white/10 text-red-400 flex items-center gap-2.5"><Trash2 size={15} /> Delete playlist</button>
                    </>) : (
                      <p className="px-3.5 py-2 text-[13px] text-muted">Details available on your own playlists.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          <button onClick={onPlay} aria-label="Play"
            className="w-[52px] h-[52px] rounded-full bg-spot text-black flex items-center justify-center hover:scale-105 active:scale-95 shadow-[0_8px_24px_rgba(0,0,0,0.5)] shrink-0">
            <Play size={24} fill="currentColor" className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
