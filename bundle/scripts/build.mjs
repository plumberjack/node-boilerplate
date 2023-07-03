import dts from 'npm-dts';
import * as esbuild from 'esbuild';

import { getProcessArgumentValue } from '../utils.mjs';

/** @type {import("esbuild").BuildOptions} */
const buildOptions = {
  bundle: true,
  outdir: 'dist',
  entryPoints: ['src/index.ts'],
  minify: getProcessArgumentValue('--minify', { value: true }),
};

try {
  new dts.Generator({
    entry: buildOptions.entryPoints[0],
    output: `${buildOptions.outdir}/types/index.d.ts`,
  }).generate();
} catch (error) {
  throw Error(String(error));
}

try {
  await esbuild.build(buildOptions);
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
