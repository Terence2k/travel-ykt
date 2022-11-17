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
				:options="state.viewList.map((item) => ({ value: item.ticketId, label: item.ticketName }))"
			>
			</a-select>
		</search-item>
		<search-item label="景点名称" style="width: 280px">
			<a-input v-model:value="state.tableData.param.ticketName" placeholder="请输入景点名称" allowClear style="width: 180px" />
		</search-item>
		<search-item label="团队类型" style="width: 280px">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.travelTypeId" style="width: 200px" placeholder="请选择团队类型">
				<a-select-option v-for="(item, index) in options.teamTypesLists" :value="item.oid" :key="index">{{ item.name }} </a-select-option>
			</a-select>
		</search-item>
		<search-item label="地接社" style="width: 280px">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.subTravelId" style="width: 200px" placeholder="请选择地接社名称">
				<a-se+lect-option v-for="(item, index) in options.earthContactAgencyList" :value="item.travelAgencyId" :key="index"
					>{{ item.travelAgencyName }}
				</a-se+lect-option>
			</a-select>
		</search-item>
		<search-item label="结算时间" style="width: 280px">
			<a-range-picker v-model:value="state.times" @change="timeChange" />
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
import { settlementOptions } from '@/stores/modules/settlement';
import type { TableColumnsType } from 'ant-design-vue';
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
	travelId?: number; //组团社id
	travelName?: string; //组团社名称
	subTravelId?: number; //地接社id
	subTravelName?: string; //地接社名称
	travelTypeId?: number; //团队类型id
	travelTypeName?: string; //团队类型名称
	peopleNum?: number; //人数
	frozenPrice?: string; //团款
	settlementPrice?: string; //核销总费用
	hmVo?: voType; //古维费用
	ticketVo?: voType; //景区
	hotelVo?: voType; //酒店
	cateringVo?: superviseVoType; //餐饮
	groupVo?: superviseVoType; //集团
	cultureBureauVo?: superviseVoType; //文旅局
	yktVo?: superviseVoType; //一卡通
	subTravelVo?: superviseVoType; //地接社
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
const options = settlementOptions();
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
			title: '古维费用',
			key: 'hmVo',
			children: [
				{
					title: '冻结金额',
					dataIndex: 'frozenPrice',
					key: 'frozenPrice',
					width: 100,
				},
				{
					title: '已核销金额',
					dataIndex: 'settlementPrice',
					key: 'settlementPrice',
					width: 100,
				},
				{
					title: '实收',
					dataIndex: 'actualPrice',
					key: 'actualPrice',
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
					key: 'frozenPrice',
					width: 100,
				},
				{
					title: '已核销金额',
					dataIndex: 'settlementPrice',
					key: 'settlementPrice',
					width: 100,
				},
				{
					title: '实收',
					dataIndex: 'actualPrice',
					key: 'actualPrice',
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
					key: 'frozenPrice',
					width: 100,
				},
				{
					title: '已核销金额',
					dataIndex: 'settlementPrice',
					key: 'settlementPrice',
					width: 100,
				},
				{
					title: '实收',
					dataIndex: 'actualPrice',
					key: 'actualPrice',
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
					key: 'frozenPrice',
					width: 100,
				},
				{
					title: '已核销金额',
					dataIndex: 'settlementPrice',
					key: 'settlementPrice',
					width: 100,
				},
				{
					title: '实收',
					dataIndex: 'actualPrice',
					key: 'actualPrice',
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
					key: 'actualPrice',
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
					key: 'actualPrice',
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
					key: 'actualPrice',
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
					key: 'actualPrice',
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
					key: 'actualPrice',
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
					key: 'actualPrice',
					width: 100,
				},
			],
		},
	]);
	const data = state.tableData.data;
	// 把综费产品两个数组整合到表头上
	for (let index = 0; index < data.length; index++) {
		// 综费产品 - 导服费
		for (const key in data[index].comprehensiveGuideVoList) {
			const vo = data[index].comprehensiveGuideVoList[key];
			// 判断是否已经存在
			const idx = comprehensiveGuideVoListIds.value.findIndex((item) => item === vo.comprehensiveFeeProductId);
			if (idx === -1) {
				comprehensiveGuideVoListIds.value.push(vo.comprehensiveFeeProductId);
				const comprehensiveGuideVo = {
					title: `${vo.comprehensiveFeeProductName}`,
					dataIndex: `${vo.comprehensiveFeeProductId}`,
					key: 'comprehensiveGuideVoList',
					children: [
						{
							title: '费用归属',
							dataIndex: 'belongCompany',
							key: 'belongCompany',
							width: 100,
						},
						{
							title: '实收',
							dataIndex: 'actualPrice',
							key: 'actualPrice',
							width: 100,
						},
					],
				};
				column.value.push(comprehensiveGuideVo);
			}
		}
		//综费产品-除导服费外
		for (const key in data[index].comprehensiveVoList) {
			const vo = data[index].comprehensiveVoList[key];
			// 判断是否已经存在
			const idx = comprehensiveVoListIds.value.findIndex((item) => item === vo.comprehensiveFeeProductId);
			if (idx === -1) {
				comprehensiveVoListIds.value.push(vo.comprehensiveFeeProductId);
				const comprehensiveGuideVo = {
					title: `${vo.comprehensiveFeeProductName}`,
					dataIndex: `${vo.comprehensiveFeeProductId}`,
					key: 'comprehensiveVoList',
					children: [
						{
							title: '费用归属',
							dataIndex: 'belongCompany',
							key: 'belongCompany',
							width: 100,
						},
						{
							title: '实收',
							dataIndex: 'actualPrice',
							key: 'actualPrice',
							width: 100,
						},
					],
				};
				column.value.push(comprehensiveGuideVo);
			}
		}
	}
	// 把所有带有结算规则的数据进行配置表头结算规则
	const ruleMap: any = [];
	for (let index = 0; index < data.length; index++) {
		for (const key in data[index]) {
			// 先对于除综费产品外的数据进行处理
			if (key.includes('Vo') && !key.includes('List')) {
				for (let j = 0; j < column.value.length; j++) {
					if (column.value[j].key === key) {
						if (!ruleMap[key]) {
							ruleMap[key] = { column: {}, data: [] };
						}
						ruleMap[key]['column'] = column.value[j].children;
						ruleMap[key]['data'].push(data[index][key]['ruleList']);
					}
				}
			}
		}
	}
	console.log(ruleMap, `ruleMap`);
	for (const key in ruleMap) {
		console.log(ruleMap[key]);
	}
	return column.value;
});
const comprehensiveGuideVoListIds = ref([]);
const comprehensiveVoListIds = ref([]);
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
	// state.tableData.loading = true;
	// let res = await api.byItineraryTicket(state.tableData.param);
	// const { total, content } = res;
	// state.tableData.total = total;
	// state.tableData.data = content;
	// state.tableData.loading = false;
	state.tableData.data = [
		{
			travelId: 1, //组团社id
			travelName: '1', //组团社名称
			subTravelId: 1, //地接社id
			subTravelName: '1', //地接社名称
			travelTypeId: 1, //团队类型id
			travelTypeName: '1', //团队类型名称
			peopleNum: 1, //人数
			frozenPrice: '1', //团款
			settlementPrice: '1', //核销总费用
			hmVo: {
				frozenPrice: '1', //冻结金额
				settlementPrice: '1', //已核销金额
				actualPrice: '1', //实收
				ruleList: [
					{
						ruleName: '结算规则-001', //规则名称
						rulePrice: '100', //结算费用
					},
					{
						ruleName: '结算规则-002', //规则名称
						rulePrice: '200', //结算费用
					},
					{
						ruleName: '结算规则-003', //规则名称
						rulePrice: '200', //结算费用
					},
				], //结算规则
			}, //古维费用
			ticketVo: {
				frozenPrice: '1', //冻结金额
				settlementPrice: '1', //已核销金额
				actualPrice: '1', //实收
				ruleList: [
					{
						ruleName: '1', //规则名称
						rulePrice: '1', //结算费用
					},
				], //结算规则
			}, //景区
			hotelVo: {
				frozenPrice: '1', //冻结金额
				settlementPrice: '1', //已核销金额
				actualPrice: '1', //实收
				ruleList: [
					{
						ruleName: '1', //规则名称
						rulePrice: '1', //结算费用
					},
				], //结算规则
			}, //酒店
			cateringVo: {
				actualPrice: '1', //实收
				ruleList: [
					{
						ruleName: '1', //规则名称
						rulePrice: '1', //结算费用
					},
				], //结算规则
			}, //餐饮
			superviseVo: {
				actualPrice: '1', //实收
				ruleList: [
					{
						ruleName: '1', //规则名称
						rulePrice: '1', //结算费用
					},
				], //结算规则
			}, //监理
			associationVo: {
				actualPrice: '1', //实收
				ruleList: [
					{
						ruleName: '1', //规则名称
						rulePrice: '1', //结算费用
					},
				], //结算规则
			}, //协会
			groupVo: {
				actualPrice: '1', //实收
				ruleList: [
					{
						ruleName: '1', //规则名称
						rulePrice: '1', //结算费用
					},
				], //结算规则
			}, //集团
			cultureBureauVo: {
				actualPrice: '1', //实收
				ruleList: [
					{
						ruleName: '1', //规则名称
						rulePrice: '1', //结算费用
					},
				], //结算规则
			}, //文旅局
			yktVo: {
				actualPrice: '1', //实收
				ruleList: [
					{
						ruleName: '1', //规则名称
						rulePrice: '1', //结算费用
					},
				], //结算规则
			}, //一卡通
			subTravelVo: {
				actualPrice: '1', //实收
				ruleList: [
					{
						ruleName: '1', //规则名称
						rulePrice: '1', //结算费用
					},
				], //结算规则
			}, //地接社
			comprehensiveGuideVoList: [
				{
					comprehensiveFeeProductId: 1, //综费产品id
					comprehensiveFeeProductName: '综费产品-导服费', //综费产品名称
					travelActualPrice: '1', //旅行社实收
					groupActualPrice: '1', //集团实收
					ruleList: [
						{
							ruleName: '1', //规则名称
							rulePrice: '1', //结算费用
						},
					], //结算规则
				},
			], //综费产品-导服费
			comprehensiveVoList: [
				{
					comprehensiveFeeProductId: 1, //综费产品id
					comprehensiveFeeProductName: '综费产品-除导服费外', //综费产品名称
					belongCompany: '1', //费用归属  取字典父级code_value=BUSINESS_TYPE的所有子级
					actualPrice: '1', //实收
					ruleList: [
						{
							ruleName: '1', //规则名称
							rulePrice: '1', //结算费用
						},
					], //结算规则
				},
			], //综费产品-除导服费外
		},
		{
			hmVo: {
				frozenPrice: '1', //冻结金额
				settlementPrice: '1', //已核销金额
				actualPrice: '1', //实收
				ruleList: [
					{
						ruleName: '结算规则-001', //规则名称
						rulePrice: '100', //结算费用
					},
					{
						ruleName: '结算规则-004', //规则名称
						rulePrice: '200', //结算费用
					},
					{
						ruleName: '结算规则-005', //规则名称
						rulePrice: '200', //结算费用
					},
				], //结算规则
			}, //古维费用
		},
		{
			hmVo: {
				frozenPrice: '1', //冻结金额
				settlementPrice: '1', //已核销金额
				actualPrice: '1', //实收
				ruleList: [
					{
						ruleName: '结算规则-008', //规则名称
						rulePrice: '100', //结算费用
					},
					{
						ruleName: '结算规则-009', //规则名称
						rulePrice: '200', //结算费用
					},
					{
						ruleName: '结算规则-001', //规则名称
						rulePrice: '200', //结算费用
					},
				], //结算规则
			}, //古维费用
		},
	];
};
// // 获取景区下拉列表
// const getViewList = async () => {
// 	const result = await api.getViewList();
// 	state.viewList = result;
// 	console.log(state.viewList, `state.viewList`);
// };
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
// const settlementStartTimeChange = (arr: any) => {
// 	if (arr && arr.length > 0) {
// 		state.tableData.param.settlementStartTime = arr[0]['$d'];
// 		state.tableData.param.settlementEndTime = arr[1]['$d'];
// 	} else {
// 		state.tableData.param.settlementStartTime = '';
// 		state.tableData.param.settlementEndTime = '';
// 	}
// };
onMounted(() => {
	// options.getTeamTypeList();
	// options.getGroupSocietyList();
	// options.getEarthContactAgencyList();
	initList();
	// getViewList();
});
const timeChange = (arr: any) => {
	if (arr && arr.length > 0) {
		state.tableData.param.settlementStartTime = arr[0]['$d'];
		state.tableData.param.settlementEndTime = arr[1]['$d'];
	} else {
		state.tableData.param.settlementStartTime = null;
		state.tableData.param.settlementEndTime = null;
	}
};
</script>
<style scoped lang="less"></style>
