<template>
	<CommonSearch>
		<search-item label="结算时间" style="width: 350px">
			<picker
				v-model="state.times"
				type="daterange"
				value-format="YYYY-MM-DD HH:mm:ss"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
				@change="timeChange"
				style="width: 180px"
			>
			</picker>
		</search-item>
		<search-item label="申请人">
			<a-input v-model:value="state.tableData.param.createName" placeholder="请输入费用名称" allowClear style="width: 180px" />
		</search-item>
		<template #button>
			<a-button @click="reset" style="margin-right: 30px" v-permission="`重置`">重置</a-button>
			<a-button @click="initList" v-permission="`查询`">查询</a-button>
			<!-- <a-button @click="reset" style="margin-right: 30px">重置</a-button>
			<a-button @click="initList">查询</a-button> -->
		</template>
	</CommonSearch>
	<div class="table-area">
		<a-tabs v-model:activeKey="state.tableData.param.status" @change="tabsChange">
			<a-tab-pane :key="1" tab="待审核"></a-tab-pane>
			<a-tab-pane :key="2" tab="已转账" force-render></a-tab-pane>
			<a-tab-pane :key="3" tab="审核不通过"></a-tab-pane>
		</a-tabs>
		<a-spin size="large" :spinning="state.tableData.loading">
			<CommonTable
				:dataSource="state.tableData.data"
				:columns="columns"
				rowKey="oid"
				:row-selection="{ selectedRowKeys: cacheData.selectedRowKeys, onChange: onSelectChange }"
				:scroll="{ x: '100%', y: '100%' }"
			>
				<template #button>
					<div class="btn" v-if="state.tableData.param.status === 1">
						<a-button type="primary" class="success" @click="toBatchTransfer" v-permission="`处理`">处理</a-button>
					</div>
				</template>
				<template #bodyCell="{ column, record }">
					<template v-if="column.key === 'settlementCost'">
						<span>{{ record.settlementCost / 100 }}元</span>
					</template>
					<template v-if="column.key === 'status'">
						<span v-if="record.status === 1" style="color: red">待审核</span>
						<span v-if="record.status === 2" style="color: green">全部完成</span>
						<span v-if="record.status === 3" style="color: red">审核不通过</span>
						<span v-if="record.status === 4" style="color: red">部分完成</span>
					</template>
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a
								href="javascript:;"
								@click="toHandle(record)"
								v-if="state.tableData.param.status === 1 || record.status === 1"
								v-permission="`待审核_详情`"
							>
								详情
							</a>
							<a href="javascript:;" @click="toHandle(record)" v-if="record.status === 4" v-permission="`已转账_处理`"> 处理 </a>
							<!-- <a href="javascript:;" @click="toDetails(record)">详情</a> -->
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
import picker from '@/components/common/datePicker.vue';
import Detail from './detail.vue';
import api from '@/api';
import { message } from 'ant-design-vue/es';
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
	cacheData.value.detailParams = {
		handle: false,
		transferAccountsId: record.oid,
		settlementCost: record.settlementCost,
		itineraryNo: record.itineraryNo,
		status: null,
	};
	cacheData.value.showDetail = true;
};
const toDetails = (record: any) => {
	cacheData.value.detailParams = {
		handle: false,
		transferAccountsId: record.oid,
		settlementCost: record.settlementCost,
		itineraryNo: record.itineraryNo,
		status: null,
	};
	console.log(cacheData.value, `cacheData.value`);

	cacheData.value.showDetail = true;
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
// const onSelectChange = (selectedRowKeys: any) => {
// 	cacheData.value.selectedRowKeys = selectedRowKeys;
// };
// const rowSelection = computed(() => {
// 	if (state.tableData.param.status === 1) {
// 		return { selectedRowKeys: cacheData.value.selectedRowKeys, onChange: onSelectChange };
// 	} else {
// 		return false;
// 	}
// });
const onSelectChange = (selectedRowKeys: any) => {
	cacheData.value.selectedRowKeys = selectedRowKeys;
};
const reset = () => {
	const status = state.tableData.param.status;
	state.tableData.param = {
		createName: null, //申请人
		startTime: null, //申请开始日期
		endTime: null, //申请结束日期
		status, //转账单状态 1-待审核 2-转账完成 3-审核不通过
		pageNo: 1, //页号
		pageSize: 10, //页大小
	};
	state.times = [];
	initList();
};
const timeChange = (arr: any) => {
	console.log(arr);
	if (arr && arr.length > 0) {
		// const timeList: any = [arr[0], arr[1]];
		state.tableData.param.startTime = Date.parse(arr[0]);
		state.tableData.param.endTime = Date.parse(arr[1]);
	} else {
		state.tableData.param.startTime = null;
		state.tableData.param.endTime = null;
	}
};
const detailSubmit = () => {
	initList();
};
const toBatchTransfer = () => {
	if (!cacheData.value.selectedRowKeys.length) {
		message.error(`请选择数据后再进行操作`);
		return;
	}
	const array = Array.from(cacheData.value.selectedRowKeys);
	const id = array.join(',');
	route.push({
		path: '/settlementManagement/transferManagement/batchTransfer',
		query: { id },
	});
};
onMounted(() => {
	initList();
});
</script>
