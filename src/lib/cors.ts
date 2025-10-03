export function setCors(headers: Headers) {
  const envAllowed = process.env.ALLOWED_ORIGIN || '*';
  const allowed = envAllowed.split(',').map(s => s.trim()).filter(Boolean);
  const allowOrigin = allowed.includes('*') ? '*' : allowed[0] || '*';
  headers.set('Access-Control-Allow-Origin', allowOrigin);
  headers.set('Vary', 'Origin');
  headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
}
