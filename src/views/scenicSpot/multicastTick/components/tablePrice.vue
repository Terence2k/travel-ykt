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

		<Calendar
			ref="calendarRef"
			:setAllValue="allPrice"
			:setCurrentValue="currentPrict"
			:setList="setDayPriceList"
			@get-current-day="getCurrentDay"
			@clear-current-day="clearCurrentDay"
		>
			<header class="tips">
				<p>说明：点击后编辑每日库存，不编辑默认库存为默认</p>
				<p>说明：点击后编辑每日价格，不编辑则默认价格为默认价格，价格为默认价格时不可保存价格日历</p>
			</header>

			<section>
				<div class="set-wrap">
					<p>
						批量设置
						<a-input-number
							:min="0"
							:max="9999999999"
							v-model:value="allPrice"
							:formatter="(value) => value.replace(/\D/g, '')"
							:parser="(value) => value.replace(/\D/g, '')"
							placeholder="输入统一票价"
							style="width: 200px"
						/>
					</p>
					<p>
						按日设置
						<a-input-number
							:min="0"
							:max="9999999999"
							v-model:value="currentPrict"
							:formatter="(value) => value.replace(/\D/g, '')"
							:parser="(value) => value.replace(/\D/g, '')"
							placeholder="输入当日票价"
							style="width: 200px"
						/>
						<a-button @click="createDateItem">确定</a-button>
					</p>
				</div>
			</section>
		</Calendar>
	</div>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
import dayjs, { Dayjs } from 'dayjs';
import { Form } from 'ant-design-vue';
import Calendar from '@/components/common/calendarDouble.vue';

import api from '@/api';
import { message } from 'ant-design-vue';
import { log } from 'console';

// 数据
const props = defineProps({
	tableList: {
		type: Array,
		default: () => [],
		require: true,
	},
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

//自定义价格列表
const setDayPriceList = ref([
	{ day: '2022-10-20', price: '30' },
	{ day: '2022-10-21', price: '13' },
]);

//日历
const currentPrict = ref(null);
const allPrice = ref(40);

//getCurrentDay
const currentDay = ref();

const getCurrentDay = (day: string) => {
	currentDay.value = day;
};

const clearCurrentDay = () => {
	currentDay.value = null;
	currentPrict.value = null;
	calendarRef.value.clear();
};

const createDateItem = () => {
	if (!currentDay.value) {
		message.error('请选择日期');
		return;
	}

	if (typeof currentPrict.value !== 'number') {
		message.error('请填写价格');
		return;
	}
	console.log('createDateItem', currentPrict.value, currentDay.value);

	let obj = { day: currentDay.value, price: currentPrict.value },
		isEdit = false;

	setDayPriceList.value.map((i, index) => {
		if (i.day === currentDay.value) {
			isEdit = true;
			editItem(index, obj);
		}
		return i;
	});

	if (!isEdit) {
		createItem(obj);
	}

	message.success('成功');
	clearCurrentDay();
};

const createItem = (obj: any) => {
	setDayPriceList.value.push(obj);
};

const editItem = (index: number, obj: any) => {
	setDayPriceList.value[index] = obj;
};
//弹窗部分
const modelValue = ref(false);
const calendarRef = ref();
const CreateData = () => {
	// modelValue.value = true;
	calendarRef.value.open();
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

			// emits('add-rule-obj', toRaw(res));
		})
		.catch((err) => {
			console.log('error', err);
		});
};

onMounted(() => {});
</script>

<style lang="scss" scoped>
.tips {
	color: #71747a;
}

.calendar-wrap {
	display: flex;
	height: 100%;
	position: relative;
	padding: 20px;
	.turn-left {
		position: absolute;
		left: 0;
		top: 50%;
		width: 20px;
		height: 20px;
		text-align: center;
		// background-color: red;
		cursor: pointer;
	}
	.turn-right {
		position: absolute;
		right: 0;
		top: 50%;
		width: 20px;
		height: 20px;
		text-align: center;
		// background-color: red;
		cursor: pointer;
	}
	.wrap {
		position: relative;
		width: 568px;
		border: 1px solid #f1f2f5;
		.price_tips {
			color: #ff9f3f;
		}
		.price_tips.default {
			color: #ddd;
		}
		.calendar-header {
			text-align: center;
			height: 40px;
			line-height: 40px;
			font-size: 16px;
			font-weight: bold;
			border: none;
		}
		.date-wrap {
			padding-top: 6px;
			width: 82px;
			height: 50px;
			line-height: 18px;
			font-size: 14px;
			text-align: center;
		}
	}
}
.table-area {
	padding: 0;
}

::v-deep .ant-picker-calendar .ant-picker-panel {
	border-top: none;
}
::v-deep thead {
	padding: 10px;
	height: 44px;
	border-bottom: 1px solid #f1f2f5 !important;
}
::v-deep thead tr th::before {
	content: '周';
	font-size: 14px;
	font-weight: 400;
}
::v-deep thead tr th {
	font-size: 14px;
	font-weight: 400;
}
::v-deep tbody tr:first-child {
	padding-top: 10px;
	margin-top: 10px;
}

::v-deep .ant-picker-cell.ant-picker-cell-in-view {
	padding: 0;
}
::v-deep .ant-picker-body {
	padding: 0 !important;
	margin: 0;
}
</style>
