/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_APP_TITLE: string;
	readonly VITE_APP_BASE_URL: string;
    readonly VITE_APP_BASE_URL_PROXY: string;
    readonly VITE_APP_ENV: string;
    readonly VITE_APP_DEBUG: string;
	// 更多环境变量...
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
declare module '*.vue' {
	import type { DefineComponent } from "vue";
	const component: DefineComponent<{}, {}, any>
	export default component
}