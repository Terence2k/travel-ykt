<template>
	<BaseModal :title="options.title" v-model="dialogVisible">
		<a-form
			ref="formRef"
			:model="formValidate"
			:rules="rules"
			:label-col="{ span: 5 }"
			:wrapper-col="{ span: 16, offset: 1 }"
		>
			<a-form-item label="结算方" required>
				<span>{{ formValidate.type }}</span>
			</a-form-item>
			<a-form-item label="实际结算费用（元）" name="price">
				<a-input v-model:value="formValidate.price" placeholder="请输入金额（单位：元）" style="width: 100%">
					<template #addonAfter>
						<span>元</span>
					</template>
				</a-input>
			</a-form-item>
		</a-form>
		<template v-slot:footer>
			<a-button type="primary" @click="save">保存</a-button>
			<a-button @click="dialogVisible = false">取消</a-button>
		</template>
	</BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '@/components/common/BaseModal.vue';
import { isIntegerNotMust, isBtnZeroToHundred } from '@/utils/validator';
import { Ref } from 'vue';
import lodash from 'lodash';
import { message } from 'ant-design-vue';
const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	params: Object,
	methods: Object,
});
const emit = defineEmits(['update:modelValue', 'submit']);
const options = reactive({
	title: '调整费用',
});
const formValidate: Ref<Record<string, any>> = ref({});

const rules: any = {
	price: [{ required: true, validator: isIntegerNotMust, }],
};
const init = async () => {
	formValidate.value = props.params.from;
	
};
const formRef = ref();
const save = () => {
	formRef.value
		.validate()
		.then((result: any) => {
			const params = { params: props.params, form: lodash.cloneDeep(formValidate.value) };
			emit('submit', params);
			formValidate.value = {};
			dialogVisible.value = false;
		})
		.catch((err: any) => {
			// message.error('请填写完整数据');
			console.log('error', err);
		});
};
const dialogVisible = ref(false);
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
	emit('update:modelValue', nVal);
});
</script>

<style scoped>
.ant-input-number {
	width: 100%;
}
</style>
