import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star } from 'lucide-react'

/* ── Data ─────────────────────────────────────────────────────────── */
const CATEGORIES = ['Top Sellers', 'Sides & Snacks', 'Drinks']

const MENU_ITEMS = {
  'Top Sellers': [
    {
      id: 'satay-roti',
      name: 'Satay Chicken Kimchi Roti',
      price: '$11.00',
      description: 'Tender marinated chicken, bold satay glaze, tangy kimchi crunch all wrapped in a golden roti.',
      spice: 2,
      badge: '🔥 Fan Fave',
      emoji: '🍗',
    },
    {
      id: 'pork-larb',
      name: 'Pork Larb Tortilla',
      price: '$11.00',
      description: 'Juicy pork larb, fresh pickled vegetables, vibrant herbs — rolled in a warm flour tortilla.',
      spice: 3,
      badge: '⭐ Staff Pick',
      emoji: '🌮',
    },
    {
      id: 'quesadilla',
      name: 'Mandalay Quesadilla',
      price: '$11.00',
      description: 'Our signature Asian-fusion twist on a classic quesadilla. Crispy outside, melty within.',
      spice: 1,
      badge: '🧀 Cheesy',
      emoji: '🫓',
    },
    {
      id: 'coconut-soup',
      name: "Burma's Golden Treasure",
      price: '$11.00',
      description:
        'Coconut Noodle Soup — tender chicken breast, fragrant broth with ginger, garlic, turmeric, sweet paprika & coconut milk. Wheat or GF noodles, topped with crispy fried onions & bean sprouts.',
      spice: 1,
      badge: '✨ Signature',
      emoji: '🍜',
    },
  ],
  'Sides & Snacks': [
    { id: 'waffle-fries', name: 'Waffle Cut Fries', price: '$11.00', description: 'Golden waffle-cut fries, perfectly crisp. Drizzle with satay for maximum damage.', spice: 0, emoji: '🍟' },
    { id: 'wings', name: 'Mandalay Fried Wings (8pcs)', price: '$11.00', description: '8 pieces of crispy fried wings with our house seasoning blend.', spice: 1, emoji: '🍗' },
    { id: 'prawn-twisters', name: 'Prawn Twisters (7pcs)', price: '$11.00', description: '7 golden prawn twisters — light crispy batter, juicy prawns inside.', spice: 0, emoji: '🦐' },
    { id: 'jalapeno-balls', name: 'Jalapeño Cheese Balls (8pcs)', price: '$11.00', description: '8 fiery jalapeño cheese balls — crispy shell, molten cheese lava core.', spice: 3, emoji: '🟢' },
    { id: 'mozz-sticks', name: 'Mozzarella Sticks (7pcs)', price: '$11.00', description: '7 epic mozzarella sticks with legendary cheese pulls. Complimentary on your birthday!', spice: 0, badge: '🎂 Birthday Special', emoji: '🧀' },
    { id: 'squid', name: 'Salt & Pepper Squid (8pcs)', price: '$11.00', description: '8 pieces of tender squid tossed in our aromatic salt & pepper mix.', spice: 1, emoji: '🦑' },
    { id: 'samosas', name: 'Vegetarian Samosas (4pcs)', price: '$11.00', description: '4 crispy golden samosas packed with spiced potato and peas.', spice: 1, emoji: '🥟' },
    { id: 'dim-sims', name: 'Mini Fried Chicken Dim Sims (11pcs)', price: '$11.00', description: '11 tiny crispy chicken dim sims — the perfect late night snack.', spice: 0, emoji: '🥟' },
    { id: 'spring-rolls', name: 'Mini Spring Rolls (11pcs)', price: '$11.00', description: '11 light crispy spring rolls filled with veggie and glass noodle goodness.', spice: 0, emoji: '🌿' },
    { id: 'onion-rings', name: 'Onion Rings', price: '$11.00', description: 'Classic golden-battered onion rings, thick-cut and satisfying.', spice: 0, emoji: '⭕' },
  ],
  Drinks: [
    { id: 'coke', name: 'Coke', price: '$3.00', description: 'Ice-cold original.', emoji: '🥤' },
    { id: 'coke-zero', name: 'Coke Zero', price: '$3.00', description: 'Zero sugar, full flavour.', emoji: '⚫' },
    { id: 'fanta', name: 'Fanta', price: '$3.00', description: 'Refreshing orange fizz.', emoji: '🍊' },
    { id: 'sprite', name: 'Sprite', price: '$3.00', description: 'Crisp lemon-lime bubbles.', emoji: '💚' },
    { id: 'water', name: 'Cold Water', price: '$3.00', description: 'Pure and cold.', emoji: '💧' },
  ],
}

const spiceLabels = ['', '🌶', '🌶🌶', '🌶🌶🌶', '🌶🌶🌶🌶']

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState('Top Sellers')

  return (
    <section
      id="menu"
      className="relative py-24 px-4 sm:px-6 lg:px-8"
      style={{
        background: 'linear-gradient(180deg, rgba(10,11,14,0.2) 0%, rgba(10,11,14,0.48) 15%, rgba(10,11,14,0.52) 100%)',
        backdropFilter: 'blur(2px)',
        WebkitBackdropFilter: 'blur(2px)',
        zIndex: 10,
        position: 'relative',
      }}
      aria-labelledby="menu-heading"
    >
      {/* Amber glow + top transparent fade */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,158,0,0.08) 0%, transparent 70%)',
        }}
      />
      {/* Top separator glow line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,158,0,0.5), transparent)' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-14 reveal">
          <div className="font-mono text-xs tracking-widest uppercase text-amber-sizzle/70 mb-3">
            — The Goods —
          </div>
          <h2
            id="menu-heading"
            className="font-display font-black uppercase text-cream-warm"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '-0.02em' }}
          >
            The <span className="neon-amber">Menu</span>
          </h2>
          <p className="font-body text-cream-warm/60 mt-3 max-w-lg mx-auto">
            Late-night Asian street fusion crafted with love. Every item $11 or $3.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 reveal">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              id={`menu-tab-${cat.toLowerCase().replace(/\s/g, '-')}`}
              onClick={() => setActiveCategory(cat)}
              className={`font-mono text-xs tracking-widest uppercase px-5 py-2.5 rounded-full border transition-all duration-250 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-amber-sizzle text-obsidian border-amber-sizzle font-bold shadow-amber'
                  : 'bg-transparent text-cream-warm/60 border-white/10 hover:border-amber-sizzle/40 hover:text-amber-sizzle'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {MENU_ITEMS[activeCategory].map((item, i) => (
              <motion.article
                key={item.id}
                id={`menu-item-${item.id}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4, ease: 'easeOut' }}
                className="menu-card glass-card rounded-2xl p-5 flex flex-col gap-3 group"
                aria-label={`${item.name} ${item.price}`}
              >
                {/* Emoji & badge row */}
                <div className="flex items-start justify-between">
                  <span className="text-3xl" role="img" aria-label={item.name}>{item.emoji}</span>
                  {item.badge && (
                    <span className="font-mono text-xs text-amber-sizzle bg-amber-sizzle/10 border border-amber-sizzle/20 px-2 py-0.5 rounded-full leading-tight">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Name */}
                <h3 className="font-display font-bold text-cream-warm text-base leading-snug group-hover:text-amber-sizzle transition-colors duration-200">
                  {item.name}
                </h3>

                {/* Description */}
                <p className="font-body text-xs text-cream-warm/55 leading-relaxed flex-1">
                  {item.description}
                </p>

                {/* Price & spice row */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="font-display font-black text-amber-sizzle text-lg tracking-tight">
                    {item.price}
                  </span>
                  {item.spice > 0 && (
                    <span
                      className="text-sm"
                      role="img"
                      aria-label={`Spice level ${item.spice} of 4`}
                      title={`Spice: ${item.spice}/4`}
                    >
                      {spiceLabels[item.spice]}
                    </span>
                  )}
                  {item.spice === 0 && (
                    <span className="font-mono text-xs text-cream-warm/30 uppercase tracking-wider">Mild</span>
                  )}
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA */}
        <div className="text-center mt-14 reveal">
          <p className="font-mono text-xs tracking-widest text-cream-warm/40 uppercase mb-4">
            🎂 Birthday? We'll sing & bring complimentary mozzarella sticks!
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className="text-gold-burma fill-gold-burma" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
