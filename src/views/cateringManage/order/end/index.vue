<template>
	<div>
		<CommonTable :dataSource="data" rowKey="id" :columns="columns">
			<template #button>
				<a-button type="primary">导出</a-button>
			</template>
			<template #bodyCell="{ column, index }">
				<template v-if="column.key === 'index'">
					<div>
						{{ index + 1 }}
					</div>
				</template>
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a @click="opendetailPage">查看</a>
						<a @click="visible = true">申请改刷</a>
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
		<BaseModal :title="'申请改刷'" v-model="visible" :onOk="handleOk">
			<a-form :model="formState">
				<a-form-item label="当前核销人数">
					<span>{{ state.num }}</span>
				</a-form-item>
				<a-form-item label="申请人数">
					<a-input v-model:value="formState.num" placeholder="请输入正确的数量" />
				</a-form-item>
				<a-form-item label="改刷凭证">
					<pic></pic>
				</a-form-item>
			</a-form>
			<template v-slot:footer>
				<a-button type="primary" style="width: 88px">提交申请</a-button>
				<a-button style="width: 76px" @click="visible = false">取消</a-button>
			</template>
		</BaseModal>
	</div>
</template>

<script lang="ts" setup>
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import BaseModal from '@/components/common/BaseModal.vue';
import Pic from '@/components/common/imageWrapper.vue';
import { ref, reactive, onMounted, UnwrapRef } from 'vue';
import api from '@/api';
const router = useRouter();

const visible = ref(false);
const handleOk = async (callback: Function) => {
	setTimeout(() => {
		callback();
	}, 2000);
};

interface FormState {
	num: string;
}
const formState: UnwrapRef<FormState> = reactive({
	num: '',
});

const columns = [
	{
		title: ' 序号 ',
		key: 'index',
		width: '80px',
	},
	{
		title: '行程单号',
		dataIndex: 'username',
		key: 'username',
	},
	{
		title: '旅行社名称',
		dataIndex: 'mobile',
		key: 'mobile',
	},
	{
		title: '预定时间',
		dataIndex: 'unitTypeName',
		key: 'unitTypeName',
	},
	{
		title: '就餐日期',
		dataIndex: 'unitName',
		key: 'unitName',
	},
	{
		title: '产品管理',
		dataIndex: 'roleList',
		key: 'roleList',
	},
	{
		title: '单价',
		dataIndex: 'userStatusName',
		key: 'userStatusName',
	},
	{
		title: '预定人数',
		dataIndex: 'ae',
		key: 'ae',
	},
	{
		title: '费用(元)',
		dataIndex: 's',
		key: 's',
	},
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		width: 208,
	},
];

const data = [
	{
		username: 'YNLJ135680',
		mobile: '黑白水旅行社',
		unitTypeName: '2022.2.25  13:30',
		unitName: '2022.2.25',
		roleList: '雪山行午餐包',
		userStatusName: '30',
		ae: '30',
		s: '1100',
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
	num: 20,
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

const opendetailPage = () => {
	router.push({ path: '/catering/order_Management/order_detail' });
};

onMounted(() => {
	getRoleList();
	onSearch();
});
</script>

<style lang="less" scoped>
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
