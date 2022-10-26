<template>
	<Calendar
		ref="calendarRef"
		title="编辑库存日历"
		:setAllValue="allPrice"
		:setAllInventory="allPrice"
		:setCurrentValue="currentInventory"
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
					<span class="label">时间</span>
					<a-range-picker v-model:value="dateRange" />
				</p>
				<p>
					<span class="label">批量设置价格</span>
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
					<span class="label">批量设置库存</span>
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
					<span class="label">按日设置价格</span>
					<a-input-number
						:min="0"
						:max="9999999999"
						v-model:value="currentPrict"
						:formatter="(value) => value.replace(/\D/g, '')"
						:parser="(value) => value.replace(/\D/g, '')"
						placeholder="输入当日票价"
						style="width: 200px"
					/>
					<!-- <a-button @click="createDateItem">确定</a-button> -->
				</p>
				<p>
					<span class="label">按日设置库存</span>
					<a-input-number
						:min="0"
						:max="9999999999"
						v-model:value="currentInventory"
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
</template>

<script setup lang="ts">
import Calendar from '@/components/common/calendarDouble.vue';

import dayjs, { Dayjs } from 'dayjs';

import api from '@/api';
import { message } from 'ant-design-vue';
const calendarRef = ref();
const open = () => {
	calendarRef.value.open();
};
//自定义价格列表
const setDayPriceList = ref([
	{ day: '2022-10-20', price: '30' },
	{ day: '2022-10-21', price: '13' },
]);

//日历
const currentPrict = ref(null);
const currentInventory = ref(null);
const allPrice = ref(123);
// const dateRange = ref([dayjs('2022-10-20'), dayjs('2022-10-25')]);
const dateRange = ref([]);

//getCurrentDay
const currentDay = ref();

const getCurrentDay = (day: string) => {
	currentDay.value = day;
};

const clearCurrentDay = () => {
	currentDay.value = null;
	currentPrict.value = null;
	currentInventory.value = null;
	calendarRef.value.clear();
};

const createDateItem = () => {
	let timeRange = dateRange.value,
		arr: string[] = [],
		isEdit = false;

	// if (timeRange) {
	// 	let arr = getAllDateCN(new Date(shijianYMD(timeRange[0])), new Date(shijianYMD(timeRange[1])));
	// 	console.log(arr, 'range Date');
	// 	return
	// }

	if (!currentDay.value && !timeRange) {
		message.error('请选择日期');
		return;
	}

	if (typeof currentPrict.value !== 'number') {
		message.error('请填写价格');
		return;
	}
	console.log(timeRange, 'timeRange');

	if (timeRange) {
		console.log('???');

		arr = getAllDateCN(new Date(shijianYMD(timeRange[0])), new Date(shijianYMD(timeRange[1])));
		// let obj = { day: currentDay.value, price: currentPrict.value };

		setDayPriceList.value.map((i, index) => {
			let arrindex = arr.indexOf(i.day),
				obj = { day: i.day, price: currentPrict.value };
			console.log(arrindex, i.day, arr);

			if (arrindex > -1) {
				console.log(arrindex, 'arrindex');
				arr.splice(arrindex, 1);
				editItem(index, obj);
			}
			return i;
		});
		console.log(arr, 'arr');

		arr.map((i) => {
			createItem({ day: i, price: currentPrict.value });
		});
	} else {
		let obj = { day: currentDay.value, price: currentPrict.value };

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
		console.log('createDateItem', currentPrict.value, currentDay.value);
	}

	message.success('成功');
	clearCurrentDay();
	isEdit = false;
};
const shijianYMD = (timestamp: any) => {
	let time = new Date(timestamp),
		year = time.getFullYear(),
		month = (time.getMonth() + 1).toString().padStart(2, '0'),
		date = time.getDate().toString().padStart(2, '0');

	return year + '-' + month + '-' + date;
};
const getAllDateCN = (startTime: Date, endTime: Date) => {
	var date_all = [];
	var i = 0;
	while (endTime.getTime() - startTime.getTime() >= 0) {
		var year = startTime.getFullYear();
		var month = startTime.getMonth() + 1;
		var day = startTime.getDate();
		date_all[i] = year + '-' + month + '-' + day;
		startTime.setDate(startTime.getDate() + 1);
		i += 1;
	}
	return date_all;
};

const createItem = (obj: any) => {
	setDayPriceList.value.push(obj);
};

const editItem = (index: number, obj: any) => {
	const { day, price } = obj;
	setDayPriceList.value[index].day = day;
	setDayPriceList.value[index].price = price;
};
const state = reactive({
	data: {
		ticketId: '103',
		end: '2022-10-30',
		start: '2022-08-01',
	},
});
const init = async () => {
	let res = await api.getInevntoryDetail(state.data);
	console.log(res);
};
onMounted(() => {
	init();
});
defineExpose({
	open,
});
</script>

<style lang="scss" scoped>
.tips {
	color: #71747a;
}
.label {
	display: inline-block;
	min-width: 90px;
}
</style>
