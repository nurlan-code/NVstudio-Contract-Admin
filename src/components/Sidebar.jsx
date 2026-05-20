export default function Sidebar() {
  return (
    <aside className="w-[240px] flex-shrink-0 flex flex-col h-full"
      style={{ background: 'linear-gradient(180deg, #001A5C 0%, #001240 100%)' }}>

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="w-11 h-11 rounded-[12px] overflow-hidden flex-shrink-0">
          <img
            src="/logo.png"
            alt="NV Studio"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="text-white/40 text-[9.5px] font-bold tracking-[0.2em] uppercase leading-none mb-[5px]">NV STUDIO</p>
          <p className="text-white text-[13.5px] font-semibold leading-none">Admin Panel</p>
        </div>
      </div>

      {/* Nav label */}
      <div className="px-5 pt-5 pb-2">
        <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em]">Menyu</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pb-4">
        <button
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] relative overflow-hidden cursor-pointer group transition-all"
          style={{
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.18)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        >
          <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-[#60a5fa] rounded-r-full" />
          <div className="ml-1 w-[34px] h-[34px] rounded-[9px] flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.12)' }}>
            <svg className="w-[17px] h-[17px] text-white" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <span className="text-[13.5px] font-semibold text-white">Ümumi Baxış</span>
        </button>
      </nav>

      {/* Divider */}
      <div className="mx-5 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />

      {/* User block */}
      <div className="p-3 m-2">
        <button
          className="w-full flex items-center gap-3 p-3 rounded-[12px] cursor-pointer group transition-all duration-200"
          style={{ background: 'rgba(255,255,255,0.06)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.10)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
        >
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)', boxShadow: '0 2px 8px rgba(37,99,235,0.4)' }}>
            <span className="text-white text-[11px] font-bold select-none">AD</span>
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-white text-[13px] font-semibold leading-tight truncate">Admin</p>
            <p className="text-white/45 text-[11px] leading-tight truncate">NV Studio</p>
          </div>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center transition-all flex-shrink-0 text-white/40 group-hover:text-[#f87171] group-hover:bg-[#ef4444]/15">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
        </button>
      </div>
    </aside>
  )
}
