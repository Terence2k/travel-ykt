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
						return `${record[ruleColumnKey][key].ruleList[subKey].rulePrice}`;
					}
				}
			}
		}
	}
	// 除综费产品外
	if (record[ruleColumnKey] && record[ruleColumnKey].ruleList && record[ruleColumnKey].ruleList.length) {
		for (const key in record[ruleColumnKey].ruleList) {
			if (column.title === record[ruleColumnKey].ruleList[key].ruleName && Number(column.type) === Number(record[ruleColumnKey].ruleList[key].type)) {
				return `${record[ruleColumnKey].ruleList[key].rulePrice}`;
			}
		}
	}
	return `暂无数据`;
});
// 获取实收
export const getActualPrice = computed(() => (record: any, column: any) => {
	// 先判断非综费产品
	if (!column.key.includes('List')) {
		return record[column.key] ? record[column.key]['actualPrice'] : '';
	} else {
		// 综费产品
		if (record[column.key]) {
			const idx = record[column.key].findIndex((r: any) => r.comprehensiveFeeProductName === column.parentTitle);
			if (idx !== -1) {
				return record[column.key][idx][column.dataIndex] || '';
			}
		}
	}
	return '';
});
//地接社未消费费用获取数据
export const getSubTravelVoUnSettlementPrice = computed(() => (record: any, column: any) => {
	return record[column.key] ? record[column.key]['unSettlementPrice'] : '';
});
export const columns = computed(() => {
	const column = ref<TableColumnsType>([]);
	column.value = fixedColumn;
	const data: Array<DataType> = state.tableData.data;
	/**
	 * 先获取数据源，根据数据源的综费产品列表渲染到表头上
	 * 再把数据进行整理 把数据源所有数据和表头一一对应存到 ruleMap
	 * 再根据 ruleMap 进行遍历判断
	 */
	const ruleMap: any = [];
	// 把综费产品两个数组整合到表头上
	for (let index = 0; index < data.length; index++) {
		// 综费产品 - 导服费
		for (const key in data[index].comprehensiveGuideVoList) {
			const vo = data[index].comprehensiveGuideVoList[key];
			// 判断是否已经存在
			const idx = comprehensiveGuideVoListIds.value.findIndex((item) => item === vo.comprehensiveFeeProductId);
			if (idx === -1) {
				comprehensiveGuideVoListIds.value.push(vo.comprehensiveFeeProductId);
				const comprehensiveGuideVo = {
					title: `${vo.comprehensiveFeeProductName}`,
					dataIndex: `comprehensiveGuideVoList`,
					id: `${vo.comprehensiveFeeProductId}`,
					key: 'comprehensiveGuideVoList',
					children: [
						{
							title: '旅行社实收',
							dataIndex: 'travelActualPrice',
							id: `${vo.comprehensiveFeeProductId}`,
							key: 'comprehensiveGuideVoList',
							width: 100,
							parentTitle: `${vo.comprehensiveFeeProductName}`,
						},
						{
							title: '集团实收',
							dataIndex: 'groupActualPrice',
							id: `${vo.comprehensiveFeeProductId}`,
							key: 'comprehensiveGuideVoList',
							width: 100,
							parentTitle: `${vo.comprehensiveFeeProductName}`,
						},
					],
				};
				column.value.push(comprehensiveGuideVo);
				// 把数据源和表头整理到ruleMap
				const title = `comprehensiveGuideVoList-${vo.comprehensiveFeeProductId}`;
				if (!ruleMap[title]) {
					ruleMap[title] = { column: {}, data: [] };
				}
				ruleMap[title]['column'] = column.value[column.value.length - 1].children;
				ruleMap[title]['data'].push(vo['ruleList']);
				ruleMap[title]['columnParent'] = column.value[column.value.length - 1];
			} else {
				// 把数据源和表头整理到ruleMap
				const title = `comprehensiveGuideVoList-${vo.comprehensiveFeeProductId}`;
				if (!ruleMap[title]) {
					ruleMap[title] = { column: {}, data: [] };
				}
				const idx = column.value.findIndex((item) => {
					return item.title === vo.comprehensiveFeeProductName;
				});
				ruleMap[title]['column'] = column.value[idx].children;
				ruleMap[title]['data'].push(vo['ruleList']);
				ruleMap[title]['columnParent'] = column.value[idx];
			}
		}
		// 	//综费产品-除导服费外
		for (const key in data[index].comprehensiveVoList) {
			const vo = data[index].comprehensiveVoList[key];
			// 判断是否已经存在
			const idx = comprehensiveVoListIds.value.findIndex((item) => item === vo.comprehensiveFeeProductId);
			if (idx === -1) {
				comprehensiveVoListIds.value.push(vo.comprehensiveFeeProductId);
				const comprehensiveGuideVo = {
					title: `${vo.comprehensiveFeeProductName}`,
					dataIndex: `${vo.comprehensiveFeeProductId}`,
					key: 'comprehensiveVoList',
					children: [
						{
							title: `${vo.belongCompany}实收`,
							dataIndex: 'actualPrice',
							id: `${vo.comprehensiveFeeProductId}`,
							key: 'comprehensiveVoList',
							width: 100,
							parentTitle: `${vo.comprehensiveFeeProductName}`,
						},
					],
				};
				column.value.push(comprehensiveGuideVo);
				// 把数据源和表头整理到ruleMap
				const title = `comprehensiveVoList-${vo.comprehensiveFeeProductId}`;
				if (!ruleMap[title]) {
					ruleMap[title] = { column: {}, data: [] };
				}
				ruleMap[title]['column'] = column.value[column.value.length - 1].children;
				ruleMap[title]['data'].push(vo['ruleList']);
				ruleMap[title]['columnParent'] = column.value[column.value.length - 1];
			} else {
				// 把数据源和表头整理到ruleMap
				const title = `comprehensiveVoList-${vo.comprehensiveFeeProductId}`;
				if (!ruleMap[title]) {
					ruleMap[title] = { column: {}, data: [] };
				}
				const idx = column.value.findIndex((item) => {
					return item.title === vo.comprehensiveFeeProductName;
				});
				ruleMap[title]['column'] = column.value[idx].children;
				ruleMap[title]['data'].push(vo['ruleList']);
				ruleMap[title]['columnParent'] = column.value[idx];
			}
		}
	}
	// 把所有带有结算规则的数据进行数据整理
	for (let index = 0; index < data.length; index++) {
		for (const key in data[index]) {
			if (key.includes('Vo')) {
				for (let j = 0; j < column.value.length; j++) {
					// 对于除综费产品外的数据进行处理
					if (!key.includes('List') && column.value[j].key === key) {
						if (!ruleMap[key]) {
							ruleMap[key] = { column: {}, data: [] };
						}
						ruleMap[key]['column'] = column.value[j].children;
						ruleMap[key]['data'].push(data[index][key]['ruleList']);
					}
				}
			}
		}
	}
	// 将结算规则配置到表头
	for (const key in ruleMap) {
		// ruleMap[key]['column'] 表头 ruleMap[key]['data'] 配置规则数据
		for (const subKey in ruleMap[key]['data']) {
			const ruleList = ruleMap[key]['data'][subKey];
			for (const t in ruleList) {
				const isHasRule = ruleMap[key]['column'].some((item: any) => {
					return item.title === ruleList[t].ruleName;
				});
				// 判断标有是否已经存在数据
				if (!isHasRule) {
					const rule: any = {
						title: `${ruleList[t].ruleName}`,
						dataIndex: 'ruleMap',
						key: 'ruleMap',
						ruleName: `${ruleList[t].ruleName}`,
						width: 180,
						parent: key,
					};
					if (key.includes('List')) {
						rule['columnParentName'] = ruleMap[key]['columnParent']['title'];
					}
					ruleMap[key]['column'].push(rule);
				}
			}
		}
	}
	return column.value;
});
