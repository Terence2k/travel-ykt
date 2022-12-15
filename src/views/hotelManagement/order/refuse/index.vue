<template>
	<div>
		<CommonTable :columns="columns" :dataSource="state.tableData.data">
			<template #bodyCell="{ column, record }">
				<template v-if="column.dataIndex === 'actions'">
					<div class="action-btns">
						<a @click="rejectReason(record.orderNo)" v-permission="'审核不通过_查看说明'">查看说明</a>
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
			:current="hotelStore.HotelList.refuse.params.pageNo"
			:page-size="hotelStore.HotelList.refuse.params.pageSize"
			:total="state.tableData.total"
			@change="onHandleCurrentChange"
			@showSizeChange="pageSideChange"
		>
		</CommonPagination>
		<BaseModal :title="'审核'" v-model="visible">
			<a-form>
				<a-form-item label="状态"> 审核不通过 </a-form-item>
				<a-form-item label="原因">
					<a-textarea placeholder="审核不通过原因" v-model:value="state.reject" :rows="4" disabled />
				</a-form-item>
			</a-form>
			<template v-slot:footer>
				<a-button style="width: 76px" @click="visible = false">关闭</a-button>
			</template>
		</BaseModal>
	</div>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import BaseModal from '@/components/common/BaseModal.vue';
import api from '@/api';
import { SelectProps, TableColumnsType } from 'ant-design-vue';
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { HotelStatus } from '@/enum';
import { useHotelStore } from '@/stores/modules/hotelManage';
import { accDiv } from '@/utils/compute.js';

const router = useRouter();
const hotelStore = useHotelStore();
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
		width: 120,
	},
];
const type = ref('2');

const state = reactive({
	tableData: {
		data: computed(() => hotelStore.HotelList.refuse.list),
		total: computed(() => hotelStore.HotelList.refuse.total),
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			status: -1,
		},
	},
	reject:''
});

const onHandleCurrentChange = (val: any) => {
	hotelStore.HotelList.refuse.params.pageNo = val
	// state.tableData.param.pageNo = val;
	hotelOrderPage();
};

const pageSideChange = (current: number, size: number) => {
	// console.log('changePageSize:', size);
	// state.tableData.param.pageSize = size;
	// onSearch();
};

const hotelOrderPage = async () => {
	hotelStore.HotelList.refuse.params.status = HotelStatus.refuse
	const res = await api.hotelOrderPage(hotelStore.HotelList.refuse.params);
	hotelStore.setOrderList(res, 'refuse')
};

const rejectReason = (orderNo:any) => {
	api.HotelOrderRejectReason(orderNo).then((res: any) => {
    state.reject = res
  })
  visible.value = true
}

const openInfoPage = (record: any) => {
	router.push({ path: '/catering/basic_Information/basic_info', query: { oid: record.oid } });
};
const openEditPage = (record: any) => {
	router.push({ path: '/catering/basic_Information/basic_edit', query: { oid: record.oid } });
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
