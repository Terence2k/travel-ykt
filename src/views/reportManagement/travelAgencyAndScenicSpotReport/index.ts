// 固定表头
export const fixedColumn: Array<any> = [
	{
		title: '团单编号',
		dataIndex: 'itineraryNo',
		key: 'itineraryNo',
		width: 100,
	},
	{
		title: '自编团号',
		dataIndex: 'privateNo',
		key: 'privateNo',
		width: 100,
	},
	{
		title: '景区名称',
		dataIndex: 'scenicName',
		key: 'scenicName',
		width: 100,
	},
	{
		title: '门票名称',
		dataIndex: 'ticketName',
		key: 'ticketName',
		width: 100,
	},
	{
		title: '地接社',
		dataIndex: 'subTravelName',
		key: 'subTravelName',
		width: 100,
	},
	{
		title: '核销时间',
		dataIndex: 'verificationTime',
		key: 'verificationTime',
		width: 180,
	},
	{
		title: '结算时间',
		dataIndex: 'settlementTime',
		key: 'settlementTime',
		width: 180,
	},
	{
		title: '门票单价',
		dataIndex: 'ticketUnitPrice',
		key: 'ticketUnitPrice',
		width: 100,
	},
	{
		title: '单价',
		dataIndex: 'unitPrice',
		key: 'unitPrice',
		width: 100,
	},
	{
		title: '预定数',
		dataIndex: 'reservationNum',
		key: 'reservationNum',
		width: 100,
	},
	{
		title: '预定金额',
		dataIndex: 'orderPrice',
		key: 'orderPrice',
		width: 100,
	},
	{
		title: '实刷数',
		dataIndex: 'settlementNum',
		key: 'settlementNum',
		width: 100,
	},
	{
		title: '减免数',
		dataIndex: 'breaksNum',
		key: 'breaksNum',
		width: 100,
	},
	{
		title: '减免金额',
		dataIndex: 'breaksPrice',
		key: 'breaksPrice',
		width: 100,
	},
	{
		title: '景区冻结',
		dataIndex: 'ticketPrice',
		key: 'ticketPrice',
		width: 100,
	},
	{
		title: '景点实收',
		dataIndex: 'scenicPrice',
		key: 'scenicPrice',
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
	itineraryNo: string | number | null; //团单编号
	scenicId: string | number | null; //关联景区id
	ticketName: string | number | null; //门票名称
	subTravelId: string | number | null; //地接社id
	settlementStartTime: string | number | null; //结算开始时间
	settlementEndTime: string | number | null; //结算结束时间
	pageNo: number; //页号
	pageSize: number; //页大小
}
export interface DataType {
	itineraryNo: string; //团单编号
	privateNo: string; //自编团号
	scenicId: number; //关联景区id
	scenicName: string; //景区名称
	ticketId: number; //票id
	ticketName: string; //门票名称
	subTravelId: number; //地接社id
	subTravelName: number; //地接社名称
	verificationTime: string; //核销时间
	settlementTime: string; //结算时间
	ticketUnitPrice: string; //门票单价
	unitPrice: string; //单价
	reservationNum: number; //预定数
	settlementNum: number; //实刷数
	breaksNum: number; //减免数
	orderPrice: string; //预定金额
	unSettlementPrice: string; //未核销金额
	breaksPrice: string; //减免金额
	ticketPrice: string; //景区冻结
	scenicPrice: string; //景点实收
	settlementRuleList: Array<ruleListType>;
}
export interface ruleListType {
	ruleName: string; //规则名称
	rulePrice: string; //结算费用
}
export const getRuleMap = computed(() => (column: any, record: any) => {
	if (record.settlementRuleList) {
		const idx = record.settlementRuleList.findIndex((item: any) => item.ruleName === column.title);
		if (idx !== -1) {
			return record.settlementRuleList[idx].rulePrice ? twoDecimalPlaces(record.settlementRuleList[idx].rulePrice) : '';
		}
	}
	return '';
});
// 需要/100的字段
export const formatColumn = computed(() => (column: any) => {
	// frozenPrice 冻结金额(团款) settlementPrice 已核销金额 unSettlementPrice 未消费费用
	return column.dataIndex === 'frozenPrice' || column.dataIndex === 'settlementPrice' || column.dataIndex === 'unSettlementPrice';
});
export const twoDecimalPlaces = (number: any): string => {
	if (typeof number === 'string') {
		if (number.includes('-')) {
			number = number.slice(1);
			return `-${Number(number / 100).toFixed(2)}`;
		}
	}
	return Number(number / 100).toFixed(2);
};
