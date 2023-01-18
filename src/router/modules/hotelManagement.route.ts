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
				name: 'star',
				component: () => import('@/views/hotelManagement/star/index.vue'),
				meta: {
					title: '星级管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
				},
			},
			{
				path: 'roomType',
				name: 'roomType',
				redirect: '/hotelManagement/roomType/list',
				meta: {
					title: '房型管理',
				},
				children: [
					{
						path: 'list',
						name: 'roomType-list',
						component: () => import('@/views/hotelManagement/roomType/index.vue'),
						meta: {
							title: '基础信息',
							isDetail: true,
						},
					},
					{
						path: 'roomTypeEdit',
						name: 'roomTypeEdit',
						component: () => import('@/views/hotelManagement/roomType/pages/roomType-edit/roomType-edit.vue'),
						meta: {
							title: '编辑',
							isDetail: true,
						},
					},
					{
						path: 'roomTypeCheck',
						name: 'roomTypeCheck',
						component: () => import('@/views/hotelManagement/roomType/pages/roomType-check/roomType-check.vue'),
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
				redirect: '/hotelManagement/roomStatus/list',
				meta: {
					title: '房态上报管理',
				},
				children: [
					{
						path: 'list',
						name: 'roomStatus-list',
						component: () => import('@/views/hotelManagement/roomStatus/index.vue'),
						meta: {
							title: '房态上报',
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
							title: '订单查看',
							isDetail: true,
						},
					},
					{
						path: 'orderEdit',
						name: 'orderEdit',
						component: () => import('@/views/hotelManagement/order/Edit/index.vue'),
						meta: {
							activeMeun: 'hotelOrder',
							title: '编辑',
							isDetail: true,
						},
					},
					{
						path: 'orderBrushUp',
						name: 'orderBrushUp',
						component: () => import('@/views/hotelManagement/order/brushup/index.vue'),
						meta: {
							activeMeun: 'hotelOrder',
							title: '改刷',
							isDetail: true,
						},
					},
				],
			},

			{
				path: 'roomBooking',
				name: 'roomBooking',
				component: () => import('@/views/hotelManagement/roomBooking/index.vue'),
				meta: {
					title: '房间预定管理',
				},
			},

			{
				path: 'systemRoomType',
				name: 'systemRoomType',
				component: () => import('@/views/hotelManagement/systemRoomType/index.vue'),
				meta: {
					title: '系统房型管理',
				},
			},
		],
	},
];
