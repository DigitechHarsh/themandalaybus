import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, ShoppingBag, X, Flame } from 'lucide-react'

/* ── Data ─────────────────────────────────────────────────────────── */
const STEPS = [
  {
    id: 'main',
    label: 'Choose Your Main',
    price: 11,
    emoji: '🍜',
    options: [
      { id: 'satay-roti', name: 'Satay Chicken Kimchi Roti', emoji: '🍗', spice: 2, cal: 680 },
      { id: 'pork-larb', name: 'Pork Larb Tortilla', emoji: '🌮', spice: 3, cal: 620 },
      { id: 'quesadilla', name: 'Mandalay Quesadilla', emoji: '🫓', spice: 1, cal: 700 },
      { id: 'coconut-soup', name: 'Coconut Noodle Soup', emoji: '🍜', spice: 1, cal: 540 },
      { id: 'no-main', name: 'No Need', emoji: '🚫', spice: 0, cal: 0, isNone: true },
    ],
  },
  {
    id: 'side',
    label: 'Choose Your Side',
    price: 11,
    emoji: '🍟',
    options: [
      { id: 'waffle-fries', name: 'Waffle Cut Fries', emoji: '🍟', spice: 0, cal: 450 },
      { id: 'wings', name: 'Mandalay Fried Wings', emoji: '🍗', spice: 1, cal: 520 },
      { id: 'mozz-sticks', name: 'Mozzarella Sticks', emoji: '🧀', spice: 0, cal: 420 },
      { id: 'jalapeno-balls', name: 'Jalapeño Cheese Balls', emoji: '🟢', spice: 3, cal: 480 },
      { id: 'squid', name: 'Salt & Pepper Squid', emoji: '🦑', spice: 1, cal: 350 },
      { id: 'samosas', name: 'Vegetarian Samosas', emoji: '🥟', spice: 1, cal: 320 },
      { id: 'spring-rolls', name: 'Mini Spring Rolls', emoji: '🌿', spice: 0, cal: 300 },
      { id: 'no-side', name: 'No Need', emoji: '🚫', spice: 0, cal: 0, isNone: true },
    ],
  },
  {
    id: 'sauce',
    label: 'Choose Your Drizzle',
    price: 3,
    emoji: '🫙',
    options: [
      { id: 'satay', name: 'Satay Sauce', emoji: '🥜', spice: 1, cal: 120 },
      { id: 'aioli', name: 'Garlic Aioli', emoji: '🧄', spice: 0, cal: 100 },
      { id: 'sweet-chilli', name: 'Sweet Chilli', emoji: '🌶', spice: 2, cal: 80 },
      { id: 'hot-chilli', name: 'Hot Chilli', emoji: '🔥', spice: 4, cal: 60 },
      { id: 'mayo', name: 'Mayo', emoji: '🤍', spice: 0, cal: 110 },
      { id: 'ranch', name: 'Ranch', emoji: '🌿', spice: 0, cal: 115 },
      { id: 'no-sauce', name: 'No Need', emoji: '🚫', spice: 0, cal: 0, isNone: true },
    ],
  },
  {
    id: 'drink',
    label: 'Choose Your Refreshment',
    price: 3,
    emoji: '🥤',
    options: [
      { id: 'coke', name: 'Coke', emoji: '🥤', spice: 0, cal: 140 },
      { id: 'coke-zero', name: 'Coke Zero', emoji: '⚫', spice: 0, cal: 0 },
      { id: 'fanta', name: 'Fanta', emoji: '🍊', spice: 0, cal: 130 },
      { id: 'sprite', name: 'Sprite', emoji: '💚', spice: 0, cal: 120 },
      { id: 'water', name: 'Cold Water', emoji: '💧', spice: 0, cal: 0 },
      { id: 'no-drink', name: 'No Need', emoji: '🚫', spice: 0, cal: 0, isNone: true },
    ],
  },
]

const MAX_SPICE = 12 // max possible spice sum

export default function MunchiesBuilder() {
  const [step, setStep] = useState(0)
  const [selections, setSelections] = useState({})
  const [drawerOpen, setDrawerOpen] = useState(false)

  const currentStep = STEPS[step]
  const isLastStep = step === STEPS.length - 1
  const allSelected = STEPS.every((s) => selections[s.id])

  // Derived stats — 'No Need' adds $0 to total price
  const totalPrice = STEPS.reduce((acc, s) => {
    const sel = selections[s.id]
    if (!sel || sel.isNone) return acc
    return acc + s.price
  }, 0)

  const totalCal = Object.values(selections).reduce((acc, opt) => acc + (opt?.cal || 0), 0)
  const totalSpice = Object.values(selections).reduce((acc, opt) => acc + (opt?.spice || 0), 0)
  const spicePct = Math.min(100, Math.round((totalSpice / MAX_SPICE) * 100))

  const select = (option) => {
    setSelections((prev) => ({ ...prev, [currentStep.id]: option }))
    // Auto-advance after short delay
    if (!isLastStep) {
      setTimeout(() => setStep((s) => s + 1), 280)
    } else {
      setDrawerOpen(true)
    }
  }

  const reset = () => {
    setSelections({})
    setStep(0)
    setDrawerOpen(false)
  }

  const orderViaWhatsApp = () => {
    const lines = STEPS.map((s) => {
      const sel = selections[s.id]
      if (!sel) return null
      const category = s.label.replace('Choose Your ', '')
      if (sel.isNone) return `• *${category}*: None ($0)`
      return `• *${category}*: ${sel.name} (+$${s.price})`
    }).filter(Boolean)

    const msgText =
`🚌 *THE MANDALAY BUS — COMBO ORDER*
──────────────────────────
${lines.join('\n')}
──────────────────────────
💰 *TOTAL: $${totalPrice}*
📍 *Pickup*: Haig Park Carpark, Lonsdale St, Braddon
──────────────────────────
Hi team! I'd like to place this late-night order.`

    const url = `https://wa.me/61405551782?text=${encodeURIComponent(msgText)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <section
      id="builder"
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(10,11,14,0.48) 0%, rgba(12,10,11,0.55) 100%)',
        backdropFilter: 'blur(2px)',
        WebkitBackdropFilter: 'blur(2px)',
        zIndex: 10,
        position: 'relative',
      }}
      aria-labelledby="builder-heading"
    >
      {/* Top crimson separator */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,59,48,0.5), transparent)' }}
      />
      {/* Crimson radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,59,48,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 reveal">
          <div className="font-mono text-xs tracking-widest uppercase text-crimson-cyber/70 mb-3">
            — Build Your Combo —
          </div>
          <h2
            id="builder-heading"
            className="font-display font-black uppercase text-cream-warm"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', letterSpacing: '-0.02em' }}
          >
            Late-Night <span className="neon-crimson">Munchies</span> Builder
          </h2>
          <p className="font-body text-cream-warm/60 mt-3">
            Craft your perfect combo — step by step.
          </p>
        </div>

        {/* Step progress */}
        <div className="flex items-center gap-2 mb-10 justify-center">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <button
                id={`builder-step-${i}`}
                onClick={() => i <= step && setStep(i)}
                className={`flex items-center justify-center w-9 h-9 rounded-full font-mono text-sm font-bold transition-all duration-300 border cursor-pointer ${
                  i < step
                    ? 'bg-mint-neon border-mint-neon text-obsidian'
                    : i === step
                    ? 'bg-amber-sizzle border-amber-sizzle text-obsidian shadow-amber'
                    : 'bg-transparent border-white/15 text-cream-warm/40 cursor-default'
                }`}
                disabled={i > step}
                aria-label={`Step ${i + 1}: ${s.label}`}
                aria-current={i === step ? 'step' : undefined}
              >
                {i < step ? '✓' : i + 1}
              </button>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-px transition-all duration-500 ${
                    i < step ? 'bg-mint-neon w-8 sm:w-16' : 'bg-white/10 w-8 sm:w-16'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step label */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-6"
          >
            <span className="text-2xl mr-2">{currentStep.emoji}</span>
            <span className="font-display font-bold text-lg sm:text-xl text-cream-warm">
              {currentStep.label}
            </span>
            <span className="ml-3 font-mono text-sm text-amber-sizzle">
              +${currentStep.price}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Options grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-10"
          >
            {currentStep.options.map((opt) => {
              const selected = selections[currentStep.id]?.id === opt.id
              return (
                <motion.button
                  key={opt.id}
                  id={`builder-option-${opt.id}`}
                  onClick={() => select(opt)}
                  whileTap={{ scale: 0.96 }}
                  className={`relative p-4 rounded-xl border flex flex-col items-center gap-2 text-center transition-all duration-200 cursor-pointer group ${
                    selected
                      ? opt.isNone
                        ? 'border-white/30 bg-white/10 shadow-lg'
                        : 'border-amber-sizzle bg-amber-sizzle/12 shadow-amber'
                      : opt.isNone
                      ? 'border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10'
                      : 'border-white/8 bg-charcoal/50 hover:border-amber-sizzle/40 hover:bg-amber-sizzle/5'
                  }`}
                  aria-pressed={selected}
                  aria-label={opt.name}
                >
                  {selected && (
                    <span className={`absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${opt.isNone ? 'bg-white/40 text-cream-warm' : 'bg-amber-sizzle text-obsidian'}`}>
                      ✓
                    </span>
                  )}
                  <span className="text-2xl" role="img" aria-label={opt.name}>{opt.emoji}</span>
                  <span className={`font-display font-semibold text-xs leading-tight transition-colors ${opt.isNone ? 'text-cream-warm/75 group-hover:text-cream-warm' : 'text-cream-warm group-hover:text-amber-sizzle'}`}>
                    {opt.name}
                  </span>
                  {opt.isNone ? (
                    <span className="font-mono text-[10px] text-cream-warm/40 uppercase tracking-wider">Skip ($0)</span>
                  ) : opt.spice > 0 ? (
                    <span className="text-xs">{'🌶'.repeat(opt.spice)}</span>
                  ) : null}
                </motion.button>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <div className="flex items-center justify-between mb-10">
          <button
            id="builder-prev-btn"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-cream-warm/60 hover:text-cream-warm hover:border-white/25 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer bg-transparent"
          >
            <ChevronLeft size={16} />
            <span className="font-mono text-xs uppercase tracking-wider">Back</span>
          </button>

          {!isLastStep ? (
            <button
              id="builder-next-btn"
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              disabled={!selections[currentStep.id]}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-sizzle/40 text-amber-sizzle hover:bg-amber-sizzle/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer bg-transparent"
            >
              <span className="font-mono text-xs uppercase tracking-wider">Next</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              id="builder-summary-btn"
              onClick={() => allSelected && setDrawerOpen(true)}
              disabled={!allSelected}
              className="btn-amber px-6 py-2.5 flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={16} />
              <span>View Order</span>
            </button>
          )}
        </div>

        {/* Live stats meters */}
        <div className="glass-card rounded-2xl p-5 grid grid-cols-3 gap-4 reveal">
          {/* Price */}
          <div className="text-center">
            <div className="font-mono text-xs uppercase tracking-widest text-cream-warm/40 mb-1">Total</div>
            <div className="font-display font-black text-2xl text-amber-sizzle">${totalPrice}</div>
          </div>

          {/* Calories */}
          <div className="text-center">
            <div className="font-mono text-xs uppercase tracking-widest text-cream-warm/40 mb-1">~Cals</div>
            <div className="font-display font-black text-2xl text-cream-warm">{totalCal}</div>
          </div>

          {/* Spice gauge */}
          <div className="text-center">
            <div className="font-mono text-xs uppercase tracking-widest text-cream-warm/40 mb-1">Spice</div>
            <div className="flex items-center gap-2 justify-center">
              <Flame size={14} className="text-crimson-cyber" />
              <div className="flex-1 h-2 bg-white/8 rounded-full overflow-hidden" style={{ width: '60px' }}>
                <div
                  className="spice-bar h-full rounded-full"
                  style={{ width: `${spicePct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-obsidian/80 backdrop-blur-sm"
              style={{ zIndex: 60 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              id="order-summary-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-96 flex flex-col"
              style={{ background: '#14161C', borderLeft: '1px solid rgba(255,158,0,0.15)', zIndex: 61 }}
              aria-modal="true"
              role="dialog"
              aria-label="Order summary"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h3 className="font-display font-black text-lg text-cream-warm tracking-wide">
                  🛵 Your Combo
                </h3>
                <button
                  id="drawer-close-btn"
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 rounded-lg text-cream-warm/50 hover:text-cream-warm transition-colors bg-transparent border-0 cursor-pointer"
                  aria-label="Close order summary"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                {STEPS.map((s) => {
                  const sel = selections[s.id]
                  const isNone = sel?.isNone
                  return (
                    <div key={s.id} className="glass-card rounded-xl p-4 flex items-center gap-4">
                      <span className="text-2xl">{sel?.emoji || '?'}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-xs uppercase tracking-widest text-amber-sizzle/70 mb-0.5">
                          {s.label.replace('Choose Your ', '')}
                        </div>
                        <div className={`font-display font-semibold text-sm truncate ${isNone ? 'text-cream-warm/50 italic' : 'text-cream-warm'}`}>
                          {sel?.name || '—'}
                        </div>
                      </div>
                      <div className="font-display font-bold text-amber-sizzle text-sm">
                        {isNone ? '$0' : sel ? `+$${s.price}` : '—'}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="p-6 border-t border-white/5 flex flex-col gap-4">
                {/* Total row */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-cream-warm/60 uppercase tracking-wider">Total</span>
                  <span className="font-display font-black text-2xl text-amber-sizzle">${totalPrice}</span>
                </div>

                {/* Spice + Cal */}
                <div className="flex gap-4 text-xs font-mono text-cream-warm/40 uppercase tracking-wider">
                  <span>~{totalCal} cal</span>
                  <span>{'🌶'.repeat(Math.ceil(spicePct / 25))} spice</span>
                </div>

                {/* Order button */}
                <button
                  id="whatsapp-order-btn"
                  onClick={orderViaWhatsApp}
                  className="btn-amber w-full py-4 text-base flex items-center justify-center gap-2"
                >
                  📱 Order via WhatsApp
                </button>

                <button
                  id="start-over-btn"
                  onClick={reset}
                  className="btn-ghost w-full py-3 text-sm"
                >
                  Start Over
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}
