<template>
	<BaseModal :modelValue="modelValue" title="新增" width="600px" @cancel="cancel">
		<a-form :model="formValidate" :label-col="{ span: 3 }" :wrapper-col="{ span: 12, offset: 1 }" labelAlign="left">
			<a-form-item label="归属景区" class="fz14" v-bind="validateInfos[`data.verificationType`]">
				<a-select allowClear v-model:value="formValidate.data.scenicId" placeholder="请选择">
					<a-select-option :value="vlItem.old" v-for="vlItem in viewList" :key="vlItem.ticketId">{{ vlItem.ticketName }}</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item label="场馆名称" class="fz14" v-bind="validateInfos[`data.verificationType`]">
				<a-input v-model:value="formValidate.data.verificationType" placeholder="演出名称/关键词" style="width: 200" />
			</a-form-item>
			<!-- <a-form-item label="单票类型" class="fz14" v-bind="validateInfos[`data.verificationType`]">
				<a-radio-group v-model:value="formValidate.data.verificationType">
					<a-radio :value="1">单票：单点核销</a-radio>
					<a-radio :value="2">单票：多选核销</a-radio>
				</a-radio-group>
			</a-form-item> -->
			<div class="btn-wrap">
				<a-button type="primary" @click="addList">新增</a-button>
			</div>
			<CommonTable :dataSource="dataSource" :columns="columns" border="true">
				<template #bodyCell="{ column, index }">
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a href="javascript:;" @click="del(index)">删除</a>
						</div>
					</template>
				</template>
			</CommonTable>
		</a-form>

		<template v-slot:footer>
			<a-button type="primary" @click="apply" style="width: 80px">提交审核</a-button>
			<a-button @click="cancel">取消</a-button>
		</template>
	</BaseModal>
</template>

<script lang="ts" setup>
import CommonTable from '@/components/common/CommonTable.vue';
import BaseModal from '@/components/common/BaseModal.vue';
import { Form } from 'ant-design-vue';
import api from '@/api';
const route = useRouter();
const modelValue = ref(false);
const useForm = Form.useForm;

const formValidate = reactive({
	data: {
		verificationType: '',
	},
});
const { resetFields, validate, validateInfos, mergeValidateInfo, scrollToField } = useForm(
	formValidate,
	reactive({
		'data.verificationType': [{ required: true, message: '请选择' }],
	})
);
const rules = {
	'data.verificationType': [{ required: true, message: '请选择单票类型' }],
};
const props = defineProps({
	// modelValue: {
	// 	type: Boolean,
	// 	default: false,
	// },
	// params: Object,
	// menuList: Array,
});
//--------------------------------------------------------表格-------------------------------------------
const dataSource = ref([
	{
		key: '1',
		name: '1',
		age: '千古情',
		address: '西湖区湖底公园1号',
		address2: '待审核',
		address3: '上架',
	},
]);
const columns = [
	{
		title: '序号',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: '演出名称',
		dataIndex: 'age',
		key: 'age',
	},
	{
		title: '演出场馆',
		dataIndex: 'address',
		key: 'address',
	},

	{
		title: '操作',
		key: 'action',
	},
];
const addList = () => {
	dataSource.value.push({
		key: '1',
		name: '1',
		age: '千古情',
		address: '西湖区湖底公园1号',
		address2: '待审核',
		address3: '上架',
	});
};

const del = (index) => {
	dataSource.value.splice(index, 1);
};
// --------------------------------------------------------表单-----------------------------------------
const apply = () => {
	validate()
		.then((res) => {
			route.push({ path: '/scenic-spot/singleVote/edit', query: { t: formValidate.data.verificationType, s: 'new' } });
		})
		.catch((err) => {
			console.log('error', err);
		});
};

// 打开弹窗
const open = () => {
	modelValue.value = true;
};
// 关闭弹窗
const cancel = () => {
	modelValue.value = false;
	console.log(modelValue.value, 'modelValue');
};
const viewList = ref(null);
//初始化页面
const initPage = async (): Promise<void> => {
	let res = await api.getViewList();
	viewList.value = res;
};
onMounted(() => {
	initPage();
	// 自定义面包屑
});
defineExpose({
	open,
	close,
});
// const emit = defineEmits(['update:modelValue', 'cancel', 'onSearch']);
</script>

<style scoped lang="less">
.table-area {
	margin: 0;
	padding: 0;
}
.fz14 {
	font-size: 14px;
}

.btn-wrap {
	display: flex;
	justify-content: end;
	margin-bottom: 20px;
}
</style>
