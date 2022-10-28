<template>
	<div class="hotelStar-modal-wrapper">
		<BaseModal :title="options.title" v-model="modelValue" @close="handleOk">
			<a-form :model="formValidate" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 16, offset: 1 }" labelAlign="left">
				<a-form-item label="酒店星级" name="starCode">
					<a-input v-model:value="formValidate.starCode" />
				</a-form-item>
				<a-form-item label="诚信指导价" name="price">
					<a-input type="number" v-model:value="formValidate.price" />
				</a-form-item>
				<a-form-item label="状态" name="ratedStatus">
					<a-radio-group v-model:value="formValidate.ratedStatus">
						<a-radio :value="1">启用</a-radio>
						<a-radio :value="0">禁用</a-radio>
					</a-radio-group>
				</a-form-item>
			</a-form>
			<template v-slot:footer>
				<a-button type="primary" @click="save">保存</a-button>
				<a-button @click="dialogVisible = false">取消</a-button>
			</template>
		</BaseModal>
	</div>
</template>

<script setup lang="ts">
import BaseModal from '@/components/common/BaseModal.vue';
import { Ref } from 'vue';
import { message } from 'ant-design-vue';
import { accDiv, accMul } from '@/utils/compute';
import api from '@/api';

const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	params: Object,
	methods: Object,
});

const { modelValue } = toRefs(props);
const dialogVisible = ref(false);
const emit = defineEmits(['update:modelValue', 'cancel', 'onSearch']);
const formValidate: Ref<Record<string, any>> = ref({});
const options = reactive({
	title: '新增酒店星级',
});
const rules: any = {
	starCode: [{ required: true, trigger: 'blur', message: '请输入酒店星级' }],
	price: [{ required: true, trigger: 'blur', message: '请输入最低价格，单位（元）' }],
	ratedStatus: [{ required: true, trigger: 'change', message: '请选择状态' }],
};

const save = () => {
	console.log('formValidate:', formValidate.value);
	if (props.params?.oid) {
		api
			.editHotelStarData({
				oid: formValidate.value.oid,
				price: accMul(parseInt(formValidate.value.price), 100),
				starCode: formValidate.value.starCode,
				ratedStatus: formValidate.value.ratedStatus,
			})
			.then((res: any) => {
				console.log('res:', res);
				dialogVisible.value = false;
				message.success('修改成功');
				props.methods?.success();
			})
			.catch((err: any) => {
				console.log(err);
			});
	} else {
		api
			.addHotelStarData({
				...formValidate.value,
				price: accMul(parseInt(formValidate.value.price), 100),
			})
			.then((res: any) => {
				console.log('res:', res);
				dialogVisible.value = false;
				message.success('新增成功');
				props.methods?.success();
			})
			.catch((err: any) => {
				console.log(err);
			});
	}
};

const init = async () => {
	console.log('params', props.params);
	formValidate.value = {};
	if (props.params?.oid) {
		formValidate.value = { ...props.params, price: accDiv(parseInt(props.params.price), 100) };
		options.title = '编辑酒店星级';
	} else {
		options.title = '新增酒店星级';
	}
};

watch(
	() => props.modelValue,
	async (nVal) => {
		console.log('props.modelValue->', nVal);
		dialogVisible.value = nVal;
		if (dialogVisible.value) {
			await init();
		}
	}
);

watch(dialogVisible, (nVal) => {
	console.log('dialogVisible:', nVal);
	emit('update:modelValue', nVal);
});

const handleOk = () => {
	//console.log('handleOk');
	dialogVisible.value = false;
	emit('cancel');
};
</script>

<style lang="less" scoped></style>
