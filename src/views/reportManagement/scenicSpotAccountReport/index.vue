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
		<search-item label="团队类型" style="width: 280px">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.travelTypeId" style="width: 200px" placeholder="请选择团队类型">
				<a-select-option v-for="(item, index) in options.teamTypesLists" :value="item.oid" :key="index">{{ item.name }} </a-select-option>
			</a-select>
		</search-item>
		<search-item label="地接社" style="width: 280px">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.subTravelId" style="width: 200px" placeholder="请选择旅行社名称">
				<a-select-option v-for="(item, index) in options.earthContactAgencyList" :value="item.travelAgencyId" :key="index"
					>{{ item.travelAgencyName }}
				</a-select-option>
			</a-select>
		</search-item>
		<search-item label="结算时间" style="width: 280px">
			<a-range-picker v-model:value="state.settlementStartTimeList" @change="settlementStartTimeChange" />
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
			<CommonTable :dataSource="state.tableData.data" :columns="columns">
				<template #bodyCell="{ column, record }">
					<template v-if="column.key === 'settlementRuleName'">
						<span>{{ getSettlementRule(column, record) }}</span>
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
import CommonSearch from '@/components/common/CommonSearch.vue';
import CommonTable from '@/components/common/CommonTable.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import { settlementOptions } from '@/stores/modules/settlement';
import api from '@/api';
interface TableDataType {}
interface DataType {
	itineraryNo: string | number;
	scenicId: number; //关联景区id
	scenicName: string | number;
	ticketId: number;
	ticketName: string | number;
	travelTypeId: number; //团队类型id
	travelTypeName: number; //团队类型名称
	subTravelId: number; //地接社id
	subTravelName: number; //地接社名称
	verificationTime: '2022.03.01 09:00'; //核销时间
	settlementTime: '2022.03.01 09:00'; //结算时间
	unitPrice: '1'; //单价
	reservationNum: 1; //预定数
	settlementNum: 1; //实刷数
	breaksNum: 1; //减免数
	orderPrice: '1'; //预定金额
	unSettlementPrice: '1'; //未核销金额
	breaksPrice: '1'; //减免金额
	ticketPrice: '1'; //票款金额
	scenicPrice: '1'; //景点实收
	settlementRuleList: []; //结算规则信息
}
const options = settlementOptions();
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
	let nameList: Array<string> = [];
	if (state.tableData.data && state.tableData.data.length) {
		for (const key in state.tableData.data) {
			const data = state.tableData.data[key].settlementRuleList;
			if (data && data.length && data.length > nameList.length) {
				for (const subKey in data) {
					if (!nameList.includes(data[subKey].ruleName)) {
						nameList.push(data[subKey].ruleName);
					}
				}
			}
		}
		for (const key in nameList) {
			const settlementRules = {
				// title: `结算规则${Number(Number(key) + 1)}`,
				title: nameList[key],
				dataIndex: 'settlementRuleName',
				key: 'settlementRuleName',
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
			// verificationStartTime: '', //核销开始时间
			// verificationEndTime: '', //核销结束时间
			settlementStartTime: '', //结算开始时间
			settlementEndTime: '', //结算结束时间
			pageSize: 10, //页大小
			pageNo: 1, //页号
		},
		data: [],
		total: 11,
		loading: false,
		settlementStartTimeList: [],
	},
});
// 查询
const initList = async () => {
	state.tableData.loading = true;
	let res = await api.byItineraryTicket(state.tableData.param);
	const { total, content } = res;
	state.tableData.total = total;
	state.tableData.data = content;
	state.tableData.loading = false;
	state.tableData.data = [
		{
			itineraryNo: '111', //团单编号
			scenicId: 1, //关联景区id
			scenicName: '111', //景区名称
			ticketId: 1, //票id
			ticketName: '111', //门票名称
			travelTypeId: 1, //团队类型id
			travelTypeName: 111, //团队类型名称
			subTravelId: 1, //地接社id
			subTravelName: 111, //地接社名称
			verificationTime: '2022.03.01 09:00', //核销时间
			settlementTime: '2022.03.01 09:00', //结算时间
			unitPrice: '1', //单价
			reservationNum: 1, //预定数
			settlementNum: 1, //实刷数
			breaksNum: 1, //减免数
			orderPrice: '1', //预定金额
			unSettlementPrice: '1', //未核销金额
			breaksPrice: '1', //减免金额
			ticketPrice: '1', //票款金额
			scenicPrice: '1', //景点实收
			settlementRuleList: [
				{
					ruleName: '测试1', //结算规则名称
					rulePrice: '10', //结算费用
				},
				{
					ruleName: '测试2', //结算规则名称
					rulePrice: '22', //结算费用
				},
			], //结算规则信息
		},
		{
			itineraryNo: '111', //团单编号
			scenicId: 1, //关联景区id
			scenicName: '111', //景区名称
			ticketId: 1, //票id
			ticketName: '111', //门票名称
			travelTypeId: 1, //团队类型id
			travelTypeName: 111, //团队类型名称
			subTravelId: 1, //地接社id
			subTravelName: 111, //地接社名称
			verificationTime: '2022.03.01 09:00', //核销时间
			settlementTime: '2022.03.01 09:00', //结算时间
			unitPrice: '1', //单价
			reservationNum: 1, //预定数
			settlementNum: 1, //实刷数
			breaksNum: 1, //减免数
			orderPrice: '1', //预定金额
			unSettlementPrice: '1', //未核销金额
			breaksPrice: '1', //减免金额
			ticketPrice: '1', //票款金额
			scenicPrice: '1', //景点实收
			settlementRuleList: [
				{
					ruleName: '测试1', //结算规则名称
					rulePrice: '10', //结算费用
				},
				{
					ruleName: '测试3', //结算规则名称
					rulePrice: '22', //结算费用
				},
				{
					ruleName: '测试4', //结算规则名称
					rulePrice: '444', //结算费用
				},
			], //结算规则信息
		},
	];
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
const settlementStartTimeChange = (arr: any) => {
	if (arr && arr.length > 0) {
		state.tableData.param.settlementStartTime = arr[0]['$d'];
		state.tableData.param.settlementEndTime = arr[1]['$d'];
	} else {
		state.tableData.param.settlementStartTime = '';
		state.tableData.param.settlementEndTime = '';
	}
};
onMounted(() => {
	options.getTeamTypeList();
	options.getGroupSocietyList();
	options.getEarthContactAgencyList();
	initList();
});
const getSettlementRule = computed(() => (column, record) => {
	const data = record.settlementRuleList;
	for (const key in data) {
		if (column.title === data[key].ruleName) {
			return data[key].rulePrice;
		}
	}
	return '';
});
</script>
<style scoped lang="less"></style>
