import type { TableColumnsType } from 'ant-design-vue';
import { accDiv } from '@/utils/compute';

// 固定表头
export const fixedColumn: Array<any> = [
	{
		title: '团单编号',
		dataIndex: 'itineraryNo',
		key: 'itineraryNo',
		width: 150,
	},
	{
		title: '发团旅行社',
		dataIndex: 'travelName',
		key: 'travelName',
		width: 100,
	},
	{
		title: '所属集团',
		dataIndex: 'groupName',
		key: 'groupName',
		width: 100,
	},
	{
		title: '自编团号',
		dataIndex: 'privateNo',
		key: 'privateNo',
		width: 130,
	},
	{
		title: '团单类型',
		dataIndex: 'orderType',
		key: 'orderType',
		width: 100,
	},
	{
		title: '出团时间',
		dataIndex: 'startDate',
		key: 'startDate',
		width: 130,
	},
	{
		title: '散团时间',
		dataIndex: 'endDate',
		key: 'endDate',
		width: 130,
	},
	{
		title: '结算时间',
		dataIndex: 'settlementTime',
		key: 'settlementTime',
		width: 130,
	},
	{
		title: '行程人数',
		dataIndex: 'peopleNum',
		key: 'peopleNum',
		width: 100,
	},
	{
		title: '总团款(元)',
		dataIndex: 'frozenPrice',
		key: 'frozenPrice',
		width: 100,
	},
	{
		title: '旅行社实收',
		dataIndex: 'actualPrice',
		key: 'actualPrice',
		width: 100,
	},
];
export const hmVo = {
	title: '古维费用',
	key: 'hmVo',
	children: [
		{
			title: '冻结',
			dataIndex: 'frozenPrice',
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
};
export const ticketVo = {
	title: '景区费用',
	key: 'ticketVo',
	children: [
		{
			title: '冻结',
			dataIndex: 'frozenPrice',
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
};
export const hotelVo = {
	title: '酒店费用',
	key: 'hotelVo',
	children: [
		{
			title: '冻结',
			dataIndex: 'frozenPrice',
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
};
export const cateringVo = {
	title: '餐饮费用',
	key: 'cateringVo',
	children: [
		{
			title: '冻结',
			dataIndex: 'frozenPrice',
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
};
export const notConsumed = {
	title: '未消费款项',
	key: 'unSettlementPriceVo',
	children: [
		{
			title: '未消费小计',
			dataIndex: 'allPrice',
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
			title: '酒店',
			dataIndex: 'hotelPrice',
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
	itineraryNo: string | number | null; // 团单编号
	travelId: string | number | null; //组团社id
	settlementTimeStart: string | number | null; //结算开始时间
	settlementTimeEnd: string | number | null; //结算结束时间
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
	itineraryNo?: string; //团单编号
	orderType?: string; //团单类型
	groupName?: string; //所属集团
	privateNo?: string; //自编团号
	startDate?: string; //核销总费用
	endDate?: string; //出团时间
	settlementTime?: string; //结算时间
	actualPrice?: string | number | null; // 旅行社实收
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
	comprehensiveGuideVoList: Array<comprehensiveGuideVoListType>; //综费产品-导服费
	comprehensiveVoList?: Array<comprehensiveVoListType>; //综费产品-除导服费外
	comprehensiveFrozenPriceList: Array<ComprehensiveFrozenPriceType>; // 全部综费
	unSettlementPriceVo: unSettlementPriceVoType; // 未消费费用
}
// 未消费费用
export interface unSettlementPriceVoType {
	hotelPrice?: string | number | null; //酒店冻结
	ticketPrice: string | number | null; //景区冻结
	cateringPrice: string | number | null; //餐饮冻结
	hmPrice: string | number | null; //古维冻结
	rulePrice: string | number | null; //结算费用
	allPrice: string | number | null; //小计
	ruleList: Array<ruleListType>; //结算规则
}
// 综费
export interface ComprehensiveFrozenPriceType {
	comprehensiveProductId: number; //综费产品id
	comprehensiveProductName: string; //综费产品名称
	frozenPrice: string; //未结算费用
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
	comprehensiveFeeProductId: number | null; //综费产品id
	comprehensiveFeeProductName: string; //综费产品名称
	travelActualPrice: string; //旅行社实收
	groupActualPrice: string; //集团实收
	ruleList: Array<ruleListType>;
}
export interface subTravelVoType extends superviseVoType {}
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
}
export const getRulePrice = computed(() => (record: any, column: any) => {
	const ruleColumnKey = column.parent.split('-')[0];
	// 综费产品
	if (ruleColumnKey.includes('List')) {
		for (const key in record[ruleColumnKey]) {
			if (column.columnParentName === record[ruleColumnKey][key]['comprehensiveFeeProductName']) {
				for (const subKey in record[ruleColumnKey][key].ruleList) {
					if (column.title === record[ruleColumnKey][key].ruleList[subKey].ruleName) {
						return `${twoDecimalPlaces(record[ruleColumnKey][key].ruleList[subKey].rulePrice)}`;
					}
				}
			}
		}
	}
	// 除综费产品外
	if (record[ruleColumnKey] && record[ruleColumnKey].ruleList && record[ruleColumnKey].ruleList.length) {
		for (const key in record[ruleColumnKey].ruleList) {
			if (column.title === record[ruleColumnKey].ruleList[key].ruleName) {
				return `${twoDecimalPlaces(record[ruleColumnKey].ruleList[key].rulePrice)}`;
			}
		}
	}
	return ``;
});

//获取所有父子级嵌套数据值
export const getChildPrice = computed(() => (record: any, column: any) => {
	return record[column.key] ? twoDecimalPlaces(record[column.key][column.dataIndex]) : '';
});

export const twoDecimalPlaces = (number: any): any => {
	if (typeof number === 'string') {
		if (number.includes('-')) {
			number = number.slice(1);
			return `-${accDiv(number, 100)}`;
		}
	}
	return accDiv(number, 100);
};
// 需要/100的字段
export const formatColumn = computed(() => (column: any) => {
	// 古维 景区 酒店 餐饮 未消费款项 导服费 团款 旅行社实收
	return (
		column.key === 'hmVo' ||
		column.key === 'ticketVo' ||
		column.key === 'hotelVo' ||
		column.key === 'cateringVo' ||
		column.key === 'frozenPrice' ||
		column.key === 'test' ||
		column.key === 'unSettlementPriceVo' ||
		column.key === 'actualPrice'
	);
});
export const formatData = computed(() => (record: any, column: any) => {
	if (column.dataIndex == column.key) {
		// 父级的数据
		return record[column.key] ? twoDecimalPlaces(record[column.key]) : '';
	} else {
		// 子级的数据
		return record[column.key][column.dataIndex] ? twoDecimalPlaces(record[column.key][column.dataIndex]) : '';
	}
});
export const getComprehensiveProduct = computed(() => (record: any, column: any) => {
	const title = column.title;
	const idx = record.comprehensiveFrozenPriceList.findIndex((item: any) => item.comprehensiveProductName === title);
	if (idx !== -1) {
		return record.comprehensiveFrozenPriceList[idx].frozenPrice ? twoDecimalPlaces(record.comprehensiveFrozenPriceList[idx].frozenPrice) : '';
	} else {
		return '';
	}
});
