<template>
	<CommonSearch>
		<search-item label="转账单号">
			<a-input v-model:value="state.tableData.param.applicationName" placeholder="请输入费用名称" allowClear style="width: 180px" />
		</search-item>
		<search-item label="转账单位">
			<a-input v-model:value="state.tableData.param.applicationName" placeholder="请输入费用名称" allowClear style="width: 180px" />
		</search-item>
		<search-item label="转账时间">
			<a-date-picker v-model:value="state.tableData.param.applicationDate" style="width: 180px" />
		</search-item>
		<search-item label="收款单位">
			<a-input v-model:value="state.tableData.param.applicationName" placeholder="请输入费用名称" allowClear style="width: 180px" />
		</search-item>
		<template #button>
			<a-button @click="initList">查询</a-button>
		</template>
	</CommonSearch>
	<div class="table-area">
		<div class="list-btn">
			<a-button type="primary" class="success">导出</a-button>
		</div>
		<a-spin size="large" :spinning="state.tableData.loading">
			<CommonTable :dataSource="state.tableData.data" :columns="columns" :scroll="{ x: '100%' }">
				<template #bodyCell="{ column, record, index }">
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a href="javascript:;" @click="toTrip(record)">查看行程单</a>
							<a href="javascript:;">查看订单</a>
						</div>
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
const route = useRouter();
const columns = [
	{
		title: ' 序号 ',
		key: 'index',
		width: '80px',
	},
	{
		title: '转账单号',
		dataIndex: 'itineraryNo',
		key: 'itineraryNo',
	},
	{
		title: '行程单数',
		dataIndex: 'routeName',
		key: 'routeName',
	},
	{
		title: '转账单位',
		dataIndex: 'subTravelName',
		key: 'subTravelName',
	},
	{
		title: '转账金额（元）',
		dataIndex: 'time',
		key: 'time',
	},
	{
		title: '转账账户',
		dataIndex: 'groupTypeStr',
		key: 'groupTypeStr',
	},
	{
		title: '转账时间',
		dataIndex: 'guides',
		key: 'guides',
	},
	{
		title: '收款单位',
		dataIndex: 'touristCount',
		key: 'touristCount',
	},
	{
		title: '收款账户',
		dataIndex: 'touristCount',
		key: 'touristCount',
	},
	{
		title: '操作',
		fixed: 'right',
		key: 'action',
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
// 跳转行程单
const toTrip = (record: any) => {
	route.push({
		path: '/reportManagement/scenicSpotTransferReport/tripList',
	});
};
</script>
<style scoped lang="less"></style>
