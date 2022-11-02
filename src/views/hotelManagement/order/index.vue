<template>
	<div>
		<CommonSearch>
			<search-item label="预定时间">
				<a-space direction="vertical">
					<a-date-picker v-model:value="hotelStore.HotelList[chart].params.scheduledTime" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
				</a-space>
			</search-item>
			<search-item label="入住时间">
				<a-space direction="vertical">
					<a-date-picker v-model:value="hotelStore.HotelList[chart].params.arrivalDate" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
				</a-space>
			</search-item>
			<search-item label="行程单号">
				<a-input placeholder="请输入行程单号" v-model:value="hotelStore.HotelList[chart].params.itineraryNo" />
			</search-item>
			<template #button>
				<a-button style="margin-right: 30px"  @click="reset">重置</a-button>
				<a-button @click="onSearch">查询</a-button>
			</template>
		</CommonSearch>
		<div class="trave-contaner">
			<a-tabs v-model:activeKey="activeKey">
				<a-tab-pane v-for="item in pages" :key="item.value" :tab="item.label">
					<component :onCheck="check" :is="item.name"></component>
				</a-tab-pane>
			</a-tabs>
		</div>
	</div>
</template>
<script lang="ts" setup>
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import { useHotelStore,hotelListParams } from '@/stores/modules/hotelManage';
import api from '@/api';
import { HotelStatus } from '@/enum';
import waits from './wait/index.vue';
import success from './success/index.vue';
import refuse from './refuse/index.vue';
import finish from './finish/index.vue';
import cancal from './cancal/index.vue';
import { cloneDeep } from 'lodash';
import { Field } from './type/index';

const hotelStore = useHotelStore();
const activeKey = ref(HotelStatus.waits);
const check = ref(false);
const params = reactive({
	scheduledTime: '',
	arrivalDate: '',
	itineraryNo: '',
	status: '',
});

const pages = [
	{
		name: waits,
		label: hotelStore.HotelOrderStatus[HotelStatus.waits],
		value: HotelStatus.waits,
		chart: 'waits',
	},
	{
		name: success,
		label: hotelStore.HotelOrderStatus[HotelStatus.success],
		value: HotelStatus.success,
		chart: 'success',
	},
	{
		name: refuse,
		label: hotelStore.HotelOrderStatus[HotelStatus.refuse],
		value: HotelStatus.refuse,
		chart: 'refuse',
	},
	// {
	// 	name: cancal,
	// 	label: hotelStore.HotelOrderStatus[HotelStatus.cancal],
	// 	value: HotelStatus.cancal,
	// 	chart: 'cancal',
	// },
	// {
	// 	name: finish,
	// 	label: hotelStore.HotelOrderStatus[HotelStatus.finish],
	// 	value: HotelStatus.finish,
	// 	chart: 'finish',
	// },
];

const chart = computed(() => pages.filter((it: any) => it.value === activeKey.value)[0].chart as Field);

//查询
const onSearch = async () => {
	let chartField: Field = chart.value;
	let storeParams = hotelStore.HotelList[chartField].params;
	hotelStore.HotelList[chartField].params.status = activeKey.value;
	hotelStore.HotelList[chartField].params.scheduledTime = storeParams.scheduledTime;
	hotelStore.HotelList[chartField].params.arrivalDate = storeParams.arrivalDate;
	hotelStore.HotelList[chartField].params.itineraryNo = storeParams.itineraryNo;
	// travelStore.traveList[chartField].params.endDate = storeParams.time[1];
	let params = cloneDeep(hotelStore.HotelList[chartField].params);
	// params.groupType = params.groupType === '0' ? '' : params.groupType;
	const res = await api.hotelOrderPage(params);
	hotelStore.setOrderList(res, chartField);
};
const reset = () => {
	let chartField: Field = chart.value;
	hotelStore.HotelList[chartField].params = cloneDeep(hotelListParams.params);
	onSearch();
};
</script>
<style lang="less" scoped>
.trave-contaner {
	height: 100%;
	::v-deep(.ant-tabs-nav) {
		padding: 16px 20px;
	}
	// ::v-deep(.ant-tabs-content-holder) {
	//   padding: 0 20px;
	// }
}

.footer {
	position: sticky;
	bottom: 0;
	line-height: 64px;
	width: 100%;
	border-top: 1px solid #f1f2f5;
	background-color: #fff;
	padding-left: 16px;
	z-index: 99;
	button:first-of-type {
		margin-right: 16px;
	}
}
</style>
