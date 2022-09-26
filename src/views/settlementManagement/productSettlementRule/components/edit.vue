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
				<a-select v-model:value="formState.type" placeholder="请选择团单类型" allowClear>
					<a-select-option value="jack">Jack</a-select-option>
					<a-select-option value="lucy">Lucy</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item label="结算产品" name="product">
				<a-select v-model:value="formState.product" placeholder="请选择结算产品" allowClear>
					<a-select-option value="jack">Jack</a-select-option>
					<a-select-option value="lucy">Lucy</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item label="费用名称" name="name">
				<a-input v-model:value="formState.name" placeholder="请输入费用名称" allowClear />
			</a-form-item>
			<a-form-item label="费用说明" name="explain">
				<a-input v-model:value="formState.explain" placeholder="请输入费用说明" allowClear />
			</a-form-item>
			<a-form-item label="状态" name="state">
				<a-radio-group v-model:value="formState.state">
					<a-radio value="1">启用</a-radio>
					<a-radio value="2">禁用</a-radio>
				</a-radio-group>
			</a-form-item>
			<a-form-item label="优先级" name="priority">
				<a-input v-model:value="formState.priority" placeholder="请输入规则优先级" allowClear />
			</a-form-item>
			<div class="title">扣费规则</div>
			<a-form-item label="收费模式" name="chargingMode">
				<a-radio-group v-model:value="formState.chargingMode">
					<a-radio value="1">百分比</a-radio>
					<a-radio value="2">人数</a-radio>
					<a-radio value="2">价格</a-radio>
				</a-radio-group>
			</a-form-item>
			<a-form-item label="收费数量" name="chargingNumber">
				<a-input allowClear v-model:value="formState.chargingNumber" placeholder="请输入数值(单位：%，元/人、元)" />
			</a-form-item>
			<a-form-item label="收费子产品" name="chargeProduct">
				<a-select v-model:value="formState.chargeProduct" placeholder="请选择收费子产品" allowClear>
					<a-select-option value="jack">Jack</a-select-option>
					<a-select-option value="lucy">Lucy</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item label="是否垫付" name="isPayment">
				<a-radio-group v-model:value="formState.isPayment">
					<a-radio value="1">是</a-radio>
					<a-radio value="2">否</a-radio>
				</a-radio-group>
			</a-form-item>
			<a-form-item label="垫付单位" name="paymentUnit">
				<a-checkbox-group v-model:value="formState.paymentUnit" :options="unitList" />
			</a-form-item>
			<div class="title">
				分账规则
				<a-button style="margin-left: 5px" type="primary" @click="addRules">新增</a-button>
			</div>
			<a-form-item label="剩余费用归属" name="attributionExpenses">
				<a-select allowClear v-model:value="formState.attributionExpenses" style="width: 100%" placeholder="请选择结算产品">
					<a-select-option value="jack">Jack</a-select-option>
					<a-select-option value="lucy">Lucy</a-select-option>
				</a-select>
			</a-form-item>
			<CommonTable :dataSource="formState.list" :columns="columns" :scrollY="false" :scroll="{ y: '300px' }">
				<template #bodyCell="{ column, record, index }">
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a href="javascript:;" @click="editItem(record, index)">编辑</a>
							<a href="javascript:;" @click="delItem(index)">删除</a>
						</div>
					</template>
				</template>
			</CommonTable>
		</a-form>
		<div class="footer">
			<div class="tooter-btn">
				<a-button type="primary" @click="submit">保存</a-button>
				<a-button type="primary">取消</a-button>
			</div>
		</div>
	</div>
	<rules-add-update v-model="cacheData.rulesShow" @submit="rulesSubmit" :params="cacheData.rulesParams" />
	<DelModal :params="{ title: '删除规则', content: '是否确定该条数据' }" v-model="cacheData.delShow" @submit="delSubmit" @cancel="delCancel" />
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
import { UnwrapRef } from 'vue';
import RulesAddUpdate from '@/views/settlementManagement/currencySettlementRule/components/rules-add-update.vue';
import DelModal from '@/components/common/DelModal.vue';
import lodash from 'lodash';
import { useRouter } from 'vue-router';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import { message } from 'ant-design-vue';
interface FormState {
	name: string | null;
	list: any;
	type: string | null;
	product: string | null;
	paymentUnit: Array<any>;
	chargeProduct: string | null;
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
	{
		title: '操作',
		dataIndex: 'action',
		key: 'action',
	},
]);
const unitList = ['旅行社', '集团', '监理公司', '一卡通', '协会'];
const rulesRef = {
	name: [{ required: true, message: '请输入费用名称' }],
	type: [{ required: true, message: '请选择结算产品' }],
	product: [{ required: true, message: '请选择结算产品' }],
	explain: [{ required: true, message: '请输入费用说明' }],
	state: [{ required: true, message: '请选择状态' }],
	chargingMode: [{ required: true, message: '请输入收费模式' }],
	isPayment: [{ required: true, message: '请新增是否垫付' }],
	paymentUnit: [{ required: true, message: '请选择垫付单位' }],
	chargingNumber: [{ required: true, message: '请填写收费数量' }],
	chargeProduct: [{ required: true, message: '请选择收费子产品' }],
};
// 缓存删除编辑数据
const cacheData = ref({
	delIndex: null,
	delShow: false,
	editItem: {},
	rulesShow: false,
	rulesParams: {},
});
const init = () => {
	const route = useRouter();
	const query = route.currentRoute.value.query;
	if (query && query.oid) {
		navigatorBar.setNavigator(['编辑']);
	} else {
		navigatorBar.setNavigator(['新增']);
	}
};
const delItem = (index: any) => {
	cacheData.value.delIndex = index;
	cacheData.value.delShow = true;
};
const delSubmit = () => {
	formState.list.splice(cacheData.value.delIndex, 1);
	delCancel();
};
const delCancel = () => {
	cacheData.value.delIndex = null;
	cacheData.value.delShow = false;
};
const addRules = () => {
	cacheData.value.rulesShow = true;
	cacheData.value.rulesParams = { add: true };
};
const editItem = (e: any, index: number) => {
	cacheData.value.rulesShow = true;
	cacheData.value.rulesParams = { add: false, from: lodash.cloneDeep(e), index: index };
};
const rulesSubmit = (e: any) => {
	if (e.params.add) {
		formState.list.push(e.form);
	} else {
		console.log(e);
		console.log(e.params.index);
		formState.list[e.params.index] = e.form;
		console.log(formState, `formState`);
	}
};
const submit = () => {
	formRef.value
		.validate()
		.then((result: any) => {
			save();
		})
		.catch((err: any) => {
			message.error('请填写完整数据');
			console.log('error', err);
		});
};
const save = () => {
	console.log(formState, `formState`);
};
onMounted(() => {
	init();
});
onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
});
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
