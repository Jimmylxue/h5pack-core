import { defineConfig } from 'rollup'
import nodeResolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const { dependencies } = require('./package.json')

const extensions = ['.ts', '.tsx']

const noDeclarationFiles = { compilerOptions: { declaration: false } }

// 将 package.json 中的 dependencies 标记为外部依赖，不打包进 bundle
const external = Object.keys(dependencies)

function cjsConfig(prod, type) {
	return {
		input: 'src/index.ts',
		output: {
			file: prod
				? `build/core.${type === 'cjs' ? 'cjs' : 'esm'}.prod.js`
				: `build/core.${type === 'cjs' ? 'cjs' : 'esm'}.js`,
			format: type,
			indent: false,
			exports: 'default',
		},
		external,
		plugins: [
			nodeResolve({
				extensions,
			}),
			commonjs(),
			// 将ts声明文件单独提出一份
			typescript(
				prod && type === 'cjs'
					? { useTsconfigDeclarationDir: true }
					: { tsconfigOverride: noDeclarationFiles }
			),
			babel({
				extensions,
				plugins: [['@babel/plugin-transform-runtime']],
				babelHelpers: 'runtime',
			}),
			// eslint({
			// 	throwOnError: true,
			// 	throwOnWarning: true,
			// 	include: ['src/**'],
			// 	exclude: ['node_modules/**'],
			// }),
			prod && terser(),
		],
	}
}

// function processConfig(prod, type) {
// 	return {
// 		input: 'src/core/process.ts',
// 		output: {
// 			file: 'dist/core/process.js',
// 			format: type,
// 			indent: false,
// 		},
// 		// external,
// 		plugins: [
// 			nodeResolve({
// 				extensions,
// 			}),
// 			commonjs(),
// 			// 将ts声明文件单独提出一份
// 			typescript(
// 				prod && type === 'cjs'
// 					? { useTsconfigDeclarationDir: true }
// 					: { tsconfigOverride: noDeclarationFiles }
// 			),
// 			babel({
// 				extensions,
// 				plugins: [['@babel/plugin-transform-runtime']],
// 				babelHelpers: 'runtime',
// 			}),
// 			// eslint({
// 			// 	throwOnError: true,
// 			// 	throwOnWarning: true,
// 			// 	include: ['src/**'],
// 			// 	exclude: ['node_modules/**'],
// 			// }),
// 			prod && terser(),
// 		],
// 	}
// }

export default defineConfig([
	cjsConfig(true, 'cjs'),
	// processConfig(true, 'cjs'),
])
