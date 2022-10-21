<template>
	<div class="wrapper">
		<CommonTable :dataSource="tableList" :columns="columnsCount" :scrollY="false" bordered class="left">
			<template #bodyCell="{ column, record }">
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a href="javascript:;" @click="CreateData(record)">编辑价格日历</a>
					</div>
				</template>
			</template>
		</CommonTable>

		<BaseModal :modelValue="modelValue" title="设置减免规则" @cancel="cancel" width="1210px">
			<p>valueNext {{ valueNext }}</p>
			<p>nextDay{{ nextDay }}</p>
			<p>value{{ value }}</p>
			<p>preDay{{ preDay }}</p>
			<header class="tips">
				<p>说明：点击后编辑每日库存，不编辑默认库存为默认</p>
				<p>说明：点击后编辑每日价格，不编辑则默认价格为默认价格，价格为默认价格时不可保存价格日历</p>
			</header>

			<article class="calendar-wrap">
				<div :style="{ width: '800px', border: '1px solid #d9d9d9', borderRadius: '4px' }">
					<a-calendar v-model:value="value" :fullscreen="false" @panelChange="onPanelChange">
						<template v-slot:dateCellRender="{ current }">
							<span :class="isCurrentDay(current) ? 'price_tips default' : 'price_tips'">￥{{ isCurrentDay(current) }}</span>
						</template>
					</a-calendar>
				</div>
				<div :style="{ width: '800px', border: '1px solid #d9d9d9', borderRadius: '4px' }">
					<a-calendar v-model:value="valueNext" :fullscreen="false" @panelChange="onPanelChange">
						<template v-slot:dateCellRender="{ current }">
							<span class="price_tips">￥{{ shijianYMD(current) }}</span>
						</template>
					</a-calendar>
				</div>
			</article>

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
import dayjs, { Dayjs } from 'dayjs';
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
const value = ref<Dayjs>(dayjs('2022-10-6 9:00:00'));
const valueNext = ref<Dayjs>(dayjs('2022-11-6 9:00:00'));
const onPanelChange = (value: Dayjs, mode: string) => {
	console.log(value, mode);
};

const arr = ['2022-10-20', '2022-10-21'];

const preDay = computed(() => {
	let time = new Date(value.value);

	let year = Number(time.getFullYear());
	let month = Number((time.getMonth() + 1).toString().padStart(2, '0'));
	const date = time.getDate().toString().padStart(2, '0');
	month - 1 === 0 ? year-- : (month -= 1);
	let day = year + '-' + month + '-' + date;
	return dayjs(day);
});
const nextDay = computed(() => {
	let time = new Date(value.value);

	let year = time.getFullYear();
	let month = Number((time.getMonth() + 1).toString().padStart(2, '0'));
	const date = time.getDate().toString().padStart(2, '0');
	month + 1 === 13 ? year++ : (month += 1);
	let day = year + '-' + month + '-' + date;
	return dayjs(day);
});
const styleColor = ref(false);
const shijianYMD = (timestamp: any) => {
	let time = new Date(timestamp);

	let year = time.getFullYear();
	const month = (time.getMonth() + 1).toString().padStart(2, '0');
	const date = time.getDate().toString().padStart(2, '0');

	return year + '-' + month + '-' + date;
};

const isCurrentDay = (timestamp: any) => {
	let day = shijianYMD(timestamp);

	if (arr.includes(day)) {
		return true;
	} else {
		return false;
	}
};

const route = useRouter();

const useForm = Form.useForm;
// 新增减免规则
const formValidate = reactive({
	certifId: [],
	discount: null,
	ruleName: '',
});

const columnsCount = ref([
	{
		title: '子票',
		dataIndex: 'sonName',
		key: 'sonName',
		width: 200,
	},
	{
		title: '联票价格估算',
		dataIndex: 'reckon',
		key: 'reckon',
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
		certifId: [{ required: true, message: '请选择类型' }],
		discount: [{ required: true, message: '请输入0-10', pattern: /^([0-9]|10)$/ }],
		ruleName: [{ required: true, message: '请填写' }],
	})
);

onMounted(() => {});
</script>

<style lang="scss" scoped>
.tips {
	color: #71747a;
}

.calendar-wrap {
	display: flex;
	.price_tips {
		display: block;
		color: #ff9f3f;
	}
	.price_tips.default {
		color: #ddd;
	}
}
.table-area {
	padding: 0;
}
</style>
