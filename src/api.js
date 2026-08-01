// Backend bilan ishlash — barcha soʻrovlar shu yerdan.
const TOKEN_KEY = 'gf_admin_token'

export const getToken = () => localStorage.getItem(TOKEN_KEY) || ''
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

async function req(url, { method = 'GET', body, auth = false, isForm = false } = {}) {
  const headers = {}
  if (auth) headers.Authorization = 'Bearer ' + getToken()
  if (body && !isForm) headers['Content-Type'] = 'application/json'
  const res = await fetch(url, {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Xatolik yuz berdi')
  return data
}

export const api = {
  login: (email, password) => req('/api/login', { method: 'POST', body: { email, password } }),
  stats: () => req('/api/stats', { auth: true }),

  getPartners: () => req('/api/partners'),
  addPartner: (form) => req('/api/partners', { method: 'POST', auth: true, isForm: true, body: form }),
  delPartner: (id) => req('/api/partners/' + id, { method: 'DELETE', auth: true }),

  getNews: () => req('/api/news'),
  addNews: (form) => req('/api/news', { method: 'POST', auth: true, isForm: true, body: form }),
  delNews: (id) => req('/api/news/' + id, { method: 'DELETE', auth: true }),

  getBranches: () => req('/api/branches'),
  addBranch: (form) => req('/api/branches', { method: 'POST', auth: true, isForm: true, body: form }),
  editBranch: (id, form) => req('/api/branches/' + id, { method: 'PUT', auth: true, isForm: true, body: form }),
  delBranch: (id) => req('/api/branches/' + id, { method: 'DELETE', auth: true }),

  // Statik (data.js) filiallar ustamasi — tahrirlash / yashirish / tiklash
  getOverrides: () => req('/api/branch-overrides'),
  saveOverride: (branchId, form) => req('/api/branch-overrides/' + branchId, { method: 'PUT', auth: true, isForm: true, body: form }),
  hideBranch: (branchId) => req('/api/branch-overrides/' + branchId + '/hide', { method: 'POST', auth: true }),
  restoreBranch: (branchId) => req('/api/branch-overrides/' + branchId + '/restore', { method: 'POST', auth: true }),
}

// Tashrifni belgilash — brauzerga bir marta ID beriladi (unikal tashrifchi uchun)
export function trackVisit() {
  try {
    let vid = localStorage.getItem('gf_vid')
    if (!vid) {
      vid = (crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(16).slice(2))
      localStorage.setItem('gf_vid', vid)
    }
    fetch('/api/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId: vid }),
    }).catch(() => {})
  } catch {}
}
