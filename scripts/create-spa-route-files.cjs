const fs = require('node:fs');
const path = require('node:path');

const distDir = path.resolve(__dirname, '..', 'dist');
const indexFile = path.join(distDir, 'index.html');
const routes = ['login', 'signup'];

if (!fs.existsSync(indexFile)) {
  throw new Error(`Cannot find ${indexFile}. Run vite build before creating route files.`);
}

for (const route of routes) {
  const routeDir = path.join(distDir, route);
  fs.mkdirSync(routeDir, { recursive: true });
  fs.copyFileSync(indexFile, path.join(routeDir, 'index.html'));
}
