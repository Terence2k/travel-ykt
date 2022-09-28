<template>
	<CommonTable
		:dataSource="isCreate ? formData.datas : formData.data"
		:columns="isCreate ? columnsCountCreate : columnsCount"
		:scrollY="false"
		bordered
	>
		<template #bodyCell="{ column, record }">
			<template v-if="column.key === 'assistId' && isCreate">
				<div style="text-align: center">{{ record.assistId }}</div>
			</template>
			<template v-if="column.key === 'name'">
				{{ record.name }}
				<!-- <a-input v-model:value="formData.data.creditCode" placeholder="输入每日库存" /> -->
			</template>
		</template>
	</CommonTable>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';

import { Form } from 'ant-design-vue';

import api from '@/api';
import { message } from 'ant-design-vue';

const route = useRouter();

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

const columnsCount = ref([
	{
		title: '核销账号',
		dataIndex: 'account',
		key: 'account',
		width: 200,
	},
	{
		title: '姓名',
		dataIndex: 'username',
		key: 'username',
		width: 200,
	},
]);

const columnsCountCreate = ref([
	{
		title: '核销账号',
		dataIndex: 'assistId',
		key: 'assistId',
		width: 200,
		customCell: (_, index) => ({
			colSpan: 2,
		}),
	},
	{
		title: '姓名',
		dataIndex: 'name',
		key: 'name',
		width: 200,
		customCell: (_, index) => ({
			colSpan: 0,
		}),
	},
]);

// 数据
const formData = reactive({
	data: [],
	datas: [{ assistId: '系统将自动识别可核销账号' }],
});

//初始化数据
const getList = async () => {
	let res = await api.getVerifUser();
	formData.data = res;
};
onMounted(() => {
	getList();
});
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
