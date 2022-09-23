export default [
	{
		path: '/scenic-spot',
		name: 'scenic-spot',
		redirect: '/scenic-spot/information',
		meta: {
			title: '景区管理',
		},
		component: () => import('@/components/layout/index.vue'),
		children: [
			{
				path: 'information',
				name: 'information',
				redirect: '/scenic-spot/information/list',
				meta: {
					title: '景区管理信息',
				},
				children: [
					{
						path: 'list',
						component: () => import('@/views/scenicSpot/scenicSpotInformation/index.vue'),
						name: 'information-list',
						meta: {
							title: '首页',
							activeMeun: 'information',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'edit',
						component: () => import('@/views/scenicSpot/scenicSpotInformation/components/edit.vue'),
						name: 'information-edit',
						meta: {
							title: '编辑',
							activeMeun: 'information',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'info',
						component: () => import('@/views/scenicSpot/scenicSpotInformation/components/info.vue'),
						name: 'information-info',
						meta: {
							title: '查看',
							activeMeun: 'information',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
				],
			},
			// {
			// 	path: 'order-manage',
			// 	component: () => import('@/views/scenicSpot/orderManage/index.vue'),
			// 	name: 'order-manage',
			// 	meta: {
			// 		title: '订单管理',
			// 	},
			// },
			{
				path: 'sold-out-history',
				component: () => import('@/views/scenicSpot/soldOutHistory/index.vue'),
				name: 'sold-out-history',
				meta: {
					title: '下架历史',
				},
			},
			{
				path: 'singleVote',
				redirect: '/scenic-spot/singleVote/list',
				name: 'singleVote',
				meta: {
					title: '单票',
				},
				children: [
					{
						path: 'edit',
						component: () => import('@/views/scenicSpot/singleVote/components/edit.vue'),
						name: 'singleVote-edit',
						meta: {
							title: '编辑',
							activeMeun: 'singleVote',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'list',
						component: () => import('@/views/scenicSpot/singleVote/index.vue'),
						name: 'singleVote-list',
						meta: {
							title: '列表',
							activeMeun: 'singleVote',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
				],
			},
			{
				path: 'showTickets',
				name: 'showTickets',
				redirect: '/scenic-spot/showTickets/index',
				meta: {
					title: '演出票',
				},
				children: [
					{
						path: 'index',
						component: () => import('@/views/scenicSpot/showTickets/index.vue'),
						name: 'showTickets-index',
						meta: {
							title: '首页',
							activeMeun: 'information',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'show_edit',
						component: () => import('@/views/scenicSpot/showTickets/components/showEdit.vue'),
						name: 'showTickets-show_edit',
						meta: {
							title: '编辑',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
				],
			},
		],
	},
];
