<template>
	<div class="systemRoomType-modal-wrapper">
		<BaseModal :title="options.title" v-model="modelValue" @close="handleOk">
			<a-form :model="formValidate" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 16, offset: 1 }" labelAlign="left">
				<a-form-item label="系统房型" name="sysRoomTypeName">
					<a-input v-model:value="formValidate.sysRoomTypeName" />
				</a-form-item>
				<a-form-item label="最多入住人数" name="roomOccupancyNum">
					<a-input type="number" v-model:value="formValidate.roomOccupancyNum" />
				</a-form-item>
				<a-form-item label="状态" name="sysRoomTypeStatus">
					<a-radio-group v-model:value="formValidate.sysRoomTypeStatus">
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
	title: '新增系统房型',
});
const rules: any = {
	sysRoomTypeName: [{ required: true, trigger: 'blur', message: '请输入系统房型' }],
	roomOccupancyNum: [{ required: true, trigger: 'blur', message: '请输入最多入住人数' }],
	sysRoomTypeStatus: [{ required: true, trigger: 'change', message: '请选择状态' }],
};

const save = () => {
	console.log('formValidate:', formValidate.value);
	if (props.params?.oid) {
		api
			.editSystemRoomType({
				oid: formValidate.value.oid,
				...formValidate.value,
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
			.addSystemRoomType(formValidate.value)
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
		formValidate.value = { ...props.params };
		options.title = '编辑系统房型';
	} else {
		options.title = '新增系统房型';
		formValidate.value.sysRoomTypeStatus = 1;
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
