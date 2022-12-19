<template>
	<div>
		<CommonTable :columns="columns" :dataSource="state.tableData.data">
			<template #bodyCell="{ column, record }">
				<template v-if="column.dataIndex === 'actions'">
					<div class="action-btns">
						<a @click="visible = true">申请改刷</a>
						<a @click="Vdetail = true">详情</a>
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
			:current="hotelStore.HotelList.finish.params.pageNo"
			:page-size="hotelStore.HotelList.finish.params.pageSize"
			:total="state.tableData.total"
			@change="onHandleCurrentChange"
			@showSizeChange="pageSideChange"
		>
		</CommonPagination>
		<BaseModal :title="'申请改刷'" v-model="visible">
			<a-form>
				<a-form-item label="当前房数">
					<span>222</span>
				</a-form-item>
				<a-form-item label="申请改刷房数">
					<a-input placeholder="请输入正确的数量" />
				</a-form-item>
				<a-form-item label="改刷凭证">
					<pic></pic>
				</a-form-item>
			</a-form>
			<template v-slot:footer>
				<a-button type="primary" @click="visible = false" style="width: 88px">提交申请</a-button>
				<a-button style="width: 76px" @click="visible = false">取消</a-button>
			</template>
		</BaseModal>
		<BaseModal :title="'审核'" v-model="Vdetail">
			<a-form>
				<a-form-item label="状态" >
					<a-radio-group v-model:value="type">
						<a-radio value="1">通过</a-radio>
						<a-radio value="2">不通过</a-radio>
					</a-radio-group>
				</a-form-item>
				<a-form-item label="">
					<a-textarea placeholder="审核不通过原因" :rows="4" disabled />
				</a-form-item>
			</a-form>
			<template v-slot:footer>
				<a-button style="width: 76px" @click="Vdetail = false">关闭</a-button>
			</template>
		</BaseModal>
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
import { accDiv } from '@/utils/compute.js';

const visible = ref(false);
const Vdetail = ref(false);

const hotelStore = useHotelStore();
const router = useRouter();
const navigatorBar = useNavigatorBar();
const type = ref('2');
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

const state = reactive({
	tableData: {
		data: computed(() => hotelStore.HotelList.finish.list),
		total: computed(() => hotelStore.HotelList.finish.total),
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			scheduledTime: null,
			arrivalDate: null,
			status: null,
			itineraryNo:null
		},
	},
});

const onHandleCurrentChange = (val: any) => {
	hotelStore.HotelList.finish.params.pageNo = val
	// state.tableData.param.pageNo = val;
	hotelOrderPage();
};

const pageSideChange = (current: number, size: number) => {
	// console.log('changePageSize:', size);
	// state.tableData.param.pageSize = size;
	// // onSearch();
};

const hotelOrderPage = async () => {
	hotelStore.HotelList.finish.params.status = HotelStatus.finish
	const res = await api.hotelOrderPage(hotelStore.HotelList.finish.params);
	hotelStore.setOrderList(res, 'finish')
};

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
