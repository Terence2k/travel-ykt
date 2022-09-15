<template>
	<div class="wrapper">
		<div class="content-container">
			<div class="search-bar">
				<div class="item">
					<span class="field-select item">审核状态</span>
					<a-select
						class="select-status select item"
						mode="multiple"
						:showArrow="true"
						:options="statusOptions"
						v-model:value="status"
						placeholder="请选择状态"
					>
					</a-select>
				</div>

				<div class="item">
					<span class="field-select item">星级星标</span>
					<a-select
						class="select-star select item"
						mode="multiple"
						:showArrow="true"
						:options="starOptions"
						v-model:value="star"
						placeholder="请选择星级星标"
					>
					</a-select>
				</div>

				<div class="item">
					<span class="field-input item">酒店名称</span>
					<a-input class="input-hotel-name item" v-model:value="hotelName" placeholder="请输入酒店名称" />
				</div>

				<div class="item">
					<span class="field-input item">联系电话</span>
					<a-input class="input-hotel-name item" v-model:value="phoneNumber" placeholder="请输入联系电话" />
				</div>

				<div class="item button-search-wrapper">
					<a-button class="button-search item">查询</a-button>
				</div>
			</div>

			<div class="table-bar">
				<div class="flex-container">
					<a-button class="button-create-item">新增</a-button>
				</div>
				<div class="table-container">
					<CommonTable :columns="columns" :dataSource="dataSource" :row-selection="rowSelection">
						<template #bodyCell="{ column }">
							<template v-if="column.dataIndex === 'actions'">
								<div class="cell-actions">
									<span class="item">编辑</span>
									<span class="item">审核</span>
								</div>
							</template>
						</template>
					</CommonTable>
					<CommonPagination
						class="pagination-custom"
						:current="tableState.tableData.param.pageNumber"
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
import { defineComponent, ref } from 'vue';
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';

interface DataSourceItem {
	key: string;
	hotelName: string;
	hotelStar: string;
	cci: string;
	phoneNumber: string;
	address: string;
	auditStatus: string;
	discount: string;
}

const status = ref([]);
const star = ref([]);
let statusOptionsData = [
	{
		value: 'jack',
		label: 'Jack',
	},
	{
		value: 'lucy',
		label: 'Lucy',
	},
	{
		value: 'disabled',
		label: 'Disabled',
		disabled: true,
	},
	{
		value: 'yiminghe',
		label: 'Yiminghe',
	},
];
const statusOptions = ref<SelectProps['options']>(statusOptionsData);

let starOptionsData = [
	{
		value: 'jack',
		label: 'Jack',
	},
	{
		value: 'lucy',
		label: 'Lucy',
	},
	{
		value: 'disabled',
		label: 'Disabled',
		disabled: true,
	},
	{
		value: 'yiminghe',
		label: 'Yiminghe',
	},
];
const starOptions = ref<SelectProps['options']>(starOptionsData);

const hotelName = ref<string>('');
const phoneNumber = ref<string>('');

const columns: TableColumnsType = [
	{
		title: '酒店名称',
		dataIndex: 'hotelName',
		key: 'hotelName',
	},
	{
		title: '酒店星级',
		dataIndex: 'hotelStar',
		key: 'hotelStar',
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
		title: '提供减免',
		dataIndex: 'discount',
		key: 'discount',
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
		hotelName: '阳光商务一百酒店',
		hotelStar: '1星A级',
		cci: 'LJ32323EWC',
		phoneNumber: '8291829',
		address: '丽江市古城区雪山路778',
		auditStatus: '待审核',
		discount: '16免1',
	},
	{
		key: '2',
		hotelName: '香格里拉酒店',
		hotelStar: '5星A级',
		cci: 'WK323232EWC',
		phoneNumber: '323291843',
		address: '丽江市古城区雪山路338',
		auditStatus: '通过审核',
		discount: '10免1',
	},
];

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

const tableState = reactive({
	tableData: {
		data: [],
		total: 400,
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
</script>

<style lang="less" scoped>
@import './styles/index.less';
</style>
