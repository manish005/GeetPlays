import { Play, Pause, Shuffle } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import Cover from './Cover'

export default function MiniPlayer() {
  const { current, playing, progress, togglePlay, setSheetOpen, shuffle, setShuffle } = usePlayer()
  if (!current) return null
  const pct = Math.min(100, (progress / current.dur) * 100)
  return (
    <div className="md:hidden fixed bottom-[64px] inset-x-0 z-40 px-2">
      <div className="relative max-w-[430px] mx-auto bg-[#2A2A2A] rounded-lg overflow-hidden shadow-2xl cursor-pointer"
        onClick={() => setSheetOpen(true)}>
        <div className="flex items-center gap-3 pl-2 pr-1 py-1.5">
          <Cover src={current.cover} alt={current.title} className="w-10 h-10 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium">{current.title}</p>
            <p className="truncate text-xs text-muted">{current.artist}</p>
          </div>
          <button aria-label="Shuffle" onClick={e => { e.stopPropagation(); setShuffle(!shuffle) }}
            className={`p-2.5 ${shuffle ? 'text-spot' : 'text-white'}`}><Shuffle size={20} /></button>
          <button aria-label={playing ? 'Pause' : 'Play'} onClick={e => { e.stopPropagation(); togglePlay() }}
            className="p-2.5 text-white">{playing ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}</button>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-[3px] bg-white/20">
          <div className="h-full bg-spot transition-[width] duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  )
}
