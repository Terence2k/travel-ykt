<template>
	<BaseModal :title="options.title" v-model="dialogVisible">
		<a-form
			ref="formRef"
			:model="formValidate"
			:rules="rules"
			:label-col="{ span: 5 }"
			:wrapper-col="{ span: 16, offset: 1 }"
			placeholder="请选择分账单位"
		>
			<a-form-item label="分账名称" name="splitName">
				<a-input v-model:value="formValidate.splitName" placeholder="请输入分账名称" />
			</a-form-item>
			<a-form-item label="分账单位" name="companyType">
				<a-select
					ref="select"
					v-model:value="formValidate.companyType"
					style="width: 100%"
					:options="generaRulesOptions.prepaidCompanyList.map((item) => ({ value: item.codeValue, label: item.name }))"
				>
				</a-select>
			</a-form-item>
			<a-form-item label="扣款模式">
				<a-radio-group v-model:value="formValidate.splitModel">
					<a-radio v-for="item in state.chargeModelList" :value="item.value" :key="item.name">{{ item.name }}</a-radio>
				</a-radio-group>
			</a-form-item>
			<a-form-item label="分账金额" v-if="formValidate.splitModel === 2" name="splitCount" :rules="rules.money">
				<a-input-number v-model:value="formValidate.splitCount" placeholder="请输入分账金额（单位：元）" style="width: 100%" :min="0">
					<template #addonAfter>
						<span>元</span>
					</template>
				</a-input-number>
			</a-form-item>
			<a-form-item
				label="分账百分比"
				v-if="formValidate.splitModel === 1"
				name="splitCount"
				:rules="[{ required: formValidate.splitModel === 1 ? true : false, validator: isBtnZeroToHundred, trigger: 'blur' }]"
			>
				<a-input-number v-model:value="formValidate.splitCount" placeholder="请输入分账占比（单位：%）" style="width: 100%" :min="0">
					<template #addonAfter>
						<span>%</span>
					</template>
				</a-input-number>
			</a-form-item>
			<a-form-item label="优先级" name="level">
				<a-input-number v-model:value="formValidate.level" placeholder="请输入优先级" :min="0" />
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
import { isIntegerNotMust, isBtnZeroToHundred, isTwoDecimalPlaces } from '@/utils/validator';
import { Ref } from 'vue';
import lodash from 'lodash';
import { message } from 'ant-design-vue';
import { useGeneraRules } from '@/stores/modules/generaRules';
const generaRulesOptions = useGeneraRules();
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
const { modelValue } = toRefs(props);
const state = reactive({
	chargeModelList: [
		{ value: 1, name: '百分比' },
		{ value: 2, name: '价格' },
	],
});
const emit = defineEmits(['update:modelValue', 'submit']);
const options = reactive({
	title: '新增分账规则',
});
const formValidate: Ref<Record<string, any>> = ref({});

const rules: any = {
	splitName: [{ required: true, trigger: 'blur', message: '请输入分账名称' }],
	companyType: [{ required: true, trigger: 'blur', message: '请输入分账单位' }],
	level: [{ required: true, validator: isIntegerNotMust, trigger: 'blur' }],
	priority: [{ required: true, validator: isIntegerNotMust, trigger: 'blur' }],
	// splitCount: [{ required: true }],
	splitModel: [{ required: true, message: '请选择', trigger: 'blur' }],
	// // 百分比
	// percentage: [{ required: formValidate.value.splitModel === 1 ? true : false, validator: isBtnZeroToHundred, trigger: 'blur' }],
	// // 人数和金额
	// integer: [{ required: formValidate.value.splitModel === 2 ? true : false, validator: isIntegerNotMust, trigger: 'blur' }],
	money: [{ required: true, validator: isTwoDecimalPlaces, trigger: 'blur' }],
};
const splitList = ref([]);
const init = async () => {
	generaRulesOptions.getPrepaidCompanyList();
	if (props.params.add) {
		options.title = '新增分账规则';
		formValidate.value = { splitModel: 1 };
	} else {
		options.title = '编辑分账规则';
		formValidate.value = props.params.from;
		if (props.params.from.splitModel === 2) {
			formValidate.value.splitCount = Number(props.params.from.splitCount) / 100;
		}
	}
	splitList.value = props.params.splitList;
	console.log('params', props.params);
};
const formRef = ref();
const save = () => {
	formRef.value
		.validate()
		.then(() => {
			if (!exceeding100()) {
				return;
			}
			// 价格 * 100
			if (formValidate.value.splitModel === 2) {
				formValidate.value.splitCount = formValidate.value.splitCount * 100;
			}
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
// 同一优先级下超出100判断
const exceeding100 = () => {
	// 优先级对象
	const priority: any = {};
	// 如果本身是半分比则添加上
	if (Number(formValidate.value.splitModel) === 1) {
		priority[formValidate.value.level] = formValidate.value.splitCount;
	}
	if (splitList.value && splitList.value.length) {
		for (let index = 0; index < splitList.value.length; index++) {
			const k = splitList.value[index];
			if (Number(k.splitModel) === 1) {
				if (priority[k.level]) {
					priority[k.level] = priority[k.level] + k.splitCount;
				} else {
					priority[k.level] = k.splitCount;
				}
			}
		}
	}
	for (const key in priority) {
		if (priority[key] > 100) {
			message.error(`优先级为${key}的百分比已经超出100%`);
			return false;
		}
	}
	return true;
};
</script>

<style scoped>
.ant-input-number {
	width: 100%;
}
</style>
