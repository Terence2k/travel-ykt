<template>
	<CommonTable :dataSource="tableList" :columns="columnsCount" :scrollY="false" bordered>
		<template #bodyCell="{ column, record }">
			<template v-if="column.key === 'wateryPrice'">
				<a-input-number :controls="false" v-model:value="formData.data.wateryPrice" placeholder="输入" @change="changePrice" />
			</template>
			<template v-if="column.key === 'price'">
				<a-input-number :controls="false" v-model:value="formData.data.price" placeholder="输入" @change="changePrice" />
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

const type = computed(() => {
	return route.currentRoute.value?.query?.t;
});

watch(
	() => props.tableList,
	async (nV, oV) => {
		if (nV !== oV) {
			formData.data = nV[0];
		}
	}
);
const emits = defineEmits(['change-price']);
const changePrice = () => {
	emits('change-price', formData.data);
};
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
		title: '水牌价',
		dataIndex: 'wateryPrice',
		key: 'wateryPrice',
		width: 200,
	},
	{
		title: '售价',
		dataIndex: 'price',
		key: 'price',
		width: 200,
	},
]);

// 数据
const formData = reactive({
	data: {
		wateryPrice: null,
		price: null,
	},
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

<style scoped lang="less">
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
