import { fileURLToPath, URL } from 'url';

import { ConfigEnv, searchForWorkspaceRoot, UserConfig } from 'vite';

import { createVitePlugins } from './config/vite/plugin/index';
import { configManualChunk } from './config/vite/optimizer';
import { config } from './readConfig';
// https://vitejs.dev/config/

export default ({ command, mode }: ConfigEnv): UserConfig => {
	const isBuild = mode !== 'dev';
	return {
		base: './',
		plugins: createVitePlugins(isBuild),
		css: {
			preprocessorOptions: {
				less: {
					javascriptEnabled: true,
					modifyVars: {
						'primary-color': '#36B374',
			           	'link-color': '#36B374'
					}
				}
			}
		},
		server: {
			host: '0.0.0.0',
			fs: {
				allow: [
					// 搜索工作区的根目录
					searchForWorkspaceRoot(process.cwd()),
					// "/Users/xuyifei/Documents/study/npm/ant_vue3_ui_ts/lib/",
				],
			},
			proxy: {
			  '/ykt': {
				target: config.VITE_APP_BASE_URL_PROXY,
				changeOrigin: true,
			  }
			}
		},
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)),
			},
		},
		build: {
			target: 'es2015',
			minify: 'terser',
			terserOptions: {
				compress: {
					keep_infinity: true,
					drop_console: true,
					// drop_console: VITE_DROP_CONSOLE,
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
