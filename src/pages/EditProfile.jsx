import { useState } from 'react'
import { ArrowLeft, Camera, Link2, Shield, User, Mail, CalendarDays, Type } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { useToast } from '../context/ToastContext'

const inputCls = 'w-full bg-white/[0.04] border border-neutral-800 rounded-xl px-4 py-3 text-[15px] text-white placeholder:text-neutral-500 outline-none transition hover:border-neutral-700 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30'

function Switch({ on, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)}
      className={`relative w-11 h-6 rounded-full shrink-0 transition-colors duration-200 ${on ? 'bg-emerald-500' : 'bg-neutral-700'}`}>
      <span className={`absolute top-[3px] w-4.5 h-4.5 w-[18px] h-[18px] rounded-full bg-white shadow transition-all duration-200 ${on ? 'left-[22px]' : 'left-[3px]'}`} />
    </button>
  )
}

function Label({ icon: Icon, text, hint }) {
  return (
    <div className="mb-2">
      <span className="flex items-center gap-2 text-sm font-medium text-neutral-300">
        {Icon && <Icon size={15} className="text-neutral-500" />}{text}
      </span>
      {hint && <span className="block text-xs text-neutral-500 mt-1">{hint}</span>}
    </div>
  )
}

export default function EditProfile({ goBack }) {
  const { profile, setProfile, settings, setSettings } = useUser()
  const { toast } = useToast()
  const [form, setForm] = useState({ ...profile })
  const [localSettings, setLocalSettings] = useState({ ...settings })
  const [urlOpen, setUrlOpen] = useState(false)
  const [urlDraft, setUrlDraft] = useState(form.avatar || '')

  const save = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return toast('Display name is required')
    if (!form.username.trim()) return toast('Username is required')
    if (form.username.includes(' ')) return toast('Username cannot contain spaces')
    setProfile({ ...profile, ...form })
    setSettings({ ...settings, ...localSettings })
    toast('Profile updated')
    goBack()
  }

  const applyUrl = () => { setForm({ ...form, avatar: urlDraft.trim() || null }); setUrlOpen(false); toast(urlDraft.trim() ? 'Photo updated' : 'Photo removed') }

  return (
    <div
      className="w-full min-w-0 pb-40 md:pb-8 relative"
      style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(30,215,96,0.08), transparent 60%)' }}
    >
      <header className="sticky top-0 z-30 backdrop-blur-md bg-[#121212]/80 border-b border-neutral-800/60 px-4 md:px-8 py-3 flex items-center gap-3">
        <button aria-label="Back" onClick={goBack} className="p-2 -ml-2 rounded-full hover:bg-white/10 text-neutral-300"><ArrowLeft size={22} /></button>
        <h1 className="text-lg font-semibold flex-1 text-white">Edit profile</h1>
        <button onClick={save} className="text-[13px] font-semibold text-emerald-400 hover:text-emerald-300">Save</button>
      </header>

      <form onSubmit={save} className="px-4 md:px-8 max-w-6xl w-full mx-auto">
        {/* Desktop: 2-col grid — left avatar+privacy, right inputs */}
        <div className="grid md:grid-cols-[320px_1fr] lg:grid-cols-[360px_1fr] gap-6 lg:gap-10 mt-8 items-start">
          <div className="flex flex-col gap-5">
            {/* Avatar */}
            <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 flex flex-col items-center">
              <div className="relative group">
                {form.avatar ? (
                  <img src={form.avatar} alt="" className="w-28 h-28 rounded-full object-cover border-2 border-neutral-800 shadow-[0_0_40px_rgba(30,215,96,0.15)] ring-1 ring-white/10" />
                ) : (
                  <span className="w-28 h-28 rounded-full bg-[#8D67AB] text-black text-4xl font-black flex items-center justify-center border-2 border-neutral-800 shadow-[0_0_40px_rgba(30,215,96,0.15)] ring-1 ring-white/10">
                    {(form.name || 'G')[0].toUpperCase()}
                  </span>
                )}
                <button type="button" onClick={() => { setUrlDraft(form.avatar || ''); setUrlOpen(!urlOpen) }} aria-label="Change photo"
                  className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-white shadow-lg hover:bg-neutral-800 hover:scale-105 active:scale-95 transition">
                  <Camera size={16} />
                </button>
              </div>

              {urlOpen && (
                <div className="w-full mt-4 bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 animate-fade-in">
                  <Label icon={Link2} text="Image URL" hint="Paste a direct link to any image" />
                  <input value={urlDraft} onChange={e => setUrlDraft(e.target.value)} className={inputCls} placeholder="https://…/avatar.jpg" />
                  <div className="flex gap-2 mt-3">
                    <button type="button" onClick={applyUrl} className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm px-4 py-2 rounded-full transition active:scale-95">Apply</button>
                    <button type="button" onClick={() => setUrlOpen(false)} className="text-neutral-300 hover:text-white text-sm px-4 py-2 rounded-full hover:bg-neutral-800/50 transition">Cancel</button>
                  </div>
                </div>
              )}
              {!urlOpen && <p className="text-xs text-neutral-500 mt-3">Tap the camera icon to change your photo</p>}
            </div>

            {/* Privacy card */}
            <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-5">
              <h2 className="flex items-center gap-2 text-[15px] font-semibold text-white mb-1"><Shield size={16} className="text-neutral-400" /> Privacy</h2>
              <p className="text-xs text-neutral-500 mb-3">Control what the world sees about you</p>

              {[
                { key: 'showActivity', title: 'Show listening activity', desc: 'Public top tracks on your profile' },
                { key: 'showFavs', title: 'Show followed artists', desc: 'Display artists you follow' },
                { key: 'privateListening', title: 'Private listening session', desc: 'Pause history recording' },
              ].map(row => (
                <div key={row.key} className="flex items-center justify-between py-3 border-b border-neutral-800/50 last:border-0 last:pb-0 first:pt-1">
                  <div className="min-w-0 mr-4">
                    <p className="text-sm font-medium text-white">{row.title}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{row.desc}</p>
                  </div>
                  <Switch on={!!localSettings[row.key]} label={row.title}
                    onChange={v => setLocalSettings({ ...localSettings, [row.key]: v })} />
                </div>
              ))}
            </div>
          </div>

          {/* Right: inputs */}
          <div className="flex flex-col gap-5 md:gap-4">
            <div>
              <Label icon={User} text="Display name" hint="The name shown on your public profile" />
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Your display name" />
            </div>

            <div>
              <Label icon={Type} text="Username" hint="No spaces — used in your profile link" />
              <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} className={inputCls} placeholder="your.handle" />
            </div>

            <div>
              <Label icon={Mail} text="Email" hint="Used for sign-in and account emails" />
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={inputCls} placeholder="you@example.com" />
            </div>

            <div>
              <Label icon={Type} text="Bio" hint="A short line about you" />
              <div className="relative">
                <textarea value={form.bio} maxLength={150} onChange={e => setForm({ ...form, bio: e.target.value })}
                  className={`${inputCls} min-h-[96px] resize-none pb-8`} placeholder="Tell the world about you…" />
                <span className="absolute bottom-2.5 right-3 text-[11px] text-neutral-500 tabular-nums">{(form.bio || '').length}/150</span>
              </div>
            </div>

            <div>
              <Label icon={CalendarDays} text="Date of birth" hint="Shown as a birthday celebration on your profile" />
              <input type="date" value={form.dob || ''} onChange={e => setForm({ ...form, dob: e.target.value })}
                className={`${inputCls} [color-scheme:dark]`} />
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-end gap-3 pt-1">
              <button type="button" onClick={goBack}
                className="text-neutral-300 hover:text-white text-[15px] font-medium px-5 py-2.5 rounded-full hover:bg-neutral-800/50 transition">
                Cancel
              </button>
              <button type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-[15px] px-6 py-2.5 rounded-full shadow-sm transition active:scale-95">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
