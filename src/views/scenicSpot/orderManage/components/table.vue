<template>
	<div class="table-area">
		<div class="list-btn">
			<a-button type="primary" class="success">新增</a-button>
		</div>
		<CommonTable :dataSource="dataSource" :columns="columns" :scroll="{ x: '100%' }">
			<template #bodyCell="{ column }">
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a>申请改刷</a>
						<a>查看</a>
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
	</div>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';

// const navigatorBar = useNavigatorBar();
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
			pageNo: 1,
			pageSize: 10,
		},
	},
});

const tabActive = ref('1');

const onHandleCurrentChange = (val: number) => {
	console.log('change:', val);
	state.tableData.param.pageNo = val;
	onSearch();
};

const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	state.tableData.param.pageSize = size;
	// onSearch();
};

const onSearch = () => {
	// userList(state.tableData.param).then((res) => {
	// 	console.log(res);
	// });
};
</script>

<style lang="less" scoped>
.table-area {
	overflow: hidden;
	.list-btn {
		display: flex;
		justify-content: flex-end;
		padding: 24px 52px 16px;
	}
	.success {
		background-color: #36b374;
		color: #fff;
	}
	.action-btns {
		a {
			margin: 0 6px;
			&:first-of-type {
				margin-left: 0;
			}
		}
	}
}

// table style
.ant-table-thead > tr > th {
	border-top: 1px solid #f0f0f0;
	background-color: #fcfcfc;
	&::before {
		height: 100% !important;
	}
}
.ant-table-body {
	height: 500px;
}
</style>
