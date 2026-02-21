const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..');
const wwwDir = path.join(srcDir, 'www');

if (!fs.existsSync(wwwDir)) {
  fs.mkdirSync(wwwDir, { recursive: true });
}

const filesToCopy = ['index.html', 'manifest.json'];
const dirsToCopy = ['css', 'js', 'icons'];

filesToCopy.forEach(file => {
  const src = path.join(srcDir, file);
  const dest = path.join(wwwDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log('Copied:', file);
  }
});

dirsToCopy.forEach(dir => {
  const src = path.join(srcDir, dir);
  const dest = path.join(wwwDir, dir);
  if (fs.existsSync(src)) {
    function copyDirSync(s, d) {
      if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
      fs.readdirSync(s).forEach(item => {
        const sp = path.join(s, item);
        const dp = path.join(d, item);
        if (fs.statSync(sp).isDirectory()) copyDirSync(sp, dp);
        else fs.copyFileSync(sp, dp);
      });
    }
    copyDirSync(src, dest);
    console.log('Copied dir:', dir);
  }
});

console.log('Web assets prepared for Capacitor.');
