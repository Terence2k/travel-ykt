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
				path: 'baseInfo',
				component: () => import('@/views/hotelManagement/baseInfo/index.vue'),
				name: 'baseInfo',
				meta: {
					title: '基础信息管理',
				},
				children: [
					{
						path: 'edit',
						name: 'edit',
						component: () => import('@/views/hotelManagement/baseInfo/pages/hotelStar-edit/hotelStar-edit.vue'),
						meta: {
							title: '编辑',
							isDetail: true,
						},
					},
				],
			},
			{
				path: 'roomStatus',
				component: () => import('@/views/hotelManagement/roomStatus/index.vue'),
				name: 'roomStatus',
				meta: {
					title: '用户管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					isDetail: false, // 在左侧的导航栏不会展示
				},
			},

			{
				path: 'order',
				component: () => import('@/views/hotelManagement/order/index.vue'),
				name: 'order',
				meta: {
					title: '订单管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					// isDetail: true, // 在左侧的导航栏不会展示
				},
			},
		],
	},
];
