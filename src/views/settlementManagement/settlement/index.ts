// 固定表头
export const fixedColumn: Array<any> = [
	{
		title: '团队类型',
		dataIndex: 'teamTypeName',
		key: 'teamTypeName',
	},
	{
		title: '行程单号',
		dataIndex: 'itineraryNo',
		key: 'itineraryNo',
	},
	{
		title: '线路名称',
		dataIndex: 'routeName',
		key: 'routeName',
	},
	{
		title: '组团社',
		dataIndex: 'travelName',
		key: 'travelName',
	},
	{
		title: '地接社',
		dataIndex: 'subTravelName',
		key: 'subTravelName',
	},
	{
		title: '行程人数',
		dataIndex: 'touristNum',
		key: 'touristNum',
	},
	{
		title: '行程费用(元)',
		dataIndex: 'totalFee',
		key: 'totalFee',
	},
	{
		title: '行程时间',
		dataIndex: 'timeText',
		key: 'timeText',
	},
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		width: 208,
	},
];

export interface StateType {
	tableData: TableDataType;
	selectedRowKeys: Array<any>;
}
export interface TableDataType {
	param: ParamType;
	data: Array<DataType>;
	total: number;
	loading: boolean;
}
export interface ParamType {
	pageSize?: number; //页大小
	pageNo?: number; //页号
	teamTypeId?: number | string | null; // 团队类型
	itineraryNo?: number | string | null; // 行程单号
	travelId?: number | string | null; // 组团社id
	subTravelId?: number | string | null; //地接社id
	startDate?: number | string | null; // 开始时间
	endDate?: number | string | null; // 结束时间
	startSendGroupTime?: number | string | null; // 发团开始时间
	endSendGroupTime?: number | string | null; // 发团结束时间
	status?: number | string | null; // 状态
}
export interface DataType {
	oid?: number | string | null; //oid
	teamType?: number | string | null; //团队类型Id
	teamTypeName?: number | string | null; //团队类型名称
	itineraryNo?: number | string | null; //行程单号
	routeName?: number | string | null; //线路名称
	travelOid?: number | string | null; //组团社id
	travelName?: number | string | null; //组团社名称
	subTravelOid?: number | string | null; //地接社id
	subTravelName?: number | string | null; //地接社名称
	touristNum?: number | string | null; //游客人数
	totalFee?: number | string | null; //行程单费用
	startDate?: number | string | null; //行程开始时间
	endDate?: number | string | null; //行程结束时间
	accountingFee?: number | string | null; //计算费用
	accountingIsNormal?: number | string | null; //结算状态 1-正常 0-异常
	reconciliationNo?: number | string | null; //对账批号
}

// 数据处理 时间拼接
export const dealData = (params: [any]) => {
	params.map((i: any) => {
		i.timeText = i.startDate + ' - ' + i.endDate;
		return i;
	});
	return params;
};
export const twoDecimalPlaces = (number: any): any => {
	if (typeof number === 'string') {
		if (number.includes('-')) {
			number = number.slice(1);
			return `-${Number(number / 100)}`;
		}
	}
	return Number(number / 100);
};
