export default [
	{
		path: '/systemManagement',
		name: 'systemManagement',
		// redirect: '/baseInfo/menuManage',
		meta: {
			title: '系统管理',
		},
		component: () => import('@/components/layout/index.vue'),
		children: [
			{
				path: 'messageCenter',
				component: () => import('@/views/systemManagement/messageCenter/index.vue'),
				name: 'messageCenter',
				meta: {
					title: '消息中心',
					// icon: 'liulanqi',
					// auth: ["admin"],
					isDetail: false, // 在左侧的导航栏不会展示
				},
			},
			{
				path: 'messageManagement',
				name: 'messageManagement',
				redirect: '/systemManagement/messageManagement/messageList',
				meta: {
					title: '消息管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					isDetail: false, // 在左侧的导航栏不会展示
				},
				children: [
					{
						path: 'messageList',
						component: () => import('@/views/systemManagement/messageManagement/index.vue'),
						name: 'messageList',
						meta: {
							title: '',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'messageAdd',
						component: () => import('@/views/systemManagement/messageManagement/add.vue'),
						name: 'messageAdd',
						meta: {
							title: '新增',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'messageDetails',
						component: () => import('@/views/systemManagement/messageManagement/details.vue'),
						name: 'messageDetails',
						meta: {
							title: '查看详情',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'messageAudit',
						component: () => import('@/views/systemManagement/messageManagement/audit.vue'),
						name: 'messageAudit',
						meta: {
							title: '审核',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
				]
			},
		],
	},
];
