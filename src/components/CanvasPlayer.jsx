import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const FRAME_COUNT = 240
const frameUrl = (n) =>
  `/frames/ezgif-frame-${String(n).padStart(3, '0')}.jpg`

gsap.registerPlugin(ScrollTrigger)

export default function CanvasPlayer() {
  const canvasRef = useRef(null)
  const imagesRef = useRef([])
  const currentFrameRef = useRef(0)
  const [loadProgress, setLoadProgress] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const images = imagesRef.current
    let loadedCount = 0

    // Cached gradient instances to avoid GC allocations during scroll
    let radGrad = null
    let botGrad = null
    let topGrad = null
    let cachedCw = 0
    let cachedCh = 0

    /* ── Resize canvas & pre-create gradient objects ── */
    function resize() {
      const cw = window.innerWidth
      const ch = window.innerHeight
      canvas.width = cw
      canvas.height = ch
      cachedCw = cw
      cachedCh = ch

      // Radial vignette
      radGrad = ctx.createRadialGradient(
        cw / 2, ch / 2, ch * 0.2,
        cw / 2, ch / 2, Math.max(cw, ch) * 0.8
      )
      radGrad.addColorStop(0, 'rgba(0,0,0,0)')
      radGrad.addColorStop(0.6, 'rgba(0,0,0,0.12)')
      radGrad.addColorStop(1, 'rgba(0,0,0,0.45)')

      // Bottom subtle tint
      botGrad = ctx.createLinearGradient(0, ch * 0.6, 0, ch)
      botGrad.addColorStop(0, 'rgba(10,11,14,0)')
      botGrad.addColorStop(1, 'rgba(10,11,14,0.45)')

      // Top navbar area dark tint
      topGrad = ctx.createLinearGradient(0, 0, 0, ch * 0.2)
      topGrad.addColorStop(0, 'rgba(10,11,14,0.5)')
      topGrad.addColorStop(1, 'rgba(10,11,14,0)')

      drawFrame(currentFrameRef.current)
    }

    /* ── Find nearest loaded image so canvas never stutters or drops ── */
    function getNearestImage(idx) {
      if (images[idx]?.complete && images[idx]?.naturalWidth) return images[idx]
      for (let offset = 1; offset < FRAME_COUNT; offset++) {
        const left = idx - offset
        if (left >= 0 && images[left]?.complete && images[left]?.naturalWidth) return images[left]
        const right = idx + offset
        if (right < FRAME_COUNT && images[right]?.complete && images[right]?.naturalWidth) return images[right]
      }
      return null
    }

    /* ── Draw frame with zero-allocation gradients ── */
    function drawFrame(idx) {
      const img = getNearestImage(idx)
      if (!img) return

      const cw = cachedCw || canvas.width
      const ch = cachedCh || canvas.height
      const iw = img.naturalWidth
      const ih = img.naturalHeight

      // object-fit: cover
      const scale = Math.max(cw / iw, ch / ih)
      const sx = (cw - iw * scale) / 2
      const sy = (ch - ih * scale) / 2

      ctx.drawImage(img, sx, sy, iw * scale, ih * scale)

      if (radGrad) {
        ctx.fillStyle = radGrad
        ctx.fillRect(0, 0, cw, ch)
      }
      if (botGrad) {
        ctx.fillStyle = botGrad
        ctx.fillRect(0, 0, cw, ch)
      }
      if (topGrad) {
        ctx.fillStyle = topGrad
        ctx.fillRect(0, 0, cw, ch)
      }
    }

    /* ── Preload — priority async decoding for 60fps performance ── */
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.decoding = 'async'
      img.src = frameUrl(i + 1)
      img.onload = () => {
        loadedCount++
        setLoadProgress(Math.round((loadedCount / FRAME_COUNT) * 100))
        if (i === 0 || loadedCount === FRAME_COUNT) {
          drawFrame(currentFrameRef.current)
        }
      }
      images[i] = img
    }

    window.addEventListener('resize', resize, { passive: true })
    resize()

    /* ──────────────────────────────────────────────────────────────
       FULL-PAGE SCROLL SCRUB
       Direct 0.05s scrub syncs instantly with Lenis smooth scroll.
    ────────────────────────────────────────────────────────────── */
    const obj = { frame: 0 }
    const tween = gsap.to(obj, {
      frame: FRAME_COUNT - 1,
      ease: 'none',
      onUpdate() {
        const f = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(obj.frame)))
        if (f !== currentFrameRef.current) {
          currentFrameRef.current = f
          drawFrame(f)
        }
      },
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.05,
      },
    })

    return () => {
      window.removeEventListener('resize', resize)
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  return (
    <>
      {loadProgress < 100 && (
        <div
          className="loading-bar"
          style={{ width: `${loadProgress}%` }}
          role="progressbar"
          aria-valuenow={loadProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Loading frames"
        />
      )}
      <canvas
        ref={canvasRef}
        id="canvas-player"
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0, width: '100vw', height: '100vh', display: 'block' }}
        aria-hidden="true"
      />
    </>
  )
}
