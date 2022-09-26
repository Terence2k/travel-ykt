<template>
	<div class="editWrapper">
		<header>基本信息</header>
		<a-form
			:model="formState"
			name="basic"
			ref="formRef"
			:rules="rulesRef"
			labelAlign="left"
			:label-col="{ span: 3 }"
			:wrapper-col="{ span: 6 }"
			autocomplete="off"
		>
			<a-form-item label="团单类型" name="type">
				<div>
					<span>{{ formState.type }}</span>
				</div>
			</a-form-item>

			<a-form-item label="结算产品" name="product">
				<div>
					<span>{{ formState.product }}</span>
				</div>
			</a-form-item>
			<a-form-item label="费用名称" name="name">
				<div>
					<span>{{ formState.name }}</span>
				</div>
			</a-form-item>
			<a-form-item label="费用说明" name="explain">
				<div>
					<span>{{ formState.explain }}</span>
				</div>
			</a-form-item>
			<a-form-item label="状态" name="state">
				<div>
					<span>{{ formState.state }}</span>
				</div>
			</a-form-item>
			<a-form-item label="优先级" name="priority">
				<div>
					<span>{{ formState.priority }}</span>
				</div>
			</a-form-item>
			<div class="title">扣费规则</div>
			<a-form-item label="收费模式" name="chargingMode">
				<div>
					<span>{{ formState.chargingMode }}</span>
				</div>
			</a-form-item>
			<a-form-item label="收费数量" name="chargingNumber">
				<div>
					<span>{{ formState.chargingNumber }}</span>
				</div>
			</a-form-item>
			<a-form-item label="收费子产品" name="chargeProduct">
				<div>
					<span>{{ formState.chargeProduct }}</span>
				</div>
			</a-form-item>
			<a-form-item label="是否垫付" name="isPayment">
				<div>
					<span>{{ formState.isPayment }}</span>
				</div>
			</a-form-item>
			<a-form-item label="垫付单位" name="paymentUnit">
				<div>
					<span>{{ formState.paymentUnit }}</span>
				</div>
			</a-form-item>
			<div class="title">分账规则</div>
			<a-form-item label="剩余费用归属" name="attributionExpenses">
				<div>
					<span>{{ formState.attributionExpenses }}</span>
				</div>
			</a-form-item>
			<CommonTable :dataSource="formState.list" :columns="columns" :scrollY="false" :scroll="{ y: '300px' }"> </CommonTable>
		</a-form>
		<div class="footer">
			<div class="tooter-btn">
				<a-button type="primary" @click="edit">编辑</a-button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
import { UnwrapRef } from 'vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
interface FormState {
	name: string | null;
	list: any;
	type: string | null;
	product: string | null;
	paymentUnit: Array<any>;
}
const navigatorBar = useNavigatorBar();
const formRef = ref();
const formState: UnwrapRef<FormState> = reactive({
	name: null,
	type: null,
	product: null,
	paymentUnit: [],
	list: [
		{
			unit: '旅行社',
			percentage: '20%',
		},
		{
			unit: '集团',
			percentage: '50%',
		},
		{
			unit: '一卡通',
			percentage: '80%',
		},
		{
			unit: '一卡通',
			percentage: '100%',
		},
	],
});
const columns = ref([
	{
		title: '分账单位',
		dataIndex: 'unit',
		key: 'unit',
	},
	{
		title: '分账金额',
		dataIndex: 'price',
		key: 'price',
	},
	{
		title: '优先级',
		dataIndex: 'priority',
		key: 'priority',
	},
]);
const unitList = ['旅行社', '集团', '监理公司', '一卡通', '协会'];
// 缓存删除编辑数据
const init = () => {
	navigatorBar.setNavigator(['查看']);
};
onMounted(() => {
	init();
});
onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
});
const edit = () => {};
</script>

<style lang="less" scoped>
.editWrapper {
	padding: 0 16px;
	padding-bottom: 64px;
}
header {
	// width: 64px;
	// margin-bottom: 8px;
	height: 56px;
	line-height: 56px;
	font-weight: bold;
	color: #1e2226;
	// margin: 0 8px 16px;
	margin-bottom: 16px;
	border-bottom: 1px solid #f1f2f5;
}
.title {
	height: 56px;
	line-height: 56px;
	font-weight: bold;
	color: #1e2226;
	// margin: 0 8px 16px;
	margin-bottom: 16px;
	border-bottom: 1px solid #f1f2f5;
}
.area {
	margin-bottom: 20px;
}
.footer {
	position: fixed;
	bottom: 12px;
	line-height: 64px;
	height: 64px;
	width: calc(100% - 288px);
	border-top: 1px solid #f1f2f5;
	margin-left: -16px;
	margin-right: 24px;
	background-color: #fff;
	z-index: 99;

	.tooter-btn {
		width: 60%;
		// background-color: #fff;
		margin-left: 16px;
	}
	button:first-of-type {
		margin-right: 16px;
	}
}
</style>
