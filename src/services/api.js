export const API_BASE = 'https://nv-st-m-qavile-production.up.railway.app'
const BASE = API_BASE

// AgreementStatus enum: 0 = Gözləyən, 1 = Aktiv, 2 = Rədd Edildi
const STATUS_API_TO_UI = {
  0: 'Gözləyən',
  1: 'Aktiv',
  2: 'Rədd Edildi',
  '0': 'Gözləyən',
  '1': 'Aktiv',
  '2': 'Rədd Edildi',
  Gozleyir: 'Gözləyən',
  Aktiv: 'Aktiv',
  Reddedildi: 'Rədd Edildi',
}

// PUT /api/admin/Dashboard/{id}/status expects these string values
const STATUS_UI_TO_API = {
  Aktiv: 'Aktiv',
  'Gözləyən': 'Gozleyir',
  'Rədd Edildi': 'Reddedildi',
}

export function resolveAssetUrl(path) {
  if (!path || typeof path !== 'string') return null
  const trimmed = path.trim()
  if (!trimmed) return null
  if (trimmed.startsWith('data:image') || trimmed.startsWith('data:')) return trimmed
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  if (trimmed.startsWith('/')) return BASE + trimmed
  return `${BASE}/${trimmed}`
}

export function mapItem(item) {
  const signatureUrl = resolveAssetUrl(item.electronicSignature)

  // Format dates
  const formatDate = (isoString) => {
    if (!isoString) return ''
    return new Date(isoString).toLocaleDateString('az-AZ', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const formatDateTime = (isoString) => {
    if (!isoString) return ''
    const d = new Date(isoString)
    return `${d.toLocaleDateString('az-AZ')} ${d.toLocaleTimeString('az-AZ', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`
  }

  return {
    // Core data
    id: item.id,
    
    // Personal info
    firstName: item.firstName || '',
    lastName: item.lastName || '',
    fullName: [item.firstName, item.lastName].filter(Boolean).join(' ') || 'Bilinməyən',
    fatherName: item.fatherName || '',
    
    // Contact info
    fin: item.fin || '',
    phone: item.phone || '',
    email: item.email || '',
    address: item.address || '',
    position: item.position || '',
    
    // Contract info
    contractNumber: item.contractNumber || '',
    acceptedTerms: item.acceptedTerms === true,
    signatureUrl: signatureUrl,
    
    electronicSignature: item.electronicSignature || '',

    status: STATUS_API_TO_UI[item.status] ?? STATUS_API_TO_UI[String(item.status)] ?? 'Gözləyən',
    statusCode: typeof item.status === 'number' ? item.status : Number(item.status),
    
    // Dates
    createdAt: formatDate(item.createdAt),
    createdAtISO: item.createdAt || null,
    createdAtFull: formatDateTime(item.createdAt),
    updatedAt: formatDate(item.updatedAt),
    updatedAtISO: item.updatedAt || null,
    updatedAtFull: formatDateTime(item.updatedAt),
  }
}

export async function fetchAgreements() {
  const res = await fetch(`${BASE}/api/Agreements`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function deleteAgreement(id) {
  const res = await fetch(`${BASE}/api/Agreements/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.text().then(t => t ? JSON.parse(t) : null)
}

export async function updateAgreementStatus(id, statusLabel) {
  const apiStatus = STATUS_UI_TO_API[statusLabel]
  if (!apiStatus) throw new Error(`Invalid status: ${statusLabel}`)

  const res = await fetch(`${BASE}/api/admin/Dashboard/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: apiStatus }),
  })

  if (res.status === 204) return null

  if (!res.ok) {
    const errBody = await res.json().catch(() => null)
    const msg = errBody?.message || errBody?.title || `HTTP ${res.status}`
    throw new Error(msg)
  }

  return res.text().then(t => (t ? JSON.parse(t) : null))
}

export async function fetchAgreementDetails(id) {
  const res = await fetch(`${BASE}/api/Agreements/${id}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function downloadContractFile(id, contractNumber) {
  try {
    const res = await fetch(`${BASE}/api/Agreements/${id}/contract`)
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Müqavilə sənədi mövcud deyil')
      }
      throw new Error(`HTTP ${res.status}`)
    }
    
    const contentType = res.headers.get('content-type') || ''
    let fileUrl = null

    // If response is a PDF blob directly
    if (contentType.includes('application/pdf')) {
      const blob = await res.blob()
      fileUrl = window.URL.createObjectURL(blob)
    }
    // If response is JSON containing a string (URL or path)
    else if (contentType.includes('application/json')) {
      const contractString = await res.json()
      
      if (!contractString) {
        throw new Error('Müqavilə sənədi boş')
      }

      // Check if it's a data URL (base64)
      if (contractString.startsWith('data:') || contractString.startsWith('http')) {
        fileUrl = contractString
      } else {
        fileUrl = resolveAssetUrl(contractString)
      }
    }
    // If response is plain text (unlikely but handle it)
    else {
      const contractString = await res.text()
      if (!contractString) {
        throw new Error('Müqavilə sənədi boş')
      }
      
      if (contractString.startsWith('http')) {
        fileUrl = contractString
      } else if (contractString.startsWith('/')) {
        fileUrl = BASE + contractString
      } else {
        fileUrl = BASE + '/' + contractString
      }
    }

    if (!fileUrl) {
      throw new Error('Müqavilə sənədi yolu alına bilmədi')
    }

    // Create download link
    const a = document.createElement('a')
    a.href = fileUrl
    a.download = `${contractNumber || 'mugavile'}.pdf`
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    
    // Clean up object URL if it was created
    if (fileUrl.startsWith('blob:')) {
      setTimeout(() => window.URL.revokeObjectURL(fileUrl), 100)
    }
  } catch (error) {
    console.error('Contract download failed:', error)
    throw error
  }
}
