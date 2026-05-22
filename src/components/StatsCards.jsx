function fmtChange(n) {
  if (typeof n !== 'number') return '0% bu ay'
  const sign = n > 0 ? '+' : ''
  return `${sign}${n}% bu ay`
}

const ICONS = {
  users: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  active: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  rejected: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  pending: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

export default function StatsCards({ stats }) {
  const total = stats?.total ?? 0
  const active = stats?.active ?? 0
  const rejected = stats?.rejected ?? 0
  const pending = stats?.pending ?? 0

  const changes = stats?.changes || {}

  const CARDS = [
    {
      label: 'Ümumi İstifadəçilər',
      value: total.toLocaleString('en-US'),
      change: fmtChange(changes.total),
      positive: (changes.total ?? 0) >= 0,
      gradient: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)',
      iconColor: '#3b82f6',
      sparkColor: '#3b82f6',
      rising: (changes.total ?? 0) >= 0,
      icon: ICONS.users,
    },
    {
      label: 'Aktiv İstifadəçilər',
      value: active.toLocaleString('en-US'),
      change: fmtChange(changes.active),
      positive: (changes.active ?? 0) >= 0,
      gradient: 'linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%)',
      iconColor: '#16a34a',
      sparkColor: '#22c55e',
      rising: (changes.active ?? 0) >= 0,
      icon: ICONS.active,
    },
    {
      label: 'Rədd Edilənlər',
      value: rejected.toLocaleString('en-US'),
      change: fmtChange(changes.rejected),
      positive: (changes.rejected ?? 0) >= 0,
      gradient: 'linear-gradient(135deg, #fee2e2 0%, #fff5f5 100%)',
      iconColor: '#dc2626',
      sparkColor: '#ef4444',
      rising: (changes.rejected ?? 0) >= 0,
      icon: ICONS.rejected,
    },
    {
      label: 'Gözləyənlər',
      value: pending.toLocaleString('en-US'),
      change: fmtChange(changes.pending),
      positive: (changes.pending ?? 0) >= 0,
      gradient: 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)',
      iconColor: '#d97706',
      sparkColor: '#f59e0b',
      rising: (changes.pending ?? 0) >= 0,
      icon: ICONS.pending,
    },
  ]

function Sparkline({ rising, color }) {
  const id = `sg-${color.replace('#', '')}`

  // Realistic wavy paths: overall rising or falling but with natural bumps
  const linePath = rising
    ? "M0,26 C6,24 10,20 16,18 S26,22 32,17 S44,10 52,12 S64,8 72,6 S78,4 80,3"
    : "M0,5 C6,7 10,4 16,8 S26,6 32,12 S42,16 50,14 S62,19 70,22 S76,24 80,27"

  const fillPath = rising
    ? "M0,26 C6,24 10,20 16,18 S26,22 32,17 S44,10 52,12 S64,8 72,6 S78,4 80,3 L80,32 L0,32 Z"
    : "M0,5 C6,7 10,4 16,8 S26,6 32,12 S42,16 50,14 S62,19 70,22 S76,24 80,27 L80,32 L0,32 Z"

  return (
    <svg width="80" height="32" viewBox="0 0 80 32" className="overflow-visible">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.20" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill={`url(#${id})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {CARDS.map((card, i) => (
        <div key={i}
          className="bg-white border border-[#e8edf5] rounded-2xl p-5 hover:shadow-lg hover:-translate-y-0.5
            transition-all duration-200 cursor-default overflow-hidden relative"
          style={{ boxShadow: '0 2px 8px rgba(0,26,92,0.05)' }}>
          {/* Top row */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[12px] text-[#64748b] font-medium mb-2 tracking-wide">{card.label}</p>
              <p className="text-[30px] font-black text-[#0f172a] leading-none tracking-tight">{card.value}</p>
            </div>
            <div className="w-11 h-11 rounded-[12px] flex items-center justify-center flex-shrink-0"
              style={{ background: card.gradient, color: card.iconColor }}>
              {card.icon}
            </div>
          </div>
          {/* Bottom row */}
          <div className="flex items-end justify-between">
            <div>
              <span className="inline-flex items-center gap-1 text-[12.5px] font-semibold"
                style={{ color: card.positive ? '#16a34a' : '#dc2626' }}>
                <span className="text-base leading-none">{card.positive ? '↑' : '↓'}</span>
                {card.change}
              </span>
            </div>
            <Sparkline rising={card.rising} color={card.sparkColor} />
          </div>
        </div>
      ))}
    </div>
  )
}