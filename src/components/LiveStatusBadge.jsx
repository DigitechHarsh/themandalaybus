import { useEffect, useState, useCallback } from 'react'
import { MapPin, Clock } from 'lucide-react'

const DAYS_OPEN = [3, 4, 5, 6] // Wed=3, Thu=4, Fri=5, Sat=6
const OPEN_HOUR = 18 // 6 PM
const CLOSE_HOUR = 1  // 1 AM next day

function getAESTNow() {
  const now = new Date()
  // Use Intl to get AEST (Australia/ACT handles DST automatically)
  const parts = new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/ACT',
    hour: 'numeric',
    minute: 'numeric',
    weekday: 'short',
    hour12: false,
  }).formatToParts(now)

  const obj = {}
  parts.forEach((p) => { obj[p.type] = p.value })

  const dayMap = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 0 }
  const day = dayMap[obj.weekday] ?? 0
  const hours = parseInt(obj.hour, 10)
  const minutes = parseInt(obj.minute, 10)
  return { day, hours, minutes }
}

function getBusStatus() {
  const { day, hours, minutes } = getAESTNow()
  const timeMin = hours * 60 + minutes

  // Evening session: day in [3,4,5,6] AND time >= 18:00
  const isEvening = DAYS_OPEN.includes(day) && timeMin >= OPEN_HOUR * 60

  // Early-morning session (past midnight, still Sat night/Sun morning etc.)
  // If it's past midnight (hours < CLOSE_HOUR), the "parent" day was yesterday
  // Check: if day is 4,5,6,0 AND time < 1:00 (60 min)
  const earlyMornDays = [4, 5, 6, 0] // Thu, Fri, Sat, Sun (the "next day" after Wed–Sat eve)
  const isMorning = earlyMornDays.includes(day) && timeMin < CLOSE_HOUR * 60

  return isEvening || isMorning
}

function getNextOpenText() {
  const { day } = getAESTNow()
  const nextOpenDays = { 0: 'Wednesday', 1: 'Wednesday', 2: 'Wednesday', 3: 'Thursday', 4: 'Friday', 5: 'Saturday', 6: 'Wednesday' }
  return nextOpenDays[day] || 'Wednesday'
}

export default function LiveStatusBadge({ compact = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const [nextOpen, setNextOpen] = useState('Wednesday')

  const update = useCallback(() => {
    setIsOpen(getBusStatus())
    setNextOpen(getNextOpenText())
  }, [])

  useEffect(() => {
    update()
    const id = setInterval(update, 30_000) // re-check every 30s
    return () => clearInterval(id)
  }, [update])

  const handleDirections = () => {
    window.open(
      'https://www.google.com/maps/dir//The+Mandalay+Bus,+Haig+Park+Carpark,+Lonsdale+St,+Braddon+ACT+2612,+Australia/@21.1612892,72.792461,2603m/data=!3m1!1e3!4m8!4m7!1m0!1m5!1m1!1s0x6b164d61f4e0e80b:0xaeaceac14a36e584!2m2!1d149.1327256!2d-35.2704263?entry=ttu&g_ep=EgoyMDI2MDcyMS4wIKXMDSoASAFQAw%3D%3D',
      '_blank',
      'noopener,noreferrer',
    )
  }

  if (compact) {
    return (
      <button
        onClick={handleDirections}
        id="live-status-badge-compact"
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer border ${
          isOpen
            ? 'border-mint-neon/40 bg-mint-neon/10 text-mint-neon'
            : 'border-amber-sizzle/30 bg-amber-sizzle/10 text-amber-sizzle'
        }`}
        aria-label={isOpen ? 'Bus is open - click for directions' : 'Bus is closed'}
      >
        <span
          className={`w-2 h-2 rounded-full ${isOpen ? 'bg-mint-neon animate-pulse-dot' : 'bg-amber-sizzle'}`}
        />
        {isOpen ? '● OPEN NOW' : '○ CLOSED'}
      </button>
    )
  }

  return (
    <div
      id="live-status-badge"
      className={`inline-flex flex-col gap-2 p-4 rounded-xl border transition-all duration-500 ${
        isOpen
          ? 'border-mint-neon/30 bg-mint-neon/8'
          : 'border-amber-sizzle/25 bg-amber-sizzle/8'
      }`}
      style={{
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className={`w-3 h-3 rounded-full flex-shrink-0 ${
            isOpen ? 'bg-mint-neon animate-pulse-dot shadow-mint' : 'bg-amber-sizzle'
          }`}
        />
        <span
          className={`font-mono text-sm tracking-widest uppercase font-bold ${
            isOpen ? 'neon-mint' : 'text-amber-sizzle'
          }`}
        >
          {isOpen
            ? '● BUS IS SIZZLING LIVE · CLOSING 1 AM'
            : `○ OPENS ${nextOpen.toUpperCase()} AT 6:00 PM`}
        </span>
      </div>

      <div className="flex items-center gap-3 pl-6">
        <button
          id="directions-btn"
          onClick={handleDirections}
          className="flex items-center gap-1.5 text-xs font-mono text-cream-warm/60 hover:text-amber-sizzle transition-colors duration-200"
          aria-label="Get directions to The Mandalay Bus"
        >
          <MapPin size={12} />
          Haig Park Carpark, Lonsdale St, Braddon ACT
        </button>

        <span className="flex items-center gap-1.5 text-xs font-mono text-cream-warm/40">
          <Clock size={12} />
          Wed–Sat 6PM–1AM
        </span>
      </div>
    </div>
  )
}
