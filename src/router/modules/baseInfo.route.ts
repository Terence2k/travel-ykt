export default [
	{
		path: '/baseInfo',
		name: '',
		redirect: '/baseInfo/menu',
		meta: {
			title: '基础信息管理',
		},
		component: () => import('@/components/layout/index.vue'),
		children: [
			{
				path: 'menu',
				component: () => import('@/views/baseInfoManage/menu/index.vue'),
				name: '',
				meta: {
					title: '菜单管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
				},
			},
			{
				path: 'role_power',
				component: () => import('@/views/baseInfoManage/rolePower/index.vue'),
				// component: () => import('@/views/touristAgency/index.vue'),
				name: '',
				meta: {
					title: '角色权限管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					isDetail: false, // 在左侧的导航栏不会展示
				},
			},
			{
				path: 'user_manage',
				component: () => import('@/views/baseInfoManage/userManage/index.vue'),
				name: '',
				meta: {
					title: '用户管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					isDetail: false, // 在左侧的导航栏不会展示
				},
			},
		],
	},
];
