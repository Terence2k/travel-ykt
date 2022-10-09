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
				path: 'travel_manage',
				redirect: '/travel/travel_manage/travel_list',
				name: 'travel_manage',
				meta: {
					title: '行程管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					// isDetail: true, // 在左侧的导航栏不会展示
				},
				children: [
					{
						path: 'travel_list',
						component: () => import('@/views/travelManagement/travelList.vue'),
		
						name: 'travel_list',
						meta: {
							// title: '行程管理',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						}
					},
					{
						path: 'add_travel',
						component: () => import('@/views/travelManagement/addTravel.vue'),

						name: 'add_travel',
						meta: {
							title: '新增行程',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					}
				]
			}
		],
	},
];
