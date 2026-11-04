import { tracks, categories, moodCatalog, playlists, albumsCatalog } from '../data/catalog'
import { PageHeader } from '../components/ui'
import { usePlayer } from '../context/PlayerContext'
import Card from '../components/Card'
import Section, { HScroll } from '../components/Section'
import BannerCarousel from '../components/BannerCarousel'

export default function Browse({ goBack, openGenre, openPlaylist, openAlbum, openSong }) {
  const { playAll, startTrack, liked } = usePlayer()
  const genres = categories.filter(c => !['Podcasts', 'Mood', 'Chill', 'Workout'].includes(c.name))

  // Top 10 trending by plays, with rank, views, listeners, favourite flag
  const top10 = [...tracks].sort((a, b) => parseFloat(b.plays) - parseFloat(a.plays)).slice(0, 10)
  const trendingSlides = top10.map((t, i) => ({
    id: t.id,
    cover: t.cover.replace('/300/300', '/1200/600'),
    title: t.title,
    subtitle: `${t.artist} • ${t.album}`,
    rank: i + 1,
    views: t.plays,
    listeners: `${(parseFloat(t.plays) * 0.42).toFixed(1)}M`,
    fav: liked.has(t.id),
    track: t,
  }))

  return (
    <div className="w-full min-w-0 pb-40 md:pb-8">
      <PageHeader title="Genres & Moods" onBack={goBack} />

      <BannerCarousel
        slides={trendingSlides}
        variant="browse"
        onPlay={(s) => startTrack(s.id)}
        onOpen={(s) => openSong && openSong(s.id)}
      />

      {/* Trending top-10 strip: rank pill + views/listeners/fav */}
      <section className="mt-7 md:mt-9">
        <div className="px-4 md:px-8 flex items-center justify-between mb-3 md:mb-4">
          <h2 className="text-[21px] md:text-2xl font-bold flex items-center gap-2">
            Top 10 Trending
            {trendingSlides[0] && <span className="text-[11px] font-bold bg-[#E13300] text-white px-2 py-0.5 rounded-full">#{trendingSlides[0].rank} {trendingSlides[0].title}</span>}
          </h2>
        </div>
        <div className="flex gap-3 md:gap-4 overflow-x-auto no-scrollbar px-4 md:px-8 pb-1">
          {top10.map((t, i) => (
            <button key={t.id} onClick={() => openSong ? openSong(t.id) : startTrack(t.id)}
              className="relative w-[140px] sm:w-[160px] shrink-0 text-left rounded-lg p-3 hover:bg-white/5 transition">
              <span className="absolute top-2 left-2 z-10 text-[10px] font-black bg-[#E13300] text-white px-1.5 py-0.5 rounded-full shadow">#{i + 1}</span>
              <img src={t.cover} alt={t.title} className="w-full aspect-square rounded-md object-cover bg-elev shadow" draggable={false} />
              <p className="truncate text-sm font-semibold mt-2">{t.title}</p>
              <p className="truncate text-xs text-muted">{t.artist}</p>
              <p className="text-[11px] text-muted mt-1">{t.plays} views • {(parseFloat(t.plays) * 0.42).toFixed(1)}M listeners</p>
              {liked.has(t.id) && <span className="text-[11px] text-spot font-semibold">♥ Favourite</span>}
            </button>
          ))}
        </div>
      </section>

      <Section title="Genres">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 px-4">
          {genres.map(c => (
            <button key={c.name} onClick={() => openGenre(c.name)} className="relative h-24 rounded-lg overflow-hidden text-left active:scale-[.98] transition" style={{ background: c.color }}>
              <span className="absolute top-2.5 left-3 font-bold text-[15px] drop-shadow">{c.name}</span>
              <span className="absolute -right-3 -bottom-2 w-16 h-16 rounded-md rotate-[25deg] bg-black/25 shadow-lg flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z" /></svg>
              </span>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Moods">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-4">
          {moodCatalog.map(m => (
            <button key={m.name} onClick={() => openGenre(m.name)} className="h-20 rounded-lg flex items-end p-3 font-bold text-[15px] text-left active:scale-[.98] transition" style={{ background: m.color }}>
              {m.name}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Featured playlists">
        <HScroll>
          {playlists.map(p => (
            <Card key={p.id} item={p} subtitle={p.desc} onClick={() => openPlaylist(p.id)} onPlay={() => playAll(p.trackIds)} />
          ))}
        </HScroll>
      </Section>

      <Section title="New albums">
        <HScroll>
          {albumsCatalog.map(a => (
            <Card key={a.name} item={{ name: a.name, cover: a.cover }} subtitle={`${a.artist} • ${a.year}`}
              onClick={() => openAlbum(a.name)} onPlay={() => playAll(a.trackIds)} />
          ))}
        </HScroll>
      </Section>
    </div>
  )
}

export function GenrePage({ name, goBack, openAlbum, openArtist, openPlaylist }) {
  const { playAll, startTrack } = usePlayer()
  const items = tracks.filter(t => t.genre === name || ['Happy', 'Sad', 'Relaxing', 'Workout', 'Party', 'Focus', 'Romantic', 'Sleep', 'Travel'].includes(name))
  const list = items.length ? items : tracks.slice(0, 8)
  const albums = albumsCatalog.filter(a => list.some(t => t.album === a.name))

  return (
    <div className="pb-40 md:pb-8">
      <PageHeader title={name} onBack={goBack} />
      <div className="px-4 mt-4 flex items-center gap-4">
        <button onClick={() => playAll(list.map(t => t.id))} className="px-6 py-2.5 rounded-full bg-spot text-black font-bold hover:scale-105">Play all</button>
        <span className="text-muted text-sm">{list.length} songs</span>
      </div>
      <div className="mt-4">
        {list.map((t, i) => (
          <button key={t.id} onClick={() => startTrack(t.id, list.map(x => x.id))} className="flex items-center gap-3 w-full px-4 py-2 hover:bg-white/5 text-left">
            <span className="text-muted w-4 text-center text-sm">{i + 1}</span>
            <img src={t.cover} alt="" className="w-10 h-10 rounded-md object-cover bg-elev" />
            <span className="flex-1 min-w-0">
              <span className="block truncate text-[15px]">{t.title}</span>
              <span className="block truncate text-[13px] text-muted"><button className="hover:underline" onClick={e => { e.stopPropagation(); openArtist(t.artist) }}>{t.artist}</button> • {t.album}</span>
            </span>
            <span className="text-[13px] text-muted">{t.dur ? `${Math.floor(t.dur / 60)}:${String(t.dur % 60).padStart(2, '0')}` : ''}</span>
          </button>
        ))}
      </div>
      {albums.length > 0 && (
        <Section title="Albums">
          <HScroll>
            {albums.map(a => (
              <Card key={a.name} item={{ name: a.name, cover: a.cover }} subtitle={`${a.artist} • ${a.year}`}
                onClick={() => openAlbum(a.name)} onPlay={() => playAll(a.trackIds)} />
            ))}
          </HScroll>
        </Section>
      )}
    </div>
  )
}
