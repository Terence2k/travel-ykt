import type { TableColumnsType } from 'ant-design-vue';
// 固定表头
export const fixedColumn: Array<any> = [
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
		title: '未核销总费用',
		dataIndex: 'unSettlementPrice',
		key: 'unSettlementPrice',
		width: 100,
	},
	{
		title: '古维费冻结',
		dataIndex: 'hmFrozenPrice',
		key: 'hmFrozenPrice',
		width: 100,
	},
	{
		title: '酒店冻结',
		dataIndex: 'hotelFrozenPrice',
		key: 'hotelFrozenPrice',
		width: 100,
	},
	{
		title: '景点冻结',
		dataIndex: 'ticketFrozenPrice',
		key: 'ticketFrozenPrice',
		width: 100,
	},
	{
		title: '餐费冻结',
		dataIndex: 'cateringFrozenPrice',
		key: 'cateringFrozenPrice',
		width: 100,
	},
];
export const detailFixedColumn: Array<any> = [
	{
		title: '行程单号',
		dataIndex: 'itineraryNo',
		key: 'itineraryNo',
		width: 100,
	},
	{
		title: '自编团号',
		dataIndex: 'test',
		key: 'test',
		width: 100,
	},
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
		title: '结算时间',
		dataIndex: 'settlementTime',
		key: 'settlementTime',
		width: 130,
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
		title: '未核销总费用',
		dataIndex: 'unSettlementPrice',
		key: 'unSettlementPrice',
		width: 100,
	},
	{
		title: '古维费冻结',
		dataIndex: 'hmFrozenPrice',
		key: 'hmFrozenPrice',
		width: 100,
	},
	{
		title: '酒店冻结',
		dataIndex: 'hotelFrozenPrice',
		key: 'hotelFrozenPrice',
		width: 100,
	},
	{
		title: '景点冻结',
		dataIndex: 'ticketFrozenPrice',
		key: 'ticketFrozenPrice',
		width: 100,
	},
	{
		title: '餐费冻结',
		dataIndex: 'cateringFrozenPrice',
		key: 'cateringFrozenPrice',
		width: 100,
	},
];
export const notConsumed = {
	title: '未消费款项',
	key: 'unSettlementPriceVo',
	children: [
		{
			title: '小计',
			dataIndex: 'allPrice',
			key: 'unSettlementPriceVo',
			width: 100,
		},
		{
			title: '酒店',
			dataIndex: 'hotelPrice',
			key: 'unSettlementPriceVo',
			width: 100,
		},
		{
			title: '景点',
			dataIndex: 'ticketPrice',
			key: 'unSettlementPriceVo',
			width: 100,
		},
		{
			title: '餐费',
			dataIndex: 'cateringPrice',
			key: 'unSettlementPriceVo',
			width: 100,
		},
		{
			title: '古维',
			dataIndex: 'hmPrice',
			key: 'unSettlementPriceVo',
			width: 100,
		},
		{
			title: '手续费',
			dataIndex: 'rulePrice',
			key: 'unSettlementPriceVo',
			width: 100,
		},
	],
};
export const subTravel = {
	title: '地接社',
	key: 'subTravelVo',
	children: [
		{
			title: '未核销费用',
			dataIndex: 'unSettlementPrice',
			key: 'subTravelVo',
			width: 100,
		},
		{
			title: '实收',
			dataIndex: 'actualPrice',
			key: 'subTravelVo',
			width: 100,
		},
	],
};
export interface StateType {
	tableData: TableDataType;
	viewList: Array<any>;
	times: String;
}
export interface TableDataType {
	param: ParamType;
	data: Array<DataType>;
	total: number;
	loading: boolean;
	settlementStartTimeList: Array<any>;
}
export interface ParamType {
	itineraryNo?: number | string; //行程单号
	travelTypeId?: number | string | null; //团队类型id
	travelId?: number | string | null; //组团社id
	subTravelId?: number | string | null; //地接社id
	settlementStartTime: number | string | null; //结算开始时间
	settlementEndTime: number | string | null; //结算结束时间
	pageSize?: number; //页大小
	pageNo?: number; //页号
}
export interface DataType {
	travelId?: number; //组团社id
	travelName?: string; //组团社名称
	subTravelId?: number; //地接社id
	subTravelName?: string; //地接社名称
	travelTypeId?: number; //团队类型id
	travelTypeName?: string; //团队类型名称
	peopleNum?: number; //人数
	frozenPrice?: string; //团款
	settlementPrice?: string; //核销总费用
	unSettlementPrice?: string; //未消费费用
	hmFrozenPrice?: string; //古维冻结
	hotelFrozenPrice?: string; //酒店冻结
	ticketFrozenPrice?: string; //景区冻结
	cateringFrozenPrice?: string; //餐饮冻结
	subTravelVo?: subTravelVoType; //地接社
	unSettlementPriceVo?: unSettlementPriceVoType; //未消费款项
	comprehensiveGuideVoList?: Array<comprehensiveGuideVoListType>; //综费产品-导服费
	comprehensiveVoList?: Array<comprehensiveVoListType>; //综费产品-除导服费外
	itineraryNo?: string; // 行程单号
	settlementTime?: string; // 结算时间
	test?: string; // 自编团号
}
// 综费产品-导服费
export interface comprehensiveGuideVoListType {
	comprehensiveFeeProductId: number; //综费产品id
	comprehensiveFeeProductName: string; //综费产品名称
	travelActualPrice: string; //旅行社实收
	groupActualPrice: string; //集团实收
	frozenPrice: string; // 冻结金额
	ruleList: Array<ruleListType>;
}
export interface subTravelVoType {
	actualPrice: string; //实收
	ruleList: Array<ruleListType>;
	unSettlementPrice: string;
}
export interface unSettlementPriceVoType {
	hotelPrice: string; //酒店
	ticketPrice: string; //景点
	cateringPrice: string; //餐饮
	hmPrice: string; //古维
	rulePrice: string; //手续费
	allPrice: string; //小计
}
// 综费产品-除导服费外
export interface comprehensiveVoListType {
	comprehensiveFeeProductId: number; //综费产品id
	comprehensiveFeeProductName: string; //综费产品名称
	belongCompany: string; //费用归属  取字典父级code_value=BUSINESS_TYPE的所有子级
	actualPrice: string; //实收
	frozenPrice: string; // 冻结金额
	ruleList: Array<ruleListType>;
}
export interface ruleListType {
	ruleName: string; //规则名称
	rulePrice: string; //结算费用
	type: number | string;
}
export const getRulePrice = computed(() => (record: any, column: any) => {
	const ruleColumnKey = column.parent.split('-')[0];
	// 综费产品
	if (ruleColumnKey.includes('List')) {
		for (const key in record[ruleColumnKey]) {
			if (column.columnParentName === record[ruleColumnKey][key]['comprehensiveFeeProductName']) {
				for (const subKey in record[ruleColumnKey][key].ruleList) {
					if (
						column.title === record[ruleColumnKey][key].ruleList[subKey].ruleName &&
						Number(column.type) === Number(record[ruleColumnKey][key].ruleList[subKey].type)
					) {
						return `${amountYuanHandleFun(record[ruleColumnKey][key].ruleList[subKey].rulePrice)}`;
					}
				}
			}
		}
	}
	// 除综费产品外
	if (record[ruleColumnKey] && record[ruleColumnKey].ruleList && record[ruleColumnKey].ruleList.length) {
		for (const key in record[ruleColumnKey].ruleList) {
			if (column.title === record[ruleColumnKey].ruleList[key].ruleName && Number(column.type) === Number(record[ruleColumnKey].ruleList[key].type)) {
				return `${amountYuanHandleFun(record[ruleColumnKey].ruleList[key].rulePrice)}`;
			}
		}
	}
	return ``;
});
// 获取实收
export const getActualPrice = computed(() => (record: any, column: any) => {
	// 先判断非综费产品
	if (!column.key.includes('List')) {
		return record[column.key] ? amountYuanHandleFun(record[column.key]['actualPrice']) : '';
	} else {
		// 综费产品
		if (record[column.key]) {
			const idx = record[column.key].findIndex((r: any) => r.comprehensiveFeeProductName === column.parentTitle);
			if (idx !== -1) {
				return amountYuanHandleFun(record[column.key][idx][column.dataIndex]) || '';
			}
		}
	}
	return '';
});
//地接社未消费费用获取数据
export const getSubTravelVoUnSettlementPrice = computed(() => (record: any, column: any) => {
	return record[column.key] ? record[column.key][column.dataIndex] : '';
});
// 综费名称--导服费外
export const getSettlementRule = computed(() => (column, record) => {
	const data = column.comprehensiveVoList;
	for (const key in data) {
		if (record.title == `${data[key].comprehensiveFeeProductName}冻结`) {
			return amountYuanHandleFun(data[key].frozenPrice);
		}
	}
	return '';
});
// 综费名称--导服费
export const getSettlementRuleGuide = computed(() => (column, record) => {
	const data = column.comprehensiveGuideVoList;
	for (const key in data) {
		if (record.title == `${data[key].comprehensiveFeeProductName}冻结`) {
			return amountYuanHandleFun(data[key].frozenPrice);
		}
	}
	return '';
});
// 金额单位处理 分--元
export const amountHandle = computed(() => (num: any) => {
	let str = num / 100 > 0 ? num / 100 : 0;
	return str.toString();
});
const amountHandleFun = (num: any) => {
	let str = num / 100 > 0 ? num / 100 : 0;
	return str.toString();
};
// 金额单位处理 分--元
export const amountYuanHandle = computed(() => (num: any) => {
	let str = num / 100 > 0 ? num / 100 : 0;
	return str.toString();
});
const amountYuanHandleFun = (num: any) => {
	let str = num / 100 > 0 ? num / 100 : 0;
	return str.toString();
};

