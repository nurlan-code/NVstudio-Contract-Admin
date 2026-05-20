export default function Header({ searchQuery, onSearchChange }) {
  return (
    <header className="flex-shrink-0 bg-white border-b border-[#e8edf5] px-8 py-[14px] sticky top-0 z-30
      flex items-center justify-between"
      style={{ boxShadow: '0 1px 3px rgba(0,26,92,0.06)' }}>
      <div className="flex items-center gap-3">
        <h1 className="text-[19px] font-bold text-[#0f172a] tracking-tight">Ümumi Baxış</h1>
        <span className="px-2.5 py-0.5 bg-[#f0f4ff] text-[#001A5C] text-[11px] font-semibold rounded-full border border-[#c7d4f5]">
          Canlı
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-[#94a3b8] pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Ad, email, FİN axtar..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-[260px] pl-10 pr-4 py-[9px] text-[13px] border border-[#e2e8f0] rounded-[10px] outline-none
              focus:border-[#001A5C] focus:ring-2 focus:ring-[#001A5C]/10 transition-all
              placeholder:text-[#b0bec5] text-[#0f172a] bg-[#f8fafc] focus:bg-white"
          />
          {searchQuery && (
            <button onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] hover:text-[#475569]">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-[#e2e8f0]" />

        {/* Bell */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-[10px]
          hover:bg-[#f1f5f9] transition-colors border border-transparent hover:border-[#e2e8f0]">
          <svg className="w-[19px] h-[19px] text-[#64748b]" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-[#ef4444] rounded-full
            text-white text-[9px] font-bold flex items-center justify-center leading-none select-none
            border-2 border-white shadow-sm">
            3
          </span>
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 cursor-pointer
          border border-[#e2e8f0] hover:border-[#001A5C]/30 transition-colors"
          style={{ background: 'linear-gradient(135deg, #001A5C 0%, #1e40af 100%)' }}>
          <span className="text-white text-[11px] font-bold select-none">AD</span>
        </div>
      </div>
    </header>
  )
}
