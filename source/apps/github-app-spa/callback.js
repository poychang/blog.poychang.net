import { CLIENT_ID, REDIRECT_URI, TOKEN_URL, API_URL } from './app.config.js';

const out = document.querySelector('#out');
const statusEl = document.querySelector('#status');

function load(k){ const v=sessionStorage.getItem(k); return v?JSON.parse(v):null; }
function del(k){ sessionStorage.removeItem(k); }

async function ghFetch(token, path, init={}) {
  const res = await fetch(API_URL + path, {
    ...init,
    headers: {
      ...(init.headers||{}),
      'Authorization': 'Bearer ' + token.access_token,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    }
  });
  return res;
}

async function exchange(code, code_verifier) {
  const r = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier
    })
  });
  if (!r.ok) throw new Error('Token exchange failed: ' + r.status);
  return r.json();
}

async function refresh(token) {
  const r = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      grant_type: 'refresh_token',
      refresh_token: token.refresh_token
    })
  });
  if (!r.ok) throw new Error('Refresh failed: ' + r.status);
  return r.json();
}

(async function main(){
  const params = new URLSearchParams(location.search);
  const code = params.get('code');
  const state = params.get('state');
  const pkce = load('pkce');
  if (!code || !pkce || state !== pkce.state) {
    statusEl.textContent = 'Missing code or PKCE state mismatch.';
    return;
  }
  try {
    const token = await exchange(code, pkce.code_verifier);
    del('pkce');
    statusEl.textContent = 'Signed in. Calling GitHub API...';

    let meRes = await ghFetch(token, '/user');
    if (meRes.status === 401) {
      const newTok = await refresh(token);
      token.access_token = newTok.access_token;
      token.refresh_token = newTok.refresh_token;
      meRes = await ghFetch(token, '/user');
    }
    const me = await meRes.json();

    const reposRes = await ghFetch(token, '/user/repos?per_page=10&sort=updated');
    const repos = await reposRes.json();

    out.textContent = [
      `Hello, ${me.login}!`,
      `First 10 repos:`,
      ...(Array.isArray(repos) ? repos.map(r => `- ${r.full_name}`) : [JSON.stringify(repos, null, 2)])
    ].join('\n');
  } catch (err) {
    statusEl.textContent = 'Error';
    out.textContent = String(err);
  }
})();
