<template>
	<div>
		<CommonTable :columns="columns" :dataSource="state.tableData.data">
			<template #bodyCell="{ column, record }">
				<template v-if="column.dataIndex === 'actions'">
					<div class="action-btns">
						<a @click="openInfoPage(record.orderNo)">查看</a>
					</div>
				</template>
				<template v-if="column.key == 'reduceAfterAmount'">
					{{ accDiv(record.reduceAfterAmount, 100) }}
				</template>
			</template>
		</CommonTable>
		<CommonPagination
			:current="hotelStore.HotelList.cancal.params.pageNo"
			:page-size="hotelStore.HotelList.cancal.params.pageSize"
			:total="state.tableData.total"
			@change="onHandleCurrentChange"
			@showSizeChange="pageSideChange"
		>
		</CommonPagination>
	</div>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import BaseModal from '@/components/common/BaseModal.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import api from '@/api';
import { SelectProps, TableColumnsType } from 'ant-design-vue';
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { HotelStatus } from '@/enum';
import { useHotelStore } from '@/stores/modules/hotelManage';
import { accDiv } from '@/utils/compute.js';

const router = useRouter();
const hotelStore = useHotelStore();
const navigatorBar = useNavigatorBar();
const columns = [
	{
		title: '行程单号',
		dataIndex: 'itineraryNo',
		key: 'itineraryNo',
	},
	{
		title: '旅行社名称',
		dataIndex: 'travelName',
		key: 'travelName',
	},
	{
		title: '预定时间',
		dataIndex: 'createTime',
		key: 'createTime',
	},
	{
		title: '入住时间',
		dataIndex: 'arrivalDate',
		key: 'arrivalDate',
	},
	{
		title: '离店时间',
		dataIndex: 'departureDate',
		key: 'departureDate',
	},
	{
		title: '预定人数',
		dataIndex: 'scheduledNumber',
		key: 'scheduledNumber',
	},
	{
		title: '预定房数',
		dataIndex: 'scheduledRooms',
		key: 'scheduledRooms',
	},
	{
		title: '费用（元）',
		dataIndex: 'reduceAfterAmount',
		key: 'reduceAfterAmount',
	},
	{
		title: '操作',
		dataIndex: 'actions',
		key: 'actions',
		fixed: 'right',
		width: 120,
	},
];

const state = reactive({
	tableData: {
		data: computed(() => hotelStore.HotelList.cancal.list),
		total: computed(() => hotelStore.HotelList.cancal.total),
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			status:0
		},
	},
});

const onHandleCurrentChange = (val: any) => {
	hotelStore.HotelList.cancal.params.pageNo = val
	// state.tableData.param.pageNo = val;
	hotelOrderPage();
};

const pageSideChange = (current: number, size: number) => {
	// console.log('changePageSize:', size);
	// state.tableData.param.pageSize = size;
	// onSearch();
};

const hotelOrderPage = async () => {
	hotelStore.HotelList.cancal.params.status = HotelStatus.cancal
	const res = await api.hotelOrderPage(hotelStore.HotelList.cancal.params);
	hotelStore.setOrderList(res, 'cancal')
};

const openInfoPage = (orderNo: any) => {
	router.push({ path: '/hotelManagement/hotelOrder/orderEdit', query: { orderNo: orderNo } });
};

onMounted(() => {
	navigatorBar.setNavigator(['订单管理']);
	hotelOrderPage();
});
onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
});
</script>

<style scoped lang="less">
// table style
.ant-table-thead > tr > th {
	border-top: 1px solid #f0f0f0;
	background-color: #fcfcfc;
	&::before {
		height: 100% !important;
	}
}
.ant-table-body {
	height: 500px;
}
</style>
