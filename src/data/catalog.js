const img = (seed, w = 300) => `https://picsum.photos/seed/${seed}/${w}/${w}`

const T = (id, title, artist, album, dur, seed, plays, genre, year, extra = {}) => ({ id, title, artist, album, dur, cover: img(seed), plays, genre, year, released: `${year}-0${(parseInt(id.slice(1)) % 9) + 1}-15`, ...extra })

// Languages: EN + Indian regional. Existing 16 tracks are English.
export const LANGUAGES = ['All', 'English', 'Hindi', 'Marathi', 'Gujarati', 'Punjabi', 'Haryanvi', 'Tamil', 'Telugu', 'Kannada', 'Bhojpuri']

export const tracks = [
  T('t1', 'Midnight City Lights', 'Neon Coast', 'Afterglow', 214, 'neon9', '12.4M', 'Electronic', 2024, { lang: 'English' }),
  T('t2', 'Golden Hour Drive', 'Summer Static', 'Westbound', 187, 'drive4', '8.1M', 'Pop', 2023, { lang: 'English' }),
  T('t3', 'Paper Planes', 'The Wanderers', 'Origami', 243, 'paper2', '22.7M', 'Indie', 2022, { lang: 'English' }),
  T('t4', 'Electric Heart', 'Voltline', 'Pulse', 198, 'volt7', '5.3M', 'Electronic', 2024, { lang: 'English' }),
  T('t5', 'Ocean Eyes', 'Marina Blue', 'Tides', 176, 'ocean5', '31.2M', 'Pop', 2021, { lang: 'English' }),
  T('t6', 'Smoke & Mirrors', 'Hollow Echo', 'Illusions', 231, 'smoke1', '9.8M', 'Rock', 2023, { lang: 'English' }),
  T('t7', 'Starlight Avenue', 'Cosmic Club', 'Constellation', 205, 'star8', '14.6M', 'Electronic', 2025, { lang: 'English' }),
  T('t8', 'Velvet Sky', 'Luna Rae', 'Nocturne', 192, 'velvet3', '18.9M', 'R&B', 2024, { lang: 'English' }),
  T('t9', 'Concrete Jungle', 'Urban Pulse', 'Asphalt', 224, 'urban6', '7.4M', 'Hip-Hop', 2022, { lang: 'English' }),
  T('t10', 'Wildfire', 'Ember & Ash', 'Ignition', 183, 'fire0', '26.5M', 'Rock', 2023, { lang: 'English' }),
  T('t11', 'Quiet Storm', 'Sable Waves', 'Deep End', 256, 'storm2', '11.1M', 'Jazz', 2021, { lang: 'English' }),
  T('t12', 'Neon Rain', 'Glass Cities', 'Reflections', 209, 'rain4', '16.3M', 'Electronic', 2025, { lang: 'English' }),
  T('t13', 'Desert Bloom', 'Cactus Club', 'Mirage', 197, 'desert9', '6.7M', 'Indie', 2024, { lang: 'English' }),
  T('t14', 'Gravity', 'Orbit Theory', 'First Contact', 238, 'orbit5', '20.4M', 'Pop', 2022, { lang: 'English' }),
  T('t15', 'Foxglove', 'Fern Hollow', 'Undergrowth', 172, 'fern1', '4.9M', 'Indie', 2025, { lang: 'English' }),
  T('t16', 'Harbor Lights', 'Tidal Sons', 'Anchor', 215, 'harbor7', '13.8M', 'Country', 2023, { lang: 'English' }),
  // Hindi
  T('t17', 'Raat Bhar Ishq', 'Aarav Kapoor', 'Neend', 201, 'hindi1', '28.1M', 'Bollywood', 2024, { lang: 'Hindi' }),
  T('t18', 'Dil Dhadke', 'Priya Nair', 'Dhadkan', 189, 'hindi2', '19.4M', 'Romantic', 2023, { lang: 'Hindi' }),
  T('t19', 'Tumse Milke', 'Rohan Sethi', 'Tumse', 224, 'hindi3', '15.2M', 'Bollywood', 2022, { lang: 'Hindi' }),
  // Marathi
  T('t20', 'Paavas Vaari', 'Sneha Deshmukh', 'Varas', 176, 'mar1', '9.7M', 'Pop', 2024, { lang: 'Marathi' }),
  T('t21', 'Lavani Nights', 'Vijay Jadhav', 'Nakhra', 203, 'mar2', '7.3M', 'Folk', 2023, { lang: 'Marathi' }),
  T('t22', 'Gavathi Jeev', 'Asha Patil', 'Mitti', 192, 'mar3', '5.1M', 'Folk', 2022, { lang: 'Marathi' }),
  // Gujarati
  T('t23', 'Garba Raat', 'Kinjal Patel', 'Raas', 188, 'guj1', '11.8M', 'Folk', 2024, { lang: 'Gujarati' }),
  T('t24', 'Tara Vina', 'Harsh Solanki', 'Ehsaas', 215, 'guj2', '6.9M', 'Romantic', 2023, { lang: 'Gujarati' }),
  // Punjabi
  T('t25', 'Punjab Di Mitti', 'Diljit Sandhu', 'Mitti', 198, 'pun1', '24.6M', 'Bhangra', 2024, { lang: 'Punjabi' }),
  T('t26', 'Heer Ranjha', 'Ammy Gill', 'Heer', 231, 'pun2', '17.2M', 'Folk', 2023, { lang: 'Punjabi' }),
  // Haryanvi
  T('t27', 'Desi Swag', 'Sapna Choudhary', 'Swag', 164, 'har1', '13.5M', 'Dance', 2024, { lang: 'Haryanvi' }),
  T('t28', 'Yaari Kuriye', 'Khasa Aala Chale', 'Yaari', 182, 'har2', '8.8M', 'Hip-Hop', 2023, { lang: 'Haryanvi' }),
  // Tamil
  T('t29', 'Kaadhal Neeye', 'Shraddha Menon', 'Kaadhal', 205, 'tam1', '21.3M', 'Romantic', 2024, { lang: 'Tamil' }),
  T('t30', 'Thangam', 'ARR Tribute Band', 'Thangam', 219, 'tam2', '12.1M', 'Cinematic', 2023, { lang: 'Tamil' }),
  // Telugu
  T('t31', 'Prematho', 'Ananya Reddy', 'Premam', 193, 'tel1', '16.7M', 'Romantic', 2024, { lang: 'Telugu' }),
  T('t32', 'Mass Beat', 'Rocky Ramesh', 'Mass', 171, 'tel2', '10.4M', 'Dance', 2023, { lang: 'Telugu' }),
  // Kannada
  T('t33', 'Melu Haadu', 'Vijay Prakash', 'Melu', 208, 'kan1', '8.6M', 'Folk', 2024, { lang: 'Kannada' }),
  T('t34', 'Kanasu', 'Sowmya Rao', 'Kanasu', 196, 'kan2', '6.2M', 'Pop', 2023, { lang: 'Kannada' }),
  // Bhojpuri
  T('t35', 'Litti Chokha', 'Pawan Singh', 'Litti', 158, 'bho1', '14.9M', 'Folk', 2024, { lang: 'Bhojpuri' }),
  T('t36', 'Bhojpuriya Style', 'Khesari Lal', 'Style', 172, 'bho2', '9.3M', 'Dance', 2023, { lang: 'Bhojpuri' }),
  // Classics / retro for era carousels
  T('t37', 'Yesterday\'s Melody', 'Golden Voices', 'Retro', 212, 'retro1', '5.4M', 'Oldies', 1989, { lang: 'English' }),
  T('t38', '80s Neon Nights', 'Retro Wave', 'Neon', 226, 'retro2', '4.8M', 'Retro', 1985, { lang: 'English' }),
  T('t39', 'Disco Fever 90', 'Studio 90', 'Disco', 199, 'retro3', '6.1M', 'Disco', 1992, { lang: 'English' }),
  T('t40', 'Grunge Days', 'Seattle Sound', 'Grunge', 243, 'retro4', '3.9M', 'Rock', 1991, { lang: 'English' }),
]

export const artistDetail = {
  'Neon Coast': { listeners: '2.4M', verified: true, bio: 'Synthwave duo crafting midnight drives and neon-soaked pop anthems since 2019.', tags: ['Electronic', 'Synthwave', 'Pop'] },
  'Marina Blue': { listeners: '8.1M', verified: true, bio: 'Coastal pop voice blending dreamy melodies with tides of indie folk.', tags: ['Pop', 'Indie', 'Folk'] },
  'Luna Rae': { listeners: '3.7M', verified: true, bio: 'Nocturnal R&B songstress with velvet vocals and late-night grooves.', tags: ['R&B', 'Soul', 'Pop'] },
  'Voltline': { listeners: '1.9M', verified: false, bio: 'High-voltage electronic producer mixing club energy with melodic hooks.', tags: ['Electronic', 'Dance'] },
  'The Wanderers': { listeners: '4.2M', verified: true, bio: 'Four-piece indie band folding paper planes and big choruses from Austin.', tags: ['Indie', 'Rock'] },
  'Ember & Ash': { listeners: '6.5M', verified: true, bio: 'Alternative rock duo turning sparks into wildfire sing-alongs.', tags: ['Rock', 'Alternative'] },
  'Summer Static': { listeners: '980K', verified: false, bio: 'Sun-soaked pop from the West Coast highways.', tags: ['Pop', 'Chill'] },
  'Hollow Echo': { listeners: '1.2M', verified: false, bio: 'Gothic-tinged rock with cavernous drums and smoky riffs.', tags: ['Rock', 'Gothic'] },
  'Cosmic Club': { listeners: '2.8M', verified: true, bio: 'Space-disco collective mapping constellations into dance floors.', tags: ['Electronic', 'Disco'] },
  'Sable Waves': { listeners: '760K', verified: false, bio: 'Late-night jazz trio riding quiet storms.', tags: ['Jazz', 'Smooth'] },
  'Aarav Kapoor': { listeners: '3.1M', verified: false, bio: 'Hindi playback voice for late-night romance.', tags: ['Bollywood', 'Romantic'] },
  'Priya Nair': { listeners: '2.2M', verified: true, bio: 'Sultry Hindi and Malayalam vocals.', tags: ['Bollywood', 'Romantic'] },
  'Sneha Deshmukh': { listeners: '1.4M', verified: false, bio: 'Marathi pop voice of monsoons and Mumbai.', tags: ['Pop', 'Marathi'] },
  'Kinjal Patel': { listeners: '1.8M', verified: true, bio: 'Gujarati folk and garba sensation.', tags: ['Folk', 'Gujarati'] },
  'Diljit Sandhu': { listeners: '5.2M', verified: true, bio: 'Punjabi superstar spanning bhangra to films.', tags: ['Bhangra', 'Punjabi'] },
  'Sapna Choudhary': { listeners: '2.6M', verified: true, bio: 'Haryanvi dance icon with desi swag.', tags: ['Haryanvi', 'Dance'] },
  'Shraddha Menon': { listeners: '2.9M', verified: true, bio: 'Tamil romantic playback favourite.', tags: ['Romantic', 'Tamil'] },
  'Ananya Reddy': { listeners: '1.1M', verified: false, bio: 'Telugu melodies and young love themes.', tags: ['Romantic', 'Telugu'] },
  'Golden Voices': { listeners: '890K', verified: false, bio: 'Nostalgic 90s ballads and retro classics.', tags: ['Oldies', '90s'] },
  'Retro Wave': { listeners: '640K', verified: false, bio: '80s synth nostalgia and cassette-culture pop.', tags: ['Retro', '80s'] },
  'Pawan Singh': { listeners: '2.7M', verified: true, bio: 'Bhojpuri power vocalist and hit machine.', tags: ['Bhojpuri', 'Folk'] },
}

export const albumsCatalog = [
  { name: 'Afterglow', artist: 'Neon Coast', year: 2024, cover: img('neon9', 600), trackIds: ['t1', 't7', 't12'] },
  { name: 'Tides', artist: 'Marina Blue', year: 2021, cover: img('ocean5', 600), trackIds: ['t5', 't2', 't16'] },
  { name: 'Nocturne', artist: 'Luna Rae', year: 2024, cover: img('velvet3', 600), trackIds: ['t8', 't11'] },
  { name: 'Pulse', artist: 'Voltline', year: 2024, cover: img('volt7', 600), trackIds: ['t4', 't9'] },
  { name: 'Origami', artist: 'The Wanderers', year: 2022, cover: img('paper2', 600), trackIds: ['t3', 't13'] },
  { name: 'Ignition', artist: 'Ember & Ash', year: 2023, cover: img('fire0', 600), trackIds: ['t10', 't6'] },
  { name: 'Constellation', artist: 'Cosmic Club', year: 2025, cover: img('star8', 600), trackIds: ['t7', 't14', 't12'] },
  { name: 'Reflections', artist: 'Glass Cities', year: 2025, cover: img('rain4', 600), trackIds: ['t12', 't4'] },
]
export const albumByName = Object.fromEntries(albumsCatalog.map(a => [a.name, a]))

export const lyricSeed = (t) => [
  `[Verse 1]`,
  `${t.title} when the neon dies,`,
  `echoes in the static sky.`,
  `Every heartbeat counts the time,`,
  `${t.artist} on the other line.`,
  ``,
  `[Chorus]`,
  `We chase the light, we chase the night,`,
  `${t.title} burning bright.`,
  `Hold on to the wildfire sound,`,
  `never let the city dim us down.`,
  ``,
  `[Verse 2]`,
  `Paper planes and midnight drives,`,
  `ocean eyes and borrowed skies.`,
  `One more song before the dawn,`,
  `then the storm is quiet, gone.`,
]

export const moodCatalog = [
  { name: 'Happy', color: '#F59B23' }, { name: 'Sad', color: '#777777' },
  { name: 'Relaxing', color: '#148A08' }, { name: 'Workout', color: '#777777' },
  { name: 'Party', color: '#E61E32' }, { name: 'Focus', color: '#5038E6' },
  { name: 'Romantic', color: '#E13300' }, { name: 'Sleep', color: '#1E3264' },
]

export const notificationSeed = [
  { id: 'n1', type: 'release', text: 'Neon Coast released new single “Midnight City Lights”', time: '2h ago', read: false },
  { id: 'n2', type: 'playlist', text: 'Today’s Top Hits was updated', time: '5h ago', read: false },
  { id: 'n3', type: 'account', text: 'Welcome to GeetPlays — your profile is ready', time: '1d ago', read: true },
]

export const playlists = [
  { id: 'p1', name: 'Today\u2019s Top Hits', desc: 'The biggest songs right now.', cover: img('hits1', 600), owner: 'Spotify', trackIds: ['t5','t3','t10','t8','t14','t12'] },
  { id: 'p2', name: 'Chill Vibes', desc: 'Kick back to the best new and recent chill hits.', cover: img('chill2', 600), owner: 'Spotify', trackIds: ['t5','t11','t16','t2','t7'] },
  { id: 'p3', name: 'Indie Pop Rising', desc: 'Fresh indie pop for your daily rotation.', cover: img('indie3', 600), owner: 'Spotify', trackIds: ['t1','t4','t13','t15','t6'] },
  { id: 'p4', name: 'Workout Beats', desc: 'High-energy tracks to power your workout.', cover: img('gym4', 600), owner: 'Spotify', trackIds: ['t4','t9','t10','t1','t12'] },
  { id: 'p5', name: 'Night Drive', desc: 'Synthwave and midnight cruising essentials.', cover: img('night5', 600), owner: 'You', trackIds: ['t1','t7','t12','t6','t14'] },
  { id: 'p6', name: 'Acoustic Mornings', desc: 'Gentle acoustic to start the day right.', cover: img('acou6', 600), owner: 'You', trackIds: ['t11','t15','t16','t5','t2'] },
]

export const categories = [
  { name: 'Pop', color: '#E13300' }, { name: 'Hip-Hop', color: '#BC5900' },
  { name: 'Rock', color: '#E61E32' }, { name: 'Electronic', color: '#148A08' },
  { name: 'Latin', color: '#D84000' }, { name: 'Mood', color: '#5038E6' },
  { name: 'Indie', color: '#7358FF' }, { name: 'Chill', color: '#1E3264' },
  { name: 'Workout', color: '#777777' }, { name: 'Jazz', color: '#0D73EC' },
  { name: 'Classical', color: '#777777' }, { name: 'Podcasts', color: '#006450' },
]

export const artists = [
  { name: 'Neon Coast', img: img('artist-a', 300) }, { name: 'Marina Blue', img: img('artist-b', 300) },
  { name: 'Luna Rae', img: img('artist-c', 300) }, { name: 'Voltline', img: img('artist-d', 300) },
  { name: 'The Wanderers', img: img('artist-e', 300) }, { name: 'Ember & Ash', img: img('artist-f', 300) },
  { name: 'Summer Static', img: img('artist-g', 300) }, { name: 'Hollow Echo', img: img('artist-h', 300) },
  { name: 'Cosmic Club', img: img('artist-i', 300) }, { name: 'Sable Waves', img: img('artist-j', 300) },
  { name: 'Aarav Kapoor', img: img('artist-k', 300) }, { name: 'Priya Nair', img: img('artist-l', 300) },
  { name: 'Sneha Deshmukh', img: img('artist-m', 300) }, { name: 'Kinjal Patel', img: img('artist-n', 300) },
  { name: 'Diljit Sandhu', img: img('artist-o', 300) }, { name: 'Sapna Choudhary', img: img('artist-p', 300) },
  { name: 'Shraddha Menon', img: img('artist-q', 300) }, { name: 'Ananya Reddy', img: img('artist-r', 300) },
  { name: 'Golden Voices', img: img('artist-s', 300) }, { name: 'Retro Wave', img: img('artist-t', 300) },
  { name: 'Pawan Singh', img: img('artist-u', 300) }, { name: 'Vijay Prakash', img: img('artist-v', 300) },
  { name: 'Khesari Lal', img: img('artist-w', 300) },
]
export const artistByName = Object.fromEntries(artists.map(a => [a.name, a]))

// Language metadata for every artist (derived from their tracks, falls back to English)
export const artistLang = (name) => {
  const t = tracks.find(x => x.artist === name)
  return t?.lang || 'English'
}

// Artist playlists: clicking an artist card opens a playlist of all their tracks in that language
export const artistPlaylists = artists.map(a => {
  const tks = tracks.filter(t => t.artist === a.name)
  if (!tks.length) return null
  return { id: `ap-${a.name}`, name: `${a.name}`, desc: `All music by ${a.name}`, cover: a.img, owner: 'GeetPlays', trackIds: tks.map(t => t.id), lang: tks[0].lang }
}).filter(Boolean)
export const artistPlaylistById = Object.fromEntries(artistPlaylists.map(p => [p.id, p]))

export const trackById = Object.fromEntries(tracks.map(t => [t.id, t]))
export const playlistById = Object.fromEntries(playlists.map(p => [p.id, p]))
export const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
