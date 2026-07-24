import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Flame, Award } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LiveStatusBadge from './LiveStatusBadge'

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
}

const item = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function HeroSection() {
  const heroRef = useRef(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    // Smoothly fade & lift hero text as user scrolls down into menu (zero friction)
    const fadeST = gsap.to(heroRef.current, {
      opacity: 0,
      y: -50,
      scale: 0.96,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero-scroll',
        start: '20% top',
        end: '85% top',
        scrub: 0.05,
      },
    })

    return () => {
      fadeST.scrollTrigger?.kill()
      fadeST.kill()
    }
  }, [])

  const scrollToMenu = () => {
    document.querySelector('#menu')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div
      id="hero-content"
      ref={heroRef}
      className="fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center px-4 sm:px-8 pointer-events-none"
      style={{ zIndex: 5, paddingTop: '56px', willChange: 'opacity, transform' }}
    >
      <motion.div
        className="flex flex-col items-center text-center gap-3 sm:gap-4 max-w-5xl mx-auto pointer-events-auto"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Top badge */}
        <motion.div variants={item} className="flex items-center gap-2">
          <Award size={14} className="text-amber-sizzle" />
          <span className="font-mono text-xs tracking-widest uppercase text-amber-sizzle/80">
            Canberra's Legendary Late-Night Street Food
          </span>
          <Award size={14} className="text-amber-sizzle" />
        </motion.div>

        {/* Brand name */}
        <motion.div variants={item} className="relative my-1">
          <h1 className="flex flex-col items-center justify-center leading-none text-cream-warm">
            <span className="shimmer-text font-mono text-xs sm:text-sm tracking-[0.4em] uppercase font-bold text-amber-sizzle mb-1">
              — THE —
            </span>
            <span
              className="mandalay-script-logo text-center py-1"
              style={{
                fontSize: 'clamp(3.2rem, 10vw, 7rem)',
                lineHeight: 1.05,
              }}
            >
              Mandalay
            </span>
            <span
              className="font-display font-black uppercase text-cream-warm tracking-widest mt-1"
              style={{
                fontSize: 'clamp(1.8rem, 5.5vw, 3.8rem)',
                letterSpacing: '0.2em',
              }}
            >
              BUS
            </span>
          </h1>

          <Flame
            size={28}
            className="absolute -right-8 top-0 text-amber-sizzle animate-float"
            style={{ animationDelay: '0.3s' }}
          />
          <Flame
            size={20}
            className="absolute -left-6 bottom-4 text-crimson-cyber animate-float"
            style={{ animationDelay: '0.8s' }}
          />
        </motion.div>

        {/* Location tag */}
        <motion.div variants={item}>
          <div className="font-mono text-xs sm:text-sm tracking-widest uppercase text-cream-warm/50 flex items-center gap-3">
            <span className="w-8 h-px bg-amber-sizzle/40" />
            Haig Park · Lonsdale St · Braddon ACT 2612
            <span className="w-8 h-px bg-amber-sizzle/40" />
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={item}
          className="font-body text-base sm:text-xl text-cream-warm/70 max-w-2xl leading-relaxed"
        >
          Sizzling woks, fragrant coconut broths, cheese-stretching mozzarella sticks —
          best drunk{' '}
          <span className="text-amber-sizzle font-semibold">or</span> sober.
        </motion.p>

        {/* Live status */}
        <motion.div variants={item}>
          <LiveStatusBadge />
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          variants={item}
          className="flex flex-wrap items-center justify-center gap-4 mt-2"
        >
          <button
            id="hero-view-menu-btn"
            onClick={scrollToMenu}
            className="btn-amber px-8 py-4 text-sm font-bold tracking-widest"
          >
            🍜 Explore The Menu
          </button>
          <a
            id="hero-directions-btn"
            href="https://www.google.com/maps/dir//The+Mandalay+Bus,+Haig+Park+Carpark,+Lonsdale+St,+Braddon+ACT+2612,+Australia/@21.1612892,72.792461,2603m/data=!3m1!1e3!4m8!4m7!1m0!1m5!1m1!1s0x6b164d61f4e0e80b:0xaeaceac14a36e584!2m2!1d149.1327256!2d-35.2704263?entry=ttu&g_ep=EgoyMDI2MDcyMS4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost px-8 py-4 text-sm font-bold tracking-widest"
          >
            📍 Get Directions
          </a>
        </motion.div>

        {/* Hours pill */}
        <motion.div
          variants={item}
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            background: 'rgba(255,158,0,0.08)',
            border: '1px solid rgba(255,158,0,0.2)',
          }}
        >
          <span className="text-amber-sizzle text-sm">🕕</span>
          <span className="font-mono text-xs tracking-wider text-cream-warm/60 uppercase">
            Wed – Sat · 6:00 PM – 1:00 AM
          </span>
          <span className="text-crimson-cyber text-sm">🔥</span>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer pointer-events-auto"
        onClick={scrollToMenu}
        role="button"
        aria-label="Scroll down to explore"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && scrollToMenu()}
      >
        <span className="font-mono text-xs tracking-widest uppercase text-cream-warm/30">
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} className="text-amber-sizzle/60" />
        </motion.div>
      </motion.div>
    </div>
  )
}
