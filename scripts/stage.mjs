import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(
  await fs.readFile(path.join(root, 'deploy-manifest.json'), 'utf8'),
);
await fs.mkdir(path.join(root, '.build'), { recursive: true });
const destination = await fs.mkdtemp(path.join(root, '.build', 'site-'));
for (const name of manifest) {
  const source = path.resolve(root, name);
  if (path.isAbsolute(name) || !source.startsWith(root + path.sep)) {
    throw new Error(`Caminho inválido no manifesto: ${name}`);
  }
  const stat = await fs.lstat(source);
  if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`Arquivo inválido: ${name}`);
  const target = path.join(destination, name);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.copyFile(source, target);
}
if (process.env.GITHUB_OUTPUT) {
  await fs.appendFile(process.env.GITHUB_OUTPUT, `directory=${destination}\n`);
}
console.log(`Site preparado: ${manifest.length} arquivos em ${destination}`);
