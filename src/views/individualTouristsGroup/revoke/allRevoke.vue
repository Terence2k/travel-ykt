<template>
	<BaseModal :modelValue="modelValue" title="整团撤销选择" width="600px" @cancel="cancel">
		<a-form layout="vertical" :model="formValidate" :label-col="{ span: 14 }" :wrapper-col="{ span: 28, offset: 0 }" labelAlign="left">
			<!-- <a-form-item layout="vertical" label="是否新增行程" class="fz14" v-bind="validateInfos[`data.haveNew`]">
				<a-radio-group v-model:value="formValidate.data.haveNew" :options="options" />
			</a-form-item>
			<a-form-item v-if="formValidate.data.haveNew" label="填写一个关联行程单" class="fz14" v-bind="validateInfos[`data.relatedItineraryNo`]">
				<a-input v-model:value="formValidate.data.relatedItineraryNo" placeholder="输入关联行程单" />
			</a-form-item> -->
			<a-form-item label="撤销原因（200字）" class="fz14" v-bind="validateInfos[`data.revokeReason`]">
				<a-textarea :maxlength="200" v-model:value="formValidate.data.revokeReason" placeholder="请输入其他说明" :rows="4" max="200" />
			</a-form-item>
			<a-form-item label="上传附件（5张）" class="fz14" v-bind="validateInfos[`data.pic`]">
				<Upload v-model="formValidate.data.pic" :maxCount="5" />
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
import Upload from '@/components/common/imageWrapper.vue';
import api from '@/api/index';

import { Form } from 'ant-design-vue';
const useForm = Form.useForm;
const route = useRouter();
const modelValue = ref(false);

const formValidate = reactive({
	data: {
		revokeReason: '',
		relatedItineraryNo: '',
		pic: '',
		haveNew: false,
	},
});
const options = [
	{ label: '否', value: false },
	{ label: '是', value: true },
];
const { resetFields, validate, validateInfos, mergeValidateInfo, scrollToField } = useForm(
	formValidate,
	reactive({
		'data.revokeReason': [{ required: true, message: '请选择' }],
		'data.pic': [{ required: true, message: '请选择' }],
		'data.haveNew': [{ required: true, message: '请选择' }],
		'data.relatedItineraryNo': [{ required: formValidate.data.haveNew ? true : false, message: '请选择' }],
	})
);

const props = defineProps({
	// modelValue: {
	// 	type: Boolean,
	// 	default: false,
	// },
	// params: Object,
	// menuList: Array,
	itineraryId: {
		type: String,
	},
});
const emit = defineEmits(['finish']);

const apply = async () => {
	validate()
		.then(async (res) => {
			let parms: any = formValidate.data;
			parms.attachmentList = parms.pic.split(',');
			parms.itineraryId = route.currentRoute.value?.query?.id || props.itineraryId;
			console.log(parms, 'parms');
			let resP = await api.travelManagement.submitAllRevoke(parms);
			console.log(resP, 'resP');

			cancel();
			// route.push({ path: '/scenic-spot/singleVote/edit', query: { t: formValidate.data.revokeReason, s: 'new' } });
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
	resetFields();
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
