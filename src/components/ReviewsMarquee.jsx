import { Star, Heart } from 'lucide-react'

const REVIEWS = [
  {
    id: 'r1',
    quote: 'I love the Mandalay bus so much omg. They sang me happy birthday with a candle!',
    author: 'Issy B.',
    stars: 5,
    emoji: '🎂',
  },
  {
    id: 'r2',
    quote: 'Best fast food in Canberra, restaurant quality. Waffle fries with satay are to die for!',
    author: 'Pandy',
    stars: 5,
    emoji: '🍟',
  },
  {
    id: 'r3',
    quote: 'Pork larb tortilla is so yummy that I dream about it.',
    author: 'Zoe A.',
    stars: 5,
    emoji: '🌮',
  },
  {
    id: 'r4',
    quote: 'Best place in Canberra for a late night snack, hands down.',
    author: 'Thomas H.',
    stars: 5,
    emoji: '🌙',
  },
  {
    id: 'r5',
    quote: 'The coconut noodle soup is absolute heaven at midnight. Life-changing.',
    author: 'Maya K.',
    stars: 5,
    emoji: '🍜',
  },
  {
    id: 'r6',
    quote: 'Mozzarella sticks with that cheese pull? Unmatched. Pure street food art.',
    author: 'Jake D.',
    stars: 5,
    emoji: '🧀',
  },
  {
    id: 'r7',
    quote: 'Only food truck in Canberra that consistently has a queue — and for good reason!',
    author: 'Sarah L.',
    stars: 5,
    emoji: '⭐',
  },
  {
    id: 'r8',
    quote: 'Their wings are crispy perfection. Worth every cent and every minute of the wait.',
    author: 'Alex M.',
    stars: 5,
    emoji: '🍗',
  },
]

// Duplicate for seamless infinite loop
const TRACK = [...REVIEWS, ...REVIEWS]

function ReviewCard({ review }) {
  return (
    <article
      className="glass-card rounded-2xl p-5 flex flex-col gap-3 min-w-[280px] max-w-[300px] flex-shrink-0"
      aria-label={`Review by ${review.author}`}
    >
      {/* Stars */}
      <div className="flex items-center gap-1">
        {[...Array(review.stars)].map((_, i) => (
          <Star key={i} size={12} className="text-gold-burma fill-gold-burma" />
        ))}
        <span className="ml-2 text-lg" role="img" aria-label="emoji">{review.emoji}</span>
      </div>

      {/* Quote */}
      <blockquote className="font-body text-sm text-cream-warm/80 leading-relaxed italic flex-1">
        "{review.quote}"
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
        <div className="w-7 h-7 rounded-full bg-amber-sizzle/20 border border-amber-sizzle/30 flex items-center justify-center text-xs font-bold text-amber-sizzle">
          {review.author[0]}
        </div>
        <span className="font-display font-semibold text-sm text-cream-warm/70">
          {review.author}
        </span>
        <Heart size={10} className="ml-auto text-crimson-cyber fill-crimson-cyber" />
      </div>
    </article>
  )
}

export default function ReviewsMarquee() {
  return (
    <section
      id="reviews"
      className="py-20 overflow-hidden relative"
      style={{
        background: 'rgba(10,11,14,0.48)',
        backdropFilter: 'blur(2px)',
        WebkitBackdropFilter: 'blur(2px)',
        zIndex: 10,
        position: 'relative',
      }}
      aria-labelledby="reviews-heading"
    >
      {/* Header */}
      <div className="text-center mb-12 px-4 reveal">
        <div className="font-mono text-xs tracking-widest uppercase text-gold-burma/70 mb-3">
          — What the people say —
        </div>
        <h2
          id="reviews-heading"
          className="font-display font-black uppercase text-cream-warm"
          style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', letterSpacing: '-0.02em' }}
        >
          Legendary <span className="shimmer-text">Reviews</span>
        </h2>
      </div>

      {/* Marquee track 1 — left to right */}
      <div className="relative mb-4" aria-hidden="true">
        <div
          className="flex gap-4 animate-marquee"
          style={{ width: 'max-content' }}
        >
          {TRACK.map((r, i) => (
            <ReviewCard key={`a-${r.id}-${i}`} review={r} />
          ))}
        </div>
      </div>

      {/* Marquee track 2 — right to left (reverse) */}
      <div className="relative" aria-hidden="true">
        <div
          className="flex gap-4 animate-marquee-rev"
          style={{ width: 'max-content' }}
        >
          {[...TRACK].reverse().map((r, i) => (
            <ReviewCard key={`b-${r.id}-${i}`} review={r} />
          ))}
        </div>
      </div>

      {/* Fade edges */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40"
        style={{ background: 'linear-gradient(90deg, #0A0B0E, transparent)', zIndex: 5 }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40"
        style={{ background: 'linear-gradient(-90deg, #0A0B0E, transparent)', zIndex: 5 }}
        aria-hidden="true"
      />
    </section>
  )
}
