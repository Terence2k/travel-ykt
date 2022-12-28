<template>
	<CommonSearch>
		<search-item label="团单编号">
			<a-input v-model:value="state.tableData.param.itineraryNo" placeholder="请输入团单编号" style="width: 180px"
		/></search-item>
		<search-item label="景区名称">
			<a-select
				v-model:value="state.tableData.param.scenicId"
				placeholder="请选择景区名称"
				allowClear
				style="width: 180px"
				:options="state.viewList.map((item) => ({ value: item.ticketId, label: item.ticketName }))"
			>
			</a-select>
		</search-item>
		<search-item label="门票名称">
			<a-input v-model:value="state.tableData.param.ticketName" placeholder="请输入门票名称" style="width: 180px" />
		</search-item>
		<search-item label="地接社">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.subTravelId" style="width: 200px" placeholder="请选择旅行社名称">
				<a-select-option v-for="(item, index) in options.earthContactAgencyList" :value="item.travelAgencyId" :key="index"
					>{{ item.travelAgencyName }}
				</a-select-option>
			</a-select>
		</search-item>
		<search-item label="结算时间" style="width: 350px">
			<!-- <a-range-picker v-model:value="state.tableData.settlementStartTimeList" @change="timeChange" style="width: 180px" /> -->
			<picker v-model="state.tableData.settlementStartTimeList" style="width: 180px" @change="timeChange" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"> </picker>
		</search-item>
		<template #button>
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
					<template v-if="column.key === 'ruleMap'">
						{{ getRuleMap(column, record) }}
					</template>
					<template v-if="column.key.includes('Price')">
						{{ getAllPrice(column, record) }}
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
import type { TableColumnsType } from 'ant-design-vue';
import api from '@/api';
import { settlementOptions } from '@/stores/modules/settlement';
import picker from '@/components/common/datePicker.vue';
import { StateType, DataType, fixedColumn, ruleListType, getRuleMap, getAllPrice } from '.';
const options = settlementOptions();
const columns = computed(() => {
	const column = ref<TableColumnsType>([]);
	column.value = fixedColumn;
	const data: Array<DataType> = state.tableData.data;
	// 添加结算规则
	for (let index = 0; index < data.length; index++) {
		if (data[index].settlementRuleList && data[index].settlementRuleList.length) {
			const ruleList: Array<ruleListType> = data[index].settlementRuleList;
			for (let i = 0; i < ruleList.length; i++) {
				const idx = column.value.findIndex((item) => item.title === ruleList[i].ruleName);
				if (idx === -1) {
					const rule: any = {
						title: `${ruleList[i].ruleName}`,
						dataIndex: 'ruleMap',
						key: 'ruleMap',
						ruleName: `${ruleList[i].ruleName}`,
						width: 180,
					};
					column.value.push(rule);
				}
			}
		}
	}
	return column.value;
});
const state = reactive<StateType>({
	tableData: {
		param: {
			itineraryNo: '', //团单编号
			scenicId: null, //关联景区id
			ticketName: '', //门票名称
			subTravelId: null, //地接社id
			settlementStartTime: '', //结算开始时间
			settlementEndTime: '', //结算结束时间
			pageSize: 10, //页大小
			pageNo: 1, //页号
		},
		data: [],
		total: 1,
		loading: false,
		settlementStartTimeList: [],
	},
	viewList: [],
});
// 查询
const initList = async () => {
	state.tableData.loading = true;
	// 调用接口
	let res = await api.travelAgencyAndScenicSpotReportStatement(state.tableData.param);
	const { total, content } = res;
	state.tableData.total = total;
	state.tableData.data = content;
	state.tableData.loading = false;
	// state.tableData.data = [
	// 	{
	// 		itineraryNo: '团单编号', //团单编号
	// 		privateNo: '自编团号', //自编团号
	// 		scenicId: 1, //关联景区id
	// 		scenicName: '111', //景区名称
	// 		ticketId: 1, //票id
	// 		ticketName: '111', //门票名称
	// 		subTravelId: 1, //地接社id
	// 		subTravelName: 111, //地接社名称
	// 		verificationTime: '2022.03.01 09:00', //核销时间
	// 		settlementTime: '2022.03.01 09:00', //结算时间
	// 		ticketUnitPrice: '1', //门票单价
	// 		unitPrice: '1', //单价
	// 		reservationNum: 1, //预定数
	// 		settlementNum: 1, //实刷数
	// 		breaksNum: 1, //减免数
	// 		orderPrice: '1', //预定金额
	// 		unSettlementPrice: '1', //未核销金额
	// 		breaksPrice: '1', //减免金额
	// 		ticketPrice: '1', //景区冻结
	// 		scenicPrice: '1', //景点实收
	// 		settlementRuleList: [
	// 			{
	// 				ruleName: '结算规则名称1', //结算规则名称
	// 				rulePrice: '2000', //结算费用
	// 			},
	// 			{
	// 				ruleName: '结算规则名称2', //结算规则名称
	// 				rulePrice: '9000', //结算费用
	// 			},
	// 		], //结算规则信息
	// 	},
	// ];
};
// 获取景区下拉列表
const getViewList = async () => {
	const result = await api.getViewList();
	state.viewList = result;
	console.log(state.viewList, `state.viewList`);
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
	options.getTeamTypeList();
	options.getGroupSocietyList();
	options.getEarthContactAgencyList();
	getViewList();
	initList();
});
const timeChange = (arr: any) => {
	if (arr && arr.length > 0) {
		state.tableData.param.settlementStartTime = arr[0];
		state.tableData.param.settlementEndTime = arr[1];
	} else {
		state.tableData.param.settlementStartTime = null;
		state.tableData.param.settlementEndTime = null;
	}
};
</script>
<style scoped lang="less"></style>
