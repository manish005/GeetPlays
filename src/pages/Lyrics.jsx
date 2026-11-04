import { useEffect, useRef } from 'react'
import { ArrowLeft } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import { lyricSeed } from '../data/catalog'

export default function Lyrics({ goBack }) {
  const { current, progress } = usePlayer()
  const ref = useRef(null)

  const lines = current ? lyricSeed(current) : []
  const lyricLines = lines.filter(l => l && !l.startsWith('['))
  const totalSec = current ? current.dur : 0
  const activeIdx = totalSec > 0 ? Math.min(lyricLines.length - 1, Math.floor((progress / totalSec) * lyricLines.length)) : 0

  useEffect(() => {
    const el = ref.current?.querySelector(`[data-i="${activeIdx}"]`)
    el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [activeIdx])

  if (!current) {
    return (
      <div className="pb-40 md:pb-8">
        <div className="flex items-center gap-3 px-4 pt-3 pb-3">
          <button aria-label="Back" onClick={goBack} className="p-1.5 -ml-1.5 rounded-full bg-black/40"><ArrowLeft size={20} /></button>
          <h1 className="text-xl font-bold">Lyrics</h1>
        </div>
        <p className="px-4 py-16 text-center text-muted">Play a song to see its lyrics.</p>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-[#3d2c4b] to-[#121212] flex flex-col pb-32 md:pb-8">
      <div className="flex items-center gap-3 px-4 pt-3 pb-3 max-w-2xl mx-auto w-full">
        <button aria-label="Back" onClick={goBack} className="p-1.5 -ml-1.5 rounded-full bg-black/40"><ArrowLeft size={20} /></button>
        <div className="min-w-0">
          <h1 className="text-lg font-bold truncate">{current.title}</h1>
          <p className="text-muted text-sm truncate">{current.artist}</p>
        </div>
      </div>
      <div ref={ref} className="flex-1 overflow-y-auto no-scrollbar max-w-2xl mx-auto w-full px-4 py-8">
        {lines.map((l, i) => {
          if (!l) return <div key={i} className="h-5" />
          if (l.startsWith('[')) return <p key={i} className="text-spot font-bold text-lg mt-4 mb-2">{l}</p>
          const li = lyricLines.indexOf(l)
          return (
            <p key={i} data-i={li} className={`text-2xl md:text-3xl font-bold leading-snug py-1 transition ${li === activeIdx ? 'text-white' : 'text-white/35'}`}>
              {l}
            </p>
          )
        })}
      </div>
    </div>
  )
}
