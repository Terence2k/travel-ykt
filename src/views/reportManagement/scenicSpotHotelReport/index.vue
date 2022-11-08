<template>
	<CommonSearch>
		<search-item label="订单号" style="width: 280px">
			<a-input v-model:value="state.tableData.param.orderNo" placeholder="请输入订单号" allowClear style="width: 180px" />
		</search-item>
		<search-item label="团单编号" style="width: 280px">
			<a-input v-model:value="state.tableData.param.itineraryNo" placeholder="请输入团单编号" allowClear style="width: 180px" />
		</search-item>
		<search-item label="团队类型">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.teamType" style="width: 200px" placeholder="请选择团队类型">
				<a-select-option v-for="(item, index) in options.teamTypesLists" :value="item.oid" :key="index">{{ item.name }} </a-select-option>
			</a-select>
		</search-item>
		<search-item label="地接社">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.subTravelOid" style="width: 200px" placeholder="请选择旅行社名称">
				<a-select-option v-for="(item, index) in options.earthContactAgencyList" :value="item.travelAgencyId" :key="index"
					>{{ item.travelAgencyName }}
				</a-select-option>
			</a-select>
		</search-item>
		<search-item label="结算时间">
			<a-range-picker v-model:value="state.settlementTimeList" @change="settlementTimeChange"/>
		</search-item>
		<search-item label="酒店名称" style="width: 280px">
			<a-input v-model:value="state.tableData.param.hotelName" placeholder="请输入酒店名称" allowClear style="width: 180px" />
		</search-item>
		<search-item label="核销时间">
			<a-range-picker v-model:value="state.verificationTimeList" @change="verificationTimeChange"/>
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
			<CommonTable :dataSource="state.tableData.data" :columns="columns" >
				<template #bodyCell="{ column, record }">
					<!-- 团队类型 -->
					<template v-if="column.key === 'teamType'">
						<span>{{ getTeamTypesName(record.teamType) }}</span>
					</template>
					<!-- 预订金额 单位转成元-->
					<template v-if="column.key === 'scheduledAmount'">
						{{ (record.scheduledAmount / 100) > 0 ? (record.scheduledAmount / 100).toFixed(2) : 0}}
					</template>
					<!-- 未核销金额 单位转成元-->
					<template v-if="column.key === 'noVerificationAmount'">
						{{ (record.noVerificationAmount / 100) > 0 ? (record.noVerificationAmount / 100).toFixed(2) : 0}}
					</template>
					<!-- 实际减免金额 单位转成元-->
					<template v-if="column.key === 'actualFullAmount'">
						{{ (record.actualFullAmount / 100) > 0 ? (record.actualFullAmount / 100).toFixed(2) : 0}}
					</template>
					<!-- 实际金额 单位转成元-->
					<template v-if="column.key === 'actualAmount'">
						{{ (record.actualAmount / 100) > 0 ? (record.actualAmount / 100).toFixed(2) : 0}}
					</template>
					<!-- 酒店实收 单位转成元-->
					<template v-if="column.key === 'hotelPrice'">
						{{ (record.hotelPrice / 100) > 0 ? (record.hotelPrice / 100).toFixed(2) : 0}}
					</template>
					<!-- 结算规则 -->
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
import { watch } from 'vue';
import CommonSearch from '@/components/common/CommonSearch.vue';
import CommonTable from '@/components/common/CommonTable.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import { settlementOptions } from '@/stores/modules/settlement';
import type { TableColumnsType } from 'ant-design-vue';
import { any } from 'vue-types';
import api from '@/api';
const options = settlementOptions();
const initOption = async () => {
	await options.getTeamTypeList();
	await options.getGroupSocietyList();
	await options.getEarthContactAgencyList();
};
// 计算属性 匹配团队类型
const getTeamTypesName = computed(() => (value: any) => {
	if (options.teamTypesLists) {
		const idx = options.teamTypesLists.findIndex((item) => item.oid === value);
		if (idx !== -1) {
			return options.teamTypesLists[idx]['name'];
		}
		return '';
	}
	return ''
})
const columns = computed(() => {
	const column: TableColumnsType = [
		{
			title: '订单号',
			dataIndex: 'orderNo',
			key: 'orderNo',
			width: 100
		},
		{
			title: '团单编号',
			dataIndex: 'itineraryNo',
			key: 'itineraryNo',
			width: 100
		},
		{
			title: '团队类型',
			dataIndex: 'teamType',
			key: 'teamType',
			width: 100
		},
		{
			title: '地接社',
			dataIndex: 'subTravelName',
			key: 'subTravelName',
			width: 100
		},
		// {
		// 	title: '作团人',
		// 	dataIndex: 'feeText',
		// 	key: 'feeText',
		// 	width: 80
		// },
		{
			title: '结算时间',
			dataIndex: 'settlementTime',
			key: 'settlementTime',
			width: 100
		},
		{
			title: '酒店',
			dataIndex: 'hotelName',
			key: 'hotelName',
			width: 80
		},
		{
			title: '核销时间',
			dataIndex: 'verificationTime',
			key: 'verificationTime',
			width: 100
		},
		{
			title: '入住情况',
			children: [
				{
					title: '星级',
					dataIndex: 'hotelStarCode',
					key: 'hotelStarCode',
					width: 80
				},
				{
					title: '预定数',
					dataIndex: 'scheduledRooms',
					key: 'scheduledRooms',
					width: 80
				},
				{
					title: '实刷数',
					dataIndex: 'actualRooms',
					key: 'actualRooms',
					width: 80
				},
				{
					title: '入住时间',
					dataIndex: 'arrivalDate',
					key: 'arrivalDate',
					width: 100
				},
				{
					title: '离店时间',
					dataIndex: 'departureDate',
					key: 'departureDate',
					width: 100
				},
				// {
				// 	title: '单价(元)',
				// 	dataIndex: 'companyAddress',
				// 	key: 'companyAddress',
				// 	width: 80
				// },
				// {
				// 	title: '加价(元)',
				// 	dataIndex: 'companyAddress',
				// 	key: 'companyAddress',
				// 	width: 80
				// },
				{
					title: '预订金额(元)',
					dataIndex: 'scheduledAmount',
					key: 'scheduledAmount',
					width: 80
				},
				{
					title: '未核销金额(元)',
					dataIndex: 'noVerificationAmount',
					key: 'noVerificationAmount',
					width: 100
				},
	
			],
		},
		{
			title: '实际减免数量',
			dataIndex: 'actualFullNumber',
			key: 'actualFullNumber',
			width: 90
		},
		{
			title: '实际减免金额(元)',
			dataIndex: 'actualFullAmount',
			key: 'actualFullAmount',
			width: 120
		},
		{
			title: '实际金额(元)',
			dataIndex: 'actualAmount',
			key: 'actualAmount',
			width: 80
		},
	];
	let nameList: Array<string> = [];
	if (state.tableData.data && state.tableData.data.length) {
		console.log('state.tableData.data.length',state.tableData.data.length);
		for (const key in state.tableData.data) {
			const data = state.tableData.data[key].settlementRuleList;
			if (data && data.length) {
				for (const subKey in data) {
					if (!nameList.includes(data[subKey].costName)) {
						nameList.push(data[subKey].costName);
					}
				}
			}
		}
		for (const key in nameList) {
			const settlementRules = {
				title: nameList[key],
				dataIndex: 'settlementRuleName',
				key: 'settlementRuleName',
				width: 100
			};
			column.push(settlementRules);
		}
		console.log('nameList,',nameList);
		
	}
	const netReceipts = {
		title: '酒店实收(元)',
		dataIndex: 'hotelPrice',
		key: 'hotelPrice',
		width: 80
	};
	column.push(netReceipts);
	return column;
})

const state = reactive({
	tableData: {
		param: {
			orderNo: "", //订单编号
			itineraryNo: "", //团单编号
			teamType: null, //团队类型
			subTravelOid: null, //地接社id
			settlementStartTime: "", //结算开始时间
			settlementEndTime: "", //结算结束时间
			hotelName: "", //酒店名称
			verificationStartTime: "", //核销开始时间
			verificationEndTime: "", //核销结束时间
			pageSize: 10, //页大小
			pageNo: 1 //页号
		},
		data: [
			{
				orderNo: 123456,
			},
		],
		total: 11,
		loading: false,
	},
	settlementTimeList: [],
	verificationTimeList: [],
});
// 查询
const initList = async () => {
	state.tableData.loading = true;
	let res = await api.hotelAccountList(state.tableData.param);
	const { total, content } = res;
	state.tableData.total = total;
	state.tableData.data = content;
	state.tableData.loading = false;
	// state.tableData.data = [
	// 		{
	// 			hotelOrderId: 1,
	// 			orderNo: "订单编号", //订单编号
	// 			itineraryNo: "团单编号", //团单编号
	// 			teamType: 64, //团队类型
	// 			subTravelOid: 1, //地接社id
	// 			subTravelName: "地接社名称", //地接社名称
	// 			settlementTime: "2011-10-10", //结算时间
	// 			hotelName: "酒店名称", //酒店名称
	// 			verificationTime: "2011-10-10", //核销时间
	// 			hotelStarCode: "酒店星级", //酒店星级
	// 			scheduledRooms: 1, //预定人数
	// 			actualRooms: 1, //实刷数
	// 			arrivalDate: "2011-10-10 18:00:00", //入住日期
	// 			departureDate: "2011-10-10 20:20:00", //离店日期
	// 			scheduledAmount: 1, //预定金额
	// 			noVerificationAmount: 1, //未核销金额
	// 			fullRule: 1, //满减规则-满
	// 			reduceRule: 1, //满减规则-减
	// 			reduceAfterAmount: 1, //减免后金额
	// 			actualFullNumber: 1, //实际减免数量
	// 			actualFullAmount: 1, //实际减满金额
	// 			actualAmount: 1, //实际金额
	// 			hotelPrice: 1, //酒店实收
	// 			settlementRuleList: [
	// 				{
	// 					costName: "规则1", //费用名称
	// 					settlementCost: 1, //结算费用
	// 					costType: 1 //结算类型
	// 				},
	// 				{
	// 					costName: "规则2", //费用名称
	// 					settlementCost: 1, //结算费用
	// 					costType: 1 //结算类型
	// 				}
	// 			] //结算规则名称list
	// 		},
	// 		{
	// 			hotelOrderId: 1,
	// 			orderNo: "订单编号", //订单编号
	// 			itineraryNo: "团单编号", //团单编号
	// 			teamType: 64, //团队类型
	// 			subTravelOid: 1, //地接社id
	// 			subTravelName: "地接社名称", //地接社名称
	// 			settlementTime: "2011-10-10", //结算时间
	// 			hotelName: "酒店名称", //酒店名称
	// 			verificationTime: "2011-10-10", //核销时间
	// 			hotelStarCode: "酒店星级", //酒店星级
	// 			scheduledRooms: 1, //预定人数
	// 			actualRooms: 1, //实刷数
	// 			arrivalDate: "2011-10-10 18:00:00", //入住日期
	// 			departureDate: "2011-10-10 20:20:00", //离店日期
	// 			scheduledAmount: 1, //预定金额
	// 			noVerificationAmount: 1, //未核销金额
	// 			fullRule: 1, //满减规则-满
	// 			reduceRule: 1, //满减规则-减
	// 			reduceAfterAmount: 1, //减免后金额
	// 			actualFullNumber: 1, //实际减免数量
	// 			actualFullAmount: 1, //实际减满金额
	// 			actualAmount: 1, //实际金额
	// 			hotelPrice: 1, //酒店实收
	// 			settlementRuleList: [
	// 				{
	// 					costName: "规则2", //费用名称
	// 					settlementCost: 1, //结算费用
	// 					costType: 1 //结算类型
	// 				},
	// 				{
	// 					costName: "规则3", //费用名称
	// 					settlementCost: 1, //结算费用
	// 					costType: 1 //结算类型
	// 				}
	// 			] //结算规则名称list
	// 		}
	// 	]
	
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
const settlementTimeChange = (arr: any) => {
	if (arr && arr.length > 0) {
		state.tableData.param.settlementStartTime = arr[0]['$d'];
		state.tableData.param.settlementEndTime = arr[1]['$d'];
	} else {
		state.tableData.param.settlementStartTime = '';
		state.tableData.param.settlementEndTime = '';
	}
};
const verificationTimeChange = (arr: any) => {
	if (arr && arr.length > 0) {
		state.tableData.param.verificationStartTime = arr[0]['$d'];
		state.tableData.param.verificationEndTime = arr[1]['$d'];
	} else {
		state.tableData.param.verificationStartTime = '';
		state.tableData.param.verificationEndTime = '';
	}
};
onMounted(() => {
	initOption();
	initList();
});
const getSettlementRule = computed(() => (column, record) => {
	const data = record.settlementRuleList;
	for (const key in data) {
		if (column.title === data[key].costName) {
			return data[key].settlementCost;
		}
	}
	return '';
});
</script>
<style scoped lang="less">
::v-deep(.ant-table-thead > tr > th, .ant-table-tbody > tr > td, .ant-table tfoot > tr > th, .ant-table tfoot > tr > td) {
	padding: 16px 0;
}
::v-deep(.ant-table-thead > tr > th) {
	text-align: center;
}
::v-deep(.ant-table-thead > tr > th) {
	border-right: 1px solid #f0f0f0;
	border-bottom: 1px solid #f0f0f0 !important;
}</style>
