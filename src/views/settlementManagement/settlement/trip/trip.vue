<template>
	<div>
		<CommonTable :dataSource="state.tableData.data" rowKey="oid" :columns="columns" :rowSelection="rowSelection">
			<template #button>
				<div class="btn">
					<a-button type="primary">下团结算</a-button>
				</div>
			</template>
			<template #bodyCell="{ column }">
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a @click="opendetailPage">下团结算</a>
						<a @click="opendetailPage">查看</a>
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

<script lang="ts" setup>
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import { reactive, onMounted } from 'vue';
import api from '@/api';

const router = useRouter();
const columns = [
	{
		title: '团队类型',
		dataIndex: 'username',
		key: 'username',
	},
	{
		title: '行程单号',
		dataIndex: 'mobile',
		key: 'mobile',
	},
	{
		title: '线路名称',
		dataIndex: 'unitTypeName',
		key: 'unitTypeName',
	},
	{
		title: '组团社',
		dataIndex: 'unitName',
		key: 'unitName',
	},
	{
		title: '地接社',
		dataIndex: 'roleList',
		key: 'roleList',
	},
	{
		title: '行程人数',
		dataIndex: 'userStatusName',
		key: 'userStatusName',
	},
	{
		title: '行程费用',
		dataIndex: 'userStatusName',
		key: 'userStatusName',
	},
	{
		title: '行程时间',
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
		data: [
			{
				id: 1,
				key: 1,
				name: 'John Brown sr.',
				age: 60,
				address: 'New York No. 1 Lake Park',
			},
			{
				id: 2,
				key: 2,
				name: 'Joe Black',
				age: 32,
				address: 'Sidney No. 1 Lake Park',
			},
		],
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
// 当前选择列
const rowSelection = ref({
	checkStrictly: false,
	onChange: (selectedRowKeys: [], selectedRows: any) => {
		console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
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

const opendetailPage = () => {
	router.push({ path: '/catering/order_Management/order_detail' });
};

onMounted(() => {
	getRoleList();
	onSearch();
});
</script>

<style lang="less" scoped>
.btn {
	margin: -8px 0 8px 0;
}
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
