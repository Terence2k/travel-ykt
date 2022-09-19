export default [
	{
		path: '/scenic-spot',
		name: '',
		redirect: '/scenic-spot/information',
		meta: {
			title: '景区管理',
		},
		component: () => import('@/components/layout/index.vue'),
		children: [
			{
				path: 'information',
				component: () => import('@/views/scenicSpot/scenicSpotInformation/index.vue'),
				name: 'information',
				meta: {
					title: '景区管理信息',
				},
			},
			{
				path: 'order-manage',
				component: () => import('@/views/scenicSpot/orderManage/index.vue'),
				name: 'order-manage',
				meta: {
					title: '订单管理',
				},
			},
		],
	},
];
