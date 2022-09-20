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
				component: () => import('@/views/gouvyManagement/order/index.vue'),
				name: 'order',
				meta: {
					title: '古维订单管理',
				},
			},
			{
				path: 'orderChange',
				component: () => import('@/views/gouvyManagement/orderChange/index.vue'),
				name: 'orderChange',
				meta: {
					title: '古维订单变更管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					isDetail: false, // 在左侧的导航栏不会展示
				},
			},
		],
	},
];
