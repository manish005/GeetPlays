import { useState } from 'react'
import { Home, Search, LibraryBig, Plus, Heart, Bell, Clock3, User, Settings, Crown, Shield, LayoutGrid } from 'lucide-react'
import { playlists, artists, albumsCatalog } from '../data/catalog'
import { useUser } from '../context/UserContext'
import { useToast } from '../context/ToastContext'
import { Modal, Field, inputCls } from './ui'
import Cover from './Cover'

export default function Sidebar({ view, go, openPlaylist, openLiked, openArtist, openAlbum, createOpen, setCreateOpen }) {
  const { profile, user, customPlaylists, createPlaylist, notifications } = useUser()
  const adminMode = user?.role === 'admin' || (profile.email === 'admin@geetplays.com')
  const { toast } = useToast()
  const [form, setForm] = useState({ name: '', desc: '', visibility: 'Public' })
  const unread = (notifications || []).filter(n => !n.read).length

  const NavItem = ({ k, label, icon: Icon, badge }) => {
    const active = view === k || (k === 'library' && ['playlist', 'album', 'artist'].includes(view))
    return (
      <button onClick={() => go(k)} className={`flex items-center gap-4 px-3 py-2 rounded-md font-semibold text-[15px] relative ${active ? 'text-white' : 'text-muted hover:text-white'}`}>
        <Icon size={24} /> {label}
        {badge > 0 && <span className="ml-auto min-w-[20px] h-5 px-1 rounded-full bg-spot text-black text-[11px] font-bold flex items-center justify-center">{badge}</span>}
      </button>
    )
  }

  const create = (e) => {
    e.preventDefault()
    if (!form.name.trim()) { toast('Playlist name required'); return }
    const p = createPlaylist(form)
    setForm({ name: '', desc: '', visibility: 'Public' }); setCreateOpen(false)
    toast(`Created “${p.name}”`); openPlaylist(p.id)
  }

  return (
    <>
      <aside className="hidden md:flex flex-col w-[300px] shrink-0 gap-2 p-2 h-full">
        <div className="bg-panel rounded-xl p-3 flex flex-col gap-1">
          <div className="flex items-center gap-2 px-3 py-2">
            <span className="w-7 h-7 rounded-full bg-spot flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 9.5c5-1.5 10.5-1.2 15.5 1.2M5 13.5c4.1-1.1 8.6-.9 12.7 1M6 17.3c3.2-.8 6.6-.6 9.7.8" stroke="#000" strokeWidth="2.2" strokeLinecap="round" /></svg>
            </span>
            <span className="font-black text-lg tracking-tight">GeetPlays</span>
          </div>
          <NavItem k="home" label="Home" icon={Home} />
          <NavItem k="search" label="Search" icon={Search} />
          <NavItem k="browse" label="Browse" icon={LayoutGrid} />
          <NavItem k="notifications" label="Notifications" icon={Bell} badge={unread} />
          <NavItem k="history" label="Recently played" icon={Clock3} />
        </div>
        <div className="bg-panel rounded-xl p-3 flex-1 min-h-0 flex flex-col">
          <div className="flex items-center justify-between px-2 py-1">
            <button onClick={() => go('library')} className={`flex items-center gap-3 font-semibold text-[15px] ${view === 'library' ? 'text-white' : 'text-muted hover:text-white'}`}>
              <LibraryBig size={22} /> Your Library
            </button>
            <button aria-label="Create playlist" onClick={() => setCreateOpen(true)} className="p-1.5 rounded-full hover:bg-white/10 text-muted hover:text-white"><Plus size={20} /></button>
          </div>
          <div className="flex gap-2 px-2 py-2">
            {['Playlists', 'Artists', 'Albums'].map((c, i) => (
              <button key={c} onClick={() => go('library')} className={`text-[13px] px-3 py-1.5 rounded-full ${i === 0 ? 'bg-white/10' : 'bg-white/5'} hover:bg-white/10`}>{c}</button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar mt-1">
            <button onClick={openLiked} className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-white/5 text-left">
              <span className="w-12 h-12 rounded-md bg-gradient-to-br from-[#450AF5] via-[#C4EFE9] to-[#F7F3E6] flex items-center justify-center shrink-0"><Heart size={22} fill="#fff" className="text-white" /></span>
              <span><span className="block text-[15px]">Liked Songs</span><span className="block text-[13px] text-muted">Playlist • {profile.name}</span></span>
            </button>
            {customPlaylists.map(p => (
              <button key={p.id} onClick={() => openPlaylist(p.id)} className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-white/5 text-left">
                <Cover src={p.cover} alt={p.name} className="w-12 h-12 shrink-0" />
                <span className="min-w-0"><span className="block text-[15px] truncate">{p.name}</span><span className="block text-[13px] text-muted truncate">Playlist • {p.owner}</span></span>
              </button>
            ))}
            {playlists.map(p => (
              <button key={p.id} onClick={() => openPlaylist(p.id)} className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-white/5 text-left">
                <Cover src={p.cover} alt={p.name} className="w-12 h-12 shrink-0" />
                <span className="min-w-0"><span className="block text-[15px] truncate">{p.name}</span><span className="block text-[13px] text-muted truncate">Playlist • {p.owner}</span></span>
              </button>
            ))}
            {artists.slice(0, 3).map(a => (
              <button key={a.name} onClick={() => openArtist(a.name)} className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-white/5 text-left">
                <Cover src={a.img} alt={a.name} className="w-12 h-12 shrink-0" rounded="rounded-full" />
                <span className="min-w-0"><span className="block text-[15px] truncate">{a.name}</span><span className="block text-[13px] text-muted">Artist</span></span>
              </button>
            ))}
            {albumsCatalog.slice(0, 2).map(a => (
              <button key={a.name} onClick={() => openAlbum(a.name)} className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-white/5 text-left">
                <Cover src={a.cover} alt={a.name} className="w-12 h-12 shrink-0" />
                <span className="min-w-0"><span className="block text-[15px] truncate">{a.name}</span><span className="block text-[13px] text-muted truncate">Album • {a.artist}</span></span>
              </button>
            ))}
          </div>
          {adminMode && (
            <div className="border-t border-white/5 pt-2 mt-1 flex flex-col gap-1">
              <NavItem k="admin" label="Admin" icon={Shield} />
            </div>
          )}
          <div className="border-t border-white/5 pt-2 mt-1">
            <div className="mt-2 w-full flex items-center gap-3 p-2 rounded-md hover:bg-white/5 border-t border-white/5 pt-3">
              <button onClick={() => go('profile')} className="flex items-center gap-3 text-left flex-1 min-w-0 rounded-md">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-white/10" />
                ) : (
                  <span className="w-9 h-9 rounded-full bg-[#8D67AB] text-black font-bold flex items-center justify-center text-sm shrink-0 ring-1 ring-white/10">
                    {(profile.name || 'G')[0].toUpperCase()}
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-semibold truncate">{profile.name}</span>
                  <span className="block text-[12px] text-muted truncate">{adminMode ? 'Admin' : (profile.email || '@' + profile.username)}</span>
                </span>
              </button>
              <button onClick={() => go('settings')} className="p-2 rounded-full hover:bg-white/10 text-muted hover:text-white shrink-0" aria-label="Settings" title="Settings">
                <Settings size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create playlist">
        <form onSubmit={create} className="flex flex-col gap-4">
          <Field label="Playlist name"><input autoFocus value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="My playlist" /></Field>
          <Field label="Description (optional)"><textarea value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} className={`${inputCls} min-h-[80px]`} placeholder="What’s this playlist about?" /></Field>
          <Field label="Visibility"><select value={form.visibility} onChange={e => setForm({ ...form, visibility: e.target.value })} className={inputCls}><option>Public</option><option>Private</option></select></Field>
          <button type="submit" className="w-full bg-spot text-black font-bold rounded-full py-3">Create</button>
        </form>
      </Modal>
    </>
  )
}
