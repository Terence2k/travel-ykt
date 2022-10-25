<template>
	<CommonSearch>
		<search-item label="转账单号" style="width: 280px">
			<a-input v-model:value="state.tableData.param.transferAccountsNo" placeholder="请输入转账单号" allowClear style="width: 180px" />
		</search-item>
		<search-item label="行程单号" style="width: 280px">
			<a-input v-model:value="state.tableData.param.itineraryNo" placeholder="请输入行程单号" allowClear style="width: 180px" />
		</search-item>
        <search-item label="订单号" style="width: 280px">
			<a-input v-model:value="state.tableData.param.itineraryNo" placeholder="请输入订单号" allowClear style="width: 180px" />
		</search-item>
		<search-item label="团队类型">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.teamTypeId" style="width: 200px" placeholder="请选择团队类型">
				<a-select-option v-for="(item,index) in options.teamTypesLists" :value="item.oid" :key=index>{{ item.name }}
				</a-select-option>
			</a-select>
		</search-item>
		<search-item label="组团社">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.travelId" style="width: 200px" placeholder="请选择旅行社名称">
				<a-select-option v-for="(item,index) in options.groupSocietyList" :value="item.travelAgencyId" :key=index>{{ item.travelAgencyName }}
				</a-select-option>
			</a-select>
		</search-item>
		<search-item label="地接社">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.subTravelId" style="width: 200px" placeholder="请选择旅行社名称">
				<a-select-option v-for="(item,index) in options.earthContactAgencyList" :value="item.travelAgencyId" :key=index>{{ item.travelAgencyName }}
				</a-select-option>
			</a-select>
		</search-item>
		<search-item label="酒店名称" style="width: 280px">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.travelId" style="width: 200px" placeholder="请选择酒店名称">
				<a-select-option v-for="(item,index) in options.groupSocietyList" :value="item.travelAgencyId" :key=index>{{ item.travelAgencyName }}
				</a-select-option>
			</a-select>
		</search-item>
		<search-item label="预订时间" style="width: 280px">
			<a-date-picker v-model:value="state.tableData.param.applicationDate" style="width: 180px" />
		</search-item>
        <search-item label="结算时间" style="width: 280px">
			<a-date-picker v-model:value="state.tableData.param.applicationDate" style="width: 180px" />
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
			<CommonTable :dataSource="state.tableData.data" :columns="columns" :scroll="{ x: 2800 }">
				<template #bodyCell="{ column, record, index }">
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a href="javascript:;" @click="toDetail(record)">查看详情</a>
						</div>
					</template>
				</template>
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
  import { watch } from 'vue';
import CommonSearch from '@/components/common/CommonSearch.vue';
import CommonTable from '@/components/common/CommonTable.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import { settlementOptions } from '@/stores/modules/settlement';
import router from '@/router';
import { any } from 'vue-types';
const options = settlementOptions();
const route = useRouter();
const columns = [
	{
		title: '转账单号',
		dataIndex: 'itineraryNo',
		key: 'itineraryNo',
	},
	{
		title: '行程单号',
		dataIndex: 'routeName',
		key: 'routeName',
	},
    {
		title: '订单号',
		dataIndex: 'routeName',
		key: 'routeName',
	},
	{
		title: '团队类型',
		dataIndex: 'routeName',
		key: 'routeName',
	},
	{
		title: '组团社',
		dataIndex: 'routeName',
		key: 'routeName',
	},
	{
		title: '地接社',
		dataIndex: 'routeName',
		key: 'routeName',
	},
    {
		title: '酒店名称',
		dataIndex: 'routeName',
		key: 'routeName',
	},
	{
		title: '预订人数',
		dataIndex: 'subTravelName',
		key: 'subTravelName',
	},
	{
		title: '预订时间',
		dataIndex: 'subTravelName',
		key: 'subTravelName',
	},
    {
		title: '预订房数',
		dataIndex: 'subTravelName',
		key: 'subTravelName',
	},
    {
		title: '入住时间',
		dataIndex: 'subTravelName',
		key: 'subTravelName',
	},
    {
		title: '离店时间',
		dataIndex: 'subTravelName',
		key: 'subTravelName',
	},
    {
		title: '减免人数',
		dataIndex: 'subTravelName',
		key: 'subTravelName',
	},
    {
		title: '订单金额(元)',
		dataIndex: 'subTravelName',
		key: 'subTravelName',
	},
    {
		title: '减免金额(元)',
		dataIndex: 'subTravelName',
		key: 'subTravelName',
	},
	{
		title: '实际金额（元）',
		dataIndex: 'time',
		key: 'time',
	},
	{
		title: '核销时间',
		dataIndex: 'groupTypeStr',
		key: 'groupTypeStr',
	},
    {
		title: '核销房数',
		dataIndex: 'groupTypeStr',
		key: 'groupTypeStr',
	},
    {
		title: '结算时间',
		dataIndex: 'groupTypeStr',
		key: 'groupTypeStr',
	},
	{
		title: '未消费费用(元)',
		dataIndex: 'guides',
		key: 'guides',
	},
    {
		title: '收入费用(元)',
		dataIndex: 'guides',
		key: 'guides',
	},
    {
		title: '扣除费用(元)',
		dataIndex: 'guides',
		key: 'guides',
	},
    {
		title: '结算费用(元)',
		dataIndex: 'guides',
		key: 'guides',
	},
	{
		title: '操作',
		fixed: 'right',
		key: 'action',
	},
];
const state = reactive({
	tableData: {
		param: {
			applicationDate: null,
			applicationName: null,
			productType: 1,
			pageSize: 10,
			pageNo: 1,
			teamTypeId: null,
			travelId: null,
			subTravelId: null,
			transferAccountsNo: null,
			itineraryNo: null,
			type: null,
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
	initList();
};
//翻页
const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	state.tableData.param.pageSize = size;
	initList();
};
// 跳转结算详情
const toDetail = (record: any) => {
	// route.push({
	// 	path: `/reportManagement/${String(routerName)}/orderList`,
	// });
};

onMounted(() => {
	options.getTeamTypeList();
	options.getGroupSocietyList();
	options.getEarthContactAgencyList();
	initList();
})
</script>
<style scoped lang="less"></style>
