import { ArrowLeft, Play, Shuffle, Heart, MoreHorizontal, Share2 } from 'lucide-react'
import { albumByName, trackById, tracks } from '../data/catalog'
import { usePlayer } from '../context/PlayerContext'
import { useToast } from '../context/ToastContext'
import Cover from '../components/Cover'
import TrackRow from '../components/TrackRow'

export default function AlbumPage({ name, goBack, openArtist }) {
  const { playAll, liked, toggleLike } = usePlayer()
  const { toast } = useToast()
  const a = albumByName[name]
  if (!a) return <p className="p-6 text-muted">Album not found. <button className="underline" onClick={goBack}>Go back</button></p>
  const albumTracks = a.trackIds.map(t => trackById[t]).filter(Boolean)
  const totalDur = albumTracks.reduce((s, t) => s + t.dur, 0)
  const mins = `${Math.floor(totalDur / 60)} min`
  const saved = liked.has(a.name)

  return (
    <div className="pb-40 md:pb-8">
      <div className="relative">
        <div className="h-64 md:h-80 bg-gradient-to-b from-[#5b3a6e]/80 to-[#121212]" />
        <button aria-label="Back" onClick={goBack} className="absolute top-3 left-3 p-2 rounded-full bg-black/40 backdrop-blur"><ArrowLeft size={22} /></button>
        <div className="absolute inset-x-0 top-16 md:top-24 px-4 flex flex-col md:flex-row md:items-end gap-5">
          <Cover src={a.cover} alt={a.name} className="w-44 h-44 md:w-56 md:h-56 shadow-2xl mx-auto md:mx-0" rounded="rounded-lg" />
          <div className="text-center md:text-left">
            <p className="text-[13px] font-semibold">Album</p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mt-1">{a.name}</h1>
            <p className="mt-3 text-sm md:text-base">
              <button className="font-semibold hover:underline" onClick={() => openArtist(a.artist)}>{a.artist}</button>
              <span className="text-muted"> • {a.year} • {albumTracks.length} songs, {mins}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-5 px-4 mt-4 md:mt-6">
          <button aria-label="Play" onClick={() => playAll(a.trackIds)} className="w-14 h-14 rounded-full bg-spot text-black flex items-center justify-center hover:scale-105 shadow-lg"><Play size={26} fill="currentColor" className="ml-0.5" /></button>
          <button aria-label="Shuffle" onClick={() => playAll([...a.trackIds].sort(() => Math.random() - .5))} className="text-muted hover:text-white"><Shuffle size={24} /></button>
          <button aria-label="Save" onClick={() => { toggleLike(a.name); toast(saved ? 'Removed from library' : 'Saved to your library') }} className={saved ? 'text-spot' : 'text-muted hover:text-white'}><Heart size={26} fill={saved ? '#1ED760' : 'none'} /></button>
          <button aria-label="Share" onClick={() => { navigator.clipboard?.writeText(location.href); toast('Link copied') }} className="text-muted hover:text-white"><Share2 size={22} /></button>
          <button aria-label="More" className="text-muted hover:text-white"><MoreHorizontal size={28} /></button>
        </div>
      </div>
      <div className="mt-2">
        {albumTracks.map((t, i) => <TrackRow key={t.id} track={t} index={i} queueIds={a.trackIds} />)}
      </div>
      <div className="px-4 mt-6">
        <h2 className="text-xl font-bold mb-3">More by {a.artist}</h2>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {tracks.filter(t => t.artist === a.artist && t.album !== a.name).slice(0, 8).map(t => (
            <button key={t.id} onClick={() => playAll(a.trackIds)} className="flex items-center gap-3 shrink-0 bg-white/5 hover:bg-white/10 rounded-md px-2 py-2 pr-4 text-left">
              <Cover src={t.cover} alt={t.title} className="w-11 h-11" />
              <span className="min-w-0"><span className="block text-sm font-medium truncate max-w-[160px]">{t.title}</span><span className="block text-xs text-muted truncate max-w-[160px]">{t.album}</span></span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
