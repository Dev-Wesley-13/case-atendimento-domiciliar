import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.argv[2] || 4180);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Porta inválida.');
const manifest = JSON.parse(await readFile(path.join(root, 'deploy-manifest.json'), 'utf8'));
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.pdf': 'application/pdf',
};
const allowed = new Set(manifest.map((name) => '/' + name));
const server = http.createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  const name = pathname === '/' ? '/index.html' : pathname;
  if (!allowed.has(name) || !['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(404);
    res.end('Não encontrado');
    return;
  }
  try {
    const content = await readFile(path.join(root, name.slice(1)));
    res.writeHead(200, {
      'Content-Type': types[path.extname(name)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });
    res.end(req.method === 'HEAD' ? undefined : content);
  } catch {
    res.writeHead(404);
    res.end('Arquivo indisponível');
  }
});
server.listen(port, '127.0.0.1', () => console.log('Local: http://127.0.0.1:' + port));
server.on('error', (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
