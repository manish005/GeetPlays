import { useMemo, useState } from 'react'
import { Bell, History, Globe } from 'lucide-react'
import { tracks, playlists, artists, albumsCatalog, LANGUAGES } from '../data/catalog'
import { usePlayer } from '../context/PlayerContext'
import { useUser } from '../context/UserContext'
import Card from '../components/Card'
import Section, { HScroll } from '../components/Section'
import Cover from '../components/Cover'
import TrackRow from '../components/TrackRow'
import BannerCarousel from '../components/BannerCarousel'

export default function Home({ openPlaylist, openArtistPlaylist, openArtist, openAlbum, openSong, go }) {
  const [chip, setChip] = useState('All')
  const [lang, setLang] = useState('All')
  const { playPlaylist, playAll, startTrack } = usePlayer()
  const { profile } = useUser()
  const greeting = useMemo(() => {
    const h = new Date().getHours()
    return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
  }, [])

  const inLang = (t) => lang === 'All' || t.lang === lang
  const ft = tracks.filter(inLang)
  const recents = playlists.slice(0, 6)
  const trending = [...ft].sort((a, b) => parseFloat(b.plays) - parseFloat(a.plays))
  const newReleases = [...ft].sort((a, b) => b.year - a.year).slice(0, 6)
  // Era buckets (use year, fallback to newest for Gen Z)
  const byEra = (test) => ft.filter(test)
  const is90s = byEra(t => t.year >= 1990 && t.year < 2000)
  const is80s = byEra(t => t.year >= 1980 && t.year < 1990)
  const isGenZ = byEra(t => t.year >= 2015)

  // Banner: latest + most-played (top 5 by plays among newest 8)
  const bannerSlides = [...ft]
    .sort((a, b) => (b.year - a.year) || (parseFloat(b.plays) - parseFloat(a.plays)))
    .slice(0, 8)
    .sort((a, b) => parseFloat(b.plays) - parseFloat(a.plays))
    .slice(0, 5)
    .map(t => ({ id: t.id, cover: t.cover.replace('/300/300', '/1200/600'), title: t.title, subtitle: `${t.artist} • ${t.album}`, track: t }))

  const pass = { openSong, openAlbum, openArtist }
  const playByArtist = (name) => playAll(tracks.filter(t => t.artist === name && (lang === 'All' || t.lang === lang)).map(t => t.id))

  return (
    <div className="w-full min-w-0 pb-40 md:pb-8">
      <header className="sticky top-0 z-30 w-full min-w-0 bg-gradient-to-b from-[#2a1a4a]/90 to-[#121212]/60 backdrop-blur-md px-4 md:px-8 py-2.5 flex items-center gap-3">
        {/* Language pills */}
        <div className="flex gap-2 flex-1 min-w-0 overflow-x-auto no-scrollbar">
          {LANGUAGES.map(c => (
            <button key={c} onClick={() => setLang(c)}
              className={`text-[13px] font-medium px-3.5 py-1.5 rounded-full whitespace-nowrap transition shrink-0 ${lang === c ? 'bg-spot text-black' : 'bg-white/10 hover:bg-white/20'}`}>{c}</button>
          ))}
        </div>
        <button aria-label="Notifications" onClick={() => go && go('notifications')} className="p-2 text-muted hover:text-white shrink-0"><Bell size={20} /></button>
        <button aria-label="History" onClick={() => go && go('history')} className="p-2 text-muted hover:text-white shrink-0"><History size={20} /></button>
      </header>

      <BannerCarousel
        slides={bannerSlides}
        onPlay={(s) => startTrack(s.id)}
        onOpen={(s) => openSong(s.id)}
      />

      <h1 className="px-4 md:px-8 mt-5 md:mt-6 text-[22px] md:text-[32px] font-bold leading-tight">{greeting}</h1>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mt-4 px-4 md:px-8 w-full">
        {recents.map(p => (
          <button key={p.id} onClick={() => openPlaylist(p.id)}
            className="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-md overflow-hidden text-left group min-h-[48px] transition">
            <Cover src={p.cover} alt={p.name} className="w-12 h-12 shrink-0" rounded="rounded-none" />
            <span className="text-[13px] font-semibold leading-snug pr-2 flex-1 min-w-0 truncate">{p.name}</span>
            <span className="hidden group-hover:flex w-9 h-9 mr-2 rounded-full bg-spot text-black items-center justify-center shrink-0"
              onClick={e => { e.stopPropagation(); playPlaylist(p.id) }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            </span>
          </button>
        ))}
      </div>

      <Section title="Made For You">
        <HScroll>
          {playlists.map(p => (
            <Card key={p.id} item={p} subtitle={p.desc} onClick={() => openPlaylist(p.id)} onPlay={() => playPlaylist(p.id)} />
          ))}
        </HScroll>
      </Section>

      {/* Era carousels — same style as Made For You / Jump back in */}
      {is90s.length > 0 && (
        <Section title="Popular in the ’90s">
          <HScroll>
            {is90s.map((t, i) => (
              <Card key={t.id} item={{ name: t.title, cover: t.cover }} subtitle={`${t.artist} • ${t.year}`} pill="90s"
                onClick={() => openSong(t.id)} onPlay={() => startTrack(t.id, is90s.map(x => x.id))} />
            ))}
          </HScroll>
        </Section>
      )}
      {is80s.length > 0 && (
        <Section title="80s Legends">
          <HScroll>
            {is80s.map((t, i) => (
              <Card key={t.id} item={{ name: t.title, cover: t.cover }} subtitle={`${t.artist} • ${t.year}`} pill="80s"
                onClick={() => openSong(t.id)} onPlay={() => startTrack(t.id, is80s.map(x => x.id))} />
            ))}
          </HScroll>
        </Section>
      )}
      {isGenZ.length > 0 && (
        <Section title="Gen Z Hits">
          <HScroll>
            {isGenZ.map((t, i) => (
              <Card key={t.id} item={{ name: t.title, cover: t.cover }} subtitle={`${t.artist} • ${t.year}`} pill="Gen Z"
                onClick={() => openSong(t.id)} onPlay={() => startTrack(t.id, isGenZ.map(x => x.id))} />
            ))}
          </HScroll>
        </Section>
      )}

      {/* Artist carousels by category — circular cards, click opens playlist of that artist */}
      <Section title="Jump back in">
        <HScroll>
          {(lang === 'All' ? artists : artists.filter(a => tracks.some(t => t.artist === a.name && t.lang === lang))).map(a => (
            <Card key={a.name} item={{ name: a.name, img: a.img }} subtitle="Artist" circle
              onClick={() => openArtistPlaylist(a.name)} onPlay={() => playByArtist(a.name)} />
          ))}
        </HScroll>
      </Section>

      <Section title="Pop Artists">
        <HScroll>
          {artists.filter(a => tracks.some(t => t.artist === a.name && t.genre === 'Pop' && (lang === 'All' || t.lang === lang))).map(a => (
            <Card key={a.name} item={{ name: a.name, img: a.img }} subtitle="Pop Artist" circle pill="Pop"
              onClick={() => openArtistPlaylist(a.name)} onPlay={() => playByArtist(a.name)} />
          ))}
        </HScroll>
      </Section>

      <Section title="Rock & Hip-Hop Artists">
        <HScroll>
          {artists.filter(a => tracks.some(t => t.artist === a.name && ['Rock', 'Hip-Hop'].includes(t.genre) && (lang === 'All' || t.lang === lang))).map(a => (
            <Card key={a.name} item={{ name: a.name, img: a.img }} subtitle="Rock / Hip-Hop" circle
              onClick={() => openArtistPlaylist(a.name)} onPlay={() => playByArtist(a.name)} />
          ))}
        </HScroll>
      </Section>

      <Section title="Electronic & Indie Artists">
        <HScroll>
          {artists.filter(a => tracks.some(t => t.artist === a.name && ['Electronic', 'Indie'].includes(t.genre) && (lang === 'All' || t.lang === lang))).map(a => (
            <Card key={a.name} item={{ name: a.name, img: a.img }} subtitle="Electronic / Indie" circle
              onClick={() => openArtistPlaylist(a.name)} onPlay={() => playByArtist(a.name)} />
          ))}
        </HScroll>
      </Section>

      {lang !== 'All' && (
        <Section title={`${lang} Artists`} action={<span className="text-[11px] text-muted font-medium">{lang}</span>}>
          <HScroll>
            {artists.filter(a => tracks.some(t => t.artist === a.name && t.lang === lang)).map(a => (
              <Card key={a.name} item={{ name: a.name, img: a.img }} subtitle={`${lang} Artist`} circle pill={lang}
                onClick={() => openArtistPlaylist(a.name)} onPlay={() => playByArtist(a.name)} />
            ))}
          </HScroll>
        </Section>
      )}

      <Section title="Popular right now">
        <div>
          {trending.slice(0, 5).map((t, i) => (
            <TrackRow key={t.id} track={t} index={i} queueIds={trending.map(x => x.id)} {...pass} />
          ))}
          {trending.length === 0 && <p className="px-4 md:px-8 py-6 text-muted text-sm">No {lang} tracks yet — try another language.</p>}
        </div>
      </Section>

      <Section title="Recently played">
        <div className="md:grid md:grid-cols-2">
          {ft.slice(0, 8).map((t, i) => (
            <TrackRow key={t.id} track={t} index={i} queueIds={ft.map(x => x.id)} showAlbum={false} {...pass} />
          ))}
        </div>
      </Section>

      <Section title="Popular albums">
        <HScroll>
          {albumsCatalog.filter(a => {
            const first = tracks.find(t => t.album === a.name)
            return !first || lang === 'All' || first.lang === lang
          }).map(a => (
            <Card key={a.name} item={{ name: a.name, cover: a.cover }} subtitle={`${a.artist} • ${a.year}`}
              onClick={() => openAlbum(a.name)} onPlay={() => playAll(a.trackIds)} />
          ))}
        </HScroll>
      </Section>

      <Section title="New releases">
        <div>
          {newReleases.map((t, i) => (
            <TrackRow key={t.id} track={t} index={i} queueIds={newReleases.map(x => x.id)} {...pass} />
          ))}
        </div>
      </Section>

      <Section title="Recommended for you">
        <div>
          {ft.slice(3, 9).map((t, i) => (
            <TrackRow key={t.id} track={t} index={i} queueIds={ft.map(x => x.id)} {...pass} />
          ))}
        </div>
      </Section>
    </div>
  )
}
