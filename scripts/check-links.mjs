import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const includeExt = new Set([
  '.md',
  '.mdx',
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.css',
  '.scss',
  '.json',
  '.yml',
  '.yaml',
]);

const scanDirs = ['blog', 'docs', 'src', 'static', '.github', '.'];
const ignoredRoots = new Set([
  '.git',
  'node_modules',
  'build',
  '.docusaurus',
]);

function walk(dir, out = []) {
  const entries = fs.readdirSync(dir, {withFileTypes: true});
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    const rel = path.relative(repoRoot, abs).replace(/\\/g, '/');
    if (entry.isDirectory()) {
      const top = rel.split('/')[0];
      if (!ignoredRoots.has(top)) {
        walk(abs, out);
      }
      continue;
    }
    if (includeExt.has(path.extname(entry.name))) {
      out.push(abs);
    }
  }
  return out;
}

function existsRepoPath(candidate) {
  return fs.existsSync(path.join(repoRoot, candidate));
}

function normalizeAssetPath(ref) {
  if (ref.startsWith('/generic-optimization-workflow-blog/img/')) {
    return `static/img/${ref.replace('/generic-optimization-workflow-blog/img/', '')}`;
  }
  if (ref.startsWith('/img/')) {
    return `static/img/${ref.replace('/img/', '')}`;
  }
  if (ref.startsWith('img/')) {
    return `static/${ref}`;
  }
  return null;
}

function checkRelativeRef(fileAbs, ref) {
  const clean = ref.split('#')[0].split('?')[0];
  if (!clean) {
    return null;
  }
  const abs = path.resolve(path.dirname(fileAbs), clean);
  if (fs.existsSync(abs)) {
    return null;
  }
  for (const ext of ['.md', '.mdx', '.js', '.jsx', '.ts', '.tsx']) {
    if (fs.existsSync(abs + ext)) {
      return null;
    }
  }
  return path.relative(repoRoot, abs).replace(/\\/g, '/');
}

function collectRefs(content) {
  const refs = [];
  const mdLinkRe = /!?\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  const htmlAttrRe = /\b(?:src|href)=["']([^"']+)["']/g;
  const cssUrlRe = /url\((['"]?)([^)'"]+)\1\)/g;
  const configImgRe = /['"`](img\/[^'"`]+)['"`]/g;

  for (const re of [mdLinkRe, htmlAttrRe, cssUrlRe, configImgRe]) {
    let match;
    while ((match = re.exec(content)) !== null) {
      refs.push(match[1] ?? match[2]);
    }
  }
  return refs.filter(Boolean);
}

function isExternalRef(ref) {
  return (
    ref.startsWith('http://') ||
    ref.startsWith('https://') ||
    ref.startsWith('mailto:') ||
    ref.startsWith('tel:') ||
    ref.startsWith('#') ||
    ref.startsWith('//')
  );
}

function parseDefinedTags(tagsYml) {
  const tags = new Set();
  for (const line of tagsYml.split('\n')) {
    const m = /^([a-z0-9-]+):\s*$/.exec(line.trimEnd());
    if (m) {
      tags.add(m[1]);
    }
  }
  return tags;
}

function parsePostTags(frontMatterBlock) {
  const tags = new Set();
  const inline = /tags:\s*\[([^\]]+)\]/.exec(frontMatterBlock);
  if (inline) {
    for (const tag of inline[1].split(',')) {
      const norm = tag.trim().replace(/^['"]|['"]$/g, '');
      if (norm) {
        tags.add(norm);
      }
    }
    return tags;
  }
  const block = /tags:\s*\n((?:\s*-\s*.+\n?)*)/.exec(frontMatterBlock);
  if (block) {
    for (const line of block[1].split('\n')) {
      const m = /^\s*-\s*(.+)\s*$/.exec(line);
      if (!m) {
        continue;
      }
      const norm = m[1].trim().replace(/^['"]|['"]$/g, '');
      if (norm) {
        tags.add(norm);
      }
    }
  }
  return tags;
}

const files = walk(repoRoot).filter((abs) => {
  const rel = path.relative(repoRoot, abs).replace(/\\/g, '/');
  if (rel === '') {
    return false;
  }
  const top = rel.split('/')[0];
  return scanDirs.includes(top) || rel === 'docusaurus.config.js';
});

const missing = [];
for (const abs of files) {
  const rel = path.relative(repoRoot, abs).replace(/\\/g, '/');
  const content = fs.readFileSync(abs, 'utf8');
  for (const ref of collectRefs(content)) {
    if (isExternalRef(ref)) {
      continue;
    }
    const clean = ref.split('#')[0].split('?')[0];
    const mappedAsset = normalizeAssetPath(clean);
    if (mappedAsset) {
      if (!existsRepoPath(mappedAsset)) {
        missing.push(`${rel}: missing asset "${clean}" -> ${mappedAsset}`);
      }
      continue;
    }
    if (clean.startsWith('./') || clean.startsWith('../')) {
      const missingPath = checkRelativeRef(abs, clean);
      if (missingPath) {
        missing.push(`${rel}: missing relative reference "${clean}" -> ${missingPath}`);
      }
    }
  }
}

// Tag consistency: every tag used by posts should exist in blog/tags.yml.
const tagsPath = path.join(repoRoot, 'blog', 'tags.yml');
if (fs.existsSync(tagsPath)) {
  const definedTags = parseDefinedTags(fs.readFileSync(tagsPath, 'utf8'));
  const blogFiles = walk(path.join(repoRoot, 'blog')).filter((f) =>
    f.endsWith('.md') || f.endsWith('.mdx')
  );
  for (const post of blogFiles) {
    const rel = path.relative(repoRoot, post).replace(/\\/g, '/');
    const content = fs.readFileSync(post, 'utf8');
    const fm = /^---\n([\s\S]*?)\n---/.exec(content);
    if (!fm) {
      continue;
    }
    const usedTags = parsePostTags(fm[1]);
    for (const tag of usedTags) {
      if (!definedTags.has(tag)) {
        missing.push(`${rel}: tag "${tag}" is used but not defined in blog/tags.yml`);
      }
    }
  }
}

// Guard against stale project naming.
const staleNameMatches = [];
const staleNameRe = /tonatiuh(?:\+\+|pp|xx)?/i;
for (const abs of files) {
  const rel = path.relative(repoRoot, abs).replace(/\\/g, '/');
  const content = fs.readFileSync(abs, 'utf8');
  if (staleNameRe.test(content)) {
    staleNameMatches.push(rel);
  }
}
if (staleNameMatches.length > 0) {
  missing.push(
    `stale naming detected in: ${staleNameMatches.sort().join(', ')}`
  );
}

if (missing.length > 0) {
  console.error('Link/asset consistency checks failed:\n');
  for (const issue of missing) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log('Link/asset consistency checks passed.');
