<template>
	<BaseModal :modelValue="modelValue" title="填写撤销重提原因" width="600px" @cancel="cancel">
		<a-form layout="vertical" :model="formValidate" :label-col="{ span: 14 }" :wrapper-col="{ span: 28, offset: 0 }" labelAlign="left">
			<a-form-item label="撤销重提原因（200字）" class="fz14" v-bind="validateInfos[`data.revokeReason`]">
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
import { Form } from 'ant-design-vue';
import api from '@/api/index';
import { useTravelStore } from '@/stores/modules/travelManagement';

const travelStore = useTravelStore();

const route = useRouter();
const modelValue = ref(false);
const useForm = Form.useForm;

const formValidate = reactive({
	data: {
		revokeReason: '',
		pic: '',
	},
});
const { resetFields, validate, validateInfos, mergeValidateInfo, scrollToField, clearValidate } = useForm(
	formValidate,
	reactive({
		'data.revokeReason': [{ required: true, message: '请选择' }],
		'data.pic': [{ required: true, message: '请选择' }],
	})
);
const rules = {
	'data.revokeReason': [{ required: true, message: '请填写撤销重提原因' }],
};
const props = defineProps({
	// modelValue: {
	// 	type: Boolean,
	// 	default: false,
	// },
	params: Object,
	// menuList: Array,
});
const emit = defineEmits(['finish']);

const apply = () => {
	validate()
		.then(async (res) => {
			let parms = formValidate.data;
			// let resP = await api.travelManagement.submitRevokeAndRecommit(parms);
			// travelStore.setRevokeParams(parms);
			revoke();
			// statusRec.value === 'REVOKE' ? '' : emit('finish');
			cancel();
			// route.push({ path: '/scenic-spot/singleVote/edit', query: { t: formValidate.data.revokeReason, s: 'new' } });
		})
		.catch((err) => {
			console.log('error', err);
		});
};

// const revokePower = async () => {
// 	let params = {
// 		itineraryId: route.currentRoute.value.query.id,
// 		touristList: travelStore.touristList,
// 	};

// 	await api.travelManagement.confirmSubmit(params);
// 	return true;
// };

const revoke = async () => {
	// let res = await revokePower();

	let oParams = await api.travelManagement.submitRevokeAndRecommits({
		itineraryId: route.currentRoute.value.query.id,
		revokeReason: formValidate.data.revokeReason,
		attachmentList: formValidate.data.pic.split(','),
	});

	const { newItineraryId } = oParams;

	route.push({
		path: '/travel/travel_manage/add_travel',
		query: { id: newItineraryId, itineraryNo: route.currentRoute.value?.query?.itineraryNo, isRevoke: 1 },
	});

	// if (res) {
	// 	const { pic, revokeReason } = travelStore.revokeParams;
	// 	let params = {
	// 		itineraryId: router.currentRoute.value.query.id,
	// 		revokeReason,
	// 		attachmentList: pic.split(','),
	// 		hotelList: [],
	// 		ticketList: [],
	// 		touristList: travelStore.touristList,
	// 	};

	// 	console.log(res, params);
	// }
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
