<template>
	<CommonTable :dataSource="state.tableData.data" :columns="columns">
		<template #button>
			<a-button type="primary" @click="addOrUpdate({ handle: 'add' })" v-permission="'app_新增'">新增</a-button>
		</template>
		<template #bodyCell="{ column, record }">
      <template v-if="column.key === 'buttonName'">
				<span v-for="it in record.sysAppChildMenuVos">
          <span style="margin-left:10px">{{it.menuName}}</span>
				</span>
			</template>
			<template v-if="column.key === 'action'">
				<div class="action-btns">
					<a @click="addOrUpdate({ row: record, handle: 'update' })" v-permission="'app_编辑'">编辑</a>
					<a @click="deleteRow(record)" v-permission="'app_删除'">删除</a>
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
	<addApp v-model="state.operationModal.isAddOrUpdate" :params="state.params" @onSearch="onSearch"/>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import addApp from './AddApp.vue';
import api from '@/api';
import { message } from 'ant-design-vue';
import { useMenuManage } from '@/stores/modules/menuManage';
import { Modal } from 'ant-design-vue';

const columns = [
	{
		title: '页面名称',
		dataIndex: 'menuName',
		key: 'menuName',
	},
	{
		title: '页面路径',
		dataIndex: 'url',
		key: 'url',
	},
	{
		title: '权限名称',
		dataIndex: 'buttonName',
		key: 'buttonName',
	},
	{
		title: '操作',
		key: 'action',
		width: 208,
	},
];

const state = reactive({
	tableData: {
		data: [],
		total: 0,
		param: {
			pageNo: 1,
			pageSize: 10,
		},
	},
	params: {},
	operationModal: {
		isAddOrUpdate: false,
	},
});
const menuManage = useMenuManage();

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
	api.getSysAppMenus(state.tableData.param).then((res: any) => {
		state.tableData.data = res.content
		state.tableData.total = res.total;
	});
};

const cancel = (): any => {
	state.operationModal.isAddOrUpdate = false;
};

const addOrUpdate = (param: any) => {
	const { row, handle } = param;
	state.params = {};
	if (handle === 'update') {
		state.params = row;
	}
	state.operationModal.isAddOrUpdate = true;
};

const deleteRow = (row: any) => {
	  console.log('row: ', row);
	  Modal.confirm({
	    title: '删除菜单',
	    width: 560,
	    closable: true,
	    centered: true,
	    icon: false,
	    content: `您即将删除菜单“${row.menuName}”，删除后该页面将不再可见，是否确定删除？`,
	    onOk() {
	      api.deleteAppMenu(row.menuId).then((res: any) => {
	        message.success('删除成功');
	        onSearch();
	      }).catch((err: any) => {
	        message.error(err || '删除失败')
	      })
	    },
	    onCancel() {},
	  });
};

onMounted(() => {
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

</style>
