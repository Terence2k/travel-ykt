<template>
	<div>
		<div class="page-title" style="margin-top: 20px">共{{ state.tableData.total }}条 短信群发任务</div>
		<CommonTable :dataSource="state.tableData.data" :columns="columns">
			<template #button>
				<a-button type="primary" @click="BaseModalmethods.addUpdate" v-permission="'新增'">新增</a-button>
			</template>
			<template #bodyCell="{ column, record, index }">
				<template v-if="column.key === 'index'">
					{{ index + 1 }}
				</template>
				<template v-if="column.key === 'sendModel'">
					{{ record.sendModel == 1 ? '自动发送' : '手动发送' }}
				</template>
				<template v-if="column.key === 'isEnable'">
					{{ record.isEnable == 1 ? '禁用' : '启用' }}
				</template>
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a @click="BaseModalmethods.addUpdate(record)" v-permission="'编辑'">编辑</a>
						<a @click="BaseModalmethods.showPreview(record)" v-permission="'发送短信'">发送短信</a>
						<a @click="BaseModalmethods.showRecording(record)" v-permission="'发送记录'">发送记录</a>
						<a @click="del(record)" v-permission="'删除'">删除</a>
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
		<Audit v-model="state.operationModal.isAudit" :params="state.params" @cancel="cancel" @onSearch="onSearch" />
		<!-- <Recipient v-model="state.operationModal.isRecipient" :params="state.params" @cancel="cancel" @onSearch="onSearch" />
		<Preview v-model="state.operationModal.isPreview" :params="state.params" @cancel="cancel" @onSearch="onSearch" /> -->
		<Update v-model="state.operationModal.isUpdate" :params="state.params" @cancel="cancel" @onSearch="onSearch" />
	</div>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import Audit from './compinents/aduit.vue';
// import Recipient from './compinents/recipient.vue';
// import Preview from './compinents/preview.vue';
import Update from './compinents/update.vue';
import api from '@/api';
import { message } from 'ant-design-vue';

const router = useRouter();


const columns = [
	{
		title: '序号',
		dataIndex: 'index',
		key: 'index',
		width: '80px',
	},
	{
		title: '任务名称',
		dataIndex: 'taskName',
		key: 'taskName',
		width: '140px',
	},
	{
		title: '短信自动拼接后文案内容示例',
		dataIndex: 'smsContent',
		key: 'smsContent',
		width: '300px',
	},
	{
		title: '发送模式',
		dataIndex: 'sendModel',
		key: 'sendModel',
		width: '140px',
	},
	{
		title: '发送时间',
		dataIndex: 'sendTime',
		key: 'sendTime',
		width: '140px',
	},
	{
		title: '启用状态',
		dataIndex: 'isEnable',
		key: 'isEnable',
		width: '140px',
	},
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		width: '200px',
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
		},
	},
	operationModal: {
		isAudit: false,
		isRecipient: false,
		isPreview: false,
		isUpdate: false,
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
		router.push({
			path: '/baseInfo/sms_Management/preview',
			query: { templateId: row.oid },
		});
	},
	showRecording:(row:any)=>{
		router.push({
			path: '/baseInfo/sms_Management/recording',
			query: { templateId: row.oid },
		});
	},
	addUpdate: (row: any) => {
		state.params = {};
		state.params = row;
		state.operationModal.isUpdate = true;
	},
};

const cancel = (): any => {
	state.operationModal.isRecipient = false;
	state.operationModal.isAudit = false;
	state.operationModal.isPreview = false;
	state.operationModal.isUpdate = false;
};

const onSearch = async () => {
	let res = await api.getSysSmsTemplates(state.tableData.param);
	state.tableData.data = res.content;
	state.tableData.total = res.total;
};

const del = (row:any) => {
 api.deleteSysSmsTemplate(row.oid).then((res:any)=>{
	message.success('删除成功')
	onSearch()
 })
}

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
