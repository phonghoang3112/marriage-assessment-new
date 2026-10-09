import fs from 'fs';
import path from 'path';

const dist = path.resolve('dist');

// Clean and create dist directory
if (fs.existsSync(dist)) {
  fs.rmSync(dist, { recursive: true, force: true });
}
fs.mkdirSync(dist, { recursive: true });

// Copy html files
if (fs.existsSync('index.html')) {
  fs.copyFileSync('index.html', path.join(dist, 'index.html'));
}
if (fs.existsSync('dat-lich.html')) {
  fs.copyFileSync('dat-lich.html', path.join(dist, 'dat-lich.html'));
}

// Copy assets directory recursively
if (fs.existsSync('assets')) {
  fs.cpSync('assets', path.join(dist, 'assets'), { recursive: true });
}

// Copy server entrypoint and package.json for Vercel Node builder
if (fs.existsSync('server.js')) {
  fs.copyFileSync('server.js', path.join(dist, 'server.js'));
  fs.copyFileSync('server.js', path.join(dist, 'index.js'));
}
if (fs.existsSync('package.json')) {
  fs.copyFileSync('package.json', path.join(dist, 'package.json'));
}

console.log('Build completed: all static and server files copied to dist/');
