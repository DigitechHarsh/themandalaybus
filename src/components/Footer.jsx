import { Phone, MapPin, Heart } from 'lucide-react'

const QUICK_LINKS = [
  { label: 'Our Menu', href: '#menu' },
  { label: 'Build a Combo', href: '#builder' },
  { label: 'Find Us', href: '#location' },
]

export default function Footer() {
  const scrollTo = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer
      id="footer"
      className="relative py-16 px-4 sm:px-6 lg:px-8 border-t"
      style={{ background: 'rgba(10,11,14,0.65)', backdropFilter: 'blur(4px)', borderColor: 'rgba(255,255,255,0.06)' }}
      aria-label="Site footer"
    >
      {/* Subtle top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,158,0,0.3), transparent)' }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🚌</span>
              <div>
                <div
                  className="font-display font-black uppercase tracking-widest text-lg leading-none"
                  style={{ color: '#FF9E00', letterSpacing: '0.2em' }}
                >
                  The Mandalay
                </div>
                <div className="font-mono text-xs tracking-widest uppercase text-cream-warm/40 leading-none mt-0.5">
                  Bus
                </div>
              </div>
            </div>
            <p className="font-body text-sm text-cream-warm/55 leading-relaxed max-w-xs">
              Canberra's legendary late-night Asian street fusion food truck. Best drunk or sober since forever.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <a
                id="footer-phone"
                href="tel:+61405551782"
                className="flex items-center gap-2 text-xs font-mono text-cream-warm/50 hover:text-amber-sizzle transition-colors"
              >
                <Phone size={12} />
                +61 405 551 782
              </a>
            </div>
            <div className="flex items-center gap-2">
              <a
                id="footer-address"
                href="https://www.google.com/maps/dir//The+Mandalay+Bus,+Haig+Park+Carpark,+Lonsdale+St,+Braddon+ACT+2612,+Australia/@21.1612892,72.792461,2603m/data=!3m1!1e3!4m8!4m7!1m0!1m5!1m1!1s0x6b164d61f4e0e80b:0xaeaceac14a36e584!2m2!1d149.1327256!2d-35.2704263?entry=ttu&g_ep=EgoyMDI2MDcyMS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-mono text-cream-warm/50 hover:text-amber-sizzle transition-colors"
              >
                <MapPin size={12} />
                Haig Park, Lonsdale St, Braddon ACT
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-amber-sizzle/70 mb-5">
              Quick Links
            </h3>
            <nav aria-label="Footer navigation">
              <ul className="flex flex-col gap-3">
                {QUICK_LINKS.map((link) => (
                  <li key={link.label}>
                    <button
                      id={`footer-link-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                      onClick={() => scrollTo(link.href)}
                      className="font-display font-semibold text-sm text-cream-warm/60 hover:text-amber-sizzle transition-colors duration-200 bg-transparent border-0 cursor-pointer text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Hours & vibe */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-amber-sizzle/70 mb-5">
              Hours
            </h3>
            <div className="flex flex-col gap-2 text-sm font-body text-cream-warm/60">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-mint-neon" />
                <span>Wed – Sat · 6:00 PM – 1:00 AM</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white/15" />
                <span>Sun – Tue · Closed</span>
              </div>
            </div>

            <div
              className="mt-6 p-4 rounded-xl"
              style={{ background: 'rgba(255,158,0,0.06)', border: '1px solid rgba(255,158,0,0.13)' }}
            >
              <p className="font-body text-xs text-cream-warm/50 leading-relaxed">
                🎂 <strong className="text-cream-warm/70">It's your birthday?</strong> Tell us! We'll sing you happy birthday and bring complimentary mozzarella sticks.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <p className="font-mono text-xs text-cream-warm/30 text-center sm:text-left">
            © {new Date().getFullYear()} The Mandalay Bus · Braddon ACT, Australia
          </p>

          <div className="flex items-center gap-1.5 font-mono text-xs text-cream-warm/25">
            Made with <Heart size={10} className="text-crimson-cyber fill-crimson-cyber mx-0.5" /> in Canberra
          </div>
        </div>
      </div>
    </footer>
  )
}
