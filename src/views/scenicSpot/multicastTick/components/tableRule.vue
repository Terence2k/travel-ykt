<template>
	<div class="wrapper">
		<CommonTable :dataSource="tableList" :columns="columnsCount" :scrollY="false" bordered class="left">
			<template #bodyCell="{ column, record, index }">
				<!-- <template v-if="column.key === 'certifId'">
					{{ certifIdList(record.certifId) }}
				</template> -->
				<template v-if="column.key === 'discount'">
					<span v-if="record.discount">{{ record.discount * 10 }} %</span>
				</template>
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a href="javascript:;" @click="del(index)">删除</a>
					</div>
				</template>
			</template>
		</CommonTable>
		<a-button type="primary" class="btn" @click="CreateData"> 新增减免规则</a-button>
		<BaseModal :modelValue="modelValue" title="设置减免规则" width="600px" @cancel="cancel">
			<a-form :model="formValidate" :label-col="{ span: 3 }" :wrapper-col="{ span: 12, offset: 1 }" labelAlign="left">
				<a-form-item label="规则名称" class="fz14" v-bind="validateInfos.ruleName">
					<a-input v-model:value="formValidate.ruleName" placeholder="规则名称" />
				</a-form-item>
				<!-- <a-form-item label="选择必选项" class="fz14" v-bind="validateInfos.certifId">
					<a-checkbox-group v-model:value="formValidate.certifId" :options="options" />
				</a-form-item> -->
				<a-form-item label="折扣" class="fz14" v-bind="validateInfos.discount">
					<!-- <a-input v-model:value="formValidate.discount" /> -->
					<a-input-number v-model:value="formValidate.discount" placeholder="折扣" />
				</a-form-item>
			</a-form>
			<template v-slot:footer>
				<a-button type="primary" @click="apply" style="width: 100px">保存</a-button>
				<a-button @click="cancel">取消</a-button>
			</template>
		</BaseModal>
		<DelModal :params="{ title: '删除', content: '是否确定该条数据' }" v-model="delShow" @submit="delSubmit" @cancel="delCancel" />
	</div>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
import BaseModal from '@/components/common/BaseModal.vue';
import DelModal from '@/components/common/DelModal.vue';

import { Form } from 'ant-design-vue';

import api from '@/api';
import { message } from 'ant-design-vue';

// 数据
const props = defineProps({
	tableList: {
		type: Array,
		default: () => [],
		require: true,
	},
	// params: Object,
	// tableList: Array,
});
const route = useRouter();

// const certifIdType = { 140: '学生证', 141: '军官证', 142: '医护证', 143: '教师资格证', 144: '导游证', 145: '导游证' };

// const certifIdList = (certifId: array) => {
// 	let all = '',
// 		len = certifId.length || 0;
// 	console.log(props.tableList);

// 	certifId.map((i, index) => {
// 		all += certifIdType[i];

// 		if (index < len - 1) all += ',';
// 		return i;
// 	});
// 	return all;
// };
// const options = [
// 	{ label: '学生证', value: 140 },
// 	{ label: '军官证', value: 141 },
// 	{ label: '医护证', value: 142 },
// 	{ label: '教师资格证', value: 143 },
// 	{ label: '导游证', value: 144 },
// 	{ label: '导游证', value: 145 },
// ];
const useForm = Form.useForm;
// 新增减免规则
const formValidate = reactive({
	// certifId: [],
	discount: null,
	ruleName: '',
});

const columnsCount = ref([
	{
		title: '减免规则',
		dataIndex: 'ruleName',
		key: 'ruleName',
		width: 200,
	},
	// {
	// 	title: '证件类型',
	// 	dataIndex: 'certifId',
	// 	key: 'certifId',
	// 	width: 200,
	// },
	{
		title: '折扣',
		dataIndex: 'discount',
		key: 'discount',
		width: 200,
	},
	{
		title: '操作',
		key: 'action',
		width: 200,
	},
]);
// 删除提示
const delShow = ref(false);
const delIndex = ref<null | number>();
const emits = defineEmits(['del-rule-obj', 'add-rule-obj']);
const del = (index: number) => {
	// emits('del-rule-obj', index);
	delShow.value = true;
	delIndex.value = index;
};
const delSubmit = () => {
	emits('del-rule-obj', toRaw(delIndex.value));
	delCancel();
};
const delCancel = () => {
	delShow.value = false;
	delIndex.value = null;
};
const modelValue = ref(false);
const CreateData = () => {
	modelValue.value = true;
};

const cancel = () => {
	modelValue.value = false;
	resetFields();
};

const apply = () => {
	validate()
		.then((res) => {
			cancel();
			resetFields();
			console.log(formValidate, res);

			emits('add-rule-obj', toRaw(res));
		})
		.catch((err) => {
			console.log('error', err);
		});
};
// 表单
const { resetFields, validate, validateInfos, mergeValidateInfo, scrollToField } = useForm(
	formValidate,
	reactive({
		// certifId: [{ required: true, message: '请选择类型' }],
		discount: [{ required: true, message: '请输入0-10', pattern: /^([0-9]|10)$/ }],
		ruleName: [{ required: true, message: '请填写' }],
	})
);

onMounted(() => {});
</script>

<style scoped lang="less">
.wrapper {
	position: relative;
	// width: 100%;
	display: flex;
	align-items: flex-end;
	.left {
		flex: 1;
	}
	.btn {
		position: absolute;
		right: -126px;
		bottom: -10px;
		margin-bottom: 10px;
		// top: 12px;
	}
}
.table-area {
	// margin: 0 10px 0 0;
	padding: 0;
}
</style>
