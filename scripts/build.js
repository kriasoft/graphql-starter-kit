/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const babel = require('babel-core');
const chokidar = require('chokidar');
const task = require('./task');

module.exports = task('build', ({ watch = false, onComplete } = {}) => new Promise((resolve) => {
  let ready = false;

  // Clean up the output directory
  rimraf.sync('build/*', { nosort: true, dot: true });

  const watcher = chokidar.watch(
    ['src', 'package.json', 'yarn.lock', '.env', 'migrations', 'scripts']);
  watcher.on('all', (event, src) => {
    // Reload the app if .env file has changed (in watch mode)
    if (src === '.env') {
      if (ready && onComplete) onComplete();
      return;
    }

    // Skip files starting with a dot, e.g. .DS_Store, .eslintrc etc.
    if (path.basename(src)[0] === '.') return;

    // Get destination file name, e.g. src/app.js (src) -> build/app.js (dest)
    const dest = src.startsWith('src') ? `build/${path.relative('src', src)}` : `build/${src}`;

    try {
      switch (event) {
        // Create a directory if it doesn't exist
        case 'addDir':
          if (!fs.existsSync(dest)) fs.mkdirSync(dest);
          if (ready && onComplete) onComplete();
          break;

        // Create or update a file inside the output (build) folder
        case 'add':
        case 'change':
          if (src.startsWith('src') && src.endsWith('.js')) {
            const { code, map } = babel.transformFileSync(src, {
              sourceMaps: true,
              sourceFileName: path.relative('./build', src),
            });
            // Enable source maps
            const data = (src === 'src/server.js' ?
              'require(\'source-map-support\').install(); ' : '') + code +
              (map ? `\n//# sourceMappingURL=${path.basename(src)}.map\n` : '');
            fs.writeFileSync(dest, data, 'utf8');
            console.log(src, '->', dest);
            if (map) fs.writeFileSync(`${dest}.map`, JSON.stringify(map), 'utf8');
          } else if (src === 'package.json') {
            const pkg = require('../package.json'); // eslint-disable-line global-require
            fs.writeFileSync('build/package.json', JSON.stringify({
              name: pkg.name,
              version: pkg.version,
              private: pkg.private,
              engines: pkg.engines,
              dependencies: pkg.dependencies,
              scripts: pkg.scripts,
            }, null, '  '), 'utf8');
            console.log(src, '->', dest);
          } else {
            const data = fs.readFileSync(src, 'utf8');
            fs.writeFileSync(dest, data, 'utf8');
            console.log(src, '->', dest);
          }
          if (ready && onComplete) onComplete();
          break;

        // Remove directory if it was removed from the source folder
        case 'unlinkDir':
          if (fs.existsSync(dest)) fs.rmdirSync(dest);
          break;

        default:
          // Skip
      }
    } catch (err) {
      console.log(err.message);
    }
  });

  watcher.on('ready', () => {
    ready = true;
    if (onComplete) onComplete();
    if (!watch) watcher.close();
    resolve();
  });

  process.on('exit', () => {
    watcher.close();
    resolve();
  });

  process.once('SIGINT', () => process.exit(0));
}));
