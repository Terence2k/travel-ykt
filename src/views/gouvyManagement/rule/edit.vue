<template>
	<div class="table-area">
		<BaseModal :title="state.title" v-model="dialogVisible" :width="600" @close="handleOk">
			<a-form ref="formRef" :model="formValidate" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 16, offset: 1 }" labelAlign="left">
				<a-form-item label="规则名称" name="ruleName">
					<a-input v-model:value="formValidate.ruleName" placeholder="请输入规则名称" />
				</a-form-item>
				<a-form-item label=" 减免模式" name="discountType">
					<a-select ref="select" placeholder="请选择特殊证件类型" v-model:value="formValidate.discountType">
						<a-select-option :value="0">游客年龄</a-select-option>
						<a-select-option :value="1">特殊证件</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item label=" 减免模式内容" name="age1" v-if="formValidate.discountType == '0'">
					<a-row>
						<a-col :span="6">
							<a-input
								class="input"
								placeholder="请输入年龄"
								oninput="value=value.replace(/^(0+)|[^\d]+/g,'')"
								v-model:value="formValidate.age1"
							></a-input>
						</a-col>
						<a-col :span="4">
							<a-span class="d-span">至</a-span>
						</a-col>
						<a-col :span="6">
							<a-form-item name="age2">
								<a-input
									class="input"
									placeholder="请输入年龄"
									oninput="value=value.replace(/^(0+)|[^\d]+/g,'')"
									v-model:value="formValidate.age2"
								></a-input>
							</a-form-item>
						</a-col>
					</a-row>
				</a-form-item>
				<a-form-item label=" 减免模式内容" name="discountConditionName" v-if="formValidate.discountType == '1'">
					<a-select ref="select" placeholder="请选择特殊证件类型" allowClear class="select" v-model:value="formValidate.discountConditionName">
						<a-select-option v-for="item in state.tableData.list" :value="item.codeValue">
							{{ item.name }}
						</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item label=" 减免折扣" name="discount">
					<a-input
						v-model:value="formValidate.discount"
						placeholder="请输入折扣信息(1~99)的整数"
						oninput="value=value.replace(/^(0+)|[^\d]+/g,'')"
						@change="check"
					/>
				</a-form-item>
				<a-form-item label=" 状态" name="discountRuleStatus">
					<a-radio-group v-model:value="formValidate.discountRuleStatus" name="discountRuleStatus">
						<a-radio :value="1">启用</a-radio>
						<a-radio :value="0">禁用</a-radio>
					</a-radio-group>
				</a-form-item>
			</a-form>
			<template v-slot:footer>
				<a-button type="primary" @click="save">保存</a-button>
				<a-button @click="cancel">取消</a-button>
			</template>
		</BaseModal>
	</div>
</template>

<script setup lang="ts">
import { ref, Ref, computed, watch, toRefs, reactive } from 'vue';
import { useRouter } from 'vue-router';
import CommonTable from '@/components/common/CommonTable.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import BaseModal from '@/components/common/BaseModal.vue';
import { message } from 'ant-design-vue';
import type { FormInstance } from 'ant-design-vue';
import api from '@/api';
import { accDiv, accMul } from '@/utils/compute';
import { isOnedecimalpoint } from '@/utils/validator';
const route = useRouter();
const dialogVisible = ref(false);
const navigatorBar = useNavigatorBar();
const formValidate: Ref<Record<string, any>> = ref({});
const formRef = ref();
// import { userList } from '@/api';
const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	params: Object,
});
const emit = defineEmits(['update:modelValue', 'cancel', 'onSearchList']);
const rules: any = {
	ruleName: [{ required: true, trigger: 'blur', message: '请输入规则名称' }],
	discountType: [{ required: true, trigger: 'blur', message: '请选择减免模式' }],
	age1: [{ required: true, trigger: 'blur', message: '请填写减免模式内容' }],
	age2: [{ required: true, trigger: 'blur', message: '请填写减免模式内容' }],
	discountConditionName: [{ required: true, trigger: 'blur', message: '请填写减免模式内容' }],
	discount: [{ required: true, trigger: 'blur', message: '请输入1-99之间的整数' }],
	discountRuleStatus: [{ required: true, trigger: 'blur', message: '请选择状态' }],
};
const state = reactive({
	tableData: {
		data: [],
		list: [],
		total: 400,
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
		},
		age: [],
		age1: '',
		age2: '',
	},
	title: '',
	operationModal: {
		isApplydate: false,
		isExaminedate: false,
	},
});
const auditRef = ref();
const init = async () => {
	if (props.params?.oid) {
		state.title = '编辑减免规则';
		formValidate.value = { ...props.params };
		if (formValidate.value.discountType == 0) {
			state.tableData.age = formValidate.value.discountCondition.split('~');
			formValidate.value.age1 = state.tableData.age[0];
			formValidate.value.age2 = state.tableData.age[1];
		} else {
			formValidate.value.discountConditionName = '';
		}
		formValidate.value.discount = formValidate.value.discount;
		console.log(formValidate.value, 'formValidate.value');
	} else {
		state.title = '新增减免规则';
	}
	// formValidate.value = {};
	// formValidate.value = { ...props.params };
};
//查询证件列表
const dropDownQueryList = () => {
	api.dropDownQueryList('SPECIAL_CERTIFICATE_TYPE').then((res) => {
		state.tableData.list = res;
	});
};
const cancel = () => {
	formRef.value.resetFields();
	dialogVisible.value = false;
};
const updateRule = () => {
	formRef.value
		.validateFields()
		.then((i) => {
			let data = {
				oid: formValidate.value.oid,
				ruleName: formValidate.value.ruleName,
				discountType: formValidate.value.discountType,
				discountCondition: '',
				discount: Number(formValidate.value.discount),
				discountRuleStatus: formValidate.value.discountRuleStatus,
			};
			if (formValidate.value.discountType == 0) {
				data.discountCondition = formValidate.value.age1 + '~' + formValidate.value.age2;
			} else {
				data.discountCondition = formValidate.value.discountConditionName;
			}
			api.update(data).then(() => {
				message.success('编辑成功');
				emit('onSearchList');
				cancel();
			});
		})
		.catch((info: any) => {
			console.log('Validate Failed:', info);
		});
};
const addRule = () => {
	formRef.value
		.validateFields()
		.then((i) => {
			let data = {
				ruleName: formValidate.value.ruleName,
				discountType: formValidate.value.discountType,
				discountCondition: '',
				discount: Number(formValidate.value.discount),
				discountRuleStatus: formValidate.value.discountRuleStatus,
			};
			if (formValidate.value.discountType == 0) {
				data.discountCondition = formValidate.value.age1 + '~' + formValidate.value.age2;
			} else {
				data.discountCondition = formValidate.value.discountConditionName;
			}
			api.add(data).then(() => {
				message.success('添加成功');
				emit('onSearchList');
				cancel();
			});
		})
		.catch((info: any) => {
			console.log('Validate Failed:', info);
		});
};
const save = () => {
	if (state.title == '编辑减免规则') {
		updateRule();
	} else {
		addRule();
	}
};
const check = () => {
	if (Number(formValidate.value.discount) >= 100) {
		formValidate.value.discount = 99;
	}
};
watch(
	() => props.modelValue,
	async (nVal) => {
		dialogVisible.value = nVal;
		if (dialogVisible.value) {
			await init();
			dropDownQueryList();
		}
	}
);

watch(dialogVisible, (nVal) => {
	emit('update:modelValue', nVal);
});
</script>

<style lang="less" scoped>
.input {
	// margin-left: -6px;
	width: 100px;
}
.d-span {
	margin-left: 28px;
	line-height: 32px;
}
.select {
	// margin-left: -6px;
	width: 367px;
}
.discountType {
}
</style>
