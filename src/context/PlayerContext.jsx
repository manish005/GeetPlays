import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { tracks, trackById, playlistById } from '../data/catalog'
import { engine } from '../audio/engine'

const Ctx = createContext(null)

function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback }
}
function save(key, v) { try { localStorage.setItem(key, JSON.stringify(v)) } catch {} }

export function PlayerProvider({ children }) {
  const [queue, setQueue] = useState(() => tracks.map(t => t.id))
  const [currentId, setCurrentId] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(0) // 0 off, 1 all, 2 one
  const [volume, setVolume] = useState(() => load('sp_volume', 0.7))
  const [sheetOpen, setSheetOpen] = useState(false)
  const [liked, setLiked] = useState(() => new Set(load('sp_liked', ['t5', 't3'])))
  const intervalRef = useRef(null)

  const current = currentId ? trackById[currentId] : null

  useEffect(() => { save('sp_liked', [...liked]) }, [liked])
  useEffect(() => { save('sp_volume', volume); engine.setVolume(volume) }, [volume])

  const tick = useCallback(() => {
    setProgress(p => {
      if (!current) return 0
      const next = p + 0.5
      if (next >= current.dur) {
        if (repeat === 2) return 0
        advance()
        return 0
      }
      return next
    })
  }, [current, repeat])

  useEffect(() => {
    if (playing) { intervalRef.current = setInterval(tick, 500) }
    else if (intervalRef.current) clearInterval(intervalRef.current)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [playing, tick])

  const startTrack = useCallback((id, queueIds) => {
    if (queueIds) setQueue(queueIds)
    setCurrentId(id)
    setProgress(0)
    setPlaying(true)
    engine.play(trackById[id], volume)
  }, [volume])

  const [historyHook, setHistoryHook] = useState(null)
  useEffect(() => {
    if (currentId && playing) {
      try {
        const raw = localStorage.getItem('vb_history')
        const prev = raw ? JSON.parse(raw) : []
        const t = trackById[currentId]
        if (t && !prev[0]?.trackId?.concat()===undefined) {
          const last = prev[0]
          if (!last || last.trackId !== t.id || Date.now() - last.at > 4000) {
            const next = [{ id: `${t.id}-${Date.now()}`, trackId: t.id, title: t.title, artist: t.artist, at: Date.now() }, ...prev.filter(x => !(x.trackId === t.id && Date.now() - x.at < 4000))].slice(0, 60)
            localStorage.setItem('vb_history', JSON.stringify(next))
          }
        }
      } catch {}
    }
  }, [currentId, playing])

  const playPlaylist = useCallback((playlistId, trackId) => {
    const pl = playlistById[playlistId]
    if (!pl) return
    const ids = pl.trackIds
    startTrack(trackId && ids.includes(trackId) ? trackId : ids[0], ids)
  }, [startTrack])

  const togglePlay = useCallback(() => {
    if (!current) { startTrack(queue[0]); return }
    setPlaying(p => {
      if (p) engine.pause()
      else engine.play(current, volume)
      return !p
    })
  }, [current, queue, startTrack, volume])

  function advance() {
    const idx = queue.indexOf(currentId)
    if (repeat === 2) { setProgress(0); engine.play(current, volume); return }
    let nextIdx
    if (shuffle && queue.length > 1) {
      do { nextIdx = Math.floor(Math.random() * queue.length) } while (nextIdx === idx)
    } else {
      nextIdx = idx + 1
      if (nextIdx >= queue.length) {
        if (repeat === 0) { setPlaying(false); engine.pause(); return }
        nextIdx = 0
      }
    }
    startTrack(queue[nextIdx])
  }

  const next = useCallback(() => advance(), [currentId, queue, shuffle, repeat, volume])
  const prev = useCallback(() => {
    if (!current) return
    if (progress > 3) { setProgress(0); engine.play(current, volume); return }
    const idx = queue.indexOf(currentId)
    startTrack(queue[(idx - 1 + queue.length) % queue.length])
  }, [current, progress, queue, currentId, startTrack, volume])

  const seek = useCallback((s) => { setProgress(Math.max(0, Math.min(s, current ? current.dur : 0))) }, [current])
  const toggleLike = useCallback((id) => {
    setLiked(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }, [])
  const playAll = useCallback((ids) => { if (ids.length) startTrack(ids[0], ids) }, [startTrack])

  return (
    <Ctx.Provider value={{
      queue, current, currentId, playing, progress, shuffle, repeat, volume, sheetOpen, liked,
      setSheetOpen, setShuffle, setRepeat, setVolume, seek, startTrack, playPlaylist, togglePlay,
      next, prev, toggleLike, playAll,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const usePlayer = () => useContext(Ctx)
