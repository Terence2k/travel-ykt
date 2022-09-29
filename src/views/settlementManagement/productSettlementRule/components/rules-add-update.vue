<template>
	<BaseModal :title="options.title" v-model="modelValue">
		<a-form
			ref="formRef"
			:model="formValidate"
			:rules="rules"
			:label-col="{ span: 5 }"
			:wrapper-col="{ span: 16, offset: 1 }"
			placeholder="请选择分账单位"
		>
			<a-form-item label="分账单位" name="companyType">
				<a-select ref="select" v-model:value="formValidate.companyType" style="width: 100%">
					<a-select-option value="旅行社">旅行社</a-select-option>
					<a-select-option value="集团">集团</a-select-option>
					<a-select-option value="监理公司">监理公司</a-select-option>
					<a-select-option value="一卡通">一卡通</a-select-option>
					<a-select-option value="协会">协会</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item label="扣款模式">
				<a-radio-group v-model:value="formValidate.splitModel">
					<a-radio :value="1">价格</a-radio>
					<a-radio :value="2">百分比</a-radio>
				</a-radio-group>
			</a-form-item>
			<a-form-item label="分账金额" name="splitCount" v-if="formValidate.splitModel === 1">
				<a-input-number v-model:value="formValidate.splitCount" placeholder="请输入分账金额（单位：元）" style="width: 100%">
					<template #addonAfter>
						<span>元</span>
					</template>
				</a-input-number>
			</a-form-item>
			<a-form-item label="分账百分比" name="splitCount" v-if="formValidate.splitModel === 2">
				<a-input-number v-model:value="formValidate.splitCount" placeholder="请输入分账占比（单位：%）" style="width: 100%">
					<template #addonAfter>
						<span>%</span>
					</template>
				</a-input-number>
			</a-form-item>
			<a-form-item label="优先级" name="level">
				<a-input-number v-model:value="formValidate.level" placeholder="请输入优先级" />
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
	params: {
		type: Object,
		default: () => {
			return {};
		},
	},
	methods: Object,
});
const emit = defineEmits(['update:modelValue', 'submit']);
const options = reactive({
	title: '新增分账规则',
});
const formValidate: Ref<Record<string, any>> = ref({});

const rules: any = {
	companyType: [{ required: true, trigger: 'blur', message: '请输入分账单位' }],
	level: [{ required: true, validator: isIntegerNotMust, trigger: 'blur' }],
	priority: [{ required: true, validator: isIntegerNotMust, trigger: 'blur' }],
	splitCount: [{ required: true, validator: isBtnZeroToHundred, trigger: 'blur' }],
};
const init = async () => {
	if (props.params.add) {
		options.title = '新增分账规则';
		formValidate.value = { splitModel: 1 };
	} else {
		options.title = '编辑分账规则';
		formValidate.value = props.params.from;
	}
	console.log('params', props.params);
};
const formRef = ref();
const save = () => {
	formRef.value
		.validate()
		.then(() => {
			const params = { params: props.params, form: lodash.cloneDeep(formValidate.value) };
			emit('submit', params);
			formValidate.value = {};
			dialogVisible.value = false;
		})
		.catch((err: any) => {
			message.error('请填写完整数据');
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
	console.log('dialogVisible:', nVal);
	emit('update:modelValue', nVal);
});
</script>

<style scoped>
.ant-input-number {
	width: 100%;
}
</style>
