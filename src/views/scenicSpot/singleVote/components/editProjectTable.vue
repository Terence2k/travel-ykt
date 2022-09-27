<template>
	<div class="wrapper">
		<BaseModal :modelValue="modelValue" title="关联核销项目" width="600px" @cancel="cancel">
			<a-form :model="formValidate" :label-col="{ span: 3 }" :wrapper-col="{ span: 12, offset: 1 }" labelAlign="left">
				<a-form-item label="核销项目" class="fz14" v-bind="validateInfos.proj">
					<a-select
						v-model:value="formValidate.proj"
						mode="multiple"
						style="width: 100%"
						placeholder="请选择"
						:options="options"
						@change="handleChange"
					></a-select>
				</a-form-item>
			</a-form>
			<template v-slot:footer>
				<a-button type="primary" @click="apply" style="width: 100px">保存</a-button>
				<a-button @click="cancel">取消</a-button>
			</template>
		</BaseModal>
		<div class="inner-wrapper">
			<CommonTable :dataSource="tableList" :columns="type === '2' ? columns : column" :scrollY="false" bordered class="left">
				<template #bodyCell="{ column, record, index }">
					<template v-if="column.key === 'itemId'">
						{{ itemNameCompute(record.itemId) }}
					</template>
					<template v-if="column.key === 'verificationNumber'">
						<a-input v-model:value="record.verificationNumber" placeholder="可核销次数" />
					</template>
					<template v-if="column.key === 'ifVerification'">
						{{ record.verificationNumber ? '是' : '否' }}
					</template>
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a href="javascript:;" @click="del(index)">删除</a>
						</div>
					</template>
				</template>
			</CommonTable>
			<a-button type="primary" class="btn" v-show="type === '2'" @click="CreateData"> 关联核销项目</a-button>
		</div>

		<span style="color: #c8c9cc" v-show="type === '2'">
			<span style="color: red">*</span>其中，非必核销项目数量为{{ ifVerificationNum }}项，可核销总数（不包括必核销项）不超过{{ times }} 次</span
		>
	</div>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
import BaseModal from '@/components/common/BaseModal.vue';
import { Form } from 'ant-design-vue';

import api from '@/api';
import { message } from 'ant-design-vue';

const route = useRouter();

const type = computed(() => {
	return route.currentRoute.value?.query?.t;
});
const useForm = Form.useForm;

const props = defineProps({
	tableList: {
		type: Array,
		default: () => [],
		require: true,
	},
	// params: Object,
	// tableList: Array,
});
//总数
const ifVerificationNum = computed(() => {
	let res = props.tableList.filter((i) => !i.ifVerification);
	return res.length || 0;
});
//次数
const times = computed(() => {
	let num = 0;
	let res = props.tableList.filter((i) => !i.ifVerification);
	res.map((i) => {
		num = num + Number(i.verificationNumber);
		return i;
	});
	return num;
});
const column = ref([
	{
		title: '核销项目',
		dataIndex: 'itemId',
		width: 200,
		key: 'itemId',
	},
	{
		title: '可核销次数',
		dataIndex: 'verificationNumber',
		width: 200,
		key: 'verificationNumber',
	},
]);
const columns = ref([
	{
		title: '核销项目',
		dataIndex: 'itemId',
		width: 200,
		key: 'itemId',
	},
	{
		title: '可核销次数',
		dataIndex: 'verificationNumber',
		width: 200,
		key: 'verificationNumber',
	},
	{
		title: '是否为必核销项',
		dataIndex: 'ifVerification',
		width: 200,
		key: 'ifVerification',
	},
	{
		title: '操作',
		dataIndex: 'action',
		width: 200,
		key: 'action',
	},
]);
const itemNameCompute = (id) => {
	let rN = formData.data.filter((i) => i.id === id);
	return rN[0]?.itemName || '';
};

// 关联核销项目
const formValidate = reactive({
	proj: [],
});
const emits = defineEmits(['del-verification-obj', 'add-verification-obj']);
const del = (index: number) => {
	emits('del-verification-obj', index);
};
const apply = () => {
	validate()
		.then((res) => {
			cancel();
			resetFields();
			console.log(formValidate, res);

			emits('add-verification-obj', toRaw(res));
		})
		.catch((err) => {
			console.log('error', err);
		});
};
const modelValue = ref(false);
const CreateData = () => {
	modelValue.value = true;
};

const cancel = () => {
	modelValue.value = false;
	resetFields();
};
const options = ref([
	{
		value: 'jack',
		label: 'Jack',
	},
	{
		value: 'lucy',
		label: 'Lucy',
	},
	{
		value: 'disabled',
		label: 'Disabled',
		disabled: true,
	},
	{
		value: 'yiminghe',
		label: 'Yiminghe',
	},
]);
// 数据
const formData = reactive({
	data: [],
});

const handleChange = () => {};
// 表单
const { resetFields, validate, validateInfos, mergeValidateInfo, scrollToField } = useForm(
	formValidate,
	reactive({
		proj: [{ required: true, message: '请填写' }],
	})
);
const getList = async () => {
	formData.data = await api.getVariflist();
};
onMounted(() => {
	getList();
});
</script>

<style lang="scss" scoped>
.inner-wrapper {
	position: relative;
	display: flex;
	align-items: flex-end;
	width: 100%;
	.left {
		flex: 1;
	}
}
.table-area {
	margin: 0 10px 0 0;
	padding: 0;
}
</style>
