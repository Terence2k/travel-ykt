import { fileURLToPath, URL } from 'url';

import { ConfigEnv, searchForWorkspaceRoot, UserConfig } from 'vite';

import { createVitePlugins } from './config/vite/plugin/index';
import { configManualChunk } from './config/vite/optimizer';
// https://vitejs.dev/config/

export default ({ command, mode }: ConfigEnv): UserConfig => {
	const isBuild = mode !== 'dev';
	return {
		base: './',
		plugins: createVitePlugins(isBuild),
		server: {
			host: '0.0.0.0',
			fs: {
				allow: [
					// 搜索工作区的根目录
					searchForWorkspaceRoot(process.cwd()),
					// "/Users/xuyifei/Documents/study/npm/ant_vue3_ui_ts/lib/",
				],
			},
		},
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)),
			},
		},
		build: {
			target: 'es2015',
			terserOptions: {
				compress: {
					keep_infinity: true,
					drop_console: true,
				},
			},
			rollupOptions: {
				output: {
					chunkFileNames: 'static/js/[name]-[hash].js',
					entryFileNames: 'static/js/[name]-[hash].js',
					assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
					manualChunks: configManualChunk,
					// inlineDynamicImports: true, //支持动态导入
				},
			},
		},
	};
};
