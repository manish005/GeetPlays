import { Play, Trash2 } from 'lucide-react'
import { PageHeader } from '../components/ui'
import { useUser } from '../context/UserContext'
import { usePlayer } from '../context/PlayerContext'
import { useToast } from '../context/ToastContext'
import Cover from '../components/Cover'
import { trackById } from '../data/catalog'

function groupLabel(at) {
  const d = new Date(at), now = new Date()
  const same = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  if (same(d, now)) return 'Today'
  const y = new Date(now); y.setDate(now.getDate() - 1)
  if (same(d, y)) return 'Yesterday'
  return d.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined })
}

export default function History({ goBack }) {
  const { history, removeHistory, clearHistory } = useUser()
  const { startTrack } = usePlayer()
  const { toast } = useToast()

  const groups = {}
  history.forEach(h => { const k = groupLabel(h.at); (groups[k] = groups[k] || []).push(h) })

  return (
    <div className="pb-40 md:pb-8">
      <PageHeader title="Listening history" onBack={goBack}>
        {history.length > 0 && <button onClick={() => { clearHistory(); toast('History cleared') }} className="text-[13px] text-muted hover:text-white font-semibold">Clear all</button>}
      </PageHeader>

      {history.length === 0 ? (
        <div className="px-4 py-16 text-center">
          <p className="text-2xl font-bold">Nothing played yet</p>
          <p className="text-muted mt-2 text-sm">Songs you play will show up here.</p>
        </div>
      ) : Object.entries(groups).map(([label, items]) => (
        <section key={label} className="mt-4">
          <h2 className="px-4 text-lg font-bold mb-2">{label}</h2>
          {items.map(h => {
            const t = trackById[h.trackId]
            if (!t) return null
            return (
              <div key={h.id} className="flex items-center gap-3 px-4 py-2 hover:bg-white/5">
                <button onClick={() => startTrack(t.id)} className="shrink-0"><Cover src={t.cover} alt={t.title} className="w-11 h-11" /></button>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-[15px]">{t.title}</p>
                  <p className="truncate text-[13px] text-muted">{t.artist} • {new Date(h.at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</p>
                </div>
                <button aria-label="Replay" onClick={() => startTrack(t.id)} className="p-2 text-muted hover:text-white"><Play size={18} /></button>
                <button aria-label="Remove" onClick={() => { removeHistory(h.id); toast('Removed from history') }} className="p-2 text-muted hover:text-white"><Trash2 size={18} /></button>
              </div>
            )
          })}
        </section>
      ))}
    </div>
  )
}
