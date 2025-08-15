/*
  Tolerant launcher for Board Game Studio API

  Purpose:
  - Attempt to load the main server file from several likely locations so
    mis-deploys where server.js is placed in a subfolder don't immediately
    crash the Node process.
  - Log clearly which path was attempted/found to make troubleshooting easier.

  Usage:
  - Set your cPanel startup file to "launch.js" (or call `node launch.js`).
  - This script will try ./server.js, ./server/server.js, and ./index.js (if present).
*/

const path = require('path');

const candidates = [
  path.join(__dirname, 'server.js'),
  path.join(__dirname, 'server', 'server.js'),
  path.join(__dirname, 'index.js'),
  path.join(__dirname, 'server', 'index.js')
];

(async () => {
  for (const candidate of candidates) {
    try {
      console.log(`LAUNCHER: Attempting to load ${candidate}`);
      require(candidate);
      console.log(`LAUNCHER: Successfully loaded ${candidate}`);
      return;
    } catch (err) {
      console.warn(`LAUNCHER: Failed to load ${candidate}: ${err && err.code ? err.code : err.message}`);
      // If the error is not MODULE_NOT_FOUND or ENOENT, print stack for visibility
      if (err && err.code && !['MODULE_NOT_FOUND', 'ENOENT'].includes(err.code)) {
        console.error(err.stack || err);
      }
      // continue to next candidate
    }
  }

  console.error('LAUNCHER: Could not find a server entrypoint. Checked candidates:');
  candidates.forEach(c => console.error(` - ${c}`));
  process.exit(1);
})();
