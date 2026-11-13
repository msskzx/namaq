// Serves the app's web export with every unknown path falling back to index.html, as Expo Router expects.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const root = path.resolve(process.argv[2] ?? 'mobile/dist');
const port = Number(process.argv[3] ?? 8082);
if (!fs.existsSync(path.join(root, 'index.html'))) throw new Error('Missing web export entrypoint: ' + path.join(root, 'index.html'));
const types = {
  '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json',
  '.ttf': 'font/ttf', '.otf': 'font/otf', '.woff2': 'font/woff2', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.wasm': 'application/wasm', '.mp3': 'audio/mpeg',
};

const decode = text => { try { return decodeURIComponent(text); } catch { return '/'; } };

http.createServer((req, res) => {
  let file = path.join(root, decode(req.url.split('?')[0]));
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(root, 'index.html');
  res.writeHead(200, {
    'content-type': types[path.extname(file)] ?? 'application/octet-stream',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'credentialless',
  });
  fs.createReadStream(file).on('error', () => res.end()).pipe(res);
}).listen(port, '127.0.0.1');
