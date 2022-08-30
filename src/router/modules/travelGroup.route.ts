export default [
	{
		path: '/travel',
		name: '',
		redirect: '/travel/index',
		meta: {
			title: '旅行社管理',
		},
		component: () => import('@/components/layout/index.vue'),
		children: [
			{
				path: 'index',
				component: () => import('@/views/touristAgency/index.vue'),
				name: 'travel',
				meta: {
					title: '旅行社管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					// isDetail: true, // 在左侧的导航栏不会展示
				},
			},
		],
	},
];
