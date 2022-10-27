<template>
	<div class="wrapper">
		<CommonTable :dataSource="tableList" :columns="columnsCount" :scrollY="false" bordered class="left">
			<template #bodyCell="{ column, record }">
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a href="javascript:;" @click="createData(record)">编辑价格日历</a>
					</div>
				</template>
			</template>
		</CommonTable>

		<Calendar
			ref="calendarRef"
			:setCurrentInventory="currentInventory"
			:setCurrentValue="currentPrict"
			:setList="setDayPriceList"
			@get-current-day="getCurrentDay"
			@clear-current-day="clearCurrentDay"
			@save-data="saveDate"
		>
			<header class="tips">
				<p>说明：点击后编辑每日库存，不编辑默认库存为默认</p>
				<p>说明：点击后编辑每日价格，不编辑则默认价格为默认价格，价格为默认价格时不可保存价格日历</p>
			</header>

			<section>
				<div class="set-wrap">
					<p>
						<span class="label">时间：</span>
						<a-range-picker v-model:value="dateRange" />
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
	</div>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
import dayjs, { Dayjs } from 'dayjs';
import { Form } from 'ant-design-vue';
import Calendar from '@/components/common/calendarDouble.vue';

import api from '@/api';
import { message } from 'ant-design-vue';

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
		dataIndex: 'ticketName',
		key: 'ticketName',
		width: 200,
	},
	{
		title: '联票价格估算',
		dataIndex: 'price',
		key: 'price',
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
	{ stockDate: '2022-10-20', price: '30', stock: '30' },
	{ stockDate: '2022-10-21', price: '13', stock: '30' },
]);

//日历
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
const saveDate = () => {
	console.log('保存数据', props.tableList);
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
		console.log('???');

		arr = getAllDateCN(new Date(shijianYMD(timeRange[0])), new Date(shijianYMD(timeRange[1])));
		// let obj = { day: currentDay.value, price: currentPrict.value };

		setDayPriceList.value.map((i, index) => {
			let arrindex = arr.indexOf(i.stockDate),
				obj = { stockDate: i.stockDate, price: currentPrict.value, stock: currentInventory.value };
			console.log(arrindex, i.stockDate, arr);

			if (arrindex > -1) {
				// console.log(arrindex, 'arrindex');
				arr.splice(arrindex, 1);
				editItem(index, obj);
			}
			return i;
		});
		// console.log(arr, 'arr');

		arr.map((i) => {
			createItem({ stockDate: i, price: currentPrict.value, stock: currentInventory.value });
		});
	} else {
		let obj = { stockDate: currentDay.value, price: currentPrict.value, stock: currentInventory.value };

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
	console.log(startTime, endTime, 'endTime');

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
	const { stockDate, price, stock } = obj;
	setDayPriceList.value[index].stockDate = stockDate;
	setDayPriceList.value[index].price = price;
	setDayPriceList.value[index].stock = stock;
};
//弹窗部分
const modelValue = ref(false);
const calendarRef = ref();
const createData = (value: any) => {
	// modelValue.value = true;
	console.log('value', value);

	calendarRef.value.open();
};

const cancel = () => {
	modelValue.value = false;
	// resetFields();
};

const apply = () => {
	// validate()
	// 	.then((res) => {
	// 		cancel();
	// 		resetFields();
	// 		console.log(formValidate, res);
	// 		// emits('add-rule-obj', toRaw(res));
	// 	})
	// 	.catch((err) => {
	// 		console.log('error', err);
	// 	});
};

onMounted(() => {});
</script>

<style lang="scss" scoped>
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
