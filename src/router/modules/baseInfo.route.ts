export default [
	{
		path: '/baseInfo',
		name: 'baseInfos',
		// redirect: '/baseInfo/menuManage',
		meta: {
			title: '基础信息管理',
		},
		component: () => import('@/components/layout/index.vue'),
		children: [
			{
				path: 'menuManage',
				component: () => import('@/views/baseInfoManage/menu/index.vue'),
				name: 'menuManage',
				meta: {
					title: '菜单管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					isDetail: false, // 在左侧的导航栏不会展示
				},
			},
			{
				path: 'dictionaryManage',
				component: () => import('@/views/baseInfoManage/dictionary/index.vue'),
				name: 'dictionaryManage',
				meta: {
					title: '数据字典管理',
					// isDetail: false, // 在左侧的导航栏不会展示
				},
			},
			{
				path: 'role_power',
				component: () => import('@/views/baseInfoManage/rolePower/index.vue'),
				name: 'role_power',
				meta: {
					title: '角色权限管理',
				},
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
				name: 'businessAdministration',
				meta: {
					title: '企业管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					// isDetail: true, // 在左侧的导航栏不会展示
				},
			},
		],
	},
];
