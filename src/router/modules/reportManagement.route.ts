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
					title: '转账报表管理',
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
				],
			},
		],
	},
];
