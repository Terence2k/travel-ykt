<template>
	<div class="hotelStar-wrapper">
		<!-- <div class="title">星级管理</div> -->
		<div class="content-container">
			<div class="search-bar">
				<span class="field-select item">状态</span>
				<a-select class="select-status item" :showArrow="true" :options="statusOptions" v-model:value="status" placeholder="请选择状态"> </a-select>
				<a-button @click="searchByFilter" class="button-search item">查询</a-button>
			</div>

			<div class="table-bar">
				<div class="flex-container">
					<a-button class="button-create-item" @click="addOrUpdate({ handle: 'add' })">新增</a-button>
				</div>
				<div class="table-container">
					<CommonTable :dataSource="dataSource" :columns="columns">
						<!-- <template #button>
							<div class="flex-container">
								<a-button class="button-create-item" >新增</a-button>
							</div>
						</template> -->
						<template #bodyCell="{ column, record }">
							<template v-if="column.dataIndex === 'price'">
								<div class="cell-price">
									<span class="item">{{ accDiv(record.price, 100) }}</span>
								</div>
							</template>
							<template v-if="column.dataIndex === 'actions'">
								<div class="cell-actions">
									<span class="item" @click="addOrUpdate({ row: record, handle: 'update' })">编辑</span>
									<span class="item" @click="toggleHotelStarStatus(record)">{{ record?.ratedStatus === 0 ? '启用' : '禁用' }}</span>
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
					<HotelStarAddUpdate v-model="tableState.operationModal.isAddOrUpdate" :params="tableState.params" :methods="methods"> </HotelStarAddUpdate>
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
import HotelStarAddUpdate from './components/hotelStar-add-update/hotelStar-add-update.vue';
import api from '@/api';
import { accDiv } from '@/utils/compute';
const status = ref('');
let statusOptionsData = [
	{
		value: 1,
		label: '启用',
	},
	{
		value: 0,
		label: '禁用',
	},
];

const statusOptions = ref<SelectProps['options']>(statusOptionsData);

const columns: TableColumnsType = [
	{
		title: '序号',
		dataIndex: 'oid',
		key: 'oid',
		width: 100,
	},
	{
		title: '酒店星级',
		dataIndex: 'starCode',
		key: 'starCode',
		width: '25%',
	},
	{
		title: '诚信指导价',
		dataIndex: 'price',
		key: 'price',
		width: 150,
	},
	{
		title: '状态',
		dataIndex: 'ratedStatusName',
		key: 'ratedStatusName',
		width: '40%',
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
		data: ref([]),
		total: 1,
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			ratedStatus: status,
		},
	},
	params: {},
	operationModal: {
		isAddOrUpdate: false,
	},
});

const dataSource = computed(() => tableState.tableData.data);

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

const onSearch = () => {
	api
		.getHotelStarTableInfo(tableState.tableData.param)
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

const addOrUpdate = (param: any) => {
	const { row, handle } = param;
	console.log('数据：', row);
	console.log('操作：', handle);

	tableState.params = {};
	if (handle === 'update') {
		tableState.params = row;
	}
	tableState.operationModal.isAddOrUpdate = true;
};

const toggleHotelStarStatus = (param: any) => {
	console.info(param);
	if (param.ratedStatus === 0) {
		api
			.enableHotelStar({}, param.oid)
			.then((res) => {
				console.log(res);
				onSearch();
			})
			.catch((err: any) => {
				console.log(err);
			});
	} else {
		api
			.disableHotelStar({}, param.oid)
			.then((res) => {
				console.log(res);
				onSearch();
			})
			.catch((err: any) => {
				console.log(err);
			});
	}
};

const methods = reactive({
	success: searchByFilter,
});

onMounted(() => {
	onSearch();
});
</script>

<style lang="less" scoped>
@import './styles/index.less';
</style>
