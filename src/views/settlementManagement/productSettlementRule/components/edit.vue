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
			<a-form-item label="团单类型" name="teamTypeId">
				<a-select v-model:value="formState.teamTypeId" placeholder="请选择团单类型" allowClear>
					<a-select-option :value="1">Jack</a-select-option>
					<a-select-option :value="2">Lucy</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item label="结算产品" name="productId">
				<a-select v-model:value="formState.productId" placeholder="请选择结算产品" allowClear>
					<a-select-option :value="1">Jack</a-select-option>
					<a-select-option :value="2">Lucy</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item label="费用名称" name="costName">
				<a-input v-model:value="formState.costName" placeholder="请输入费用名称" allowClear />
			</a-form-item>
			<a-form-item label="费用说明" name="costExplanation">
				<a-input v-model:value="formState.costExplanation" placeholder="请输入费用说明" allowClear />
			</a-form-item>
			<a-form-item label="状态" name="ruleStatus">
				<a-radio-group v-model:value="formState.ruleStatus">
					<a-radio :value="1">启用</a-radio>
					<a-radio :value="0">禁用</a-radio>
				</a-radio-group>
			</a-form-item>
			<a-form-item label="优先级" name="level">
				<a-input v-model:value="formState.level" placeholder="请输入规则优先级" allowClear />
			</a-form-item>
			<div class="title">扣费规则</div>
			<a-form-item label="收费模式" name="chargeModel">
				<a-radio-group v-model:value="formState.chargeModel">
					<a-radio :value="1">百分比</a-radio>
					<a-radio :value="2">人数</a-radio>
					<a-radio :value="3">价格</a-radio>
				</a-radio-group>
			</a-form-item>
			<a-form-item label="收费数量" name="chargeCount" v-if="formState.chargeModel === 1" :rules="rulesRef.percentage">
				<a-input-number v-model:value="formState.chargeCount" placeholder="请输入收费数量（单位：%）" style="width: 100%">
					<template #addonAfter>
						<span>%</span>
					</template>
				</a-input-number>
			</a-form-item>
			<a-form-item label="收费数量" name="chargeCount" v-if="formState.chargeModel === 3" :rules="rulesRef.integer">
				<a-input-number v-model:value="formState.chargeCount" placeholder="请输入收费数量（单位：元）" style="width: 100%">
					<template #addonAfter>
						<span>元</span>
					</template>
				</a-input-number>
			</a-form-item>
			<a-form-item label="收费数量" name="chargeCount" v-if="formState.chargeModel === 2" :rules="rulesRef.integer">
				<a-input-number v-model:value="formState.chargeCount" placeholder="请输入收费数量（单位：人）" style="width: 100%">
					<template #addonAfter>
						<span>人</span>
					</template>
				</a-input-number>
			</a-form-item>

			<a-form-item label="收费子产品" name="chargeProductSonId">
				<a-select v-model:value="formState.chargeProductSonId" placeholder="请选择收费子产品" allowClear>
					<a-select-option :value="1">Jack</a-select-option>
					<a-select-option :value="2">Lucy</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item label="是否垫付" name="isPrepaid">
				<a-radio-group v-model:value="formState.isPrepaid">
					<a-radio :value="1">是</a-radio>
					<a-radio :value="0">否</a-radio>
				</a-radio-group>
			</a-form-item>
			<a-form-item label="垫付单位" name="prepaidCompany" v-if="formState.isPrepaid === 1">
				<a-radio-group v-model:value="formState.prepaidCompany" :options="unitList" />
				<!-- <a-checkbox-group v-model:value="formState.prepaidCompany" :options="unitList" /> -->
			</a-form-item>
			<div class="title">
				分账规则
				<a-button style="margin-left: 5px" type="primary" @click="addRules">新增</a-button>
			</div>
			<a-form-item label="剩余费用归属" name="lastCostBelongCompany">
				<a-select allowClear v-model:value="formState.lastCostBelongCompany" style="width: 100%" placeholder="请选择结算产品">
					<a-select-option :value="1">Jack</a-select-option>
					<a-select-option :value="2">Lucy</a-select-option>
				</a-select>
			</a-form-item>
			<CommonTable :dataSource="formState.splitList" :columns="columns" :scrollY="false" :scroll="{ y: '300px' }">
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
import { UnwrapRef, Ref } from 'vue';
import RulesAddUpdate from './rules-add-update.vue';
import DelModal from '@/components/common/DelModal.vue';
import lodash from 'lodash';
import { useRouter } from 'vue-router';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import { message } from 'ant-design-vue';
import { isIntegerNotMust, isBtnZeroToHundred } from '@/utils/validator';
import api from '@/api';
import { updateProductRule } from '@/api/settlementManage.api';
import { FormState } from './type';
const navigatorBar = useNavigatorBar();
const formRef = ref();
const formState: UnwrapRef<FormState> = reactive({
	costName: null,
	teamTypeId: null,
	productId: null,
	prepaidCompany: null,
	splitList: [],
	ruleStatus: null,
	chargeProductSonId: null,
	chargeCount: null,
	isPrepaid: null,
	lastCostBelongCompany: null,
	chargeModel: null,
	costExplanation: null,
	level: null,
});
const columns = ref([
	{
		title: '分账单位',
		dataIndex: 'companyType',
		key: 'companyType',
	},
	{
		title: '扣款模式',
		dataIndex: 'splitModel',
		key: 'splitModel',
	},
	{
		title: '分账金额',
		dataIndex: 'splitCount',
		key: 'splitCount',
	},
	{
		title: '优先级',
		dataIndex: 'level',
		key: 'level',
	},
	{
		title: '操作',
		dataIndex: 'action',
		key: 'action',
	},
]);
const unitList = ['旅行社', '集团', '监理公司', '一卡通', '协会'];
const rulesRef = {
	costName: [{ required: true, message: '请输入费用名称' }],
	teamTypeId: [{ required: true, message: '请选择团单类型' }],
	productId: [{ required: true, message: '请选择结算产品' }],
	costExplanation: [{ required: true, message: '请输入费用说明' }],
	ruleStatus: [{ required: true, message: '请选择状态' }],
	level: [{ required: true, validator: isIntegerNotMust, trigger: 'blur' }],
	chargeModel: [{ required: true, message: '请输入收费模式' }],
	isPrepaid: [{ required: true, message: '请新增是否垫付' }],
	prepaidCompany: [{ required: true, message: '请选择垫付单位' }],
	// chargeCount: [{ required: true, message: '请填写收费数量' }],
	chargeProductSonId: [{ required: true, message: '请选择收费子产品' }],
	lastCostBelongCompany: [{ required: true, message: '请选择剩余费用归属' }],
	// 百分比
	percentage: [{ required: true, validator: isBtnZeroToHundred, trigger: 'blur' }],
	// 人数和金额
	integer: [{ required: true, validator: isIntegerNotMust, trigger: 'blur' }],
};
// 缓存删除编辑数据
const cacheData = ref({
	delIndex: null,
	delShow: false,
	editItem: {},
	rulesShow: false,
	rulesParams: {},
	edit: false,
});
const init = () => {
	const route = useRouter();
	const query = route.currentRoute.value.query;
	if (query && query.oid) {
		navigatorBar.setNavigator(['编辑']);
		cacheData.value.edit = true;
	} else {
		navigatorBar.setNavigator(['新增']);
		cacheData.value.edit = false;
		// 默认状态开启
		formState.ruleStatus = 1;
		// 默认是否垫付关闭
		formState.isPrepaid = 0;
		// 默认为百分比
		formState.chargeModel = 1;
	}
};
const delItem = (index: any) => {
	cacheData.value.delIndex = index;
	cacheData.value.delShow = true;
};
const delSubmit = () => {
	formState.splitList.splice(cacheData.value.delIndex, 1);
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
		formState.splitList.push(e.form);
	} else {
		console.log(e);
		console.log(e.params.index);
		formState.splitList[e.params.index] = e.form;
		console.log(formState, `formState`);
	}
};
const submit = () => {
	formRef.value
		.validate()
		.then(() => {
			if (cacheData.value.edit) {
				edit();
			} else {
				save();
			}
		})
		.catch((err: any) => {
			message.error('请填写完整数据');
			console.log('error', err);
		});
};
const save = async () => {
	console.log(formState, `formState`);
	const result = await api.saveProductRule(formState);
	console.log(result, `result`);
};
const edit = async () => {
	const result = await api.updateProductRule(formState);
	console.log(result, `result`);
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
