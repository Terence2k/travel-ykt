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
		<search-item label="结算时间" style="width: 350px">
			<!-- <a-range-picker v-model:value="state.times" @change="timeChange"/> -->
			<picker
				v-model="state.times"
				style="width: 180px"
				@change="timeChange"
				type="daterange"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
			>
			</picker>
		</search-item>
		<template #button>
			<a-button @click="reset" style="margin-right: 30px">重置</a-button>
			<a-button @click="initList" v-permission="'查询'">查询</a-button>
		</template>
	</CommonSearch>
	<div class="table-area">
		<div class="list-btn">
			<a-button type="primary" class="success" v-permission="'导出'">导出</a-button>
		</div>
	</div>
	<div>
		<a-spin size="large" :spinning="state.tableData.loading">
			<!--  -->
			<CommonTable :dataSource="state.tableData.data" :columns="columns" :scroll="{ x: '100%', y: '100%' }">
				<template #bodyCell="{ column, record }">
					<!-- 金额处理 begin -->

					<!-- 团款 -->
					<template v-if="column.key === 'frozenPrice'"> {{ amountYuanHandle(record.frozenPrice) }} </template>
					<!-- 核销总费用 -->
					<template v-if="column.key === 'settlementPrice'"> {{ amountYuanHandle(record.settlementPrice) }} </template>
					<!-- 未核销总费用 -->
					<template v-if="column.key === 'unSettlementPrice'"> {{ amountYuanHandle(record.unSettlementPrice) }} </template>
					<!-- 古维费冻结 -->
					<template v-if="column.key === 'hmFrozenPrice'"> {{ amountYuanHandle(record.hmFrozenPrice) }} </template>
					<!-- 酒店冻结 -->
					<template v-if="column.key === 'hotelFrozenPrice'"> {{ amountYuanHandle(record.hotelFrozenPrice) }} </template>
					<!-- 景点冻结 -->
					<template v-if="column.key === 'ticketFrozenPrice'"> {{ amountYuanHandle(record.ticketFrozenPrice) }} </template>
					<!-- 餐费冻结 -->
					<template v-if="column.key === 'cateringFrozenPrice'"> {{ amountYuanHandle(record.cateringFrozenPrice) }} </template>

					<!-- 金额处理 end -->
					<!-- 结算规则 -->
					<template v-if="column.key === 'ruleMap'"> {{ getRulePrice(record, column) }} </template>
					<!-- 关于所有实收字段 -->
					<template v-if="column.dataIndex.includes('tualPrice')"> {{ getActualPrice(record, column) }} </template>
					<!-- 地接社未消费费用字段 -->
					<template v-if="column.dataIndex === 'unSettlementPrice' && column.key === 'subTravelVo'">
						{{ amountYuanHandle(getSubTravelVoUnSettlementPrice(record, column)) }}
					</template>
					<!-- 未消费费用字段 -->
					<template v-if="column.key === 'unSettlementPriceVo'">
						{{ amountYuanHandle(getSubTravelVoUnSettlementPrice(record, column)) }}
					</template>
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
import picker from '@/components/common/datePicker.vue';
import api from '@/api';
import {
	StateType,
	DataType,
	notConsumed,
	subTravel,
	detailFixedColumn,
	getRulePrice,
	getActualPrice,
	getSubTravelVoUnSettlementPrice,
	getSettlementRule,
	getSettlementRuleGuide,
	amountYuanHandle,
} from '../earthingGeneralReport/index';

const options = settlementOptions();
const columns = computed(() => {
	const column = ref<TableColumnsType>([]);
	column.value = detailFixedColumn;
	const data: Array<DataType> = state.tableData.data;
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
				width: 150,
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
				width: 150,
			};
			column.value.push(settlementRules);
		}
	}
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
	// 插入未核销费用数据
	if (column.value.indexOf(notConsumed) == -1) {
		column.value.push(notConsumed);
	}
	// // 插入地接社数据
	if (column.value.indexOf(subTravel) == -1) {
		column.value.push(subTravel);
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
					return item.title === ruleList[t].ruleName && item.type == ruleList[t].type;
				});
				// 判断标有是否已经存在数据
				if (!isHasRule) {
					const rule: any = {
						title: `${ruleList[t].ruleName}`,
						dataIndex: 'ruleMap',
						key: 'ruleMap',
						ruleName: `${ruleList[t].ruleName}`,
						width: 150,
						parent: key,
						type: ruleList[t].type,
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
	times: '',
});
// 查询
const initList = async () => {
	state.tableData.loading = true;
	let res = await api.statementBySubTravelDetail(state.tableData.param);
	const { total, content } = res;
	state.tableData.total = total;
	state.tableData.data = content;
	state.tableData.loading = false;
};
//搜索
const onHandleCurrentChange = (val: number) => {
	if (typeof val == 'number') {
		state.tableData.param.pageNo = val;
		initList();
	}
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
		state.tableData.param.settlementStartTime = Date.parse(arr[0]);
		state.tableData.param.settlementEndTime = Date.parse(arr[1]);
	} else {
		state.tableData.param.settlementStartTime = null;
		state.tableData.param.settlementEndTime = null;
	}
};
const reset = () => {
	state.tableData.param = {
		itineraryNo: '', //行程单号
		travelTypeId: null, //团队类型id
		travelId: null, // 组团社id
		subTravelId: null, //地接社id
		settlementStartTime: '', //结算开始时间
		settlementEndTime: '', //结算结束时间
		pageSize: 10, //页大小
		pageNo: 1, //页号
	};
	state.times = [];
	initList();
};
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
