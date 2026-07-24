import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone } from 'lucide-react'
import LiveStatusBadge from './LiveStatusBadge'

const NAV_LINKS = [
  { label: 'Menu', href: '#menu' },
  { label: 'Munchies Builder', href: '#builder' },
  { label: 'Find Us', href: '#location' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const scrollTo = (href) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <header
        id="navbar"
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8"
        style={{
          paddingTop: '0.75rem',
          paddingBottom: '0.75rem',
          background: 'rgba(10,11,14,0.7)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <a
            href="#"
            id="nav-logo"
            className="flex items-center gap-2.5 group"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          >
            <span className="text-2xl">🚌</span>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-mono text-[10px] tracking-widest uppercase text-amber-sizzle font-bold">
                  THE
                </span>
                <span className="mandalay-script-logo-nav text-base sm:text-lg">
                  Mandalay
                </span>
                <span className="font-display font-black text-xs sm:text-sm text-cream-warm tracking-wider uppercase">
                  BUS
                </span>
              </div>
              <div className="font-mono text-[9px] tracking-widest uppercase text-cream-warm/40 leading-none mt-1">
                Haig Park · Braddon ACT
              </div>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Primary navigation">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                id={`nav-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                onClick={() => scrollTo(link.href)}
                className="font-display font-semibold text-sm tracking-widest uppercase text-cream-warm/70 hover:text-amber-sizzle transition-colors duration-200 bg-transparent border-0 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            <LiveStatusBadge compact />
            <a
              id="nav-call-btn"
              href="tel:+61405551782"
              className="btn-amber px-4 py-2 flex items-center gap-2"
              aria-label="Call The Mandalay Bus"
            >
              <Phone size={14} />
              <span>+61 405 551 782</span>
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg text-cream-warm/70 hover:text-amber-sizzle transition-colors"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-drawer"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-40 flex flex-col md:hidden"
            style={{
              background: 'rgba(10,11,14,0.97)',
              backdropFilter: 'blur(24px)',
              paddingTop: '80px',
            }}
          >
            <nav className="flex flex-col items-center justify-center flex-1 gap-8 p-8" aria-label="Mobile navigation">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 + 0.1 }}
                  onClick={() => scrollTo(link.href)}
                  className="font-display font-black text-3xl tracking-widest uppercase text-cream-warm hover:text-amber-sizzle transition-colors duration-200 bg-transparent border-0 cursor-pointer"
                >
                  {link.label}
                </motion.button>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="flex flex-col items-center gap-4 mt-4"
              >
                <LiveStatusBadge compact />
                <a
                  href="tel:+61405551782"
                  className="btn-amber px-6 py-3 flex items-center gap-2 text-base"
                >
                  <Phone size={16} />
                  +61 405 551 782
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
