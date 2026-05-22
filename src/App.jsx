import { useState, useEffect, useMemo } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import StatsCards from './components/StatsCards'
import ContractsTable from './components/ContractsTable'
import DeleteModal from './components/DeleteModal'
import { fetchAgreements, updateAgreementStatus, deleteAgreement, mapItem } from './services/api'

function dedupeAgreements(items) {
  const seen = new Set()
  return items.filter(item => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
}

export default function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('Hamısı')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: '' })

  useEffect(() => {
    fetchAgreements()
      .then(items => {
        const cleaned = Array.isArray(items) ? dedupeAgreements(items) : []
        setData(cleaned.map(mapItem))
        setLoading(false)
      })
      .catch(() => {
        setError('Məlumat yüklənərkən xəta baş verdi')
        setLoading(false)
      })
  }, [])

  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return data.filter(item => {
      const matchesSearch = !q ||
        String(item.id).includes(q) ||
        item.fullName.toLowerCase().includes(q) ||
        item.firstName.toLowerCase().includes(q) ||
        item.lastName.toLowerCase().includes(q) ||
        item.fatherName.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.fin.toLowerCase().includes(q) ||
        item.contractNumber.toLowerCase().includes(q) ||
        item.position.toLowerCase().includes(q) ||
        item.address.toLowerCase().includes(q) ||
        (item.electronicSignature || '').toLowerCase().includes(q) ||
        item.phone.replace(/\s/g, '').includes(q.replace(/\s/g, ''))
      const matchesFilter = activeFilter === 'Hamısı' || item.status === activeFilter
      return matchesSearch && matchesFilter
    })
  }, [data, searchQuery, activeFilter])

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage))

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    return filteredData.slice(start, start + rowsPerPage)
  }, [filteredData, currentPage, rowsPerPage])

  const handleFilterChange = (filter) => { setActiveFilter(filter); setCurrentPage(1) }
  const handleRowsPerPageChange = (n) => { setRowsPerPage(n); setCurrentPage(1) }

  const handleStatusChange = async (id, newStatus) => {
    const labels = { Aktiv: 'aktivləşdirildi', 'Gözləyən': 'gözləməyə alındı', 'Rədd Edildi': 'rədd edildi' }
    const snapshot = data
    const statusCodeMap = { Aktiv: 1, 'Gözləyən': 0, 'Rədd Edildi': 2 }
    setData(prev => prev.map(item => item.id === id
      ? { ...item, status: newStatus, statusCode: statusCodeMap[newStatus] ?? item.statusCode }
      : item))
    try {
      await updateAgreementStatus(id, newStatus)
      toast.success(`Müqavilə ${labels[newStatus]}`, { duration: 2800 })
    } catch (err) {
      setData(snapshot)
      toast.error(err.message || 'Status dəyişdirilmədi. Yenidən cəhd edin.', { duration: 3500 })
    }
  }

  const handleDeleteRequest = (id, name) => setDeleteModal({ open: true, id, name })

  const handleDeleteConfirm = async () => {
    const snapshot = data
    const deletingId = deleteModal.id
    setData(prev => prev.filter(item => item.id !== deletingId))
    const remaining = filteredData.length - 1
    const newTotal = Math.max(1, Math.ceil(remaining / rowsPerPage))
    if (currentPage > newTotal) setCurrentPage(newTotal)
    setDeleteModal({ open: false, id: null, name: '' })
    
    try {
      await deleteAgreement(deletingId)
      toast.success('Müqavilə silindi', { duration: 2800 })
    } catch {
      setData(snapshot)
      toast.error('Müqavilə silinmədi. Yenidən cəhd edin.', { duration: 2800 })
      setDeleteModal({ open: true, id: deletingId, name: deleteModal.name })
    }
  }

  const stats = useMemo(() => {
    const total = data.length
    const active = data.filter(i => i.status === 'Aktiv').length
    const rejected = data.filter(i => i.status === 'Rədd Edildi').length
    const pending = data.filter(i => i.status === 'Gözləyən').length

    // month keys like '2026-5'
    const now = new Date()
    const thisKey = `${now.getFullYear()}-${now.getMonth() + 1}`
    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1)
    const prevKey = `${prevDate.getFullYear()}-${prevDate.getMonth() + 1}`

    function monthKey(iso) {
      if (!iso) return null
      const d = new Date(iso)
      return `${d.getFullYear()}-${d.getMonth() + 1}`
    }

    const counts = {
      totalCurr: 0, totalPrev: 0,
      activeCurr: 0, activePrev: 0,
      rejectedCurr: 0, rejectedPrev: 0,
      pendingCurr: 0, pendingPrev: 0,
    }

    data.forEach(item => {
      const key = monthKey(item.createdAtISO)
      if (!key) return
      if (key === thisKey) {
        counts.totalCurr++
        if (item.status === 'Aktiv') counts.activeCurr++
        if (item.status === 'Rədd Edildi') counts.rejectedCurr++
        if (item.status === 'Gözləyən') counts.pendingCurr++
      }
      if (key === prevKey) {
        counts.totalPrev++
        if (item.status === 'Aktiv') counts.activePrev++
        if (item.status === 'Rədd Edildi') counts.rejectedPrev++
        if (item.status === 'Gözləyən') counts.pendingPrev++
      }
    })

    function pct(curr, prev) {
      if (prev === 0) return curr === 0 ? 0 : 100
      return Math.round(((curr - prev) / prev) * 100)
    }

    return {
      total, active, rejected, pending,
      changes: {
        total: pct(counts.totalCurr, counts.totalPrev),
        active: pct(counts.activeCurr, counts.activePrev),
        rejected: pct(counts.rejectedCurr, counts.rejectedPrev),
        pending: pct(counts.pendingCurr, counts.pendingPrev),
      }
    }
  }, [data])

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f0f4fb' }}>
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          searchQuery={searchQuery}
          onSearchChange={v => { setSearchQuery(v); setCurrentPage(1) }}
        />
        <main className="flex-1 p-6 space-y-5 overflow-y-auto">
          <StatsCards stats={stats} />

          {loading ? (
            <div className="bg-white rounded-2xl border border-[#e8edf5] flex items-center justify-center py-24"
              style={{ boxShadow: '0 2px 12px rgba(0,26,92,0.06)' }}>
              <div className="flex flex-col items-center gap-4">
                <svg className="w-10 h-10 animate-spin text-[#001A5C] opacity-60" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                  <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <p className="text-[13px] font-medium text-[#94a3b8]">Müqavilələr yüklənir…</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-white rounded-2xl border border-[#fda4af] flex items-center justify-center py-20"
              style={{ boxShadow: '0 2px 12px rgba(0,26,92,0.06)' }}>
              <div className="flex flex-col items-center gap-3 text-center px-6">
                <div className="w-12 h-12 rounded-full bg-[#fff1f2] flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#ef4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                </div>
                <p className="text-[14px] font-semibold text-[#0f172a]">{error}</p>
                <button
                  onClick={() => { setError(null); setLoading(true); fetchAgreements().then(items => { const cleaned = Array.isArray(items) ? dedupeAgreements(items) : []; setData(cleaned.map(mapItem)); setLoading(false) }).catch(() => { setError('Məlumat yüklənərkən xəta baş verdi'); setLoading(false) }) }}
                  className="mt-1 px-5 py-2 bg-[#001A5C] text-white text-[13px] font-semibold rounded-[10px] hover:bg-[#002580] transition-colors">
                  Yenidən cəhd et
                </button>
              </div>
            </div>
          ) : (
            <ContractsTable
              data={paginatedData}
              totalCount={filteredData.length}
              currentPage={currentPage}
              totalPages={totalPages}
              rowsPerPage={rowsPerPage}
              activeFilter={activeFilter}
              onPageChange={setCurrentPage}
              onRowsPerPageChange={handleRowsPerPageChange}
              onFilterChange={handleFilterChange}
              onStatusChange={handleStatusChange}
              onDeleteRequest={handleDeleteRequest}
            />
          )}
        </main>
      </div>

      {deleteModal.open && (
        <DeleteModal
          name={deleteModal.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteModal({ open: false, id: null, name: '' })}
        />
      )}

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontSize: '13px',
            borderRadius: '12px',
            padding: '10px 16px',
            boxShadow: '0 8px 24px rgba(0,26,92,0.12)',
            border: '1px solid #e8edf5',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </div>
  )
}
