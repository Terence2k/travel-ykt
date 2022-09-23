<template>
	<BaseModal :title="options.title" v-model="modelValue">
		<a-form :model="formValidate" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 16, offset: 1 }" labelAlign="left">
			<a-form-item label="分账单位" name="starCode">
				<a-input v-model:value="formValidate.starCode" />
			</a-form-item>
			<a-form-item label="分账百分比" name="price">
				<a-input v-model:value="formValidate.price" placeholder="请输入分账占比（单位：%）" />
			</a-form-item>
		</a-form>
		<template v-slot:footer>
			<a-button type="primary" @click="save">保存</a-button>
			<a-button @click="dialogVisible = false">取消</a-button>
		</template>
	</BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '@/components/common/BaseModal.vue';
import { Ref } from 'vue';
const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	params: Object,
	methods: Object,
});
const emit = defineEmits(['update:modelValue']);
const options = reactive({
	title: '新增酒店星级',
});
const formValidate: Ref<Record<string, any>> = ref({});
const rules: any = {
	starCode: [{ required: true, trigger: 'blur', message: '请输入酒店星级' }],
	price: [{ required: true, trigger: 'blur', message: '请输入最低价格，单位（元）' }],
	ratedStatus: [{ required: true, trigger: 'change', message: '请选择状态' }],
};
const init = async () => {
	console.log('params', props.params);
	formValidate.value = {};
	if (props.params?.oid) {
		formValidate.value = { ...props.params, price: props.params.price / 100 };
		options.title = '编辑分账规则';
	} else {
		options.title = '新增分账规则';
	}
};
const save = () => {};
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

<style scoped></style>
