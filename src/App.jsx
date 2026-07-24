import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from './components/Navbar'
import CanvasPlayer from './components/CanvasPlayer'
import Scene3D from './components/Scene3D'
import HeroSection from './components/HeroSection'
import MenuSection from './components/MenuSection'
import MunchiesBuilder from './components/MunchiesBuilder'
import ReviewsMarquee from './components/ReviewsMarquee'
import SoundscapePlayer from './components/SoundscapePlayer'
import LocationSection from './components/LocationSection'
import Footer from './components/Footer'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // Section reveal on scroll (IntersectionObserver for content panels)
    const setupReveal = () => {
      const revealEls = document.querySelectorAll('.reveal')
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('visible')
              io.unobserve(e.target)
            }
          })
        },
        { threshold: 0.1 },
      )
      revealEls.forEach((el) => io.observe(el))
      return io
    }

    // Small delay so DOM is ready
    const io = setupReveal()

    return () => {
      lenis.destroy()
      gsap.ticker.remove(tick)
      io.disconnect()
    }
  }, [])

  return (
    /*
     * ARCHITECTURE:
     * ─────────────────────────────────────────────────────────
     * • CanvasPlayer  → fixed, z:0  — 240 frames scrub full page
     * • Scene3D       → fixed, z:1  — Three.js bokeh particles
     * • Navbar        → fixed, z:50 — glassmorphism top bar
     * • SoundscapePlayer → fixed, z:50 — bottom-right FAB
     *
     * • #hero-scroll  → height: 300vh — gives frames room to play
     *   └ HeroSection → pinned content (full-screen) during 300vh
     *
     * Content sections sit in normal document flow AFTER the hero.
     * Each has a translucent dark glass background so the live
     * canvas frames show through from behind. As you scroll through
     * Menu → Builder → Reviews → Location, the frames keep playing.
     * ─────────────────────────────────────────────────────────
     */
    <div className="text-cream-warm overflow-x-hidden relative" style={{ background: '#0A0B0E' }}>

      {/* Grain texture */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Fixed canvas + particle layers */}
      <CanvasPlayer />
      <Scene3D />

      {/* Sticky nav */}
      <Navbar />

      <main>
        {/*
          ── HERO SCROLL ZONE (300vh) ──────────────────────────
          Tall section gives GSAP room to play frames 1→~72 slowly.
          HeroSection is pinned inside here via its own ScrollTrigger.
        */}
        <section
          id="hero-scroll"
          style={{ height: '130vh' }}
          aria-label="Hero section with scroll animation"
        >
          {/* HeroSection renders fixed+pinned — stays on screen for 300vh of scroll */}
          <HeroSection />
        </section>

        {/*
          ── CONTENT SECTIONS ─────────────────────────────────
          Each section has a translucent glass-dark background so
          the canvas frames show through. As you scroll, frames
          73 → 240 continue playing behind these sections.
        */}
        <MenuSection />
        <MunchiesBuilder />
        <ReviewsMarquee />
        <LocationSection />
        <Footer />
      </main>

      {/* Floating soundscape FAB */}
      <SoundscapePlayer />
    </div>
  )
}
