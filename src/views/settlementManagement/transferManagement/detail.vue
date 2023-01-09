<template>
	<BaseModal :title="state.title" v-model="dialogVisible" width="70%" @cancel="dialogVisible = false">
		<h3 style="margin: 0px 0 20px 30px">合计 {{ state.settlementCost / 100 }} 元</h3>
		<CommonTable
			:dataSource="state.tableData.data"
			:columns="columns"
			:scroll="{ x: '100%' }"
			rowKey="oid"
			:row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
		>
			<template #bodyCell="{ column, record }">
				<template v-if="column.key === 'transferAccountsMoney'">
					<span>{{ (record.transferAccountsMoney / 100).toFixed(2) }}元</span>
				</template>
				<template v-if="column.key === 'settlementCost'">
					<span>{{ (record.settlementCost / 100).toFixed(2) }}元</span>
				</template>
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a href="javascript:;" @click="transferAccounts(record.oid)">申请转账</a>
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
		<div class="" style="margin: 0px 0 10px 30px" v-if="state.isHandle">
			<h4 style="margin: 0px 0 10px 0">备注说明</h4>
			<a-textarea v-model:value="state.audit.remark" placeholder="请输入备注" :rows="4" />
		</div>
		<template v-slot:footer v-if="state.isHandle">
			<a-button type="primary" style="width: 100px" @click="submit">发起转账</a-button>
			<a-button style="width: 110px" @click="refuse">审核不通过</a-button>
		</template>
	</BaseModal>
</template>
<script setup lang="ts">
import BaseModal from '@/components/common/BaseModal.vue';
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import type { TableProps } from 'ant-design-vue';
import { Ref } from 'vue';
import lodash from 'lodash';
import { message } from 'ant-design-vue';
import api from '@/api';
const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	params: {
		type: Object,
		default: () => {
			return {};
		},
	},
	methods: Object,
});
const columns = computed(() => {
	const column = [
		{
			title: '转账单号',
			dataIndex: 'transferAccountsNo',
			key: 'transferAccountsNo',
		},
		{
			title: '转账单位',
			dataIndex: 'transferAccountsCompanyName',
			key: 'transferAccountsCompanyName',
		},
		{
			title: '转账账户',
			dataIndex: 'transferAccountsAccount',
			key: 'transferAccountsAccount',
		},
		{
			title: '转账金额（元）',
			dataIndex: 'transferAccountsMoney',
			key: 'transferAccountsMoney',
		},
		{
			title: '收款单位',
			dataIndex: 'collectionCompanyName',
			key: 'collectionCompanyName',
		},
		{
			title: '收款账户',
			dataIndex: 'collectionAccount',
			key: 'collectionAccount',
		},
	];
	if (state.status === 4) {
		const c = {
			title: '操作',
			dataIndex: 'action',
			key: 'action',
		};
		column.push(c);
	}
	return column;
});
const emit = defineEmits(['update:modelValue', 'submit']);
const dialogVisible = ref(false);
// 多选按钮
const onSelectChange = (selectedRowKeys: any) => {
	state.selectedRowKeys = selectedRowKeys;
};
const state = reactive({
	title: '审核',
	tableData: {
		data: [],
		param: {
			transferAccountsId: 1, //转账单id
			pageNo: 1, //页号
			pageSize: 10, //页大小
			itineraryNo: '', //行程单号
		},
		total: 111,
		loading: false,
	},
	isHandle: true,
	settlementCost: 0,
	status: null,
	audit: {
		remark: '', //备注
		oid: null, //oid
		status: 2, //转账单状态 1-待审核 2-转账完成 3-审核不通过
		transferAccountDetailsIds: [],
	},
	selectedRowKeys: [],
});
const init = () => {
	console.log(`我进来啦`);
	if (props.params.handle) {
		state.title = '审核';
		state.isHandle = true;
	} else {
		state.title = '查看详情';
		state.isHandle = false;
	}
};
// 查询
const initList = async () => {
	state.tableData.param.transferAccountsId = props.params.transferAccountsId;
	state.tableData.param.itineraryNo = props.params.itineraryNo;
	state.audit.oid = props.params.transferAccountsId;
	state.status = props.params.status;
	state.settlementCost = props.params.settlementCost;
	console.log(state.tableData, `state.tableData`);

	const result = await api.getTransferAccountDetails(state.tableData.param);
	const { total, content } = result;
	state.tableData.total = total;
	// const list: [any] = dealData(content);
	state.tableData.data = content;
	state.tableData.loading = false;
};
//搜索
const onHandleCurrentChange = (val: number) => {
	console.log('change:', val);
	state.tableData.param.pageNo = val;
	// onSearch();
	initList();
};
//翻页
const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	state.tableData.param.pageSize = size;
	// onSearch();
	initList();
};
const submit = () => {
	state.audit.status = 2;
	transferAccountAudit();
};
const refuse = () => {
	state.audit.status = 3;
	transferAccountAudit();
};
const transferAccountAudit = async () => {
	if (!state.selectedRowKeys.length) {
		message.error(`请选择数据之后再进行转账`);
		return;
	}
	state.audit.transferAccountDetailsIds = state.selectedRowKeys;
	try {
		await api.transferAccountAudit(state.audit);
		dialogVisible.value = false;
		message.success('操作成功');
		emit('submit');
	} catch (error) {
		console.log(error);
		message.error(`${error}`);
	}
};
// 发起单条数据的转账
const transferAccounts = async (id: number) => {
	try {
		await api.transferAccountsDetail(id);
		message.success('操作成功');
	} catch (error) {
		console.log(error);
		message.error(`${error}`);
	}
};
watch(
	() => props.modelValue,
	async (nVal) => {
		console.log('props.modelValue->', nVal);
		dialogVisible.value = nVal;
		if (dialogVisible.value) {
			await init();
			await initList();
		}
	}
);
watch(dialogVisible, (nVal) => {
	console.log('dialogVisible:', nVal);
	emit('update:modelValue', nVal);
});
</script>
