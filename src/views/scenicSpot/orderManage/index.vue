<template>
	<a-spin size="large" :spinning="state.tableData.loading" style="min-height: 50vh">
		<CommonSearch>
			<SearchItem label="入园日期">
				<a-select ref="select" style="width: 200px" placeholder="请选择审核状态">
					<a-select-option value="all">all</a-select-option>
				</a-select>
			</SearchItem>
			<SearchItem label="核销日期">
				<a-select ref="select" style="width: 200px" placeholder="请选择景区等级">
					<a-select-option value="all">all</a-select-option>
				</a-select>
			</SearchItem>
			<SearchItem label="行程单号">
				<a-select ref="select" style="width: 200px" placeholder="请选择景区名称">
					<a-select-option value="all">all</a-select-option>
				</a-select>
			</SearchItem>
			<SearchItem label="旅行社名称">
				<a-input placeholder="请输入用户姓名/手机号" style="width: 200px" />
			</SearchItem>
			<template #button>
				<a-button>查询</a-button>
			</template>
		</CommonSearch>

		<a-tabs v-model:activeKey="state.tableData.param.orderState" @tabClick="changePageStatus">
			<a-tab-pane key="" tab="全部"> </a-tab-pane>
			<a-tab-pane :key="0" tab="未开始"> </a-tab-pane>
			<a-tab-pane :key="1" tab="进行中"> </a-tab-pane>
			<a-tab-pane :key="2" tab="已完成"> </a-tab-pane>
			<a-tab-pane :key="3" tab="已过期"> </a-tab-pane>
			<a-tab-pane :key="4" tab="已取消"> </a-tab-pane>
		</a-tabs>
		<div class="table-area">
			<CommonTable :dataSource="dataSource" :columns="columns" :scroll="{ x: '100vw', y: '42vh' }">
				<template #bodyCell="{ column, record }">
					<template v-if="column.key === 'action'">
						<div class="action-btns" v-if="state.tableData.param.orderState !== 2">
							<a href="javascript:;" @click="toDetail(record)">查看</a>
							<a href="javascript:;">核销记录</a>
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
					<!-- <a-button type="primary" @click.prevent="onSubmit">保存</a-button> -->
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
// import { userList } from '@/api';
const dataSource = [
	{
		key: '1',
		name: '王某某',
		age: 32,
		address: '西湖区湖底公园1号',
		address1: '西湖区湖底公园1号',
		address2: '西湖区湖底公园1号',
		address3: '西湖区湖底公园1号',
	},
	{
		key: '2',
		name: '张某某',
		age: 42,
		address: '西湖区湖底公园1号',
		address1: '西湖区湖底公园1号',
		address2: '西湖区湖底公园1号',
		address3: '西湖区湖底公园1号',
	},
	{
		key: '3',
		name: '张某某',
		age: 42,
		address: '西湖区湖底公园1号',
		address1: '西湖区湖底公园1号',
		address2: '西湖区湖底公园1号',
		address3: '西湖区湖底公园1号',
	},
	{
		key: '4',
		name: '张某某',
		age: 42,
		address: '西湖区湖底公园1号',
		address1: '西湖区湖底公园1号',
		address2: '西湖区湖底公园1号',
		address3: '西湖区湖底公园1号',
	},
	{
		key: '1',
		name: '王某某',
		age: 32,
		address: '西湖区湖底公园1号',
		address1: '西湖区湖底公园1号',
		address2: '西湖区湖底公园1号',
		address3: '西湖区湖底公园1号',
	},
	{
		key: '2',
		name: '张某某',
		age: 42,
		address: '西湖区湖底公园1号',
		address1: '西湖区湖底公园1号',
		address2: '西湖区湖底公园1号',
		address3: '西湖区湖底公园1号',
	},
	{
		key: '3',
		name: '张某某',
		age: 42,
		address: '西湖区湖底公园1号',
		address1: '西湖区湖底公园1号',
		address2: '西湖区湖底公园1号',
		address3: '西湖区湖底公园1号',
	},
	{
		key: '4',
		name: '张某某',
		age: 42,
		address: '西湖区湖底公园1号',
		address1: '西湖区湖底公园1号',
		address2: '西湖区湖底公园1号',
		address3: '西湖区湖底公园1号',
	},
	{
		key: '5',
		name: '张某某',
		age: 42,
		address: '西湖区湖底公园1号',
		address1: '西湖区湖底公园1号',
		address2: '西湖区湖底公园1号',
		address3: '西湖区湖底公园1号',
	},
	{
		key: '6',
		name: '张某某',
		age: 42,
		address: '西湖区湖底公园1号',
		address1: '西湖区湖底公园1号',
		address2: '西湖区湖底公园1号',
		address3: '西湖区湖底公园1号',
	},
	{
		key: '7',
		name: '张某某',
		age: 42,
		address: '西湖区湖底公园1号',
		address1: '西湖区湖底公园1号',
		address2: '西湖区湖底公园1号',
		address3: '西湖区湖底公园1号',
	},
];
const columns = [
	{
		title: '订单编号',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: '行程单号',
		dataIndex: 'age',
		key: 'age',
	},
	{
		title: '旅行社名称',
		dataIndex: 'address',
		key: 'address',
	},
	{
		title: '门票',
		dataIndex: 'address1',
		key: 'address1',
	},
	{
		title: '门票分类',
		dataIndex: 'address2',
		key: 'address2',
	},
	{
		title: '入园日期',
		dataIndex: 'address3',
		key: 'address3',
	},
	{
		title: '核销时间',
		dataIndex: 'address3',
		key: 'address3',
	},
	{
		title: '预定时间',
		dataIndex: 'address3',
		key: 'address3',
	},
	{
		title: '核销状态',
		dataIndex: 'address3',
		key: 'address3',
	},
	{
		title: '订票人数',
		dataIndex: 'address3',
		key: 'address3',
	},
	{
		title: '核销人数',
		dataIndex: 'address3',
		key: 'address3',
	},
	{
		title: '订单金额（元）',
		dataIndex: 'address3',
		key: 'address3',
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
		data: [],
		total: 400,
		loading: false,
		param: {
			schoolTime: '',
			verificationTime: '',
			agencyName: '',
			orderState: '',
			itineraryNumber: null,
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
//查看
const route = useRouter();
const toDetail = (record: any) => {
	route.push({ path: '/scenic-spot/order-manage/edit', query: { oid: record.oid } });
};

//导出
const exportBtn = () => {};
const onHandleCurrentChange = (val: number) => {
	state.tableData.param.pageNo = val;
	init();
};

const pageSideChange = (current: number, size: number) => {
	state.tableData.param.pageSize = size;
	init();
};

const init = async () => {
	// state.tableData.loading = true;
	let res = await api.getViewOrderList(state.tableData.param);
	state.tableData.loading = false;
	console.log(res);
};
onMounted(() => {
	init();
	// navigatorBar.setNavigator(['订单管理']);
});
onBeforeUnmount(() => {
	// navigatorBar.clearNavigator();
});
</script>

<style lang="scss" scoped>
.table-area {
	margin-bottom: 64px;
}
// .trave-contaner {
// 	height: 100%;
// 	::v-deep(.ant-tabs-nav) {
// 		padding: 0 20px;
// 	}
// }
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
	width: calc(100% - 292px);
	// border-top: 1px solid #f1f2f5;
	margin-left: -16px;
	margin-right: 24px;
	background-color: #fff;
	z-index: 99;

	.tooter-btn {
		width: 60%;
		// background-color: #fff;
		margin-left: 16px;
	}
	button:first-of-type {
		margin-right: 16px;
	}
}
</style>
<style lang="scss">
.ant-tabs-nav-wrap {
	margin-left: 20px;
}
</style>
