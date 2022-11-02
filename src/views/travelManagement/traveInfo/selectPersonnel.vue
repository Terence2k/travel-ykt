<template>
	<div class="table-area">
		<BaseModal title="选择古维费可减免人员" v-model="modelValue" :width="1200">
			<div class="top">
				<p>请勾选可减免的游客，提交减免申请：</p>
			</div>
			<div class="p">
				<p>全部游客{{}}名，已减免{{}}人，本次勾选 {{}}人</p>
			</div>
			<CommonTable :row-selection="{ onSelect }" :columns="columns" :dataSource="state.tableData.data" :scrollY="false">
				<template #bodyCell="{ column, index, record }">
					<template v-if="column.key === 'siveFe'">
						<a-select ref="select" placeholder="选择可减免规则" allowClear>
							<a-select-option v-for="item in state.tableData.list" :value="item.oid">
								{{ item.ruleName }}
							</a-select-option>
						</a-select>
					</template>
					<template v-if="column.key === 'e'">
						<a-select ref="select" placeholder="特殊证件类型" allowClear>
							<a-select-option v-for="item in state.tableData.queryList" :value="item.oid">
								{{ item.name }}
							</a-select-option>
						</a-select>
					</template>
				</template>
			</CommonTable>
			<template v-slot:footer>
				<a-button type="primary">保存</a-button>
				<a-button @click="dialogVisible = false">取消</a-button>
			</template>
		</BaseModal>
	</div>
</template>

<script setup lang="ts">
import { ref, Ref, computed, watch, toRefs, reactive } from 'vue';
import { useRouter } from 'vue-router';
import CommonTable from '@/components/common/CommonTable.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import BaseModal from '@/components/common/BaseModal.vue';
import { useTravelStore } from '@/stores/modules/travelManagement';
//获取本地存储数据
const traveListData = JSON.parse(sessionStorage.getItem('traveList') as any) || {};
import { message } from 'ant-design-vue';
import api from '@/api';
const route = useRouter();
const dialogVisible = ref(false);
const navigatorBar = useNavigatorBar();
const formValidate: Ref<Record<string, any>> = ref({});
// import { userList } from '@/api';
const travelStore = useTravelStore()

const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	params: Object,
});
const emit = defineEmits(['update:modelValue', 'cancel', 'onSearch']);
const columns = [
	{
		title: '游客姓名',
		dataIndex: 'getBasiclist',
		key: 'getBasiclist',
	},
	{
		title: '身份证号码',
		dataIndex: 'certificateNo',
		key: 'certificateNo',
	},
	{
		title: '性别',
		dataIndex: 'gender',
		key: 'gender',
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
	},
	title: '',
	operationModal: {
		isApplydate: false,
		isExaminedate: false,
	},
});
const auditRef = ref();
const init = async () => {
	console.log('params', props.params);
	//
	// formValidate.value = {};
	// formValidate.value = { ...props.params };
};
const onSelect = () => {
	api.getItineraryTourist(traveListData.itineraryNo).then((res) => {
		state.tableData.data = res.content;
		console.log(res, '113');
	});
};
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
			onSelect();
			onSearchList();
			dropDownQueryList();
		}
	}
);

watch(dialogVisible, (nVal) => {
	console.log(nVal, '1111111111');
	emit('update:modelValue', nVal);
});
</script>

<style lang="less" scoped>
.top {
	display: flex;
	justify-content: space-between;
}
.p{
	text-align: right;
}
</style>
