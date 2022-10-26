<template>
	<div class="table-area">
		<BaseModal title="选择古维费可减免人员" v-model="modelValue" :width="1000">
			<div class="top">
				<p>请选择可减免的游客，取消勾选：</p>
				<a-button>自动检查可减免人员</a-button>
			</div>
			<CommonTable :row-selection="{ onSelect }" :columns="columns" :dataSource="state.tableData.data" :scrollY="false"> </CommonTable>
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
import { message } from 'ant-design-vue';
const route = useRouter();
const dialogVisible = ref(false);
const navigatorBar = useNavigatorBar();
const formValidate: Ref<Record<string, any>> = ref({});
// import { userList } from '@/api';
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
		title: '游客名字',
		dataIndex: 'comprehensiveFeeProductName',
		key: 'comprehensiveFeeProductName',
	},
	{
		title: '可减免类型',
		dataIndex: 'belongCompanyName',
		key: 'belongCompanyName',
	},
	{
		title: '特殊证件类型',
		dataIndex: 'feeModel',
		key: 'feeModel',
	},
	{
		title: '特殊证件照片',
		dataIndex: 'confirmDailyChargeName',
		key: 'confirmDailyChargeName',
	},
	{
		title: '是否已缴',
		dataIndex: 'feeNumber',
		key: 'feeNumber',
	},
];
const state = reactive({
	tableData: {
		data: [
			{
				comprehensiveFeeProductName: '张三',
				belongCompanyName: '特殊证件',
				feeModel: '士官证',
				confirmDailyChargeName: 'img',
				feeNumber: '否',
			},
			{
				comprehensiveFeeProductName: '张三',
				belongCompanyName: '特殊证件',
				feeModel: '士官证',
				confirmDailyChargeName: 'img',
				feeNumber: '否',
			},
		],
		total: 400,
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
		},
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
const onSelect = (record: any, selected: boolean, selectedRows: any[]) => {
	console.log(record, selected, selectedRows);
};
watch(
	() => props.modelValue,
	async (nVal) => {
		dialogVisible.value = nVal;
		if (dialogVisible.value) {
			await init();
		}
	}
);

watch(dialogVisible, (nVal) => {
	console.log(nVal, '1111111111');
	emit('update:modelValue', nVal);
});
</script>

<style lang="less" scoped>
.top{
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
}
</style>
