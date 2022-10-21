<template>
	<div class="roomStatus-table-wrapper">
		<CommonTable :columns="columns" :dataSource="dataSource" :row-selection="rowSelection">
			<template #bodyCell="{ column }">
				<!-- <template v-if="column.dataIndex === 'auditStatus'">
				<div class="cell-auditStatus">
					<span class="item">{{ getAuditStatusName(parseInt(record?.auditStatus)) }}</span>
				</div>
			</template> -->
				<template v-if="column.dataIndex === 'actions'">
					<div class="cell-actions">
						<template v-if="role === 'hotel'">
							<span @click="openEditPage" class="item">编辑</span>
							<span class="item">查看</span>
						</template>
						<template v-else-if="role === 'admin' && tabName === 'alReport'">
							<span class="item">标记异常</span>
							<span class="item">查看</span>
							<span class="item">导出</span>
						</template>
						<template v-else-if="role === 'admin' && tabName === 'noReport'">
							<span class="item">提醒提报</span>
						</template>
					</div>
				</template>
			</template>
		</CommonTable>
		<CommonPagination
			class="pagination-custom"
			:current="tableState.tableData.param.pageNo"
			:page-size="tableState.tableData.param.pageSize"
			:total="tableState.tableData.total"
			@change="onHandleCurrentChange"
			@showSizeChange="pageSideChange"
		>
		</CommonPagination>
	</div>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import { useRoomStatusStore } from '@/stores/modules/roomStatus';

const useRoomStatus = useRoomStatusStore();
const router = useRouter();
const props = defineProps({
	role: {
		type: String,
		default: '',
	},

	tabName: {
		type: String,
		default: '',
	},
});
interface DataSourceItem {
	id: string | number;
	key: string | number;
	date: string;
	roomTotal: number;
	byOneCard: number;
	byOffline: number;
	supervisionFee: number;
	emptyRoomTotal: number;
	occupancyRate: string;
	filer: string;
	reportDate: string;
	tickStatus: string;
}

const tempDataSource = ref([]);

const columns: TableColumnsType = [
	{
		title: '日期',
		dataIndex: 'date',
		key: 'date',
	},
	{
		title: '房间数量',
		dataIndex: 'roomTotal',
		key: 'roomTotal',
	},
	{
		title: '一卡通入住',
		dataIndex: 'byOneCard',
		key: 'byOneCard',
		sorter: {
			compare: (a, b) => a.byOneCard - b.byOneCard,
			multiple: 1,
		},
	},
	{
		title: '线下入住',
		dataIndex: 'byOffline',
		key: 'byOffline',
		sorter: {
			compare: (a, b) => a.byOffline - b.byOffline,
			multiple: 1,
		},
	},
	{
		title: '监理费（元）',
		dataIndex: 'supervisionFee',
		key: 'supervisionFee',
		sorter: {
			compare: (a, b) => a.supervisionFee - b.supervisionFee,
			multiple: 1,
		},
	},
	{
		title: '空房数（标）',
		dataIndex: 'emptyRoomTotal',
		key: 'emptyRoomTotal',
		sorter: {
			compare: (a, b) => a.emptyRoomTotal - b.emptyRoomTotal,
			multiple: 1,
		},
	},
	{
		title: '入住率',
		dataIndex: 'occupancyRate',
		key: 'occupancyRate',
		sorter: {
			compare: (a, b) => a.occupancyRate - b.occupancyRate,
			multiple: 1,
		},
	},
	{
		title: '提报人',
		dataIndex: 'filer',
		key: 'filer',
	},
	{
		title: '提报时间',
		dataIndex: 'reportDate',
		key: 'reportDate',
	},
	{
		title: '标记状态',
		dataIndex: 'tickStatus',
		key: 'tickStatus',
	},
	{
		title: '操作',
		dataIndex: 'actions',
		key: 'actions',
		fixed: 'right',
		width: 200,
	},
];

const rowSelection = computed(() => {
	return {
		onChange: (selectedRowKeys: (string | number)[], selectedRows: DataSourceItem[]) => {
			console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
		},
		onSelect: (record: DataSourceItem, selected: boolean, selectedRows: DataSourceItem[]) => {
			console.log(record, selected, selectedRows);
		},
		onSelectAll: (selected: boolean, selectedRows: DataSourceItem[], changeRows: DataSourceItem[]) => {
			console.log(selected, selectedRows, changeRows);
		},
	};
});

const dataSource = computed(() => {
	if (Array.isArray(tableState.tableData.data)) {
		//console.log('eeeeeeeeeeeeeeeeeellllllllll', tableState.tableData.data);
		const result = tableState.tableData.data.map((item) => {
			return {
				...item,
				key: item?.id,
			};
		});
		console.log('result', result);
		return result;
	}
});

const tableState = reactive({
	tableData: {
		data: ref(tempDataSource),
		total: 1,
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			date: '',
			roomTotal: 0,
			byOneCard: 0,
			byOffline: 0,
			supervisionFee: 0,
			emptyRoomTotal: 0,
			occupancyRate: '80%',
			filer: '',
			reportDate: '',
			tickStatus: '',
		},
	},
});

const onHandleCurrentChange = (val: number) => {
	console.log('change:', val);
	tableState.tableData.param.pageNo = val;
	//onSearch();
};

const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	tableState.tableData.param.pageSize = size;
	//onSearch();
};

const openEditPage = () => {
	//console.log('open edit page, id is:', oid);
	router.push({ path: '/hotelManagement/roomStatus/roomStatusEdit', query: { id: 1 } });
};
onMounted(() => {
	//console.log('props----------------------', props, useRoomStatus.getBaseInfoDataSource);
	tableState.tableData.data = useRoomStatus.getBaseInfoDataSource;
	console.log('useRoomStatus.getBaseInfoDataSource', useRoomStatus.getBaseInfoDataSource);
});
</script>

<style lang="less" scoped>
@import './styles/roomStatusTable.less';
</style>
