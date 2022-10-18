<template>
	<BaseModal :title="state.title" v-model="modelValue" width="70%" @cancel="dialogVisible = false">
		<h3 style="margin: 0px 0 20px 30px">合计4500元</h3>
		<CommonTable :dataSource="state.tableData.data" :columns="columns" :scroll="{ x: '100%' }"></CommonTable>
		<CommonPagination
			:current="state.tableData.param.pageNo"
			:page-size="state.tableData.param.pageSize"
			:total="state.tableData.total"
			@change="onHandleCurrentChange"
			@showSizeChange="pageSideChange"
		/>
		<div class="" style="margin: 0px 0 10px 30px" v-if="state.isHandle">
			<h4 style="margin: 0px 0 10px 0">备注说明</h4>
			<a-textarea v-model:value="state.remarks" placeholder="请输入备注" :rows="4" />
		</div>
		<template v-slot:footer v-if="state.isHandle">
			<a-button type="primary" style="width: 100px">发起转账</a-button>
			<a-button style="width: 110px">审核不通过</a-button>
		</template>
	</BaseModal>
</template>
<script setup lang="ts">
import BaseModal from '@/components/common/BaseModal.vue';
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import { Ref } from 'vue';
import lodash from 'lodash';
import { message } from 'ant-design-vue';
const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	params: {
		type: Object,
		default: () => {
			return {};
		},
	},
	methods: Object,
});
const columns = [
	{
		title: '转账单号',
		dataIndex: 'productName',
		key: 'productName',
	},
	{
		title: '申请时间',
		dataIndex: 'scenicName',
		key: 'scenicName',
	},
	{
		title: '所含团数',
		dataIndex: 'productSonType',
		key: 'productSonType',
	},
	{
		title: '结算总额（元）',
		dataIndex: 'hasProductRule',
		key: 'hasProductRule',
	},
	{
		title: '转账申请人',
		dataIndex: 'hasProductRule',
		key: 'hasProductRule',
	},
];
const emit = defineEmits(['update:modelValue', 'submit']);
const dialogVisible = ref(false);
const state = reactive({
	title: '审核',
	tableData: {
		data: [],
		param: {
			pageNo: 1,
			pageSize: 10,
		},
		total: 111,
	},
	remarks: '',
	isHandle: true,
});
const init = () => {
	console.log(`我进来啦`);
	if (props.params.handle) {
		state.title = '审核';
		state.isHandle = true;
	} else {
		state.title = '查看详情';
		state.isHandle = false;
	}
};
// 查询
const initList = async () => {
	// state.tableData.loading = true;
	// let res = await api.productRuleList(state.tableData.param);
	// const { total, content } = res;
	// state.tableData.total = total;
	// const list: [any] = dealData(content);
	// state.tableData.data = list;
	// state.tableData.loading = false;
};
//搜索
const onHandleCurrentChange = (val: number) => {
	console.log('change:', val);
	state.tableData.param.pageNo = val;
	// onSearch();
	initList();
};
//翻页
const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	state.tableData.param.pageSize = size;
	// onSearch();
	initList();
};
watch(
	() => props.modelValue,
	async (nVal) => {
		console.log('props.modelValue->', nVal);
		dialogVisible.value = nVal;
		if (dialogVisible.value) {
			await init();
		}
	}
);
watch(dialogVisible, (nVal) => {
	console.log('dialogVisible:', nVal);
	emit('update:modelValue', nVal);
});
</script>
