import { useCallback, useEffect, useRef, useState } from 'react'
import { Play, Flame } from 'lucide-react'

export default function BannerCarousel({ slides, variant = 'home', onPlay, onOpen }) {
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const timer = useRef(null)

  const n = slides.length
  const go = useCallback((i) => setIdx(((i % n) + n) % n), [n])

  useEffect(() => {
    if (paused || n <= 1) return
    timer.current = setInterval(() => setIdx(i => (i + 1) % n), 4500)
    return () => clearInterval(timer.current)
  }, [paused, n])

  if (!n) return null
  const slide = slides[idx]

  return (
    <section
      className="w-full min-w-0 px-4 md:px-8 mt-5 md:mt-6"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
    >
      <div className="relative w-full overflow-hidden rounded-xl h-[210px] sm:h-[240px] md:h-[300px] lg:h-[340px] select-none">
        {/* Netflix-style bottom blur/fade */}
        <div className="absolute inset-0">
          {slides.map((s, i) => (
            <div key={s.id} className={`absolute inset-0 transition-opacity duration-700 ${i === idx ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <img src={s.cover} alt={s.title} draggable={false}
                className="absolute inset-0 w-full h-full object-cover" />
              {/* Netflix-style bottom blur/fade */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent h-24 backdrop-blur-[1px] opacity-60" />
            </div>
          ))}
        </div>

        <div className="relative z-10 h-full flex flex-col justify-end px-5 md:px-8 pb-8 md:pb-10">
          {slide.rank != null && (
            <span className="inline-flex w-fit items-center gap-1.5 bg-[#E13300] text-white text-[11px] md:text-xs font-bold px-2.5 py-1 rounded-full mb-2.5 shadow-lg">
              <Flame size={13} /> TRENDING #{slide.rank}
            </span>
          )}
          {slide.views && (
            <p className="text-[11px] md:text-xs tracking-[0.18em] text-white/80 font-semibold mb-1.5">
              {slide.views} VIEWS • {slide.listeners} LISTENERS
            </p>
          )}
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight drop-shadow-xl max-w-[90%] md:max-w-[60%] leading-tight">
            {slide.title}
          </h2>
          <p className="text-white/85 text-sm md:text-base mt-1.5 md:mt-2 max-w-[85%] md:max-w-[55%] truncate">
            {slide.subtitle}
          </p>
          <div className="flex items-center gap-3 mt-4">
            <button onClick={() => onPlay && onPlay(slide)}
              className="flex items-center gap-2 bg-white text-black font-bold text-sm px-5 py-2.5 rounded-full hover:scale-105 active:scale-95 transition shadow-xl">
              <Play size={18} fill="currentColor" /> Play
            </button>
            <button onClick={() => onOpen && onOpen(slide)}
              className="flex items-center gap-2 bg-white/20 backdrop-blur text-white font-bold text-sm px-5 py-2.5 rounded-full hover:bg-white/30 active:scale-95 transition">
              {variant === 'browse' ? 'View details' : 'More info'}
            </button>
          </div>
        </div>

        {/* Bottom dot navigation — no arrows */}
        {n > 1 && (
          <div className="absolute z-10 bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {slides.map((s, i) => (
              <button key={s.id} aria-label={`Slide ${i + 1}`} onClick={() => go(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'}`} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
