import type { TableColumnsType } from 'ant-design-vue';
// 固定表头
export const fixedColumn: Array<TableColumnsType> = [
	{
		title: '组团社',
		dataIndex: 'travelName',
		key: 'travelName',
		width: 100,
	},
	{
		title: '地接社',
		dataIndex: 'subTravelName',
		key: 'subTravelName',
		width: 100,
	},
	{
		title: '团队类型',
		dataIndex: 'travelTypeName',
		key: 'travelTypeName',
		width: 100,
	},
	{
		title: '人数',
		dataIndex: 'peopleNum',
		key: 'peopleNum',
		width: 80,
	},
	{
		title: '团款',
		dataIndex: 'frozenPrice',
		key: 'frozenPrice',
		width: 100,
	},
	{
		title: '核销总费用',
		dataIndex: 'settlementPrice',
		key: 'settlementPrice',
		width: 100,
	},
	{
		title: '未消费费用',
		dataIndex: 'unSettlementPrice',
		key: 'unSettlementPrice',
		width: 100,
	},
	{
		title: '古维费用',
		key: 'hmVo',
		children: [
			{
				title: '冻结金额',
				dataIndex: 'frozenPrice',
				key: 'hmVo',
				width: 100,
			},
			{
				title: '已核销金额',
				dataIndex: 'settlementPrice',
				key: 'hmVo',
				width: 100,
			},
			{
				title: '实收',
				dataIndex: 'actualPrice',
				key: 'hmVo',
				width: 100,
			},
		],
	},
	{
		title: '景区',
		key: 'ticketVo',
		children: [
			{
				title: '冻结金额',
				dataIndex: 'frozenPrice',
				key: 'ticketVo',
				width: 100,
			},
			{
				title: '已核销金额',
				dataIndex: 'settlementPrice',
				key: 'ticketVo',
				width: 100,
			},
			{
				title: '实收',
				dataIndex: 'actualPrice',
				key: 'ticketVo',
				width: 100,
			},
		],
	},
	{
		title: '酒店',
		key: 'hotelVo',
		children: [
			{
				title: '冻结金额',
				dataIndex: 'frozenPrice',
				key: 'hotelVo',
				width: 100,
			},
			{
				title: '已核销金额',
				dataIndex: 'settlementPrice',
				key: 'hotelVo',
				width: 100,
			},
			{
				title: '实收',
				dataIndex: 'actualPrice',
				key: 'hotelVo',
				width: 100,
			},
		],
	},
	{
		title: '餐饮',
		key: 'cateringVo',
		children: [
			{
				title: '冻结金额',
				dataIndex: 'frozenPrice',
				key: 'cateringVo',
				width: 100,
			},
			{
				title: '已核销金额',
				dataIndex: 'settlementPrice',
				key: 'cateringVo',
				width: 100,
			},
			{
				title: '实收',
				dataIndex: 'actualPrice',
				key: 'cateringVo',
				width: 100,
			},
		],
	},
	{
		title: '监理',
		key: 'superviseVo',
		children: [
			{
				title: '实收',
				dataIndex: 'actualPrice',
				key: 'superviseVo',
				width: 100,
			},
		],
	},
	{
		title: '协会',
		key: 'associationVo',
		children: [
			{
				title: '实收',
				dataIndex: 'actualPrice',
				key: 'associationVo',
				width: 100,
			},
		],
	},
	{
		title: '集团',
		key: 'groupVo',
		children: [
			{
				title: '实收',
				dataIndex: 'actualPrice',
				key: 'groupVo',
				width: 100,
			},
		],
	},
	{
		title: '文旅局',
		key: 'cultureBureauVo',
		children: [
			{
				title: '实收',
				dataIndex: 'actualPrice',
				key: 'cultureBureauVo',
				width: 100,
			},
		],
	},
	{
		title: '一卡通',
		key: 'yktVo',
		children: [
			{
				title: '实收',
				dataIndex: 'actualPrice',
				key: 'yktVo',
				width: 100,
			},
		],
	},
	{
		title: '地接社',
		key: 'subTravelVo',
		children: [
			{
				title: '实收',
				dataIndex: 'actualPrice',
				key: 'subTravelVo',
				width: 100,
			},
			{
				title: '未消费费用',
				dataIndex: 'unSettlementPrice',
				key: 'subTravelVo',
				width: 100,
			},
		],
	},
];
