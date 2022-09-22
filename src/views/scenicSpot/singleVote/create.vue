<template>
	<BaseModal :modelValue="modelValue" title="新增" width="600px" @cancel="cancel">
		<a-form ref="formRef" :model="formValidate" :label-col="{ span: 6 }" :wrapper-col="{ span: 12, offset: 1 }" labelAlign="right">
			<a-form-item label="单票类型" name="menuType">
				<a-radio-group v-model:value="formValidate.data.accountType">
					<a-radio :value="1">单票：多选核销</a-radio>
					<a-radio :value="2">单票：单点核销</a-radio>
				</a-radio-group>
			</a-form-item>
		</a-form>
		<template v-slot:footer>
			<a-button type="primary" @click="apply" style="width: 100px">提交审核</a-button>
			<a-button @click="cancel">取消</a-button>
		</template>
	</BaseModal>
</template>

<script lang="ts" setup>
import BaseModal from '@/components/common/BaseModal.vue';
import api from '@/api';

const modelValue = ref(false);

const formValidate = reactive({
	data: {
		accountType: '',
	},
});
const props = defineProps({
	// modelValue: {
	// 	type: Boolean,
	// 	default: false,
	// },
	// params: Object,
	// menuList: Array,
});
const apply = () => {
	console.log('apply');
};

// 打开弹窗
const open = () => {
	modelValue.value = true;
};
// 关闭弹窗
const cancel = () => {
	modelValue.value = false;
	console.log(modelValue.value, 'modelValue');
};

defineExpose({
	open,
	close,
});
// const emit = defineEmits(['update:modelValue', 'cancel', 'onSearch']);
</script>

<style lang="scss" scoped>
::deep .ant-modal-body {
	margin: 0;
	padding: 0;
	background-color: red;
}
</style>
