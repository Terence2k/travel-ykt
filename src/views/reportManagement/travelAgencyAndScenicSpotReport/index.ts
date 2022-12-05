import type { TableColumnsType } from 'ant-design-vue';
// 固定表头
export const fixedColumn: Array<any> = [
	{
		title: '团单编号',
		dataIndex: 'travelName',
		key: 'travelName',
		width: 100,
	},
	{
		title: '自编团号',
		dataIndex: 'peopleNum',
		key: 'peopleNum',
		width: 100,
	},
	{
		title: '景区名称',
		dataIndex: 'frozenPrice',
		key: 'frozenPrice',
		width: 100,
	},
	{
		title: '票名称',
		dataIndex: 'settlementPrice',
		key: 'settlementPrice',
		width: 100,
	},
	{
		title: '旅行社',
		dataIndex: 'unSettlementPrice',
		key: 'unSettlementPrice',
		width: 100,
	},
	{
		title: '核销时间',
		dataIndex: 'unSettlementPrice',
		key: 'unSettlementPrice',
		width: 100,
	},
	{
		title: '门票单价（元）',
		dataIndex: 'unSettlementPrice',
		key: 'unSettlementPrice',
		width: 100,
	},
	{
		title: '分账单价',
		dataIndex: 'unSettlementPrice',
		key: 'unSettlementPrice',
		width: 100,
	},
	{
		title: '预定数',
		dataIndex: 'unSettlementPrice',
		key: 'unSettlementPrice',
		width: 100,
	},
	{
		title: '实刷数',
		dataIndex: 'unSettlementPrice',
		key: 'unSettlementPrice',
		width: 100,
	},
	{
		title: '预定金额（元）',
		dataIndex: 'unSettlementPrice',
		key: 'unSettlementPrice',
		width: 100,
	},
];
export interface StateType {
	tableData: TableDataType;
	viewList: Array<any>;
}
export interface TableDataType {
	param: ParamType;
	data: Array<DataType>;
	total: number;
	loading: boolean;
	settlementStartTimeList: Array<any>;
}
export interface ParamType {
	travelId: string | number | null; //组团社id
	subTravelId: string | number | null; //地接社id
	settlementTimeStart: string | number | null; //结算开始时间
	settlementTimeEnd: string | number | null; //结算结束时间
	travelTypeId: string | number | null; //团队类型id
	pageNo: number; //页号
	pageSize: number; //页大小
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
	hmVo?: voType; //古维费用
	ticketVo?: voType; //景区
	hotelVo?: voType; //酒店
	cateringVo?: superviseVoType; //餐饮
	groupVo?: superviseVoType; //集团
	cultureBureauVo?: superviseVoType; //文旅局
	yktVo?: superviseVoType; //一卡通
	subTravelVo?: subTravelVoType; //地接社
	superviseVo?: superviseVoType; //监理
	associationVo?: superviseVoType; //协会
	comprehensiveGuideVoList?: Array<comprehensiveGuideVoListType>; //综费产品-导服费
	comprehensiveVoList?: Array<comprehensiveVoListType>; //综费产品-除导服费外
}
// 古维费用 景区 酒店
export interface voType {
	frozenPrice: string; //冻结金额
	settlementPrice: string; //已核销金额
	actualPrice: string; //实收
	ruleList: Array<ruleListType>;
}
// 餐饮 监理 协会 集团 文旅局 一卡通 地接社
export interface superviseVoType {
	actualPrice: string; //实收
	ruleList: Array<ruleListType>;
}
// 综费产品-导服费
export interface comprehensiveGuideVoListType {
	comprehensiveFeeProductId: number; //综费产品id
	comprehensiveFeeProductName: string; //综费产品名称
	travelActualPrice: string; //旅行社实收
	groupActualPrice: string; //集团实收
	ruleList: Array<ruleListType>;
}
export interface subTravelVoType extends superviseVoType {
	unSettlementPrice: string;
}
// 综费产品-除导服费外
export interface comprehensiveVoListType {
	comprehensiveFeeProductId: number; //综费产品id
	comprehensiveFeeProductName: string; //综费产品名称
	belongCompany: string; //费用归属  取字典父级code_value=BUSINESS_TYPE的所有子级
	actualPrice: string; //实收
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
						return `${twoDecimalPlaces(record[ruleColumnKey][key].ruleList[subKey].rulePrice)}`;
					}
				}
			}
		}
	}
	// 除综费产品外
	if (record[ruleColumnKey] && record[ruleColumnKey].ruleList && record[ruleColumnKey].ruleList.length) {
		for (const key in record[ruleColumnKey].ruleList) {
			if (column.title === record[ruleColumnKey].ruleList[key].ruleName && Number(column.type) === Number(record[ruleColumnKey].ruleList[key].type)) {
				return `${twoDecimalPlaces(record[ruleColumnKey].ruleList[key].rulePrice)}`;
			}
		}
	}
	return `暂无数据`;
});
// 需要/100的字段
export const formatColumn = computed(() => (column: any) => {
	// frozenPrice 冻结金额(团款) settlementPrice 已核销金额 unSettlementPrice 未消费费用
	return column.dataIndex === 'frozenPrice' || column.dataIndex === 'settlementPrice' || column.dataIndex === 'unSettlementPrice';
});
export const formatData = computed(() => (record: any, column: any) => {
	// 已核销金额
	if (column.dataIndex === 'settlementPrice') {
		if (column.key === 'settlementPrice') {
			// 父级的数据
			return record[column.key] ? twoDecimalPlaces(record[column.key]) : '';
		} else {
			// 子级的数据
			return record[column.key]['settlementPrice'] ? twoDecimalPlaces(record[column.key]['settlementPrice']) : '';
		}
	}
	// unSettlementPrice 未消费费用
	if (column.dataIndex === 'unSettlementPrice') {
		if (column.key === 'unSettlementPrice') {
			// 父级的数据
			return record[column.key] ? twoDecimalPlaces(record[column.key]) : '';
		}
		// else {
		// 	// 子级的数据
		// 	return record[column.key]['unSettlementPrice'] ? twoDecimalPlaces(record[column.key]['unSettlementPrice']) : '';
		// }
	}
	// 冻结金额
	if (column.dataIndex === 'frozenPrice') {
		// 团款
		if (column.key === 'frozenPrice') {
			return record[column.key] ? twoDecimalPlaces(record[column.key]) : '';
		} else {
			// 冻结金额
			return record[column.key]['frozenPrice'] ? twoDecimalPlaces(record[column.key]['frozenPrice']) : '';
		}
	}
	return '';
});
