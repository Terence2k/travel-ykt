<template>
	<BaseModal :title="options.title" v-model="dialogVisible" :width="1000">
		<CommonTable :dataSource="formData.list" :columns="columns" :scrollY="false">
			<template #bodyCell="{ column, record }">
				<!-- 结算费用 拼接 + - 号 单位转成元-->
				<template v-if="column.key === 'settlementCost'">
					<span>
						{{ record.costType == 0 ? '-' : '+' }}
						{{ record.settlementCost / 100 > 0 ? (record.settlementCost / 100).toFixed(2) : 0 }}
					</span>
				</template>
			</template>
		</CommonTable>
		<template v-slot:footer>
			<a-button @click="dialogVisible = false">取消</a-button>
		</template>
	</BaseModal>
</template>

<script setup lang="ts">
import api from '@/api';
import BaseModal from '@/components/common/BaseModal.vue';
import CommonTable from '@/components/common/CommonTable.vue';
import { isIntegerNotMust, isBtnZeroToHundred } from '@/utils/validator';
import { Ref } from 'vue';
const dialogVisible = ref(false);
const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	params: {
		type: Object,
		default: false,
	},
	methods: Object,
});
const emit = defineEmits(['update:modelValue', 'submit']);
const columns = [
	{
		title: '序号',
		customRender: ({ text, record, index }) => {
			return `${index + 1}`;
		},
	},
	{
		title: '费用名称',
		dataIndex: 'costName',
		key: 'costName',
	},
	{
		title: '结算产品',
		dataIndex: 'productName',
		key: 'productName',
	},
	{
		title: '结算方',
		dataIndex: 'companyName',
		key: 'companyName',
	},
	{
		title: '结算费用（元）',
		dataIndex: 'settlementCost',
		key: 'settlementCost',
	},
];
const formData: any = reactive({
	list: [],
});
const options = reactive({
	title: '分账明细',
});

const rules: any = {
	settlementCost: [{ required: true, validator: isIntegerNotMust }],
};

const init = async () => {
	const params = {
		informationId: props.params.oid,
		itineraryNo: props.params.itineraryNo
	}
	api
		.settlementDetail(params)
		.then((res: any) => {
			formData.list = res
		})
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
	emit('update:modelValue', nVal);
	formData.list = []
});
</script>

<style scoped>
.ant-input-number {
	width: 100%;
}
</style>
