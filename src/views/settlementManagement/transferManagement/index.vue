<template>
	<CommonSearch>
		<search-item label="申请日期">
			<a-date-picker v-model:value="state.tableData.param.applicationDate" />
		</search-item>
		<search-item label="申请人">
			<a-input v-model:value="state.tableData.param.applicationName" placeholder="请输入费用名称" allowClear style="width: 180px" />
		</search-item>
		<template #button>
			<a-button @click="initList">查询</a-button>
		</template>
	</CommonSearch>
	<div class="table-area">
		<a-tabs v-model:activeKey="state.tableData.param.productType" @change="tabsChange">
			<a-tab-pane :key="1" tab="待审核"></a-tab-pane>
			<a-tab-pane :key="2" tab="转账完成" force-render></a-tab-pane>
			<a-tab-pane :key="3" tab="审核不通过"></a-tab-pane>
		</a-tabs>
		<a-spin size="large" :spinning="state.tableData.loading">
			<CommonTable :dataSource="state.tableData.data" :columns="columns" :scroll="{ x: '100%' }">
				<template #bodyCell="{ column, record }">
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a href="javascript:;" @click="toHandle(record)">处理</a>
							<a href="javascript:;" @click="toDetails(record)">详情</a>
							<a href="javascript:;" @click="lookTrip(record)">查看行程单</a>
						</div>
					</template>
				</template></CommonTable
			>
		</a-spin>
		<CommonPagination
			:current="state.tableData.param.pageNo"
			:page-size="state.tableData.param.pageSize"
			:total="state.tableData.total"
			@change="onHandleCurrentChange"
			@showSizeChange="pageSideChange"
		/>
	</div>
	<Detail v-model="cacheData.showDetail" :params="cacheData.detailParams"></Detail>
</template>
<script lang="ts" setup>
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import Detail from './detail.vue';
const columns = [
	{
		title: '转账单号',
		dataIndex: 'productName',
		key: 'productName',
	},
	{
		title: '申请时间',
		dataIndex: 'scenicName',
		key: 'scenicName',
	},
	{
		title: '所含团数',
		dataIndex: 'productSonType',
		key: 'productSonType',
	},
	{
		title: '结算总额（元）',
		dataIndex: 'hasProductRule',
		key: 'hasProductRule',
	},
	{
		title: '转账申请人',
		dataIndex: 'hasProductRule',
		key: 'hasProductRule',
	},
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		width: 208,
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
const cacheData = ref({
	showDetail: false,
	detailParams: {},
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
// 处理
const toHandle = (record: any) => {
	cacheData.value.showDetail = true;
	cacheData.value.detailParams = { handle: true };
};
const toDetails = (record: any) => {
	cacheData.value.showDetail = true;
	cacheData.value.detailParams = { handle: false };
};
const route = useRouter();
const lookTrip = (record: any) => {
	route.push({
		path: '/settlementManagement/transferManagement/tripList',
	});
};
const tabsChange = (e: any) => {
	console.log(e);
};
</script>
