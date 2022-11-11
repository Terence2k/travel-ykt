<template>
	<BaseModal :modelValue="modelValue" title="新增" width="1200px" @cancel="cancel">
		<a-form :model="formValidate.data" :rules="rules" ref="formRef" :label-col="{ span: 3 }" :wrapper-col="{ span: 12, offset: 1 }" labelAlign="left">
			<a-form-item label="归属景区" class="fz14" name="scenicId">
				<a-select allowClear v-model:value="formValidate.data.scenicId" placeholder="请选择">
					<a-select-option :value="vlItem.old" v-for="vlItem in viewList" :key="vlItem.ticketId">{{ vlItem.ticketName }}</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item label="场馆名称" class="fz14" name="verificationType">
				<a-input v-model:value="formValidate.data.verificationType" placeholder="演出名称/关键词" style="width: 200" />
			</a-form-item>
			<div class="btn-wrap"><a-button type="primary" @click="addList">新增座位分区</a-button></div>
			<CommonTable :dataSource="dataSource" :columns="columns" border="true" :scroll="{ x: '100%', y: 500 }" :scrollY="false">
				<template #bodyCell="{ column, index, record }">
					<template v-if="column.key === 'area'">
						<a-input v-model:value="record.area" />
					</template>
					<template v-if="column.key === 'siteNum'">
						<a-input-number :controls="false" v-model:value="record.siteNum" />
					</template>

					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a href="javascript:;" @click="del(index)">删除</a>
						</div>
					</template>
				</template>
			</CommonTable>
		</a-form>

		<template v-slot:footer>
			<a-button type="primary" @click="apply" style="width: 80px">提交</a-button>
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
// const { resetFields, validate, validateInfos, mergeValidateInfo, scrollToField } = useForm(
// 	formValidate,
// 	reactive({
// 		'data.scenicId': [{ required: true, message: '请选择' }],
// 		'data.verificationType': [{ required: true, message: '请选择' }],
// 	})
// );
const formRef = ref();
const rules = {
	verificationType: [{ required: true, message: '请选择单票类型' }],
	scenicId: [{ required: true, message: '请选择' }],
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
		no: '1',
		area: '1',
		siteNum: 5,
	},
]);
const columns = [
	{
		title: '分区编号',
		dataIndex: 'no',
		key: 'no',
	},
	{
		title: '分区名称',
		dataIndex: 'area',
		key: 'area',
	},
	{
		title: '座位数',
		dataIndex: 'siteNum',
		key: 'siteNum',
	},

	{
		title: '操作',
		key: 'action',
	},
];
const addList = () => {
	dataSource.value.push({
		no: '1',
		area: '1',
		siteNum: 5,
	});
};

const del = (index: number) => {
	dataSource.value.splice(index, 1);
};
// --------------------------------------------------------表单-----------------------------------------
const apply = () => {
	console.log(formRef.value);

	formRef.value
		.validate()
		.then((res: any) => {
			console.log(res, dataSource.value);
			cancel();
			formRef.value.resetFields();
		})
		.catch((err) => {
			console.log('error', err);
		});
};

// 打开弹窗
const open = (oid: number) => {
	modelValue.value = true;
	initPage(oid);
};
// 关闭弹窗
const cancel = () => {
	modelValue.value = false;
	formRef.value.clearValidate();
	console.log(modelValue.value, 'modelValue');
};
const viewList = ref(null);
//初始化页面
const initPage = async (oid: number): Promise<void> => {
	let res = await api.getShowVenueDetail(oid);
	// viewList.value = res;
};
const initOption = async (): Promise<void> => {
	let res = await api.getViewList();
	viewList.value = res;
};
onMounted(() => {
	initOption();
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
