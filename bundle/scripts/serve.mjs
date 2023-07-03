import { createServer } from 'node:http';

import * as esbuild from 'esbuild';

import { getProcessArgumentValue } from '../utils.mjs';
import { writeFile } from 'node:fs';

const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script src="./index.js"></script>
    <script>new EventSource('/esbuild').addEventListener('change', () => location.reload())</script>
  </body>
</html>
`.trim();

/** @type {import("esbuild").BuildOptions} */
const buildOptions = {
  bundle: true,
  platform: 'browser',
  outdir: 'dist/front',
  entryPoints: ['src/front/index.ts'],
  minify: getProcessArgumentValue('--minify', { value: true }),
  plugins: [
    {
      name: 'front',
      setup: (build) => {
        build.onEnd(() => {
          writeFile('dist/front/index.html', html, (err) => {
            if (err) throw err;
          });
        });
      },
    },
  ],
};

/** @type {import("esbuild").ServeOptions} */
const serveOptions = { servedir: 'dist/front' };

esbuild
  .context(buildOptions)
  .then(async (build) => {
    await build.watch();
    const { port, host } = await build.serve(serveOptions);
    console.log(`Serving on http://${host}:${port}`);
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
