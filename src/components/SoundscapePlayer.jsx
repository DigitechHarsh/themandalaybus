import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, Volume2, VolumeX, ChevronUp, ChevronDown } from 'lucide-react'

/* ── Web Audio API sound synthesis ────────────────────────────────── */
function createAudioContext() {
  return new (window.AudioContext || window.webkitAudioContext)()
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
  hpf.Q.value = 0.8

  const bpf = ctx.createBiquadFilter()
  bpf.type = 'bandpass'
  bpf.frequency.value = 5000
  bpf.Q.value = 1.2

  const gain = ctx.createGain()
  gain.gain.value = 0.18

  src.connect(hpf)
  hpf.connect(bpf)
  bpf.connect(gain)
  gain.connect(ctx.destination)
  src.start()
  return { src, gain }
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
  lpf.frequency.value = 1200

  const gain = ctx.createGain()
  gain.gain.value = 0.14

  src.connect(lpf)
  lpf.connect(gain)
  gain.connect(ctx.destination)
  src.start()
  return { src, gain }
}

function buildLofi(ctx) {
  const gain = ctx.createGain()
  gain.gain.value = 0.04
  gain.connect(ctx.destination)

  // Pads: root + 5th + octave
  const freqs = [110, 165, 220, 330]
  const oscs = freqs.map((f) => {
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = f
    const oscGain = ctx.createGain()
    oscGain.gain.value = 1 / freqs.length
    osc.connect(oscGain)
    oscGain.connect(gain)
    osc.start()
    return osc
  })

  // Very slow LFO tremolo
  const lfo = ctx.createOscillator()
  lfo.frequency.value = 0.25
  const lfoGain = ctx.createGain()
  lfoGain.gain.value = 0.02
  lfo.connect(lfoGain)
  lfoGain.connect(gain.gain)
  lfo.start()

  return { oscs, lfo, gain }
}

/* ── Channel config ───────────────────────────────────────────────── */
const CHANNELS = [
  { id: 'sizzle', label: 'Sizzling Wok', icon: '🍳', color: '#FF9E00' },
  { id: 'rain', label: 'Rain on Bus', icon: '🌧', color: '#60a5fa' },
  { id: 'lofi', label: 'Street Lo-Fi', icon: '🎵', color: '#10B981' },
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
          try {
            node.gain.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.1)
            setTimeout(() => {
              try { node.src?.stop?.() } catch (e) {}
              try { node.oscs?.forEach((o) => o.stop()) } catch (e) {}
              try { node.lfo?.stop() } catch (e) {}
            }, 300)
            delete nodesRef.current[id]
          } catch (e) {}
        }
        return { ...prev, [id]: false }
      } else {
        // Start
        const ctx = getCtx()
        let node
        if (id === 'sizzle') node = buildSizzle(ctx)
        else if (id === 'rain') node = buildRain(ctx)
        else if (id === 'lofi') node = buildLofi(ctx)
        if (node) nodesRef.current[id] = node
        return { ...prev, [id]: true }
      }
    })
  }, [getCtx])

  const anyActive = Object.values(active).some(Boolean)

  return (
    <div
      id="soundscape-player"
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
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
            style={{ borderColor: 'rgba(255,158,0,0.15)' }}
            role="region"
            aria-label="Soundscape controls"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs uppercase tracking-widest text-cream-warm/50">
                Soundscape
              </span>
              <Music size={12} className="text-amber-sizzle" />
            </div>

            {CHANNELS.map((ch) => {
              const isOn = !!active[ch.id]
              return (
                <div key={ch.id} className="flex items-center gap-3">
                  {/* Channel toggle */}
                  <button
                    id={`sound-toggle-${ch.id}`}
                    onClick={() => toggleChannel(ch.id)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all duration-200 border cursor-pointer ${
                      isOn
                        ? 'border-opacity-60 bg-opacity-15'
                        : 'border-white/10 bg-transparent opacity-50 hover:opacity-75'
                    }`}
                    style={isOn ? { borderColor: ch.color, backgroundColor: `${ch.color}20` } : {}}
                    aria-pressed={isOn}
                    aria-label={`${isOn ? 'Stop' : 'Play'} ${ch.label}`}
                  >
                    {ch.icon}
                  </button>

                  {/* Label */}
                  <span
                    className="font-display text-xs flex-1"
                    style={{ color: isOn ? ch.color : 'rgba(250,246,240,0.5)' }}
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
                          opacity: isOn ? 0.9 : 0.3,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )
            })}

            <p className="font-mono text-xs text-cream-warm/25 pt-1 border-t border-white/5">
              Click to start ambient sounds
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB toggle button */}
      <motion.button
        id="soundscape-fab"
        onClick={() => setExpanded((v) => !v)}
        whileTap={{ scale: 0.93 }}
        whileHover={{ scale: 1.05 }}
        className="w-14 h-14 rounded-2xl flex items-center justify-center cursor-pointer border transition-all duration-300"
        style={{
          background: anyActive
            ? 'linear-gradient(135deg, #FF9E00 0%, #E6B800 100%)'
            : 'rgba(20, 22, 28, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderColor: anyActive ? 'rgba(255,158,0,0.5)' : 'rgba(255,255,255,0.1)',
          boxShadow: anyActive ? '0 0 25px rgba(255,158,0,0.4), 0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.4)',
        }}
        aria-label={expanded ? 'Close soundscape' : 'Open soundscape player'}
        aria-expanded={expanded}
      >
        {anyActive ? (
          <Volume2 size={22} color={expanded ? '#0A0B0E' : '#FF9E00'} />
        ) : (
          <VolumeX size={22} color="rgba(250,246,240,0.6)" />
        )}
      </motion.button>
    </div>
  )
}
