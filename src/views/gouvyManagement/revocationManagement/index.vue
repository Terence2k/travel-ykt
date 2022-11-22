<template>
	<a-spin size="large" :spinning="state.tableData.loading" style="min-height: 50vh">
		<CommonSearch>
			<SearchItem label="接团社">
				<a-input v-model:value="state.tableData.param.itineraryNo" placeholder="请输入行程单号" style="width: 200px" />
			</SearchItem>

			<SearchItem label="出团日期">
				<a-date-picker format="YYYY-MM-DD " value-format="YYYY-MM-DD " v-model:value="state.tableData.param.schoolDate" placeholder="入园日期" />
			</SearchItem>

			<SearchItem label="行程单号">
				<a-input v-model:value="state.tableData.param.itineraryNo" placeholder="请输入行程单号" style="width: 200px" />
			</SearchItem>
			<SearchItem label="行程路线">
				<a-input v-model:value="state.tableData.param.sendTravelName" placeholder="请输入旅行社名称" style="width: 200px" />
			</SearchItem>

			<template #button>
				<a-button @click="reset" style="margin-right: 30px">重置</a-button>
				<a-button @click="search">查询</a-button>
			</template>
		</CommonSearch>

		<a-tabs v-model:activeKey="state.tableData.param.orderState" @tabClick="changePageStatus">
			<a-tab-pane :key="0" tab="审核通过"> </a-tab-pane>
			<a-tab-pane :key="1">
				<template #tab>
					<div class="title-tab">
						待审核
						<a-badge :count="10" class="rebadge" />
					</div>
				</template>
			</a-tab-pane>
			<a-tab-pane :key="2" tab="审核驳回"> </a-tab-pane>
		</a-tabs>

		<div class="table-area">
			<CommonTable :dataSource="state.tableData.data" :columns="columns">
				<template #bodyCell="{ column, record, index }">
					<template v-if="column.key === 'index'">
						{{ index + 1 }}
					</template>

					<template v-if="column.key === 'action'">
						<a href="javascript:;" @click="toDetail(record)">去审核</a>
						<!-- <div class="action-btns" v-else>
							<a href="javascript:;" @click="applyTchange">申请改刷</a>
							<a href="javascript:;" @click="toDetail(record)">查看</a>
						</div> -->
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
					共<span style="color: red">{{ 11 }}</span
					>条撤销待审核订单
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
import ApplyChange from './components/audit.vue';
import { useScenicSpotOption } from '@/stores/modules/scenicSpot';

const scenicSpotOptions = useScenicSpotOption();
const navigatorBar = useNavigatorBar();
// import { userList } from '@/api';

const dataSource = ref([
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
]);

const columns = [
	{
		title: '序号',
		dataIndex: 'index',
		key: 'index',
		width: 80,
	},
	{
		title: '原始行程单号',
		dataIndex: 'orderNo',
		key: 'orderNo',
		width: 200,
	},
	{
		title: '线路名称',
		dataIndex: 'itineraryNo',
		key: 'itineraryNo',
		width: 120,
	},
	{
		title: '发团社',
		dataIndex: 'localTravelName',
		key: 'localTravelName',
		width: 120,
	},
	{
		title: '接团社',
		dataIndex: 'ticketName',
		key: 'ticketName',
		width: 120,
	},

	{
		title: '行程人数',
		dataIndex: 'schoolDate',
		key: 'schoolDate',
		width: 120,
	},
	{
		title: '原始减免人数',
		dataIndex: 'schoolDate',
		key: 'schoolDate',
		width: 120,
	},
	{
		title: '出票状态',
		dataIndex: 'ticketType',
		key: 'ticketType',
		width: 80,
	},
	{
		title: '查验状态',
		dataIndex: 'ticketType',
		key: 'ticketType',
		width: 80,
	},
	{
		title: '撤销时间',
		dataIndex: 'verificationTime',
		key: 'verificationTime',
		width: 140,
	},
	{
		title: '重提后变更人数',
		dataIndex: 'bookTime',
		key: 'bookTime',
		width: 140,
	},
	{
		title: '变更人数是否超过10%',
		dataIndex: 'orderStatus',
		key: 'orderStatus',
		width: 80,
	},

	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		width: 120,
	},
];

interface stateType {
	tableData: {
		data: any[];
		total: number;
		loading: boolean;
		param: {
			schoolDate: string | null | number;
			verificationTime: string | null | number;
			sendTravelName: string | null | number;
			orderState: string | null | number;
			itineraryNo: string | null | number;
			pageNo: string | null | number;
			pageSize: string | null | number;
		};
	};
}

const state = reactive<stateType>({
	tableData: {
		data: [],
		total: 400,
		loading: false,
		param: {
			schoolDate: '',
			verificationTime: '',
			sendTravelName: '',
			orderState: 0,
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
const changePageStatus = (value: number) => {
	state.tableData.param.orderState = value;
	search();
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
	applyTchange();
	// route.push({ path: '/scenic-spot/order-manage/edit', query: { oid: record.orderNo } });
};
//查看
const toVerifivcation = (record: any) => {
	// scenicSpotOptions.setVerification(record.orderNo);
	// route.push({ path: '/scenic-spot/verificationRecord', query: { oid: record.orderNo } });
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
	state.tableData.total = res.total;
	console.log(res);
};

const initOption = async () => {
	let res = api.commonApi.getVerifyListType('IDENTITY_CARD');
	console.log(res);
};

onMounted(() => {
	// init();
	navigatorBar.setNavigator(['古维管理', '撤销重提管理']);
});
onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
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
.title-tab {
	position: relative;
	.rebadge {
		position: absolute;
		top: -10px;
	}
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
		// width: 100%;
		width: 200px;
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
