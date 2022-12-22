<template>
	<BaseModal title="新增短信" v-model="dialogVisible" style="width: 700px">
		<a-form ref="formRef" :label-col="{ span: 4 }" labelAlign="left" :model="state.formState" :rules="rules">
			<a-form-item label="短信名称" name="taskName">
				<a-input placeholder="请输入短信名称" v-model:value="state.formState.taskName" />
			</a-form-item>
			<a-form-item label="短信ID" name="templateId">
				<a-input placeholder="请输入移动云平台短信ID" v-model:value="state.formState.templateId" />
			</a-form-item>
			<a-form-item label="短信模板" name="smsContent">
				<a-textarea style="height: 100px;" placeholder="请输入短信模板" v-model:value="state.formState.smsContent" />
			</a-form-item>
			<a-form-item label="状态" name="isEnable">
				<a-radio-group :options="options" v-model:value="state.formState.isEnable" />
			</a-form-item>
		</a-form>
		<template v-slot:footer>
			<a-button @click="cancel">取消</a-button>
			<a-button type="primary" @click="onSumbit">保存</a-button>
		</template>
	</BaseModal>
</template>

<script lang="ts" setup>
import { ref, Ref, computed, watch, toRefs, reactive } from 'vue';
import BaseModal from '@/components/common/BaseModal.vue';
import api from '@/api';
import { message } from 'ant-design-vue/es';

const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	params: Object,
});

const formRef = ref();
const state = reactive({
	formState: {
		taskName: '',
		templateId: '',
		smsContent: '',
		isEnable: '',
	},
});
const rules = {
	taskName: [{ required: true, message: 'Please input Activity name', trigger: 'blur' }],
	templateId: [{ required: true, message: 'Please input Activity name', trigger: 'blur' }],
	smsContent: [{ required: true, message: 'Please input Activity name', trigger: 'blur' }],
	isEnable: [{ required: true, message: 'Please input Activity name', trigger: 'blur' }],
};
const options = [
	{ label: '禁用', value: 1 },
	{ label: '启用', value: 0 },
];
const emit = defineEmits(['update:modelValue', 'cancel', 'onSearch']);
const dialogVisible = ref(false);

const cancel = () => {
	formRef.value.resetFields();
	emit('cancel')
}

const onSumbit = () => {
	api.addSmsTemplate(state.formState).then((res:any)=>{
		message.success('新增成功');
		emit('onSearch')
		cancel()
		return
	})
};

watch(
	() => props.modelValue,
	async (nVal) => {
		dialogVisible.value = nVal;
		if(dialogVisible.value){
			state.formState.taskName = props.params.taskName
			state.formState.templateId = props.params.templateId
			state.formState.smsContent = props.params.smsContent
			state.formState.isEnable = props.params.isEnable
			state.formState.oid =  props.params.oid
			state.formState.sendModel =  props.params.sendModel
			state.formState.sendTime =  props.params.sendTime
			state.formState.taskCode =  props.params.taskCode
		}
	}
);

watch(dialogVisible, (nVal) => {
	emit('update:modelValue', nVal);
});
</script>

<style></style>
