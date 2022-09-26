export default [
	{
		path: '/hotelManagement',
		name: '',
		redirect: '/hotelManagement/star',
		meta: {
			title: '酒店管理',
		},
		component: () => import('@/components/layout/index.vue'),
		children: [
			{
				path: 'star',
				component: () => import('@/views/hotelManagement/star/index.vue'),
				name: 'star',
				meta: {
					title: '星级管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
				},
			},
			{
				path: 'hotelBaseInfo',
				name: 'hotelBaseInfo',
				meta: {
					title: '基础信息管理',
				},
				children: [
					{
						path: '',
						component: () => import('@/views/hotelManagement/baseInfo/index.vue'),
						meta: {
							title: '',
							isDetail: true,
						},
					},
					{
						path: 'hotelStarEdit',
						name: 'hotelStarEdit',
						component: () => import('@/views/hotelManagement/baseInfo/pages/hotelStar-edit/hotelStar-edit.vue'),
						meta: {
							title: '编辑',
							isDetail: true,
						},
					},
					{
						path: 'hotelStarDisplay',
						name: 'hotelStarDisplay',
						component: () => import('@/views/hotelManagement/baseInfo/pages/hotelStar-display/hotelStar-display.vue'),
						meta: {
							title: '审核',
							isDetail: true,
						},
					},
				],
			},
			{
				path: 'roomStatus',
				name: 'roomStatus',
				meta: {
					title: '房态上报管理',
				},
				children: [
					{
						path: '',
						component: () => import('@/views/hotelManagement/roomStatus/index.vue'),
						meta: {
							title: '',
							isDetail: true,
						},
					},
					{
						path: 'roomStatusEdit',
						name: 'roomStatusEdit',
						component: () => import('@/views/hotelManagement/roomStatus/pages/roomStatus-edit/roomStatus-edit.vue'),
						meta: {
							title: '编辑',
							isDetail: true,
						},
					},
				],
			},

			{
				path: 'hotelOrder',
				redirect: '/hotelManagement/hotelOrder/index',
				name: 'hotelOrder',
				meta: {
					title: '订单管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					// isDetail: true, // 在左侧的导航栏不会展示
				},
				children: [
					{
						path: 'index',
						component: () => import('@/views/hotelManagement/order/index.vue'),
						meta: {
							title: '订单管理',
							isDetail: true,
						},
					},
					{
						path: 'orderEdit',
						name: 'orderEdit',
						component: () => import('@/views/hotelManagement/order/Edit/index.vue'),
						meta: {
							title: '编辑',
							isDetail: true,
						},
					},
				],
			},
		],
	},
];
