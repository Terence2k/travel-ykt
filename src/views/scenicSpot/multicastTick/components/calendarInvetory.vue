<template>
	<Calendar
		ref="calendarRef"
		:setCurrentInventory="currentInventory"
		:setCurrentValue="currentPrict"
		:setList="setDayPriceList"
		title="编辑库存日历"
		@get-current-day="getCurrentDay"
		@clear-current-day="clearCurrentDay"
		@save-data="saveDate"
		:range="[state.data.startDate, state.data.endDate]"
	>
		<header class="tips">
			<p>说明：点击后编辑每日库存，不编辑默认库存为默认</p>
			<p>说明：点击后编辑每日价格，不编辑则默认价格为默认价格，价格为默认价格时不可保存价格日历</p>
		</header>

		<section>
			<div class="set-wrap">
				<p>
					<span class="label">时间：</span>
					<!-- <a-range-picker v-model:value="dateRange" :disabled-date="disabledDate" /> -->

					<picker
						v-model="dateRange"
						type="daterange"
						value-format="YYYY-MM-DD"
						format="YYYY-MM-DD"
						:disabled-date="disabledDate"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
					></picker>
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
					<a-button @click="createDateItem">确定</a-button>
				</p>
				<!-- <p>
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
				
				</p> -->
			</div>
		</section>
	</Calendar>
</template>

<script setup lang="ts">
import Calendar from '@/components/common/calendarDouble.vue';
import { shijianYMD, getAllDateCN, nextYear } from '@/utils/formatTimes';
import dayjs, { Dayjs } from 'dayjs';

import api from '@/api';
import { message } from 'ant-design-vue';
import picker from '@/components/common/datePicker.vue';

const route = useRouter();

//自定义价格列表
const setDayPriceList = ref([
	// { stockDate: '2022-10-20', ticketPrice: '30', stock: '30' },
	// { stockDate: '2022-10-21', ticketPrice: '13', stock: '30' },
]);
const disabledDate = (current: Dayjs) => {
	let stat = dayjs(state.data.startDate),
		end = dayjs(state.data.endDate);
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

	// if (typeof currentPrict.value !== 'number') {
	// 	message.error('请填写按日设置价格');
	// 	return;
	// }

	if (typeof currentInventory.value !== 'number') {
		message.error('请填写库存');
		return;
	}
	console.log(timeRange, 'timeRange');

	if (timeRange[0]) {
		// 根据时间段
		arr = getAllDateCN(new Date(shijianYMD(timeRange[0])), new Date(shijianYMD(timeRange[1])));

		setDayPriceList.value.map((i: any, index) => {
			let arrindex = arr.indexOf(i.stockDate),
				obj = { stockDate: i.stockDate, stock: currentInventory.value };

			if (arrindex > -1) {
				arr.splice(arrindex, 1);
				editItem(index, obj);
			}
			return i;
		});

		arr.map((i) => {
			createItem({ stockDate: i, stock: currentInventory.value });
		});
	} else {
		// 时间点
		let obj = { stockDate: currentDay.value, stock: currentInventory.value };

		setDayPriceList.value.map((i: any, index) => {
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
	// setDayPriceList.value[index].ticketPrice = ticketPrice;
	setDayPriceList.value[index].stock = stock;
};

const emits = defineEmits(['set-calendar-invetory']);
const isEdit = computed(() => {
	return route.currentRoute.value?.query?.t === '1' || route.currentRoute.value.path === '/scenic-spot/multicast/list';
});

const newObjTpl = reactive<any>({
	ticketId: 127, //门票id/联票id
	// sonId: null, //子联票id
	// startDate: '2022-10-25', //开始日期: "yyyy-MM-dd"
	// endDate: '2022-10-30', //结束日期: "yyyy-MM-dd"
	dateStockList: [
		{
			stockDate: '2022-10-26', //自选日期: "yyyy-MM-dd"
			// customPrice: 200, //自选价格
			customDayStock: 600, //自选库存
		},
	], //自选库存数据列表
});
const saveDate = async () => {
	let res = setDayPriceList.value.map((item: any) => {
		return {
			...item,
			stockDate: item.stockDate, //自选日期: "yyyy-MM-dd"
			// customPrice: Number(item.ticketPrice || item.price), //自选价格
			customDayStock: Number(item.stock), //自选库存
		};
	});
	console.log(route.currentRoute.value, 'route');

	if (isEdit.value) {
		console.log('调用编辑日历接口', setDayPriceList.value);
		const { uniteId, subTicketId, startDate, endDate } = state.data;
		newObjTpl.ticketId = uniteId;
		// newObjTpl.sonId = subTicketId;
		newObjTpl.dateStockList = res;
		console.log(newObjTpl, 'newObjTpl');

		let resApi = await api.editCalendarMultiple(newObjTpl);
		message.success(resApi);
	} else {
		emits('set-calendar-invetory', res);
	}
	// setDayPriceList.value = [];
};
interface stateType {
	data: {
		uniteId: string | number | null;
		subTicketId: string | number | null;
		startDate: string | null;
		endDate: string | null;
	};
}

const state = reactive<stateType>({
	data: {
		uniteId: null,
		subTicketId: null,
		endDate: null,
		startDate: null,
	},
});

const calendarRef = ref();
const open = (id: number) => {
	calendarRef.value.open();
	state.data.startDate = shijianYMD(new Date());
	state.data.endDate = nextYear(state.data.startDate);
	if (typeof id === 'number') {
		initEdit(id);
	}
};

const initEdit = async (id: number) => {
	state.data.uniteId = id;

	let res = await api.getCalendarMultiple(state.data);
	setDayPriceList.value = res.map((i: any) => {
		delete i.ticketPrice;
		return i;
	});
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
