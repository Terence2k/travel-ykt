<template>
	<div class="wrapper">
		<!-- <div class="title">星级管理</div> -->
		<div class="content-container">
			<div class="search-bar">
				<span class="field-select item">状态</span>
				<a-select
					class="select-status item"
					mode="multiple"
					:showArrow="true"
					:options="statusOptions"
					v-model:value="status"
					placeholder="请选择状态"
				>
				</a-select>
				<a-button class="button-search item">查询</a-button>
			</div>

			<div class="table-bar">
				<div class="flex-container">
					<a-button class="button-create-item">新增</a-button>
				</div>
				<div class="table-container">
					<CommonTable :dataSource="dataSource" :columns="columns">
						<template #bodyCell="{ column }">
							<template v-if="column.dataIndex === 'actions'">
								<div class="cell-actions">
									<span class="item">编辑</span>
									<span class="item">禁用</span>
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
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { SelectProps } from 'ant-design-vue';
import type { TableColumnsType } from 'ant-design-vue';
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';

const status = ref([]);
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

let dataSource = [
	{
		key: '1',
		order: '1',
		star: '三星A级',
		price: '150.0',
		status: '启用',
	},
	{
		key: '2',
		order: '2',
		star: '四星B级',
		price: '200.0',
		status: '禁用',
	},
	{
		key: '3',
		order: '1',
		star: '三星A级',
		price: '150.0',
		status: '启用',
	},
	{
		key: '4',
		order: '2',
		star: '四星B级',
		price: '200.0',
		status: '禁用',
	},
	{
		key: '5',
		order: '1',
		star: '三星A级',
		price: '150.0',
		status: '启用',
	},
	{
		key: '6',
		order: '2',
		star: '四星B级',
		price: '200.0',
		status: '禁用',
	},
	{
		key: '7',
		order: '1',
		star: '三星A级',
		price: '150.0',
		status: '启用',
	},
	{
		key: '8',
		order: '2',
		star: '四星B级',
		price: '200.0',
		status: '禁用',
	},
	{
		key: '9',
		order: '1',
		star: '三星A级',
		price: '150.0',
		status: '启用',
	},
	{
		key: '10',
		order: '2',
		star: '四星B级',
		price: '200.0',
		status: '禁用',
	},
	{
		key: '11',
		order: '1',
		star: '三星A级',
		price: '150.0',
		status: '启用',
	},
	{
		key: '12',
		order: '2',
		star: '四星B级',
		price: '200.0',
		status: '禁用',
	},
];

const columns: TableColumnsType = [
	{
		title: '序号',
		dataIndex: 'order',
		key: 'order',
	},
	{
		title: '酒店星级',
		dataIndex: 'star',
		key: 'star',
	},
	{
		title: '诚信指导价',
		dataIndex: 'price',
		key: 'price',
	},
	{
		title: '状态',
		dataIndex: 'status',
		key: 'status',
	},
	{
		title: '操作',
		dataIndex: 'actions',
		key: 'actions',
		fixed: 'right',
		width: 160,
	},
];

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
