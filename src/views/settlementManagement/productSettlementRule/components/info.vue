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
					<span v-if="formState.deductionModel === 2">已核销金额</span>
					<span v-if="formState.deductionModel === 0">未核销金额</span>
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
			<a-form-item label="收费数量" name="charCount">
				<div>
					<span v-if="formState.chargeModel === 1">{{ formState.chargeCount }}</span>
					<span v-else>{{ accDiv(formState.chargeCount, 100) }}</span>
					<!-- <span v-else>{{ formState.chargeCount / 100 }}</span> -->
					<span v-if="formState.chargeModel === 1">%</span>
					<span v-if="formState.chargeModel === 2">元/房间</span>
					<span v-if="formState.chargeModel === 3">元</span>
				</div>
			</a-form-item>
			<template v-if="query.productType === 1">
				<a-form-item label="收费子产品" name="chargeProductSonId" v-if="productSonList.length > 0">
					<span>{{ getChargeProductSonName }}</span>
				</a-form-item>
				<a-form-item v-else label="收费子产品">
					<span>{{ productName }}</span>
				</a-form-item>
			</template>

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
					<span v-if="record.splitModel === 2">{{ accDiv(record.splitCount, 100) }}元</span>
					<!-- <span v-if="record.splitModel === 2">{{ record.splitCount / 100 }}元</span> -->
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
import { FormState } from './type';
import { useGeneraRules } from '@/stores/modules/generaRules';
import { accDiv } from '@/utils/compute';
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
	productSonType: null,
	productType: null,
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
const productSonList = ref([]);
const productName = ref('');
const query = route.currentRoute.value.query || { productType: null };
// 缓存删除编辑数据
const init = async () => {
	const id: any = route.currentRoute.value.query.oid;
	const query = route.currentRoute.value.query;
	navigatorBar.setNavigator(['结算管理', '产品结算规则', getProductKeyName(query), '查看']);
	// await getTeamType();
	await productRuleDetail(id);
	const { productId, productType, productSonType } = route.currentRoute.value.query;
	if (Number(query.productType) === 1) {
		let productRuleList = await api.productRuleList({
			productId,
			productType,
			productSonType,
			pageNo: 1, //页号
			pageSize: 10,
		});
		// 由于产品子类别是否存在需要对其进行判断
		if (productRuleList.content[0].productSonList.length > 0) {
			productSonList.value = productRuleList.content[0].productSonList;
		} else {
			productName.value = productRuleList.content[0].productName;
			formState.chargeProductSonId = Number(productId);
		}
	}
};
const oid = ref('');
const productRuleDetail = async (id: number) => {
	const result = await api.productRuleDetail(id);
	oid.value = result.oid;
	for (let key in formState) {
		if (result[key] || result[key] === 0) {
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
	const query = route.currentRoute.value.query;
	let querySearch = {};
	if (Number(query.productType) === 1) {
		querySearch = {
			oid: encodeURIComponent(query.oid),
			productId: encodeURIComponent(query.productId),
			productType: encodeURIComponent(query.productType),
			productSonType: encodeURIComponent(query.productSonType),
		};
	} else {
		querySearch = {
			oid: encodeURIComponent(query.oid),
			productId: encodeURIComponent(query.productId),
			productType: encodeURIComponent(query.productType),
		};
	}
	route.push({
		path: '/settlementManagement/productSettlementRule/edit',
		query: querySearch,
		// {
		// 	oid: encodeURIComponent(oid.value),
		// 	productId: encodeURIComponent(query.productId),
		// 	productType: encodeURIComponent(query.productType),
		// 	productSonType: encodeURIComponent(query.productSonType),
		// },
	});
};
const getTypeName = computed(() => (str: string) => {
	if (str === 'teamTypeId') {
		const idx = generaRulesOptions.teamTypeList.findIndex((item: any) => item.oid === formState.teamTypeId);
		if (idx !== -1) {
			return generaRulesOptions.teamTypeList[idx]['name'];
		}
	}
	if (str === 'productType') {
		const idx = generaRulesOptions.productTypeList.findIndex((item: any) => item.value === formState.productType);
		if (idx !== -1) {
			return generaRulesOptions.productTypeList[idx]['name'];
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
	if (str === 'productSonType') {
		const idx = generaRulesOptions.productSonTypeList.findIndex((item: any) => item.value === formState.productSonType);
		if (idx !== -1) {
			return generaRulesOptions.productSonTypeList[idx]['name'];
		}
	}
});
// 获取表格分账规则分账单位名称
const getCompanyTypeName = computed(() => (value: string) => {
	const idx = generaRulesOptions.prepaidCompanyList.findIndex((item) => item.codeValue === value);
	if (idx !== -1) {
		return generaRulesOptions.prepaidCompanyList[idx]['name'];
	}
	return;
});
const cancel = () => {
	route.go(-1);
};
const getChargeProductSonName = computed(() => {
	const idx = productSonList.value.findIndex((item) => item.productSonId === formState.chargeProductSonId);
	if (idx !== -1) {
		return productSonList.value[idx]['productSonName'];
	} else {
		return;
	}
});
const getProductKeyName = (query: { productType: any }): string => {
	if (Number(query.productType) === 1) {
		return '景区';
	} else if (Number(query.productType) === 2) {
		return '酒店';
	} else if (Number(query.productType) === 3) {
		return '餐饮';
	} else if (Number(query.productType) === 4) {
		return '综费产品';
	}
	return '';
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
