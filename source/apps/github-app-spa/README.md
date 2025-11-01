# GitHub App SPA + PKCE — External JS/CSS + Strict CSP (for GitHub Pages)

This version externalizes all JS/CSS and applies a **strict Content-Security-Policy** via `<meta http-equiv>`,
so it works on **GitHub Pages** (which doesn't let you set response headers).

## What changed vs the previous ZIP
- All inline `<script>`/`<style>` moved to **`index.js` / `callback.js` / `styles.css`**
- Strict CSP added to **both** HTML pages:
  ```
  default-src 'none';
  script-src 'self';
  style-src 'self';
  img-src 'self' data:;
  connect-src https://api.github.com https://github.com;
  form-action https://github.com;
  frame-ancestors 'none';
  base-uri 'none';
  manifest-src 'self';
  upgrade-insecure-requests;
  block-all-mixed-content
  ```

## Configure
Edit `app.config.js`:
```js
export const CLIENT_ID = "GITHUB_APP_CLIENT_ID";
export const REDIRECT_URI = "https://<user>.github.io/github-app-spa/callback.html";
```

## Deploy
Push to a public repo and enable **GitHub Pages**. Open `/index.html` to start login.
