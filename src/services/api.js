const BASE = 'https://nv-st-m-qavile-production.up.railway.app'

const API_TO_UI = { 'Aktiv': 'Aktiv', 'Gozleyir': 'Gözləyən', 'Redd Edildi': 'Rədd Edildi' }
const UI_TO_API = { 'Aktiv': 'Aktiv', 'Gözləyən': 'Gozleyir', 'Rədd Edildi': 'Redd Edildi' }

export function mapItem(item) {
  return {
    id: item.id,
    fullName: [item.firstName, item.lastName].filter(Boolean).join(' '),
    fatherName: item.fatherName || '',
    fin: item.fin || '',
    phone: item.phone || '',
    email: item.email || '',
    address: item.address || '',
    position: item.position || '',
    signature: item.electronicSignature || null,
    contractFile: item.contractFile || null,
    status: API_TO_UI[item.status] ?? item.status,
    date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('az-AZ') : '',
    createdAtISO: item.createdAt || null,
  }
}

export function toApiStatus(uiStatus) {
  return UI_TO_API[uiStatus] ?? uiStatus
}

export async function fetchDashboard() {
  const res = await fetch(`${BASE}/api/admin/Dashboard`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function fetchDashboardById(id) {
  const res = await fetch(`${BASE}/api/admin/Dashboard/${id}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function updateDashboardStatus(id, uiStatus) {
  const res = await fetch(`${BASE}/api/admin/Dashboard/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: toApiStatus(uiStatus) }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.text().then(t => t ? JSON.parse(t) : null)
}

export async function deleteDashboardItem(id) {
  const res = await fetch(`${BASE}/api/admin/Dashboard/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.text().then(t => t ? JSON.parse(t) : null)
}

export async function deleteAllDashboardItems() {
  const res = await fetch(`${BASE}/api/admin/Dashboard/all`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}
