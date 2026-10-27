import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(
  await fs.readFile(path.join(root, 'deploy-manifest.json'), 'utf8'),
);
const failures = [];
for (const name of manifest) {
  try {
    await fs.access(path.join(root, name));
  } catch {
    failures.push('Arquivo ausente: ' + name);
  }
}
for (const name of ['index.html', 'demonstracoes.html']) {
  const html = await fs.readFile(path.join(root, name), 'utf8');
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const href = match[1];
    if (/^(https?:|mailto:)/.test(href)) continue;
    const [file, hash] = href.split('#');
    try {
      const body = await fs.readFile(path.join(root, file || name), 'utf8');
      if (hash && !body.includes('id="' + hash + '"'))
        failures.push('Âncora ausente: ' + href);
    } catch {
      failures.push('Link ausente: ' + href);
    }
  }
}
const index = await fs.readFile(path.join(root, 'index.html'), 'utf8');
if ((index.match(/data-areas=/g) || []).length !== 30)
  failures.push('Catálogo estático incompleto.');
if ((index.match(/data-visual-demo=/g) || []).length !== 4)
  failures.push('Quatro demonstrações esperadas.');
for (const file of ['app.js', 'demo-rules.js', 'demonstracoes.js', 'server.mjs'])
  execFileSync(process.execPath, ['--check', path.join(root, file)]);
for (const file of manifest.filter((p) => /\.(html|md|js|css)$/.test(p))) {
  const text = await fs.readFile(path.join(root, file), 'utf8');
  if (
    /amar-assistencial|amar-back|amar-web|amar-mobile|amar-profissionais|MAPEAMENTO-CLINICO/i.test(
      text,
    )
  )
    failures.push('Referência interna: ' + file);
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else
  console.log(
    'Verificado: arquivos, links locais, âncoras, catálogo sem JS, sintaxe e marcadores internos.',
  );
