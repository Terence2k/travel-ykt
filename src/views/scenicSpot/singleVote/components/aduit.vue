<template>
	<BaseModal :modelValue="modelValue" title="审核" width="600px" @cancel="cancel">
		<a-form ref="formRef" :model="formValidate" :label-col="{ span: 4 }" :wrapper-col="{ flex: 9 }" labelAlign="left">
			<a-form-item label="下架日期" name="menuType">
				<a-date-picker :show-time="{ format: 'HH:mm' }" v-model:value="formValidate.data.time" />
				至
				<a-date-picker :show-time="{ format: 'HH:mm' }" v-model:value="formValidate.data.time" />
			</a-form-item>
			<a-form-item label="下架时段" name="menuType">
				<a-date-picker :show-time="{ format: 'HH:mm' }" v-model:value="formValidate.data.time" />
				至
				<a-date-picker :show-time="{ format: 'HH:mm' }" v-model:value="formValidate.data.time" />
			</a-form-item>
			<a-form-item label="原因" name="menuType">
				<a-textarea v-model:value="formValidate.data.reason" placeholder="请输入原因" :rows="4" />
			</a-form-item>
		</a-form>
		<template v-slot:footer>
			<a-button type="primary" @click="apply">申请</a-button>
			<a-button @click="dialogVisible = false">取消</a-button>
		</template>
	</BaseModal>
</template>

<script lang="ts" setup>
import BaseModal from '@/components/common/BaseModal.vue';
import api from '@/api';

const modelValue = ref(false);

const formValidate = reactive({
	data: {
		time: '',
		reason: '',
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
