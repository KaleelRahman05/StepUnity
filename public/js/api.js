// public/js/api.js
// Small helper to centralize API requests and include Authorization header when available

const API_BASE = window.API_BASE || window.location.origin + '/api';

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');

  const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const opts = Object.assign({ method: 'GET', headers }, options);

  if (opts.body && typeof opts.body === 'object' && !(opts.body instanceof FormData)) {
    opts.body = JSON.stringify(opts.body);
  }

  const res = await fetch(`${API_BASE}${path}`, opts);

  let data;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) data = await res.json();
  else data = await res.text();

  if (!res.ok) {
    const err = new Error(data && data.message ? data.message : 'API request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

// Export for module consumers
window.apiFetch = apiFetch;

export { apiFetch };
