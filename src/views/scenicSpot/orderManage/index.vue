<template>
	<CommonSearch>
		<search-item label="入园日期">
			<a-select ref="select" style="width: 200px" placeholder="请选择审核状态">
				<a-select-option value="all">all</a-select-option>
			</a-select>
		</search-item>
		<search-item label="核销日期">
			<a-select ref="select" style="width: 200px" placeholder="请选择景区等级">
				<a-select-option value="all">all</a-select-option>
			</a-select>
		</search-item>
		<search-item label="行程单号">
			<a-select ref="select" style="width: 200px" placeholder="请选择景区名称">
				<a-select-option value="all">all</a-select-option>
			</a-select>
		</search-item>
		<search-item label="旅行社名称">
			<a-input placeholder="请输入用户姓名/手机号" style="width: 200px" />
		</search-item>
		<template #button>
			<a-button>查询</a-button>
		</template>
	</CommonSearch>
	<div class="table-area">
		<div class="list-btn">
			<a-button type="primary" class="success">新增</a-button>
		</div>
		<CommonTable :dataSource="dataSource" :columns="columns">
			<template #bodyCell="{ column }">
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a>编辑</a>
						<a>禁用</a>
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
		title: '用户姓名',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: '手机号',
		dataIndex: 'age',
		key: 'age',
	},
	{
		title: '所属单位类型',
		dataIndex: 'address',
		key: 'address',
	},
	{
		title: '所属单位',
		dataIndex: 'address1',
		key: 'address1',
	},
	{
		title: '所属角色',
		dataIndex: 'address2',
		key: 'address2',
	},
	{
		title: '状态',
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
	userList(state.tableData.param).then((res) => {
		console.log(res);
	});
};
</script>

<style lang="less">
.search-area {
	display: flex;
	flex-wrap: wrap;
	padding: 24px 52px 24px 20px;
	border-bottom: 1px #f1f2f5 solid;
	.search-items {
		display: flex;
		align-items: center;
		margin-right: 32px;
		.title {
			color: #1e2226;
			font-weight: bold;
			margin-right: 16px;
		}
	}
	.search-button {
		display: inline-flex;
		justify-content: flex-end;
		float: right;
		text-align: right;
		flex: 1;
	}
}
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
