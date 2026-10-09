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

console.log('Build completed: all static files copied to dist/');
