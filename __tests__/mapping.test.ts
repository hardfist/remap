import SourceMap from '@parcel/source-map';
import babel from '@babel/core';
import terser from 'terser';
import fs from 'fs-extra';
import path from 'path';
import { test } from 'uvu';
import assert from 'uvu/assert';
import esbuild from 'esbuild';
import remapping from '../src';
test('remapping', async () => {
  const code = fs.readFileSync('./src/index.ts', 'utf8');
  const transformResult = esbuild.transformSync(code, {
    sourcefile: 'src/index.ts',
    sourcemap: true,
    loader: 'ts',
    format: 'cjs',
  });
  const minifyResult = await terser.minify(
    {
      'minify.js': transformResult!.code!,
    },
    {
      sourceMap: {
        includeSources: true,
      },
    }
  );
  const mergedMap = await remapping([minifyResult!.map!, transformResult.map]);
  fs.ensureDirSync(path.resolve(__dirname, '../dist'));
  fs.writeFileSync(path.resolve(__dirname, '../dist/bundle.js'), minifyResult!.code!);
  fs.writeFileSync(path.resolve(__dirname, '../dist/bundle.js.map'), mergedMap);
  assert.ok(true);
});

test('add', async () => {
  assert.ok(true);
});

test.run();
