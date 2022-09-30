<template>
	<div>
		<CommonTable :dataSource="state.tableData.data" :columns="columns" >
			<template #bodyCell="{ column, record }">
				<template v-if="column.key === 'action'">
					<div class="action-btns">
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
