<template>
	<CommonSearch>
		<search-item label="行程单号" style="width: 280px">
			<a-input v-model:value="state.tableData.param.itineraryNo" placeholder="请输入行程单号" allowClear style="width: 180px" />
		</search-item>
		<search-item label="景区名称" style="width: 280px">
			<a-select
				v-model:value="state.tableData.param.scenicId"
				placeholder="请选择景区名称"
				allowClear
				style="width: 180px"
				:options="state.viewList.map((item) => ({ value: item.ticketId, label: item.ticketName }))"
			>
			</a-select>
		</search-item>
		<search-item label="景点名称" style="width: 280px">
			<a-input v-model:value="state.tableData.param.ticketName" placeholder="请输入景点名称" allowClear style="width: 180px" />
		</search-item>
		<search-item label="团队类型" style="width: 280px">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.travelTypeId" style="width: 180px" placeholder="请选择团队类型">
				<a-select-option v-for="(item, index) in options.teamTypesLists" :value="item.oid" :key="index">{{ item.name }} </a-select-option>
			</a-select>
		</search-item>
		<search-item label="地接社" style="width: 280px">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.subTravelId" style="width: 200px" placeholder="请选择地接社名称">
				<a-select-option v-for="(item, index) in options.earthContactAgencyList" :value="item.travelAgencyId" :key="index"
					>{{ item.travelAgencyName }}
				</a-select-option>
			</a-select>
		</search-item>
		<search-item label="结算时间" style="width: 350px">
			<picker
				v-model="state.tableData.settlementStartTimeList"
				type="daterange"
				value-format="YYYY-MM-DD HH:mm:ss"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
				@change="timeChange"
				style="width: 180px"
			>
			</picker>
		</search-item>
		<template #button>
			<a-button @click="reset" style="margin-right: 30px" v-permission="`重置`">重置</a-button>
			<a-button @click="initList" v-permission="`查询`">查询</a-button>
		</template>
	</CommonSearch>
	<div class="table-area">
		<div class="list-btn">
			<a-button type="primary" class="success" v-permission="`导出`">导出</a-button>
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
import type { TableColumnsType } from 'ant-design-vue';
import picker from '@/components/common/datePicker.vue';
import api from '@/api';
interface StateType {
	tableData: TableDataType;
	viewList: Array<any>;
}
interface TableDataType {
	param: ParamType;
	data: Array<DataType>;
	total: number;
	loading: boolean;
	settlementStartTimeList: Array<any>;
}
interface ParamType {
	itineraryNo?: number | string; //行程单号
	scenicId?: number | string | null; //关联景区id
	ticketName?: number | string; //门票名称
	travelTypeId?: number | string | null; //团队类型id
	subTravelId?: number | string | null; //地接社id
	// verificationStartTime: '', //核销开始时间
	// verificationEndTime: '', //核销结束时间
	settlementStartTime: number | string | null; //结算开始时间
	settlementEndTime: number | string | null; //结算结束时间
	pageSize?: number; //页大小
	pageNo?: number; //页号
}
interface DataType {
	itineraryNo?: string | number;
	scenicId?: number; //关联景区id
	scenicName?: string | number;
	ticketId?: number;
	ticketName?: string | number;
	travelTypeId?: number; //团队类型id
	travelTypeName?: number; //团队类型名称
	subTravelId?: number; //地接社id
	subTravelName?: number; //地接社名称
	verificationTime?: string; //核销时间
	settlementTime?: string; //结算时间
	unitPrice?: string | number; //单价
	reservationNum?: number; //预定数
	settlementNum?: number; //实刷数
	breaksNum?: number; //减免数
	orderPrice?: string | number; //预定金额
	unSettlementPrice?: string | number; //未核销金额
	breaksPrice?: string | number; //减免金额
	ticketPrice?: string | number; //票款金额
	scenicPrice?: string | number; //景点实收
	settlementRuleList: Array<SettlementRuleListType>; //结算规则信息
}
interface SettlementRuleListType {
	ruleName: string; //结算规则名称
	rulePrice: string; //结算费用
}
const options = settlementOptions();
const columns = computed(() => {
	const column: TableColumnsType = [
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
			if (data && data.length) {
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
const state = reactive<StateType>({
	tableData: {
		param: {
			itineraryNo: '', //行程单号
			scenicId: null, //关联景区id
			ticketName: '', //门票名称
			travelTypeId: null, //团队类型id
			subTravelId: null, //地接社id
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
	viewList: [],
});
// 查询
const initList = async () => {
	state.tableData.loading = true;
	let res = await api.byItineraryTicket(state.tableData.param);
	const { total, content } = res;
	state.tableData.total = total;
	state.tableData.data = content;
	state.tableData.loading = false;
};
// 获取景区下拉列表
const getViewList = async () => {
	const result = await api.getViewList();
	state.viewList = result;
	console.log(state.viewList, `state.viewList`);
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
	getViewList();
});
const timeChange = (arr: any) => {
	console.log(arr);
	if (arr && arr.length > 0) {
		// const timeList: any = [arr[0], arr[1]];
		state.tableData.param.settlementEndTime = Date.parse(arr[0]);
		state.tableData.param.settlementStartTime = Date.parse(arr[1]);
	} else {
		state.tableData.param.settlementEndTime = null;
		state.tableData.param.settlementStartTime = null;
	}
};
const getSettlementRule = computed(() => (column: TableColumnsType, record: DataType) => {
	const data = record.settlementRuleList;
	for (const key in data) {
		if (column.title === data[key].ruleName) {
			return data[key].rulePrice;
		}
	}
	return '';
});
const reset = () => {
	state.tableData.param = {
		itineraryNo: '', //行程单号
		scenicId: null, //关联景区id
		ticketName: '', //门票名称
		travelTypeId: null, //团队类型id
		subTravelId: null, //地接社id
		// verificationStartTime: '', //核销开始时间
		// verificationEndTime: '', //核销结束时间
		settlementStartTime: '', //结算开始时间
		settlementEndTime: '', //结算结束时间
		pageSize: 10, //页大小
		pageNo: 1, //页号
	};
	state.tableData.settlementStartTimeList = [];
	initList();
};
</script>
<style scoped lang="less"></style>
