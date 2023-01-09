<template>
	<div>
		<CommonTable :columns="columns" :dataSource="state.tableData.data" :scrollY="false" :showExpandColumn="true" rowKey="itineraryId">
			<template #bodyCell="{ column, record }">
				<template v-if="column.dataIndex === 'itineraryStartDate'">
					<span>{{ record.itineraryStartDate }}~{{ record.itineraryEndDate }}</span>
				</template>
				<template v-if="column.dataIndex === 'actions'">
					<div class="action-btns">
						<a @click="toSee(record.oid)" v-permission="'审核通过_查看'">查看</a>
					</div>
				</template>
			</template>
			<template #expandedRowRender>
				<a-table :columns="innerColumns" :data-source="state.tableData.data" :pagination="false">
					<template #bodyCell="{ column, record }">
						<template v-if="column.dataIndex === 'actions'">
					<div class="action-btns">
						<a @click="toSee(record.oid)" v-permission="'审核通过_查看'">查看</a>
					</div>
				</template>
					</template>
				</a-table>
    		</template>
		</CommonTable>
		<CommonPagination
			:current="gouvyStore.gouvyList.success.params.pageNo"
			:page-size="gouvyStore.gouvyList.success.params.pageSize"
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
const navigatorBar = useNavigatorBar();
const gouvyStore = useGouvyStore();
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
		title: '团队类型',
		dataIndex: 'teamTypeName',
		key: 'teamTypeName',
	},
	{
		title: '行程人数',
		dataIndex: 'touristNum',
		key: 'touristNum',
	},
	// {
	// 	title: '减免人数',
	// 	dataIndex: 'reduceNum',
	// 	key: 'reduceNum',
	// },
	// {
	// 	title: '操作',
	// 	dataIndex: 'actions',
	// 	key: 'actions',
	// 	fixed: 'right',
	// 	width: 160,
	// },
];
const innerColumns = [
	{
		title: '提交审核时间',
		dataIndex: 'routeName',
		key: 'routeName',
	},
	{
		title: '提交审核人',
		dataIndex: 'travelName',
		key: 'travelName',
	},
	{
		title: '审核完成时间',
		dataIndex: 'subTravelName',
		key: 'subTravelName',
	},
	{
		title: '审核人',
		dataIndex: 'subTravelName',
		key: 'subTravelName',
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
		data: computed(() => gouvyStore.gouvyList.success.list),
		total: computed(() => gouvyStore.gouvyList.success.total),
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			auditStatus: 1,
		},
	},
});

const onHandleCurrentChange = (val: number) => {
	gouvyStore.gouvyList.success.params.pageNo = val;
	getSuccessList();
};

const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	// state.tableData.param.pageSize = size;
	// onSearch();
};

const getSuccessList = async () => {
	gouvyStore.gouvyList.success.params.auditStatus = GouvyStatus.success;
	const res = await api.exemptionManagementList(gouvyStore.gouvyList.success.params);
	gouvyStore.setOrderList(res, 'success');
};

const toSee = (oid :any) => {
	router.push({ path: '/gouvyManagement/exemptionManagement/exemption-management_edit' , query: { oid:oid } });
};

onMounted(() => {
	getSuccessList();
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
