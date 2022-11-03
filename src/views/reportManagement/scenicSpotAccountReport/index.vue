<template>
	<CommonSearch>
		<search-item label="行程单号" style="width: 280px">
			<a-input v-model:value="state.tableData.param.itineraryNo" placeholder="请输入转账单号" allowClear style="width: 180px" />
		</search-item>
		<search-item label="景区名称" style="width: 280px">
			<a-input v-model:value="state.tableData.param.scenicId" placeholder="请输入行程单号" allowClear style="width: 180px" />
		</search-item>
		<search-item label="景点名称" style="width: 280px">
			<a-input v-model:value="state.tableData.param.ticketName" placeholder="请输入订单号" allowClear style="width: 180px" />
		</search-item>
		<search-item label="团队类型">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.travelTypeId" style="width: 200px" placeholder="请选择团队类型">
				<a-select-option v-for="(item, index) in options.teamTypesLists" :value="item.oid" :key="index">{{ item.name }} </a-select-option>
			</a-select>
		</search-item>
		<search-item label="地接社">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.subTravelId" style="width: 200px" placeholder="请选择旅行社名称">
				<a-select-option v-for="(item, index) in options.earthContactAgencyList" :value="item.travelAgencyId" :key="index"
					>{{ item.travelAgencyName }}
				</a-select-option>
			</a-select>
		</search-item>
		<search-item label="核销时间" style="width: 280px">
			<a-date-picker v-model:value="state.tableData.param.verificationStartTime" style="width: 180px" />
		</search-item>
		<search-item label="结算时间" style="width: 280px">
			<a-date-picker v-model:value="state.tableData.param.settlementStartTime" style="width: 180px" />
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
			<!-- :scroll="{ x: 2800 }" -->
			<CommonTable :dataSource="state.tableData.data" :columns="columns"> </CommonTable>
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
const columns = computed(() => {
	const column = [
		{
			title: '团单编号',
			dataIndex: 'itineraryNo',
			key: 'itineraryNo',
		},
		{
			title: '景区名称',
			dataIndex: 'scenicName',
			key: 'scenicName',
		},
		{
			title: '票名称',
			dataIndex: 'ticketName',
			key: 'ticketName',
		},
		{
			title: '团队类型',
			dataIndex: 'travelTypeName',
			key: 'travelTypeName',
		},
		{
			title: '地接社',
			dataIndex: 'subTravelName',
			key: 'subTravelName',
		},
		{
			title: '核销时间',
			dataIndex: 'verificationTime',
			key: 'verificationTime',
		},
		{
			title: '结算时间',
			dataIndex: 'settlementTime',
			key: 'settlementTime',
		},
		{
			title: '单价（元）',
			dataIndex: 'unitPrice',
			key: 'unitPrice',
		},
		{
			title: '预定数',
			dataIndex: 'reservationNum',
			key: 'reservationNum',
		},
		{
			title: '实刷数',
			dataIndex: 'settlementNum',
			key: 'settlementNum',
		},
		{
			title: '减免数',
			dataIndex: 'breaksNum',
			key: 'breaksNum',
		},
		{
			title: '预定金额(元)',
			dataIndex: 'orderPrice',
			key: 'orderPrice',
		},
		{
			title: '减免金额(元)',
			dataIndex: 'breaksPrice',
			key: 'breaksPrice',
		},
		{
			title: '未核销金额金额（元）',
			dataIndex: 'unSettlementPrice',
			key: 'unSettlementPrice',
		},
		{
			title: '票款金额（元）',
			dataIndex: 'ticketPrice',
			key: 'ticketPrice',
		},
		{
			title: '景点实收（元）',
			dataIndex: 'scenicPrice',
			key: 'scenicPrice',
		},
	];
	if (state.tableData.data.settlementRuleNameList && state.tableData.data.settlementRuleNameList.length) {
		for (const key in state.tableData.data.settlementRuleNameList) {
			const settlementRules = {
				title: `结算规则${Number(Number(key) + 1)}`,
				dataIndex: 'settlementRuleName',
				key: 'settlementRuleName',
				data: state.tableData.data.settlementRuleNameList[key],
			};
			column.push(settlementRules);
		}
	}
	return column;
});
const state = reactive({
	tableData: {
		param: {
			itineraryNo: '', //行程单号
			scenicId: '', //关联景区id
			ticketName: '', //门票名称
			travelTypeId: '', //团队类型id
			subTravelId: '', //地接社id
			verificationStartTime: '', //核销开始时间
			verificationEndTime: '', //核销结束时间
			settlementStartTime: '', //结算开始时间
			settlementEndTime: '', //结算结束时间
			pageSize: 10, //页大小
			pageNo: 1, //页号
		},
		data: [],
		total: 11,
		loading: false,
	},
});
// 查询
const initList = async () => {
	// state.tableData.loading = true;
	// let res = await api.byItineraryTicket(state.tableData.param);
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
});
</script>
<style scoped lang="less"></style>
