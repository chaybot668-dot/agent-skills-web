// Copies skills/ and docs/ into site/ (generated, gitignored) so VitePress can render them.
import { cpSync, mkdirSync, readdirSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const site = join(root, 'site');
for (const d of ['skills', 'docs']) rmSync(join(site, d), { recursive: true, force: true });
mkdirSync(join(site, 'skills'), { recursive: true });

const skills = [];
for (const name of readdirSync(join(root, 'skills')).sort()) {
  const file = join(root, 'skills', name, 'SKILL.md');
  if (!existsSync(file)) continue;
  let text = readFileSync(file, 'utf8');
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  let desc = '';
  if (m) {
    const d = m[1].match(/^description:\s*(.*)$/m);
    desc = d ? d[1].replace(/^["']|["']$/g, '') : '';
    text = text.slice(m[0].length);
  }
  writeFileSync(join(site, 'skills', `${name}.md`), text);
  skills.push({ name, desc });
}

const index = `# Skills\n\n${skills.map(s => `- [${s.name}](./${s.name}) — ${s.desc}`).join('\n')}\n`;
writeFileSync(join(site, 'skills', 'index.md'), index);

cpSync(join(root, 'docs'), join(site, 'docs'), { recursive: true });
writeFileSync(join(site, 'skills.json'), JSON.stringify(skills.map(s => s.name)));
console.log(`site prepared: ${skills.length} skills`);
