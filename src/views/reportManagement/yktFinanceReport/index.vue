<template>
	<CommonSearch>
		<search-item label="转账单号">
			<a-input v-model:value="state.tableData.param.comprehensiveFeeProductName" placeholder="请输入转账单号" />
		</search-item>
        <search-item label="转账时间">
			<a-range-picker
				v-model:value="state.tableData.param.time"
				show-time
				format="YYYY-MM-DD HH:mm"
				value-format="YYYY-MM-DD HH:mm:ss"
			/>
		</search-item>
        <search-item label="收款单位">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.status" style="width: 200px" placeholder="请选择收款单位">
				<a-select-option :value="1">1</a-select-option>
				<a-select-option :value="0">2 </a-select-option>
			</a-select>
		</search-item>
        <search-item label="单位类型">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.status" style="width: 200px" placeholder="请选择单位类型">
				<a-select-option :value="1">1</a-select-option>
				<a-select-option :value="0">2 </a-select-option>
			</a-select>
		</search-item>
		<template #button>
			<a-button @click="initList">查询</a-button>
		</template>
	</CommonSearch>
	<div class="table-area">
		<div class="list-btn">
			<a-button type="primary" class="success">导出</a-button>
		</div>
	</div>
	<div>
		<a-spin size="large" :spinning="state.tableData.loading">
			<CommonTable :dataSource="state.tableData.data" :scroll="{ x: '100%',y: '100%' }" :columns="columns">
			</CommonTable>
		</a-spin>
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
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import { message } from 'ant-design-vue';
import { Modal } from 'ant-design-vue';
import api from '@/api';
const route = useRouter();

const columns = [
	{
		title: '转账单号',
		dataIndex: 'comprehensiveFeeProductName',
		key: 'comprehensiveFeeProductName',
	},
	{
		title: '行程单数',
		dataIndex: 'belongCompanyName',
		key: 'belongCompanyName',
	},
	{
		title: '转账金额(元)',
		dataIndex: 'feeExplanation',
		key: 'feeExplanation',
	},
	{
		title: '转账时间',
		dataIndex: 'feeText',
		key: 'feeText',
	},
	{
		title: '收款单位',
		dataIndex: 'confirmDailyChargeName',
		key: 'confirmDailyChargeName',
	},
    {
		title: '单位类型',
		dataIndex: 'confirmDailyChargeName',
		key: 'confirmDailyChargeName',
	},
	{
		title: '收款账户',
		dataIndex: 'statusName',
		key: 'statusName',
	},
];

const state = reactive({
	tableData: {
		data: [
            {
                comprehensiveFeeProductName: 1,
            }
        ],
		total: 10,
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			comprehensiveFeeProductName: null, //综费产品名称
			status: null, //启用状态：0-启用  1-禁用
            time: null
		},
	},
});


//搜索
const onHandleCurrentChange = (val: number) => {
	state.tableData.param.pageNo = val;
	initList();
};
//翻页
const pageSideChange = (current: number, size: number) => {
	state.tableData.param.pageSize = size;
	initList();
};

// 初始化列表
const initList = async () => {
	// state.tableData.loading = true;
	// api
	// 	.getcomprehensiveFeeList(state.tableData.param)
	// 	.then((res) => {
	// 		console.log(res);
	// 		const { total, content } = res;
	// 		state.tableData.total = total;
	// 		const list: [any] = dealData(content);
	// 		state.tableData.data = list;
	// 		state.tableData.loading = false;
	// 	})
	// 	.catch((err) => {
	// 		state.tableData.loading = false;
	// 	});
};
// 数据处理
const dealData = (params: [any]) => {
	params.map((i: any) => {
		
	});
	return params;
};
onMounted(() => {
	initList();
});

</script>

<style lang="less" scoped>
</style>
