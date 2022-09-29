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
			<CommonTable
				:dataSource="isCreate && !type ? formValidate.initData : tableList"
				:columns="type ? columns : column"
				:scrollY="false"
				bordered
				class="left"
			>
				<template #bodyCell="{ column, record, index }">
					<template v-if="column.key === 'itemId'">
						<div class="action-btns">
							<span style="margin-right: 20px">
								{{ itemNameCompute(record.itemId) }}
							</span>
							<a v-if="record.itemId" href="javascript:;" @click="change(record)">更换</a>
							<a href="javascript:;" v-if="isCreate && !type && formValidate.initData[0].init" @click="CreateData">请选择</a>
						</div>
					</template>
					<template v-if="column.key === 'verificationNumber'">
						<a-input
							v-model:value="record.verificationNumber"
							:formatter="(value) => value.replace(/\D/g, '')"
							:parser="(value) => value.replace(/\D/g, '')"
							placeholder="可核销次数"
						/>
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
			<a-button type="primary" class="btn" v-show="type" @click="CreateData"> 关联核销项目</a-button>
		</div>

		<span style="color: #c8c9cc" v-show="type">
			<span style="color: red">*</span>其中，非必核销项目数量为{{ ifVerificationNum }}项，可核销总数（不包括必核销项）不超过{{ times }} 次</span
		>
	</div>
	<DelModal :params="{ title: '删除', content: '是否确定该条数据' }" v-model="delShow" @submit="delSubmit" @cancel="delCancel" />
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
import BaseModal from '@/components/common/BaseModal.vue';
import { Form } from 'ant-design-vue';
import DelModal from '@/components/common/DelModal.vue';
import api from '@/api';
import { message } from 'ant-design-vue';

const route = useRouter();

const type = computed(() => {
	return route.currentRoute.value?.query?.t === '2' ? true : false;
});
const isCreate = computed(() => {
	return route.currentRoute.value?.query?.s;
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
const itemNameCompute = (id: number) => {
	let rN = formData.data.filter((i) => i.id === id);
	return rN[0]?.itemName || '';
};

const change = (value: object) => {
	console.log(value);
};

// 关联核销项目
const formValidate = reactive({
	proj: [],
	initData: [{ init: true }],
});
const emits = defineEmits(['del-verification-obj', 'add-verification-obj']);
const del = (index: number | null) => {
	delShow.value = true;
	delIndex.value = index;
	// emits('del-verification-obj', index);
};
const delSubmit = () => {
	emits('del-verification-obj', toRaw(delIndex.value));
	delCancel();
};
const delCancel = () => {
	delShow.value = false;
	delIndex.value = null;
};
const apply = () => {
	validate()
		.then((res) => {
			console.log(isCreate.value, type.value, '099');

			if (isCreate.value && !type.value) {
				console.log('formValidate.initData');

				formValidate.initData = [{ itemId: formValidate.proj[0], ifVerification: null, verificationNumber: null }];
			} else {
				toRaw(formValidate.proj).map((i) => {
					emits('add-verification-obj', { itemId: i, ifVerification: null, verificationNumber: null });
					return i;
				});
			}

			cancel();
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
	// resetFields();
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

const handleChange = (value) => {
	console.log(value);
	formValidate.proj = value;
};
// 表单
const { resetFields, validate, validateInfos, mergeValidateInfo, scrollToField } = useForm(
	formValidate,
	reactive({
		proj: [{ required: true, message: '请填写' }],
	})
);
const getList = async () => {
	formData.data = await api.getVariflist();
	let res = await api.getScenicOneTicket();

	let arr = res.map((i) => {
		return { value: i.id, label: i.itemName };
	});
	options.value = arr;
};

// 删除提示
const delShow = ref(false);
const delIndex = ref<null | number>();
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
