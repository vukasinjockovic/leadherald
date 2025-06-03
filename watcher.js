// watcher.js
import chokidar from 'chokidar';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const packagePath = path.resolve(__dirname, 'packages/businesspress/core');
const packageResourcesPath = path.resolve(packagePath, 'resources');
const packageViewPath = path.resolve(packagePath, 'src/View');
const packageLivewirePath = path.resolve(packagePath, 'src/Livewire');
const mainAppPath = path.resolve(__dirname);
const mainAppResourcesPath = path.resolve(mainAppPath, 'resources');
const mainAppViewPath = path.resolve(mainAppPath, 'app/View');
const mainAppLivewirePath = path.resolve(mainAppPath, 'app/Livewire');

// Function to run Vite build in the package
const runViteBuild = () => {
  return new Promise((resolve) => {
    exec('npm run build', { cwd: mainAppPath }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Vite build error: ${error.message}`);
        console.error(`Build process stderr: ${stderr}`);
        resolve(false);
      } else {
        console.log(`Vite build output: ${stdout}`);
        resolve(true);
      }
    });
  });
};

// Watch all locations
const watchPaths = [
  packageResourcesPath,
  packageViewPath,
  packageLivewirePath,
  mainAppResourcesPath,
  mainAppViewPath,
  mainAppLivewirePath
];

let buildTimeout;

const watcher = chokidar.watch(watchPaths, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true
});

watcher.on('all', (event, path) => {
  console.log(`File ${event}: ${path}`);
  clearTimeout(buildTimeout);
  buildTimeout = setTimeout(() => {
    runViteBuild().then((success) => {
      if (success) {
        console.log('Build completed successfully');
      } else {
        console.log('Build failed');
      }
    });
  }, 300); // Debounce build for 300ms
});

console.log(`Watching for changes in:
- ${packageResourcesPath}
- ${packageViewPath}
- ${packageLivewirePath}
- ${mainAppResourcesPath}
- ${mainAppViewPath}
- ${mainAppLivewirePath}`);

// Handle watcher errors
watcher.on('error', error => {
  console.error(`Watcher error: ${error}`);
  console.log('Watcher continues running despite the error');
});
