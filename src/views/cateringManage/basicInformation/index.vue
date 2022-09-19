<template>
	<div>
		<CommonSearch>
			<search-item label="审核状态">
				<a-select ref="select" placeholder="请选择状态">
					<a-select-option value="all">all</a-select-option>
				</a-select>
			</search-item>
			<search-item label="门店名称">
				<a-input placeholder="请输入门店名称" />
			</search-item>
			<search-item label="联系电话">
				<a-input placeholder="请输入联系电话" />
			</search-item>
			<template #button>
				<a-button>查询</a-button>
			</template>
		</CommonSearch>
		<CommonTable :columns="columns" :dataSource="dataSource" :row-selection="rowSelection">
			<template #button>
				<a-button type="primary" >导出</a-button>
			</template>
			<template #bodyCell="{ column }">
				<template v-if="column.dataIndex === 'actions'">
					<div class="action-btns">
						<a>查看</a>
						<a>审核</a>
					</div>
				</template>
			</template>
		</CommonTable>
		<CommonPagination
			:current="tableState.tableData.param.pageNumber"
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
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import api from '@/api';
import { SelectProps, TableColumnsType } from 'ant-design-vue';
import { ref, reactive } from 'vue';

interface DataSourceItem {
	key: string;
	Name: string;
	cci: string;
	phoneNumber: string;
	address: string;
	auditStatus: string;
}
const columns: TableColumnsType = [
	{
		title: '门店名称',
		dataIndex: 'Name',
		key: 'Name',
	},
	{
		title: '企业信用代码',
		dataIndex: 'cci',
		key: 'cci',
	},
	{
		title: '联系电话',
		dataIndex: 'phoneNumber',
		key: 'phoneNumber',
	},
	{
		title: '所在地址',
		dataIndex: 'address',
		key: 'address',
	},
	{
		title: '审核状态',
		dataIndex: 'auditStatus',
		key: 'auditStatus',
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
		key: '1',
		Name: '阳光商务一百酒店',
		cci: 'LJ32323EWC',
		phoneNumber: '8291829',
		address: '丽江市古城区雪山路778',
		auditStatus: '待审核',
	},
	{
		key: '2',
		Name: '香格里拉酒店',
		cci: 'WK323232EWC',
		phoneNumber: '323291843',
		address: '丽江市古城区雪山路338',
		auditStatus: '通过审核',
	},
];

const tableState = reactive({
	tableData: {
		data: [],
		total: 20,
		loading: false,
		param: {
			pageNumber: 1,
			pageSize: 10,
		},
	},
});

const onHandleCurrentChange = (val: number) => {
	console.log('change:', val);
	tableState.tableData.param.pageNumber = val;
	// onSearch();
};

const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	tableState.tableData.param.pageSize = size;
	// onSearch();
};

const rowSelection = ref({
	checkStrictly: false,
	onChange: (selectedRowKeys: (string | number)[], selectedRows: DataSourceItem[]) => {
		console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
	},
	onSelect: (record: DataSourceItem, selected: boolean, selectedRows: DataSourceItem[]) => {
		console.log(record, selected, selectedRows);
	},
	onSelectAll: (selected: boolean, selectedRows: DataSourceItem[], changeRows: DataSourceItem[]) => {
		console.log(selected, selectedRows, changeRows);
	},
});
</script>

<style lang="less">
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
