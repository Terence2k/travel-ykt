<template>
	<div class="verificationManage-modal-wrapper">
		<BaseModal :title="options.title" v-model="dialogVisible" @close="handleOk">
			<a-form :model="formValidate" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 16, offset: 1 }" labelAlign="left">
				<a-form-item label="归属景区" name="scenicId">
					<a-select
						v-model:value="formValidate.scenicId"
						class="select-scenicSpot item"
						:showArrow="true"
						:options="modalState.scenicSpotOptions"
						placeholder="请选择景区"
					>
					</a-select>
				</a-form-item>
				<a-form-item label="核销项目ID" name="oid">
					<a-input :disabled="true" v-if="props.params?.oid" v-model:value="formValidate.oid" />
					<template v-else>
						<a-input :disabled="true" placeholder="系统自动生成" v-model:value="formValidate.oid" />
					</template>
				</a-form-item>
				<a-form-item label="核销项目名称" name="itemName">
					<a-input v-model:value="formValidate.itemName" />
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

let scenicSpotOptionsData = ref([]);
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
	scenicId: [{ required: true, trigger: 'change', message: '请输入酒店星级' }],
	oid: [{ required: true, trigger: 'blur', message: '请输入核销项目ID' }],
	itemName: [{ required: true, trigger: 'change', message: '请输入核销项目名称' }],
};

const save = () => {
	console.log('formValidate:', formValidate.value);
	if (!formValidate.value?.oid) {
		formValidate.value = {
			...formValidate.value,
			oid: null,
		};
	}
	api
		.editWriteOffItem(formValidate.value)
		.then((res: any) => {
			console.log('res:', res);
			dialogVisible.value = false;
			if (formValidate.value?.oid) {
				message.success('编辑成功');
			} else {
				message.success('新增成功');
			}

			props.methods?.success();
		})
		.catch((err: any) => {
			console.log(err);
		});
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
		api.getViewList().then((res) => {
			console.log(res);
			scenicSpotOptionsData.value = res.map((item) => {
				return {
					value: item.ticketId,
					label: item.ticketName,
				};
			});
			const targetId = formValidate?.value?.scenicId;
			const targetName = formValidate?.value?.scenicName;
			console.log('景区id为：', targetId);
			if (scenicSpotOptionsData?.value?.find((item) => item.value == targetId)) {
				console.log('找到目标景区id，无需多余操作');
			} else {
				console.log('找不到目标景区id，自动补上');
				if (targetId) {
					scenicSpotOptionsData.value.push({
						value: targetId,
						label: targetName,
					});
				}
			}

			//当只有一个景区时，默认选择该景区
			if (scenicSpotOptionsData?.value?.length === 1) {
				formValidate.value.scenicId = scenicSpotOptionsData.value[0]?.value;
			}
		});
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
