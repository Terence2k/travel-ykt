<template>
	<div class="wrapper-roomBookingTable">
		<div class="container-time flex-container">
			<div>当前时间：{{ tableState.params.currentTimeDetailText }}</div>
			<div class="flex-container select-bar">
				<a-select class="select-year select item" :showArrow="true" :options="yearOptions" v-model:value="year" placeholder="年份"> </a-select>

				<a-select class="select-month select item" :showArrow="true" :options="monthOptions" v-model:value="month" placeholder="月份"> </a-select>
			</div>
		</div>
		<CommonTable :columns="columns" :dataSource="dataSource" bordered>
			<template #headerCell="{ column }">
				<div class="cell-header" v-if="column.dataIndex !== 'roomType' && column?.appointedTime">
					<div class="item">
						<span :class="{ hidden: dataSource.length === 0 }">{{ getMonthAndDayText(column?.appointedTime) }}</span>
					</div>
					<div class="item">
						<span :class="{ hidden: dataSource.length === 0 }">{{ getDayNumText(column?.appointedTime) }}</span>
					</div>
				</div>
				<div v-else class="cell-header row-first">
					<span>房间</span>
				</div>
			</template>
			<template #bodyCell="{ column, record, text }">
				<div
					class="cell-body"
					:class="{ audit: record[column.dataIndex]?.auditStatus === 0 }"
					v-if="column.dataIndex !== 'roomType' && column?.appointedTime"
				>
					<div class="item">
						<span class="icon-status" :class="{ close: record[column.dataIndex]?.roomStatus === 0 }"></span>
						<span>{{ record[column.dataIndex]?.roomStatusName || '' }}</span>
					</div>
					<div @dblclick="openRoomStatusDetailsModal(record[column.dataIndex])" class="item cursor-point">
						<div>
							<span>
								剩下
								<span class="color-stock" :class="{ empty: record[column.dataIndex]?.stockNum === 0 }">
									{{ `${record[column.dataIndex]?.stockNum}` }}
								</span>
								间
							</span>
						</div>
					</div>
				</div>
				<div v-else class="cell-body row-first">
					<span>{{ text }}</span>
				</div>
			</template>
		</CommonTable>
		<!-- <CommonPagination
			class="pagination-custom"
			:current="tableState.tableData.param.pageNumber"
			:page-size="tableState.tableData.param.pageSize"
			:total="tableState.tableData.total"
			@change="onHandleCurrentChange"
			@showSizeChange="pageSideChange"
		>
		</CommonPagination> -->
		<BaseModal :title="'房态详情'" v-model="modalState.visible">
			<a-form>
				<a-form-item label="房型名称">
					<span>{{ modalState.baseInfo?.roomTypeName }}</span>
				</a-form-item>
				<a-form-item label="时间">
					<span>{{ modalState.baseInfo?.appointedTime }}</span>
				</a-form-item>
				<a-form-item label="当日房态">
					<a-radio-group v-model:value="modalState.baseInfo.roomStatus">
						<a-radio :value="1">开启预定</a-radio>
						<a-radio :value="0">关闭预定</a-radio>
					</a-radio-group>
				</a-form-item>
				<a-form-item label="当日保留房间数">
					<div style="user-select: none" class="flex-container">
						<plus-square-outlined @click="addStockNum" :style="{ fontSize: '19px', color: '#54565CFF' }" />
						<span style="display: inline-block; font-size: 17px; margin: 0px 10px">{{ modalState.baseInfo?.stockNum }}</span>
						<minus-square-outlined @click="reduceStockNum" :style="{ fontSize: '19px', color: '#54565CFF' }" />
						<div class="tip">{{ `当日最大可保留房间数 ${modalState.cacheInfo?.stockNum}` }}</div>
					</div>
				</a-form-item>
			</a-form>
			<template v-slot:footer>
				<div v-if="modalState.baseInfo.auditStatus === 1">
					<a-button style="width: 86px; font-size: 14px; background-color: #36b374ff; color: #ffffffff" @click="saveModalInfo">提交审核</a-button>
					<a-button style="width: 86px; font-size: 14px; background-color: #ffffffff; color: #54565cff" @click="modalState.visible = false"
						>取消</a-button
					>
				</div>
				<div v-if="modalState.baseInfo.auditStatus === 0 && (tableState.roleId || tableState.roleId === null || tableState.roleId === 0)">
					<a-button style="width: 100px; font-size: 14px; background-color: #36b374ff; color: #ffffffff" @click="passModalInfo">审核通过</a-button>
					<a-button style="width: 100px; font-size: 14px; background-color: #ffffffff; color: #54565cff" @click="failModalInfo">审核不通过</a-button>
				</div>
			</template>
		</BaseModal>
	</div>
</template>

<script setup lang="ts">
import { PlusSquareOutlined, MinusSquareOutlined } from '@ant-design/icons-vue';
import { cloneDeep } from 'lodash';
import dayjs from 'dayjs';
import CommonTable from '@/components/common/CommonTable.vue';
//import CommonPagination from '@/components/common/CommonPagination.vue';
import BaseModal from '@/components/common/BaseModal.vue';
import api from '@/api';

const props = defineProps({
	hotelId: {
		type: Number || String,
	},
});

const currentDayjs = dayjs();

const originalColumns = [
	{
		title: '房间',
		dataIndex: 'roomType',
		key: 'roomType',
		width: '200px',
	},
	{
		title: '',
		dataIndex: 'date1',
		key: '1',
		width: '200px',
	},
	{
		title: '',
		dataIndex: 'date2',
		key: '2',
		width: '200px',
	},
	{
		title: '',
		dataIndex: 'date3',
		key: '3',
		width: '200px',
	},
	{
		title: '',
		dataIndex: 'date4',
		key: '4',
		width: '200px',
	},
	{
		title: '',
		dataIndex: 'date5',
		key: '5',
		width: '200px',
	},
	{
		title: '',
		dataIndex: 'date6',
		key: '6',
		width: '200px',
	},
	{
		title: '',
		dataIndex: 'date7',
		key: '7',
		width: '200px',
	},
	{
		title: '',
		dataIndex: 'date8',
		key: '8',
		width: '200px',
	},
	{
		title: '',
		dataIndex: 'date9',
		key: '9',
		width: '200px',
	},
	{
		title: '',
		dataIndex: 'date10',
		key: '10',
		width: '200px',
	},
	{
		title: '',
		dataIndex: 'date11',
		key: '11',
		width: '200px',
	},
	{
		title: '',
		dataIndex: 'date12',
		key: '12',
		width: '200px',
	},
	{
		title: '',
		dataIndex: 'date13',
		key: '13',
		width: '200px',
	},
	{
		title: '',
		dataIndex: 'date14',
		key: '14',
		width: '200px',
	},
	{
		title: '',
		dataIndex: 'date15',
		key: '15',
		width: '200px',
	},
	{
		title: '',
		dataIndex: 'date16',
		key: '16',
		width: '200px',
	},
	{
		title: '',
		dataIndex: 'date17',
		key: '17',
		width: '200px',
	},
	{
		title: '',
		dataIndex: 'date18',
		key: '18',
		width: '200px',
	},
	{
		title: '',
		dataIndex: 'date19',
		key: '19',
		width: '200px',
	},
	{
		title: '',
		dataIndex: 'date20',
		key: '20',
		width: '200px',
	},
	{
		title: '',
		dataIndex: 'date21',
		key: '21',
		width: '200px',
	},
	{
		title: '',
		dataIndex: 'date22',
		key: '22',
		width: '200px',
	},
	{
		title: '',
		dataIndex: 'date23',
		key: '23',
		width: '200px',
	},
	{
		title: '',
		dataIndex: 'date24',
		key: '24',
		width: '200px',
	},
	{
		title: '',
		dataIndex: 'date25',
		key: '25',
		width: '200px',
	},
	{
		title: '',
		dataIndex: 'date26',
		key: '26',
		width: '200px',
	},
	{
		title: '',
		dataIndex: 'date27',
		key: '27',
		width: '200px',
	},
	{
		title: '',
		dataIndex: 'date28',
		key: '28',
		width: '200px',
	},
	{
		title: '',
		dataIndex: 'date29',
		key: '29',
		width: '200px',
	},
	{
		title: '',
		dataIndex: 'date30',
		key: '30',
		width: '200px',
	},
	{
		title: '',
		dataIndex: 'date31',
		key: '31',
		width: '200px',
	},
];

const columns = ref(originalColumns);

const year = ref('');
const month = ref((() => parseInt(currentDayjs.format('M')))());
const yearOptions = ref(
	(() => {
		const result = [];
		const currentDate = currentDayjs;
		const currentYear = parseInt(currentDate.format('YYYY'));
		console.info('currentYear', currentYear);
		for (let i = currentYear - 10; i <= currentYear + 10; i++) {
			result.push({
				value: i,
				label: `${i}年`,
			});
		}
		year.value = currentYear;
		return result;
	})()
);

const monthOptions = ref([
	{
		value: 1,
		label: '1月',
	},
	{
		value: 2,
		label: '2月',
	},
	{
		value: 3,
		label: '3月',
	},
	{
		value: 4,
		label: '4月',
	},
	{
		value: 5,
		label: '5月',
	},
	{
		value: 6,
		label: '6月',
	},
	{
		value: 7,
		label: '7月',
	},
	{
		value: 8,
		label: '8月',
	},
	{
		value: 9,
		label: '9月',
	},
	{
		value: 10,
		label: '10月',
	},
	{
		value: 11,
		label: '11月',
	},
	{
		value: 12,
		label: '12月',
	},
]);

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

const modalState = reactive({
	visible: false,
	baseInfo: {},
	cacheInfo: {},
});

const getCurrentHourAndMinuteText = () => {
	const section = dayjs().format('A');
	const time = dayjs().format('h:mm');
	return `${section}${time}`;
};

const getMonthAndDayText = (date: string) => {
	const currentDate = new Date(date);
	return `${currentDate.getMonth() + 1}月${currentDate.getDate()}号`;
};

const getCurrentTimeDetailTextInLoop = () => {
	setInterval(() => {
		tableState.params.currentTimeDetailText = `${currentDayjs.format('YYYY年MM月DD日')}\u3000${getDayNumText(
			currentDayjs.format('YYYY-MM-DD')
		)}\u3000${getCurrentHourAndMinuteText()}`;
	}, 10000);
};

const getCurrentTimeDetailText = () => {
	tableState.params.currentTimeDetailText = `${currentDayjs.format('YYYY年MM月DD日')}\u3000${getDayNumText(
		currentDayjs.format('YYYY-MM-DD')
	)}\u3000${getCurrentHourAndMinuteText()}`;
};

const dataSource = computed(() => {
	if (Array.isArray(tableState.tableData.data)) {
		return tableState.tableData.data.map((item, index) => {
			const result = {};
			result.roomType = item?.roomTypeName || '';
			if (item?.appointedStockList && Array.isArray(item.appointedStockList)) {
				item.appointedStockList.forEach((innerItem, index) => {
					if (index < 31) {
						result[`date${index + 1}`] = {
							oid: innerItem.oid,
							auditStatus: innerItem.auditStatus,
							appointedTime: innerItem.appointedTime,
							roomStatus: innerItem.roomStatus,
							roomStatusName: innerItem.roomStatusName,
							stockNum: innerItem.stockNum,
							roomTypeName: result.roomType,
							uuid: innerItem.uuid,
						};
						columns.value[index + 1] = {
							...columns.value[index + 1],
							appointedTime: innerItem.appointedTime,
						};
					}
				});
				columns.value = columns.value.filter((item, index) => index < 1 || item?.appointedTime);
				if (columns.value.length < 7) {
					columns.value[0] = {
						...columns.value[0],
						width: `${parseInt((200 * columns.value.length) / 11)}px`,
					};
					console.log('dddddddddddd', parseInt((200 * columns.value.length) / 11));
				}
			}

			console.info(`result${index}`, result);
			//console.info('columns.value', columns.value);
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
	params: {
		currentTimeDetailText: '',
	},
	roleId: undefined,
	auditBusinessType: '',
});

const getHotelRoomTypeStockTableInfo = (hotelId) => {
	if (hotelId) {
		// api.getHotelList(hotelId).then((result) => {
		// 	console.info('酒店列表', result);
		// });
		const startDate = new Date(year?.value, month?.value - 1, 1);
		const startTime = dayjs(startDate);
		console.info('startTime', startTime.format('YYYY-MM-DD'));
		api
			.getHotelRoomStockInFuture({
				startTime: startTime.format('YYYY-MM-DD'),
				endTime: startTime.add(1, 'month').subtract(1, 'day').format('YYYY-MM-DD'),
				hotelId: props.hotelId,
			})
			.then((result) => {
				tableState.tableData.data = result;
				console.info('酒店房间库存信息', result);
			});
	} else {
		tableState.tableData.data = [];
	}
};

watch(
	() => props.hotelId,
	(hotelId) => {
		console.info('hotelId change');
		getCurrentTimeDetailText();
		getCurrentTimeDetailTextInLoop();
		getHotelRoomTypeStockTableInfo(hotelId);
	},
	{
		immediate: true,
	}
);

watch(
	() => year.value,
	() => {
		console.info('year.value change');
		tableState.tableData.data = [];
		columns.value = cloneDeep(originalColumns);
		getHotelRoomTypeStockTableInfo(props.hotelId);
	}
);

watch(
	() => month.value,
	() => {
		console.info('month.value change');
		tableState.tableData.data = [];
		columns.value = cloneDeep(originalColumns);
		getHotelRoomTypeStockTableInfo(props.hotelId);
	}
);

const openRoomStatusDetailsModal = (data: any) => {
	console.log('当前单元格数据：', data);
	tableState.roleId = undefined;
	tableState.auditBusinessType = '';
	if (data?.auditStatus === 0 && data?.uuid) {
		api.getRoleId({ uuid: data?.uuid }).then((res) => {
			console.log('sssss', res);
			if (Array.isArray(res)) {
				tableState.roleId = res[0]?.roleId;
				tableState.auditBusinessType = res[0].auditBusinessType;
			}
			modalState.visible = true;
			modalState.baseInfo = cloneDeep(data);
			modalState.cacheInfo = cloneDeep(data);
		});
	} else {
		modalState.visible = true;
		modalState.baseInfo = cloneDeep(data);
		modalState.cacheInfo = cloneDeep(data);
	}
};

const addStockNum = () => {
	console.info('modalState.cacheInfo.stockNum', modalState.cacheInfo.stockNum);
	if (modalState.baseInfo.stockNum < modalState.cacheInfo.stockNum) {
		modalState.baseInfo.stockNum = modalState.baseInfo.stockNum + 1;
	}
};

const reduceStockNum = () => {
	if (modalState.baseInfo.stockNum > 0) {
		modalState.baseInfo.stockNum = modalState.baseInfo.stockNum - 1;
	}
};

const saveModalInfo = () => {
	api
		.editHotelRoomStock({
			oid: modalState.baseInfo?.oid,
			roomStatus: modalState.baseInfo?.roomStatus,
			stockNum: modalState.baseInfo?.stockNum,
		})
		.then((response) => {
			modalState.visible = false;
			console.log('提交审核 返回：', response);
			getHotelRoomTypeStockTableInfo(props?.hotelId);
		});
};

const passModalInfo = () => {
	if (modalState.baseInfo?.oid) {
		// console.info({
		// 	oid: modalState.baseInfo?.oid,
		// 	roleId: tableState?.roleId,
		// 	auditBusinessType: tableState?.auditBusinessType,
		// });
		api
			.hotelRoomStockPass({
				oid: modalState.baseInfo?.oid,
				roleId: tableState?.roleId,
				auditBusinessType: tableState?.auditBusinessType,
			})
			.then((res: any) => {
				console.log('审核通过 返回：', res);
				modalState.visible = false;
				// setTimeout(() => {
				// 	getHotelRoomTypeStockTableInfo(props?.hotelId);
				// }, 1000);
				getHotelRoomTypeStockTableInfo(props?.hotelId);
			});
	}
};

const failModalInfo = () => {
	if (modalState.baseInfo?.oid) {
		api
			.hotelRoomStockFailed({
				oid: modalState.baseInfo?.oid,
				roleId: tableState?.roleId,
				auditBusinessType: tableState?.auditBusinessType,
			})
			.then((res: any) => {
				console.log('审核不通过 返回：', res);
				modalState.visible = false;
				// setTimeout(() => {
				// 	getHotelRoomTypeStockTableInfo(props?.hotelId);
				// }, 1000);
				getHotelRoomTypeStockTableInfo(props?.hotelId);
			});
	}
};

// const onHandleCurrentChange = (val: number) => {
// 	console.log('change:', val);
// 	tableState.tableData.param.pageNo = val;
// 	//onSearch();
// 	getHotelRoomTypeStockTableInfo(props?.hotelId);
// };

// const pageSideChange = (current: number, size: number) => {
// 	console.log('changePageSize:', size);
// 	tableState.tableData.param.pageSize = size;
// 	//onSearch();
// 	getHotelRoomTypeStockTableInfo(props?.hotelId);
// };
</script>

<style lang="less" scoped>
@import './styles/roomBookingTable.less';
</style>
