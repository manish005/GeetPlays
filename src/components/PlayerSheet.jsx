import { ChevronDown, Heart, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, ListMusic, Share2, MonitorSpeaker, Volume2, VolumeX, Mic } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import { fmt, trackById } from '../data/catalog'
import Cover from './Cover'

export default function PlayerSheet({ go }) {
  const { current, playing, progress, seek, togglePlay, next, prev, shuffle, setShuffle, repeat, setRepeat, volume, setVolume, liked, toggleLike, sheetOpen, setSheetOpen, queue } = usePlayer()
  if (!sheetOpen || !current) return null
  const pct = (progress / current.dur) * 100
  const muted = volume === 0

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#3d2c4b] via-[#1a1a1a] to-black animate-slide-up flex flex-col overflow-y-auto no-scrollbar">
      <div className="max-w-[480px] w-full mx-auto px-6 pt-3 pb-10 flex flex-col min-h-full">
        <div className="flex items-center justify-between py-2">
          <button aria-label="Close" onClick={() => setSheetOpen(false)} className="p-2 -ml-2"><ChevronDown size={28} /></button>
          <div className="text-center min-w-0">
            <p className="text-[11px] text-muted tracking-wide truncate">{current.album.toUpperCase()}</p>
            <p className="text-sm font-semibold truncate">{current.title}</p>
          </div>
          <button aria-label="More" className="p-2 -mr-2"><Share2 size={22} /></button>
        </div>

        <Cover src={current.cover} alt={current.title} className="w-full aspect-square mt-4 shadow-2xl" rounded="rounded-xl" />

        <div className="flex items-center gap-4 mt-6">
          <div className="flex-1 min-w-0">
            <p className="text-xl font-bold truncate">{current.title}</p>
            <p className="text-muted truncate">{current.artist}</p>
          </div>
          <button aria-label="Like" onClick={() => toggleLike(current.id)} className={liked.has(current.id) ? 'text-spot' : 'text-white'}>
            <Heart size={26} fill={liked.has(current.id) ? '#1ED760' : 'none'} />
          </button>
        </div>

        <div className="mt-5">
          <input type="range" min={0} max={current.dur} value={Math.floor(progress)} onChange={e => seek(Number(e.target.value))}
            className="w-full" style={{ background: `linear-gradient(to right, #fff ${pct}%, #4d4d4d ${pct}%)` }} />
          <div className="flex justify-between text-[11px] text-muted mt-1.5">
            <span>{fmt(progress)}</span><span>-{fmt(Math.max(0, current.dur - progress))}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-8 mt-5">
          <button aria-label="Shuffle" onClick={() => setShuffle(!shuffle)} className={`relative ${shuffle ? 'text-spot' : 'text-muted'}`}>
            <Shuffle size={22} />{shuffle && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-spot" />}
          </button>
          <button aria-label="Previous" onClick={prev}><SkipBack size={34} fill="currentColor" /></button>
          <button aria-label={playing ? 'Pause' : 'Play'} onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition">
            {playing ? <Pause size={30} fill="currentColor" /> : <Play size={30} fill="currentColor" className="ml-1" />}
          </button>
          <button aria-label="Next" onClick={next}><SkipForward size={34} fill="currentColor" /></button>
          <button aria-label="Repeat" onClick={() => setRepeat((repeat + 1) % 3)} className={`relative ${repeat ? 'text-spot' : 'text-muted'}`}>
            {repeat === 2 ? <Repeat1 size={22} /> : <Repeat size={22} />}
            {repeat > 0 && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-spot" />}
          </button>
        </div>

        <div className="flex items-center gap-4 mt-6 text-muted">
          <MonitorSpeaker size={20} />
          <button aria-label="Lyrics" onClick={() => { setSheetOpen(false); go && go('lyrics') }} className="hover:text-white"><Mic size={20} /></button>
          <button aria-label="Queue" onClick={() => { setSheetOpen(false); go && go('queue') }} className="hover:text-white"><ListMusic size={20} /></button>
          <button aria-label={muted ? 'Unmute' : 'Mute'} onClick={() => setVolume(muted ? 0.7 : 0)} className="shrink-0">{muted ? <VolumeX size={20} /> : <Volume2 size={20} />}</button>
          <input type="range" min={0} max={1} step={0.01} value={volume} onChange={e => setVolume(Number(e.target.value))}
            className="flex-1" style={{ background: `linear-gradient(to right, #fff ${volume * 100}%, #4d4d4d ${volume * 100}%)` }} />
        </div>

        <div className="mt-8">
          <div className="flex items-center gap-2 text-sm font-semibold mb-2"><ListMusic size={16} /> Queue</div>
          <div className="max-h-44 overflow-y-auto no-scrollbar">
            {queue.map(id => {
              const t = trackById[id]; if (!t) return null
              const active = id === current.id
              return (
                <div key={id} className="flex items-center gap-3 py-1.5">
                  <Cover src={t.cover} alt={t.title} className="w-9 h-9" />
                  <div className="flex-1 min-w-0">
                    <p className={`truncate text-sm ${active ? 'text-spot' : 'text-white'}`}>{t.title}</p>
                    <p className="truncate text-xs text-muted">{t.artist}</p>
                  </div>
                  <span className="text-xs text-muted">{fmt(t.dur)}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
