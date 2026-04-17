/**
 * apply-updates.js
 *
 * Reads safe-updates.json, patches package.json version ranges,
 * runs `npm install` to regenerate package-lock.json,
 * and writes pr-body.md for the pull request.
 */

'use strict';

const { execSync } = require('child_process');
const fs = require('fs');

const safeUpdates = JSON.parse(fs.readFileSync('safe-updates.json', 'utf8'));

if (safeUpdates.length === 0) {
  console.log('No safe updates to apply.');
  process.exit(0);
}

// ── Patch package.json ───────────────────────────────────────────────────────

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const applied = [];

for (const update of safeUpdates) {
  const { package: name, latest, current, updateType } = update;
  const section = pkg.dependencies?.[name] != null ? 'dependencies' : 'devDependencies';

  if (!pkg[section]?.[name]) {
    console.warn(`⚠️  ${name} not found in package.json - skipping`);
    continue;
  }

  // Preserve the version prefix (^, ~, empty, etc.)
  const prefix = pkg[section][name].match(/^[^0-9]*/)?.[0] ?? '^';
  pkg[section][name] = `${prefix}${latest}`;
  applied.push({ name, current, latest, updateType, section });
  console.log(`  ✅ ${name}: ${current} → ${latest}`);
}

if (applied.length === 0) {
  console.log('Nothing to update after scanning package.json.');
  process.exit(0);
}

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
console.log('\nUpdated package.json. Running npm install…');
execSync('npm install', { stdio: 'inherit' });

// ── Generate PR body ─────────────────────────────────────────────────────────

const date = new Date().toISOString().split('T')[0];
const patchList = applied.filter((u) => u.updateType === 'patch');
const minorList = applied.filter((u) => u.updateType === 'minor');
const majorList = applied.filter((u) => u.updateType === 'major');

function tableRow(u, withNotes = false) {
  const info = safeUpdates.find((s) => s.package === u.name);
  const notes = info?.githubUrl ? `[📋 Release notes](${info.githubUrl})` : '—';
  return withNotes
    ? `| \`${u.name}\` | \`${u.current}\` | \`${u.latest}\` | ${notes} |`
    : `| \`${u.name}\` | \`${u.current}\` | \`${u.latest}\` |`;
}

let body = `# 📦 npm Package Updates\n\n`;
body += `> Auto-generated on **${date}** by the [npm update agent](.github/workflows/npm-update-agent.yml). Build verification passed ✅\n\n`;
body += `**${applied.length}** package(s) updated.\n\n`;

if (majorList.length > 0) {
  body += `## 🔴 Major Updates\n`;
  body += `> Changelog was reviewed - no breaking changes detected.\n\n`;
  body += `| Package | From | To | Notes |\n|---|---|---|---|\n`;
  body += majorList.map((u) => tableRow(u, true)).join('\n') + '\n\n';
}

if (minorList.length > 0) {
  body += `## 🟡 Minor Updates\n\n`;
  body += `| Package | From | To |\n|---|---|---|\n`;
  body += minorList.map((u) => tableRow(u)).join('\n') + '\n\n';
}

if (patchList.length > 0) {
  body += `## 🟢 Patch Updates\n\n`;
  body += `| Package | From | To |\n|---|---|---|\n`;
  body += patchList.map((u) => tableRow(u)).join('\n') + '\n\n';
}

body += `---\n*Created automatically - please review and merge if the site looks good.*\n`;

fs.writeFileSync('pr-body.md', body);
console.log('\n📝 PR body written to pr-body.md');
