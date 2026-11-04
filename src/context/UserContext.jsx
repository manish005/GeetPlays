import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const Ctx = createContext(null)

function load(key, fb) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fb } catch { return fb } }
function save(key, v) { try { localStorage.setItem(key, JSON.stringify(v)) } catch {} }

const defaultProfile = { name: 'Guest', username: 'guest', email: '', bio: '', avatar: null, dob: '', following: [], followers: 128 }

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => load('vb_user', null))
  const [profile, setProfile] = useState(() => load('vb_profile', defaultProfile))
  const [settings, setSettings] = useState(() => load('vb_settings', {
    theme: 'dark', accent: '#1ED760', quality: 'Auto', crossfade: 0, autoplay: true,
    normalize: false, privateListening: false, showActivity: true, showFavs: true,
    notifReleases: true, notifPlaylists: true, notifAccount: true, language: 'English', plan: 'Free',
  }))
  const [history, setHistory] = useState(() => load('vb_history', []))
  const [notifications, setNotifications] = useState(() => load('vb_notifs', null))
  const [customPlaylists, setCustomPlaylists] = useState(() => load('vb_custom', []))
  const [dismissedHistory, setDismissedHistory] = useState(() => load('vb_history_gone', []))

  useEffect(() => { save('vb_user', user) }, [user])
  useEffect(() => { save('vb_profile', profile) }, [profile])
  useEffect(() => { save('vb_settings', settings) }, [settings])
  useEffect(() => { save('vb_history', history) }, [history])
  useEffect(() => { save('vb_notifs', notifications) }, [notifications])
  useEffect(() => { save('vb_custom', customPlaylists) }, [customPlaylists])
  useEffect(() => { save('vb_history_gone', dismissedHistory) }, [dismissedHistory])

  const login = useCallback((name, email, role = 'user') => {
    const u = { name, email, role }
    setUser(u)
    setProfile(p => ({ ...p, name, email }))
    try { localStorage.setItem('gp_role', role) } catch {}
    return u
  }, [])
  const logout = useCallback(() => { setUser(null); try { localStorage.removeItem('gp_role') } catch {} }, [])
  const pushHistory = useCallback((track) => {
    if (settings.privateListening) return
    setHistory(h => {
      const filtered = h.filter(x => x.trackId !== track.id || dismissedHistory.includes(x.id))
      return [{ id: `${track.id}-${Date.now()}`, trackId: track.id, title: track.title, artist: track.artist, at: Date.now() }, ...filtered].slice(0, 60)
    })
  }, [settings.privateListening, dismissedHistory])
  const removeHistory = useCallback((id) => {
    setHistory(h => h.filter(x => x.id !== id))
    setDismissedHistory(d => [...d, id])
  }, [])
  const clearHistory = useCallback(() => { setDismissedHistory(d => [...d, ...history.map(x => x.id)]); setHistory([]) }, [history])
  const createPlaylist = useCallback((pl) => {
    const p = { id: `c${Date.now()}`, name: pl.name, desc: pl.desc || '', cover: `https://picsum.photos/seed/${Date.now()}/600/600`, owner: profile.name, trackIds: pl.trackIds || [], visibility: pl.visibility || 'Public' }
    setCustomPlaylists(list => [...list, p])
    return p
  }, [profile.name])
  const updatePlaylist = useCallback((id, patch) => setCustomPlaylists(list => list.map(p => p.id === id ? { ...p, ...patch } : p)), [])
  const addToPlaylist = useCallback((id, trackId) => setCustomPlaylists(list => list.map(p => (p.id === id && !p.trackIds.includes(trackId)) ? { ...p, trackIds: [...p.trackIds, trackId] } : p)), [])
  const removeFromPlaylist = useCallback((id, trackId) => setCustomPlaylists(list => list.map(p => (p.id === id) ? { ...p, trackIds: p.trackIds.filter(t => t !== trackId) } : p)), [])
  const reorderPlaylist = useCallback((id, from, to) => setCustomPlaylists(list => list.map(p => {
    if (p.id !== id) return p
    const arr = [...p.trackIds]; const [m] = arr.splice(from, 1); arr.splice(to, 0, m); return { ...p, trackIds: arr }
  })), [])
  const deletePlaylist = useCallback((id) => setCustomPlaylists(list => list.filter(p => p.id !== id)), [])
  const toggleFollow = useCallback((name) => setProfile(p => ({
    ...p, following: p.following.includes(name) ? p.following.filter(x => x !== name) : [...p.following, name],
  })), [])

  return (
    <Ctx.Provider value={{
      user, profile, settings, history, notifications, customPlaylists,
      setProfile, setSettings, setNotifications,
      login, logout, pushHistory, removeHistory, clearHistory,
      createPlaylist, updatePlaylist, addToPlaylist, removeFromPlaylist, reorderPlaylist, deletePlaylist,
      toggleFollow,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useUser = () => useContext(Ctx)
