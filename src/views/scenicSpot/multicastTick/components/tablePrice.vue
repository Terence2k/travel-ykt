<template>
	<div class="wrapper">
		<a-spin size="large" :spinning="loading" style="min-height: 30vh">
			<CommonTable :dataSource="tableList" :columns="columnsCount" :scrollY="false" bordered class="left">
				<template #bodyCell="{ column, record, index }">
					<template v-if="column.key === 'priceRange'">
						{{ getMax(record, index) / 100 }}
						<!-- <span v-if="getMin(record) === getMax(record, index)">{{ getMax(record, index) }} </span>

						<span v-else>{{ getMin(record) / 100 }} - {{ getMax(record, index) / 100 }} </span> -->
					</template>
					<template v-if="column.key === 'settlementModel'">
						<a-select v-model:value="record.settlementModel" :allowClear="true" ref="select" placeholder="请选择" :options="settlementModelList">
						</a-select>
					</template>
					<template v-if="column.key === 'price'">
						{{ record.price / 100 }}
					</template>
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a href="javascript:;" @click="createData(record, index)">编辑价格日历</a>
						</div>
					</template>
				</template>
			</CommonTable>

			<Calendar
				ref="calendarRef"
				:setCurrentValue="currentPrict"
				:setList="setDayPriceList"
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
						<!-- <p>
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
						</p> -->
						<p>
							<span class="label">按日设置</span>
							<a-input-number :min="0" :max="9999999999" v-model:value="currentPrict" placeholder="输入当日票价" style="width: 200px" />
							<a-button @click="createDateItem">确定</a-button>
						</p>
					</div>
				</section>
			</Calendar>
		</a-spin>
	</div>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
import dayjs, { Dayjs } from 'dayjs';
import { Form } from 'ant-design-vue';
import Calendar from '@/components/common/calendarDouble.vue';
import { shijianYMD, getAllDateCN, nextYear } from '@/utils/formatTimes';
import api from '@/api';
import { message } from 'ant-design-vue';
import { accDiv } from '@/utils/compute.js';
import picker from '@/components/common/datePicker.vue';

const route = useRouter();
const loading = ref(false);
// 数据
const props = defineProps({
	tableList: {
		type: Array,
		default: () => [],
		require: true,
	},
	settlementModelList: {
		type: Array,
		default: () => [],
		require: true,
	},
});
const columnsCount = ref([
	{
		title: '子票',
		dataIndex: 'ticketName',
		key: 'ticketName',
		width: 200,
	},
	{
		title: '联票价格',
		dataIndex: 'priceRange',
		key: 'priceRange',
		width: 250,
		customCell: (record: any, index: number) => {
			if (record.price && !index) {
				return { rowSpan: props.tableList.length };
			} else {
				return { rowSpan: 0, colSpan: 0 };
			}
		},
	},
	{
		title: '参考价格',
		dataIndex: 'price',
		key: 'price',
		width: 200,
	},

	{
		title: '操作',
		key: 'action',
		width: 200,
	},
	{
		title: '结算归属方',
		dataIndex: 'settlementModel',
		key: 'settlementModel',
		width: 200,
	},
]);

//自定义价格列表
const setDayPriceList = ref<any>([
	// { stockDate: '2022-10-20', ticketPrice: '30', stock: '30' },
	// { stockDate: '2022-10-21', ticketPrice: '13', stock: '30' },
]);
const disabledDate = (current: Dayjs) => {
	let stat = dayjs(state.data.startDate),
		end = dayjs(state.data.endDate);
	return current < stat || current > end;
};

const getMin = (value: any) => {
	let min = props.tableList[0]?.price || 0;
	if (value.price < min) {
		min = value.price;
	}

	return min;
};
const getMax = () => {
	let max = 0;
	props.tableList?.map((item: any) => {
		max += item.price;
		return item;
	});

	return max;
};
//日历
const currentPrict = ref(null);
const dateRange = ref([]);

//getCurrentDay
const currentDay = ref();

const getCurrentDay = (day: string) => {
	currentDay.value = day;
};

const clearCurrentDay = () => {
	currentDay.value = null;
	currentPrict.value = null;
	calendarRef.value.clear();
	dateRange.value = [];
};
// (该参数仅用于新增使用))
const newObjTpl = reactive<any>({
	ticketId: 127, //门票id/联票id
	sonId: null, //子联票id
	// startDate: '2022-10-25', //开始日期: "yyyy-MM-dd"
	// endDate: '2022-10-30', //结束日期: "yyyy-MM-dd"
	dateStockList: [
		{
			stockDate: '2022-10-26', //自选日期: "yyyy-MM-dd"
			customPrice: 200, //自选价格
			// customDayStock: 600, //自选库存
		},
	], //自选库存数据列表
});
const emits = defineEmits(['set-calendar']);
const isEdit = computed(() => {
	return route.currentRoute.value?.query?.t === '1';
});

const saveDate = async () => {
	let res = setDayPriceList.value.map((item: any) => {
		return {
			...item,
			stockDate: item.stockDate, //自选日期: "yyyy-MM-dd"
			customPrice: Number(item.ticketPrice || item.price), //自选价格
			// customDayStock: Number(item.stock), //自选库存
		};
	});
	if (isEdit.value) {
		loading.value = true;
		console.log('调用编辑日历接口', setDayPriceList.value);
		const { uniteId, subTicketId, startDate, endDate } = state.data;
		newObjTpl.ticketId = uniteId;
		newObjTpl.sonId = subTicketId;
		newObjTpl.dateStockList = res;
		console.log(newObjTpl, 'newObjTpl');

		let resApi = await api.editCalendarMultiple(newObjTpl);
		message.success(resApi);
		loading.value = false;
	} else {
		emits('set-calendar', { index: createNewCalendarIndex.value, data: res });
		loading.value = false;
	}
	console.log('保存数据', props.tableList);
	setDayPriceList.value = [];
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

	if (timeRange[0]) {
		arr = getAllDateCN(new Date(shijianYMD(timeRange[0])), new Date(shijianYMD(timeRange[1])));

		setDayPriceList.value.map((i: any, index: number) => {
			let arrindex = arr.indexOf(shijianYMD(i.stockDate)),
				obj = { stockDate: i.stockDate, ticketPrice: currentPrict.value ? Number((Number(currentPrict.value.toFixed(2)) * 100).toFixed(2)) : null };
			console.log(arrindex, shijianYMD(i.stockDate), arr);

			if (arrindex > -1) {
				arr.splice(arrindex, 1);
				editItem(index, obj);
			}
			return i;
		});
		// console.log(arr, 'arr');

		arr.map((i) => {
			createItem({ stockDate: i, ticketPrice: currentPrict.value ? Number((Number(currentPrict.value.toFixed(2)) * 100).toFixed(2)) : null });
		});
	} else {
		let obj = {
			stockDate: currentDay.value,
			ticketPrice: currentPrict.value ? Number((Number(currentPrict.value.toFixed(2)) * 100).toFixed(2)) : null,
		};

		setDayPriceList.value.map((i: any, index: number) => {
			if (i.stockDate === currentDay.value) {
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

const createItem = (obj: any) => {
	setDayPriceList.value.push(obj);
};

const editItem = (index: number, obj: any) => {
	const { stockDate, ticketPrice, stock } = obj;
	setDayPriceList.value[index].stockDate = stockDate;
	setDayPriceList.value[index].ticketPrice = ticketPrice;
	// setDayPriceList.value[index].stock = stock;
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

// 编辑日历
const initCalendarList = async (id: number) => {
	state.data.subTicketId = id;
	state.data.uniteId = Number(route.currentRoute.value?.query?.o);

	let res = await api.getCalendarMultiple(state.data);

	setDayPriceList.value = res.map((i: any) => {
		delete i.stock;
		return i;
	});
};
//弹窗部分

const calendarRef = ref();
const createNewCalendarIndex = ref<null | number>(null);

const createData = (value: any, index: number) => {
	console.log('value', index, isEdit.value);

	state.data.startDate = shijianYMD(new Date());
	state.data.endDate = nextYear(state.data.startDate);
	if (isEdit.value) {
		initCalendarList(value.ticketId);
	} else {
		createNewCalendarIndex.value = index;
		let value = props.tableList[index].dateStockList;
		if (value) {
			setDayPriceList.value = value;
		} else {
			setDayPriceList.value = [];
		}
	}

	calendarRef.value.open();
};
</script>

<style scoped lang="less">
.tips {
	color: #71747a;
}
.label {
	display: inline-block;
	min-width: 70px;
}
.table-area {
	// margin: 0 10px 0 0;
	padding: 0;
}
</style>
