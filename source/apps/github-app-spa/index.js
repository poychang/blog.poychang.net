import { CLIENT_ID, REDIRECT_URI, AUTH_URL } from './app.config.js';

const out = document.querySelector('#out');

function base64urlencode(arrBuf) {
  const str = btoa(String.fromCharCode(...new Uint8Array(arrBuf)));
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/,'');
}
async function sha256(str) {
  const enc = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return base64urlencode(buf);
}
function randomString(len=64) {
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr, b => ('0'+b.toString(16)).slice(-2)).join('');
}

function save(k,v){ sessionStorage.setItem(k, JSON.stringify(v)); }

async function startLogin() {
  const state = randomString(16);
  const raw = new Uint8Array(32);
  crypto.getRandomValues(raw);
  const code_verifier = base64urlencode(raw.buffer);
  const code_challenge = await sha256(code_verifier);
  save('pkce', { code_verifier, state });

  const url = new URL(AUTH_URL);
  url.searchParams.set('client_id', CLIENT_ID);
  url.searchParams.set('redirect_uri', REDIRECT_URI);
  url.searchParams.set('state', state);
  url.searchParams.set('code_challenge', code_challenge);
  url.searchParams.set('code_challenge_method', 'S256');
  location.href = url.toString();
}

document.querySelector('#login').addEventListener('click', startLogin);
