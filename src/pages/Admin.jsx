import { useMemo, useState } from 'react'
import { Users, Music4, Disc3, Mic2, ListMusic, TrendingUp, Search, Ban, CheckCircle2, Plus } from 'lucide-react'
import { PageHeader, Modal, Field, inputCls, btnPrimary } from '../components/ui'
import { tracks, artists, albumsCatalog, playlists } from '../data/catalog'
import { useUser } from '../context/UserContext'
import { useToast } from '../context/ToastContext'

export default function Admin({ goBack }) {
  const { profile } = useUser()
  const { toast } = useToast()
  const [q, setQ] = useState('')
  const [songList, setSongList] = useState(tracks)
  const [suspended, setSuspended] = useState([])
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState({ title: '', artist: '', album: '', genre: 'Pop' })

  const s = q.toLowerCase()
  const shown = useMemo(() => songList.filter(t => !s || `${t.title} ${t.artist}`.toLowerCase().includes(s)), [s, songList])

  const stats = [
    { icon: Users, label: 'Total users', value: '12,048' },
    { icon: Music4, label: 'Total songs', value: String(songList.length) },
    { icon: Mic2, label: 'Total artists', value: String(artists.length) },
    { icon: Disc3, label: 'Total albums', value: String(albumsCatalog.length) },
    { icon: ListMusic, label: 'Playlists', value: String(playlists.length) },
    { icon: TrendingUp, label: 'Streams (30d)', value: '2.4M' },
  ]

  const addSong = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.artist.trim()) { toast('Title and artist required'); return }
    const t = { id: `a${Date.now()}`, title: form.title, artist: form.artist, album: form.album || 'Single', dur: 200, cover: `https://picsum.photos/seed/${Date.now()}/300/300`, plays: '0', genre: form.genre, year: 2026, released: '2026-11-04' }
    setSongList(l => [t, ...l]); setAddOpen(false); toast(`Added “${t.title}”`); setForm({ title: '', artist: '', album: '', genre: 'Pop' })
  }

  const usersDemo = [{ name: 'Guest', email: profile.email || 'guest@GeetPlays.app', role: 'Owner' }, { name: 'Alex Rivera', email: 'alex@example.com', role: 'Listener' }, { name: 'Sam Patel', email: 'sam@example.com', role: 'Listener' }, { name: 'Jordan Lee', email: 'jordan@example.com', role: 'Moderator' }]

  return (
    <div className="pb-40 md:pb-8">
      <PageHeader title="Admin Dashboard" onBack={goBack}>
        <button onClick={() => setAddOpen(true)} className="flex items-center gap-1.5 bg-spot text-black text-[13px] font-bold px-4 py-2 rounded-full hover:bg-spotdark"><Plus size={15} /> Add song</button>
      </PageHeader>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 px-4 mt-4">
        {stats.map(st => (
          <div key={st.label} className="bg-card rounded-lg p-4">
            <st.icon size={20} className="text-muted" />
            <p className="text-2xl font-black mt-2">{st.value}</p>
            <p className="text-[13px] text-muted">{st.label}</p>
          </div>
        ))}
      </div>

      <section className="mt-6">
        <h2 className="px-4 text-xl font-bold mb-3">Most played songs</h2>
        {[...songList].sort((a, b) => parseFloat(b.plays) - parseFloat(a.plays)).slice(0, 5).map((t, i) => (
          <div key={t.id} className="flex items-center gap-3 px-4 py-2 hover:bg-white/5">
            <span className="text-muted w-4 text-center text-sm">{i + 1}</span>
            <img src={t.cover} alt="" className="w-10 h-10 rounded-md object-cover bg-elev" />
            <span className="flex-1 min-w-0"><span className="block truncate text-[15px]">{t.title}</span><span className="block truncate text-[13px] text-muted">{t.artist}</span></span>
            <span className="text-[13px] text-muted">{t.plays}</span>
          </div>
        ))}
      </section>

      <section className="mt-6">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-xl font-bold">Song management</h2>
        </div>
        <div className="flex items-center gap-2 bg-elev rounded-md px-3 py-2 mx-4 mb-2">
          <Search size={18} className="text-muted shrink-0" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search songs…" className="bg-transparent outline-none flex-1 text-[15px] placeholder:text-muted" />
        </div>
        {shown.map(t => (
          <div key={t.id} className="flex items-center gap-3 px-4 py-2 hover:bg-white/5">
            <img src={t.cover} alt="" className="w-10 h-10 rounded-md object-cover bg-elev" />
            <span className="flex-1 min-w-0"><span className="block truncate text-[15px]">{t.title}</span><span className="block truncate text-[13px] text-muted">{t.artist} • {t.genre}</span></span>
            <button onClick={() => { setSongList(l => l.filter(x => x.id !== t.id)); toast(`Deleted “${t.title}”`) }} className="text-[13px] text-red-400 font-semibold">Delete</button>
          </div>
        ))}
        {shown.length === 0 && <p className="px-4 py-6 text-muted text-sm">No songs match.</p>}
      </section>

      <section className="mt-6">
        <h2 className="px-4 text-xl font-bold mb-3">User management</h2>
        {usersDemo.map(u => (
          <div key={u.email} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5">
            <span className="w-10 h-10 rounded-full bg-[#8D67AB] text-black font-bold flex items-center justify-center shrink-0">{u.name[0]}</span>
            <span className="flex-1 min-w-0"><span className="block truncate text-[15px]">{u.name}</span><span className="block truncate text-[13px] text-muted">{u.email} • {u.role}</span></span>
            {suspended.includes(u.email) ? (
              <button onClick={() => { setSuspended(l => l.filter(x => x !== u.email)); toast('Account reactivated') }} className="flex items-center gap-1.5 text-[13px] text-spot font-semibold"><CheckCircle2 size={15} /> Reactivate</button>
            ) : (
              <button onClick={() => { setSuspended(l => [...l, u.email]); toast('Account suspended') }} className="flex items-center gap-1.5 text-[13px] text-red-400 font-semibold"><Ban size={15} /> Suspend</button>
            )}
          </div>
        ))}
      </section>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add song">
        <form onSubmit={addSong} className="flex flex-col gap-4">
          <Field label="Title"><input autoFocus value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={inputCls} placeholder="Song title" /></Field>
          <Field label="Artist"><input value={form.artist} onChange={e => setForm({ ...form, artist: e.target.value })} className={inputCls} placeholder="Artist name" /></Field>
          <Field label="Album"><input value={form.album} onChange={e => setForm({ ...form, album: e.target.value })} className={inputCls} placeholder="Album name" /></Field>
          <Field label="Genre"><select value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} className={inputCls}>{['Pop', 'Rock', 'Hip-Hop', 'Electronic', 'Indie', 'Jazz', 'R&B', 'Country'].map(g => <option key={g}>{g}</option>)}</select></Field>
          <button type="submit" className={btnPrimary}>Add song</button>
        </form>
      </Modal>
    </div>
  )
}
