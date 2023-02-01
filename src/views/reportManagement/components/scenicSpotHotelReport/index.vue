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
		<search-item label="结算时间" style="width: 350px">
			<!-- <a-range-picker v-model:value="state.settlementTimeList" @change="settlementTimeChange" /> -->
			<picker
				v-model="state.settlementTimeList"
				style="width: 180px"
				@change="settlementTimeChange"
				type="daterange"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
			>
			</picker>
		</search-item>
		<search-item label="酒店名称" style="width: 280px">
			<a-input v-model:value="state.tableData.param.hotelName" placeholder="请输入酒店名称" allowClear style="width: 180px" />
		</search-item>
		<search-item label="核销时间" style="width: 350px">
			<!-- <a-range-picker v-model:value="state.verificationTimeList" @change="verificationTimeChange" /> -->
			<picker
				v-model="state.verificationTimeList"
				style="width: 180px"
				@change="verificationTimeChange"
				type="daterange"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
			>
			</picker>
		</search-item>
		<template #button>
			<a-button @click="reset" v-permission="'酒店账目报表_重置'" style="margin-right: 30px">重置</a-button>
			<a-button @click="initList" v-permission="'酒店账目报表_查询'">查询</a-button>
		</template>
	</CommonSearch>
	<div class="table-area">
		<div class="list-btn">
			<a-button type="primary" class="success" v-permission="'酒店账目报表_导出'">导出</a-button>
		</div>
	</div>
	<div>
		<a-spin size="large" :spinning="state.tableData.loading">
			<!-- :scroll="{ x: 2800 }" -->
			<CommonTable :dataSource="state.tableData.data" :columns="columns">
				<template #bodyCell="{ column, record }">
					<!-- 团队类型 -->
					<template v-if="column.key === 'teamType'">
						<span>{{ getTeamTypesName(record.teamType) }}</span>
					</template>
					<!-- 预订金额 单位转成元-->
					<template v-if="column.key === 'scheduledAmount'">
						{{ twoDecimalPlaces(record.scheduledAmount) }}
					</template>
					<!-- 未核销金额 单位转成元-->
					<template v-if="column.key === 'noVerificationAmount'">
						{{ twoDecimalPlaces(record.noVerificationAmount) }}
					</template>
					<!-- 实际减免金额 单位转成元-->
					<template v-if="column.key === 'actualFullAmount'">
						{{ twoDecimalPlaces(record.actualFullAmount) }}
					</template>
					<!-- 实际金额 单位转成元-->
					<template v-if="column.key === 'actualAmount'">
						{{ twoDecimalPlaces(record.actualAmount) }}
					</template>
					<!-- 酒店实收 单位转成元-->
					<template v-if="column.key === 'hotelPrice'">
						{{ twoDecimalPlaces(record.hotelPrice) }}
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
import picker from '@/components/common/datePicker.vue';
import api from '@/api';
interface StateType {
	tableData: TableDataType;
	settlementTimeList: Array<any>;
	verificationTimeList: Array<any>;
}
interface TableDataType {
	param: ParamType;
	data: Array<DataType>;
	total: number;
	loading: boolean;
}
interface ParamType {
	orderNo?: number | string; //订单编号
	itineraryNo?: number | string; //行程单号
	hotelName?: number | string; //酒店名称
	teamType?: number | string | null; //团队类型id
	subTravelOid?: number | string | null; //地接社id
	verificationStartTime: ''; //核销开始时间
	verificationEndTime: ''; //核销结束时间
	settlementStartTime: number | string | null; //结算开始时间
	settlementEndTime: number | string | null; //结算结束时间
	pageSize?: number; //页大小
	pageNo?: number; //页号
}
interface DataType {
	hotelOrderId?: string | number;
	orderNo?: string | number; //订单编号
	itineraryNo?: string | number; //团单编号
	teamType?: string | number; //团队类型
	subTravelOid?: string | number; //地接社id
	subTravelName?: string | number; //地接社名称
	settlementTime?: string | number; //结算时间
	hotelName?: string | number; //酒店名称
	verificationTime?: string | number; //核销时间
	hotelStarCode?: string | number; //酒店星级
	scheduledRooms?: string | number; //预定人数
	actualRooms?: string | number; //实刷数
	arrivalDate?: string | number; //入住日期
	departureDate?: string | number; //离店日期
	scheduledAmount?: string | number; //预定金额
	noVerificationAmount?: string | number; //未核销金额
	fullRule?: string | number; //满减规则-满
	reduceRule?: string | number; //满减规则-减
	reduceAfterAmount?: string | number; //减免后金额
	actualFullNumber?: string | number; //实际减免数量
	actualFullAmount?: string | number; //实际减满金额
	actualAmount?: string | number; //实际金额
	hotelPrice?: string | number; //酒店实收
	settlementRuleList: Array<SettlementRuleListType>; //结算规则信息
}
interface SettlementRuleListType {
	costName: string; //结算规则名称
	settlementCost: string | number; //结算费用
	costType: string | number; //结算类型
}
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
	return '';
});
const columns = computed(() => {
	const column: TableColumnsType = [
		{
			title: '订单号',
			dataIndex: 'orderNo',
			key: 'orderNo',
			width: 150,
		},
		{
			title: '团单编号',
			dataIndex: 'itineraryNo',
			key: 'itineraryNo',
			width: 150,
		},
		{
			title: '团队类型',
			dataIndex: 'teamType',
			key: 'teamType',
			width: 100,
		},
		{
			title: '地接社',
			dataIndex: 'subTravelName',
			key: 'subTravelName',
			width: 100,
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
			width: 130,
		},
		{
			title: '酒店',
			dataIndex: 'hotelName',
			key: 'hotelName',
			width: 100,
		},
		{
			title: '核销时间',
			dataIndex: 'verificationTime',
			key: 'verificationTime',
			width: 130,
		},
		{
			title: '入住情况',
			children: [
				{
					title: '星级',
					dataIndex: 'hotelStarCode',
					key: 'hotelStarCode',
					width: 80,
				},
				{
					title: '预定数',
					dataIndex: 'scheduledRooms',
					key: 'scheduledRooms',
					width: 80,
				},
				{
					title: '实刷数',
					dataIndex: 'actualRooms',
					key: 'actualRooms',
					width: 80,
				},
				{
					title: '入住时间',
					dataIndex: 'arrivalDate',
					key: 'arrivalDate',
					width: 130,
				},
				{
					title: '离店时间',
					dataIndex: 'departureDate',
					key: 'departureDate',
					width: 130,
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
					width: 80,
				},
				{
					title: '未核销金额(元)',
					dataIndex: 'noVerificationAmount',
					key: 'noVerificationAmount',
					width: 100,
				},
			],
		},
		{
			title: '实际减免数量',
			dataIndex: 'actualFullNumber',
			key: 'actualFullNumber',
			width: 90,
		},
		{
			title: '实际减免金额(元)',
			dataIndex: 'actualFullAmount',
			key: 'actualFullAmount',
			width: 120,
		},
		{
			title: '实际金额(元)',
			dataIndex: 'actualAmount',
			key: 'actualAmount',
			width: 80,
		},
	];
	let nameList: Array<string> = [];
	if (state.tableData.data && state.tableData.data.length) {
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
				width: 100,
			};
			// 去除脏数据
			if (settlementRules.title != null) {
				column.push(settlementRules);
			}
		}
	}
	const netReceipts = {
		title: '酒店实收(元)',
		dataIndex: 'hotelPrice',
		key: 'hotelPrice',
		width: 80,
	};
	column.push(netReceipts);
	return column;
});

const state = reactive<StateType>({
	tableData: {
		param: {
			orderNo: '', //订单编号
			itineraryNo: '', //团单编号
			teamType: null, //团队类型
			subTravelOid: null, //地接社id
			settlementStartTime: '', //结算开始时间
			settlementEndTime: '', //结算结束时间
			hotelName: '', //酒店名称
			verificationStartTime: '', //核销开始时间
			verificationEndTime: '', //核销结束时间
			pageSize: 10, //页大小
			pageNo: 1, //页号
		},
		data: [],
		total: 0,
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
};
//搜索
const onHandleCurrentChange = (val: number) => {
	if (typeof val == 'number') {
		state.tableData.param.pageNo = val;
		initList();
	}
};
//翻页
const pageSideChange = (current: number, size: number) => {
	state.tableData.param.pageSize = size;
	initList();
};
const settlementTimeChange = (arr: any) => {
	if (arr && arr.length > 0) {
		state.tableData.param.settlementStartTime = Date.parse(arr[0]);
		state.tableData.param.settlementEndTime = Date.parse(arr[1]);
	} else {
		state.tableData.param.settlementStartTime = '';
		state.tableData.param.settlementEndTime = '';
	}
};
const verificationTimeChange = (arr: any) => {
	if (arr && arr.length > 0) {
		state.tableData.param.verificationStartTime = Date.parse(arr[0]);
		state.tableData.param.verificationEndTime = Date.parse(arr[1]);
	} else {
		state.tableData.param.verificationStartTime = '';
		state.tableData.param.verificationEndTime = '';
	}
};
onMounted(() => {
	initOption();
	initList();
});
const getSettlementRule = computed(() => (column: TableColumnsType, record: DataType) => {
	const data = record.settlementRuleList;
	for (const key in data) {
		if (column.title === data[key].costName) {
			let price: any = data[key].settlementCost;
			return twoDecimalPlaces(price);
		}
	}
	return '';
});
const reset = () => {
	state.tableData.param = {
		orderNo: '', //订单编号
		itineraryNo: '', //团单编号
		teamType: null, //团队类型
		subTravelOid: null, //地接社id
		settlementStartTime: '', //结算开始时间
		settlementEndTime: '', //结算结束时间
		hotelName: '', //酒店名称
		verificationStartTime: '', //核销开始时间
		verificationEndTime: '', //核销结束时间
		pageSize: 10, //页大小
		pageNo: 1, //页号
	};
	state.settlementTimeList = [];
	state.verificationTimeList = [];
	initList();
};
const twoDecimalPlaces = (number: any): any => {
	if (typeof number === 'string') {
		if (number.includes('-')) {
			number = number.slice(1);
			return `-${Number(number / 100)}`;
		}
	}
	return Number(number / 100);
};
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
}
</style>
