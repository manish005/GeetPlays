import { Play } from 'lucide-react'
import Cover from './Cover'

export default function Card({ item, subtitle, onClick, onPlay, circle = false, pill }) {
  return (
    <div onClick={onClick} className="group w-[140px] sm:w-[160px] md:w-[176px] lg:w-[184px] shrink-0 grow-0 basis-auto cursor-pointer active:bg-white/10 rounded-lg p-3 md:p-4 hover:bg-white/5 transition">
      <div className="relative mb-3">
        <Cover src={item.cover || item.img} alt={item.name || item.title} className="w-full aspect-square shadow-xl" rounded={circle ? 'rounded-full' : 'rounded-md'} />
        {pill && (
          <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-black/70 backdrop-blur text-white px-2 py-0.5 rounded-full">
            {pill}
          </span>
        )}
        <button aria-label="Play" onClick={e => { e.stopPropagation(); onPlay && onPlay() }}
          className="absolute bottom-1.5 right-1.5 w-11 h-11 rounded-full bg-spot text-black flex items-center justify-center opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition shadow-lg hover:scale-105">
          <Play size={20} fill="currentColor" />
        </button>
      </div>
      <p className="truncate text-sm md:text-[15px] font-semibold leading-snug">{item.name || item.title}</p>
      <p className="truncate text-xs md:text-[13px] text-muted mt-1 leading-snug">{subtitle}</p>
    </div>
  )
}
