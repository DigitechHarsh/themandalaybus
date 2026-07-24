import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, Volume2, VolumeX } from 'lucide-react'

/* ── Web Audio API soothing Lo-Fi synthesizer ───────────────────────── */
function createAudioContext() {
  return new (window.AudioContext || window.webkitAudioContext)()
}

/* ── Soothing Lo-Fi Chills (Vinyl Crackle + Soft Jazzy Chords) ─────── */
function buildSoothingLofi(ctx) {
  const masterGain = ctx.createGain()
  masterGain.gain.value = 0.09
  masterGain.connect(ctx.destination)

  // Warm Lowpass Filter (Lo-Fi signature cut off at 650Hz)
  const lpf = ctx.createBiquadFilter()
  lpf.type = 'lowpass'
  lpf.frequency.value = 650
  lpf.Q.value = 1.0
  lpf.connect(masterGain)

  // Vinyl Crackle Noise
  const bufLen = ctx.sampleRate * 4
  const vinylBuf = ctx.createBuffer(1, bufLen, ctx.sampleRate)
  const vData = vinylBuf.getChannelData(0)
  for (let i = 0; i < bufLen; i++) {
    const r = Math.random()
    vData[i] = r > 0.996 ? (Math.random() * 2 - 1) * 0.35 : (Math.random() * 2 - 1) * 0.008
  }
  const vinylSrc = ctx.createBufferSource()
  vinylSrc.buffer = vinylBuf
  vinylSrc.loop = true
  const vinylGain = ctx.createGain()
  vinylGain.gain.value = 0.025
  vinylSrc.connect(vinylGain)
  vinylGain.connect(masterGain)
  vinylSrc.start()

  // Jazzy Lo-Fi Chord Progression: [Fmaj7, Em7, Dm7, Cmaj7]
  const CHORDS = [
    [174.61, 220.00, 261.63, 329.63], // Fmaj7 (F3, A3, C4, E4)
    [164.81, 196.00, 246.94, 293.66], // Em7   (E3, G3, B3, D4)
    [146.83, 174.61, 220.00, 261.63], // Dm7   (D3, F3, A3, C4)
    [130.81, 164.81, 196.00, 246.94], // Cmaj7 (C3, E3, G3, B3)
  ]

  let chordIdx = 0
  let oscNodes = []
  let chordInterval = null

  function playChord(notes) {
    oscNodes.forEach(({ osc, gain }) => {
      try {
        gain.gain.setTargetAtTime(0, ctx.currentTime, 0.4)
        setTimeout(() => { try { osc.stop() } catch (e) {} }, 500)
      } catch (e) {}
    })
    oscNodes = []

    notes.forEach((freq) => {
      const osc = ctx.createOscillator()
      osc.type = 'triangle'
      osc.frequency.value = freq

      const oscGain = ctx.createGain()
      oscGain.gain.value = 0
      oscGain.gain.setTargetAtTime(0.045, ctx.currentTime, 0.5)

      osc.connect(oscGain)
      oscGain.connect(lpf)
      osc.start()

      oscNodes.push({ osc, gain: oscGain })
    })
  }

  playChord(CHORDS[0])

  chordInterval = setInterval(() => {
    chordIdx = (chordIdx + 1) % CHORDS.length
    playChord(CHORDS[chordIdx])
  }, 4200)

  return {
    stop() {
      clearInterval(chordInterval)
      try { vinylSrc.stop() } catch (e) {}
      oscNodes.forEach(({ osc }) => { try { osc.stop() } catch (e) {} })
      try { masterGain.gain.setTargetAtTime(0, ctx.currentTime, 0.2) } catch (e) {}
    },
    masterGain,
  }
}

function buildRain(ctx) {
  const bufLen = ctx.sampleRate * 4
  const buf = ctx.createBuffer(2, bufLen, ctx.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch)
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1
  }

  const src = ctx.createBufferSource()
  src.buffer = buf
  src.loop = true

  const lpf = ctx.createBiquadFilter()
  lpf.type = 'lowpass'
  lpf.frequency.value = 1100

  const gain = ctx.createGain()
  gain.gain.value = 0.12

  src.connect(lpf)
  lpf.connect(gain)
  gain.connect(ctx.destination)
  src.start()
  return { stop: () => { try { src.stop() } catch (e) {} }, gain }
}

function buildSizzle(ctx) {
  const bufLen = ctx.sampleRate * 3
  const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1

  const src = ctx.createBufferSource()
  src.buffer = buf
  src.loop = true

  const hpf = ctx.createBiquadFilter()
  hpf.type = 'highpass'
  hpf.frequency.value = 2400

  const gain = ctx.createGain()
  gain.gain.value = 0.12

  src.connect(hpf)
  hpf.connect(gain)
  gain.connect(ctx.destination)
  src.start()
  return { stop: () => { try { src.stop() } catch (e) {} }, gain }
}

/* ── Sound channels config ─────────────────────────────────────────── */
const CHANNELS = [
  { id: 'lofi', label: 'Soothing Lo-Fi Chills', icon: '🎧', color: '#10B981' },
  { id: 'rain', label: 'Rain on Bus', icon: '🌧', color: '#60a5fa' },
  { id: 'sizzle', label: 'Sizzling Wok', icon: '🍳', color: '#FF9E00' },
]

const VIZ_DURATIONS = ['0.5s', '0.7s', '0.4s', '0.9s', '0.6s', '0.8s']

export default function SoundscapePlayer() {
  const [expanded, setExpanded] = useState(false)
  const [active, setActive] = useState({})
  const audioCtxRef = useRef(null)
  const nodesRef = useRef({})

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = createAudioContext()
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }
    return audioCtxRef.current
  }, [])

  const toggleChannel = useCallback((id) => {
    setActive((prev) => {
      const isOn = prev[id]
      if (isOn) {
        // Stop
        const node = nodesRef.current[id]
        if (node) {
          try { node.stop?.() } catch (e) {}
          delete nodesRef.current[id]
        }
        return { ...prev, [id]: false }
      } else {
        // Start
        const ctx = getCtx()
        let node
        if (id === 'lofi') node = buildSoothingLofi(ctx)
        else if (id === 'rain') node = buildRain(ctx)
        else if (id === 'sizzle') node = buildSizzle(ctx)
        if (node) nodesRef.current[id] = node
        return { ...prev, [id]: true }
      }
    })
  }, [getCtx])

  const anyActive = Object.values(active).some(Boolean)

  return (
    <div
      id="soundscape-player"
      className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3 pointer-events-auto"
      style={{ zIndex: 50 }}
    >
      {/* Expanded panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            id="soundscape-panel"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="glass-card rounded-2xl p-4 w-64 flex flex-col gap-3"
            style={{ borderColor: 'rgba(16,185,129,0.2)' }}
            role="region"
            aria-label="Lo-Fi Music & Soundscape controls"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs uppercase tracking-widest text-mint-neon font-bold">
                Soothing Lo-Fi Player
              </span>
              <Music size={14} className="text-mint-neon" />
            </div>

            {CHANNELS.map((ch) => {
              const isOn = !!active[ch.id]
              return (
                <div key={ch.id} className="flex items-center gap-3">
                  {/* Channel toggle */}
                  <button
                    id={`sound-toggle-${ch.id}`}
                    onClick={() => toggleChannel(ch.id)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-base transition-all duration-200 border cursor-pointer ${
                      isOn
                        ? 'border-opacity-60 bg-opacity-20 shadow-sm'
                        : 'border-white/10 bg-transparent opacity-50 hover:opacity-80'
                    }`}
                    style={isOn ? { borderColor: ch.color, backgroundColor: `${ch.color}25` } : {}}
                    aria-pressed={isOn}
                    aria-label={`${isOn ? 'Stop' : 'Play'} ${ch.label}`}
                  >
                    {ch.icon}
                  </button>

                  {/* Label */}
                  <span
                    className="font-display text-xs font-semibold flex-1"
                    style={{ color: isOn ? ch.color : 'rgba(250,246,240,0.6)' }}
                  >
                    {ch.label}
                  </span>

                  {/* Visualizer bars */}
                  <div className="flex items-end gap-0.5 h-5" aria-hidden="true">
                    {VIZ_DURATIONS.map((dur, i) => (
                      <div
                        key={i}
                        className="viz-bar"
                        style={{
                          '--dur': dur,
                          height: '100%',
                          backgroundColor: isOn ? ch.color : 'rgba(250,246,240,0.15)',
                          animationPlayState: isOn ? 'running' : 'paused',
                          animationDelay: `${i * 0.08}s`,
                          opacity: isOn ? 0.95 : 0.3,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )
            })}

            <p className="font-mono text-[10px] text-cream-warm/35 pt-1.5 border-t border-white/5 uppercase tracking-wider">
              ☕ Click icon to play soothing Lo-Fi beats
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB toggle button — positioned at bottom left */}
      <motion.button
        id="soundscape-fab"
        onClick={() => setExpanded((v) => !v)}
        whileTap={{ scale: 0.93 }}
        whileHover={{ scale: 1.05 }}
        className="w-14 h-14 rounded-2xl flex items-center justify-center cursor-pointer border transition-all duration-300"
        style={{
          background: anyActive
            ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
            : 'rgba(20, 22, 28, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderColor: anyActive ? 'rgba(16,185,129,0.5)' : 'rgba(255,255,255,0.12)',
          boxShadow: anyActive ? '0 0 25px rgba(16,185,129,0.4), 0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.4)',
        }}
        aria-label={expanded ? 'Close Lo-Fi player' : 'Open soothing Lo-Fi music player'}
        aria-expanded={expanded}
      >
        {anyActive ? (
          <Volume2 size={22} color="#FFFFFF" />
        ) : (
          <Music size={22} color="rgba(250,246,240,0.7)" />
        )}
      </motion.button>
    </div>
  )
}
