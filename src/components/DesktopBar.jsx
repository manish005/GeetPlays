import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, Heart, Volume2, VolumeX, Mic, ListMusic, MonitorSpeaker } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import { useUser } from '../context/UserContext'
import { fmt } from '../data/catalog'
import Cover from './Cover'

export default function DesktopBar({ go }) {
  const { current, playing, progress, seek, togglePlay, next, prev, shuffle, setShuffle, repeat, setRepeat, volume, setVolume, liked, toggleLike, setSheetOpen } = usePlayer()
  const { settings } = useUser()
  if (!current) return null
  const pct = (progress / current.dur) * 100
  const muted = volume === 0
  return (
    <footer className="hidden md:flex items-center gap-4 h-[90px] px-4 bg-black border-t border-line shrink-0">
      <div className="flex items-center gap-3 w-[30%] min-w-0 cursor-pointer" onClick={() => setSheetOpen(true)}>
        <Cover src={current.cover} alt={current.title} className="w-14 h-14 shrink-0" />
        <div className="min-w-0">
          <p className="truncate text-sm hover:underline">{current.title}</p>
          <p className="truncate text-xs text-muted hover:underline">{current.artist}</p>
        </div>
        <button aria-label="Like" onClick={e => { e.stopPropagation(); toggleLike(current.id) }} className={`ml-2 ${liked.has(current.id) ? 'text-spot' : 'text-muted'}`}>
          <Heart size={16} fill={liked.has(current.id) ? '#1ED760' : 'none'} />
        </button>
      </div>
      <div className="flex flex-col items-center gap-1.5 w-[40%] max-w-[560px]">
        <div className="flex items-center gap-5">
          <button aria-label="Shuffle" onClick={() => setShuffle(!shuffle)} className={`relative ${shuffle ? 'text-spot' : 'text-muted hover:text-white'}`}><Shuffle size={16} />{shuffle && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-spot" />}</button>
          <button aria-label="Previous" onClick={prev} className="text-muted hover:text-white"><SkipBack size={18} fill="currentColor" /></button>
          <button aria-label={playing ? 'Pause' : 'Play'} onClick={togglePlay} className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105">
            {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
          </button>
          <button aria-label="Next" onClick={next} className="text-muted hover:text-white"><SkipForward size={18} fill="currentColor" /></button>
          <button aria-label="Repeat" onClick={() => setRepeat((repeat + 1) % 3)} className={`relative ${repeat ? 'text-spot' : 'text-muted hover:text-white'}`}>{repeat === 2 ? <Repeat1 size={16} /> : <Repeat size={16} />}{repeat > 0 && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-spot" />}</button>
        </div>
        <div className="flex items-center gap-2 w-full">
          <span className="text-[11px] text-muted w-8 text-right">{fmt(progress)}</span>
          <input type="range" min={0} max={current.dur} value={Math.floor(progress)} onChange={e => seek(Number(e.target.value))}
            className="flex-1" style={{ background: `linear-gradient(to right, #fff ${pct}%, #4d4d4d ${pct}%)` }} />
          <span className="text-[11px] text-muted w-8">{fmt(current.dur)}</span>
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 w-[30%] text-muted">
        <Mic size={16} onClick={() => go && go('lyrics')} className="hover:text-white cursor-pointer" title="Lyrics" />
        <ListMusic size={16} onClick={() => go && go('queue')} className="hover:text-white cursor-pointer" title="Queue" />
        <MonitorSpeaker size={16} className="hover:text-white cursor-pointer" />
        <button aria-label={muted ? 'Unmute' : 'Mute'} onClick={() => setVolume(muted ? 0.7 : 0)}>{muted ? <VolumeX size={16} /> : <Volume2 size={16} />}</button>
        <input type="range" min={0} max={1} step={0.01} value={volume} onChange={e => setVolume(Number(e.target.value))}
          className="w-24" style={{ background: `linear-gradient(to right, #fff ${volume * 100}%, #4d4d4d ${volume * 100}%)` }} />
      </div>
    </footer>
  )
}
