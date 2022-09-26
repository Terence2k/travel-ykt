<template>
	<CommonSearch>
		<search-item label="企业类型">
			<a-select ref="select" placeholder="请选企业类型" v-model:value="state.tableData.param.roleIds">
				<a-select-option v-for="item in state.optionRoleList" :value="item.roleId">
					{{ item.roleName }}
				</a-select-option>
			</a-select>
		</search-item>
		<search-item label="所属地区">
			<a-select ref="select" placeholder="请选所属地区" v-model:value="state.tableData.param.status" allowClear>
				<a-select-option :value="1">启用</a-select-option>
				<a-select-option :value="0">停用</a-select-option>
			</a-select>
		</search-item>
		<search-item label="状态">
			<a-select ref="select" placeholder="请选择状态" v-model:value="state.tableData.param.status" allowClear>
				<a-select-option :value="1">启用</a-select-option>
				<a-select-option :value="0">停用</a-select-option>
			</a-select>
		</search-item>
		<search-item label="企业名称">
			<a-input v-model:value="state.tableData.param.keyWord" placeholder="请输入企业名称" />
		</search-item>
		<template #button>
			<a-button @click="onSearch">查询</a-button>
		</template>
	</CommonSearch>
	<CommonTable :dataSource="state.tableData.data" :columns="columns">
		<template #button>
			<a-button type="primary" @click="addOrUpdate({ handle: 'add' })">新增</a-button>
			<a @click="goTo">审核</a>
			<a>重置密码</a>
			<a>查看</a>
		</template>
		<template #bodyCell="{ column, record }">
			<template v-if="column.key === 'roleList'">
				<span v-for="item, index in record.roleList">
					{{`${item.roleName}${index == record.roleList.length - 1? '' : '，' }`}}
				</span>
			</template>
			<template v-if="column.key === 'action'">
				<div class="action-btns">
					<a>审核</a>
					<a>重置密码</a>
					<a>查看</a>
				</div>
			</template>
		</template>
	</CommonTable>
	<CommonPagination v-model:current="state.tableData.param.pageNo" v-model:page-size="state.tableData.param.pageSize"
		:total="state.tableData.total" @change="onHandleCurrentChange" @showSizeChange="pageSideChange" />
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue'
import CommonPagination from '@/components/common/CommonPagination.vue'
import CommonSearch from '@/components/common/CommonSearch.vue'
import SearchItem from '@/components/common/CommonSearchItem.vue'
import api from '@/api';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const goTo = () => {
	router.push({
		path: '/baseInfo/businessManagement/check'
	})
}
const columns = [
	{
		title: '企业名称',
		dataIndex: 'username',
		key: 'username',
	},
	{
		title: '企业类型',
		dataIndex: 'mobile',
		key: 'mobile',
	},
	{
		title: '所属地区',
		dataIndex: 'unitTypeName',
		key: 'unitTypeName',
	},
	{
		title: '信用代码',
		dataIndex: 'unitName',
		key: 'unitName',
	},
	{
		title: '营业执照',
		dataIndex: 'roleList',
		key: 'roleList',
	},
	{
		title: '状态',
		dataIndex: 'userStatusName',
		key: 'userStatusName',
	},
	{
		title: '管理员',
		dataIndex: 'userStatusName',
		key: 'userStatusName',
	},
	{
		title: '账号',
		dataIndex: 'userStatusName',
		key: 'userStatusName',
	},
	{
		title: '佐证',
		dataIndex: 'userStatusName',
		key: 'userStatusName',
	},
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		width: 208
	},
]

const state = reactive({
	tableData: {
		data: [],
		total: 0,
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			keyWord: '',
			roleIds: [],
			status: null,
		},
		roleParam: {
			pageNo: 1,
			pageSize: 100000,
		}
	},
	params: {},
	operationModal: {
		isAddOrUpdate: false,
		showDetails: false
	},
	optionRoleList: [] as any
});

const onHandleCurrentChange = (val: number) => {
	console.log('change:', val);
	state.tableData.param.pageNo = val;
	onSearch();
}

const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	state.tableData.param.pageSize = size;
	onSearch();
}

const onSearch = () => {
	/* api.userList(state.tableData.param).then((res: any) => {
		console.log('res:', res);
		state.tableData.data = res.content;
		state.tableData.total = res.total;
	}) */
}
interface addInterface {
	row?: any
	handle: 'update' | 'add'
}
const addOrUpdate = ({ row, handle }: addInterface) => {
	/* 	state.modalVisible = true
		if (handle === 'add') {
			isAdd = true
		} else {
			isAdd = false
			state.dictionaryForm.name = row?.name;
			state.dictionaryForm.codeValue = row?.codeValue;
			state.dictionaryForm.oid = row?.oid;
		} */
}
</script>

<style scoped lang="scss">

</style>
