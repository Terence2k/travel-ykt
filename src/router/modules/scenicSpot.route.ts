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
			{
				path: 'order-manage',
				name: 'order-manage',
				redirect: '/scenic-spot/order-manage/list',
				meta: {
					title: '订单管理',
				},
				children: [
					{
						path: 'list',
						component: () => import('@/views/scenicSpot/orderManage/index.vue'),
						name: 'order-manage-list',
						meta: {
							title: '首页',
							activeMeun: 'order-manage',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'edit',
						component: () => import('@/views/scenicSpot/orderManage/components/edit.vue'),
						name: 'order-manage-edit',
						meta: {
							title: '编辑',
							activeMeun: 'order-manage',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
				],
			},

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
				path: 'multicast',
				redirect: '/scenic-spot/multicast/list',
				name: 'multicast',
				meta: {
					title: '联票',
				},
				children: [
					{
						path: 'edit',
						// component: () => import('@/views/scenicSpot/multicastTick/components/edit.vue'),
						component: () => import('@/views/scenicSpot/multicastTick/components/edit.vue'),
						name: 'multicast-edit',
						meta: {
							title: '编辑',
							activeMeun: 'multicast',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'list',
						component: () => import('@/views/scenicSpot/multicastTick/index.vue'),
						name: 'multicast-list',
						meta: {
							title: '列表',
							activeMeun: 'multicast',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
				],
			},
			{
				path: 'showTickets',
				name: 'showTickets',
				redirect: '/scenic-spot/showTickets/list',
				meta: {
					title: '演出票',
				},
				children: [
					{
						path: 'list',
						component: () => import('@/views/scenicSpot/showTickets/index.vue'),
						name: 'showTickets-list',
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
			{
				path: 'shows',
				name: 'shows',
				redirect: '/scenic-spot/shows/list',
				meta: {
					title: '演出节目管理',
				},
				children: [
					{
						path: 'list',
						component: () => import('@/views/scenicSpot/show/index.vue'),
						name: 'shows-list',
						meta: {
							title: '首页',
							activeMeun: 'information',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					{
						path: 'show-edit',
						component: () => import('@/views/scenicSpot/show/components/edit.vue'),
						name: 'show-edit',
						meta: {
							title: '编辑',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
				],
			},
			{
				path: 'show-venue',
				name: 'show-vueue',
				redirect: '/scenic-spot/show-venue/list',
				meta: {
					title: '演出场馆管理',
				},
				children: [
					{
						path: 'list',
						component: () => import('@/views/scenicSpot/showVenue/index.vue'),
						name: 'show-venue-list',
						meta: {
							title: '首页',
							activeMeun: 'information',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					},
					// {
					// 	path: 'show_edit',
					// 	component: () => import('@/views/scenicSpot/showTickets/components/showEdit.vue'),
					// 	name: 'showTickets-show_edit',
					// 	meta: {
					// 		title: '编辑',
					// 		isDetail: true, // 在左侧的导航栏不会展示
					// 	},
					// },
				],
			},
			{
				path: 'writeOffTime',
				name: 'writeOffTime',
				redirect: '/scenic-spot/writeOffTime/list',
				meta: {
					title: '核销时间段管理',
				},
				children: [
					{
						path: 'list',
						component: () => import('@/views/scenicSpot/writeOffTime/index.vue'),
						name: 'writeOffTime-list',
						meta: {
							title: '首页',
							activeMeun: 'information',
							isDetail: true, // 在左侧的导航栏不会展示
						},
					}
				],
			},
		],
	},
];
