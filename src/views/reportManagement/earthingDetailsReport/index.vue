<template>
	<CommonSearch>
		<search-item label="行程单号" style="width: 280px">
			<a-input v-model:value="state.tableData.param.itineraryNo" placeholder="请输入行程单号" allowClear style="width: 180px" />
		</search-item>
		<search-item label="组团社">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.travelId" style="width: 200px" placeholder="请选择旅行社名称">
				<a-select-option v-for="(item, index) in options.groupSocietyList" :value="item.travelAgencyId" :key="index"
					>{{ item.travelAgencyName }}
				</a-select-option>
			</a-select>
		</search-item>
		<search-item label="地接社">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.subTravelId" style="width: 200px" placeholder="请选择地接社名称">
				<a-select-option v-for="(item, index) in options.earthContactAgencyList" :value="item.travelAgencyId" :key="index"
					>{{ item.travelAgencyName }}
				</a-select-option>
			</a-select>
		</search-item>
		<search-item label="团队类型">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.travelTypeId" style="width: 200px" placeholder="请选择团队类型">
				<a-select-option v-for="(item, index) in options.teamTypesLists" :value="item.oid" :key="index">{{ item.name }} </a-select-option>
			</a-select>
		</search-item>
		<search-item label="结算时间">
			<a-range-picker v-model:value="state.times" @change="timeChange" />
		</search-item>
		<template #button>
			<a-button @click="initList">查询</a-button>
		</template>
	</CommonSearch>
	<div class="table-area">
		<div class="list-btn">
			<a-button type="primary" class="success">导出</a-button>
		</div>
	</div>
	<div>
		<a-spin size="large" :spinning="state.tableData.loading">
			<!--  -->
			<CommonTable :dataSource="state.tableData.data" :columns="columns" :scroll="{ x: '100%', y: '100%' }" >
				<template #bodyCell="{ column, record }">
					<!-- 结算规则 -->
					<template v-if="column.key === 'ruleMap'"> {{ getRulePrice(record, column) }} </template>
					<template v-if="column.dataIndex.includes('tualPrice')"> {{ getActualPrice(record, column) }} </template>
					<template v-if="column.dataIndex.includes('belongCompany')"> {{ getBelongCompany(record, column) }} </template>
					<!-- 综费冻结 -->
					<template v-if="column.key === 'settlementRuleNameGuide'">
						{{ getSettlementRuleGuide(record, column) }}
					</template>
					<template v-if="column.key === 'settlementRuleName'">
						{{ getSettlementRule(record, column) }}
					</template>
				</template>
			</CommonTable>
		</a-spin>
		<CommonPagination
			:current="state.tableData.param.pageNo"
			:page-size="state.tableData.param.pageSize"
			:total="state.tableData.total"
			@change="onHandleCurrentChange"
			@showSizeChange="pageSideChange"
		/>
	</div>
</template>

<script setup lang="ts">
import CommonSearch from '@/components/common/CommonSearch.vue';
import CommonTable from '@/components/common/CommonTable.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import { settlementOptions } from '@/stores/modules/settlement';
import type { TableColumnsType } from 'ant-design-vue';
import api from '@/api';
interface StateType {
	tableData: TableDataType;
	viewList: Array<any>;
}
interface TableDataType {
	param: ParamType;
	data: Array<DataType>;
	total: number;
	loading: boolean;
	settlementStartTimeList: Array<any>;
}
interface ParamType {
	itineraryNo?: number | string; //行程单号
	travelTypeId?: number | string | null; //团队类型id
	travelId?: number | string | null; //组团社id
	subTravelId?: number | string | null; //地接社id
	settlementStartTime: number | string | null; //结算开始时间
	settlementEndTime: number | string | null; //结算结束时间
	pageSize?: number; //页大小
	pageNo?: number; //页号
}
interface DataType {
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
	subTravelVo?: subTravelVoType; //地接社
	comprehensiveGuideVoList?: Array<comprehensiveGuideVoListType>; //综费产品-导服费
	comprehensiveVoList?: Array<comprehensiveVoListType>; //综费产品-除导服费外
}
// 古维费用 景区 酒店
interface voType {
	frozenPrice: string; //冻结金额
	settlementPrice: string; //已核销金额
	actualPrice: string; //实收
}
// 餐饮 监理 协会 集团 文旅局 一卡通 地接社
interface superviseVoType {
	actualPrice: string; //实收
	ruleList: Array<ruleListType>;
}
// 综费产品-导服费
interface comprehensiveGuideVoListType {
	comprehensiveFeeProductId: number; //综费产品id
	comprehensiveFeeProductName: string; //综费产品名称
	travelActualPrice: string; //旅行社实收
	groupActualPrice: string; //集团实收
	ruleList: Array<ruleListType>;
}
interface subTravelVoType extends superviseVoType {
	unSettlementPrice: string;
}
// 综费产品-除导服费外
interface comprehensiveVoListType {
	comprehensiveFeeProductId: number; //综费产品id
	comprehensiveFeeProductName: string; //综费产品名称
	belongCompany: string; //费用归属  取字典父级code_value=BUSINESS_TYPE的所有子级
	actualPrice: string; //实收
	ruleList: Array<ruleListType>;
}
interface ruleListType {
	ruleName: string; //规则名称
	rulePrice: string; //结算费用
}
const options = settlementOptions();
const columns = computed(() => {
	const column = ref<TableColumnsType>([
        {
			title: '行程单号',
			dataIndex: 'travelName',
			key: 'travelName',
			width: 100,
		},
        {
			title: '自编团号',
			dataIndex: 'travelName',
			key: 'travelName',
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
			dataIndex: 'settlementPrice',
			key: 'settlementPrice',
			width: 100,
		},
		{
			title: '古维费冻结',
			dataIndex: 'unSettlementPrice',
			key: 'unSettlementPrice',
			width: 100,
		},
		{
			title: '酒店冻结',
			dataIndex: 'unSettlementPrice',
			key: 'unSettlementPrice',
			width: 100,
		},
		{
			title: '景点冻结',
			dataIndex: 'unSettlementPrice',
			key: 'unSettlementPrice',
			width: 100,
		},
		{
			title: '餐费冻结',
			dataIndex: 'unSettlementPrice',
			key: 'unSettlementPrice',
			width: 100,
		},
	]);
	// 拼接遍历综费冻结费用
	let nameList: Array<string> = [];
	if (state.tableData.data && state.tableData.data.length) {
		for (const key in state.tableData.data) {
			// 遍历导服费综费列表
			const data = state.tableData.data[key].comprehensiveGuideVoList;
			if (data && data.length) {
				for (const subKey in data) {
					if (!nameList.includes(data[subKey].comprehensiveFeeProductName)) {
						nameList.push(data[subKey].comprehensiveFeeProductName);
					}
				}
			}
		}
		for (const key in nameList) {
			const settlementRules = {
				title: `${nameList[key]}冻结`,
				dataIndex: 'settlementRuleNameGuide',
				key: 'settlementRuleNameGuide',
				width: 150
			};
			column.value.push(settlementRules);
		}
	}
	// 拼接遍历综费冻结费用
	let guideNameList: Array<string> = [];
	if (state.tableData.data && state.tableData.data.length) {
		for (const key in state.tableData.data) {
			// 遍历除导服费外综费列表
			const data = state.tableData.data[key].comprehensiveVoList;
			if (data && data.length) {
				for (const subKey in data) {
					if (!guideNameList.includes(data[subKey].comprehensiveFeeProductName)) {
						guideNameList.push(data[subKey].comprehensiveFeeProductName);
					}
				}
			}
		}
		for (const key in guideNameList) {
			const settlementRules = {
				title: `${guideNameList[key]}冻结`,
				dataIndex: 'settlementRuleName',
				key: 'settlementRuleName',
				width: 150
			};
			column.value.push(settlementRules);
		}
	}
	
	const data = state.tableData.data;
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
							title: '地接实收',
							dataIndex: 'travelActualPrice',
							id: `${vo.comprehensiveFeeProductId}`,
							key: 'comprehensiveGuideVoList',
							width: 100,
							parentTitle: `${vo.comprehensiveFeeProductName}`,
						},
						{
							title: '集团代收',
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
		//综费产品-除导服费外
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
				ruleMap[title]['column'] = column.value[idx]?.children;
				ruleMap[title]['data'].push(vo['ruleList']);
				ruleMap[title]['columnParent'] = column.value[idx];
			}
		}
	}
     const notConsumed = {
		title: '未消费款项',
		key: 'hmVo',
		children: [
			{
				title: '小计',
				dataIndex: 'frozenPrice',
				key: 'hmVo',
				width: 100,
			},
			{
				title: '酒店',
				dataIndex: 'settlementPrice',
				key: 'hmVo',
				width: 100,
			},
			{
				title: '景点',
				dataIndex: 'actualPrice',
				key: 'hmVo',
				width: 100,
			},
			{
				title: '餐费',
				dataIndex: 'actualPrice',
				key: 'hmVo',
				width: 100,
			},
			{
				title: '古维',
				dataIndex: 'actualPrice',
				key: 'hmVo',
				width: 100,
			},
			{
				title: '手续费',
				dataIndex: 'actualPrice',
				key: 'hmVo',
				width: 100,
			},
		],
	};
	column.value.push(notConsumed);
	const subTravel = {
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
	column.value.push(subTravel);
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
					ruleMap[key]['column'].unshift(rule);
				}
			}
		}
	}
	return column.value;
});
const comprehensiveGuideVoListIds = ref([]);
const comprehensiveVoListIds = ref([]);
const state = reactive<StateType>({
	tableData: {
		param: {
			itineraryNo: '', //行程单号
			travelTypeId: null, //团队类型id
			travelId: null, // 组团社id
			subTravelId: null, //地接社id
			settlementStartTime: '', //结算开始时间
			settlementEndTime: '', //结算结束时间
			pageSize: 10, //页大小
			pageNo: 1, //页号
		},
		data: [],
		total: 11,
		loading: false,
		settlementStartTimeList: [],
	},
	viewList: [],
});
// 查询
const initList = async () => {
	// state.tableData.loading = true;
	// let res = await api.byItineraryTicket(state.tableData.param);
	// const { total, content } = res;
	// state.tableData.total = total;
	// state.tableData.data = content;
	// state.tableData.loading = false;
	state.tableData.data = [
		{
			travelId: 1, //组团社id
			travelName: '组团社', //组团社名称
			subTravelId: 1, //地接社id
			subTravelName: '地接社', //地接社名称
			travelTypeId: 1, //团队类型id
			travelTypeName: '888', //团队类型名称
			peopleNum: 200, //人数
			frozenPrice: '888', //团款
			settlementPrice: '888', //核销总费用
			unSettlementPrice: '888', //未消费费用
			hmVo: {
				frozenPrice: '888', //冻结金额
				settlementPrice: '888', //已核销金额
				actualPrice: '654', //实收
			}, //古维费用
			subTravelVo: {
				actualPrice: '634343', //实收
				unSettlementPrice: '1', //未消费费用
				ruleList: [
					{
						ruleName: '手续费', //规则名称
						rulePrice: '123', //结算费用
					},
					{
						ruleName: '导服费', //规则名称
						rulePrice: '888', //结算费用
					},
					{
						ruleName: '餐费', //规则名称
						rulePrice: '888123', //结算费用
					},
				], //结算规则
			}, //地接社
			comprehensiveGuideVoList: [
				{
					comprehensiveFeeProductId: 1, //综费产品id
					comprehensiveFeeProductName: '综费产品-导服费', //综费产品名称
					travelActualPrice: '1888', //旅行社实收
					groupActualPrice: '1888', //集团实收
					ruleList: [
						{
							ruleName: '结算规则-0001', //规则名称
							rulePrice: '1222', //结算费用
						},
						{
							ruleName: '结算规则-0002', //规则名称
							rulePrice: '1322', //结算费用
						},
					], //结算规则
				},
			], //综费产品-导服费
			comprehensiveVoList: [
				{
					comprehensiveFeeProductId: 1, //综费产品id
					comprehensiveFeeProductName: '综费产品-餐费', //综费产品名称
					belongCompany: '旅行社', //费用归属  取字典父级code_value=BUSINESS_TYPE的所有子级
					actualPrice: '1888', //实收
					ruleList: [
						{
							ruleName: '结算规则-0001', //规则名称
							rulePrice: '13333', //结算费用
						},
						{
							ruleName: '结算规则-0002', //规则名称
							rulePrice: '13333', //结算费用
						},
					], //结算规则
				},
			], //综费产品-除导服费外
		},
	];
};
//搜索
const onHandleCurrentChange = (val: number) => {
	state.tableData.param.pageNo = val;
	initList();
};
//翻页
const pageSideChange = (current: number, size: number) => {
	state.tableData.param.pageSize = size;
	initList();
};

onMounted(() => {
	options.getTeamTypeList();
	options.getGroupSocietyList();
	options.getEarthContactAgencyList();
	initList();
});
const timeChange = (arr: any) => {
	if (arr && arr.length > 0) {
		state.tableData.param.settlementStartTime = arr[0]['$d'];
		state.tableData.param.settlementEndTime = arr[1]['$d'];
	} else {
		state.tableData.param.settlementStartTime = null;
		state.tableData.param.settlementEndTime = null;
	}
};
const getRulePrice = computed(() => (record: any, column: any) => {
	const ruleColumnKey = column.parent.split('-')[0];
	// 综费产品
	if (ruleColumnKey.includes('List')) {
		for (const key in record[ruleColumnKey]) {
			if (column.columnParentName === record[ruleColumnKey][key]['comprehensiveFeeProductName']) {
				for (const subKey in record[ruleColumnKey][key].ruleList) {
					if (column.title === record[ruleColumnKey][key].ruleList[subKey].ruleName) {
						return `${record[ruleColumnKey][key].ruleList[subKey].rulePrice}`;
					}
				}
			}
		}
	}
	// 除综费产品外
	if (record[ruleColumnKey] && record[ruleColumnKey].ruleList && record[ruleColumnKey].ruleList.length) {
		for (const key in record[ruleColumnKey].ruleList) {
			if (column.title === record[ruleColumnKey].ruleList[key].ruleName) {
				return `${record[ruleColumnKey].ruleList[key].rulePrice}`;
			}
		}
	}
	return `暂无数据`;
});
// 获取实收
const getActualPrice = computed(() => (record: any, column: any) => {
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
// 获取费用归属
const getBelongCompany = computed(() => (record: any, column: any) => {
	if (record[column.key]) {
		const idx = record[column.key].findIndex((r: any) => r.comprehensiveFeeProductName === column.parentTitle);
		if (idx !== -1) {
			return record[column.key][idx][column.dataIndex] || '';
		}
	}
	return '';
});
const getColumnRecord = computed(() => (record: any, column: any, name: string) => {
	if (record[column.key]) {
		return record[column.key][name] ? record[column.key][name] : '';
	}
	return '';
});
// 综费名称--导服费外
const getSettlementRule = computed(() => (column, record) => {
	const data = column.comprehensiveVoList;
	for (const key in data) {
		if (record.title == `${data[key].comprehensiveFeeProductName}冻结`) {
			return data[key].actualPrice || data[key].actualPrice;
		}
	}
	return '';
});
// 综费名称--导服费
const getSettlementRuleGuide = computed(() => (column, record) => {
	const data = column.comprehensiveGuideVoList;
	for (const key in data) {
		if (record.title == `${data[key].comprehensiveFeeProductName}冻结`) {
			return data[key].travelActualPrice;
		}
	}
	return '';
});
</script>
<style scoped lang="less">
::v-deep(.ant-table-thead > tr > th, .ant-table-tbody > tr > td, .ant-table tfoot > tr > th, .ant-table tfoot > tr > td) {
	padding: 16px 0;
}
::v-deep(.ant-table-thead > tr > th) {
	text-align: center;
}
::v-deep(.ant-table-thead > tr > th) {
	border-right: 1px solid #f0f0f0;
	border-bottom: 1px solid #f0f0f0 !important;
}
</style>
