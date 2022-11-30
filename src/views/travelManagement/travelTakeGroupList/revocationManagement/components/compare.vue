<template>
	<BaseModal :modelValue="modelValue" title="行程单重提审核" @cancel="cancel" width="1000px">
		<a-table :columns="columns" :data-source="data" :pagination="false" bordered>
			<template #bodyCell="{ column, record, index }">
				<template v-if="column.key === 'index'">
					{{ index + 1 }}
				</template>
			</template>
		</a-table>

		<template v-slot:footer>
			<div class="footer-wrap">
				<a-button type="primary" @click="cancel">返回</a-button>
			</div>
		</template>
	</BaseModal>
</template>

<script lang="ts" setup>
import BaseModal from '@/components/common/BaseModal.vue';
import api from '@/api';
import { message } from 'ant-design-vue';
import FormWrap from '@/components/common/formWrap.vue';
import FormItem from '@/components/common/formItem.vue';

import dayjs, { Dayjs } from 'dayjs';

const modelValue = ref(false);
const route = useRouter();

const columns = ref<TableColumnsType>([
	// {
	// 	title: '序号',
	// 	dataIndex: 'index',
	// 	customCell: (record: any, index: number) => {
	// 		if (arr.includes(index)) {
	// 			return { rowSpan: 0, colSpan: 0 };
	// 		}
	// 		if (record.change) {
	// 			return { rowSpan: 2, colSpan: 1 };
	// 		}
	// 	},
	// },
	{
		title: '序号',
		dataIndex: 'index',
		key: 'index',
		width: 80,
	},
	{
		title: '游客姓名',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: '身份证号码',
		dataIndex: 'certificateNo',
		key: 'certificateNo',
	},
	{
		title: '性别',
		dataIndex: 'genderName',
		key: 'genderName',
	},
	{
		title: '年龄',
		dataIndex: 'age',
		key: 'age',
	},
	{
		title: '联系方式',
		dataIndex: 'phone',
		key: 'phone',
	},
	{
		title: '客源地',
		dataIndex: 'sourceAddressName',
		key: 'sourceAddressName',
	},

	{
		title: '旧行程单是否有此游客',
		dataIndex: 'no',
		key: 'no',
	},
	// {
	// 	title: '是否发生过变更',
	// 	dataIndex: 'change',
	// 	key: 'change',
	// 	customCell: (record: any, index: number) => {
	// 		if (arr.includes(index)) {
	// 			return { rowSpan: 0, colSpan: 0 };
	// 		}
	// 		if (record.change) {
	// 			return { rowSpan: 2, colSpan: 1 };
	// 		}
	// 	},
	// },
]);
let arr = [1];

const data = ref([]);
const sendAudit = (state: number) => {
	console.log(state, '驳会状态');
};

// 打开弹窗
const open = async (id: number | null) => {
	modelValue.value = true;
	// let res = await api.travelManagement.getRevokeItineraryTouristList(id);
	let res = await api.travelManagement.getRevokeItineraryTouristList(438);
	data.value = res.touristList;
	console.log(res, 'compare');
};
// 关闭弹窗
const cancel = () => {
	modelValue.value = false;
	// formRef.value.resetFields();
	// console.log(modelValue.value, 'modelValue');
};

defineExpose({
	open,
	close,
});
// const emit = defineEmits(['update:modelValue', 'cancel', 'onSearch']);
</script>

<style scoped lang="less">
.tips {
	margin: 20px 0;
}
.footer-wrap {
	display: flex;
	justify-content: space-evenly;
}
.table_box {
	max-height: 80vh;
	padding: 1px 0;
	overflow: auto;

	.row {
		width: 100%;
		font-size: 14px;
		font-family: Microsoft YaHei UI;
		font-weight: 400;
		color: #1e2226;
		border: 1px solid #e9e9e9;
		td {
			text-align: center;
		}
	}

	.change_table {
		width: 100%;

		.key,
		.key_hd {
			width: 150px;
		}

		.key_hd {
			background: rgba(245, 247, 250);
		}

		.value {
			min-width: 300px;
		}
	}

	.info_table {
		width: 100%;

		.key {
			width: 150px;
			background: rgba(245, 247, 250, 0.39);
		}
		.title {
			background: rgba(245, 247, 250);
		}
	}
}
</style>
