export default [
	{
		path: '/catering',
		name: '',
		redirect: '/catering/basic_Information',
		meta: {
			title: '餐饮管理',
		},
		component: () => import('@/components/layout/index.vue'),
		children: [
			{
				path: 'basic_Information',
				name: 'basicInformation',
				redirect: '/catering/basic_Information/index',
				meta: {
					title: '基础信息管理',
				},
				children: [
					{
						path: 'index',
						name: 'index',
						component: () => import('@/views/cateringManage/basicInformation/index.vue'),
						meta: {
							title: '',
							isDetail: true,
						},
					},
					{
						path: 'basic_edit',
						component: () => import('@/views/cateringManage/basicInformation/edit.vue'),
						name: 'basic_edit',
						meta: {
							title: '编辑',
							isDetail: true,
						},
					},
					{
						path: 'basic_info',
						component: () => import('@/views/cateringManage/basicInformation/info.vue'),
						name: 'basic_info',
						meta: {
							title: '查看',
							isDetail: true,
						},
					},
				],
			},
			{
				path: 'product_Management',
				name: 'productManagement',
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
							isDetail: true,
						},
					},
					{
						path: 'index',
						component: () => import('@/views/cateringManage/product/index.vue'),
						meta: {
							title: '产品信息',
							isDetail: true,
						},
					},
					{
						path: 'product_info',
						component: () => import('@/views/cateringManage/product/info.vue'),
						name: 'product_info',
						meta: {
							title: '查看',
							isDetail: true,
						},
					},
				],
			},
			{
				path: 'order_Management',
				name: 'orderManagement',
				meta: {
					title: '订单管理',
				},
				children: [
					{
						path: '',
						name: '/',
						component: () => import('@/views/cateringManage/order/index.vue'),
						meta: {
							title: '订单信息',
							isDetail: true,
						},
					},
					{
						path: 'order_detail',
						component: () => import('@/views/cateringManage/order/detail.vue'),
						name: 'order_detail',
						meta: {
							title: '查看',
							isDetail: true,
						},
					},
				],
			},
		],
	},
];
