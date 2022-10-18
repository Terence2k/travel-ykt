<template>
	<div class="verificationManage-wrapper">
		<div class="content-container">
			<div class="search-bar">
				<div class="item">
					<span class="field-input item">输入搜索</span>
					<a-input class="input-search-keywords item" v-model:value="tableState.tableData.param.searchKeyWords" placeholder="旅行社名称/关键词" />
				</div>

				<div class="item">
					<span class="field-select item">核销状态</span>
					<a-select
						v-model:value="tableState.tableData.param.writeOffStatus"
						class="select-writeOff-status select item"
						:showArrow="true"
						:options="tableState.writeOffStatusOptions"
						placeholder="请选择核销状态"
					>
					</a-select>
				</div>

				<div class="item">
					<span class="field-input item">核销日期</span>
					<a-date-picker class="input-writeOff-date item" v-model:value="tableState.tableData.param.writeOffDate" placeholder="请选择核销日期" />
				</div>

				<div class="item">
					<span class="field-input item">订单编号</span>
					<a-input class="input-order-num item" v-model:value="tableState.tableData.param.orderNum" placeholder="请输入订单编号" />
				</div>

				<div class="item button-search-wrapper">
					<a-button @click="searchByFilter" class="button-search item">查询</a-button>
				</div>
			</div>

			<div class="table-bar">
				<div class="flex-container">
					<a-button class="button-create-item">导出</a-button>
				</div>
				<div class="table-container">
					<CommonTable :columns="columns" :row-selection="rowSelection" :dataSource="dataSource">
						<template #bodyCell="{ column, record }">
							<!-- <template v-if="column.dataIndex === 'auditStatus'">
								<div class="cell-auditStatus">
									<span class="item">{{ getAuditStatusName(parseInt(record?.auditStatus)) }}</span>
								</div>
							</template> -->
							<template v-if="column.dataIndex === 'actions'">
								<div class="cell-actions">
									<span class="item" @click="openDisplayPage(record)">查看</span>
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
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { SelectProps, TableColumnsType } from 'ant-design-vue';
import { ref } from 'vue';
import dayjs from 'dayjs';
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import api from '@/api';

interface DataSourceItem {
	key: string | number;
	orderNum: string;
	writeOffItem: string;
	writeOffDate: string;
	scenicSpot: string;
	travelAgencyName: string;
	bookingNum: number;
	writeOffNum: number;
	orderAmount: number;
	writeOffStatus: string;
}

const router = useRouter();

let writeOffStatusOptionsData = [];
const tableState = reactive({
	tableData: {
		data: [],
		total: 1,
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			searchKeyWords: undefined,
			writeOffStatus: undefined,
			writeOffDate: undefined,
			orderNum: undefined,
		},
	},
	writeOffStatusOptions: ref<SelectProps['options']>(writeOffStatusOptionsData),
});

const columns: TableColumnsType = [
	{
		title: '订单编号',
		dataIndex: 'orderNum',
		key: 'orderNum',
	},
	{
		title: '核销项目',
		dataIndex: 'writeOffItem',
		key: 'writeOffItem',
	},
	{
		title: '核销时间',
		dataIndex: 'writeOffDate',
		key: 'writeOffDate',
	},
	{
		title: '归属景区',
		dataIndex: 'scenicSpot',
		key: 'scenicSpot',
	},
	{
		title: '旅行社名称',
		dataIndex: 'travelAgencyName',
		key: 'travelAgencyName',
	},
	{
		title: '订票人数',
		dataIndex: 'bookingNum',
		key: 'bookingNum',
	},
	{
		title: '核销人数',
		dataIndex: 'writeOffNum',
		key: 'writeOffNum',
	},
	{
		title: '订单金额',
		dataIndex: 'orderAmount',
		key: 'orderAmount',
	},
	{
		title: '核销状态',
		dataIndex: 'writeOffStatus',
		key: 'writeOffStatus',
	},
	{
		title: '操作',
		dataIndex: 'actions',
		key: 'actions',
		fixed: 'right',
		width: 160,
	},
];

let dataSource: DataSourceItem[] = [
	{
		key: 1,
		orderNum: '100001',
		writeOffItem: '入园',
		writeOffDate: '2022年8月30日 14:49:18',
		scenicSpot: '木府',
		travelAgencyName: '夏日里旅行社',
		bookingNum: 22,
		writeOffNum: 22,
		orderAmount: 2200,
		writeOffStatus: '已核销',
	},
	{
		key: 2,
		orderNum: '103323',
		writeOffItem: '入园',
		writeOffDate: '2022年8月29日 10:49:20',
		scenicSpot: '木府',
		travelAgencyName: '新世界旅行社',
		bookingNum: 12,
		writeOffNum: 12,
		orderAmount: 3200,
		writeOffStatus: '已核销',
	},
];

// const dataSource = computed(() => {
// 	if (Array.isArray(tableState.tableData.data)) {
// 		return tableState.tableData.data.map((item) => {
// 			return {
// 				...item,
// 				key: item?.oid,
// 			};
// 		});
// 	}
// });

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

const onSearch = () => {
	const requestParams = {
		...tableState.tableData.param,
		writeOffDate: dayjs(tableState.tableData.param.writeOffDate)?.format('YYYY-MM-DD'),
	};

	console.log('search params: ', requestParams);
	// api
	// 	.getHotelTableInfo(tableState.tableData.param)
	// 	.then((res: any) => {
	// 		console.log('res:', res);
	// 		tableState.tableData.data = res.content;
	// 		tableState.tableData.total = res.total;
	// 	})
	// 	.catch((err: any) => {
	// 		console.log(err);
	// 	});
};

const searchByFilter = () => {
	tableState.tableData.param.pageNo = 1;
	onSearch();
};

const onHandleCurrentChange = (val: number) => {
	console.log('change:', val);
	tableState.tableData.param.pageNo = val;
	onSearch();
};

const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	tableState.tableData.param.pageSize = size;
	onSearch();
};

const openDisplayPage = (record) => {
	router.push({ path: '/scenic-spot/verificationRecord/verificationRecordDisplay', query: { id: record.orderNum } });
	console.log('open display page');
};

onMounted(() => {
	onSearch();
});
</script>

<style lang="less" scoped>
@import './styles/index.less';
</style>
