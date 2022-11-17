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
			<a-form-item label="团队类型" name="type">
				<div>
					<span>{{ getTypeName('teamTypeId') }}</span>
				</div>
			</a-form-item>

			<a-form-item label="结算产品" name="product">
				<div>
					<span>{{ getTypeName('productType') }}</span>
				</div>
			</a-form-item>
			<a-form-item label="酒店星级" v-if="formState.productType === 2">
				<div>
					<span>{{ getTypeName('hotelRatedId') }}</span>
				</div>
				<!-- <a-select
					v-model:value="formState.hotelRatedId"
					placeholder="请选择酒店星级"
					allowClear
					:options="generaRulesOptions.hotelRatedList.map((item) => ({ value: item.oid, label: item.starCode }))"
				>
				</a-select> -->
			</a-form-item>
			<a-form-item label="费用名称" name="name">
				<div>
					<span>{{ formState.costName }}</span>
				</div>
			</a-form-item>
			<a-form-item label="费用说明" name="explain">
				<div>
					<span>{{ formState.costExplanation }}</span>
				</div>
			</a-form-item>
			<a-form-item label="扣费模式" name="deductionModel">
				<div>
					<span v-if="formState.deductionModel === 1">冻结金额</span>
					<span v-if="formState.deductionModel === 2">核销金额</span>
				</div>
			</a-form-item>
			<a-form-item label="状态" name="state">
				<div>
					<span>{{ getTypeName('ruleStatus') }}</span>
				</div>
			</a-form-item>
			<a-form-item label="优先级" name="priority">
				<div>
					<span>{{ formState.level }}</span>
				</div>
			</a-form-item>
			<div class="title">扣费规则</div>
			<a-form-item label="收费模式" name="chargingMode">
				<div>
					<span>{{ getTypeName('chargeModel') }}</span>
				</div>
			</a-form-item>
			<a-form-item label="收费数量" name="chargeCount">
				<div>
					<span>{{ formState.chargeCount }}</span>
					<span v-if="formState.chargeModel === 1">%</span>
					<span v-if="formState.chargeModel === 2">人</span>
					<span v-if="formState.chargeModel === 3">元</span>
				</div>
			</a-form-item>
			<a-form-item label="是否垫付" name="isPayment">
				<div>
					<span>{{ getTypeName('isPrepaid') }}</span>
				</div>
			</a-form-item>
			<a-form-item label="垫付单位" name="paymentUnit" v-if="formState.isPrepaid === 1">
				<div>
					<span>{{ getTypeName('prepaidCompany') }}</span>
				</div>
			</a-form-item>
			<div class="title">分账规则</div>
			<a-form-item label="剩余费用归属" name="attributionExpenses">
				<div>
					<span>{{ getTypeName('lastCostBelongCompany') }}</span>
				</div>
			</a-form-item>
		</a-form>
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
			</template>
		</CommonTable>
		<div class="footer">
			<div class="tooter-btn">
				<a-button type="primary" @click="edit">编辑</a-button>
				<a-button @click="cancel">返回</a-button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
import { UnwrapRef } from 'vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import api from '@/api';
import { FormState } from '../../productSettlementRule/components/type';
import { useGeneraRules } from '@/stores/modules/generaRules';
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
	chargeCount: null,
	isPrepaid: null,
	lastCostBelongCompany: null,
	chargeModel: null,
	costExplanation: null,
	level: null,
	productType: null,
	hotelRatedId: null,
	deductionModel: null,
});
const columns = ref([
	{
		title: '分账名称',
		dataIndex: 'splitName',
		key: 'splitName',
	},
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
]);
const route = useRouter();
// 缓存删除编辑数据
const init = async () => {
	navigatorBar.setNavigator(['查看']);
	const id: any = route.currentRoute.value.query.oid;
	// await getTeamType();
	await currencySettlementRuleDetail(id);
};
const oid = ref('');
const currencySettlementRuleDetail = async (id: number) => {
	const result = await api.currencySettlementRuleDetail(id);
	oid.value = result.oid;
	for (let key in formState) {
		if (result[key]) {
			formState[key] = result[key];
		}
	}
};
onMounted(() => {
	init();
	generaRulesOptions.getTeamTypeList();
	generaRulesOptions.getPrepaidCompanyList();
});
onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
});
const edit = () => {
	route.push({ path: '/settlementManagement/currencySettlementRule/edit', query: { oid: encodeURIComponent(oid.value) } });
};
const getTypeName = computed(() => (str: string) => {
	if (str === 'teamTypeId') {
		const idx = generaRulesOptions.teamTypeList.findIndex((item: any) => item.oid === formState.teamTypeId);
		if (idx !== -1) {
			return generaRulesOptions.teamTypeList[idx]['name'];
		}
	}
	if (str === 'productType') {
		const idx = generaRulesOptions.currencyProductTypeList.findIndex((item: any) => item.value === formState.productType);
		if (idx !== -1) {
			return generaRulesOptions.currencyProductTypeList[idx]['name'];
		}
	}
	if (str === 'ruleStatus') {
		return formState.ruleStatus === 1 ? '启用' : '禁用';
	}
	if (str === 'chargeModel') {
		const idx = generaRulesOptions.chargeModelList.findIndex((item: any) => item.value === formState.chargeModel);
		if (idx !== -1) {
			return generaRulesOptions.chargeModelList[idx]['name'];
		}
	}
	if (str === 'isPrepaid') {
		return formState.isPrepaid === 1 ? '是' : '否';
	}
	if (str === 'prepaidCompany') {
		const idx = generaRulesOptions.prepaidCompanyList.findIndex((item: any) => item.codeValue === formState.prepaidCompany);
		if (idx !== -1) {
			return generaRulesOptions.prepaidCompanyList[idx]['name'];
		}
	}
	if (str === 'lastCostBelongCompany') {
		const idx = generaRulesOptions.prepaidCompanyList.findIndex((item: any) => item.codeValue === formState.lastCostBelongCompany);
		if (idx !== -1) {
			return generaRulesOptions.prepaidCompanyList[idx]['name'];
		}
	}
	if (str === 'hotelRatedId') {
		const idx = generaRulesOptions.hotelRatedList.findIndex((item: any) => item.oid === formState.hotelRatedId);
		if (idx !== -1) {
			return generaRulesOptions.hotelRatedList[idx]['starCode'];
		}
	}
	return '';
});
const getCompanyTypeName = computed(() => (value: number) => {
	const idx = generaRulesOptions.prepaidCompanyList.findIndex((item) => item.codeValue === value);
	if (idx !== -1) {
		return generaRulesOptions.prepaidCompanyList[idx]['name'];
	}
	return;
});
const cancel = () => {
	route.go(-1);
};
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
