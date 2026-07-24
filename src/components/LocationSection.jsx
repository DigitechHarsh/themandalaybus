import { MapPin, Phone, Clock, Navigation, Calendar } from 'lucide-react'

const HOURS = [
  { day: 'Wednesday', hours: '6:00 PM – 1:00 AM', open: true },
  { day: 'Thursday', hours: '6:00 PM – 1:00 AM', open: true },
  { day: 'Friday', hours: '6:00 PM – 1:00 AM', open: true },
  { day: 'Saturday', hours: '6:00 PM – 1:00 AM', open: true },
  { day: 'Sunday', hours: 'Closed', open: false },
  { day: 'Monday', hours: 'Closed', open: false },
  { day: 'Tuesday', hours: 'Closed', open: false },
]

export default function LocationSection() {
  const handleDirections = () => {
    window.open(
      'https://www.google.com/maps/dir//The+Mandalay+Bus,+Haig+Park+Carpark,+Lonsdale+St,+Braddon+ACT+2612,+Australia/@21.1612892,72.792461,2603m/data=!3m1!1e3!4m8!4m7!1m0!1m5!1m1!1s0x6b164d61f4e0e80b:0xaeaceac14a36e584!2m2!1d149.1327256!2d-35.2704263?entry=ttu&g_ep=EgoyMDI2MDcyMS4wIKXMDSoASAFQAw%3D%3D',
      '_blank',
      'noopener,noreferrer',
    )
  }

  return (
    <section
      id="location"
      className="relative py-24 px-4 sm:px-6 lg:px-8"
      style={{
        background: 'linear-gradient(180deg, rgba(10,11,14,0.48) 0%, rgba(10,14,11,0.55) 100%)',
        backdropFilter: 'blur(2px)',
        WebkitBackdropFilter: 'blur(2px)',
        zIndex: 10,
        position: 'relative',
      }}
      aria-labelledby="location-heading"
    >
      {/* Gold radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 50% 40% at 80% 50%, rgba(230,184,0,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-14 reveal">
          <div className="font-mono text-xs tracking-widest uppercase text-gold-burma/70 mb-3">
            — Come Find Us —
          </div>
          <h2
            id="location-heading"
            className="font-display font-black uppercase text-cream-warm"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', letterSpacing: '-0.02em' }}
          >
            Haig Park, <span className="neon-gold">Braddon</span>
          </h2>
          <p className="font-body text-cream-warm/60 mt-3 max-w-md mx-auto">
            We're parked in the Haig Park Carpark on Lonsdale St, Braddon — look for the glowing bus!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left — Info cards */}
          <div className="flex flex-col gap-5 reveal">
            {/* Address */}
            <div className="glass-card-amber rounded-2xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-sizzle/15 flex items-center justify-center flex-shrink-0">
                <MapPin size={18} className="text-amber-sizzle" />
              </div>
              <div>
                <div className="font-mono text-xs uppercase tracking-widest text-amber-sizzle/70 mb-1">Address</div>
                <address className="font-display font-bold text-cream-warm not-italic leading-snug">
                  Haig Park Carpark<br />
                  Lonsdale St, Braddon<br />
                  ACT 2612, Australia
                </address>
              </div>
            </div>

            {/* Phone */}
            <div className="glass-card rounded-2xl p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-mint-neon/10 flex items-center justify-center flex-shrink-0">
                <Phone size={18} className="text-mint-neon" />
              </div>
              <div className="flex-1">
                <div className="font-mono text-xs uppercase tracking-widest text-mint-neon/70 mb-1">Phone</div>
                <a
                  href="tel:+61405551782"
                  id="location-phone-link"
                  className="font-display font-bold text-cream-warm hover:text-mint-neon transition-colors text-lg"
                >
                  +61 405 551 782
                </a>
              </div>
            </div>

            {/* Operating notice */}
            <div
              className="rounded-2xl p-5 flex items-start gap-3"
              style={{ background: 'rgba(255,158,0,0.07)', border: '1px solid rgba(255,158,0,0.18)' }}
            >
              <Clock size={18} className="text-amber-sizzle mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-mono text-xs tracking-widest uppercase text-amber-sizzle mb-1">Operating Hours</p>
                <p className="font-display font-bold text-cream-warm">Wednesday – Saturday</p>
                <p className="font-body text-sm text-cream-warm/70 mt-0.5">6:00 PM — 1:00 AM AEST</p>
                <p className="font-body text-xs text-cream-warm/40 mt-2">
                  🎂 Birthday? We'll sing & bring complimentary mozzarella sticks!
                </p>
              </div>
            </div>

            {/* Directions CTA */}
            <button
              id="get-directions-btn"
              onClick={handleDirections}
              className="btn-amber py-4 w-full flex items-center justify-center gap-3 text-sm"
            >
              <Navigation size={16} />
              Get Directions on Google Maps
            </button>
          </div>

          {/* Right — Hours table */}
          <div className="glass-card rounded-2xl overflow-hidden reveal">
            <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
              <Calendar size={16} className="text-amber-sizzle" />
              <span className="font-mono text-xs uppercase tracking-widest text-cream-warm/60">
                Weekly Schedule
              </span>
            </div>
            <div className="divide-y divide-white/5">
              {HOURS.map((row) => (
                <div
                  key={row.day}
                  className="px-6 py-4 flex items-center justify-between group hover:bg-white/2 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        row.open ? 'bg-mint-neon shadow-mint' : 'bg-white/15'
                      }`}
                    />
                    <span className={`font-display font-semibold text-sm ${row.open ? 'text-cream-warm' : 'text-cream-warm/40'}`}>
                      {row.day}
                    </span>
                  </div>
                  <span
                    className={`font-mono text-xs tracking-wide ${
                      row.open ? 'text-amber-sizzle' : 'text-cream-warm/30'
                    }`}
                  >
                    {row.hours}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-white/5">
              <p className="font-mono text-xs text-cream-warm/30 text-center uppercase tracking-wider">
                🔥 Best visited hungry
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
