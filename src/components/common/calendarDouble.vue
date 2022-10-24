<template>
	<BaseModal :modelValue="modelValue" title="设置减免规则" @cancel="cancel" width="1212px">
		<!-- 外部 -->
		<slot> </slot>

		<article class="calendar-wrap">
			<div class="turn-left" @click="turnLeft">
				<img src="@/assets/svg/turn-left.svg" alt="" />
			</div>
			<div class="turn-right" @click="turnRight">
				<img src="@/assets/svg/turn-right.svg" alt="" />
			</div>
			<div class="wrap">
				<a-calendar v-model:value="value" :fullscreen="false" border @select="bindSetDatePriceFirst">
					<template #headerRender>
						<div class="calendar-header">{{ value.year() }}年 {{ value.month() + 1 }}月</div>
					</template>

					<template #dateFullCellRender="{ current }">
						<div v-if="current.month() === value.month()">
							<div :class="current.date() === value.date() && currentPoint === '1' ? 'date-wrap current' : 'date-wrap'">
								<div>{{ current.date() }}</div>
								<span class="price_tips">￥{{ isCurrentDay(current) ? isCurrentDay(current) : setAllValue }} </span>
							</div>
						</div>
					</template>
				</a-calendar>
			</div>
			<div class="wrap">
				<a-calendar v-model:value="valueNext" :fullscreen="false" border @select="bindSetDatePriceSec">
					<template #headerRender>
						<div class="calendar-header">{{ valueNext.year() }}年 {{ valueNext.month() + 1 }}月</div>
					</template>
					<template #dateFullCellRender="{ current }">
						<div v-if="current.month() === valueNext.month()">
							<div :class="current.date() === valueNext.date() && currentPoint === '2' ? 'date-wrap current' : 'date-wrap'">
								<div>{{ current.date() }}</div>
								<span class="price_tips">￥{{ isCurrentDay(current) ? isCurrentDay(current) : setAllValue }} </span>
							</div>
						</div>
					</template>
				</a-calendar>
			</div>
		</article>

		<template v-slot:footer>
			<a-button type="primary" @click="cancel" style="width: 100px">保存</a-button>
			<a-button @click="cancel">取消</a-button>
		</template>
	</BaseModal>
</template>

<script setup lang="ts">
/**
 * 价格日历
 * 通过外部设置ref ,调用内部
 * @function
 *  @open function（打开弹窗）
 *  @cancel function （关闭弹窗）
 *  @clear function （清除选择当前日期）
 *
 * @props
 *  @setCurrentValue 自定义当前值
 *  @setAllValue     全局默认值
 *  @setList         显示列表
 *
 * @emits
 *  @getCurrentDay    获取当前选择日期 string '2022-1-2'
 *  @clearCurrentDay  清除当前日期
 */
import BaseModal from '@/components/common/BaseModal.vue';

import dayjs, { Dayjs } from 'dayjs';
import _ from 'lodash';
import api from '@/api';
import { message } from 'ant-design-vue';
import { log } from 'console';

const emits = defineEmits(['get-current-day', 'clear-current-day', 'get-data']);

const props = defineProps({
	//自定义当前价格
	setCurrentValue: {
		type: Number || null,
		default: null,
		// require: true,
	},
	// 默认价格
	setAllValue: {
		type: Number || null,
		default: null,
		// require: true,
	},
	//设置自定义的价格列表
	setList: {
		type: Array,
		default: () => [],
		require: true,
	},
});

//日历
const currentPrict = ref(null);
const allPrice = ref(20);

const setDayPriceList = ref([
	{ day: '2022-10-20', price: '30' },
	{ day: '2022-10-21', price: '13' },
]);

const value = ref<Dayjs>(dayjs('2022-12-6'));
const valueNext = ref<Dayjs>(dayjs('2023-01-6'));
const onPanelChange = (value: Dayjs, mode: string) => {
	console.log(value, mode);
};

//前一个月
const preMonth = (day: any) => {
	let time = new Date(day),
		year = Number(time.getFullYear()),
		month = Number((time.getMonth() + 1).toString().padStart(2, '0')),
		date = time.getDate().toString().padStart(2, '0');

	if (month - 1 === 0) {
		year--;
		month = 12;
	} else {
		month -= 1;
	}

	return dayjs(year + '-' + month + '-' + date);
};

//后一个月
const nextMonth = (day: any) => {
	let time = new Date(day),
		year = time.getFullYear(),
		month = Number((time.getMonth() + 1).toString().padStart(2, '0')),
		date = time.getDate().toString().padStart(2, '0');
	if (month + 1 === 13) {
		year++;
		month = 1;
	} else {
		month += 1;
	}

	return dayjs(year + '-' + month + '-' + date);
};

const shijianYMD = (timestamp: any) => {
	let time = new Date(timestamp),
		year = time.getFullYear(),
		month = (time.getMonth() + 1).toString().padStart(2, '0'),
		date = time.getDate().toString().padStart(2, '0');

	return year + '-' + month + '-' + date;
};

//获取是否在在自定义价格列表
const isCurrentDay = (timestamp: Dayjs) => {
	let day = shijianYMD(timestamp),
		// isHad = setDayPriceList.value.filter((i) => i.day == day);
		isHad = props.setList.filter((i) => i.day == day);
	// nextTick(() => {
	// 	console.log('test', props.setList);
	// });
	if (isHad.length > 0) {
		return isHad[0].price;
	} else {
		return false;
	}
};
const currentPoint = ref<null | string>(null);
//设置当前日期
const bindSetDatePriceFirst = (e: Dayjs) => {
	let time = shijianYMD(e),
		nextValue = nextMonth(e);

	valueNext.value = nextValue;
	currentPoint.value = '1';

	emits('get-current-day', time);
};
const bindSetDatePriceSec = (e: Dayjs) => {
	let time = shijianYMD(e),
		preValue = preMonth(e);

	value.value = preValue;
	currentPoint.value = '2';

	emits('get-current-day', time);
};
//点击左边
const turnLeft = () => {
	console.log('turnLeft');
	let preDay = preMonth(value.value),
		preNDay = preMonth(valueNext.value);

	value.value = preDay;
	valueNext.value = preNDay;
	clear();
	emits('clear-current-day');
};
const turnRight = () => {
	console.log('turnRight');
	let nextDay = nextMonth(value.value),
		nNDay = nextMonth(valueNext.value);

	value.value = nextDay;
	valueNext.value = nNDay;
	clear();
	emits('clear-current-day');
};

const clear = () => {
	currentPoint.value = null;
};

//弹窗部分
const modelValue = ref(false);

const open = () => {
	modelValue.value = true;
};

const cancel = () => {
	modelValue.value = false;
	emits('clear-current-day');
};

defineExpose({
	open,
	cancel,
	clear,
});
</script>

<style lang="scss" scoped>
.calendar-wrap {
	display: flex;
	height: 100%;
	position: relative;
	padding: 20px;
	.turn-left {
		position: absolute;
		left: 0;
		top: 172px;
		width: 20px;
		height: 20px;
		text-align: center;
		cursor: pointer;
	}
	.turn-right {
		position: absolute;
		right: 0;
		top: 172px;

		width: 20px;
		height: 20px;
		text-align: center;
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
			width: 80px;
			height: 50px;
			line-height: 18px;
			font-size: 14px;
			text-align: center;
		}
		.date-wrap.current {
			background: rgba(65, 151, 239, 0.1);
		}
	}
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
