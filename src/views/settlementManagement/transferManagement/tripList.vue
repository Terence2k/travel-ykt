<template>
	<div class="tripList">
		<div class="batchTransfer-header">
			<div class="header-total">
				<a-button type="primary" class="success">处理</a-button>
			</div>
		</div>
		<CommonTable :dataSource="state.tableData.data" :columns="columns" :scroll="{ x: '100%' }" style="margin-top: 10px">
			<template #bodyCell="{ column, record }">
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a href="javascript:;" @click="lookTrip(record)">查看</a>
					</div>
				</template>
			</template></CommonTable
		>

		<CommonPagination
			:current="state.tableData.param.pageNo"
			:page-size="state.tableData.param.pageSize"
			:total="state.tableData.total"
			@change="onHandleCurrentChange"
			@showSizeChange="pageSideChange"
		/>
	</div>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
const columns = computed(() => {
	const column = [
		{
			title: '行程单号',
			dataIndex: 'itineraryNo',
			key: 'itineraryNo',
			width: 100,
		},
		{
			title: '地接社',
			dataIndex: 'subTravelName',
			key: 'subTravelName',
			width: 100,
		},
		{
			title: '监理公司',
			key: 'superviseVo',
			children: [
				{
					title: '一卡通',
					dataIndex: 'ytk',
					key: 'ytk',
					width: 100,
				},
				{
					title: '银行',
					dataIndex: 'bank',
					key: 'bank',
					width: 100,
				},
			],
		},
		{
			title: '协会',
			key: 'associationVo',
			children: [
				{
					title: '一卡通',
					dataIndex: 'ytk',
					key: 'ytk',
					width: 100,
				},
				{
					title: '银行',
					dataIndex: 'bank',
					key: 'bank',
					width: 100,
				},
			],
		},
		{
			title: '启明旅行社',
			key: 'qmTravelAgencyVo',
			children: [
				{
					title: '一卡通',
					dataIndex: 'ytk',
					key: 'ytk',
					width: 100,
				},
				{
					title: '银行',
					dataIndex: 'bank',
					key: 'bank',
					width: 100,
				},
			],
		},
		{
			title: '丽江旅行社',
			key: 'ljTravelAgencyVo',
			children: [
				{
					title: '一卡通',
					dataIndex: 'ytk',
					key: 'ytk',
					width: 100,
				},
				{
					title: '银行',
					dataIndex: 'bank',
					key: 'bank',
					width: 100,
				},
			],
		},
		{
			title: '状态',
			dataIndex: 'state',
			key: 'state',
			width: 100,
		},
		{
			title: '行程费用',
			dataIndex: 'totalFee',
			key: 'totalFee',
			width: 100,
		},
	];
	return column;
});
const state = reactive({
	tableData: {
		param: {
			applicationDate: null,
			applicationName: null,
			productType: 1,
			pageSize: 10,
			pageNo: 1,
		},
		data: [
			{
				name: 123456,
			},
		],
		total: 11,
		loading: false,
	},
});
const cacheData = ref({});
const lookTrip = () => {};
// 查询
const initList = async () => {
	// state.tableData.loading = true;
	// let res = await api.productRuleList(state.tableData.param);
	// const { total, content } = res;
	// state.tableData.total = total;
	// const list: [any] = dealData(content);
	// state.tableData.data = list;
	// state.tableData.loading = false;
};
//搜索
const onHandleCurrentChange = (val: number) => {
	console.log('change:', val);
	state.tableData.param.pageNo = val;
	// onSearch();
	initList();
};
//翻页
const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	state.tableData.param.pageSize = size;
	// onSearch();
	initList();
};
</script>
<style scoped lang="scss">
.tripList {
	margin: 20px 0;

	.header-total {
		margin: 10px 0;
		margin-left: 30px;
		span {
			font-size: 16px;
			font-weight: 700;
		}
	}
}
</style>
