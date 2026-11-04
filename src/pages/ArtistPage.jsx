import { ArrowLeft, Play, Shuffle, BadgeCheck, Share2, MoreHorizontal, Plus, Check } from 'lucide-react'
import { tracks, artistDetail, artistByName, albumsCatalog } from '../data/catalog'
import { usePlayer } from '../context/PlayerContext'
import { useUser } from '../context/UserContext'
import { useToast } from '../context/ToastContext'
import TrackRow from '../components/TrackRow'
import Cover from '../components/Cover'
import Section, { HScroll } from '../components/Section'
import Card from '../components/Card'

export default function ArtistPage({ name, goBack, openAlbum, openArtist }) {
  const { startTrack, playAll } = usePlayer()
  const { profile, toggleFollow } = useUser()
  const { toast } = useToast()
  const detail = artistDetail[name] || { listeners: '500K', verified: false, bio: 'An emerging voice on the GeetPlays roster.', tags: ['Pop'] }
  const img = artistByName[name]?.img || `https://picsum.photos/seed/${name}/600/600`
  const myTracks = tracks.filter(t => t.artist === name)
  const queueIds = myTracks.map(t => t.id)
  const albums = albumsCatalog.filter(a => a.artist === name)
  const following = profile.following.includes(name)
  const similar = Object.keys(artistDetail).filter(a => a !== name && artistDetail[a].tags.some(t => detail.tags.includes(t)))

  return (
    <div className="pb-40 md:pb-8">
      <div className="relative h-64 md:h-80 bg-gradient-to-b from-[#444] to-[#121212]">
        <img src={img} alt={name} className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
        <button aria-label="Back" onClick={goBack} className="absolute top-3 left-3 p-2 rounded-full bg-black/40 backdrop-blur z-10"><ArrowLeft size={22} /></button>
        <div className="absolute bottom-4 left-4 md:left-8 z-10">
          <p className="flex items-center gap-1.5 text-sm font-semibold"><BadgeCheck size={20} className="text-spot" fill="#000" /> {detail.verified ? 'Verified Artist' : 'Artist'}</p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mt-1">{name}</h1>
          <p className="text-muted mt-2 text-sm md:text-base">{detail.listeners} monthly listeners</p>
        </div>
      </div>

      <div className="flex items-center gap-4 px-4 md:px-8 mt-4">
        <button aria-label="Play" onClick={() => playAll(queueIds.length ? queueIds : tracks.map(t => t.id))}
          className="w-14 h-14 rounded-full bg-spot text-black flex items-center justify-center hover:scale-105 shadow-lg"><Play size={26} fill="currentColor" className="ml-0.5" /></button>
        <button aria-label="Shuffle" onClick={() => { const ids = [...queueIds].sort(() => Math.random() - .5); playAll(ids.length ? ids : tracks.map(t => t.id)) }}
          className="text-muted hover:text-white"><Shuffle size={26} /></button>
        <button onClick={() => { toggleFollow(name); toast(following ? `Unfollowed ${name}` : `Following ${name}`) }}
          className={`px-4 py-1.5 rounded-full border text-sm font-bold ${following ? 'border-white/40 text-white' : 'border-white hover:border-white'}`}>
          {following ? <><Check size={14} className="inline mr-1 -mt-0.5" />Following</> : 'Follow'}
        </button>
        <button aria-label="Share" onClick={() => { navigator.clipboard?.writeText(location.href); toast('Link copied') }} className="text-muted hover:text-white"><Share2 size={22} /></button>
        <button aria-label="More" className="text-muted hover:text-white"><MoreHorizontal size={26} /></button>
      </div>

      <Section title="Popular">
        <div>
          {(myTracks.length ? myTracks : tracks.slice(0, 5)).map((t, i) => (
            <TrackRow key={t.id} track={t} index={i} queueIds={queueIds.length ? queueIds : tracks.map(x => x.id)} />
          ))}
        </div>
      </Section>

      {albums.length > 0 && (
        <Section title="Albums">
          <HScroll>
            {albums.map(a => (
              <Card key={a.name} item={{ name: a.name, cover: a.cover }} subtitle={`${a.year} • Album`}
                onClick={() => openAlbum(a.name)} onPlay={() => playAll(a.trackIds)} />
            ))}
          </HScroll>
        </Section>
      )}

      <Section title="About">
        <div className="px-4 flex gap-4 items-start">
          <Cover src={img} alt={name} className="w-20 h-20 shrink-0" rounded="rounded-full" />
          <div>
            <p className="font-semibold">{name} {detail.verified && <BadgeCheck size={16} className="inline text-spot" />}</p>
            <p className="text-muted text-sm mt-0.5">{detail.listeners} monthly listeners</p>
            <p className="text-[15px] mt-2 leading-relaxed">{detail.bio}</p>
            <div className="flex gap-2 mt-3 flex-wrap">
              {detail.tags.map(t => <span key={t} className="text-xs bg-white/10 px-2.5 py-1 rounded-full">{t}</span>)}
            </div>
          </div>
        </div>
      </Section>

      {similar.length > 0 && (
        <Section title="Similar artists">
          <HScroll>
            {similar.map(a => (
              <Card key={a} item={{ name: a, img: artistByName[a]?.img || `https://picsum.photos/seed/${a}/300/300` }} subtitle="Artist"
                onClick={() => openArtist(a)} onPlay={() => playAll(tracks.filter(t => t.artist === a).map(t => t.id))} />
            ))}
          </HScroll>
        </Section>
      )}
    </div>
  )
}
