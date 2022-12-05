<template>
	<CommonSearch>
		<search-item label="团队类型" style="width: 280px">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.travelTypeId" style="width: 200px" placeholder="请选择团队类型">
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
			<a-select allowClear ref="select" v-model:value="state.tableData.param.subTravelId" style="width: 200px" placeholder="请选择旅行社名称">
				<a-select-option v-for="(item, index) in options.earthContactAgencyList" :value="item.travelAgencyId" :key="index"
					>{{ item.travelAgencyName }}
				</a-select-option>
			</a-select>
		</search-item>
		<search-item label="结算时间" style="width: 280px">
			<a-range-picker v-model:value="state.tableData.settlementStartTimeList" @change="timeChange" />
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
				<template #bodyCell="{ column, record }"> </template>
			</CommonTable>
		</a-spin>
		<CommonPagination
			:current="state.tableData.param.pageNo"
			:page-size="state.tableData.param.pageSize"
			:total="state.tableData.total"
			@change="onHandleCurrentChange"
			@showSizeChange="pageSideChange"
		/>
		<!-- <a-button @click="addMenu">我要夹死你们</a-button> -->
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
import { StateType, DataType, fixedColumn, getRulePrice, getActualPrice, getSubTravelVoUnSettlementPrice, formatColumn, formatData } from '.';
const options = settlementOptions();
const comprehensiveGuideVoListIds = ref([]);
const comprehensiveVoListIds = ref([]);
const columns = computed(() => {
	const column = ref<TableColumnsType>([]);
	column.value = fixedColumn;
	const data: Array<DataType> = state.tableData.data;
	/**
	 * 需等数据后再对表头进行更改
	 */
	return column.value;
});
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
	// 调用接口
	// let res = await api.statementByItinerary(state.tableData.param);
	// const { total, content } = res;
	// state.tableData.total = total;
	// state.tableData.data = content;
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
	options.getTeamTypeList();
	options.getGroupSocietyList();
	options.getEarthContactAgencyList();
	initList();
});
const timeChange = (arr: any) => {
	if (arr && arr.length > 0) {
		state.tableData.param.settlementTimeStart = arr[0]['$d'];
		state.tableData.param.settlementTimeEnd = arr[1]['$d'];
	} else {
		state.tableData.param.settlementTimeStart = null;
		state.tableData.param.settlementTimeEnd = null;
	}
};
// const addMenu = async () => {
// 	const str = '配置规则、查询、新增、删除、保存、取消、查看、启用、禁用、编辑';
// 	const atr = str.split('、');
// 	for (let index = 0; index < atr.length; index++) {
// 		const params = {
// 			menuName: atr[index],
// 			menuStatus: 1,
// 			menuType: 3,
// 			parentId: 258,
// 		};
// 		const h = await api.addMenu(params);
// 		console.log(h);
// 	}
// };
</script>
<style scoped lang="less"></style>
