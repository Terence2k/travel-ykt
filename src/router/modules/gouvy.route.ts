export default [
	{
		path: '/gouvyManagement',
		name: '',
		redirect: '/gouvyManagement/rule',
		meta: {
			title: '古维管理',
		},
		component: () => import('@/components/layout/index.vue'),
		children: [
			{
				path: 'rule',
				component: () => import('@/views/gouvyManagement/rule/index.vue'),
				name: 'rule',
				meta: {
					title: '古维规则管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
				},
			},
			{
				path: 'order',
				name: 'order',
				redirect: '/gouvyManagement/order/list',
				meta: {
					title: '古维订单管理',
				},
				children: [
					{
						path: 'list',
						component: () => import('@/views/gouvyManagement/order/index.vue'),
						name: 'order-list',
						meta: {
							title: '订单',
							activeMeun: 'information',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'order_edit',
						component: () => import('@/views/gouvyManagement/order/details.vue'),
						name: 'order_edit',
						meta: {
							title: '查看',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
				],
			},
			{
				path: 'exemptionManagement',
				name: 'exemptionManagement',
				redirect: '/gouvyManagement/exemptionManagement/list',
				meta: {
					title: '古维减免管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					isDetail: false, // 在左侧的导航栏不会展示
				},
				children: [
					{
						path: 'list',
						component: () => import('@/views/gouvyManagement/exemptionManagement/index.vue'),
						name: 'exemption-management-list',
						meta: {
							title: '古维减免管理',
							activeMeun: 'information',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'exemption-management_edit',
						component: () => import('@/views/gouvyManagement/exemptionManagement/details.vue'),
						name: 'exemption-management_edit',
						meta: {
							title: '查看',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
				],
			},
			{
				path: 'revocationManagement',
				name: 'revocationManagement',
				redirect: '/gouvyManagement/revocationManagement/list',
				meta: {
					title: '撤销重提管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					isDetail: false, // 在左侧的导航栏不会展示
				},
				children: [
					{
						path: 'list',
						component: () => import('@/views/gouvyManagement/revocationManagement/index.vue'),
						name: 'revocation-management-list',
						meta: {
							title: '列表页',
							activeMeun: 'revocationManagement',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'revocation-management_edit',
						component: () => import('@/views/gouvyManagement/revocationManagement/details.vue'),
						name: 'revocation-management_edit',
						meta: {
							title: '查看',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
				],
			},
		],
	},
];
