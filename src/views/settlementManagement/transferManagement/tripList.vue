<template>
	<div class="tripList">
		<div class="batchTransfer-header">
			<div class="header-total">
				<a-button type="primary" class="success">处理</a-button>
			</div>
		</div>
		<CommonTable :dataSource="state.tableData.data" :columns="columns" :scroll="{ x: '100%' }" style="margin-top: 10px">
			<template #bodyCell="{ column, record }">
				<template v-if="column.dataIndex === 'ykt'"> {{ getYKT(record, column) }} </template>
				<template v-if="column.dataIndex === 'bank'"> {{ getBank(record, column) }} </template>
				<template v-if="column.key === 'ruleMap'"> {{ getRulePrice(record, column) }} </template>
				<template v-if="column.dataIndex.includes('tualPrice')"> {{ getActualPrice(record, column) }} </template>
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a href="javascript:;" @click="lookTrip(record)">查看</a>
						<a href="javascript:;" v-permission="`编辑`" @click="lookTrip(record)">编辑</a>
						<!-- <a href="javascript:;" @click="showTip('index', index, record)" v-permission="`删除`">删除</a> -->
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
			// applicationDate: null,
			// applicationName: null,
			// productType: 1,
			// pageSize: 10,
			// pageNo: 1,
			transferAccountsId: 1, //转账单id
			pageNo: 1, //页号
			pageSize: 10, //页大小
			// itineraryNo: 'aaaaaa', //行程单号
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
const getYKT = computed(() => (record, column) => {
	if (record[column.key] && record[column.key]['ykt']) {
		return record[column.key]['ykt'];
	}
	return '';
});
const getBank = computed(() => (record, column) => {
	if (record[column.key] && record[column.key]['bank']) {
		return record[column.key]['bank'];
	}
	return '';
});
const getActualPrice = computed(() => (record: any, column: any) => {
	if (!column.key.includes('List')) {
		return record[column.key] ? record[column.key]['actualPrice'] : '';
	} else {
		if (record[column.key]) {
			const idx = record[column.key].findIndex((r: any) => r.comprehensiveFeeProductName === column.parentTitle);
			if (idx !== -1) {
				return record[column.key][idx][column.dataIndex] || '';
			}
		}
	}
	return '';
});
const getRulePrice = computed(() => (record: any, column: any) => {
	const ruleColumnKey = column.parent.split('-')[0];
	for (const key in record[ruleColumnKey]) {
		if (column.columnParentName === record[ruleColumnKey][key]['comprehensiveFeeProductName']) {
			for (const subKey in record[ruleColumnKey][key].ruleList) {
				if (column.title === record[ruleColumnKey][key].ruleList[subKey].ruleName) {
					return `${record[ruleColumnKey][key].ruleList[subKey].rulePrice}`;
				}
			}
		}
	}
});
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
