<template>
	<div>
		<CommonTable :columns="columns" :dataSource="state.tableData.data">
			<template #bodyCell="{ column, record }">
				<template v-if="column.dataIndex === 'actions'">
					<div class="action-btns">
						<a @click="openbrushup(record.orderNo)" v-permission="'改刷中_去审核'">去审核</a>
						<a @click="openbrushupdetail(record.orderNo)" v-permission="'改刷中_详情'">详情</a>
					</div>
				</template>
				<template v-if="column.key == 'reduceAfterAmount'">
					{{ accDiv(record.reduceAfterAmount, 100) }}
				</template>
				<template v-if="column.key === 'expenses'">
					<div>
						{{ accDiv(accMul(record.orderAmount, record.verificationRoom), 100) || 0 }}
					</div>
				</template>
				<template v-if="column.key == 'fullRule'"> 满{{ record.fullRule }} 减 {{ record.reduceRule }} </template>
			</template>
		</CommonTable>
		<CommonPagination
			:current="hotelStore.HotelList.brushingup.params.pageNo"
			:page-size="hotelStore.HotelList.brushingup.params.pageSize"
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
import Pic from '@/components/common/imageWrapper.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import BaseModal from '@/components/common/BaseModal.vue';
import api from '@/api';
import Upload from '@/components/common/imageWrapper.vue';
import { SelectProps, TableColumnsType } from 'ant-design-vue';
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { HotelStatus } from '@/enum';
import { useHotelStore } from '@/stores/modules/hotelManage';
import { accDiv, accMul } from '@/utils/compute.js';

const hotelStore = useHotelStore();
const router = useRouter();
const navigatorBar = useNavigatorBar();
const columns = [
	{
		title: '订单编号',
		dataIndex: 'orderNo',
		key: 'orderNo',
	},
	{
		title: '行程单号',
		dataIndex: 'itineraryNo',
		key: 'itineraryNo',
	},
	{
		title: '入住时间',
		dataIndex: 'arrivalDate',
		key: 'arrivalDate',
	},
	{
		title: '预定时间',
		dataIndex: 'createTime',
		key: 'createTime',
	},
	{
		title: '离店时间',
		dataIndex: 'departureDate',
		key: 'departureDate',
	},
	{
		title: '预定总房数',
		dataIndex: 'scheduledRooms',
		key: 'scheduledRooms',
	},
	{
		title: '费用（元）',
		dataIndex: 'reduceAfterAmount',
		key: 'reduceAfterAmount',
	},
	{
		title: '核销时间',
		dataIndex: 'verificationTime',
		key: 'verificationTime',
	},
	{
		title: '改刷申请时间',
		dataIndex: 'orderResetTime',
		key: 'orderResetTime',
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
		data: computed(() => hotelStore.HotelList.brushingup.list),
		total: computed(() => hotelStore.HotelList.brushingup.total),
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			scheduledTime: '',
			arrivalDate: '',
			itineraryNo: '',
			orderStatus: '5',
		},
	},
});

const onHandleCurrentChange = (val: any) => {
	hotelStore.HotelList.brushingup.params.pageNo = val;
	hotelOrderPage();
};

const pageSideChange = (current: number, size: number) => {
	hotelStore.HotelList.brushingup.params.pageSize = size;
	hotelOrderPage();
};

const hotelOrderPage = async () => {
	hotelStore.HotelList.brushingup.params.orderStatus = 5;
	hotelStore.HotelList.brushingup.params.status = null;
	await api.hotelOrderPage(hotelStore.HotelList.brushingup.params).then((res: any) => {
		hotelStore.setOrderList(res, 'brushingup');
	});
};

const openbrushup = (orderNo: any) => {
	router.push({ path: '/hotelManagement/hotelOrder/orderBrushUp', query: { orderNo: orderNo, process: 1 } });
};

const openbrushupdetail = (orderNo: any) => {
	router.push({ path: '/hotelManagement/hotelOrder/orderBrushUp', query: { orderNo: orderNo, detail: 2} });
};

onMounted(() => {
	// navigatorBar.setNavigator(['订单管理']);
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
