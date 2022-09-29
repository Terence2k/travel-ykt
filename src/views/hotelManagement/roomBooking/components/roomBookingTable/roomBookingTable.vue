<template>
	<div class="wrapper-roomBookingTable">
		<CommonTable :columns="columns" :dataSource="dataSource" bordered>
			<template #headerCell="{ column }">
				<div class="cell-header" v-if="column.dataIndex !== 'roomType' && column?.appointedTime">
					<div class="item">
						<span>{{ getDayNumText(column?.appointedTime) }}</span>
					</div>
					<div class="item">
						<span>{{ getMonthAndDayText(column?.appointedTime) }}</span>
					</div>
				</div>
			</template>
			<template #bodyCell="{ column, record }">
				<div class="cell-body" v-if="column.dataIndex !== 'roomType' && column?.appointedTime">
					<div class="item">
						<span class="icon-status"></span>
						<span>{{ record[column.dataIndex]?.roomStatusName || '' }}</span>
					</div>
					<div class="item">
						<span>{{ `剩下${record[column.dataIndex]?.stockNum || '未知'}间` }}</span>
					</div>
				</div>
			</template>
		</CommonTable>
	</div>
</template>

<script setup lang="ts">
import * as dayjs from 'dayjs';
import CommonTable from '@/components/common/CommonTable.vue';
import api from '@/api';

const columns: TableColumnsType = ref([
	{
		title: '房间',
		dataIndex: 'roomType',
		key: 'roomType',
		width: '220px',
	},
	{
		title: '',
		dataIndex: 'date1',
		key: '1',
		width: '220px',
	},
	{
		title: '',
		dataIndex: 'date2',
		key: '2',
		width: '220px',
	},
	{
		title: '',
		dataIndex: 'date3',
		key: '3',
		width: '220px',
	},
	{
		title: '',
		dataIndex: 'date4',
		key: '4',
		width: '220px',
	},
	{
		title: '',
		dataIndex: 'date5',
		key: '5',
		width: '220px',
	},
	{
		title: '',
		dataIndex: 'date6',
		key: '6',
		width: '220px',
	},
	{
		title: '',
		dataIndex: 'date7',
		key: '7',
		width: '220px',
	},
	{
		title: '',
		dataIndex: 'date8',
		key: '8',
		width: '220px',
	},
	{
		title: '',
		dataIndex: 'date9',
		key: '9',
		width: '220px',
	},
	{
		title: '',
		dataIndex: 'date10',
		key: '10',
		width: '220px',
	},
	{
		title: '',
		dataIndex: 'date11',
		key: '11',
		width: '220px',
	},
	{
		title: '',
		dataIndex: 'date12',
		key: '12',
		width: '220px',
	},
	{
		title: '',
		dataIndex: 'date13',
		key: '13',
		width: '220px',
	},
	{
		title: '',
		dataIndex: 'date14',
		key: '14',
		width: '220px',
	},
	{
		title: '',
		dataIndex: 'date15',
		key: '15',
		width: '220px',
	},
	{
		title: '',
		dataIndex: 'date16',
		key: '16',
		width: '220px',
	},
	{
		title: '',
		dataIndex: 'date17',
		key: '17',
		width: '220px',
	},
	{
		title: '',
		dataIndex: 'date18',
		key: '18',
		width: '220px',
	},
	{
		title: '',
		dataIndex: 'date19',
		key: '19',
		width: '220px',
	},
	{
		title: '',
		dataIndex: 'date20',
		key: '20',
		width: '220px',
	},
	{
		title: '',
		dataIndex: 'date21',
		key: '21',
		width: '220px',
	},
	{
		title: '',
		dataIndex: 'date22',
		key: '22',
		width: '220px',
	},
	{
		title: '',
		dataIndex: 'date23',
		key: '23',
		width: '220px',
	},
	{
		title: '',
		dataIndex: 'date24',
		key: '24',
		width: '220px',
	},
	{
		title: '',
		dataIndex: 'date25',
		key: '25',
		width: '220px',
	},
	{
		title: '',
		dataIndex: 'date26',
		key: '26',
		width: '220px',
	},
	{
		title: '',
		dataIndex: 'date27',
		key: '27',
		width: '220px',
	},
	{
		title: '',
		dataIndex: 'date28',
		key: '28',
		width: '220px',
	},
	{
		title: '',
		dataIndex: 'date29',
		key: '29',
		width: '220px',
	},
	{
		title: '',
		dataIndex: 'date30',
		key: '30',
		width: '220px',
	},
	{
		title: '',
		dataIndex: 'date31',
		key: '31',
		width: '220px',
	},
]);

const test = (data: any) => {
	console.info('test------------', data);
};

const getDayNumText = (date: string) => {
	const currentDay = new Date(date).getDay();
	let result = '';
	switch (currentDay) {
		case 0:
			result = '周日';
			break;
		case 1:
			result = '周一';
			break;
		case 2:
			result = '周二';
			break;
		case 3:
			result = '周三';
			break;
		case 4:
			result = '周四';
			break;

		case 5:
			result = '周五';
			break;

		case 6:
			result = '周六';
			break;
	}

	return result;
};

const getMonthAndDayText = (date: string) => {
	const currentDate = new Date(date);
	return `${currentDate.getMonth() + 1}月${currentDate.getDate()}号`;
};
const dataSource = computed(() => {
	if (Array.isArray(tableState.tableData.data)) {
		return tableState.tableData.data.map((item) => {
			const result = {};
			result.roomType = item?.roomTypeName || '';
			if (item?.appointedStockList && Array.isArray(item.appointedStockList)) {
				item.appointedStockList.forEach((innerItem, index) => {
					result[`date${index + 1}`] = {
						appointedTime: innerItem.appointedTime,
						roomStatusName: innerItem.roomStatusName,
						stockNum: innerItem.stockNum,
					};
					columns.value[index + 1] = {
						...columns.value[index + 1],
						appointedTime: innerItem.appointedTime,
					};
				});

				columns.value = columns.value.filter((item, index) => index < 1 || item?.appointedTime);
			}

			console.info('result', result);
			return result;
		});
	}
});

const tableState = reactive({
	tableData: {
		data: [],
		total: 1,
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			hotelId: undefined,
		},
	},
});
onMounted(() => {
	api.getHotelList(1).then((result) => {
		console.info('酒店列表', result);
	});
	api
		.getHotelRoomStockInFuture({
			startTime: dayjs().format('YYYY-MM-DD'),
			endTime: dayjs().add(1, 'month').format('YYYY-MM-DD'),
			hotelId: 1,
		})
		.then((result) => {
			tableState.tableData.data = result;
			console.info('酒店房间库存信息', result);
		});
	// setTimeout(() => {
	// 	columns.value[0] = {
	// 		title: '房间ww',
	// 		dataIndex: 'roomType',
	// 		key: 'roomType',
	// 		width: '220px',
	// 	};
	// }, 1000);
});
</script>

<style lang="less" scoped>
@import './styles/roomBookingTable.less';
</style>
