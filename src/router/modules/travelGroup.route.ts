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
					title: '发团行程管理',
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
							// title: '发团行程管理',
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
					{
						path: 'travel_detail',
						component: () => import('@/views/travelManagement/travelDetail.vue'),
						name: 'travel_detail',
						meta: {
							title: '行程详情',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
				],
			},
			{
				path: 'enterpriseInfoManagement',
				name: 'enterpriseInfoManagement',
				redirect: '/travel/enterpriseInfoManagement/travelEnterpriseInfo',
				meta: {
					title: '企业信息管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					// isDetail: true, // 在左侧的导航栏不会展示
				},
				children: [
					{
						path: 'travelEnterpriseInfo',
						component: () => import('@/views/enterpriseInfoManagement/travelEnterpriseInfo.vue'),
						name: 'travelEnterpriseInfo',
						meta: {
							title: '企业信息',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'membershipManagement/id/:id/contactName/:contactName/phone/:phone',
						component: () => import('@/views/enterpriseInfoManagement/membershipManagement.vue'),
						name: 'membershipManagement',
						meta: {
							title: '入会管理',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
						props: true
					},
					{
						path: 'modifyEnterpriseInfo/name/:name/addressDetail/:addressDetail/legalPerson/:legalPerson/managementRange/:managementRange/registeredCapital/:registeredCapital/establishTime/:establishTime/businessTerm/:businessTerm/contactName/:contactName/phone/:phone/accountType/:accountType/bankAccountName/:bankAccountName/accountAddress/:accountAddress/bankAccount/:bankAccount/businessLicenseUrl/:businessLicenseUrl/manageUrl/:manageUrl/oid/:oid',
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
			// fundManagement
			{
				path: 'fund',
				name: 'fund',
				redirect: '/travel/fund/fundManagement',
				meta: {
					title: '资金管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					// isDetail: true, // 在左侧的导航栏不会展示
				},
				children: [
					{
						path: 'fundManagement',
						component: () => import('@/views/fundManagement/index.vue'),
						name: 'fundManagement',
						meta: {
							title: '',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'recharge',
						component: () => import('@/views/fundManagement/recharge.vue'),
						name: 'recharge',
						meta: {
							title: '充值',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
				]
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
				redirect: '/travel/travelTtemplate/list',
				children: [
					{
						path: 'list',
						component: () => import('@/views/travelManagement/travelTemplate/index.vue'),
						meta: {
							title: '基础信息',
							activeMeun: 'travelTtemplate',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'info',
						component: () => import('@/views/travelManagement/travelTemplate/tabs/index.vue'),
						name: 'info',
						meta: {
							title: '查看',
							activeMeun: 'travelTtemplate',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
				],
			},
			{
				path: 'take_group',
				redirect: '/travel/take_group/take_group_list',
				name: 'take_group',
				meta: {
					title: '接团行程管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					// isDetail: true, // 在左侧的导航栏不会展示
				},
				children: [
					{
						path: 'take_group_list',
						component: () => import('@/views/travelManagement/travelTakeGroupList.vue'),

						name: 'take_group_list',
						meta: {
							// title: '接团行程管理',
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
