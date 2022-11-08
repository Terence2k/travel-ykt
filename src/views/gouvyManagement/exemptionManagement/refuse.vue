<template>
	<div>
		<CommonTable :columns="columns" :dataSource="state.tableData.data">
			<template #bodyCell="{ column, record }">
				<template v-if="column.dataIndex === 'itineraryStartDate'">
					<span>{{ record.itineraryStartDate }}~{{ record.itineraryEndDate }}</span>
				</template>
				<template v-if="column.dataIndex === 'actions'">
					<div class="action-btns">
						<a @click="toSee(record.oid)">查看</a>
					</div>
				</template>
			</template>
		</CommonTable>
		<CommonPagination
			:current="gouvyStore.gouvyList.refuse.params.pageNo"
			:page-size="gouvyStore.gouvyList.refuse.params.pageSize"
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
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import api from '@/api';
import { SelectProps, TableColumnsType } from 'ant-design-vue';
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import details from './details.vue';
import { GouvyStatus } from '@/enum';
import { useGouvyStore } from '@/stores/modules/gouvy';
const router = useRouter();
const gouvyStore = useGouvyStore();
const navigatorBar = useNavigatorBar();
const visible = ref(false);
const columns = [
	{
		title: '行程单号',
		dataIndex: 'itineraryNo',
		key: 'itineraryNo',
	},
	{
		title: '线路名称',
		dataIndex: 'routeName',
		key: 'routeName',
	},
	{
		title: '发团旅行社',
		dataIndex: 'travelName',
		key: 'travelName',
	},
	{
		title: '接团旅行社',
		dataIndex: 'subTravelName',
		key: 'subTravelName',
	},
	{
		title: '行程日期',
		dataIndex: 'itineraryStartDate',
		key: 'itineraryStartDate',
	},
	{
		title: '行程人数',
		dataIndex: 'touristNum',
		key: 'touristNum',
	},
	{
		title: '减免人数',
		dataIndex: 'reduceNum',
		key: 'reduceNum',
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
		data: computed(() => gouvyStore.gouvyList.refuse.list),
		total: computed(() => gouvyStore.gouvyList.refuse.total),
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			auditStatus: -1,
		},
		type: '1',
	},
});

const onHandleCurrentChange = (val: number) => {
	gouvyStore.gouvyList.refuse.params.pageNo = val;
	// state.tableData.param.pageNo = val;
	getRefuseList();
};

const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	// state.tableData.param.pageSize = size;
	// onSearch();
};

const getRefuseList = async () => {
	gouvyStore.gouvyList.refuse.params.auditStatus = GouvyStatus.refuse;
	const res = await api.exemptionManagementList(gouvyStore.gouvyList.refuse.params);
	gouvyStore.setOrderList(res, 'refuse');
};

const toSee=(oid :any)=>{
	router.push({ path: '/gouvyManagement/exemptionManagement/exemption-management_edit' , query: { oid:oid }});
}

onMounted(() => {
	// navigatorBar.setNavigator(['订单管理']);
	getRefuseList();
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
