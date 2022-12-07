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
			<a-button type="primary" @click="dialogVisible = false">确认发送</a-button>
		</template>
	</BaseModal>
</template>

<script lang="ts" setup>
import { ref, Ref, computed, watch, toRefs, reactive } from 'vue';
import BaseModal from '@/components/common/BaseModal.vue';
import api from '@/api';

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
	formValidate.value = {}
	// state.previewData = '';
	// state.tips = '';
	emit('cancel');
};

const onSubmit = () => {
	formRef.value.validate().then(() => {
		// await api.slaEdit(state.ruleForm)
		formValidate.value.previewData =
			'【丽江一卡通】2022年10月1日至2022年10月7日，丽江一卡通平台制卡情况：标准团200团5445人，散客门店组团178团692人，合计378团6137人。';
		formValidate.value.tips = '短信内容已生成，确认无误即可确定发送！';
	});
};

const init = async () => {};

watch(
	() => props.modelValue,
	async (nVal) => {
		dialogVisible.value = nVal;
		if (dialogVisible.value) {
			await init();
		}
	}
);

watch(dialogVisible, (nVal) => {
	emit('update:modelValue', nVal);
});
</script>

<style></style>
