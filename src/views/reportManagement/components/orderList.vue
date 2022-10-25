<template>
	<div class="table-area">
		<div class="list-btn">
			<a-button type="primary" class="success">导出</a-button>
		</div>
	</div>
	<div>
		<a-spin size="large" :spinning="state.tableData.loading">
			<CommonTable :dataSource="state.tableData.data" :columns="columns" >
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
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
const columns = [
	{
		title: ' 转账单号 ',
		width: 105,
		key: 'order',
		dataIndex: 'order',
	},
	{
		title: '行程单号',
		dataIndex: 'itineraryNo',
		width: 105,
		key: 'itineraryNo',
	},
	{
		title: '订单号',
		dataIndex: 'routeName',
		width: 105,
		key: 'routeName',
	},
	{
		title: '团队类型',
		dataIndex: 'subTravelName',
		width: 105,
		key: 'subTravelName',
	},
	{
		title: '组团社',
		dataIndex: 'time',
		width: 105,
		key: 'time',
	},
	{
		title: '地接社',
		dataIndex: 'groupTypeStr',
		width: 105,
		key: 'groupTypeStr',
	},
	{
		title: '景区名称',
		dataIndex: 'guides',
		width: 105,
		key: 'guides',
	},
	{
		title: '票名称',
		dataIndex: 'touristCount',
		width: 105,
		key: 'touristCount',
	},
	{
		title: '订票数',
		dataIndex: 'touristCount',
		width: 105,
		key: 'touristCount',
	},
	{
		title: '单价(元)',
		dataIndex: 'touristCount',
		width: 105,
		key: 'touristCount',
	},
	{
		title: '预订时间',
		dataIndex: 'touristCount',
		width: 105,
		key: 'touristCount',
	},
	{
		title: '入园日期',
		dataIndex: 'touristCount',
		width: 105,
		key: 'touristCount',
	},
	{
		title: '减免人数',
		dataIndex: 'touristCount',
		width: 105,
		key: 'touristCount',
	},
	{
		title: '订单金额(元)',
		dataIndex: 'touristCount',
		width: 105,
		key: 'touristCount',
	},
	{
		title: '减免金额(元)',
		dataIndex: 'touristCount',
		width: 105,
		key: 'touristCount',
	},
	{
		title: '实际金额(元)',
		dataIndex: 'touristCount',
		width: 105,
		key: 'touristCount',
	},
	{
		title: '核销时间',
		dataIndex: 'touristCount',
		width: 105,
		key: 'touristCount',
	},
	{
		title: '核销人数',
		dataIndex: 'touristCount',
		width: 105,
		key: 'touristCount',
	},
	{
		title: '结算时间',
		dataIndex: 'touristCount',
		width: 105,
		key: 'touristCount',
	},
	{
		title: '未消费费用(元)',
		dataIndex: 'touristCount',
		key: 'touristCount',
		width: 115,
	},
	{
		title: '收入费用(元)',
		dataIndex: 'touristCount',
		key: 'touristCount',
		width: 105,
	},
	{
		title: '扣除费用(元)',
		dataIndex: 'touristCount',
		key: 'touristCount',
		width: 105,
	},
	{
		title: '结算费用(元)',
		dataIndex: 'touristCount',
		key: 'touristCount',
		width: 105,
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
				order: 123456,
			},
			{
				order: 123456,
			},
		],
		total: 20,
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
<style scoped lang="less">
</style>
