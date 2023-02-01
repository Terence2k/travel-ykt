<template>
	<div class="verificationManage-wrapper">
		<div class="content-container">
			<div class="search-bar">
				<div class="item">
					<span class="field-input item">输入搜索</span>
					<a-input class="input-search-keywords item" v-model:value="tableState.tableData.param.sendTravelName" placeholder="旅行社名称" />
				</div>

				<div class="item">
					<span class="field-select item">核销状态</span>
					<a-select
						v-model:value="tableState.tableData.param.verifState"
						class="select-writeOff-status select item"
						:showArrow="true"
						:options="tableState.writeOffStatusOptions"
						placeholder="请选择核销状态"
					>
					</a-select>
				</div>

				<div class="item">
					<span class="field-input item">核销日期</span>
					<!-- <a-range-picker class="input-writeOff-date item" v-model:value="tableState.tableData.param.startTime" /> -->
					<picker
						class="input-writeOff-date item"
						v-model="tableState.tableData.param.startTime"
						type="daterange"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
					>
					</picker>
				</div>

				<div class="item">
					<span class="field-input item">订单编号</span>
					<a-input class="input-order-num item" v-model:value="tableState.tableData.param.orderNo" placeholder="请输入订单编号" />
				</div>

				<div class="item button-search-wrapper">
					<a-button @click="clearFilter" class="button-clear item" v-permission="'重置'">重置</a-button>
					<a-button @click="searchByFilter" class="button-search item" v-permission="'查询'">查询</a-button>
				</div>
			</div>

			<div class="table-bar">
				<div class="flex-container">
					<a-button class="button-create-item" v-permission="'导出'">导出</a-button>
				</div>
				<div class="table-container">
					<CommonTable :columns="columns" :row-selection="rowSelection" :dataSource="dataSource">
						<template #bodyCell="{ column, record, text }">
							<!-- <template v-if="column.dataIndex === 'auditStatus'">
								<div class="cell-auditStatus">
									<span class="item">{{ getAuditStatusName(parseInt(record?.auditStatus)) }}</span>
								</div>
							</template> -->
							<template v-if="column.dataIndex === 'verificationTime'">
								<div class="cell-verificationTime" v-if="record[column.dataIndex]">
									<span>{{ text }}</span>
								</div>
								<template v-else>
									<span>暂无</span>
								</template>
							</template>
							<template v-if="column.dataIndex === 'actions'">
								<div class="cell-actions">
									<span class="item" @click="openDisplayPage(record)" v-permission="'查看'">查看</span>
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
import picker from '@/components/common/datePicker.vue';
import api from '@/api';
import { useScenicSpotOption } from '@/stores/modules/scenicSpot';

const scenicSpotOptions = useScenicSpotOption();
console.log(scenicSpotOptions.$state.varificatinPageValue, 'scenicSpotOptions.varificatinPageValue');

const isFromSearch = () => {
	if (scenicSpotOptions.$state.varificatinPageValue) {
		tableState.tableData.param.orderNo = scenicSpotOptions.$state.varificatinPageValue;
		searchByFilter();
		scenicSpotOptions.cleanVerification();
	}
};

interface DataSourceItem {
	key: string | number;
	orderNo: string;
	verificationItemName: string;
	verificationTime: string;
	scenicName: string;
	sendTravelName: string;
	verifCount: string;
}

const router = useRouter();

let writeOffStatusOptionsData = [
	{
		value: true,
		label: '已核销',
	},
	{
		value: false,
		label: '未开始核销',
	},
];
const tableState = reactive({
	tableData: {
		data: [],
		total: 1,
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			sendTravelName: undefined,
			verifState: undefined,
			startTime: undefined,
			orderNo: undefined,
		},
	},
	writeOffStatusOptions: ref<SelectProps['options']>(writeOffStatusOptionsData),
});

const columns: TableColumnsType = [
	{
		title: '订单编号',
		dataIndex: 'orderNo',
		key: 'orderNo',
		width: 100,
	},
	{
		title: '核销项目',
		dataIndex: 'verificationItemName',
		key: 'verificationItemName',
		width: 100,
	},
	{
		title: '核销时间',
		dataIndex: 'verificationTime',
		key: 'verificationTime',
		width: 100,
	},
	{
		title: '归属景区',
		dataIndex: 'scenicName',
		key: 'scenicName',
		width: 100,
	},
	{
		title: '旅行社名称',
		dataIndex: 'sendTravelName',
		key: 'sendTravelName',
		width: 100,
	},

	{
		title: '核销状态',
		dataIndex: 'verifCount',
		key: 'verifCount',
		width: 250,
	},
	{
		title: '操作',
		dataIndex: 'actions',
		key: 'actions',
		fixed: 'right',
		width: 80,
	},
];

const dataSource = computed(() => {
	if (Array.isArray(tableState.tableData.data)) {
		return tableState.tableData.data.map((item) => {
			return {
				...item,
				key: item?.oid,
			};
		});
	}
});

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
	console.info('tableState.tableData.param.startTime', tableState.tableData.param.startTime);
	let startTime = '',
		endTime = '';
	if (Array.isArray(tableState.tableData.param?.startTime) && tableState.tableData.param?.startTime?.length === 2) {
		startTime = tableState.tableData.param?.startTime[0] ? dayjs(tableState.tableData.param.startTime[0])?.format('YYYY-MM-DD') : '';
		endTime = tableState.tableData.param?.startTime[1] ? dayjs(tableState.tableData.param.startTime[1]).format('YYYY-MM-DD') : '';
	}
	const requestParams = {
		...tableState.tableData.param,
		startTime: startTime,
		endTime: endTime,
	};
	console.log('search params: ', requestParams);
	api
		.getWriteOffRecordList(requestParams)
		.then((res: any) => {
			console.log('res:', res);
			tableState.tableData.data = res.content;
			tableState.tableData.total = res.total;
		})
		.catch((err: any) => {
			console.log(err);
		});
};

const searchByFilter = () => {
	tableState.tableData.param.pageNo = 1;
	onSearch();
};

const clearFilter = () => {
	tableState.tableData.param.pageNo = 1;
	tableState.tableData.param.sendTravelName = undefined;
	tableState.tableData.param.verifState = undefined;
	tableState.tableData.param.startTime = undefined;
	tableState.tableData.param.orderNo = undefined;
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
	if (record?.oid || record?.oid === 0) {
		router.push({ path: '/scenic-spot/verificationRecord/verificationRecordDisplay', query: { id: record.oid } });
		console.log('open display page');
	}
};

onMounted(() => {
	isFromSearch();
	onSearch();
});
</script>

<style lang="less" scoped>
@import './styles/index.less';
</style>
