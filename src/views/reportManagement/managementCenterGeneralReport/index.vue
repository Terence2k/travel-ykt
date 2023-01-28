<template>
	<CommonSearch>
		<search-item label="团队类型" style="width: 280px">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.travelTypeId" style="width: 180px" placeholder="请选择团队类型">
				<a-select-option v-for="(item, index) in options.teamTypesLists" :value="item.oid" :key="index">{{ item.name }} </a-select-option>
			</a-select>
		</search-item>
		<search-item label="组团社">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.travelId" style="width: 200px" placeholder="请选择旅行社名称">
				<a-select-option v-for="(item, index) in options.groupSocietyList" :value="item.travelAgencyId" :key="index"
					>{{ item.travelAgencyName }}
				</a-select-option>
			</a-select>
		</search-item>
		<search-item label="地接社">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.subTravelId" placeholder="请选择旅行社名称" style="width: 200px">
				<a-select-option v-for="(item, index) in options.earthContactAgencyList" :value="item.travelAgencyId" :key="index"
					>{{ item.travelAgencyName }}
				</a-select-option>
			</a-select>
		</search-item>
		<search-item label="结算时间" style="width: 350px">
			<picker
				v-model="state.tableData.settlementStartTimeList"
				type="daterange"
				value-format="YYYY-MM-DD HH:mm:ss"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
				@change="timeChange"
				style="width: 180px"
			>
			</picker>
		</search-item>
		<template #button>
			<a-button @click="reset" style="margin-right: 30px">重置</a-button>
			<a-button @click="initList" v-permission="`查询`">查询</a-button>
		</template>
	</CommonSearch>
	<div class="table-area">
		<div class="list-btn">
			<a-button type="primary" class="success" v-permission="`导出`">导出</a-button>
		</div>
	</div>
	<div>
		<a-spin size="large" :spinning="state.tableData.loading">
			<!--  -->
			<CommonTable :dataSource="state.tableData.data" :columns="columns" :scroll="{ x: '100%', y: '100%' }" bordered>
				<template #bodyCell="{ column, record }">
					<!-- 结算规则 -->
					<template v-if="column.key === 'ruleMap'"> {{ getRulePrice(record, column) }} </template>
					<!-- 关于所有实收字段 -->
					<template v-if="column.dataIndex.includes('tualPrice')"> {{ getActualPrice(record, column) }} </template>
					<!-- 地接社未消费费用字段 -->
					<template v-if="column.dataIndex === 'unSettlementPrice' && column.key === 'subTravelVo'">
						{{ getSubTravelVoUnSettlementPrice(record, column) }}
					</template>
					<template v-if="formatColumn(column)">
						{{ formatData(record, column) }}
						<!-- frozenPrice: '888', //冻结金额
					settlementPrice: '888', //已核销金额 -->
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
import picker from '@/components/common/datePicker.vue';
import CommonTable from '@/components/common/CommonTable.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import type { TableColumnsType } from 'ant-design-vue';
import api from '@/api';
import { settlementOptions } from '@/stores/modules/settlement';
import { StateType, DataType, fixedColumn, getRulePrice, getActualPrice, getSubTravelVoUnSettlementPrice, formatColumn, formatData } from '.';
const options = settlementOptions();
const columns = computed(() => {
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
					return item.title === ruleList[t].ruleName && item.type == ruleList[t].type;
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
						type: ruleList[t].type,
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
const comprehensiveGuideVoListIds = ref([]);
const comprehensiveVoListIds = ref([]);
const state = reactive<StateType>({
	tableData: {
		param: {
			travelId: null, //组团社id
			subTravelId: null, //地接社id
			settlementTimeStart: '', //结算开始时间
			settlementTimeEnd: '', //结算结束时间
			travelTypeId: null, //团队类型id
			pageNo: 1, //页号
			pageSize: 10, //页大小
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
	state.tableData.loading = true;
	let res = await api.statementList(state.tableData.param);
	const { total, content } = res;
	state.tableData.total = total;
	state.tableData.data = content;
	state.tableData.loading = false;
};
//搜索
const onHandleCurrentChange = (val: number) => {
	console.log('change:', val);
	state.tableData.param.pageNo = val;
	initList();
};
//翻页
const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	state.tableData.param.pageSize = size;
	initList();
};
onMounted(() => {
	initList();
});
const timeChange = (arr: any) => {
	console.log(arr);
	if (arr && arr.length > 0) {
		state.tableData.param.settlementEndTime = Date.parse(arr[0]);
		state.tableData.param.settlementStartTime = Date.parse(arr[1]);
	} else {
		state.tableData.param.settlementEndTime = null;
		state.tableData.param.settlementStartTime = null;
	}
};
const reset = () => {
	state.tableData.param = {
		travelId: null, //组团社id
		subTravelId: null, //地接社id
		settlementTimeStart: '', //结算开始时间
		settlementTimeEnd: '', //结算结束时间
		travelTypeId: null, //团队类型id
		pageNo: 1, //页号
		pageSize: 10, //页大小
	};
	state.tableData.settlementStartTimeList = [];
	initList();
};
</script>
<style scoped lang="less"></style>
