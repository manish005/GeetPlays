import { useState } from 'react'
import { PageHeader, inputCls } from '../components/ui'
import { useUser } from '../context/UserContext'
import { useToast } from '../context/ToastContext'

function Row({ label, desc, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 border-b border-white/5 px-4">
      <div className="min-w-0">
        <p className="text-[15px]">{label}</p>
        {desc && <p className="text-[12px] text-muted mt-0.5">{desc}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}
function Toggle({ on, onChange }) {
  return <button role="switch" aria-checked={on} onClick={() => onChange(!on)} className={`w-11 h-6 rounded-full relative transition ${on ? 'bg-spot' : 'bg-white/20'}`}><span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${on ? 'left-6' : 'left-1'}`} /></button>
}
function Select({ value, options, onChange }) {
  return <select value={value} onChange={e => onChange(e.target.value)} className={`${inputCls} w-40 py-2 text-sm`}>{options.map(o => <option key={o} value={o}>{o}</option>)}</select>
}

export default function Settings({ goBack, openPremium, logout }) {
  const { settings, setSettings, profile } = useUser()
  const { toast } = useToast()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const s = { ...settings }
  const set = (patch) => { setSettings({ ...settings, ...patch }); toast('Settings saved') }

  return (
    <div className="pb-40 md:pb-8">
      <PageHeader title="Settings" onBack={goBack} />

      <div className="px-4 mt-4">
        <div className="flex items-center gap-4 bg-card rounded-lg p-4">
          <span className="w-14 h-14 rounded-full bg-[#8D67AB] text-black text-xl font-black flex items-center justify-center shrink-0">{(profile.name || 'G')[0].toUpperCase()}</span>
          <div className="min-w-0">
            <p className="font-bold truncate">{profile.name}</p>
            <p className="text-muted text-sm truncate">{profile.email || 'No email set'}</p>
          </div>
          <span className="ml-auto text-xs font-bold bg-spot text-black px-2.5 py-1 rounded-full shrink-0">{settings.plan === 'Premium' ? 'PREMIUM' : 'FREE'}</span>
        </div>
        <button onClick={openPremium} className="w-full mt-3 border border-white/30 hover:border-white rounded-full py-2.5 text-sm font-bold">Manage subscription</button>
      </div>

      <section className="mt-6">
        <h2 className="px-4 text-base font-bold mb-1">Account</h2>
        <Row label="Email" desc="Used for sign-in"><span className="text-muted text-sm truncate max-w-[160px]">{profile.email || '—'}</span></Row>
        <Row label="Username" desc="Your display handle"><span className="text-muted text-sm">@{profile.username}</span></Row>
        <Row label="Plan" desc="Current subscription"><span className="text-sm font-semibold">{settings.plan}</span></Row>
      </section>

      <section className="mt-6">
        <h2 className="px-4 text-base font-bold mb-1">Appearance</h2>
        <Row label="Theme" desc="Dark is always available"><Select value={settings.theme} options={['dark', 'light', 'system']} onChange={v => set({ theme: v })} /></Row>
        <Row label="Accent color">
          <div className="flex gap-2">{['#1ED760', '#1DB954', '#E13300', '#5038E6', '#0D73EC'].map(c => (
            <button key={c} aria-label={c} onClick={() => set({ accent: c })} className={`w-7 h-7 rounded-full ${settings.accent === c ? 'ring-2 ring-white' : ''}`} style={{ background: c }} />
          ))}</div>
        </Row>
      </section>

      <section className="mt-6">
        <h2 className="px-4 text-base font-bold mb-1">Playback</h2>
        <Row label="Audio quality"><Select value={settings.quality} options={['Auto', 'Low', 'Normal', 'High']} onChange={v => set({ quality: v })} /></Row>
        <Row label="Crossfade" desc="Fade between tracks"><span className="text-sm text-muted">{settings.crossfade}s</span></Row>
        <Row label="Autoplay"><Toggle on={settings.autoplay} onChange={v => set({ autoplay: v })} /></Row>
        <Row label="Normalize volume"><Toggle on={settings.normalize} onChange={v => set({ normalize: v })} /></Row>
      </section>

      <section className="mt-6">
        <h2 className="px-4 text-base font-bold mb-1">Privacy</h2>
        <Row label="Private listening" desc="Don’t record history"><Toggle on={settings.privateListening} onChange={v => set({ privateListening: v })} /></Row>
        <Row label="Show listening activity"><Toggle on={settings.showActivity} onChange={v => set({ showActivity: v })} /></Row>
        <Row label="Show favourite artists"><Toggle on={settings.showFavs} onChange={v => set({ showFavs: v })} /></Row>
      </section>

      <section className="mt-6">
        <h2 className="px-4 text-base font-bold mb-1">Notifications</h2>
        <Row label="New releases"><Toggle on={settings.notifReleases} onChange={v => set({ notifReleases: v })} /></Row>
        <Row label="Playlist updates"><Toggle on={settings.notifPlaylists} onChange={v => set({ notifPlaylists: v })} /></Row>
        <Row label="Account notifications"><Toggle on={settings.notifAccount} onChange={v => set({ notifAccount: v })} /></Row>
      </section>

      <section className="mt-6">
        <h2 className="px-4 text-base font-bold mb-1">Language & Region</h2>
        <Row label="Language"><Select value={settings.language} options={['English', 'Hindi', 'Spanish', 'French', 'German']} onChange={v => set({ language: v })} /></Row>
      </section>

      <div className="px-4 mt-8 flex flex-col gap-3">
        <button onClick={() => { logout(); toast('Logged out') }} className="w-full border border-white/30 hover:border-white rounded-full py-3 font-bold">Log out</button>
        {!confirmDelete ? (
          <button onClick={() => setConfirmDelete(true)} className="w-full text-red-400 font-bold py-2 text-sm">Delete account</button>
        ) : (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-sm">Delete your account? This clears local profile and history.</p>
            <div className="flex gap-2 mt-3">
              <button onClick={() => { localStorage.clear(); location.reload() }} className="flex-1 bg-red-500 text-white rounded-full py-2 font-bold text-sm">Yes, delete</button>
              <button onClick={() => setConfirmDelete(false)} className="flex-1 border border-white/30 rounded-full py-2 font-bold text-sm">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
