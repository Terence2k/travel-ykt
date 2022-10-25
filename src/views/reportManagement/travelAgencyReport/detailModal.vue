<template>
	<BaseModal :title="options.title" v-model="modelValue" :width="1000">
		<CommonTable :dataSource="formData.list" :columns="columns" :scrollY="false">

		</CommonTable>
		<template v-slot:footer>
			<a-button @click="dialogVisible = false">取消</a-button>
		</template>
	</BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '@/components/common/BaseModal.vue';
import CommonTable from '@/components/common/CommonTable.vue';
import { isIntegerNotMust, isBtnZeroToHundred } from '@/utils/validator';
import { Ref } from 'vue';
import lodash from 'lodash';
import { message } from 'ant-design-vue';
import { log } from 'console';
const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	params: Object,
	methods: Object,
});
const emit = defineEmits(['update:modelValue', 'submit']);
const columns = [
	{
		title: '序号',
        customRender: ({ text, record, index }) => {
            return `${ index + 1 }`;
        }
	},
	{
		title: '费用名称',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: '结算产品',
		dataIndex: 'type',
		key: 'type',
	},
	{
		title: '结算方',
		dataIndex: 'bank',
		key: 'bank',
	},
	{
		title: '结算费用（元）',
		dataIndex: 'price',
		key: 'price',
	},
];
const formData: any = reactive({
	list: [
		{
            oid: 1,
            key: 1,
            type: 'John Brown sr.',
            name: 'test',
            bank: 'test',
            price: '1001',
            time: 'test',
        },
        {
            oid: 2,
            key: 1,
            type: 'John Brown sr.',
            name: 'test',
            bank: 'test',
            price: '1001',
            time: 'test',
        },
        {
            oid: 3,
            key: 1,
            type: 'John Brown sr.',
            name: 'test',
            bank: 'test',
            price: '1001',
            time: 'test',
        },
	]
});
const options = reactive({
	title: '分账明细',
});

const rules: any = {
	price: [{ required: true, validator: isIntegerNotMust, }],
};
const init = async () => {
	console.log(props.params.oid);
};
const formRef = ref();

const dialogVisible = ref(false);
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

<style scoped>
.ant-input-number {
	width: 100%;
}
</style>
