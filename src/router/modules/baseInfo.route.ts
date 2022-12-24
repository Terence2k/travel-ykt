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
				component: () => import('@/views/baseInfoManage/menu/tab.vue'),
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
				meta: {
					title: '企业管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					// isDetail: true, // 在左侧的导航栏不会展示
				},
				children: [
					{
						path: 'apply',
						component: () => import('@/views/baseInfoManage/businessManagement/super/apply.vue'),
						name: 'apply',
						meta: {
							title: '',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'memberReview',
						component: () => import('@/views/baseInfoManage/businessManagement/normal/index.vue'),
						name: 'memberReview',
						meta: {
							title: '',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'addBusinessAccount',
						component: () => import('@/views/baseInfoManage/businessManagement/super/add.vue'),
						name: 'addBusinessAccount',
						meta: {
							title: '新增',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'details/businessType/:businessType/oid/:oid/fromPath/:fromPath',
						component: () => import('@/views/baseInfoManage/businessManagement/super/details.vue'),
						name: 'details',
						meta: {
							title: '详情',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
						props: true,
					},
					{
						path: 'editBusinessInfo/businessType/:businessType/oid/:oid',
						component: () => import('@/views/baseInfoManage/businessManagement/super/edit.vue'),
						name: 'editBusinessInfo',
						meta: {
							title: '编辑',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
						props: true,
					},
				],
			},
			{
				path: 'enterpriseUserManagement',
				component: () => import('@/views/baseInfoManage/enterpriseUserManagement/index.vue'),
				name: 'enterpriseUserManagement',
				meta: {
					title: '企业用户管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					isDetail: false, // 在左侧的导航栏不会展示
				},
			},
			{
				path: 'enterpriseInfo',
				component: () => import('@/views/baseInfoManage/enterpriseInfo/index.vue'),
				name: 'enterpriseInfo',
				meta: {
					title: '企业基本信息',
					// icon: 'liulanqi',
					// auth: ["admin"],
					isDetail: false, // 在左侧的导航栏不会展示
				},
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
			{
				path: 'sms_Management',
				redirect: '/baseInfo/sms_Management/index',
				name: 'sms_Management',
				meta: {
					title: '短信群发配置',
					// icon: 'liulanqi',
					// auth: ["admin"],
					// isDetail: false, // 在左侧的导航栏不会展示
				},
				children: [
					{
						path: 'index',
						component: () => import('@/views/baseInfoManage/smsManagement/index.vue'), meta: {
							title: '短信群发配置',
							isDetail: true,
						},
					},
					{
						path: 'preview',
						component: () => import('@/views/baseInfoManage/smsManagement/preview.vue'),
						name: 'preview',
						meta: {
							title: '发送短信',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'recording',
						component: () => import('@/views/baseInfoManage/smsManagement/recording.vue'),
						name: 'recording',
						meta: {
							title: '发送记录',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
				],
			},
			{
				path: 'guideLibraryManagement',
				component: () => import('@/views/baseInfoManage/guideLibraryManagement/index.vue'),
				name: 'guideLibraryManagement',
				meta: {
					title: '导游库管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					isDetail: false, // 在左侧的导航栏不会展示
				},
			},
		],
	},
];
