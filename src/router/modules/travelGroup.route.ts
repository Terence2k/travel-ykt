export default [
	{
		path: '/travel',
		name: '',
		redirect: '/travel/travel_manage',
		meta: {
			title: '旅行社管理',
		},
		component: () => import('@/components/layout/index.vue'),
		children: [
			{
				path: 'travel_agency',
				component: () => import('@/views/touristAgency/index.vue'),

				name: 'travel_agency',
				meta: {
					title: '旅行社管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					// isDetail: true, // 在左侧的导航栏不会展示
				},
			},
			{
				path: 'travel_manage',
				component: () => import('@/views/travelManagement/index.vue'),

				name: 'travel_manage',
				meta: {
					title: '行程管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					// isDetail: true, // 在左侧的导航栏不会展示
				},
			},
			{
				path: 'travel_list',
				component: () => import('@/views/travelList/index.vue'),

				name: 'travel_list',
				meta: {
					title: '接团行程管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					// isDetail: true, // 在左侧的导航栏不会展示
				},
			},
		],
	},
];
