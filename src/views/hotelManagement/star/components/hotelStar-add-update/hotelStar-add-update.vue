<template>
	<div class="wrapper">
		<BaseModal :title="options.title" v-model="modelValue" :onOk="handleOk">
			<a-form :model="formValidate" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 16, offset: 1 }" labelAlign="left">
				<a-form-item label="酒店星级" name="hotelStar">
					<a-input v-model:value="formValidate.hotelStar" />
				</a-form-item>
				<a-form-item label="诚信指导价" name="price">
					<a-input v-model:value="formValidate.account" />
				</a-form-item>
				<a-form-item label="状态" name="status">
					<a-radio-group v-model:value="formValidate.status">
						<a-radio :value="1">启用</a-radio>
						<a-radio :value="0">禁用</a-radio>
					</a-radio-group>
				</a-form-item>
			</a-form>
			<template v-slot:footer>
				<a-button type="primary" @click="save">保存</a-button>
				<a-button @click="dialogVisible = false">取消</a-button>
			</template>
		</BaseModal>
	</div>
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
});
const emit = defineEmits(['update:modelValue']);
const formValidate: Ref<Record<string, any>> = ref({});
const options = reactive({
	title: '新增酒店星级',
});
const rules: any = {
	hotelStar: [{ required: true, trigger: 'blur', message: '请输入酒店星级' }],
	price: [{ required: true, trigger: 'blur', message: '请输入最低价格，单位（元）' }],
	status: [{ required: true, trigger: 'change', message: '请选择状态' }],
};

const handleOk = async (callback: Function) => {
	console.log('ok');
};

const save = () => {
	formValidate.value.companyId = null;
	formValidate.value.password = '123456';
	console.log('formValidate:', formValidate.value);
};
</script>

<style lang="less" scoped></style>
