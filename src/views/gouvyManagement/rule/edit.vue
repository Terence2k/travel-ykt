<template>
	<div class="table-area">
		<BaseModal :title="state.title" v-model="modelValue" :width="600">
			<a-form ref="formRef" model="formValidate" rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 16, offset: 1 }" labelAlign="left">
				<a-form-item label="规则名称" name="username">
					<a-input v-model:value="formValidate.age" placeholder="请输入规则名称" />
				</a-form-item>
				<a-form-item label=" 减免模式" name="account">
					<a-select ref="select" placeholder="请选择特殊证件类型" v-model:value="state.tableData.pattern">
						<a-select-option value="1">游客年龄</a-select-option>
						<a-select-option value="2">特殊证件</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item name="account">
					<a-row v-if="state.tableData.pattern == '1'">
						<a-col :span="8"></a-col>
						<a-col :span="6">
							<a-input class="input" placeholder="请输入年龄"></a-input>
						</a-col>
						<a-col :span="4">
							<a-span class="d-span">至</a-span>
						</a-col>
						<a-col :span="6">
							<a-input class="input" placeholder="请输入年龄"></a-input>
						</a-col>
					</a-row>
					<a-row v-if="state.tableData.pattern == '2'">
						<a-col :span="8"></a-col>
						<a-col :span="8">
							<a-select ref="select" placeholder="请选择特殊证件类型" class="select">
								<a-select-option value="0">1</a-select-option>
								<a-select-option value="1">2</a-select-option>
								<a-select-option value="2">3</a-select-option>
							</a-select>
						</a-col>
						<a-col :span="8"> </a-col>
					</a-row>
				</a-form-item>
				<a-form-item label=" 减免折扣" name="account">
					<a-input v-model:value="formValidate.address3" placeholder="请输入折扣信息(0~0.99)" />
				</a-form-item>
				<a-form-item label=" 状态" name="account">
					<a-radio-group v-model:value="state.tableData.status" name="radioGroup">
						<a-radio value="1">启用</a-radio>
						<a-radio value="2">禁用</a-radio>
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
const route = useRouter();
const dialogVisible = ref(false);
const navigatorBar = useNavigatorBar();
const formValidate: Ref<Record<string, any>> = ref({});
// import { userList } from '@/api';
const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	params: Object,
});
const emit = defineEmits(['update:modelValue', 'cancel', 'onSearch']);
const state = reactive({
	tableData: {
		data: [],
		total: 400,
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
		},
		status: '1',
		pattern: '1',
	},
	title: '',
	operationModal: {
		isApplydate: false,
		isExaminedate: false,
	},
});
const auditRef = ref();
const init = async () => {
	console.log('params', props.params);
	if (props.params?.key) {
		state.title = '编辑减免规则';
		formValidate.value = { ...props.params };
	} else {
		state.title = '新增减免规则';
	}
	// formValidate.value = {};
	// formValidate.value = { ...props.params };
};
const cancel = () => {
	dialogVisible.value = false;
};
const save = () => {
	if (state.title == '编辑减免规则') {
		message.success('编辑成功');
	} else {
		message.success('添加成功');
	}
	cancel();
};
watch(
	() => props.modelValue,
	async (nVal) => {
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

<style lang="less" scoped>
.input {
	margin-left: -6px;
	width: 100px;
}
.d-span {
	margin-left: 20px;
	line-height: 32px;
}
.select {
	margin-left: -6px;
	width: 367px;
}
</style>
