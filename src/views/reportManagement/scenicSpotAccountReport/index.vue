<template>
	<CommonSearch>
		<search-item label="团单编号" style="width: 280px">
			<a-input v-model:value="state.tableData.param.transferAccountsNo" placeholder="请输入转账单号" allowClear style="width: 180px" />
		</search-item>
		<search-item label="景区名称" style="width: 280px">
			<a-input v-model:value="state.tableData.param.itineraryNo" placeholder="请输入行程单号" allowClear style="width: 180px" />
		</search-item>
		<search-item label="景点名称" style="width: 280px">
			<a-input v-model:value="state.tableData.param.itineraryNo" placeholder="请输入订单号" allowClear style="width: 180px" />
		</search-item>
		<search-item label="团队类型">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.teamTypeId" style="width: 200px" placeholder="请选择团队类型">
				<a-select-option v-for="(item, index) in options.teamTypesLists" :value="item.oid" :key="index">{{ item.name }} </a-select-option>
			</a-select>
		</search-item>
		<search-item label="地接社">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.subTravelId" style="width: 200px" placeholder="请选择旅行社名称">
				<a-select-option v-for="(item, index) in options.earthContactAgencyList" :value="item.travelAgencyId" :key="index"
					>{{ item.travelAgencyName }}
				</a-select-option>
			</a-select>
		</search-item>
		<search-item label="核销时间" style="width: 280px">
			<a-date-picker v-model:value="state.tableData.param.applicationDate" style="width: 180px" />
		</search-item>
		<search-item label="结算时间" style="width: 280px">
			<a-date-picker v-model:value="state.tableData.param.applicationDate" style="width: 180px" />
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
			<!-- :scroll="{ x: 2800 }" -->
			<CommonTable :dataSource="state.tableData.data" :columns="columns"> </CommonTable>
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
import { watch } from 'vue';
import CommonSearch from '@/components/common/CommonSearch.vue';
import CommonTable from '@/components/common/CommonTable.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import { settlementOptions } from '@/stores/modules/settlement';
import router from '@/router';
import { any } from 'vue-types';
const options = settlementOptions();
const route = useRouter();
const columns = computed(() => {
	const column = [
		{
			title: '团单编号',
			dataIndex: 'itineraryNo',
			key: 'itineraryNo',
		},
		{
			title: '景区名称',
			dataIndex: 'routeName',
			key: 'routeName',
		},
		{
			title: '票名称',
			dataIndex: 'routeName',
			key: 'routeName',
		},
		{
			title: '团队类型',
			dataIndex: 'routeName',
			key: 'routeName',
		},
		{
			title: '地接社',
			dataIndex: 'routeName',
			key: 'routeName',
		},
		{
			title: '核销时间',
			dataIndex: 'subTravelName',
			key: 'subTravelName',
		},
		{
			title: '结算时间',
			dataIndex: 'subTravelName',
			key: 'subTravelName',
		},
		{
			title: '单价（元）',
			dataIndex: 'subTravelName',
			key: 'subTravelName',
		},
		{
			title: '预定数',
			dataIndex: 'subTravelName',
			key: 'subTravelName',
		},
		{
			title: '实刷数',
			dataIndex: 'subTravelName',
			key: 'subTravelName',
		},
		{
			title: '减免数',
			dataIndex: 'subTravelName',
			key: 'subTravelName',
		},
		{
			title: '预定金额(元)',
			dataIndex: 'subTravelName',
			key: 'subTravelName',
		},
		{
			title: '减免金额(元)',
			dataIndex: 'subTravelName',
			key: 'subTravelName',
		},
		{
			title: '未核销金额金额（元）',
			dataIndex: 'time',
			key: 'time',
		},
		{
			title: '票款金额（元）',
			dataIndex: 'time',
			key: 'time',
		},
	];
	for (const key in [1, 2]) {
		const settlementRules = {
			title: `结算规则${Number(Number(key) + 1)}`,
			dataIndex: 'time',
			key: 'time',
		};
		column.push(settlementRules);
	}
	const netReceipts = {
		title: '实收金额金额（元）',
		dataIndex: 'time',
		key: 'time',
	};
	column.push(netReceipts);
	return column;
});
const state = reactive({
	tableData: {
		param: {
			applicationDate: null,
			applicationName: null,
			productType: 1,
			pageSize: 10,
			pageNo: 1,
			teamTypeId: null,
			travelId: null,
			subTravelId: null,
			transferAccountsNo: null,
			itineraryNo: null,
			type: null,
		},
		data: [
			{
				name: 123456,
			},
		],
		total: 11,
		loading: false,
	},
});
// 查询
const initList = async () => {
	// state.tableData.loading = true;
	// let res = await api.productRuleList(state.tableData.param);
	// const { total, content } = res;
	// state.tableData.total = total;
	// const list: [any] = dealData(content);
	// state.tableData.data = list;
	// state.tableData.loading = false;
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
// 跳转结算详情
const toDetail = (record: any) => {
	// route.push({
	// 	path: `/reportManagement/${String(routerName)}/orderList`,
	// });
};

onMounted(() => {
	options.getTeamTypeList();
	options.getGroupSocietyList();
	options.getEarthContactAgencyList();
	initList();
});
</script>
<style scoped lang="less"></style>
