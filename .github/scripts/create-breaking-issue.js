/**
 * create-breaking-issue.js
 *
 * Reads breaking-updates.json and creates one GitHub issue **per package**
 * that has a detected (or uncertain) breaking change.
 *
 * Each issue is labelled with `copilot` so that GitHub Copilot coding agent
 * automatically picks it up, attempts the upgrade, fixes build errors,
 * and opens a PR.
 */

'use strict';

const fs = require('fs');

const breakingUpdates = JSON.parse(fs.readFileSync('breaking-updates.json', 'utf8'));

if (breakingUpdates.length === 0) {
  console.log('No breaking updates to report.');
  process.exit(0);
}

const token = process.env.GITHUB_TOKEN;
const repoFullName = process.env.GITHUB_REPOSITORY; // e.g. "owner/repo"

if (!token || !repoFullName) {
  console.error('GITHUB_TOKEN and GITHUB_REPOSITORY must be set.');
  process.exit(1);
}

const [owner, repo] = repoFullName.split('/');
const date = new Date().toISOString().split('T')[0];

// ── Helpers ──────────────────────────────────────────────────────────────────

function authHeaders() {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  };
}

async function ensureLabels() {
  const labels = [
    { name: 'dependencies', color: '0075ca', description: 'Pull requests that update a dependency file' },
    { name: 'copilot', color: '6f42c1', description: 'Assigned to GitHub Copilot coding agent' },
  ];
  for (const label of labels) {
    await fetch(`https://api.github.com/repos/${owner}/${repo}/labels`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(label),
    }).catch(() => {});
  }
}

async function findExistingIssue(packageName) {
  const q = `repo:${owner}/${repo} is:issue is:open in:title "[npm Update Agent] Update ${packageName}"`;
  const res = await fetch(
    `https://api.github.com/search/issues?q=${encodeURIComponent(q)}&per_page=1`,
    { headers: authHeaders() },
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.items?.[0] || null;
}

// ── Build issue body for a single package ────────────────────────────────────

function buildIssueBody(u) {
  const badge = u.uncertain ? '⚠️ Uncertain (changelog unavailable)' : '🔴 Breaking changes detected';
  const releaseLinks = u.githubUrl ? `[Release notes](${u.githubUrl})` : '';
  const npmLink = u.npmUrl ? `[npm page](${u.npmUrl})` : '';
  const refs = [releaseLinks, npmLink].filter(Boolean).join(' · ');

  let body = '';
  body += `## Context\n\n`;
  body += `The **npm update agent** workflow detected that \`${u.package}\` needs a **${u.updateType}** version update.\n\n`;
  body += `| Field | Value |\n|---|---|\n`;
  body += `| Package | \`${u.package}\` |\n`;
  body += `| Current version | \`${u.current}\` |\n`;
  body += `| Latest version | \`${u.latest}\` |\n`;
  body += `| Update type | ${u.updateType} |\n`;
  body += `| Status | ${badge} |\n`;
  body += `| Reason | ${u.reason} |\n`;
  if (refs) body += `| References | ${refs} |\n`;

  if (u.affectedReleases?.length) {
    body += `\n### Relevant releases\n\n`;
    for (const r of u.affectedReleases) {
      body += `- \`${r.tag}\` — ${r.title || '(no title)'}\n`;
    }
  }

  body += `\n---\n\n`;
  body += `## Task for Copilot\n\n`;
  body += `Please perform the following steps:\n\n`;
  body += `1. **Update the package** — run:\n`;
  body += `   \`\`\`bash\n   npm install ${u.package}@latest\n   \`\`\`\n`;
  body += `2. **Build the site** — run:\n`;
  body += `   \`\`\`bash\n   npx hexo generate\n   \`\`\`\n`;
  body += `3. **If the build fails**, read the error messages and the release notes linked above, `;
  body += `then fix any breaking changes in the source code. Common fixes include:\n`;
  body += `   - Updating renamed/removed API calls or imports\n`;
  body += `   - Adjusting configuration keys in \`_config.yml\` or \`_config.cactus.yml\`\n`;
  body += `   - Replacing deprecated plugin options\n`;
  body += `4. **Repeat steps 2–3** until \`npx hexo generate\` succeeds.\n`;
  body += `5. Commit all changes (\`package.json\`, \`package-lock.json\`, and any source fixes).\n\n`;
  body += `> ⚠️ Do NOT modify content files under \`source/_posts/\` unless a breaking change directly affects markdown rendering.\n\n`;
  body += `---\n`;
  body += `> 🤖 This issue was automatically created by the [npm update agent workflow](.github/workflows/npm-update-agent.yml) on ${date}.\n`;

  return body;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  await ensureLabels();

  let created = 0;
  let skipped = 0;

  for (const u of breakingUpdates) {
    const title = `⬆️ [npm Update Agent] Update \`${u.package}\` from ${u.current} to ${u.latest}`;

    // Skip if an open issue already exists for this package
    const existing = await findExistingIssue(u.package);
    if (existing) {
      console.log(`⏭️  Issue already exists for ${u.package}: ${existing.html_url}`);
      skipped++;
      continue;
    }

    const body = buildIssueBody(u);

    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        title,
        body,
        labels: ['dependencies', 'copilot'],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`❌ Failed to create issue for ${u.package}:`, res.status, err);
      continue;
    }

    const issue = await res.json();
    console.log(`✅ Issue created for ${u.package}: ${issue.html_url}`);
    created++;
  }

  console.log(`\n📋 Summary: ${created} issue(s) created, ${skipped} skipped (already open).`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
