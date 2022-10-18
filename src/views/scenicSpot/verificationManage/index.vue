<template>
	<div class="verification-manage-wrapper">
		<div class="content-container">
			<div class="search-bar">
				<div class="item">
					<span class="field-input item">输入搜索</span>
					<a-input class="input-search item" v-model:value="tableState.tableData.param.searchKeyWords" placeholder="门票名称/关键词" />
				</div>
				<div class="item">
					<span class="field-select item">归属景区</span>
					<a-select
						v-model:value="tableState.tableData.scenicSpot"
						class="select-status item"
						:showArrow="true"
						:options="tableState.scenicSpotOptions"
						placeholder="请选择状态"
					>
					</a-select>
				</div>
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
									<span class="item">{{ record.price / 100 }}</span>
								</div>
							</template>
							<template v-if="column.dataIndex === 'actions'">
								<div class="cell-actions">
									<span class="item" @click="addOrUpdate({ row: record, handle: 'update' })">编辑</span>
									<span class="item" @click="toggleHotelStarStatus(record)">删除</span>
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
					<VerificationManageAddUpdate v-model="tableState.operationModal.isAddOrUpdate" :params="tableState.params" :methods="methods">
					</VerificationManageAddUpdate>
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
import VerificationManageAddUpdate from './components/verificationManage-add-update/verificationManage-add-update.vue';
import api from '@/api';

const columns: TableColumnsType = [
	{
		title: '序号',
		dataIndex: 'oid',
		key: 'oid',
		width: 100,
	},
	{
		title: '演出票名称',
		dataIndex: 'ticketName',
		key: 'ticketName',
		width: 150,
	},
	{
		title: '归属景区',
		dataIndex: 'scenicSpot',
		key: 'scenicSpot',
		width: 150,
	},
	{
		title: '审核状态',
		dataIndex: 'ratedStatusName',
		key: 'ratedStatusName',
		width: 150,
	},
	{
		title: '平台上架状态',
		dataIndex: 'platformLaunchStatus',
		key: 'platformLaunchStatus',
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

let scenicSpotOptionsData = [];
const tableState = reactive({
	tableData: {
		data: ref([]),
		total: 1,
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			searchKeyWords: '',
			scenicSpot: '',
		},
	},
	scenicSpotOptions: ref<SelectProps['options']>(scenicSpotOptionsData),
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
	// api
	// 	.getHotelStarTableInfo(tableState.tableData.param)
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
