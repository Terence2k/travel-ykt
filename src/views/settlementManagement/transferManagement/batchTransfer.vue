<template>
	<div class="batchTransfer">
		<div class="batchTransfer-header">
			<div class="last-btn">
				<div class="btn">
					<a-button type="primary" class="success" @click="examine(0)">审核不通过</a-button>
					<a-button type="primary" class="success" @click="examine(1)">审核通过</a-button>
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
			title: '组团社',
			dataIndex: 'travelName',
			key: 'travelName',
			width: 100,
		},
		{
			title: '地接社',
			dataIndex: 'subTravelName',
			key: 'subTravelName',
			width: 100,
		},
		{
			title: '团队类型',
			dataIndex: 'travelTypeName',
			key: 'travelTypeName',
			width: 100,
		},
		{
			title: '人数',
			dataIndex: 'peopleNum',
			key: 'peopleNum',
			width: 80,
		},
		{
			title: '团款',
			dataIndex: 'frozenPrice',
			key: 'frozenPrice',
			width: 100,
		},
		{
			title: '核销总费用',
			dataIndex: 'settlementPrice',
			key: 'settlementPrice',
			width: 100,
		},
		{
			title: '未消费费用',
			dataIndex: 'unSettlementPrice',
			key: 'unSettlementPrice',
			width: 100,
		},
		{
			title: '古维费用',
			key: 'hmVo',
			children: [
				{
					title: '冻结金额',
					dataIndex: 'frozenPrice',
					key: 'hmVo',
					width: 100,
				},
				{
					title: '已核销金额',
					dataIndex: 'settlementPrice',
					key: 'hmVo',
					width: 100,
				},
				{
					title: '实收',
					dataIndex: 'actualPrice',
					key: 'hmVo',
					width: 100,
				},
			],
		},
		{
			title: '景区',
			key: 'ticketVo',
			children: [
				{
					title: '冻结金额',
					dataIndex: 'frozenPrice',
					key: 'ticketVo',
					width: 100,
				},
				{
					title: '已核销金额',
					dataIndex: 'settlementPrice',
					key: 'ticketVo',
					width: 100,
				},
				{
					title: '实收',
					dataIndex: 'actualPrice',
					key: 'ticketVo',
					width: 100,
				},
			],
		},
		{
			title: '酒店',
			key: 'hotelVo',
			children: [
				{
					title: '冻结金额',
					dataIndex: 'frozenPrice',
					key: 'hotelVo',
					width: 100,
				},
				{
					title: '已核销金额',
					dataIndex: 'settlementPrice',
					key: 'hotelVo',
					width: 100,
				},
				{
					title: '实收',
					dataIndex: 'actualPrice',
					key: 'hotelVo',
					width: 100,
				},
			],
		},
		{
			title: '餐饮',
			key: 'cateringVo',
			children: [
				{
					title: '冻结金额',
					dataIndex: 'frozenPrice',
					key: 'cateringVo',
					width: 100,
				},
				{
					title: '已核销金额',
					dataIndex: 'settlementPrice',
					key: 'cateringVo',
					width: 100,
				},
				{
					title: '实收',
					dataIndex: 'actualPrice',
					key: 'cateringVo',
					width: 100,
				},
			],
		},
		{
			title: '监理',
			key: 'superviseVo',
			children: [
				{
					title: '实收',
					dataIndex: 'actualPrice',
					key: 'superviseVo',
					width: 100,
				},
			],
		},
		{
			title: '协会',
			key: 'associationVo',
			children: [
				{
					title: '实收',
					dataIndex: 'actualPrice',
					key: 'associationVo',
					width: 100,
				},
			],
		},
		{
			title: '集团',
			key: 'groupVo',
			children: [
				{
					title: '实收',
					dataIndex: 'actualPrice',
					key: 'groupVo',
					width: 100,
				},
			],
		},
		{
			title: '文旅局',
			key: 'cultureBureauVo',
			children: [
				{
					title: '实收',
					dataIndex: 'actualPrice',
					key: 'cultureBureauVo',
					width: 100,
				},
			],
		},
		{
			title: '一卡通',
			key: 'yktVo',
			children: [
				{
					title: '实收',
					dataIndex: 'actualPrice',
					key: 'yktVo',
					width: 100,
				},
			],
		},
		{
			title: '地接社',
			key: 'subTravelVo',
			children: [
				{
					title: '实收',
					dataIndex: 'actualPrice',
					key: 'subTravelVo',
					width: 100,
				},
				{
					title: '未消费费用',
					dataIndex: 'unSettlementPrice',
					key: 'subTravelVo',
					width: 100,
				},
			],
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
	margin: 20px 0;
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
		margin: 10px 0;
		margin-left: 30px;
		span {
			font-size: 16px;
			font-weight: 700;
		}
	}
}
</style>
