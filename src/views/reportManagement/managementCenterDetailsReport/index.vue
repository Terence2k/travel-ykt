<template>
	<CommonSearch>
		<search-item label="团队类型" style="width: 280px">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.travelTypeId" style="width: 200px" placeholder="请选择团队类型">
				<a-select-option v-for="(item, index) in options.teamTypesLists" :value="item.oid" :key="index">{{ item.name }} </a-select-option>
			</a-select>
		</search-item>
		<search-item label="组团社">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.travelId" style="width: 200px" placeholder="请选择旅行社名称">
				<a-select-option v-for="(item, index) in options.groupSocietyList" :value="item.travelAgencyId" :key="index"
					>{{ item.travelAgencyName }}
				</a-select-option>
			</a-select>
		</search-item>
		<search-item label="地接社">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.subTravelId" style="width: 200px" placeholder="请选择旅行社名称">
				<a-select-option v-for="(item, index) in options.earthContactAgencyList" :value="item.travelAgencyId" :key="index"
					>{{ item.travelAgencyName }}
				</a-select-option>
			</a-select>
		</search-item>
		<search-item label="结算时间" style="width: 280px">
			<a-range-picker v-model:value="state.tableData.settlementStartTimeList" @change="timeChange" />
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
			<!--  -->
			<CommonTable :dataSource="state.tableData.data" :columns="columns" :scroll="{ x: '100%', y: '100%' }" bordered>
				<template #bodyCell="{ column, record }"> </template>
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
import type { TableColumnsType } from 'ant-design-vue';
import api from '@/api';
import { settlementOptions } from '@/stores/modules/settlement';
const options = settlementOptions();
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
	travelId: string | number | null; //组团社id
	subTravelId: string | number | null; //地接社id
	settlementTimeStart: string | number | null; //结算开始时间
	settlementTimeEnd: string | number | null; //结算结束时间
	travelTypeId: string | number | null; //团队类型id
	pageNo: number; //页号
	pageSize: number; //页大小
}
interface DataType {
	travelId?: number; //组团社id
	travelName?: string; //组团社名称
	subTravelId?: number; //地接社id
	subTravelName?: string; //地接社名称
	travelTypeId?: number; //团队类型id
	travelTypeName?: string; //团队类型名称
	peopleNum?: number; //人数
	frozenPrice?: string; //团款
	settlementPrice?: string; //核销总费用
	unSettlementPrice?: string; //未消费费用
	hmVo?: voType; //古维费用
	ticketVo?: voType; //景区
	hotelVo?: voType; //酒店
	cateringVo?: superviseVoType; //餐饮
	groupVo?: superviseVoType; //集团
	cultureBureauVo?: superviseVoType; //文旅局
	yktVo?: superviseVoType; //一卡通
	subTravelVo?: subTravelVoType; //地接社
	superviseVo?: superviseVoType; //监理
	associationVo?: superviseVoType; //协会
	comprehensiveGuideVoList?: Array<comprehensiveGuideVoListType>; //综费产品-导服费
	comprehensiveVoList?: Array<comprehensiveVoListType>; //综费产品-除导服费外
}
// 古维费用 景区 酒店
interface voType {
	frozenPrice: string; //冻结金额
	settlementPrice: string; //已核销金额
	actualPrice: string; //实收
	ruleList: Array<ruleListType>;
}
// 餐饮 监理 协会 集团 文旅局 一卡通 地接社
interface superviseVoType {
	actualPrice: string; //实收
	ruleList: Array<ruleListType>;
}
// 综费产品-导服费
interface comprehensiveGuideVoListType {
	comprehensiveFeeProductId: number; //综费产品id
	comprehensiveFeeProductName: string; //综费产品名称
	travelActualPrice: string; //旅行社实收
	groupActualPrice: string; //集团实收
	ruleList: Array<ruleListType>;
}
interface subTravelVoType extends superviseVoType {
	unSettlementPrice: string;
}
// 综费产品-除导服费外
interface comprehensiveVoListType {
	comprehensiveFeeProductId: number; //综费产品id
	comprehensiveFeeProductName: string; //综费产品名称
	belongCompany: string; //费用归属  取字典父级code_value=BUSINESS_TYPE的所有子级
	actualPrice: string; //实收
	ruleList: Array<ruleListType>;
}
interface ruleListType {
	ruleName: string; //规则名称
	rulePrice: string; //结算费用
}
const columns = computed(() => {
	const column = ref<TableColumnsType>([
		{
			title: '组团社',
			dataIndex: 'travelName',
			key: 'travelName',
			width: 100,
		},
		{
			title: '地接社',
			dataIndex: 'subTravelName',
			key: 'subTravelName',
			width: 100,
		},
		{
			title: '团队类型',
			dataIndex: 'travelTypeName',
			key: 'travelTypeName',
			width: 100,
		},
		{
			title: '人数',
			dataIndex: 'peopleNum',
			key: 'peopleNum',
			width: 80,
		},
		{
			title: '团款',
			dataIndex: 'frozenPrice',
			key: 'frozenPrice',
			width: 100,
		},
		{
			title: '核销总费用',
			dataIndex: 'settlementPrice',
			key: 'settlementPrice',
			width: 100,
		},
		{
			title: '未消费费用',
			dataIndex: 'unSettlementPrice',
			key: 'unSettlementPrice',
			width: 100,
		},
		{
			title: '古维费用',
			key: 'hmVo',
			children: [
				{
					title: '冻结金额',
					dataIndex: 'frozenPrice',
					key: 'hmVo',
					width: 100,
				},
				{
					title: '已核销金额',
					dataIndex: 'settlementPrice',
					key: 'hmVo',
					width: 100,
				},
				{
					title: '实收',
					dataIndex: 'actualPrice',
					key: 'hmVo',
					width: 100,
				},
			],
		},
		{
			title: '景区',
			key: 'ticketVo',
			children: [
				{
					title: '冻结金额',
					dataIndex: 'frozenPrice',
					key: 'ticketVo',
					width: 100,
				},
				{
					title: '已核销金额',
					dataIndex: 'settlementPrice',
					key: 'ticketVo',
					width: 100,
				},
				{
					title: '实收',
					dataIndex: 'actualPrice',
					key: 'ticketVo',
					width: 100,
				},
			],
		},
		{
			title: '酒店',
			key: 'hotelVo',
			children: [
				{
					title: '冻结金额',
					dataIndex: 'frozenPrice',
					key: 'hotelVo',
					width: 100,
				},
				{
					title: '已核销金额',
					dataIndex: 'settlementPrice',
					key: 'hotelVo',
					width: 100,
				},
				{
					title: '实收',
					dataIndex: 'actualPrice',
					key: 'hotelVo',
					width: 100,
				},
			],
		},
		{
			title: '餐饮',
			key: 'cateringVo',
			children: [
				{
					title: '冻结金额',
					dataIndex: 'frozenPrice',
					key: 'cateringVo',
					width: 100,
				},
				{
					title: '已核销金额',
					dataIndex: 'settlementPrice',
					key: 'cateringVo',
					width: 100,
				},
				{
					title: '实收',
					dataIndex: 'actualPrice',
					key: 'cateringVo',
					width: 100,
				},
			],
		},
		{
			title: '监理',
			key: 'superviseVo',
			children: [
				{
					title: '实收',
					dataIndex: 'actualPrice',
					key: 'superviseVo',
					width: 100,
				},
			],
		},
		{
			title: '协会',
			key: 'associationVo',
			children: [
				{
					title: '实收',
					dataIndex: 'actualPrice',
					key: 'associationVo',
					width: 100,
				},
			],
		},
		{
			title: '集团',
			key: 'groupVo',
			children: [
				{
					title: '实收',
					dataIndex: 'actualPrice',
					key: 'groupVo',
					width: 100,
				},
			],
		},
		{
			title: '文旅局',
			key: 'cultureBureauVo',
			children: [
				{
					title: '实收',
					dataIndex: 'actualPrice',
					key: 'cultureBureauVo',
					width: 100,
				},
			],
		},
		{
			title: '一卡通',
			key: 'yktVo',
			children: [
				{
					title: '实收',
					dataIndex: 'actualPrice',
					key: 'yktVo',
					width: 100,
				},
			],
		},
		{
			title: '地接社',
			key: 'subTravelVo',
			children: [
				{
					title: '实收',
					dataIndex: 'actualPrice',
					key: 'subTravelVo',
					width: 100,
				},
				{
					title: '未消费费用',
					dataIndex: 'unSettlementPrice',
					key: 'subTravelVo',
					width: 100,
				},
			],
		},
	]);
	return column.value;
});
const state = reactive<StateType>({
	tableData: {
		param: {
			travelId: null, //组团社id
			subTravelId: null, //地接社id
			settlementTimeStart: '', //结算开始时间
			settlementTimeEnd: '', //结算结束时间
			travelTypeId: null, //团队类型id
			pageNo: 1, //页号
			pageSize: 10, //页大小
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
	let res = await api.statementList(state.tableData.param);
	const { total, content } = res;
	state.tableData.total = total;
	state.tableData.data = content;
	state.tableData.loading = false;
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
onMounted(() => {
	options.getTeamTypeList();
	options.getGroupSocietyList();
	options.getEarthContactAgencyList();
	initList();
});
const timeChange = (arr: any) => {
	if (arr && arr.length > 0) {
		state.tableData.param.settlementTimeStart = arr[0]['$d'];
		state.tableData.param.settlementTimeEnd = arr[1]['$d'];
	} else {
		state.tableData.param.settlementTimeStart = null;
		state.tableData.param.settlementTimeEnd = null;
	}
};
</script>
<style scoped lang="less"></style>
