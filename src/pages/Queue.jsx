import { X, ArrowUp, ArrowDown, Trash2, Save } from 'lucide-react'
import { PageHeader } from '../components/ui'
import { usePlayer } from '../context/PlayerContext'
import { useToast } from '../context/ToastContext'
import { trackById } from '../data/catalog'
import Cover from '../components/Cover'

export default function Queue({ goBack, openPlaylist }) {
  const { queue, currentId, startTrack, setQueue } = usePlayer()
  const { toast } = useToast()
  const idx = queue.indexOf(currentId)

  const move = (from, to) => { const q = [...queue]; const [m] = q.splice(from, 1); q.splice(to, 0, m); setQueue(q) }
  const remove = (i) => { const q = queue.filter((_, x) => x !== i); setQueue(q); toast('Removed from queue') }
  const clear = () => { setQueue(currentId ? [currentId] : []); toast('Queue cleared') }

  const row = (id, i, label) => {
    const t = trackById[id]; if (!t) return null
    const active = id === currentId
    return (
      <div key={`${id}-${i}`} className="flex items-center gap-3 px-4 py-2 hover:bg-white/5">
        <button onClick={() => startTrack(id)} className="shrink-0"><Cover src={t.cover} alt={t.title} className="w-11 h-11" /></button>
        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => startTrack(id)}>
          <p className={`truncate text-[15px] ${active ? 'text-spot' : ''}`}>{t.title}</p>
          <p className="truncate text-[13px] text-muted">{t.artist}</p>
        </div>
        {i > 0 && <button aria-label="Move up" onClick={() => move(i, i - 1)} className="p-2 text-muted hover:text-white"><ArrowUp size={16} /></button>}
        {i < queue.length - 1 && <button aria-label="Move down" onClick={() => move(i, i + 1)} className="p-2 text-muted hover:text-white"><ArrowDown size={16} /></button>}
        <button aria-label="Remove" onClick={() => remove(i)} className="p-2 text-muted hover:text-white"><X size={16} /></button>
      </div>
    )
  }

  return (
    <div className="pb-40 md:pb-8">
      <PageHeader title="Queue" onBack={goBack}>
        <button onClick={clear} className="text-[13px] text-muted hover:text-white font-semibold flex items-center gap-1.5"><Trash2 size={14} /> Clear</button>
      </PageHeader>

      {queue.length === 0 ? (
        <div className="px-4 py-16 text-center">
          <p className="text-xl font-bold">Queue is empty</p>
          <p className="text-muted mt-2 text-sm">Play a song and it will appear here.</p>
        </div>
      ) : (
        <>
          {currentId && <section className="mt-4"><h2 className="px-4 text-lg font-bold mb-1">Now playing</h2>{queue.slice(Math.max(0, idx), idx + 1).map((id, i) => row(id, idx + i))}</section>}
          {idx >= 0 && idx < queue.length - 1 && <section className="mt-4"><h2 className="px-4 text-lg font-bold mb-1">Next in queue</h2>{queue.slice(idx + 1).map((id, i) => row(id, idx + 1 + i))}</section>}
          {idx > 0 && <section className="mt-4"><h2 className="px-4 text-lg font-bold mb-1">Recently played</h2>{queue.slice(0, idx).map((id, i) => row(id, i))}</section>}
          {idx < 0 && <section className="mt-4"><h2 className="px-4 text-lg font-bold mb-1">Up next</h2>{queue.map((id, i) => row(id, i))}</section>}
        </>
      )}
    </div>
  )
}
