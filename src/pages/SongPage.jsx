import { ArrowLeft, Play, Heart, MoreHorizontal, Share2, ListPlus } from 'lucide-react'
import { trackById, tracks } from '../data/catalog'
import { usePlayer } from '../context/PlayerContext'
import { useToast } from '../context/ToastContext'
import Cover from '../components/Cover'
import TrackRow from '../components/TrackRow'

export default function SongPage({ id, goBack, openAlbum, openArtist, openPlaylistPicker }) {
  const { startTrack, liked, toggleLike, playAll } = usePlayer()
  const { toast } = useToast()
  const t = trackById[id]
  if (!t) return <p className="p-6 text-muted">Song not found. <button className="underline" onClick={goBack}>Go back</button></p>
  const isLiked = liked.has(t.id)
  const albumTracks = tracks.filter(x => x.album === t.album)
  const moreBy = tracks.filter(x => x.artist === t.artist && x.id !== t.id)
  const similar = tracks.filter(x => x.genre === t.genre && x.id !== t.id && x.artist !== t.artist)

  return (
    <div className="pb-40 md:pb-8">
      <div className="relative">
        <div className="h-64 md:h-80 bg-gradient-to-b from-[#3d2c4b]/80 to-[#121212]" />
        <button aria-label="Back" onClick={goBack} className="absolute top-3 left-3 p-2 rounded-full bg-black/40 backdrop-blur"><ArrowLeft size={22} /></button>
        <div className="absolute inset-x-0 top-16 md:top-24 px-4 flex flex-col md:flex-row md:items-end gap-5">
          <Cover src={t.cover} alt={t.title} className="w-44 h-44 md:w-56 md:h-56 shadow-2xl mx-auto md:mx-0" rounded="rounded-lg" />
          <div className="text-center md:text-left">
            <p className="text-[13px] font-semibold">Song</p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mt-1">{t.title}</h1>
            <p className="mt-3 text-sm md:text-base">
              <button className="font-semibold hover:underline" onClick={() => openArtist(t.artist)}>{t.artist}</button>
              <span className="text-muted"> • </span>
              <button className="hover:underline" onClick={() => openAlbum(t.album)}>{t.album}</button>
              <span className="text-muted"> • {t.year} • {t.genre}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-5 px-4 mt-4 md:mt-6">
          <button aria-label="Play" onClick={() => startTrack(t.id)} className="w-14 h-14 rounded-full bg-spot text-black flex items-center justify-center hover:scale-105 shadow-lg"><Play size={26} fill="currentColor" className="ml-0.5" /></button>
          <button aria-label="Like" onClick={() => { toggleLike(t.id); toast(isLiked ? 'Removed from Liked Songs' : 'Added to Liked Songs') }} className={isLiked ? 'text-spot' : 'text-muted hover:text-white'}><Heart size={26} fill={isLiked ? '#1ED760' : 'none'} /></button>
          <button aria-label="Add to playlist" onClick={() => openPlaylistPicker(t.id)} className="text-muted hover:text-white"><ListPlus size={24} /></button>
          <button aria-label="Share" onClick={() => { navigator.clipboard?.writeText(location.href); toast('Link copied') }} className="text-muted hover:text-white"><Share2 size={22} /></button>
          <button aria-label="More" className="text-muted hover:text-white"><MoreHorizontal size={28} /></button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-0 mt-4">
        <section>
          <h2 className="px-4 text-xl font-bold mb-2">Other songs from {t.album}</h2>
          {albumTracks.map((x, i) => <TrackRow key={x.id} track={x} index={i} queueIds={albumTracks.map(a => a.id)} />)}
        </section>
        <section>
          <h2 className="px-4 text-xl font-bold mb-2">More by {t.artist}</h2>
          {moreBy.slice(0, 6).map((x, i) => <TrackRow key={x.id} track={x} index={i} queueIds={moreBy.map(a => a.id)} showAlbum={false} />)}
          {moreBy.length === 0 && <p className="px-4 text-muted text-sm">No more songs by this artist yet.</p>}
        </section>
        <section>
          <h2 className="px-4 text-xl font-bold mb-2">Similar songs</h2>
          {similar.slice(0, 6).map((x, i) => <TrackRow key={x.id} track={x} index={i} queueIds={similar.map(a => a.id)} />)}
          {similar.length === 0 && <p className="px-4 text-muted text-sm">Nothing similar yet.</p>}
        </section>
      </div>
    </div>
  )
}
