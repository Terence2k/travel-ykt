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
				path: 'businessManagement',
				component: () => import('@/views/baseInfoManage/businessManagement/index.vue'),
				name: 'businessManagement',
				redirect: '/baseInfo/businessManagement/apply',
				meta: {
					title: '企业管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					// isDetail: true, // 在左侧的导航栏不会展示
				},
				children: [
					{
						path: 'apply',
						component: () => import('@/views/baseInfoManage/businessManagement/apply.vue'),
						name: 'apply',
						meta: {
							title: '企业申请',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'check',
						component: () => import('@/views/baseInfoManage/businessManagement/check.vue'),
						name: 'check',
						meta: {
							title: '审核',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'details',
						component: () => import('@/views/baseInfoManage/businessManagement/details.vue'),
						name: 'details',
						meta: {
							title: '详情',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},

				]
			},
			{
				path: 'teamTypeManagement',
				component: () => import('@/views/baseInfoManage/teamTypeManagement/index.vue'),
				name: 'teamTypeManagement',
				meta: {
					title: '团队类型管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					isDetail: false, // 在左侧的导航栏不会展示
				},
			},
			// 
			{
				path: 'auditProcess',
				component: () => import('@/views/baseInfoManage/auditProcess/index.vue'),
				name: 'auditProcess',
				meta: {
					title: '审核流程配置',
					// icon: 'liulanqi',
					// auth: ["admin"],
					isDetail: false, // 在左侧的导航栏不会展示
				},
			},
		],
	},
];
