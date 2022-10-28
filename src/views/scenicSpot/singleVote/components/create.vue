<template>
	<BaseModal :modelValue="modelValue" title="新增" width="600px" @cancel="cancel">
		<a-form :model="formValidate" :label-col="{ span: 3 }" :wrapper-col="{ span: 12, offset: 1 }" labelAlign="left">
			<a-form-item label="单票类型" class="fz14" v-bind="validateInfos[`data.verificationType`]">
				<a-radio-group v-model:value="formValidate.data.verificationType">
					<a-radio :value="0">单票：单点核销</a-radio>
					<a-radio :value="1">单票：多选核销</a-radio>
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
import { Form } from 'ant-design-vue';
const route = useRouter();
const modelValue = ref(false);
const useForm = Form.useForm;

const formValidate = reactive({
	data: {
		verificationType: '',
	},
});
const { resetFields, validate, validateInfos, mergeValidateInfo, scrollToField } = useForm(
	formValidate,
	reactive({
		'data.verificationType': [{ required: true, message: '请选择' }],
	})
);
const rules = {
	'data.verificationType': [{ required: true, message: '请选择单票类型' }],
};
const props = defineProps({
	// modelValue: {
	// 	type: Boolean,
	// 	default: false,
	// },
	// params: Object,
	// menuList: Array,
});
const apply = () => {
	validate()
		.then((res) => {
			route.push({ path: '/scenic-spot/singleVote/edit', query: { t: formValidate.data.verificationType, s: 'new' } });
		})
		.catch((err) => {
			console.log('error', err);
		});
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

<style scoped lang="less">
::deep .ant-modal-body {
	margin: 0;
	padding: 0;
	background-color: red;
}
.fz14 {
	font-size: 14px;
}
</style>
