<template>
	<BaseModal :title="options.title" v-model="modelValue">
		<a-form
			ref="formRef"
			:model="formValidate"
			:rules="rules"
			:label-col="{ span: 5 }"
			:wrapper-col="{ span: 16, offset: 1 }"
		>
			<a-form-item label="对账批号" name="reconciliationNo">
				<a-input v-model:value="formValidate.reconciliationNo" placeholder="请输入对账批号" style="width: 100%">
				</a-input>
			</a-form-item>
		</a-form>
		<template v-slot:footer>
			<a-button type="primary" @click="save">发起申请</a-button>
			<a-button @click="dialogVisible = false">取消</a-button>
		</template>
	</BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '@/components/common/BaseModal.vue';
import { isIntegerNotMust, isBtnZeroToHundred } from '@/utils/validator';
import { Ref } from 'vue';
import api from '@/api';
import lodash from 'lodash';
import { message } from 'ant-design-vue';
import { log } from 'console';
const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
});
const emit = defineEmits(['update:modelValue', 'submit']);
const options = reactive({
	title: '申请转账',
});
const formValidate: Ref<Record<string, any>> = ref({});

const rules: any = {
	reconciliationNo: [{ required: true,  message: '请输入对账批号' }],
};
const init = async () => {
	
};
const formRef = ref();
const save = () => {
	formRef.value
		.validate()
		.then((result: any) => {
			let params = {
				'status': 16,
				'reconciliationNo': formValidate.value.reconciliationNo
			}
			api
					.settlementUpdate(params)
					.then((res: any) => {
						message.success('操作成功');
						emit('submit');
						formValidate.value = {};
						dialogVisible.value = false;
					})
			dialogVisible.value = false;
			
		})
		.catch((err: any) => {
			console.log('error', err);
		});
};
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
