<template>
	<div>
		<CommonTable :columns="columns" :dataSource="state.tableData.data" :scrollY="false">
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
			:current="gouvyStore.revocationManagementList.refuse.params.pageNo"
			:page-size="gouvyStore.revocationManagementList.refuse.params.pageSize"
			:total="state.tableData.total"
			@change="onHandleCurrentChange"
			@showSizeChange="pageSideChange"
		>
		</CommonPagination>
		<Details v-model="state.isDialogVisible" :oid="state.oid"></Details>
	</div>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import api from '@/api';
import { SelectProps, TableColumnsType } from 'ant-design-vue';
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import Details from './details.vue';
import { revocationStatus } from '@/enum';
import { useGouvyStore } from '@/stores/modules/gouvy';
const router = useRouter();
const gouvyStore = useGouvyStore();
const navigatorBar = useNavigatorBar();
const visible = ref(false);
const columns = [
	{
		title: '原始行程单号',
		dataIndex: 'itineraryNo',
		key: 'itineraryNo',
	},
	{
		title: '线路名称',
		dataIndex: 'routeName',
		key: 'routeName',
	},
	{
		title: '发团社',
		dataIndex: 'travelName',
		key: 'travelName',
	},
	{
		title: '接团社',
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
		title: '原始减免人数',
		dataIndex: 'originalReduceNum',
		key: 'originalReduceNum',
	},
    {
		title: '出票状态',
		dataIndex: 'issueStatusName',
		key: 'issueStatusName',
	},
    {
		title: '查验状态',
		dataIndex: 'checkStatusName',
		key: 'checkStatusName',
	},
    {
		title: '撤销时间',
		dataIndex: 'revokeTime',
		key: 'revokeTime',
	},
    {
		title: '重提后变更人数',
		dataIndex: 'peopleChangeCount',
		key: 'peopleChangeCount',
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
		data: computed(() => gouvyStore.revocationManagementList.refuse.list),
		total: computed(() => gouvyStore.revocationManagementList.refuse.total),
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			tabNo:2,
		},
	},
	oid:'',
	isDialogVisible:false,
});

const onHandleCurrentChange = (val: number) => {
	gouvyStore.revocationManagementList.refuse.params.pageNo = val;
	getRefuseList();
};

const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	// state.tableData.param.pageSize = size;
	// onSearch();
};

const getRefuseList = async () => {
	gouvyStore.revocationManagementList.refuse.params.tabNo = revocationStatus.refuse;
	const res = await api.gouvyRepealNreapplyPageList(gouvyStore.revocationManagementList.refuse.params);
	gouvyStore.setRevocationManagementList(res, 'refuse');
};

const toSee=(oid :any)=>{
	state.oid=oid
	state.isDialogVisible=true
}

onMounted(() => {
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
