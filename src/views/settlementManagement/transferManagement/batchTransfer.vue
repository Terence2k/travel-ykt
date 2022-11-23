<template>
	<div class="batchTransfer">
		<div class="batchTransfer-header">
			<div class="last-btn">
				<div class="btn">
					<a-button type="primary" class="success" @click="examine(1)">审核通过</a-button>
					<a-button type="primary" class="success" @click="examine(0)">审核不通过</a-button>
				</div>
			</div>
			<div class="header-total">
				<span>费用合计：288.88元</span>
			</div>
		</div>
		<CommonTable :dataSource="state.tableData.data" :columns="columns" :scroll="{ x: '100%', y: '100%' }" bordered> </CommonTable>
		<Modal :params="state.modalParams" v-model="state.modalShow" @submit="tipSubmit" @cancel="tipCancel" />
	</div>
</template>

<script setup lang="ts">
import Modal from '@/components/common/DelModal.vue';
import CommonTable from '@/components/common/CommonTable.vue';
const state = reactive({
	tableData: {
		data: [],
	},
	modalShow: false,
	modalParams: { title: '审核通过', content: '是否确认对勾选的六条数据进行转账？' },
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
	return column;
});
const examineType = ref(0);
const examine = (type: number) => {
	if (type === 0) {
		examineType.value = 0;
		state.modalParams = { title: '审核不通过', content: '是否确认审核不通过？' };
		state.modalShow = true;
	} else {
		examineType.value = 1;
		state.modalParams = { title: '审核通过', content: '是否确认对勾选的六条数据进行转账？' };
		state.modalShow = true;
	}
};
const tipSubmit = () => {
	if (examineType.value === 1) {
		// 调用接口
	} else if (examineType.value === 0) {
		// 调用接口
	}
};
const tipCancel = () => {
	state.modalShow = false;
};
</script>
<style scoped lang="scss">
.batchTransfer {
	margin: 10px 0;
	.last-btn {
		display: flex;
		justify-content: flex-end;
		margin-right: 30px;
		.btn {
			button {
				margin-left: 10px;
			}
		}
	}
	.header-total {
		margin: 5px 0;
		margin-left: 30px;
		span {
			font-size: 16px;
			font-weight: 700;
		}
	}
}
</style>
