<template>
	<a-spin size="large" :spinning="state.tableData.loading" style="min-height: 50vh">
		<CommonSearch>
			<SearchItem label="入园日期">
				<a-date-picker format="YYYY-MM-DD " value-format="YYYY-MM-DD " v-model:value="state.tableData.param.schoolDate" placeholder="入园日期" />
			</SearchItem>
			<SearchItem label="核销日期">
				<a-date-picker
					format="YYYY-MM-DD "
					value-format="YYYY-MM-DD "
					v-model:value="state.tableData.param.verificationTime"
					placeholder="入园日期"
				/>
				<!-- <a-date-picker
					v-model:value="state.tableData.param.verificationTime"
					:show-time="{ format: 'HH:mm:ss' }"
					format="YYYY-MM-DD HH:mm:ss"
					value-format="YYYY-MM-DD HH:mm:ss"
					placeholder="核销日期"
					style="width: 120px"
				/> -->
			</SearchItem>
			<SearchItem label="行程单号">
				<a-input v-model:value="state.tableData.param.itineraryNo" placeholder="请输入行程单号" style="width: 200px" />
			</SearchItem>
			<SearchItem label="旅行社名称">
				<a-input v-model:value="state.tableData.param.sendTravelName" placeholder="请输入旅行社名称" style="width: 200px" />
			</SearchItem>

			<template #button>
				<a-button @click="reset" style="margin-right: 30px">重置</a-button>
				<a-button @click="search">查询</a-button>
			</template>
		</CommonSearch>

		<a-tabs v-model:activeKey="state.tableData.param.orderState" @tabClick="changePageStatus">
			<a-tab-pane key="" tab="全部"> </a-tab-pane>
			<a-tab-pane :key="0" tab="待预定"> </a-tab-pane>
			<a-tab-pane :key="1" tab="已预定"> </a-tab-pane>
			<a-tab-pane :key="2" tab="已核销"> </a-tab-pane>
			<a-tab-pane :key="3" tab="已结算"> </a-tab-pane>
			<a-tab-pane :key="-1" tab="已作废"> </a-tab-pane>
			<!-- <a-tab-pane :key="0" tab="已下单"> </a-tab-pane>
			<a-tab-pane :key="1" tab="已预定"> </a-tab-pane>
			<a-tab-pane :key="2" tab="预支付"> </a-tab-pane>
			<a-tab-pane :key="3" tab="已支付"> </a-tab-pane>
			<a-tab-pane :key="4" tab="已核销"> </a-tab-pane>
			<a-tab-pane :key="5" tab="已结算"> </a-tab-pane>
			<a-tab-pane :key="6" tab="已转账"> </a-tab-pane>
			<a-tab-pane :key="-2" tab="已过期"> </a-tab-pane>
			<a-tab-pane :key="-3" tab="已作废"> </a-tab-pane> -->
		</a-tabs>
		<div class="table-area">
			<CommonTable :dataSource="state.tableData.data" :columns="columns">
				<template #bodyCell="{ column, record }">
					<template v-if="column.key === 'orderAmount'">
						<span v-if="typeof record.orderAmount === 'number'">
							{{ record.orderAmount / 100 }}
						</span>
						<span v-else> - </span>
					</template>
					<template v-if="column.key === 'ticketType'">
						{{ ticketType[record.ticketType] }}
					</template>
					<template v-if="column.key === 'orderStatus'">
						{{ writeOffStatusOptionsData[record.orderStatus] }}
					</template>
					<template v-if="column.key === 'action'">
						<div class="action-btns" v-if="state.tableData.param.orderState !== 2">
							<a href="javascript:;" @click="toDetail(record)">查看</a>
							<a href="javascript:;" @click="toVerifivcation(record)">核销记录</a>
						</div>
						<div class="action-btns" v-else>
							<a href="javascript:;" @click="applyTchange">申请改刷</a>
							<a href="javascript:;" @click="toDetail(record)">查看</a>
						</div>
					</template>
				</template>
			</CommonTable>
			<CommonPagination
				:current="state.tableData.param.pageNo"
				:page-size="state.tableData.param.pageSize"
				:total="state.tableData.total"
				@change="onHandleCurrentChange"
				@showSizeChange="pageSideChange"
			/>

			<div class="footer">
				<div class="tooter-btn">
					<a-button type="primary" @click="exportBtn">导出</a-button>
				</div>
			</div>
		</div>

		<ApplyChange ref="applyTchangeRef" />
	</a-spin>
</template>

<script setup lang="ts">
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import api from '@/api';
import viewTable from './components/table.vue';
import ApplyChange from './components/applyChange.vue';
const navigatorBar = useNavigatorBar();
const ticketType = ['联票', '单票', '演出票'];
// import { userList } from '@/api';
const dataSource = [
	{
		orderNo: 'XXX20221027ABC',
		itineraryNo: 'LYF000000001',
		localTravelName: '黑白水旅行社',
		ticketName: '入园',
		ticketType: 1,
		schoolDate: '2022-7-14',
		verificationTime: '2022-7-12 17:50:45',
		bookTime: '2022-7-12 17:50:45',
		orderStatus: '已核销',
		bookCount: '30',
		verificationCount: '30',
		orderAmount: 1100,
	},
	{
		orderNo: 'XXX20221027ABC',
		itineraryNo: 'LYF000000002',
		localTravelName: '黑白水旅行社',
		ticketName: '入园',
		ticketType: 1,
		schoolDate: '2022-7-14',
		verificationTime: '2022-7-12 17:50:45',
		bookTime: '2022-7-12 17:50:45',
		orderStatus: '已核销',
		bookCount: '30',
		verificationCount: '30',
		orderAmount: 1122,
	},
	{
		orderNo: 'XXX20221027ABC',
		itineraryNo: 'LYF000000003',
		localTravelName: '黑白水旅行社',
		ticketName: '入园',
		ticketType: 2,
		schoolDate: '2022-7-14',
		verificationTime: '2022-7-12 17:50:45',
		bookTime: '2022-7-12 17:50:45',
		orderStatus: '已核销',
		bookCount: '30',
		verificationCount: '30',
		orderAmount: 1100,
	},
	{
		orderNo: 'XXX20221027ABC',
		itineraryNo: 'LYF000000004',
		localTravelName: '黑白水旅行社',
		ticketName: '入园',
		ticketType: 1,
		schoolDate: '2022-7-14',
		verificationTime: '2022-7-12 17:50:45',
		bookTime: '2022-7-12 17:50:45',
		orderStatus: '已核销',
		bookCount: '30',
		verificationCount: '30',
		orderAmount: 1100,
	},
	{
		orderNo: 'XXX20221027ABC',
		itineraryNo: 'LYF000000005',
		localTravelName: '黑白水旅行社',
		ticketName: '入园',
		ticketType: 0,
		schoolDate: '2022-7-14',
		verificationTime: '2022-7-12 17:50:45',
		bookTime: '2022-7-12 17:50:45',
		orderStatus: '已核销',
		bookCount: '30',
		verificationCount: '30',
		orderAmount: 1100,
	},
];

//核销状态
let writeOffStatusOptionsData = {
	0: '待预定',
	1: '已预定',
	2: '已核销',
	3: '已结算',
	[-1]: '已作废',
};

const columns = [
	{
		title: '订单编号',
		dataIndex: 'orderNo',
		key: 'orderNo',
		width: 200,
	},
	{
		title: '行程单号',
		dataIndex: 'itineraryNo',
		key: 'itineraryNo',
		width: 120,
	},
	{
		title: '旅行社名称',
		dataIndex: 'localTravelName',
		key: 'localTravelName',
		width: 120,
	},
	{
		title: '门票名称',
		dataIndex: 'ticketName',
		key: 'ticketName',
		width: 120,
	},
	{
		title: '门票分类',
		dataIndex: 'ticketType',
		key: 'ticketType',
		width: 80,
	},
	{
		title: '入园日期',
		dataIndex: 'schoolDate',
		key: 'schoolDate',
		width: 120,
	},
	{
		title: '核销时间',
		dataIndex: 'verificationTime',
		key: 'verificationTime',
		width: 140,
	},
	{
		title: '预定时间',
		dataIndex: 'bookTime',
		key: 'bookTime',
		width: 140,
	},
	{
		title: '核销状态',
		dataIndex: 'orderStatus',
		key: 'orderStatus',
		width: 80,
	},
	{
		title: '订票人数',
		dataIndex: 'bookCount',
		key: 'bookCount',
		width: 80,
	},
	{
		title: '核销人数',
		dataIndex: 'verificationCount',
		key: 'verificationCount',
		width: 80,
	},
	{
		title: '订单金额（元）',
		dataIndex: 'orderAmount',
		key: 'orderAmount',
		width: 120,
	},
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		width: 120,
	},
];

const state = reactive({
	tableData: {
		data: [],
		total: 400,
		loading: false,
		param: {
			schoolDate: '',
			verificationTime: '',
			sendTravelName: '',
			orderState: '',
			itineraryNo: null,
			pageNo: 1,
			pageSize: 10,
		},
	},
});

const tabActive = ref('');

//申请改刷
const applyTchangeRef = ref();
const applyTchange = () => {
	applyTchangeRef.value.open();
};

//改变状态
const changePageStatus = (e: any) => {
	state.tableData.param.orderState = e;
	init();
};
//重置
const reset = () => {
	state.tableData.param.sendTravelName = '';
	state.tableData.param.itineraryNo = null;
	state.tableData.param.verificationTime = '';
	state.tableData.param.schoolDate = '';
	state.tableData.param.pageNo = 1;
};
//查看
const route = useRouter();
const toDetail = (record: any) => {
	route.push({ path: '/scenic-spot/order-manage/edit', query: { oid: record.orderNo } });
};
//查看
const toVerifivcation = (record: any) => {
	route.push({ path: '/scenic-spot/verificationRecord', query: { oid: record.orderNo } });
};

//导出
const exportBtn = () => {};
const onHandleCurrentChange = (val: number) => {
	state.tableData.param.pageNo = val;
	init();
};
//搜索
const search = () => {
	state.tableData.param.pageNo = 1;
	init();
};
const pageSideChange = (current: number, size: number) => {
	state.tableData.param.pageSize = size;
	init();
};

const init = async () => {
	state.tableData.loading = true;
	let res = await api.getViewOrderList(state.tableData.param);
	state.tableData.loading = false;
	state.tableData.data = res.content;
	// state.tableData.data = dataSource;
	state.tableData.total = res.total;
	console.log(res);
};

const initOption = async () => {
	// let res = api.getDictionary(139);
	let res = api.commonApi.getVerifyListType('IDENTITY_CARD');
	console.log(res);
};

onMounted(() => {
	init();
	// initOption();
	// navigatorBar.setNavigator(['订单管理']);
});
onBeforeUnmount(() => {
	// navigatorBar.clearNavigator();
});
</script>

<style scoped lang="less">
.table-area {
	// padding-bottom: 16px;
	padding: 0 10px;
	// margin: 0 10px;
}

::v-deep .ant-table-body {
	// max-height: 38vh !important;
}
.ant-tabs-top > .ant-tabs-nav {
	margin: 0;
}

.footer {
	position: fixed;
	bottom: 12px;
	line-height: 64px;
	height: 64px;
	width: 100px;
	margin-left: -16px;
	margin-right: 24px;
	background-color: transparent;
	z-index: 101;

	.tooter-btn {
		width: 60%;
		margin-left: 16px;
	}
	button:first-of-type {
		margin-right: 16px;
	}
}
::v-deep .ant-tabs-nav-wrap {
	margin-left: 20px;
}
</style>
