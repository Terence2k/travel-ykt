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
					title: '景区行程单结算表',
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
					title: '景区订单结算表',
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
			{
				path: 'travelAgencyReport',
				name: 'travelAgencyReport',
				redirect: '/reportManagement/travelAgencyReport/list',
				meta: {
					title: '行程单结算总表',
					isDetail: false, // 在左侧的导航栏不会展示
				},
				children: [
					{
						path: 'list',
						component: () => import('@/views/reportManagement/travelAgencyReport/index.vue'),
						name: 'travelAgencyReportList',
						meta: {
							title: '首页',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
				],
			},
			{
				path: 'hotelItineraryReport',
				name: 'hotelItineraryReport',
				redirect: '/reportManagement/hotelItineraryReport/list',
				meta: {
					title: '酒店行程单结算表',
					isDetail: true, // 在左侧的导航栏不会展示
				},
				children: [
					{
						path: 'list',
						component: () => import('@/views/reportManagement/scenicSpotTransferReport/index.vue'),
						name: 'hotelItineraryReportList',
						meta: {
							title: '首页',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'orderList',
						component: () => import('@/views/reportManagement/scenicSpotTransferReport/components/tripList.vue'),
						name: 'hotelItineraryReportOrderList',
						meta: {
							title: '查看订单',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
				],
			},
			{
				path: 'groupItineraryReport',
				name: 'groupItineraryReport',
				redirect: '/reportManagement/groupItineraryReport/list',
				meta: {
					title: '集团行程单结算表',
					isDetail: true, // 在左侧的导航栏不会展示
				},
				children: [
					{
						path: 'list',
						component: () => import('@/views/reportManagement/scenicSpotTransferReport/index.vue'),
						name: 'groupItineraryReportList',
						meta: {
							title: '首页',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'orderList',
						component: () => import('@/views/reportManagement/scenicSpotTransferReport/components/tripList.vue'),
						name: 'groupItineraryReportOrderList',
						meta: {
							title: '查看订单',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
				],
			},
			{
				path: 'associationItineraryReport',
				name: 'associationItineraryReport',
				redirect: '/reportManagement/associationItineraryReport/list',
				meta: {
					title: '协会行程单结算表',
					isDetail: true, // 在左侧的导航栏不会展示
				},
				children: [
					{
						path: 'list',
						component: () => import('@/views/reportManagement/scenicSpotTransferReport/index.vue'),
						name: 'associationItineraryReportList',
						meta: {
							title: '首页',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'orderList',
						component: () => import('@/views/reportManagement/scenicSpotTransferReport/components/tripList.vue'),
						name: 'associationItineraryReportOrderList',
						meta: {
							title: '查看订单',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
				],
			},
			{
				path: 'supervisorItineraryReport',
				name: 'supervisorItineraryReport',
				redirect: '/reportManagement/supervisorItineraryReport/list',
				meta: {
					title: '监理行程单结算表',
					isDetail: true, // 在左侧的导航栏不会展示
				},
				children: [
					{
						path: 'list',
						component: () => import('@/views/reportManagement/scenicSpotTransferReport/index.vue'),
						name: 'supervisorItineraryReportList',
						meta: {
							title: '首页',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'orderList',
						component: () => import('@/views/reportManagement/scenicSpotTransferReport/components/tripList.vue'),
						name: 'supervisorItineraryReportOrderList',
						meta: {
							title: '查看订单',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
				],
			},
			{
				path: 'yktItineraryReport',
				name: 'yktItineraryReport',
				redirect: '/reportManagement/yktItineraryReport/list',
				meta: {
					title: '一卡通行程单结算表',
					isDetail: true, // 在左侧的导航栏不会展示
				},
				children: [
					{
						path: 'list',
						component: () => import('@/views/reportManagement/scenicSpotTransferReport/index.vue'),
						name: 'yktItineraryReportList',
						meta: {
							title: '首页',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'orderList',
						component: () => import('@/views/reportManagement/scenicSpotTransferReport/components/tripList.vue'),
						name: 'yktItineraryReportOrderList',
						meta: {
							title: '查看订单',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
				],
			},
		],
		
	},
];
