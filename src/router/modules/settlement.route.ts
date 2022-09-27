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
				name: 'currencySettlementRule',
				redirect: '/settlementManagement/currencySettlementRule/list',
				meta: {
					title: '通用结算规则',
					isDetail: false, // 在左侧的导航栏不会展示
				},
				children: [
					{
						path: 'list',
						component: () => import('@/views/settlementManagement/currencySettlementRule/index.vue'),
						name: 'currencySettlementRuleList',
						meta: {
							title: '首页',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'edit',
						component: () => import('@/views/settlementManagement/currencySettlementRule/components/edit.vue'),
						name: 'currencySettlementRuleEdit',
						meta: {
							title: '编辑',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'info',
						component: () => import('@/views/settlementManagement/currencySettlementRule/components/info.vue'),
						name: 'currencySettlementRuleInfo',
						meta: {
							title: '查看',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
				],
			},
			{
				path: 'productSettlementRule',
				redirect: '/settlementManagement/productSettlementRule/list',
				name: 'productSettlementRule',
				meta: {
					title: '产品结算规则',
					// icon: 'liulanqi',
					// auth: ["admin"],
					isDetail: false, // 在左侧的导航栏不会展示
				},
				children: [
					{
						path: 'list',
						component: () => import('@/views/settlementManagement/productSettlementRule/index.vue'),
						name: 'productSettlementRuleList',
						meta: {
							title: '首页',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'configureRules',
						component: () => import('@/views/settlementManagement/productSettlementRule/components/configureRules.vue'),
						name: 'configureRules',
						meta: {
							title: '配置规则',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'edit',
						component: () => import('@/views/settlementManagement/productSettlementRule/components/edit.vue'),
						name: 'configureRulesEdit',
						meta: {
							title: '编辑',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'info',
						component: () => import('@/views/settlementManagement/productSettlementRule/components/info.vue'),
						name: 'configureRulesInfo',
						meta: {
							title: '查看',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
				],
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
