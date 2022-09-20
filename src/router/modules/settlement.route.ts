export default [
	{
		path: '/settlementManagement',
		name: '',
		redirect: '/settlementManagement/settlementRule',
		meta: {
			title: '结算管理',
		},
		component: () => import('@/components/layout/index.vue'),
		children: [
			{
				path: 'settlementRule',
				component: () => import('@/views/settlementManagement/settlementRule/index.vue'),
				name: 'settlementRule',
				meta: {
					title: '结算规则管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
				},
			},
			{
				path: 'currencySettlementRule',
				component: () => import('@/views/settlementManagement/currencySettlementRule/index.vue'),
				name: 'currencySettlementRule',
				meta: {
					title: '通用结算规则',
				},
			},
			{
				path: 'productSettlementRule',
				component: () => import('@/views/settlementManagement/productSettlementRule/index.vue'),
				name: 'productSettlementRule',
				meta: {
					title: '产品结算规则',
					// icon: 'liulanqi',
					// auth: ["admin"],
					isDetail: false, // 在左侧的导航栏不会展示
				},
			},
			{
				path: 'settlement',
				component: () => import('@/views/settlementManagement/settlement/index.vue'),
				name: 'settlement',
				meta: {
					title: '结算管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					isDetail: false, // 在左侧的导航栏不会展示
				},
			},
			{
				path: 'transferManagement',
				component: () => import('@/views/settlementManagement/transferManagement/index.vue'),
				name: 'transferManagement',
				meta: {
					title: '转账管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					isDetail: false, // 在左侧的导航栏不会展示
				},
			},
            {
				path: 'changeManagement',
				component: () => import('@/views/settlementManagement/changeManagement/index.vue'),
				name: 'changeManagement',
				meta: {
					title: '改刷管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					isDetail: false, // 在左侧的导航栏不会展示
				},
			},
		],
	},
];
