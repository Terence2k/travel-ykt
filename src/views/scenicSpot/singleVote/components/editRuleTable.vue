<template>
	<div class="wrapper">
		<CommonTable :dataSource="tableList" :columns="columnsCount" :scrollY="false" bordered class="left">
			<template #bodyCell="{ column, record, index }">
				<!-- <template v-if="column.key === 'certifId'">
					{{ certifIdList(record.certifId) }}
				</template> -->
				<template v-if="column.key === 'discount'">
					<span v-if="typeof record.discount == 'number' && record.discount">{{ record.discount * 10 }}%</span>
					<span v-else-if="record.discount === 0"> 0</span>
					<span v-else> --</span>
				</template>
				<template v-if="column.key === 'discountPrice'">
					<span v-if="typeof record.discountPrice == 'number' && record.discountPrice">{{ record.discountPrice / 100 }}</span>
					<span v-else-if="record.discountPrice === 0"> 0</span>
					<span v-else> --</span>
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
			<a-form :rules="rules" ref="formRef" :model="formValidate" :label-col="{ span: 4 }" :wrapper-col="{ span: 12, offset: 1 }" labelAlign="left">
				<a-form-item label="规则名称" class="fz14" name="ruleName">
					<a-input v-model:value="formValidate.ruleName" placeholder="规则名称" />
				</a-form-item>
				<!-- <a-form-item label="选择必选项" class="fz14" v-bind="validateInfos.certifId">
					<a-checkbox-group v-model:value="formValidate.certifId" :options="options" />
				</a-form-item> -->

				<a-radio-group v-model:value="typeCheck" :wrapper-col="{ span: 12, offset: 1 }">
					<a-radio :style="radioStyle" :value="1">折扣减免</a-radio>

					<a-radio :style="radioStyle" :value="2">折扣后价格</a-radio>
				</a-radio-group>

				<a-form-item label="折扣" v-if="typeCheck === 1" class="fz14" name="discount">
					<a-input-number v-model:value="formValidate.discount" :controls="false" placeholder="折扣" />
				</a-form-item>
				<a-form-item label="折后价(元)" v-if="typeCheck === 2" class="fz14" name="discountPrice">
					<a-input-number min="0" :controls="false" v-model:value="formValidate.discountPrice" placeholder="折后价(元)" />
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
const typeCheck = ref(1);
const radioStyle = reactive({
	// display: 'flex',
	// height: '30px',
	lineHeight: '30px',
});
// const certifIdType = { 140: '学生证', 141: '军官证', 142: '医护证', 143: '教师资格证', 144: '导游证', 145: '导游证' };

// const certifIdList = (certifId: any) => {
// 	if (certifId) {
// 		let all = '',
// 			len = certifId.length;
// 		console.log(props.tableList);

// 		certifId.map((i, index) => {
// 			all += certifIdType[i];

// 			if (index < len - 1) all += ',';
// 			return i;
// 		});
// 		return all;
// 	} else {
// 		return '';
// 	}
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
	discountPrice: null,
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
		title: '折后价(元)',
		dataIndex: 'discountPrice',
		key: 'discountPrice',
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
	formRef.value.resetFields();
};
const formRef = ref();

const apply = () => {
	formRef.value
		.validate()
		.then((res) => {
			cancel();
			formRef.value.resetFields();
			let resValue = toRaw(res);
			console.log(formValidate, res, resValue);
			if (typeof resValue.discountPrice === 'number') {
				resValue.discountPrice = Number((Number(resValue.discountPrice.toFixed(2)) * 100).toFixed(2));
				resValue.discount = null;
			} else {
				resValue.discountPrice = null;
			}
			emits('add-rule-obj', resValue);
		})
		.catch((err) => {
			console.log('error', err);
		});
};
const rules = reactive({
	// certifId: [{ required: true, message: '请选择类型' }],
	discountPrice: [{ required: true, message: '请输入数字' }],
	discount: [{ required: true, message: '请输入0-10', pattern: /^([0-9]|10)$/ }],
	ruleName: [{ required: true, message: '请填写' }],
});

// 表单
// const { resetFields, validate, validateInfos } = useForm(
// 	formValidate,
// 	reactive({
// 		// certifId: [{ required: true, message: '请选择类型' }],
// 		discountPrice: [{ required: typeCheck.value == 2 ? true : false, message: '请输入数字' }],
// 		// discount: [{ required: typeCheck.value == 1 ? true : false, message: '请输入0-10', pattern: /^([0-9]|10)$/ }],
// 		ruleName: [{ required: true, message: '请填写' }],
// 	})
// );

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
	margin: 0 0px 0 0;
	padding: 0;
}
.btn {
	position: absolute;
	right: -126px;
	bottom: -10px;
	margin-bottom: 10px;
	// top: 12px;
}
</style>
