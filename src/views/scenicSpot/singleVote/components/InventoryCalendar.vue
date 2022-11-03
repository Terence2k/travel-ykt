<template>
	<Calendar
		ref="calendarRef"
		:setCurrentInventory="currentInventory"
		:setCurrentValue="currentPrict"
		:setList="setDayPriceList"
		@get-current-day="getCurrentDay"
		@clear-current-day="clearCurrentDay"
		@save-data="saveDate"
		:range="[state.data.start, state.data.end]"
	>
		<header class="tips">
			<p>说明：点击后编辑每日库存，不编辑默认库存为默认</p>
			<p>说明：点击后编辑每日价格，不编辑则默认价格为默认价格，价格为默认价格时不可保存价格日历</p>
		</header>

		<section>
			<div class="set-wrap">
				<p>
					<span class="label">时间：</span>
					<a-range-picker v-model:value="dateRange" :disabled-date="disabledDate" />
				</p>
				<p>
					<span class="label">库存:</span>
					<a-input-number
						:min="0"
						:max="99999"
						v-model:value="currentInventory"
						:formatter="(value) => value.replace(/\D/g, '')"
						:parser="(value) => value.replace(/\D/g, '')"
						placeholder="输入库存"
						style="width: 200px"
					/>
				</p>
				<p>
					<span class="label">按日设置</span>
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
</template>

<script setup lang="ts">
import Calendar from '@/components/common/calendarDouble.vue';

import dayjs, { Dayjs } from 'dayjs';

import api from '@/api';
import { message } from 'ant-design-vue';
import { shijianYMD, getAllDateCN, nextYear } from '@/utils/formatTIme';

//自定义价格列表
const setDayPriceList = ref([
	// { stockDate: '2022-10-20', ticketPrice: '30', stock: '30' },
	// { stockDate: '2022-10-21', ticketPrice: '13', stock: '30' },
]);
const disabledDate = (current: Dayjs) => {
	let stat = dayjs(state.data.start),
		end = dayjs(state.data.end);
	return current < stat || current > end;
};
///日历
const currentPrict = ref(null);
const currentInventory = ref();
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
	dateRange.value = [];
};

const createDateItem = () => {
	let timeRange = dateRange.value,
		arr: string[] = [],
		isEdit = false;

	if (!currentDay.value && !timeRange[0]) {
		message.error('请选择日期');
		return;
	}

	if (typeof currentPrict.value !== 'number') {
		message.error('请填写按日设置价格');
		return;
	}

	if (typeof currentInventory.value !== 'number') {
		message.error('请填写库存');
		return;
	}
	console.log(timeRange, 'timeRange');

	if (timeRange[0]) {
		// 根据时间段
		arr = getAllDateCN(new Date(shijianYMD(timeRange[0])), new Date(shijianYMD(timeRange[1])));

		setDayPriceList.value.map((i, index) => {
			let arrindex = arr.indexOf(i.stockDate),
				obj = { stockDate: i.stockDate, ticketPrice: currentPrict.value, stock: currentInventory.value };
			console.log(arrindex, i.stockDate, arr);

			if (arrindex > -1) {
				arr.splice(arrindex, 1);
				editItem(index, obj);
			}
			return i;
		});

		arr.map((i) => {
			createItem({ stockDate: i, ticketPrice: currentPrict.value, stock: currentInventory.value });
		});
	} else {
		// 时间点
		let obj = { stockDate: currentDay.value, ticketPrice: currentPrict.value, stock: currentInventory.value };

		setDayPriceList.value.map((i, index) => {
			if (i.stockDate === currentDay.value) {
				isEdit = true;
				editItem(index, obj);
			}
			return i;
		});

		if (!isEdit) {
			createItem(obj);
		}
	}

	message.success('已修改');
	clearCurrentDay();
	isEdit = false;
};

const createItem = (obj: any) => {
	setDayPriceList.value.push(obj);
};

const editItem = (index: number, obj: any) => {
	const { ticketPrice, stock } = obj;
	setDayPriceList.value[index].ticketPrice = ticketPrice;
	setDayPriceList.value[index].stock = stock;
};

const saveDate = async () => {
	let res = await api.saveInevntoryDetail({ ticketId: state.data.ticketId, stocks: setDayPriceList.value });
	console.log(res, 'asdas');

	message.success(res);
};

interface stateType {
	data: {
		ticketId: string | number | null;
		end: string | null;
		start: string | null;
	};
}

const state = reactive<stateType>({
	data: {
		ticketId: null,
		end: null,
		start: null,
	},
});

const calendarRef = ref();
const open = (id: number) => {
	calendarRef.value.open();
	init(id);
};

const init = async (id: number) => {
	state.data.ticketId = id;
	state.data.start = shijianYMD(new Date());
	state.data.end = nextYear(state.data.start);
	let res = await api.getInevntoryDetail(state.data);
	setDayPriceList.value = res;
};

defineExpose({
	open,
});
</script>

<style scoped lang="less">
.tips {
	color: #71747a;
}
.label {
	display: inline-block;
	min-width: 90px;
}
</style>
