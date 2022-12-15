<template>
	<BaseModal :title="options.title" v-model="dialogVisible" style="width: 650px">
		<a-form ref="formRef" :rules="rulesRef" :model="formValidate" autocomplete="off" labelAlign="left">
			<a-form-item label="选择数据日期范围" :label-col="labelCol" name="time">
				<a-range-picker
					style="width: 100%"
					show-time
					format="YYYY-MM-DD HH:mm:ss"
					v-model:value="formValidate.time"
					value-format="YYYY-MM-DD HH:mm:ss"
				/>
			</a-form-item>
			<a-form-item :label-col="labelCol">
				<div style="padding-left: 150px">
					<a-button @click="onSubmit">生成预览内容</a-button>
					<span style="margin-left: 20px">{{ formValidate.tips }}</span>
				</div>
			</a-form-item>
			<a-form-item label="短信内容预览" :label-col="labelCol">
				{{ formValidate.previewData }}
			</a-form-item>
		</a-form>
		<template v-slot:footer>
			<a-button @click="cencel">取消</a-button>
			<a-button type="primary" @click="send">确认发送</a-button>
		</template>
	</BaseModal>
</template>

<script lang="ts" setup>
import { ref, Ref, computed, watch, toRefs, reactive } from 'vue';
import BaseModal from '@/components/common/BaseModal.vue';
import api from '@/api';
import { message } from 'ant-design-vue';

const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	params: Object,
});
const formRef = ref();
const labelCol = { style: { width: '150px' } };
const emit = defineEmits(['update:modelValue', 'cancel', 'onSearch']);
const dialogVisible = ref(false);
const formValidate: Ref<Record<string, any>> = ref({});
const options = reactive({ title: '手动发送' });

const rulesRef = {
	time: [{ required: true, message: '您还未选择日期范围！', trigger: 'change' }],
};

const cencel = () => {
	formRef.value.resetFields();
	formValidate.value = {};
	emit('cancel');
};

const onSubmit = () => {
	formRef.value.validate().then(() => {
		const data = {
			templateOid: props?.params?.oid, //短信模板oid
			startDate: formValidate.value.time[0], //开始时间
			endDate: formValidate.value.time[1], //结束时间
		};
		api.getTemplateReadInfo(data).then((res: any) => {
			formValidate.value.previewData = res;
			formValidate.value.tips = '短信内容已生成，确认无误即可确定发送！';
		});
	});
};

const send = () => {
	formRef.value.validate().then(() => {
		const data = {
			templateOid: props?.params?.oid, //短信模板oid
			startDate: formValidate.value.time[0], //开始时间
			endDate: formValidate.value.time[1], //结束时间
		};
		api.manualSendSms(data).then((res: any) => {
			message.success('发送成功');
			cencel()
		});
	});
};

watch(
	() => props.modelValue,
	async (nVal) => {
		dialogVisible.value = nVal;
	}
);

watch(dialogVisible, (nVal) => {
	emit('update:modelValue', nVal);
});
</script>

<style></style>
