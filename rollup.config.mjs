import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import terser  from '@rollup/plugin-terser';

import packageJson from "./package.json" assert { type: "json" };

export default [
    {
        input: './src/index.js',
        output: [
            {
                file: packageJson.main,
                format: 'cjs',
                sourcemap: true,
            },
            {
                file: packageJson.module,
                format: 'esm',
                exports: 'named',
                sourcemap: true,
            },
        ],
        plugins: [
            resolve(),
            babel({
                exclude: 'node_modules/**',
                presets: ['@babel/preset-react'],
            }),
            commonjs(),
            postcss({
                plugins: [],
                minimize: true,
            }),
            external(),
            terser(),
        ]
    }
];