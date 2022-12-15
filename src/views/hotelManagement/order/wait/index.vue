<template>
	<div>
		<CommonTable :columns="columns" :dataSource="state.tableData.data">
			<template #bodyCell="{ column, record }">
				<template v-if="column.dataIndex === 'actions'">
					<div class="action-btns">
						<!-- <a @click="visible = true" >查看</a> -->
						<a v-if="record.auditStatus == 1" @click="openInfoPage(record.orderNo)" v-permission="'待审核_审核'">审核</a>
						<a v-permission="'待审核_打印票据'">打印票据</a>
					</div>
				</template>
				<template v-if="column.key == 'reduceAfterAmount'">
					{{ accDiv(record.reduceAfterAmount, 100) }}
				</template>
				<template v-if="column.key == 'fullRule'">
					满{{ record.fullRule }} 减 {{ record.reduceRule }}
				</template>
			</template>
		</CommonTable>
		<CommonPagination
			:current="hotelStore.HotelList.waits.params.pageNo"
			:page-size="hotelStore.HotelList.waits.params.pageSize"
			:total="state.tableData.total"
			@change="onHandleCurrentChange"
			@showSizeChange="pageSideChange"
		>
		</CommonPagination>
		<!-- <BaseModal :title="'审核'" v-model="visible">
			<a-form>
				<a-form-item label="状态">
					<a-radio-group v-model:value="state.tableData.type">
						<a-radio value="1">通过</a-radio>
						<a-radio value="2">不通过</a-radio>
					</a-radio-group>
				</a-form-item>
				<a-form-item label="">
					<a-textarea placeholder="审核不通过原因" :rows="4" :disabled="state.tableData.type == 1" />
				</a-form-item>
			</a-form>
			<template v-slot:footer>
				<a-button style="width: 76px" @click="visible = false">关闭</a-button>
			</template>
		</BaseModal> -->
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
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { HotelStatus } from '@/enum';
import { useHotelStore } from '@/stores/modules/hotelManage';
import { accDiv } from '@/utils/compute.js';

const hotelStore = useHotelStore();
const router = useRouter();
const navigatorBar = useNavigatorBar();
const visible = ref(false);
const columns = [
	{
		title: '订单编号',
		dataIndex: 'orderNo',
		key: 'orderNo',
	},
	{
		title: '酒店名称',
		dataIndex: 'hotelName',
		key: 'hotelName',
	},
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
		title: '预定房数',
		dataIndex: 'scheduledRooms',
		key: 'scheduledRooms',
	},
	{
		title: '减免规则',
		dataIndex: 'fullRule',
		key: 'fullRule',
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
		width: 160,
	},
];

const state = reactive({
	tableData: {
		data: computed(() => hotelStore.HotelList.waits.list),
		total: computed(() => hotelStore.HotelList.waits.total),
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			status: 1,
		},
		type: '1',
	},
});

const onHandleCurrentChange = (val: any) => {
	hotelStore.HotelList.waits.params.pageNo = val;
	// state.tableData.param.pageNo = val;
	hotelOrderPage();
};

const pageSideChange = (current: number, size: number) => {
	// console.log('changePageSize:', size);
	// state.tableData.param.pageSize = size;
};

const hotelOrderPage = async () => {
	hotelStore.HotelList.waits.params.status = HotelStatus.waits;
	const res = await api.hotelOrderPage(hotelStore.HotelList.waits.params);
	hotelStore.setOrderList(res, 'waits');
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
