<template>
	<div class="verificationManage-modal-wrapper">
		<BaseModal :title="options.title" v-model="modelValue" @close="handleOk">
			<a-form :model="formValidate" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 16, offset: 1 }" labelAlign="left">
				<a-form-item label="归属景区" name="scenicSpot">
					<a-select
						v-model:value="formValidate.scenicSpot"
						class="select-scenicSpot item"
						:showArrow="true"
						:options="modalState.scenicSpotOptions"
						placeholder="请选择景区"
					>
					</a-select>
				</a-form-item>
				<a-form-item label="核销项目ID" name="writeOffId">
					<a-input v-model:value="formValidate.price" />
				</a-form-item>
				<a-form-item label="核销项目名称" name="writeOffName">
					<a-input v-model:value="formValidate.writeOffName" />
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
import api from '@/api';

const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	params: Object,
	methods: Object,
});

let scenicSpotOptionsData = [];
const modalState = reactive({
	scenicSpotOptions: ref<SelectProps['options']>(scenicSpotOptionsData),
});
const { modelValue } = toRefs(props);
const dialogVisible = ref(false);
const emit = defineEmits(['update:modelValue', 'cancel', 'onSearch']);
const formValidate: Ref<Record<string, any>> = ref({});
const options = reactive({
	title: '新增核销项目',
});
const rules: any = {
	scenicSpot: [{ required: true, trigger: 'change', message: '请输入酒店星级' }],
	writeOffId: [{ required: true, trigger: 'blur', message: '请输入核销项目ID' }],
	writeOffName: [{ required: true, trigger: 'change', message: '请输入核销项目名称' }],
};

const save = () => {
	console.log('formValidate:', formValidate.value);
	// if (props.params?.oid) {
	// 	api
	// 		.editHotelStarData({
	// 			oid: formValidate.value.oid,
	// 			price: formValidate.value.price * 100,
	// 			starCode: formValidate.value.starCode,
	// 			ratedStatus: formValidate.value.ratedStatus,
	// 		})
	// 		.then((res: any) => {
	// 			console.log('res:', res);
	// 			dialogVisible.value = false;
	// 			message.success('修改成功');
	// 			props.methods?.success();
	// 		})
	// 		.catch((err: any) => {
	// 			console.log(err);
	// 		});
	// } else {
	// 	api
	// 		.addHotelStarData(formValidate.value)
	// 		.then((res: any) => {
	// 			console.log('res:', res);
	// 			dialogVisible.value = false;
	// 			message.success('新增成功');
	// 			props.methods?.success();
	// 		})
	// 		.catch((err: any) => {
	// 			console.log(err);
	// 		});
	// }
};

const init = async () => {
	console.log('params', props.params);
	formValidate.value = {};
	if (props.params?.oid) {
		formValidate.value = { ...props.params };
		options.title = '编辑核销项目';
	} else {
		options.title = '新增核销项目';
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
	dialogVisible.value = false;
	emit('cancel');
};
</script>

<style lang="less" scoped></style>
