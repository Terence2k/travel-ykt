import { createRouter, createWebHashHistory } from 'vue-router';
import { constantRoutes } from './router.config';
// import { basicRouter } from "./router.config";

const router = createRouter({
	//import.meta.env.BASE_URL
	history: createWebHashHistory(),
	routes: [...constantRoutes],
	strict: true,
	scrollBehavior: () => ({ left: 0, top: 0 }),
});

export default router;
