import { RollupOptions, ModuleFormat, OutputOptions } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { getBabelOutputPlugin } from '@rollup/plugin-babel'
import ts from 'rollup-plugin-typescript2'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import path from 'path'
import { terser } from 'rollup-plugin-terser'

const { getPresetsEnv } = require('./babel.presets')
const pkg = require(path.resolve('package.json'))

const formats: Array<ModuleFormat> = [
  'cjs',
  'esm',
  'umd'
]
const output: Array<OutputOptions> = formats.map((format) => {
  const fileName = `bundle.${format}.js`
  const result: OutputOptions = {
    file: `dist/${fileName}`,
    format,
    name: pkg.name,
    banner: `
      /**
       * @license
       * author: ${pkg.author}
       * ${fileName} v${pkg.version}
       * Released under the ${pkg.license} license.
       */
    `,
    sourcemap: false,
    exports: 'auto'
  }
  return result
})


const rollupConfig: RollupOptions = {
  input: 'src/index.ts',
  output,
  external: [
    ...Object.keys(pkg.peerDependencies || {})
  ],
  plugins: [
    getBabelOutputPlugin({
      presets: [
        getPresetsEnv()
      ],
      allowAllFormats: true
    }),
    terser(),
    json(),
    ts({
      useTsconfigDeclarationDir: true,
      include: './src/**/*'
    }),
    nodeResolve({
      browser: true
    }),
    commonjs({
      extensions: ['.js', '.ts'],
      include: ['node_modules/**']
    })
  ]
}


export default rollupConfig
