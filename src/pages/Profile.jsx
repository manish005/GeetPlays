import { Pencil, Share2, Users, UserPlus, Globe } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { useToast } from '../context/ToastContext'
import { playlists, artistByName, tracks } from '../data/catalog'
import Cover from '../components/Cover'
import Card from '../components/Card'
import Section, { HScroll } from '../components/Section'
import { usePlayer } from '../context/PlayerContext'

export default function Profile({ openPlaylist, openArtist, go }) {
  const { profile, logout, settings } = useUser()
  const { toast } = useToast()
  const { playAll } = usePlayer()
  const following = profile.following || []

  return (
    <div className="w-full min-w-0 pb-40 md:pb-8">
      <header className="sticky top-0 z-30 bg-gradient-to-b from-[#333]/90 to-[#121212]/70 backdrop-blur-md px-4 md:px-8 pt-3 pb-3 flex items-center justify-between">
        <h1 className="text-[20px] font-bold">Profile</h1>
        <button onClick={() => { logout(); toast('Logged out') }} className="text-[13px] text-muted hover:text-white font-semibold">Log out</button>
      </header>

      <div className="px-4 flex flex-col items-center text-center mt-6">
        {profile.avatar ? <img src={profile.avatar} alt="" className="w-36 h-36 rounded-full object-cover shadow-2xl" />
          : <span className="w-36 h-36 rounded-full bg-[#8D67AB] text-black text-5xl font-black flex items-center justify-center shadow-2xl">{(profile.name || 'G')[0].toUpperCase()}</span>}
        <h1 className="text-3xl md:text-4xl font-black mt-4 flex items-center gap-2">{profile.name} {settings.showFavs && <Globe size={18} className="text-muted" />}</h1>
        <p className="text-muted mt-1">@{profile.username}</p>
        <p className="text-[15px] mt-3 max-w-md leading-relaxed">{profile.bio || 'Music lover. Building playlists for every mood.'}</p>
        <div className="flex items-center gap-6 mt-4 text-sm">
          <span className="flex items-center gap-1.5"><Users size={16} className="text-muted" /> {profile.followers} followers</span>
          <span className="flex items-center gap-1.5"><UserPlus size={16} className="text-muted" /> {following.length} following</span>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={() => go && go('edit-profile')} className="px-5 py-2 rounded-full bg-white text-black font-bold text-sm hover:scale-105 flex items-center gap-2"><Pencil size={15} /> Edit profile</button>
          <button onClick={() => { navigator.clipboard?.writeText(location.href); toast('Profile link copied') }} className="px-5 py-2 rounded-full border border-white/40 hover:border-white font-bold text-sm flex items-center gap-2"><Share2 size={15} /> Share</button>
        </div>
      </div>

      <Section title="Public playlists">
        <HScroll>
          {playlists.map(p => (
            <Card key={p.id} item={p} subtitle={`${p.trackIds.length} songs`} onClick={() => openPlaylist(p.id)} onPlay={() => playAll(p.trackIds)} />
          ))}
        </HScroll>
      </Section>

      <Section title="Followed artists">
        {following.length === 0 ? <p className="px-4 text-muted text-sm">Artists you follow will appear here.</p> : (
          <HScroll>
            {following.map(name => (
              <Card key={name} item={{ name, img: artistByName[name]?.img || `https://picsum.photos/seed/${name}/300/300` }} subtitle="Artist"
                onClick={() => openArtist(name)} onPlay={() => playAll(tracks.filter(t => t.artist === name).map(t => t.id))} />
            ))}
          </HScroll>
        )}
      </Section>

      {settings.showActivity && (
        <Section title="Top tracks">
          <div>
            {tracks.slice(0, 5).map((t, i) => (
              <button key={t.id} onClick={() => playAll(tracks.map(x => x.id))} className="flex items-center gap-3 w-full px-4 py-2 hover:bg-white/5 text-left">
                <span className="text-muted w-4 text-center text-sm">{i + 1}</span>
                <Cover src={t.cover} alt={t.title} className="w-10 h-10" />
                <span className="flex-1 min-w-0"><span className="block truncate text-[15px]">{t.title}</span><span className="block truncate text-[13px] text-muted">{t.artist}</span></span>
                <span className="text-[13px] text-muted">{t.plays} plays</span>
              </button>
            ))}
          </div>
        </Section>
      )}

    </div>
  )
}
