<template>
	<div>
		<CommonSearch>
			<search-item label="状态">
				<a-select ref="select" placeholder="请选择状态">
					<a-select-option value="all">all</a-select-option>
				</a-select>
			</search-item>
			<search-item label="所属门店">
				<a-select ref="select" placeholder="请选择所属门店">
					<a-select-option value="all">all</a-select-option>
				</a-select>
			</search-item>
			<search-item label="联系电话">
				<a-input placeholder="请输入联系电话" />
			</search-item>
			<template #button>
				<a-button @click="onSearch">查询</a-button>
			</template>
		</CommonSearch>
		<CommonTable :dataSource="state.tableData.data" rowKey="id" :columns="columns">
			<template #button>
				<a-button type="primary">导出</a-button>
			</template>
			<template #bodyCell="{ column }">
				
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a>查看</a>
						<a>编辑</a>
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
import { ref, reactive,onMounted } from 'vue';
import api from '@/api';

const columns = [
	{ title: '序号',dataIndex: 'oid',  width: 70, key: 'arrange' },
	{
		title: '用户姓名',
		dataIndex: 'username',
		key: 'username',
	},
	{
		title: '手机号',
		dataIndex: 'mobile',
		key: 'mobile',
	},
	{
		title: '所属单位类型',
		dataIndex: 'unitTypeName',
		key: 'unitTypeName',
	},
	{
		title: '所属单位',
		dataIndex: 'unitName',
		key: 'unitName',
	},
	{
		title: '所属角色',
		dataIndex: 'roleList',
		key: 'roleList',
	},
	{
		title: '状态',
		dataIndex: 'userStatusName',
		key: 'userStatusName',
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
		total: 0,
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			keyWord: '',
			roleName: '',
			status: null,
			uniType: '',
		},
	},
	params: {},
	operationModal: {
		isAddOrUpdate: false,
	},
	optionRoleList: [],
});

const onHandleCurrentChange = (val: number) => {
	console.log('change:', val);
	state.tableData.param.pageNo = val;
	onSearch();
};

const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	state.tableData.param.pageSize = size;
	onSearch();
};

const onSearch = () => {
	api.userList(state.tableData.param).then((res: any) => {
		console.log('res:', res);
		state.tableData.data = res.content;
		state.tableData.total = res.total;
	});
};

const cancel = (): any => {
	state.operationModal.isAddOrUpdate = false;
};

const getRoleList = () => {
	api
		.roleList({
			pageNo: 1,
			pageSize: 100000,
		})
		.then((res: any) => {
			console.log('角色列表:', res);
			state.optionRoleList = res.content.map((item: any) => {
				return {
					roleName: item.roleName,
					roleId: item.oid,
				};
			});
		});
};

const addOrUpdate = (param: any) => {
	console.log('state.operationModal.isAddOrUpdate:', state.operationModal.isAddOrUpdate);

	const { row, handle } = param;
	console.log(row);
	console.log(handle);

	state.params = {};
	if (handle === 'update') {
		state.params = row;
	}
	state.operationModal.isAddOrUpdate = true;
};

onMounted(() => {
	getRoleList();
	onSearch();
});
</script>

<style lang="less">
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
