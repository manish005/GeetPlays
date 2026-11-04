// Simulated audio engine: WebAudio synth layers per track (no files).
// Each track gets a key/scale/tempo so playback sounds distinct.

const SCALES = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
}

function hashStr(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) }
  return Math.abs(h)
}

export function trackParams(track) {
  const h = hashStr(track.id + track.title)
  const scales = ['major', 'minor', 'dorian']
  return {
    root: 110 * Math.pow(2, (h % 12) / 12),
    scale: scales[h % 3],
    bpm: 92 + (h % 5) * 8,
    wave: ['sine', 'triangle', 'sawtooth'][h % 3],
    seed: h,
  }
}

class Engine {
  constructor() { this.ctx = null; this.master = null; this.nodes = []; this.timer = null }
  ensure() {
    if (this.ctx) return true
    try {
      const AC = window.AudioContext || window.webkitAudioContext
      if (!AC) return false
      this.ctx = new AC()
      this.master = this.ctx.createGain()
      this.master.gain.value = 0.5
      this.master.connect(this.ctx.destination)
      return true
    } catch { return false }
  }
  setVolume(v) { if (this.master) this.master.gain.value = v * 0.8 }
  stop() {
    this.nodes.forEach(n => { try { n.stop && n.stop() } catch {} try { n.disconnect() } catch {} })
    this.nodes = []
    if (this.timer) { clearInterval(this.timer); this.timer = null }
  }
  play(track, volume) {
    this.stop()
    if (!this.ensure()) return
    this.ctx.resume()
    this.setVolume(volume)
    const p = trackParams(track)
    const scale = SCALES[p.scale]
    const beat = 60 / p.bpm
    const now = this.ctx.currentTime + 0.05
    // Bass line
    for (let i = 0; i < 16; i++) {
      const semi = scale[i % scale.length] + (i % 4 === 2 ? 12 : 0)
      const osc = this.ctx.createOscillator()
      const g = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = p.root * Math.pow(2, semi / 12)
      const t = now + i * beat / 2
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(0.22, t + 0.03)
      g.gain.exponentialRampToValueAtTime(0.001, t + beat * 0.48)
      osc.connect(g); g.connect(this.master)
      osc.start(t); osc.stop(t + beat * 0.5)
      this.nodes.push(osc)
    }
    // Lead arpeggio
    let rnd = p.seed
    const rand = () => { rnd = (rnd * 1103515245 + 12345) % 2147483648; return rnd / 2147483648 }
    for (let i = 0; i < 8; i++) {
      const semi = scale[Math.floor(rand() * scale.length)] + 12
      const osc = this.ctx.createOscillator()
      const g = this.ctx.createGain()
      osc.type = p.wave
      osc.frequency.value = p.root * 2 * Math.pow(2, semi / 12)
      const t = now + i * beat
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(0.08, t + 0.02)
      g.gain.exponentialRampToValueAtTime(0.001, t + beat * 0.9)
      osc.connect(g); g.connect(this.master)
      osc.start(t); osc.stop(t + beat)
      this.nodes.push(osc)
    }
    this.timer = setTimeout(() => this.play(track, volume), 16 * beat * 1000 / 2)
  }
  pause() { this.stop() }
}

export const engine = new Engine()
