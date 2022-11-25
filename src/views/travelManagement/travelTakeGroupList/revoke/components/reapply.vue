<template>
	<BaseModal :modelValue="modelValue" title="填写撤销重提原因" width="600px" @cancel="cancel">
		<a-form :model="formValidate" :label-col="{ span: 3 }" :wrapper-col="{ span: 12, offset: 1 }" labelAlign="left">
			<a-form-item label="填写一个关联行程单" class="fz14" v-bind="validateInfos[`data.verificationType`]">
				<a-input v-model:value="formValidate.data.verificationType" placeholder="输入关联行程单" />
			</a-form-item>
			<a-form-item label="撤销重提原因（200字）" class="fz14" v-bind="validateInfos[`data.verificationType`]">
				<a-textarea v-model:value="formValidate.data.verificationType" placeholder="请输入其他说明" :rows="4" />
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
const emit = defineEmits(['finish']);

const apply = () => {
	validate()
		.then((res) => {
			statusRec.value === 'REVOKE' ? '' : emit('finish');
			cancel();
			// route.push({ path: '/scenic-spot/singleVote/edit', query: { t: formValidate.data.verificationType, s: 'new' } });
		})
		.catch((err) => {
			console.log('error', err);
		});
};
const statusRec = ref('');

// 打开弹窗
const open = (status: string) => {
	modelValue.value = true;
	statusRec.value = status;
};

// 关闭弹窗
const cancel = () => {
	modelValue.value = false;
	console.log(modelValue.value, 'modelValue');
};

defineExpose({
	open,
});
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
