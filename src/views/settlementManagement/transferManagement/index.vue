<template>
	<CommonSearch>
		<search-item label="申请日期">
			<a-range-picker v-model:value="state.times" @change="timeChange" />
		</search-item>
		<search-item label="申请人">
			<a-input v-model:value="state.tableData.param.createName" placeholder="请输入费用名称" allowClear style="width: 180px" />
		</search-item>
		<template #button>
			<a-button @click="initList">查询</a-button>
		</template>
	</CommonSearch>
	<div class="table-area">
		<a-tabs v-model:activeKey="state.tableData.param.status" @change="tabsChange">
			<a-tab-pane :key="1" tab="待审核"></a-tab-pane>
			<a-tab-pane :key="2" tab="已转账" force-render></a-tab-pane>
			<a-tab-pane :key="3" tab="审核不通过"></a-tab-pane>
		</a-tabs>
		<div class="list-btn">
			<a-button type="primary" class="success" @click="toBatchTransfer">处理</a-button>
		</div>
		<a-spin size="large" :spinning="state.tableData.loading">
			<CommonTable :dataSource="state.tableData.data" :columns="columns" :row-selection="rowSelection" :scroll="{ x: '100%', y: '100%' }">
				<template #bodyCell="{ column, record }">
					<template v-if="column.key === 'settlementCost'">
						<span>{{ (record.settlementCost / 100).toFixed(2) }}元</span>
					</template>
					<template v-if="column.key === 'status'">
						<span v-if="record.status === 1" style="color: red">待审核</span>
						<span v-if="record.status === 2" style="color: green">全部完成</span>
						<span v-if="record.status === 3" style="color: red">审核不通过</span>
						<span v-if="record.status === 4" style="color: red">部分完成</span>
					</template>
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a href="javascript:;" @click="toHandle(record)" v-if="state.tableData.param.status === 1 || record.status === 4">处理</a>
							<a href="javascript:;" @click="toDetails(record)">详情</a>
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
	<Detail v-model="cacheData.showDetail" :params="cacheData.detailParams" @submit="detailSubmit"></Detail>
</template>
<script lang="ts" setup>
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import Detail from './detail.vue';
import api from '@/api';
const columns = [
	{
		title: '转账单号',
		dataIndex: 'transferAccountsNo',
		key: 'transferAccountsNo',
	},
	{
		title: '行程单号',
		dataIndex: 'itineraryNo',
		key: 'itineraryNo',
	},
	{
		title: '转账单位',
		dataIndex: 'travelName',
		key: 'travelName',
	},
	{
		title: '结算总额（元）',
		dataIndex: 'settlementCost',
		key: 'settlementCost',
	},
	{
		title: '申请时间',
		dataIndex: 'createTime',
		key: 'createTime',
	},
	{
		title: '申请人',
		dataIndex: 'createName',
		key: 'createName',
	},
	{
		title: '转账状态',
		dataIndex: 'status',
		key: 'status',
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
			createName: null, //申请人
			startTime: null, //申请开始日期
			endTime: null, //申请结束日期
			status: 1, //转账单状态 1-待审核 2-转账完成 3-审核不通过
			pageNo: 1, //页号
			pageSize: 10, //页大小
		},
		data: [],
		total: 1,
		loading: false,
	},
	times: [],
});
const cacheData = ref({
	showDetail: false,
	detailParams: {},
	selectedRowKeys: [],
});
// 查询
const initList = async () => {
	state.tableData.loading = true;
	let res = await api.getTransferAccountList(state.tableData.param);
	console.log(res, `res`);
	const { total, content } = res;
	state.tableData.total = total;
	// const list: [any] = dealData(content);
	state.tableData.data = content;
	state.tableData.loading = false;
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
	cacheData.value.detailParams = {
		handle: true,
		transferAccountsId: record.oid,
		settlementCost: record.settlementCost,
		status: record.status,
	};
};
const toDetails = (record: any) => {
	cacheData.value.showDetail = true;
	cacheData.value.detailParams = {
		handle: false,
		transferAccountsId: record.oid,
		settlementCost: record.settlementCost,
		status: null,
	};
};
const route = useRouter();
const lookTrip = (record: any) => {
	route.push({
		path: '/settlementManagement/transferManagement/tripList',
	});
};
const tabsChange = (e: any) => {
	initList();
};
const onSelectChange = (selectedRowKeys: any) => {
	cacheData.value.selectedRowKeys = selectedRowKeys;
};
const rowSelection = computed(() => {
	if (state.tableData.param.status === 1) {
		return { selectedRowKeys: cacheData.value.selectedRowKeys, onChange: onSelectChange };
	} else {
		return false;
	}
});
const timeChange = (arr: any) => {
	if (arr && arr.length > 0) {
		state.tableData.param.startTime = arr[0]['$d'];
		state.tableData.param.endTime = arr[1]['$d'];
	} else {
		state.tableData.param.startTime = null;
		state.tableData.param.endTime = null;
	}
};
const detailSubmit = () => {
	initList();
};
const toBatchTransfer = () => {
	route.push({
		path: '/settlementManagement/transferManagement/batchTransfer',
	});
};
onMounted(() => {
	initList();
});
</script>
