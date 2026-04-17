/**
 * create-breaking-issue.js
 *
 * Reads breaking-updates.json and opens a GitHub issue that lists every
 * package with a detected (or uncertain) breaking change.
 * The issue is labelled `dependencies` + `needs-review` so it can be
 * picked up by a team member or a GitHub Copilot coding agent.
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

const date = new Date().toISOString().split('T')[0];

// ── Build issue body ─────────────────────────────────────────────────────────

let body = `# ⚠️ npm Packages Requiring Manual Review\n\n`;
body += `The **npm update agent** detected the following packages that either contain breaking changes or could not be verified automatically. Please review before updating.\n\n`;
body += `**Detected on:** ${date}\n\n`;
body += `---\n\n`;

for (const u of breakingUpdates) {
  const badge = u.uncertain ? '⚠️ Uncertain' : '🔴 Breaking changes detected';
  body += `## \`${u.package}\` — \`${u.current}\` → \`${u.latest}\` (${u.updateType})\n\n`;
  body += `| Field | Value |\n|---|---|\n`;
  body += `| Status | ${badge} |\n`;
  body += `| Reason | ${u.reason} |\n`;

  if (u.githubUrl) body += `| Release notes | [View on GitHub](${u.githubUrl}) |\n`;
  if (u.npmUrl) body += `| npm page | [View on npm](${u.npmUrl}) |\n`;

  if (u.affectedReleases?.length) {
    const tags = u.affectedReleases.map((r) => `\`${r.tag}\``).join(', ');
    body += `| Versions to review | ${tags} |\n`;
  }

  body += `\n`;
}

body += `---\n\n`;
body += `## ✅ Suggested Action Steps\n\n`;
body += `1. Open the release-notes links above and check for removed APIs or config changes.\n`;
body += `2. If the update is safe, run locally:\n`;
body += `   \`\`\`bash\n   npm install <package>@latest\n   npm run build   # or: hexo generate\n   \`\`\`\n`;
body += `3. Fix any broken code (imports, config keys, deprecated options).\n`;
body += `4. Push a PR and let the CI build verify the result.\n\n`;
body += `---\n`;
body += `> 🤖 This issue was automatically created by the [npm update agent workflow](.github/workflows/npm-update-agent.yml).\n`;

// ── Create the GitHub issue ──────────────────────────────────────────────────

const title = `⚠️ [npm Update Agent] ${breakingUpdates.length} package(s) need manual review (${date})`;

async function createIssue() {
  const [owner, repo] = repoFullName.split('/');

  // Ensure labels exist (best-effort – ignore 422 if already present)
  for (const label of [
    { name: 'dependencies', color: '0075ca', description: 'Pull requests that update a dependency file' },
    { name: 'needs-review', color: 'e4e669', description: 'Requires human or agent review before merging' },
  ]) {
    await fetch(`https://api.github.com/repos/${owner}/${repo}/labels`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(label),
    }).catch(() => {});
  }

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      title,
      body,
      labels: ['dependencies', 'needs-review'],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Failed to create issue:', res.status, err);
    process.exit(1);
  }

  const issue = await res.json();
  console.log(`✅ Issue created: ${issue.html_url}`);
}

function authHeaders() {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  };
}

createIssue().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
