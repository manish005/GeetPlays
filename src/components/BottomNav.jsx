import { Home, Search, LibraryBig, Crown } from 'lucide-react'
import { useUser } from '../context/UserContext'

const ITEMS = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'search', label: 'Search', icon: Search },
  { key: 'library', label: 'Your Library', icon: LibraryBig },
  { key: 'premium', label: 'Premium', icon: Crown },
]

export default function BottomNav({ view, go }) {
  const { profile } = useUser()
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-gradient-to-t from-black via-black/95 to-black/70 backdrop-blur-md safe-b">
      <div className="grid grid-cols-5 max-w-[480px] mx-auto">
        {ITEMS.map(({ key, label, icon: Icon }) => {
          const active = view === key || (key === 'library' && ['playlist', 'album', 'artist', 'song', 'history', 'notifications', 'profile', 'edit-profile', 'settings', 'admin', 'queue', 'lyrics', 'browse', 'genre'].includes(view))
          return (
            <button key={key} onClick={() => go(key)} className="flex flex-col items-center gap-0.5 py-2 min-h-[56px] justify-center">
              <Icon size={24} className={active ? 'text-white' : 'text-[#A7A7A7]'} strokeWidth={active ? 2.4 : 1.8} />
              <span className={`text-[10px] ${active ? 'text-white' : 'text-[#A7A7A7]'}`}>{label}</span>
            </button>
          )
        })}
        {/* Right-bottom avatar → Profile */}
        <button onClick={() => go('profile')} className="flex flex-col items-center gap-0.5 py-2 min-h-[56px] justify-center"
          aria-label="Profile">
          {profile.avatar ? (
            <img src={profile.avatar} alt="" className="w-6 h-6 rounded-full object-cover ring-1 ring-white/20" />
          ) : (
            <span className="w-6 h-6 rounded-full bg-[#8D67AB] text-black font-bold flex items-center justify-center text-[10px] ring-1 ring-white/20">
              {(profile.name || 'G')[0].toUpperCase()}
            </span>
          )}
          <span className={`text-[10px] ${view === 'profile' || view === 'edit-profile' ? 'text-white' : 'text-[#A7A7A7]'}`}>Profile</span>
        </button>
      </div>
    </nav>
  )
}
