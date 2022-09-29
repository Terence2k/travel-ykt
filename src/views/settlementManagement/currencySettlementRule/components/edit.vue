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
				<a-select
					v-model:value="formState.teamTypeId"
					placeholder="请选择团单类型"
					allowClear
					:options="generaRulesOptions.teamTypeList.map((item) => ({ value: item.oid, label: item.name }))"
				>
				</a-select>
			</a-form-item>
			<a-form-item label="结算产品" name="productType">
				<a-select
					v-model:value="formState.productType"
					placeholder="请选择结算产品"
					allowClear
					:options="generaRulesOptions.productTypeList.map((item) => ({ value: item.value, label: item.name }))"
				>
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
					<a-radio v-for="item in generaRulesOptions.ruleStatusList" :value="item.value" :key="item.name">{{ item.name }}</a-radio>
				</a-radio-group>
			</a-form-item>
			<a-form-item label="优先级" name="level">
				<a-input-number v-model:value="formState.level" placeholder="请输入规则优先级" style="width: 100%"> </a-input-number>
			</a-form-item>
			<div class="title">扣费规则</div>
			<a-form-item label="收费模式" name="chargeModel">
				<a-radio-group v-model:value="formState.chargeModel">
					<a-radio v-for="item in generaRulesOptions.chargeModelList" :value="item.value" :key="item.name">{{ item.name }}</a-radio>
				</a-radio-group>
			</a-form-item>
			<a-form-item label="收费数量" name="charCount" v-if="formState.chargeModel === 1" :rules="rulesRef.percentage">
				<a-input-number v-model:value="formState.charCount" placeholder="请输入收费数量（单位：%）" style="width: 100%">
					<template #addonAfter>
						<span>%</span>
					</template>
				</a-input-number>
			</a-form-item>
			<a-form-item label="收费数量" name="charCount" v-if="formState.chargeModel === 3" :rules="rulesRef.integer">
				<a-input-number v-model:value="formState.charCount" placeholder="请输入收费数量（单位：元）" style="width: 100%">
					<template #addonAfter>
						<span>元</span>
					</template>
				</a-input-number>
			</a-form-item>
			<a-form-item label="收费数量" name="charCount" v-if="formState.chargeModel === 2" :rules="rulesRef.integer">
				<a-input-number v-model:value="formState.charCount" placeholder="请输入收费数量（单位：人）" style="width: 100%">
					<template #addonAfter>
						<span>人</span>
					</template>
				</a-input-number>
			</a-form-item>

			<a-form-item label="是否垫付" name="isPrepaid">
				<a-radio-group v-model:value="formState.isPrepaid">
					<a-radio v-for="item in generaRulesOptions.isPrepaidList" :value="item.value" :key="item.name">{{ item.name }}</a-radio>
				</a-radio-group>
			</a-form-item>
			<a-form-item label="垫付单位" name="prepaidCompany" v-if="formState.isPrepaid === 1">
				<!-- <a-radio-group v-model:value="formState.prepaidCompany" :options="unitList" /> -->
				<!-- <a-checkbox-group v-model:value="formState.prepaidCompany" :options="unitList" /> -->
				<a-select
					v-model:value="formState.prepaidCompany"
					placeholder="请选择垫付单位"
					allowClear
					:options="generaRulesOptions.prepaidCompanyList.map((item) => ({ value: item.value, label: item.name }))"
				>
				</a-select>
			</a-form-item>
			<div class="title">
				分账规则
				<a-button style="margin-left: 5px" type="primary" @click="addRules">新增</a-button>
			</div>
			<a-form-item label="剩余费用归属" name="lastCostBelongCompany">
				<a-select
					allowClear
					v-model:value="formState.lastCostBelongCompany"
					style="width: 100%"
					placeholder="请选择剩余费用归属"
					:options="generaRulesOptions.prepaidCompanyList.map((item) => ({ value: item.value, label: item.name }))"
				>
				</a-select>
			</a-form-item>
			<CommonTable :dataSource="formState.splitList" :columns="columns" :scrollY="false" :scroll="{ y: '300px' }">
				<template #bodyCell="{ column, record, index }">
					<template v-if="column.key === 'companyType'">
						<span>{{ getCompanyTypeName(record.companyType) }}</span>
					</template>
					<template v-if="column.key === 'splitModel'">
						<span v-if="record.splitModel === 1">百分比</span>
						<span v-if="record.splitModel === 2">价格</span>
					</template>
					<template v-if="column.key === 'splitCount'">
						<span v-if="record.splitModel === 1">{{ record.splitCount }}%</span>
						<span v-if="record.splitModel === 2">{{ record.splitCount }}元</span>
					</template>
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
				<a-button type="primary" @click="cancel">取消</a-button>
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
import { useGeneraRules } from '@/stores/modules/GeneraRules';
const navigatorBar = useNavigatorBar();
const generaRulesOptions = useGeneraRules();
const formRef = ref();
const formState: UnwrapRef<FormState> = reactive({
	costName: null,
	teamTypeId: null,
	productId: null,
	prepaidCompany: null,
	splitList: [],
	ruleStatus: null,
	chargeProductSonId: null,
	charCount: null,
	isPrepaid: null,
	lastCostBelongCompany: null,
	chargeModel: null,
	costExplanation: null,
	level: null,
	productSonType: null,
	productType: null,
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
const rulesRef = {
	costName: [{ required: true, message: '请输入费用名称' }],
	teamTypeId: [{ required: true, message: '请选择团单类型' }],
	productType: [{ required: true, message: '请选择结算产品' }],
	costExplanation: [{ required: true, message: '请输入费用说明' }],
	ruleStatus: [{ required: true, message: '请选择状态' }],
	level: [{ required: true, validator: isIntegerNotMust, trigger: 'blur' }],
	chargeModel: [{ required: true, message: '请输入收费模式' }],
	isPrepaid: [{ required: true, message: '请新增是否垫付' }],
	prepaidCompany: [{ required: true, message: '请选择垫付单位' }],
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
const oid = ref(null);
// 初始化
const init = () => {
	const route = useRouter();
	const query = route.currentRoute.value.query;
	generaRulesOptions.getTeamTypeList();
	if (query && query.oid) {
		oid.value = query.oid;
		navigatorBar.setNavigator(['编辑']);
		cacheData.value.edit = true;
		currencySettlementRuleDetail(query.oid);
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
const currencySettlementRuleDetail = async (id: number) => {
	const result = await api.currencySettlementRuleDetail(id);
	for (let key in formState) {
		if (result[key]) {
			formState[key] = result[key];
		}
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
	saveParams();
	console.log(formState, `formState`);
	const result = await api.saveCurrencySettlementRule(formState);
	message.success('保存成功');
	route.push({ path: '/settlementManagement/currencySettlementRule/list' });
};
const edit = async () => {
	saveParams();
	const result = await api.updateCurrencySettlementRule(formState);
	console.log(result, `result`);
	message.success('修改成功');
	route.push({ path: '/settlementManagement/currencySettlementRule/list' });
	// if (result.status === 200) {
	// 	message.success('修改成功');
	// 	route.push({ path: '/settlementManagement/productSettlementRule/list' });
	// } else {
	// 	message.error(`系统出错`);
	// }
};
const saveParams = () => {
	if (formState.productSonType === 'SELF') {
		formState.chargeProductSonId = formState.productId;
	}
	if (oid.value) {
		formState.oid = oid.value;
	}
};
const route = useRouter();
const cancel = () => {
	route.go(-1);
};
onMounted(() => {
	init();
});
onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
});
// 获取表格分账规则分账单位名称
const getCompanyTypeName = computed(() => (value: number) => {
	return generaRulesOptions.prepaidCompanyList[value]['name'];
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
