<template>
	<div class="table-area">
		<BaseModal title="选择古维费可减免人员" v-model="modelValue" :width="1200">
			<div class="top">
				<p>请勾选可减免的游客，提交减免申请：</p>
			</div>
			<div class="p">
				<p>全部游客{{ state.tableData.data.total }}名，已减免{{ state.tableData.data.reduceNum }}人，本次勾选 {{ state.tableData.num }}人</p>
			</div>
			<CommonTable
				:row-selection="{ onSelect, getCheckboxProps }"
				:columns="columns"
				:dataSource="state.tableData.data.touristList"
				rowKey="oid"
				:scrollY="false"
			>
				<template #bodyCell="{ column, index, record }">
					<template v-if="column.key === 'age'">
						<div v-if="record.certificateType == 'IDENTITY_CARD'">
							{{ record.age }}
						</div>
						<div v-else>
							<a-input v-model:value="record.age" style="width: 100px" v-if="record.purchased != 2"></a-input>
							<a-input v-model:value="record.age" style="width: 100px" v-else disabled></a-input>
						</div>
					</template>
					<template v-if="column.key === 'specialCertificateTypeName'">
						<span v-if="record.purchased" disabled>{{ record.specialCertificateTypeName }}</span>
					</template>
					<template v-if="column.key === 'discountRuleId'">
						<span v-if="record.purchased == 2">{{ record.discountRuleName }}</span>
						<a-select
							ref="select"
							placeholder="选择可减免规则"
							@change="(val: any, option: any) => ruleChange(val, option, record.key ? record.key : record.oid)"
							v-model:value="record.discountRuleId"
							allowClear
							v-else
						>
							<a-select-option v-for="item in state.tableData.list" :item="item" :key="item.oid" :value="item.oid">
								{{ item.ruleName }}
							</a-select-option>
						</a-select>
					</template>
					<template v-if="column.key === 'specialCertificateImg'">
						<img :src="record.specialCertificateImg" />
					</template>
				</template>
			</CommonTable>
			<template v-slot:footer>
				<a-button type="primary" @click="submit" v-if="state.isReductionPassed =='2' " disabled>提交减免申请</a-button>
				<a-button type="primary" @click="submit" v-else>提交减免申请</a-button>
				<a-button type="primary">去出票</a-button>
				<a-button @click="dialogVisible = false">取消</a-button>
			</template>
		</BaseModal>
	</div>
</template>

<script setup lang="ts">
import { ref, Ref, computed, watch, toRefs, reactive } from 'vue';
import CommonTable from '@/components/common/CommonTable.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import BaseModal from '@/components/common/BaseModal.vue';
import { useTravelStore } from '@/stores/modules/travelManagement';
//获取本地存储数据
import { message } from 'ant-design-vue';
import api from '@/api';
import { any, object, string } from 'vue-types';
const traveListData = JSON.parse(sessionStorage.getItem('traveList') as any) || {};
const route = useRouter();
const dialogVisible = ref(false);
const navigatorBar = useNavigatorBar();
const formValidate: Ref<Record<string, any>> = ref({});
// import { userList } from '@/api';
const travelStore = useTravelStore();

const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	id: {
		type: String,
		default: ''
	},
	isReductionPassed:{
		type: String,
		default: ''
	}
});
const emit = defineEmits(['update:modelValue', 'cancel', 'onSearch', 'routeId']);
const columns = [
	{
		title: '游客姓名',
		dataIndex: 'touristName',
		key: 'touristName',
	},
	{
		title: '身份证件类型',
		dataIndex: 'certificateTypeName',
		key: 'certificateTypeName',
	},
	{
		title: '身份证号码',
		dataIndex: 'certificateNo',
		key: 'certificateNo',
	},
	{
		title: '性别',
		dataIndex: 'genderName',
		key: 'genderName',
	},
	{
		title: '年龄',
		dataIndex: 'age',
		key: 'age',
	},
	{
		title: '联系方式',
		dataIndex: 'veFeeProductName',
		key: 'veFeeProductName',
	},
	{
		title: '客源地',
		dataIndex: 'sourceAddressName',
		key: 'sourceAddressName',
	},
	{
		title: '选择可减免规则',
		dataIndex: 'discountRuleId',
		key: 'discountRuleId',
	},
	{
		title: '特殊证件类型',
		dataIndex: 'specialCertificateTypeName',
		key: 'specialCertificateTypeName',
	},
	{
		title: '特殊证件照片',
		dataIndex: 'specialCertificateImg',
		key: 'specialCertificateImg',
	},
];
const state = reactive({
	tableData: {
		data: [],
		total: 400,
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
		},
		list: [],
		queryList: [],
		status: '1',
		pattern: '1',
		age: '',
		num: 0,
		submitList: [],
	},
	title: '',
	operationModal: {
		isApplydate: false,
		isExaminedate: false,
	},
	isReductionPassed:''
});
const auditRef = ref();
const init = async () => {
	state.isReductionPassed=props.isReductionPassed
};
const onSelect = (record: any, selected: boolean, selectedRows: any) => {
	state.tableData.num = selectedRows.length;
	state.tableData.submitList = selectedRows;
};
const submit = () => {
	//props.routeId后面传这个
	let data = {
		itineraryId: 2,
		reduceTouristList: state.tableData.submitList.map((item: any) => {
			return {
				touristId: item.touristId,
				certificateType: item.certificateType,
				certificateNo: item.certificateNo,
				touristName: item.touristName,
				age: item.age,
				gender: item.gender,
				sourceAddress: item.sourceAddress,
				sourceAddressName: item.sourceAddressName,
				discountRuleId: item.discountRuleId,
				specialCertificateImg: item.specialCertificateImg,
			};
		}),
	};
	if (data.reduceTouristList.length == 0) {
		message.error('请选择减免规则');
		return false;
	}
	let discountRuleId = state.tableData.submitList.some((item, index) => {
		return item.discountRuleId == null;
	});
	if (discountRuleId) {
		message.error('请选择减免规则');
		return false;
	}
	api.applyReduction(data).then((res) => {
		message.success('提交成功');
		dialogVisible.value = false;
	});
};
const ruleChange = (value: any, { item }: any, key: any) => {
	console.log(item);
	if (item.discountType == 1) {
		let data = state.tableData.data.touristList.filter((it: any) => it.oid === key);
		data.map((i: any) => {
			(i.specialCertificateType = item.discountType), (i.specialCertificateTypeName = item.discountConditionName);
			return i;
		});
	}
};
const onSearch = () => {
	//props.routeId后面传这个
	api.getItineraryTourist(2).then((res) => {
		state.tableData.data = res;
	});
};
const getCheckboxProps = (record: any) => ({
	disabled: record.purchased == 2,
	// defaultChecked:selectedRowKeys.includes(record.purchased==2)
});
const onSearchList = () => {
	api.getBasiclist({ discountRuleStatus: 1 }).then((res) => {
		state.tableData.list = res;
	});
};
//查询证件列表
const dropDownQueryList = () => {
	api.dropDownQueryList('SPECIAL_CERTIFICATE_TYPE').then((res) => {
		state.tableData.queryList = res;
	});
};
watch(
	() => props.modelValue,
	async (nVal) => {
		dialogVisible.value = nVal;
		if (dialogVisible.value) {
			await init();
			onSearch();
			onSearchList();
			dropDownQueryList();
		}
	}
);

watch(dialogVisible, (nVal) => {
	emit('update:modelValue', nVal);
});
</script>

<style lang="less" scoped>
.top {
	display: flex;
	justify-content: space-between;
}
.p {
	text-align: right;
}
</style>
