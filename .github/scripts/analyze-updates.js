/**
 * analyze-updates.js
 *
 * Scans for outdated npm packages and categorises each update as:
 *   - safe     : patch / minor bump, or major bump with no breaking-change keywords found
 *   - breaking : major bump where release notes contain breaking-change indicators
 *   - uncertain: major bump where changelog could not be fetched (treated as needing review)
 *
 * Outputs:
 *   safe-updates.json     – array of safe update objects
 *   breaking-updates.json – array of breaking / uncertain update objects
 *   GITHUB_OUTPUT flags   – has_safe_updates, has_breaking_updates
 */

'use strict';

const { spawnSync } = require('child_process');
const fs = require('fs');

// ── Semver helpers ──────────────────────────────────────────────────────────

function parseSemver(version) {
  const clean = String(version).replace(/^[^0-9]*/, '');
  const m = clean.match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!m) return null;
  return { major: +m[1], minor: +m[2], patch: +m[3] };
}

function cmpVersions(a, b) {
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  return a.patch - b.patch;
}

// ── npm registry ────────────────────────────────────────────────────────────

async function fetchPackageInfo(name) {
  try {
    const res = await fetch(`https://registry.npmjs.org/${encodeURIComponent(name)}`, {
      headers: { Accept: 'application/json' },
    });
    return res.ok ? res.json() : null;
  } catch {
    return null;
  }
}

// ── GitHub releases ─────────────────────────────────────────────────────────

async function fetchReleasesSince(owner, repo, fromVersion, token) {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/releases?per_page=50`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    if (!res.ok) return null;

    const releases = await res.json();
    const from = parseSemver(fromVersion);
    return releases.filter((r) => {
      const v = parseSemver(r.tag_name);
      return v && from && cmpVersions(v, from) > 0;
    });
  } catch {
    return null;
  }
}

// ── Breaking-change detection ───────────────────────────────────────────────

const BREAKING_PATTERNS = [
  /BREAKING[\s_-]CHANGE/gi,
  /breaking change/gi,
  /incompatible/gi,
  /removed?\s+support/gi,
  /dropped?\s+support/gi,
  /no longer\s+support/gi,
  /deprecated\s+and\s+removed/gi,
  /migration\s+guide/gi,
  /upgrade\s+guide/gi,
  /API\s+change/gi,
];

function detectBreaking(text) {
  if (!text) return false;
  return BREAKING_PATTERNS.some((p) => p.test(text));
}

// ── Per-package analysis ────────────────────────────────────────────────────

async function analyzePackage(name, current, latest, token) {
  const curVer = parseSemver(current);
  const latVer = parseSemver(latest);

  if (!curVer || !latVer) {
    return { updateType: 'unknown', hasBreaking: null, reason: 'Could not parse version numbers' };
  }

  const isMajor = latVer.major > curVer.major;
  const isMinor = latVer.major === curVer.major && latVer.minor > curVer.minor;
  const updateType = isMajor ? 'major' : isMinor ? 'minor' : 'patch';

  if (!isMajor) {
    return { updateType, hasBreaking: false, reason: `${updateType} version bump – generally safe` };
  }

  // ── Major bump: inspect GitHub release notes ──────────────────────────────
  const pkgInfo = await fetchPackageInfo(name);
  if (!pkgInfo) {
    return {
      updateType,
      hasBreaking: null,
      reason: 'Could not reach npm registry',
    };
  }

  const repoUrl = pkgInfo.repository?.url || pkgInfo.homepage || '';
  const ghMatch = repoUrl.match(/github\.com[:/]([^/]+)\/([^/.]+)/);

  if (!ghMatch) {
    return {
      updateType,
      hasBreaking: null,
      reason: 'No GitHub repository found – changelog unavailable',
      npmUrl: `https://www.npmjs.com/package/${name}?activeTab=versions`,
    };
  }

  const [, owner, repo] = ghMatch;
  const releases = await fetchReleasesSince(owner, repo, current, token);

  if (!releases) {
    return {
      updateType,
      hasBreaking: null,
      reason: 'Could not fetch GitHub releases',
      githubUrl: `https://github.com/${owner}/${repo}/releases`,
    };
  }

  const allNotes = releases.map((r) => r.body || '').join('\n');
  const hasBreaking = detectBreaking(allNotes);

  return {
    updateType,
    hasBreaking,
    reason: hasBreaking
      ? 'Breaking-change keywords found in release notes'
      : 'No breaking-change keywords found in release notes',
    githubUrl: `https://github.com/${owner}/${repo}/releases`,
    releaseCount: releases.length,
    affectedReleases: releases.slice(0, 5).map((r) => ({ tag: r.tag_name, title: r.name })),
  };
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const token = process.env.GITHUB_TOKEN || '';

  // npm outdated exits with code 1 when packages are outdated – use spawnSync
  const result = spawnSync('npm', ['outdated', '--json'], { encoding: 'utf8' });
  let outdated = {};
  try {
    outdated = JSON.parse(result.stdout || '{}');
  } catch {
    outdated = {};
  }

  const packages = Object.entries(outdated);

  if (packages.length === 0) {
    console.log('✅ All packages are up to date.');
    fs.writeFileSync('safe-updates.json', '[]');
    fs.writeFileSync('breaking-updates.json', '[]');
    writeOutputFlag('has_safe_updates', 'false');
    writeOutputFlag('has_breaking_updates', 'false');
    return;
  }

  console.log(`🔍 Found ${packages.length} outdated package(s): ${packages.map(([n]) => n).join(', ')}\n`);

  const safeUpdates = [];
  const breakingUpdates = [];

  for (const [name, info] of packages) {
    const current = info.current;
    const latest = info.latest;
    process.stdout.write(`  Analyzing ${name}: ${current} → ${latest} … `);

    const analysis = await analyzePackage(name, current, latest, token);

    const entry = { package: name, current, wanted: info.wanted, latest, ...analysis };
    const verdict =
      analysis.hasBreaking === false ? '✅ safe' : analysis.hasBreaking ? '🔴 breaking' : '⚠️  uncertain';
    console.log(`${verdict} (${analysis.reason})`);

    if (analysis.hasBreaking === false) {
      safeUpdates.push(entry);
    } else {
      // breaking === true OR null (uncertain) both require human/agent review
      breakingUpdates.push({ ...entry, uncertain: analysis.hasBreaking === null });
    }
  }

  fs.writeFileSync('safe-updates.json', JSON.stringify(safeUpdates, null, 2));
  fs.writeFileSync('breaking-updates.json', JSON.stringify(breakingUpdates, null, 2));

  console.log(`\n📦 Safe updates:        ${safeUpdates.length}`);
  console.log(`⚠️  Needs review:        ${breakingUpdates.length}`);

  writeOutputFlag('has_safe_updates', String(safeUpdates.length > 0));
  writeOutputFlag('has_breaking_updates', String(breakingUpdates.length > 0));
}

function writeOutputFlag(key, value) {
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${value}\n`);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
