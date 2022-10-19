export default [
	{
		path: '/catering',
		name: 'catering',
		redirect: '/catering/product_Management',
		meta: {
			title: '餐饮管理',
		},
		component: () => import('@/components/layout/index.vue'),
		children: [
			{
				path: 'basic_Information',
				name: 'basic_Information',
				redirect: '/catering/basic_Information/index',
				meta: {
					title: '基础信息管理',
				},
				children: [
					{
						path: 'index',
						component: () => import('@/views/cateringManage/basicInformation/index.vue'),
						meta: {
							title: '首页',
							activeMeun: 'basic_Information',
							isDetail: true,
						},
					},
					{
						path: 'basic_edit',
						component: () => import('@/views/cateringManage/basicInformation/edit.vue'),
						name: 'basic_edit',
						meta: {
							title: '编辑',
							activeMeun: 'basic_Information',
							isDetail: true,
						},
					},
					{
						path: 'basic_info',
						component: () => import('@/views/cateringManage/basicInformation/info.vue'),
						name: 'basic_info',
						meta: {
							title: '查看',
							activeMeun: 'basic_Information',
							isDetail: true,
						},
					},
				],
			},
			{
				path: 'product_Management',
				name: 'product_Management',
				redirect: '/catering/product_Management/index',
				meta: {
					title: '产品管理',
				},
				children: [
					{
						path: 'product_edit',
						component: () => import('@/views/cateringManage/product/edit.vue'),
						name: 'product_edit',
						meta: {
							title: '编辑',
							activeMeun: 'product_Management',
							isDetail: true,
						},
					},
					{
						path: 'product_add',
						component: () => import('@/views/cateringManage/product/add.vue'),
						name: 'product_add',
						meta: {
							activeMeun: 'product_Management',
							title: '新增',
							isDetail: true,
						},
					},
					{
						path: 'index',
						component: () => import('@/views/cateringManage/product/index.vue'),
						meta: {
							title: '产品信息',
							activeMeun: 'product_Management',
							isDetail: true,
						},
					},
					{
						path: 'product_info',
						component: () => import('@/views/cateringManage/product/info.vue'),
						name: 'product_info',
						meta: {
							activeMeun: 'productManagement',
							title: '查看',
							isDetail: true,
						},
					},
				],
			},
			{
				path: 'order_Management',
				name: 'order_Management',
				redirect: '/catering/order_Management/index',
				meta: {
					title: '订单管理',
				},
				children: [
					{
						path: 'index',
						component: () => import('@/views/cateringManage/order/index.vue'),
						meta: {
							title: '订单信息',
							activeMeun: 'order_Management',
							isDetail: true,
						},
					},
					{
						path: 'order_detail',
						component: () => import('@/views/cateringManage/order/detail.vue'),
						name: 'order_detail',
						meta: {
							title: '查看',
							activeMeun: 'order_Management',
							isDetail: true,
						},
					},
				],
			},
		],
	},
];
