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
					{
						path: 'travel_log',
						component: () => import('@/views/travelManagement/travelLog.vue'),
						name: 'travel_log',
						meta: {
							title: '行程日志',
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
						props: true,
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
				],
			},
			// storeManagement
			{
				path: 'storeManagement',
				name: 'storeManagement',
				component: () => import('@/views/storeManagement/index.vue'),
				meta: {
					title: '散客门店管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					// isDetail: true, // 在左侧的导航栏不会展示
				},
			},
			// individualGroupOperators
			{
				path: 'individualGroupOperators',
				name: 'individualGroupOperators',
				component: () => import('@/views/individualGroupOperators/index.vue'),
				meta: {
					title: '散客拼团操作员管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					// isDetail: true, // 在左侧的导航栏不会展示
				},
			},
			// touristsElectronicContract
			{
				path: 'touristsElectronicContract',
				name: 'touristsElectronicContract',
				redirect: '/travel/touristsElectronicContract/electronicContratList',
				// component: () => import('@/views/touristsElectronicContract/index.vue'),
				meta: {
					title: '散客电子合同',
					// icon: 'liulanqi',
					// auth: ["admin"],
					// isDetail: true, // 在左侧的导航栏不会展示
				},
				children: [
					{
						path: 'electronicContratList',
						name: 'electronicContratList',
						component: () => import('@/views/touristsElectronicContract/index.vue'),
						meta: {
							title: '',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'addElectronicContrat',
						name: 'addElectronicContrat',
						component: () => import('@/views/touristsElectronicContract/add.vue'),
						meta: {
							title: '新增',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'electronicContratDetails',
						name: 'electronicContratDetails',
						component: () => import('@/views/touristsElectronicContract/details.vue'),
						meta: {
							title: '合同详情',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
				],
			},
			{
				path: 'singleEntrustmentContract',
				name: 'singleEntrustmentContract',
				redirect: '/travel/singleEntrustmentContract/singleEntrustmentContractList',
				// component: () => import('@/views/touristsElectronicContract/index.vue'),
				meta: {
					title: '单项委托合同',
					// icon: 'liulanqi',
					// auth: ["admin"],
					// isDetail: true, // 在左侧的导航栏不会展示
				},
				children: [
					{
						path: 'singleEntrustmentContractList',
						name: 'singleEntrustmentContractList',
						component: () => import('@/views/singleEntrustmentContract/index.vue'),
						meta: {
							title: '',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'addSingleEntrustmentContract',
						name: 'addSingleEntrustmentContract',
						component: () => import('@/views/singleEntrustmentContract/add.vue'),
						meta: {
							title: '新增',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'singleEntrustmentContractDetails',
						name: 'singleEntrustmentContractDetails',
						component: () => import('@/views/singleEntrustmentContract/details.vue'),
						meta: {
							title: '合同详情',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
				],
			},
			// lineManagement
			{
				path: 'lineManagement',
				name: 'lineManagement',
				component: () => import('@/views/lineManagement/index.vue'),
				meta: {
					title: '线路管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					// isDetail: true, // 在左侧的导航栏不会展示
				},
			},
			// individualTouristsGroup
			{
				path: 'tourists',
				name: 'tourists',
				component: () => import('@/views/individualTouristsGroup/index.vue'),
				redirect: '/travel/tourists/individualTouristsGroup',
				meta: {
					title: '散客拼团',
					// icon: 'liulanqi',
					// auth: ["admin"],
					// isDetail: true, // 在左侧的导航栏不会展示
				},
				children: [
					{
						path: 'newGroup',
						name: 'newGroup',
						component: () => import('@/views/individualTouristsGroup/newGroup.vue'),
						meta: {
							title: '新增拼团',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'individualTouristsGroup',
						name: 'individualTouristsGroup',
						component: () => import('@/views/individualTouristsGroup/touristsList.vue'),
						meta: {
							title: '',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'tourists-revoke',
						name: 'tourists-revoke',
						component: () => import('@/views/individualTouristsGroup/tour-revoke.vue'),
						// component: () => import('@/views/individualTouristsGroup/newGroup.vue'),
						meta: {
							title: '撤销',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'individualTouristsGroupDetail',
						name: 'individualTouristsGroupDetail',
						component: () => import('@/views/individualTouristsGroup/travelDetail.vue'),
						meta: {
							title: '行程详情',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'tourists_alter',
						name: 'tourists_alter',
						component: () => import('@/views/individualTouristsGroup/alter/index.vue'),
						meta: {
							title: '行程单变更填写',
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
					{
						path: 'changetravel',
						component: () => import('@/views/travelManagement/travelTakeGroupList/chang.vue'),
						activeMeun: 'take_group_list',
						name: 'changetravel',
						meta: {
							title: '行程变更',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'modify_o_product',
						component: () => import('@/views/travelManagement/travelTakeGroupList/Modifyproduct/index.vue'),
						activeMeun: 'take_group',
						name: 'modify_o_product',
						meta: {
							title: '预定产品信息',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'modify_product_edit',
						component: () => import('@/views/travelManagement/travelTakeGroupList/Modifyproduct/edit.vue'),
						activeMeun: 'take_group',
						name: 'modify_product_edit',
						meta: {
							title: '修改预定产品信息',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'addTourist',
						component: () => import('@/views/travelManagement/travelTakeGroupList/addTourist/addTourist.vue'),
						activeMeun: 'take_group_list',
						name: 'addTourist',
						meta: {
							title: '添加游客',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'revoke',
						component: () => import('@/views/travelManagement/travelTakeGroupList/revoke/revoke.vue'),
						activeMeun: 'take_group_list',
						name: 'revoke',
						meta: {
							title: '撤销并重提',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'take_group_travel_detail',
						component: () => import('@/views/travelManagement/travelDetail.vue'),
						activeMeun: 'take_group_list',
						name: 'take_group_travel_detail',
						meta: {
							title: '行程详情',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'take_group_add_travel',
						component: () => import('@/views/travelManagement/addTravel.vue'),
						name: 'take_group_add_travel',
						activeMeun: 'take_group_list',
						meta: {
							title: '新增行程',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
				],
			},
			{
				path: 'finance_audit',
				redirect: '/travel/finance_audit/finance_audit_list',
				name: 'finance_audit',
				meta: {
					title: '财务审核行程单',
					// icon: 'liulanqi',
					// auth: ["admin"],
					// isDetail: true, // 在左侧的导航栏不会展示
				},
				children: [
					{
						path: 'finance_audit_list',
						component: () => import('@/views/travelManagement/financeAuditList.vue'),
						name: 'finance_audit_list',
						meta: {
							// title: '财务审核行程单',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
				],
			},
			{
				path: 'administrative_audit',
				redirect: '/travel/administrative_audit/administrative_audit_list',
				name: 'administrative_audit',
				meta: {
					title: '管理部门审核行程单',
					// icon: 'liulanqi',
					// auth: ["admin"],
					// isDetail: true, // 在左侧的导航栏不会展示
				},
				children: [
					{
						path: 'administrative_audit_list',
						component: () => import('@/views/travelManagement/administrativeAuditList.vue'),
						name: 'administrative_audit_list',
						meta: {
							// title: '管理部门审核行程单',
							// icon: 'liulanqi',
							// auth: ["admin"],
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
				],
			},
			{
				path: 'revocationManagement',
				name: 'traval-revocationManagement',
				redirect: '/travel/revocationManagement/list',
				meta: {
					title: '撤销重提管理',
					// icon: 'liulanqi',
					// auth: ["admin"],
					isDetail: false, // 在左侧的导航栏不会展示
				},
				children: [
					{
						path: 'list',
						component: () => import('@/views/travelManagement/travelTakeGroupList/revocationManagement/index.vue'),
						name: 'travel-revocation-management-list',
						meta: {
							title: '列表页',
							activeMeun: 'revocationManagement',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					// {
					// 	path: 'exemption-management_edit',
					// 	component: () => import('@/views/gouvyManagement/exemptionManagement/details.vue'),
					// 	name: 'exemption-management_edit',
					// 	meta: {
					// 		title: '查看',
					// 		isDetail: true, // 在左侧的导航栏不会展示
					// 	},
					// },
				],
			},
			{
				path: 'travel_check',
				name: 'travel_check',
				meta: {
					title: '行程监管查看',
					// icon: 'liulanqi',
					// auth: ["admin"],
					// isDetail: true, // 在左侧的导航栏不会展示
				},
				component: () =>  import('@/views/travelManagement/travelCheck/travelCheck.vue')
			}
		],
	},
];
