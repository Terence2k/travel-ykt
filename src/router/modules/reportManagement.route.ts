export default [
	{
		path: '/reportManagement',
		name: '',
		redirect: '/reportManagement/scenicSpotTransferReport',
		meta: {
			title: '报表管理',
		},
		component: () => import('@/components/layout/index.vue'),
		children: [
			{
				path: 'scenicSpotTransferReport',
				name: 'scenicSpotTransferReport',
				redirect: '/reportManagement/scenicSpotTransferReport/list',
				meta: {
					title: '景区转账报表',
					isDetail: false, // 在左侧的导航栏不会展示
				},
				children: [
					{
						path: 'list',
						component: () => import('@/views/reportManagement/scenicSpotTransferReport/index.vue'),
						name: 'scenicSpotTransferReportList',
						meta: {
							title: '首页',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'tripList',
						component: () => import('@/views/reportManagement/scenicSpotTransferReport/components/tripList.vue'),
						name: 'scenicSpotTransferReportTripList',
						meta: {
							title: '行程单',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
				],
			},
			{
				path: 'scenicSpotOrderReport',
				name: 'scenicSpotOrderReport',
				redirect: '/reportManagement/scenicSpotOrderReport/list',
				meta: {
					title: '景区订单结算报表',
					isDetail: false, // 在左侧的导航栏不会展示
				},
				children: [
					{
						path: 'list',
						component: () => import('@/views/reportManagement/scenicSpotOrderReport/index.vue'),
						name: 'scenicSpotOrderReportList',
						meta: {
							title: '首页',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
				],
			},
		],
	},
];
