<template>
	<a-spin size="large" :spinning="state.tableData.loading" style="min-height: 50vh">
		<CommonSearch>
			<SearchItem label="撤销类型">
				<a-select v-model:value="state.tableData.param.revokeType" :allowClear="true" ref="select" style="width: 200px" placeholder="门票名称/关键词">
					<a-select-option label="全部" :value="''">全部</a-select-option>
					<a-select-option label="整团撤销" :value="1">整团撤销</a-select-option>
					<a-select-option label="撤销重提" :value="2">撤销重提</a-select-option>
					<a-select-option label="撤销重提关联新单子" :value="3">撤销重提关联新单子</a-select-option>
				</a-select>
			</SearchItem>
			<SearchItem label="接团社">
				<a-input v-model:value="state.tableData.param.subTravelName" placeholder="请输入接团社" style="width: 200px" />
			</SearchItem>

			<SearchItem label="出团日期">
				<a-date-picker
					format="YYYY-MM-DD  HH:mm:ss"
					value-format="YYYY-MM-DD HH:mm:ss"
					:show-time="{ format: 'HH:mm:ss' }"
					v-model:value="state.tableData.param.startDate"
					placeholder="入园日期"
				/>
			</SearchItem>

			<SearchItem label="行程单号">
				<a-input v-model:value="state.tableData.param.itineraryNo" placeholder="请输入行程单号" style="width: 200px" />
			</SearchItem>

			<SearchItem label="行程路线">
				<a-input v-model:value="state.tableData.param.routeName" placeholder="请输入行程路线" style="width: 200px" />
			</SearchItem>

			<template #button>
				<a-button @click="reset" style="margin-right: 30px">重置</a-button>
				<a-button @click="search">查询</a-button>
			</template>
		</CommonSearch>

		<a-tabs v-model:activeKey="state.tableData.param.status" @tabClick="changePageStatus">
			<a-tab-pane :key="1" tab="审核通过"> </a-tab-pane>
			<a-tab-pane :key="0">
				<template #tab>
					<div class="title-tab">
						待审核
						<a-badge :count="waitingBar" class="rebadge" />
					</div>
				</template>
			</a-tab-pane>
			<a-tab-pane :key="-1" tab="审核驳回"> </a-tab-pane>
		</a-tabs>

		<div class="table-area">
			<CommonTable :dataSource="state.tableData.data" :columns="columns">
				<template #bodyCell="{ column, record, index }">
					<template v-if="column.key === 'index'">
						{{ index + 1 }}
					</template>
					<template v-if="column.key === 'checkStatus'">
						{{ record.checkStatus ? '已查验' : '未查验' }}
					</template>
					<template v-if="column.key === 'issueStatus'">
						{{ record.issueStatus ? '已出票' : '未出票' }}
					</template>
					<template v-if="column.key === 'revokeType'">
						{{ revokeTypeList[record.revokeType] }}
					</template>
					<template v-if="column.key === 'revokeTime'">
						{{ shijianc(record.revokeTime) }}
					</template>

					<template v-if="column.key === 'action'">
						<a-button type="link" v-if="!state.tableData.param.status" @click="toDetail(record)">去审核</a-button>
						<a-button type="link" v-if="state.tableData.param.status" @click="check(record)">查看</a-button>
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

			<div class="footer" v-show="state.tableData.param.status === 0">
				<div class="tooter-btn">
					共<span style="color: red">{{ state.tableData.total }}</span
					>条撤销待审核订单
				</div>
			</div>
		</div>

		<Audit ref="auditRef" @finish="init" />
		<Revoke ref="revokeRef" @finish="init" />
		<Detail ref="detailRef" />
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
import Audit from './components/audit.vue';
import Revoke from './components/revoke.vue';
import Detail from './components/detaiil.vue';
import { shijianc, shijiancTOYMD } from '@/utils/formatTimes';
import { useScenicSpotOption } from '@/stores/modules/scenicSpot';

const scenicSpotOptions = useScenicSpotOption();
const navigatorBar = useNavigatorBar();
// import { userList } from '@/api';

const dataSource = ref([]);

const revokeTypeList = [, '整团撤销', '撤销重提', '撤销重提关联新单子'];

const columns = [
	{
		title: '序号',
		dataIndex: 'index',
		key: 'index',
		width: 80,
	},
	{
		title: '原始行程单号',
		dataIndex: 'itineraryNo',
		key: 'itineraryNo',
		width: 200,
	},
	{
		title: '线路名称',
		dataIndex: 'routeName',
		key: 'routeName',
		width: 120,
	},
	{
		title: '发团社',
		dataIndex: 'travelName',
		key: 'travelName',
		width: 120,
	},
	{
		title: '接团社',
		dataIndex: 'subTravelName',
		key: 'subTravelName',
		width: 120,
	},

	{
		title: '行程人数',
		dataIndex: 'originTouristCount',
		key: 'originTouristCount',
		width: 120,
	},
	{
		title: '原始减免人数',
		dataIndex: 'originalReduceNum',
		key: 'originalReduceNum',
		width: 120,
	},
	{
		title: '出票状态',
		dataIndex: 'issueStatus',
		key: 'issueStatus',
		width: 80,
	},
	{
		title: '查验状态',
		dataIndex: 'checkStatus',
		key: 'checkStatus',
		width: 80,
	},
	{
		title: '撤销时间',
		dataIndex: 'revokeTime',
		key: 'revokeTime',
		width: 140,
	},
	{
		title: '撤销类型',
		dataIndex: 'revokeType',
		key: 'revokeType',
		width: 140,
	},
	{
		title: '重提后变更人数',
		dataIndex: 'changeTouristCount',
		key: 'changeTouristCount',
		width: 140,
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
			status: number;
			pageNo: string | null | number;
			pageSize: string | null | number;
			itineraryNo: string | null | number;
			routeName: string | null | number;
			subTravelName: string | null | number;
			startDate: string | null | number;
			endDate: string | null | number;
			revokeType: string | null | number;
		};
	};
}

const state = reactive<stateType>({
	tableData: {
		data: [],
		total: 400,
		loading: false,
		param: {
			pageNo: 1, //页号
			pageSize: 10, //页大小
			status: 1, //状态
			itineraryNo: '', //行程单号
			routeName: '', //xian'l线路mignmign'c名称
			subTravelName: '', //地接社名称
			startDate: '', //开始日期
			endDate: '', //结束日期
			revokeType: '',
		},
	},
});

//去审核
const auditRef = ref();
const revokeRef = ref();

const allRevoke = (id: number) => {
	auditRef.value.open(id);
};
const revokeRefOpen = (id: number) => {
	revokeRef.value.open(id);
};

//改变状态
const changePageStatus = (value: number) => {
	state.tableData.param.status = value;
	search();
};

//重置
const reset = () => {
	state.tableData.param.startDate = '';
	state.tableData.param.routeName = '';
	state.tableData.param.itineraryNo = '';
	state.tableData.param.subTravelName = '';
	state.tableData.param.pageNo = 1;
};

//查看
const route = useRouter();

const checkPower = async (value: any) => {
	let pW = new FormData();

	pW.append('itineraryId', value.oid);
	pW.append('relatedItineraryNo', value.itineraryNo);

	await api.travelManagement.repealNreapplyPagePower(pW);

	return true;
};

const detailRef = ref();

const check = async (record: any) => {
	// let valid = await checkPower(record);
	detailRef.value.open(record.oid);
	// revokeRefOpen(record.oid);

	// route.push({ path: '/scenic-spot/order-manage/edit', query: { oid: record.orderNo } });
};
const toDetail = async (record: any) => {
	// let valid = await checkPower(record);
	console.log(record.revokeType, 'record.revokeType');
	if (record.revokeType === 1) {
		allRevoke(record.oid);
		console.log('整团撤销', record.revokeType);
	} else if (record.revokeType === 2) {
		console.log('撤销重提', record.revokeType);
		revokeRefOpen(record.oid);
	}

	// route.push({ path: '/scenic-spot/order-manage/edit', query: { oid: record.orderNo } });
};
//查看
const toVerifivcation = (record: any) => {
	// scenicSpotOptions.setVerification(record.orderNo);
	// route.push({ path: '/scenic-spot/verificationRecord', query: { oid: record.orderNo } });
};

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
	let res = await api.travelManagement.travelRepealNreapplyPageList(state.tableData.param);
	state.tableData.loading = false;
	state.tableData.data = res.content;
	state.tableData.total = res.total;
	console.log(res);
};

const waitingBar = ref(0);

const initWaitingBar = async () => {
	let res = await api.travelManagement.travelRepealNreapplyPageList({ status: 0, pageNo: 1, pageSize: 10 });
	waitingBar.value = res.total;
};

onMounted(() => {
	init();
	initWaitingBar();
	navigatorBar.setNavigator(['旅行社管理', '撤销重提管理']);
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
