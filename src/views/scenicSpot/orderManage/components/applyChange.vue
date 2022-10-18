<template>
	<BaseModal :modelValue="modelValue" title="申请改刷" @cancel="cancel">
		<div class="form-wrap">
			<a-form ref="formRef" :rules="formRules" :model="formValidate.data" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" labelAlign="left">
				<a-form-item label="当前核销人数"> 20 </a-form-item>
				<a-form-item label="申请人数">
					<a-input v-model:value="formValidate.data.applyNum" placeholder="请输入正确数量" />
				</a-form-item>
				<a-form-item label="改刷凭证"> 20 </a-form-item>
			</a-form>
		</div>
		<template v-slot:footer>
			<div class="footer-wrapper">
				<a-button type="primary" @click="apply">申请</a-button>
				<a-button @click="cancel">取消</a-button>
			</div>
		</template>
	</BaseModal>
</template>

<script lang="ts" setup>
import BaseModal from '@/components/common/BaseModal.vue';
import api from '@/api';

import dayjs, { Dayjs } from 'dayjs';

const modelValue = ref(false);
const route = useRouter();
const formValidate = reactive({
	data: {
		ticketId: '',
		ticketType: 'UNITE',
		downReason: '',
		applyNum: null,
		dateList: [{ startDateTime: '', endDateTime: '', time: [] }],
	},
});
const formRef = ref();
const formRules: any = {
	time: [{ required: true, message: '请选择时间' }],
	downReason: [{ required: true, message: '请填写' }],
};
const props = defineProps({
	// modelValue: {
	// 	type: Boolean,
	// 	default: false,
	// },
	// params: Object,
	// menuList: Array,
});

const addTimeList = () => {
	formValidate.data.dateList.push({ time: [] });
};

const del = (index: number) => {
	formValidate.data.dateList.splice(index, 1);
};
const apply = () => {
	formRef.value
		.validateFields()
		.then(async (res) => {
			let params = formValidate.data;
			params.dateList.map((i) => {
				i.startDateTime = i.time[0];
				i.endDateTime = i.time[1];
				delete i.time;
				return i;
			});
			console.log(res, params);
			// let apiRes = api.scenicTicketDown(params);
			console.log(apiRes, 'apiRes');
		})
		.catch((err: any) => {
			console.log(err);
		});
};
const toHistoryPage = () => {
	route.push('/scenic-spot/sold-out-history');
};
// 打开弹窗
const open = (id) => {
	modelValue.value = true;
	formValidate.data.ticketId = id;
};
// 关闭弹窗
const cancel = () => {
	modelValue.value = false;
	formRef.value.resetFields();
	formValidate.data.dateList = [{ startDateTime: '', endDateTime: '', time: [] }];
	console.log(modelValue.value, 'modelValue');
};

defineExpose({
	open,
	close,
});
// const emit = defineEmits(['update:modelValue', 'cancel', 'onSearch']);
</script>

<style lang="scss" scoped></style>
