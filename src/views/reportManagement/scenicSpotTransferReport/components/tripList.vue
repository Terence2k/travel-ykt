<template>
	<CommonTable :dataSource="state.tableData.data" :columns="columns" :scroll="{ x: '100%', y: '100%' }" style="margin-top: 10px"> </CommonTable>

	<CommonPagination
		:current="state.tableData.param.pageNo"
		:page-size="state.tableData.param.pageSize"
		:total="state.tableData.total"
		@change="onHandleCurrentChange"
		@showSizeChange="pageSideChange"
	/>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
const columns = [
	{
		title: ' 序号 ',
		key: 'index',
		width: '80px',
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
		title: '地接社',
		dataIndex: 'subTravelName',
		key: 'subTravelName',
	},
	{
		title: '行程时间',
		dataIndex: 'time',
		key: 'time',
	},
	{
		title: '团队类型',
		dataIndex: 'groupTypeStr',
		key: 'groupTypeStr',
	},
	{
		title: '带队导游',
		dataIndex: 'guides',
		key: 'guides',
	},
	{
		title: '团客人数',
		dataIndex: 'touristCount',
		key: 'touristCount',
	},
];
const state = reactive({
	tableData: {
		param: {
			applicationDate: null,
			applicationName: null,
			productType: 1,
			pageSize: 10,
			pageNo: 1,
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
	// onSearch();
	initList();
};
//翻页
const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	state.tableData.param.pageSize = size;
	// onSearch();
	initList();
};
</script>
<style scoped lang="less"></style>
