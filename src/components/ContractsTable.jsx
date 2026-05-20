import { useState, useEffect, useRef } from 'react'

const STATUS_CFG = {
  'Aktiv':       { bg: '#f0fdf4', text: '#15803d', border: '#86efac', dot: '#22c55e' },
  'Gözləyən':    { bg: '#fffbeb', text: '#92400e', border: '#fcd34d', dot: '#f59e0b' },
  'Rədd Edildi': { bg: '#fff1f2', text: '#9f1239', border: '#fda4af', dot: '#ef4444' },
}

/* Inline status badge with change dropdown */
function StatusCell({ status, rowId, onStatusChange }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const btnRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    document.addEventListener('click', close)
    window.addEventListener('scroll', close, true)
    return () => { document.removeEventListener('click', close); window.removeEventListener('scroll', close, true) }
  }, [open])

  const handleOpen = (e) => {
    e.stopPropagation()
    if (open) { setOpen(false); return }
    const r = btnRef.current.getBoundingClientRect()
    setPos({ top: r.bottom + 5, left: r.left })
    setOpen(true)
  }

  const c = STATUS_CFG[status] || STATUS_CFG['Gözləyən']
  const others = Object.keys(STATUS_CFG).filter(s => s !== status)

  return (
    <>
      <button ref={btnRef} onClick={handleOpen}
        className="inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-full text-[11.5px] font-semibold
          whitespace-nowrap cursor-pointer transition-all hover:brightness-95 active:scale-95 select-none"
        style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
        <span className="w-[7px] h-[7px] rounded-full flex-shrink-0" style={{ background: c.dot }} />
        {status}
        <svg className="w-[11px] h-[11px] opacity-50 ml-0.5" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 300,
            boxShadow: '0 10px 32px rgba(0,26,92,0.14)', border: '1px solid #e2e8f0' }}
          className="bg-white rounded-[12px] w-44 py-2 overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest px-3.5 pb-1.5">
            Status dəyiş
          </p>
          {others.map(opt => {
            const oc = STATUS_CFG[opt]
            return (
              <button key={opt}
                onClick={() => { onStatusChange(rowId, opt); setOpen(false) }}
                className="w-full flex items-center gap-3 px-3.5 py-2 hover:bg-[#f8fafc] transition-colors">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-[4px] rounded-full text-[11px] font-semibold"
                  style={{ background: oc.bg, color: oc.text, border: `1px solid ${oc.border}` }}>
                  <span className="w-[6px] h-[6px] rounded-full" style={{ background: oc.dot }} />
                  {opt}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </>
  )
}

function PdfIcon() {
  return (
    <svg width="15" height="17" viewBox="0 0 15 17" fill="none" className="flex-shrink-0">
      <rect x="0.5" y="0.5" width="10" height="16" rx="1.5" fill="#fee2e2" stroke="#ef4444" strokeWidth="1"/>
      <path d="M7.5 0.5V4.5H11" stroke="#ef4444" strokeWidth="1" strokeLinecap="round"/>
      <rect x="2.5" y="8.5" width="10" height="8" rx="1.5" fill="#ef4444"/>
      <text x="5" y="15" fontSize="4.2" fill="white" fontWeight="900" fontFamily="Arial,sans-serif">PDF</text>
    </svg>
  )
}

function getPaginationItems(current, total) {
  if (total <= 0) return []
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const items = [1]
  if (current > 3) items.push('...')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) items.push(i)
  if (current < total - 2) items.push('...')
  if (total > 1) items.push(total)
  return items
}

export default function ContractsTable({
  data, totalCount, currentPage, totalPages, rowsPerPage,
  activeFilter, onPageChange, onRowsPerPageChange, onFilterChange,
  onStatusChange, onDeleteRequest,
}) {
  const [filterOpen, setFilterOpen] = useState(false)
  const [pendingFilter, setPendingFilter] = useState(activeFilter)
  const [menuCtx, setMenuCtx] = useState(null)
  const filterRef = useRef(null)

  useEffect(() => { setPendingFilter(activeFilter) }, [activeFilter])

  useEffect(() => {
    if (!filterOpen) return
    const h = e => { if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [filterOpen])

  useEffect(() => {
    if (!menuCtx) return
    const close = () => setMenuCtx(null)
    document.addEventListener('click', close)
    window.addEventListener('scroll', close, true)
    return () => { document.removeEventListener('click', close); window.removeEventListener('scroll', close, true) }
  }, [menuCtx])

  const handleMenuOpen = (e, row) => {
    e.stopPropagation()
    if (menuCtx?.id === row.id) { setMenuCtx(null); return }
    const r = e.currentTarget.getBoundingClientRect()
    setMenuCtx({ id: row.id, name: row.fullName, status: row.status, top: r.bottom + 5, right: window.innerWidth - r.right })
  }

  const pages = getPaginationItems(currentPage, totalPages)
  const isFilterActive = activeFilter !== 'Hamısı'

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#e8edf5]"
      style={{ boxShadow: '0 2px 12px rgba(0,26,92,0.06)' }}>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#f1f5f9]">
        <div>
          <h2 className="text-[17px] font-bold text-[#0f172a] tracking-tight">Müqavilə Siyahısı</h2>
          <p className="text-[12px] text-[#94a3b8] mt-0.5 font-medium">Cəmi {totalCount} müqavilə</p>
        </div>
        <div className="flex items-center gap-2.5">
          {isFilterActive && (
            <button onClick={() => onFilterChange('Hamısı')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-[#ef4444]
                bg-[#fff1f2] border border-[#fda4af] rounded-lg hover:bg-[#fee2e2] transition-colors">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Filtri sıfırla
            </button>
          )}
          <div className="relative" ref={filterRef}>
            <button onClick={() => setFilterOpen(v => !v)}
              className={`flex items-center gap-2 px-4 py-[9px] text-[13px] font-semibold border rounded-[10px]
                bg-white transition-all relative
                ${filterOpen || isFilterActive
                  ? 'border-[#001A5C] text-[#001A5C] bg-[#f0f4ff]'
                  : 'border-[#e2e8f0] text-[#374151] hover:border-[#001A5C] hover:text-[#001A5C]'}`}>
              <svg className="w-[14px] h-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              Filtr
              {isFilterActive && (
                <span className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] bg-[#001A5C] text-white
                  text-[9px] rounded-full flex items-center justify-center font-bold border-2 border-white">1</span>
              )}
            </button>
            {filterOpen && (
              <div className="absolute right-0 top-full mt-2 w-[196px] bg-white border border-[#e2e8f0]
                rounded-[14px] py-3 px-1 z-50"
                style={{ boxShadow: '0 8px 24px rgba(0,26,92,0.12)' }}>
                <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest px-3 pb-2">
                  Statusa görə
                </p>
                {['Hamısı', 'Aktiv', 'Gözləyən', 'Rədd Edildi'].map(opt => (
                  <button key={opt} onClick={() => setPendingFilter(opt)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-[8px] transition-all
                      ${pendingFilter === opt ? 'bg-[#f0f4ff]' : 'hover:bg-[#f8fafc]'}`}>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                      ${pendingFilter === opt ? 'border-[#001A5C] bg-[#001A5C]' : 'border-[#cbd5e1]'}`}>
                      {pendingFilter === opt && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className={`text-[13px] font-medium ${pendingFilter === opt ? 'text-[#001A5C]' : 'text-[#475569]'}`}>
                      {opt}
                    </span>
                  </button>
                ))}
                <div className="px-3 pt-2">
                  <button onClick={() => { onFilterChange(pendingFilter); setFilterOpen(false) }}
                    className="w-full py-[9px] bg-[#001A5C] text-white text-[13px] font-semibold
                      rounded-[8px] hover:bg-[#002580] transition-colors">
                    Tətbiq et
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table — no horizontal scroll, fixed layout fills 100% */}
      <div className="w-full overflow-x-hidden">
        <table className="w-full" style={{ tableLayout: 'fixed', borderCollapse: 'collapse' }}>
          <colgroup>
            <col style={{ width: '13%' }} />  {/* Ad Soyad */}
            <col style={{ width: '7%' }} />   {/* Ata Adı */}
            <col style={{ width: '8%' }} />   {/* FİN */}
            <col style={{ width: '9%' }} />   {/* Telefon */}
            <col style={{ width: '13%' }} />  {/* Email */}
            <col style={{ width: '9%' }} />   {/* Ünvan */}
            <col style={{ width: '10%' }} />  {/* Vəzifə */}
            <col style={{ width: '10%' }} />  {/* Elektron İmza */}
            <col style={{ width: '11%' }} />  {/* Müqavilə Adı */}
            <col style={{ width: '8%' }} />   {/* Status */}
            <col style={{ width: '3%' }} />   {/* Actions */}
          </colgroup>
          <thead>
            <tr style={{ background: 'linear-gradient(180deg,#f8fafc 0%,#f1f5f9 100%)' }}
              className="border-b border-[#e8edf5]">
              {['Ad Soyad','Ata Adı','FİN','Telefon Nömrəsi','Email','Ünvan','Vəzifə','Elektron İmza','Müqavilə Adı','Status',''].map((h,i) => (
                <th key={i} className="text-left px-3 py-3 text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.08em] whitespace-nowrap overflow-hidden">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center py-16">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-[#f1f5f9] flex items-center justify-center">
                      <svg className="w-7 h-7 text-[#cbd5e1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <p className="text-[14px] font-semibold text-[#94a3b8]">Heç bir müqavilə tapılmadı</p>
                    <p className="text-[12px] text-[#b0bec5]">Axtarış parametrlərini dəyişdirin</p>
                  </div>
                </td>
              </tr>
            ) : data.map(row => (
              <tr key={row.id} className="border-b border-[#f8fafc] hover:bg-[#fafbff] transition-colors group">

                {/* Ad Soyad */}
                <td className="px-3 py-3.5 overflow-hidden">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold"
                      style={{ background: `hsl(${(row.id * 53) % 360},60%,45%)` }}>
                      {row.fullName.slice(0,1)}
                    </div>
                    <span className="text-[13px] font-semibold text-[#0f172a] truncate">{row.fullName}</span>
                  </div>
                </td>

                {/* Ata Adı */}
                <td className="px-3 py-3.5 overflow-hidden">
                  <span className="text-[12.5px] text-[#64748b] truncate block">{row.fatherName}</span>
                </td>

                {/* FİN */}
                <td className="px-3 py-3.5 overflow-hidden">
                  <span className="text-[11.5px] font-mono text-[#475569] bg-[#f8fafc] px-1.5 py-0.5
                    rounded-md border border-[#e8edf5] tracking-wide whitespace-nowrap">
                    {row.fin}
                  </span>
                </td>

                {/* Telefon */}
                <td className="px-3 py-3.5 overflow-hidden">
                  <span className="text-[12.5px] text-[#475569] truncate block">{row.phone}</span>
                </td>

                {/* Email */}
                <td className="px-3 py-3.5 overflow-hidden">
                  <span className="text-[12.5px] text-[#475569] truncate block" title={row.email}>{row.email}</span>
                </td>

                {/* Ünvan */}
                <td className="px-3 py-3.5 overflow-hidden">
                  <span className="text-[12.5px] text-[#475569] truncate block">{row.address}</span>
                </td>

                {/* Vəzifə */}
                <td className="px-3 py-3.5 overflow-hidden">
                  <span className="text-[12.5px] text-[#475569] truncate block">{row.position}</span>
                </td>

                {/* Elektron İmza */}
                <td className="px-3 py-3.5">
                  {row.signature && (
                    <div className="h-9 border border-[#e2e8f0] rounded-lg bg-white flex items-center justify-center shadow-sm px-2 overflow-hidden">
                      {row.signature.startsWith('data:image') ? (
                        <img src={row.signature} alt="imza" className="max-h-full max-w-full object-contain" />
                      ) : (
                        <span className="text-[11px] text-[#334155] font-medium italic truncate"
                          style={{ fontFamily: 'Georgia, serif' }}>
                          {row.signature}
                        </span>
                      )}
                    </div>
                  )}
                </td>

                {/* Müqavilə Adı */}
                <td className="px-3 py-3.5 overflow-hidden">
                  <button className="flex items-center gap-1.5 group/pdf min-w-0 w-full"
                    onClick={() => {
                      const a = document.createElement('a')
                      a.href = '/NV_Studio_Tecrube_Muqavilesi.pdf'
                      a.download = 'işçimuqavilesi.pdf'
                      a.click()
                    }}>
                    <PdfIcon />
                    <span className="text-[11.5px] text-[#3b82f6] group-hover/pdf:underline truncate font-medium">
                      işçimuqavilesi.pdf
                    </span>
                  </button>
                </td>

                {/* Status — inline clickable */}
                <td className="px-3 py-3.5">
                  <StatusCell status={row.status} rowId={row.id} onStatusChange={onStatusChange} />
                </td>

                {/* Actions */}
                <td className="px-1 py-3.5 text-center">
                  <button onClick={e => handleMenuOpen(e, row)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-[#94a3b8]
                      hover:bg-[#e8edf5] hover:text-[#475569] transition-all mx-auto">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-[#f1f5f9] bg-[#fafbfc]">
        <div className="flex items-center gap-2 text-[12.5px] text-[#64748b]">
          <span>Səhifədə</span>
          <select value={rowsPerPage} onChange={e => onRowsPerPageChange(Number(e.target.value))}
            className="border border-[#e2e8f0] rounded-[8px] px-2 py-1.5 text-[12.5px] text-[#0f172a]
              outline-none focus:border-[#001A5C] cursor-pointer bg-white transition-colors font-medium">
            {[5, 10, 15, 20, 25].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <span>sətir</span>
          <span className="text-[#b0bec5]">·</span>
          <span className="text-[#94a3b8]">
            {Math.min((currentPage-1)*rowsPerPage+1, totalCount)}–{Math.min(currentPage*rowsPerPage, totalCount)} / {totalCount}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onPageChange(currentPage-1)} disabled={currentPage<=1}
            className="w-8 h-8 flex items-center justify-center rounded-[8px] border border-[#e2e8f0]
              text-[#64748b] hover:bg-white hover:border-[#001A5C] hover:text-[#001A5C]
              disabled:opacity-35 disabled:cursor-not-allowed transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          {pages.map((p,i) =>
            p==='...' ? (
              <span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-[#94a3b8] text-[13px]">…</span>
            ) : (
              <button key={p} onClick={() => onPageChange(p)}
                className={`w-8 h-8 flex items-center justify-center rounded-[8px] text-[13px] font-semibold transition-all
                  ${currentPage===p
                    ? 'bg-[#001A5C] text-white shadow-md'
                    : 'border border-[#e2e8f0] text-[#64748b] hover:bg-white hover:border-[#001A5C] hover:text-[#001A5C]'}`}>
                {p}
              </button>
            )
          )}
          <button onClick={() => onPageChange(currentPage+1)}
            disabled={currentPage>=totalPages||totalPages===0}
            className="w-8 h-8 flex items-center justify-center rounded-[8px] border border-[#e2e8f0]
              text-[#64748b] hover:bg-white hover:border-[#001A5C] hover:text-[#001A5C]
              disabled:opacity-35 disabled:cursor-not-allowed transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

      {/* 3-dot context menu */}
      {menuCtx && (
        <div
          style={{ position:'fixed', top:menuCtx.top, right:menuCtx.right, zIndex:300,
            boxShadow:'0 8px 30px rgba(0,26,92,0.15)', border:'1px solid #e8edf5' }}
          className="bg-white rounded-[12px] w-44 py-1.5 overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="px-3.5 py-1.5 border-b border-[#f1f5f9] mb-1">
            <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider truncate">{menuCtx.name}</p>
          </div>
          {menuCtx.status !== 'Aktiv' && (
            <button onClick={() => { onStatusChange(menuCtx.id,'Aktiv'); setMenuCtx(null) }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-[#374151]
                hover:bg-[#f0fdf4] hover:text-[#15803d] transition-colors text-left font-medium">
              <span className="text-[#22c55e] text-base">↻</span> Aktiv et
            </button>
          )}
          <button onClick={() => { onStatusChange(menuCtx.id,'Gözləyən'); setMenuCtx(null) }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-[#374151]
              hover:bg-[#fffbeb] hover:text-[#92400e] transition-colors text-left font-medium">
            <span>⏳</span> Gözləməyə al
          </button>
          <button onClick={() => { onStatusChange(menuCtx.id,'Rədd Edildi'); setMenuCtx(null) }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-[#374151]
              hover:bg-[#fff1f2] hover:text-[#9f1239] transition-colors text-left font-medium">
            <span className="text-[#ef4444] font-bold">✕</span> Rədd et
          </button>
          <div className="border-t border-[#f1f5f9] my-1"/>
          <button onClick={() => { onDeleteRequest(menuCtx.id,menuCtx.name); setMenuCtx(null) }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-[#dc2626]
              hover:bg-[#fff1f2] transition-colors text-left font-medium">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
            Sil
          </button>
        </div>
      )}
    </div>
  )
}
