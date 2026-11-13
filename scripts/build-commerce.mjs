import {build} from 'esbuild';
import {mkdir} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
await build({entryPoints:['commerce/src/worker.js'],outfile:'dist/worker.mjs',bundle:true,format:'esm',platform:'browser',target:'es2022',minify:true,loader:{'.woff2':'base64'}});
console.log('Built dist/worker.mjs (Worker preview, no production deployment).');
