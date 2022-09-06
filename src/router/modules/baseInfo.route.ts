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
				name: 'menu',
				meta: {
					title: '菜单管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
				},
			},
			{
				path: 'role_power',
				redirect: '/baseInfo/role_power/index',

				// component: () => import('@/views/baseInfoManage/rolePower/index.vue'),
				name: 'role_power',
				meta: {
					title: '角色权限管理',
				},
				children: [
					{
						path: 'index',
						component: () => import('@/views/baseInfoManage/rolePower/index.vue'),
						name: 'index',
						meta: {
							title: 'index',
							isDetail: true, // 在左侧的导航栏不会展示
							// icon: 'liulanqi',
							// auth: ["admin"],
						},
					},
					{
						path: '1menu',
						component: () => import('@/views/baseInfoManage/menu/index.vue'),
						name: '1menu',
						meta: {
							title: '菜单管111理',
							isDetail: true, // 在左侧的导航栏不会展示
							// icon: 'liulanqi',
							// auth: ["admin"],
						},
					},
					{
						path: '1travel',
						component: () => import('@/views/baseInfoManage/businessAdministration/index.vue'),
						name: '1travel',
						meta: {
							title: '菜单管理',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
				],
			},
			{
				path: 'user_manage',
				component: () => import('@/views/baseInfoManage/userManage/index.vue'),
				name: 'user_manage',
				meta: {
					title: '用户管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					isDetail: false, // 在左侧的导航栏不会展示
				},
			},

			{
				path: 'businessAdministration',
				component: () => import('@/views/baseInfoManage/businessAdministration/index.vue'),
				name: 'travel',
				meta: {
					title: '菜单管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					// isDetail: true, // 在左侧的导航栏不会展示
				},
			},
		],
	},
];
