<template>
	<div>
		<div class="page-title" style="margin-top: 20px">共{{ state.tableData.total }}条 短信群发任务</div>
		<CommonTable :dataSource="state.tableData.data" :columns="columns">
			<template #bodyCell="{ column, record, index }">
				<template v-if="column.key === 'index'">
					{{ index + 1 }}
				</template>
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a @click="BaseModalmethods.showRecipient(record)">设置接收人</a>
						<a  @click="BaseModalmethods.showPreview(record)">预览发送</a>
						<a @click="BaseModalmethods.showAudit(record)">启用</a>
						<a @click="BaseModalmethods.showAudit(record)">禁用</a>
					</div>
				</template>
			</template>
		</CommonTable>
		<CommonPagination
			v-model:current="state.tableData.param.pageNo"
			v-model:page-size="state.tableData.param.pageSize"
			:total="state.tableData.total"
			@change="onHandleCurrentChange"
			@showSizeChange="pageSideChange"
		/>
		<Audit v-model="state.operationModal.isAudit" :params="state.params" @cancel="cancel" />
		<Recipient v-model="state.operationModal.isRecipient" :params="state.params" @cancel="cancel" />
		<Preview v-model="state.operationModal.isPreview" :params="state.params" @cancel="cancel" />
	</div>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import Audit from './compinents/aduit.vue';
import Recipient from './compinents/recipient.vue';
import Preview from './compinents/preview.vue';

import api from '@/api';

const columns = [
	{
		title: '序号',
		dataIndex: 'index',
		key: 'index',
		width: '80px',
	},
	{
		title: '任务名称',
		dataIndex: 'auditTypeName',
		key: 'auditTypeName',
	},
	{
		title: '短信自动拼接后文案内容示例',
		dataIndex: 'auditTypeExplain',
		key: 'auditTypeExplain',
	},
	{
		title: '发送模式',
		dataIndex: 'auditTypePage',
		key: 'auditTypePage',
	},
	{
		title: '发送时间',
		dataIndex: 'businessTypeNameOrRoles',
		key: 'businessTypeNameOrRoles',
	},
	{
		title: '启用状态',
		dataIndex: 'businessTypeNameOrRoles',
		key: 'businessTypeNameOrRoles',
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
		data: [] as any,
		total: 0,
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			phone: null,
			shopName: null,
			auditStatus: null,
		},
	},
	operationModal: {
		isAudit: false,
		isRecipient: false,
		isPreview: false,
	},
	params: {},
});

const onHandleCurrentChange = (val: number) => {
	state.tableData.param.pageNo = val;
	onSearch();
};
const pageSideChange = (current: number, size: number) => {
	state.tableData.param.pageSize = size;
	onSearch();
};

const BaseModalmethods = {
	showAudit: (row: any) => {
		state.params = {};
		state.params = row;
		state.operationModal.isAudit = true;
	},
	showRecipient: (row: any) => {
		state.params = {};
		state.params = row;
		state.operationModal.isRecipient = true;
	},
	showPreview: (row: any) => {
		state.params = {};
		state.params = row;
		state.operationModal.isPreview = true;
	},
};

const cancel = (): any => {
	state.operationModal.isRecipient = false;
	state.operationModal.isAudit = false;
	state.operationModal.isPreview = false;
};

const onSearch = async () => {
	let res = await api.getAuditList(state.tableData.param);
	state.tableData.data = res.content;
	state.tableData.total = res.total;
};

onMounted(() => {
	onSearch();
});
</script>

<style scoped lang="less">
.page-title {
	padding: 0 20px;
	line-height: 44px;
	font-size: 16px;
	color: #1e2226;
}
</style>
