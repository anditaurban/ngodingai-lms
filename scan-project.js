const fs = require('fs');
const path = require('path');

// Konfigurasi: Folder yang akan DIABAIKAN
const IGNORE_DIRS = [
  'node_modules',
  '.next',
  '.git',
  '.vscode',
  '.idea',
  'coverage',
  'dist',
  'build'
];

// Konfigurasi: File yang akan DIABAIKAN (opsional, misal file lock)
const IGNORE_FILES = [
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  '.DS_Store'
];

function getStructure(dir, prefix = '') {
  let output = '';
  const items = fs.readdirSync(dir);

  // Pisahkan folder dan file untuk pengurutan
  const dirs = [];
  const files = [];

  items.forEach(item => {
    if (IGNORE_DIRS.includes(item) || IGNORE_FILES.includes(item)) return;

    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      dirs.push(item);
    } else {
      files.push(item);
    }
  });

  // Gabungkan (Folder dulu, baru file)
  const sortedItems = [...dirs, ...files];

  sortedItems.forEach((item, index) => {
    const isLast = index === sortedItems.length - 1;
    const connector = isLast ? '└── ' : '├── ';
    const nextPrefix = prefix + (isLast ? '    ' : '│   ');

    output += prefix + connector + item + '\n';

    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      output += getStructure(fullPath, nextPrefix);
    }
  });

  return output;
}

console.log('Generating project structure...');
const structure = getStructure('.');
const outputFile = 'project-structure.txt';

fs.writeFileSync(outputFile, structure);
console.log(`✅ Selesai! Struktur disimpan di file: ${outputFile}`);