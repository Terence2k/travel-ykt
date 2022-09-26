<template>
	<CommonTable :dataSource="tableList" :columns="type === '2' ? columns : column" :scrollY="false" bordered>
		<template #bodyCell="{ column, record }">
			<template v-if="column.key === 'action'">
				<div class="action-btns">
					<a href="javascript:;" @click="toEdit(record)">编辑</a>
					<a href="javascript:;">删除</a>
					<a href="javascript:;" v-if="record.putaway === '上架'" @click="open"> 下架申请</a>
				</div>
			</template>
		</template>
	</CommonTable>
	<span style="color: #c8c9cc"> <span style="color: red">*</span>其中，非必核销项目数量为3项，可核销总数（不包括必核销项）不超过（） 次</span>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';

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

const column = ref([
	{
		title: '核销项目',
		dataIndex: 'ticketName',
		width: 200,
		key: 'ticketName',
	},
	{
		title: '可核销次数',
		dataIndex: 'verificationType',
		width: 200,
		key: 'verificationType',
	},
]);
const columns = ref([
	{
		title: '核销项目',
		dataIndex: 'ticketName',
		width: 200,
		key: 'ticketName',
	},
	{
		title: '可核销次数',
		dataIndex: 'verificationType',
		width: 200,
		key: 'verificationType',
	},
	{
		title: '是否为必核销项',
		dataIndex: 'scenicName',
		width: 200,
		key: 'scenicName',
	},
	{
		title: '操作',
		dataIndex: 'action',
		width: 200,
		key: 'action',
	},
]);

// 数据
const formData = reactive({
	data: [],
});
// 表单
const { resetFields, validate, validateInfos, mergeValidateInfo, scrollToField } = useForm(
	formData,
	reactive({
		'data.provinceId': [{ required: true, message: '请选择省份' }],
		'data.cityId': [{ required: true, message: '请选择市' }],
	})
);
//初始化数据
const initTable = () => {};
onMounted(() => {});
</script>

<style lang="scss" scoped>
.editWrapper {
	padding: 0 16px;
	padding-bottom: 64px;
}
header {
	// width: 64px;
	// margin-bottom: 8px;
	height: 56px;
	line-height: 56px;
	font-weight: bold;
	color: #1e2226;
	// margin: 0 8px 16px;
	margin-bottom: 16px;
	border-bottom: 1px solid #f1f2f5;
}
.title {
	height: 56px;
	line-height: 56px;
	font-weight: bold;
	color: #1e2226;
	// margin: 0 8px 16px;
	margin-bottom: 16px;
	border-bottom: 1px solid #f1f2f5;
}
.area {
	margin-bottom: 20px;
}

.footer {
	position: fixed;
	bottom: 12px;
	line-height: 64px;
	height: 64px;
	width: calc(100% - 288px);
	border-top: 1px solid #f1f2f5;
	margin-left: -16px;
	margin-right: 24px;
	background-color: #fff;
	z-index: 99;

	.tooter-btn {
		width: 60%;
		// background-color: #fff;
		margin-left: 16px;
	}
	button:first-of-type {
		margin-right: 16px;
	}
}
.tips {
	margin-left: 10px;
	color: #c8c9cc;
}
.table-area {
	margin: 0;
	padding: 0;
}
.table-wrapper {
	width: 420px;
}
.table-wrapper-long {
	width: 820px;
}
</style>
