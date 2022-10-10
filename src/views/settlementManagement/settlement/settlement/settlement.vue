<template>
	<div>
		<CommonTable :dataSource="state.tableData.data" rowKey="oid" :columns="columns" :row-selection="rowSelection">
			<template #button>
				<div class="btn">
					<a-button type="primary" @click="transfer('all', null)">申请转账</a-button>
				</div>
			</template>
			<template #bodyCell="{ column, record }">
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a @click="transfer('one', record)">申请转账</a>
						<a @click="toInfo(record)">查看</a>
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
import { message } from 'ant-design-vue';
import { Modal } from 'ant-design-vue';

const router = useRouter();
const columns = [
	{
		title: '团队类型',
		dataIndex: 'aaa',
		key: 'aaa',
	},
	{
		title: '行程单号',
		dataIndex: 'bbb',
		key: 'bbb',
	},
	{
		title: '线路名称',
		dataIndex: 'ccc',
		key: 'ccc',
	},
	{
		title: '组团社',
		dataIndex: 'ddd',
		key: 'ddd',
	},
	{
		title: '地接社',
		dataIndex: 'eee',
		key: 'eee',
	},
	{
		title: '行程人数',
		dataIndex: 'fff',
		key: 'fff',
	},
	{
		title: '行程费用',
		dataIndex: 'ggg',
		key: 'ggg',
	},
	{
		title: '行程时间',
		dataIndex: 'hhh',
		key: 'hhh',
	},
    {
		title: '结算总额',
		dataIndex: 'iii',
		key: 'iii',
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
				oid: 1,
				key: 1,
				aaa: 'John Brown sr.',
				bbb: 'test',
				ccc: 'test',
				ddd: 'test',
				eee: 'test',
				fff: 'test',
				ggg: 'test',
				hhh: 'test',
                iii: 'test'
			},
			{
				oid: 2,
				key: 2,
				aaa: 'Joe Black',
				bbb: 'test',
				ccc: 'test',
				ddd: 'test',
				eee: 'test',
				fff: 'test',
				ggg: 'test',
				hhh: 'test',
                iii: 'test'
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
	selectedRowKeys: [], //当前选择的标识
	params: {},
	operationModal: {
		isAddOrUpdate: false,
	},
	optionRoleList: [],
});
// 当前选择列
const rowSelection = computed(() => {
	return {
		onChange: (selectedRowKeys: [], selectedRows: any) => {
		state.selectedRowKeys = selectedRowKeys;
	},
	}
})
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
	// api.userList(state.tableData.param).then((res: any) => {
	// 	console.log('res:', res);
	// 	state.tableData.data = res.content;
	// 	state.tableData.total = res.total;
	// });
};

const cancel = (): any => {
	state.operationModal.isAddOrUpdate = false;
};

// const getRoleList = () => {
// 	api
// 		.roleList({
// 			pageNo: 1,
// 			pageSize: 100000,
// 		})
// 		.then((res: any) => {
// 			console.log('角色列表:', res);
// 			state.optionRoleList = res.content.map((item: any) => {
// 				return {
// 					roleName: item.roleName,
// 					roleId: item.oid,
// 				};
// 			});
// 		});
// };

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

// 申请转账
const transfer = (type: string, record: any) => {
	let oid;
	// type:one单项  all批量
	if (type == 'one') {
		oid = record.oid;
	} else {
		// 判断是否有选择项
		if (state.selectedRowKeys.length == 0) {
			message.warn('请先选择转账项');
			return;
		}
		oid = state.selectedRowKeys;
	}
	console.log('把老子的id给打印出来', oid);
	Modal.confirm({
		title: '下团结算',
		width: 560,
		closable: true,
		centered: true,
		icon: false,
		content: '即将为所选行程单发起结算转账，是否确定申请转账？',
		onOk() {
			// api
			// 	.comprehensiveFeeEnable(record.oid)
			// 	.then((res: any) => {
					message.success('操作成功');
			// 		onSearch();
			// 	})
			// 	.catch((err: any) => {
			// 		message.error(err || '操作失败');
			// 	});
		},
		onCancel() {},
	});
};
// 查看详情
const toInfo = (record: any) => {
	router.push({ path: '/settlementManagement/settlement/info', query: { oid: encodeURIComponent(record.oid) } });
};
onMounted(() => {
	// getRoleList();
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
