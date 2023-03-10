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
				path: 'comprehensiveFee',
				name: 'comprehensiveFee',
				redirect: '/settlementManagement/comprehensiveFee/list',
				meta: {
					title: '综费产品',
					isDetail: false, // 在左侧的导航栏不会展示
					// icon: 'liulanqi',
					// auth: ["admin"],
				},
				children: [
					{
						path: 'list',
						component: () => import('@/views/settlementManagement/comprehensiveFee/index.vue'),
						name: 'comprehensiveFee',
						meta: {
							title: '首页',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'edit',
						component: () => import('@/views/settlementManagement/comprehensiveFee/components/edit.vue'),
						name: 'comprehensiveFeeEdit',
						meta: {
							title: '编辑',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'info',
						component: () => import('@/views/settlementManagement/comprehensiveFee/components/info.vue'),
						name: 'comprehensiveFeeInfo',
						meta: {
							title: '查看',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
				],
			},
			// {
			// 	path: 'settlementRule',
			// 	component: () => import('@/views/settlementManagement/settlementRule/index.vue'),
			// 	name: 'settlementRule',
			// 	meta: {
			// 		title: '结算规则管理',
			// 		// icon: 'liulanqi',
			// 		// auth: ["admin"],
			// 	},
			// },
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
				name: 'settlement',
				redirect: '/settlementManagement/settlement/list',
				meta: {
					title: '结算管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					isDetail: false, // 在左侧的导航栏不会展示
				},
				children: [
					{
						path: 'list',
						component: () => import('@/views/settlementManagement/settlement/index.vue'),
						name: 'settlement',
						meta: {
							title: '首页',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'examineInfo',
						component: () => import('@/views/settlementManagement/settlement/examine/examineInfo.vue'),
						name: 'examineInfo',
						meta: {
							title: '查看',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
				],
			},
			{
				path: 'transferManagement',
				redirect: '/settlementManagement/transferManagement/list',
				name: 'transferManagement',
				meta: {
					title: '转账管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					isDetail: false, // 在左侧的导航栏不会展示
				},
				children: [
					{
						path: 'list',
						component: () => import('@/views/settlementManagement/transferManagement/index.vue'),
						name: 'transferManagementList',
						meta: {
							title: '首页',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'batchTransfer',
						component: () => import('@/views/settlementManagement/transferManagement/batchTransfer.vue'),
						name: 'batchTransfer',
						meta: {
							title: '批量转账',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'tripList',
						component: () => import('@/views/settlementManagement/transferManagement/tripList.vue'),
						name: 'transferManagementTripList',
						meta: {
							title: '行程单列表',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
				],
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
