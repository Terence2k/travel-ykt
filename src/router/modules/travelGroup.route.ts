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
						},
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
					},
				],
			},
			// Enterprise Information Management
			{
				path: 'enterpriseInfoManagement',
				name: 'enterpriseInfoManagement',
				redirect: '/travel/enterpriseInfoManagement/enterpriseInfo',
				meta: {
					title: '企业信息管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					// isDetail: true, // 在左侧的导航栏不会展示
				},
				children: [
					{
						path: 'enterpriseInfo',
						component: () => import('@/views/enterpriseInfoManagement/enterpriseInfo.vue'),
						name: 'enterpriseInfo',
						meta: {
							title: '企业信息',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'modifyEnterpriseInfo',
						component: () => import('@/views/enterpriseInfoManagement/modifyEnterpriseInfo.vue'),
						name: 'modifyEnterpriseInfo',
						meta: {
							title: '修改企业信息',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
				],
			},
			// tourGuideManage
			{
				path: 'tourGuideManage',
				name: 'tourGuideManage',
				redirect: '/travel/tourGuideManage/tourGuideList',
				meta: {
					title: '导游管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					// isDetail: true, // 在左侧的导航栏不会展示
				},
				children: [
					{
						path: 'tourGuideList',
						component: () => import('@/views/tourGuideManage/tourGuideList.vue'),
						name: 'tourGuideList',
						meta: {
							title: '已委派的导游',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'addTourGuide',
						component: () => import('@/views/tourGuideManage/addTourGuide.vue'),
						name: 'addTourGuide',
						meta: {
							title: '委派新导游',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
				],
			},
			{
				path: 'travelTtemplate',
				name: 'travelTtemplate',
				meta: {
					title: '行程模板管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					// isDetail: true, // 在左侧的导航栏不会展示
				},
				redirect: '/travel/travelTtemplate/templateList',
				children: [
					{
						path: 'templateList',
						component: () => import('@/views/travelManagement/travelTemplate/index.vue'),
						name: 'templateList',
						meta: {
							title: '基础信息',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
				],
			},
		],
	},
];
