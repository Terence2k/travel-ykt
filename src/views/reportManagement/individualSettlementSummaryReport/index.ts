import type { TableColumnsType } from 'ant-design-vue';
// 固定表头
export const fixedColumn: Array<any> = [
	{
		title: '发团旅行社',
		dataIndex: 'travelName',
		key: 'travelName',
		width: 100,
	},
	{
		title: '人数',
		dataIndex: 'peopleNum',
		key: 'peopleNum',
		width: 100,
	},
	{
		title: '团款',
		dataIndex: 'frozenPrice',
		key: 'frozenPrice',
		width: 100,
	},
	{
		title: '合同费用',
		dataIndex: 'contractPrice',
		key: 'contractPrice',
		width: 100,
	},
	{
		title: '户名',
		dataIndex: 'bankAccountName',
		key: 'bankAccountName',
		width: 100,
	},
	{
		title: '旅行社开户行',
		dataIndex: 'bank',
		key: 'bank',
		width: 100,
	},
	{
		title: '旅行社账号',
		dataIndex: 'bankAccount',
		key: 'bankAccount',
		width: 100,
	},
	{
		title: '旅行社实收',
		dataIndex: 'actualPrice',
		key: 'actualPrice',
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
		title: '未结算费用',
		key: 'unSettlementPriceVo',
		children: [
			{
				title: '酒店',
				dataIndex: 'hotelPrice',
				key: 'unSettlementPriceVo',
				width: 100,
			},
			{
				title: '景区',
				dataIndex: 'ticketPrice',
				key: 'unSettlementPriceVo',
				width: 100,
			},
			{
				title: '餐饮',
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
			{
				title: '小计',
				dataIndex: 'allPrice',
				key: 'unSettlementPriceVo',
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
	settlementTimeStart: string | number | null; //结算开始时间
	settlementTimeEnd: string | number | null; //结算结束时间
	pageNo: number; //页号
	pageSize: number; //页大小
}
export interface DataType {
	travelId?: number; //组团社id
	travelName?: string; //组团社名称
	peopleNum?: number; //人数
	frozenPrice?: string; //团款
	contractPrice?: string; //合同费用
	bankAccountName?: string; //户名
	bank?: string; //旅行社开户行
	bankAccount?: string; //旅行社账号
	actualPrice?: string; //旅行社实收
	comprehensiveFrozenPriceList: Array<ComprehensiveFrozenPriceType>;
	hmVo: VoType;
	ticketVo: VoType;
	hotelVo: VoType;
	cateringVo: VoType;
	unSettlementPriceVo: UnSettlementPriceVoType;
	comprehensiveGuideVoList: Array<ComprehensiveGuideVoListType>;
	comprehensiveVoList: Array<ComprehensiveVoListType>;
}
// 综费
export interface ComprehensiveFrozenPriceType {
	comprehensiveProductId: number; //综费产品id
	comprehensiveProductName: string; //综费产品名称
	frozenPrice: string; //未结算费用
}
export interface VoType {
	frozenPrice: string; //冻结金额
	settlementPrice: string; //已核销金额
	actualPrice: string; //实收
	ruleList: Array<RuleListType>;
}
export interface RuleListType {
	ruleName: string; //规则名称
	rulePrice: string; //结算费用
}
export interface UnSettlementPriceVoType {
	hotelPrice: string; //酒店
	ticketPrice: string; //景区
	cateringPrice: string; //餐饮
	hmPrice: string; //古维
	rulePrice: string; //手续费
	allPrice: string; //小计
	ruleList: Array<RuleListType>;
}
// 综费产品-导服费
export interface ComprehensiveGuideVoListType {
	comprehensiveFeeProductId: number; //综费产品id
	comprehensiveFeeProductName: string; //综费产品名称
	travelActualPrice: string; //旅行社实收
	groupActualPrice: string; //集团实收
	ruleList: Array<RuleListType>;
}
// 综费产品-除导服费外
export interface ComprehensiveVoListType {
	comprehensiveFeeProductId: number; //综费产品id
	comprehensiveFeeProductName: string; //综费产品名称
	belongCompany: string; //费用归属  取字典父级code_value=BUSINESS_TYPE的所有子级
	actualPrice: string; //实收
	ruleList: Array<RuleListType>;
}
// 获取结算规则
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
	return `暂无数据`;
});
// 获取实收
export const getActualPrice = computed(() => (record: any, column: any) => {
	// 先判断旅行社实收
	if (column.key === 'actualPrice' && column.dataIndex === 'actualPrice') {
		return twoDecimalPlaces(record[column.key]) || '';
	}
	if (!column.key.includes('List')) {
		// 先判断非综费产品
		return record[column.key] && record[column.key]['actualPrice'] ? twoDecimalPlaces(record[column.key]['actualPrice']) : '';
	} else {
		// 综费产品
		if (record[column.key]) {
			const idx = record[column.key].findIndex((r: any) => r.comprehensiveFeeProductName === column.parentTitle);
			if (idx !== -1) {
				return twoDecimalPlaces(record[column.key][idx][column.dataIndex]) || '';
			}
		}
	}
	return '';
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
// 获取未结算费用字段
export const getUnSettlementPriceVo = computed(() => (record: any, column: any) => {
	if (column.key === 'unSettlementPriceVo') {
		return twoDecimalPlaces(record[column.key][column.dataIndex]) || '';
	}
});
export const twoDecimalPlaces = (number: any): any => {
	if (typeof number === 'string') {
		if (number.includes('-')) {
			number = number.slice(1);
			return `-${Number(number / 100).toFixed(2)}`;
		}
	}
	return Number(number / 100).toFixed(2);
};
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
