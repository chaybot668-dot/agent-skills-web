import { defineConfig } from 'vitepress';
import { readFileSync, readdirSync, existsSync } from 'node:fs';

const skills = existsSync(new URL('../skills.json', import.meta.url))
  ? JSON.parse(readFileSync(new URL('../skills.json', import.meta.url)))
  : [];
const docs = existsSync(new URL('../docs', import.meta.url))
  ? readdirSync(new URL('../docs', import.meta.url)).filter(f => f.endsWith('.md')).sort()
  : [];

export default defineConfig({
  title: 'Agent Skills',
  description: 'Production-grade engineering skills for AI coding agents',
  cleanUrls: true,
  ignoreDeadLinks: true,
  srcExclude: ['node_modules/**'],
  themeConfig: {
    nav: [{ text: 'Skills', link: '/skills/' }, { text: 'Docs', link: '/docs/getting-started' }],
    sidebar: {
      '/skills/': [{ text: 'Skills', items: skills.map(s => ({ text: s, link: `/skills/${s}` })) }],
      '/docs/': [{ text: 'Docs', items: docs.map(f => ({ text: f.replace('.md', '').replace(/-/g, ' '), link: `/docs/${f.replace('.md', '')}` })) }]
    },
    search: { provider: 'local' }
  }
});
