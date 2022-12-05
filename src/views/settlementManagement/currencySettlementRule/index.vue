<template>
	<CommonSearch>
		<search-item label="团队类型">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.teamTypeId" style="width: 200px" placeholder="请选择团队类型">
				<a-select-option :value="item.oid" v-for="item in generaRulesOptions.teamTypeList" :key="item.name">{{ item.name }}</a-select-option>
			</a-select>
		</search-item>
		<search-item label="结算产品">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.productType" style="width: 200px" placeholder="请选择结算产品">
				<a-select-option :value="item.value" v-for="item in generaRulesOptions.currencyProductTypeList" :key="item.name">{{
					item.name
				}}</a-select-option>
			</a-select>
		</search-item>
		<search-item label="费用名称">
			<a-input v-model:value="state.tableData.param.costName" placeholder="请输入费用名称" />
		</search-item>
		<search-item label="状态启用">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.ruleStatus" style="width: 200px" placeholder="请选择结算产品">
				<a-select-option :value="item.value" v-for="item in generaRulesOptions.ruleStatusList" :key="item.name">{{ item.name }}</a-select-option>
			</a-select>
		</search-item>
		<template #button>
			<a-button @click="initList" v-permission="`查询`">查询</a-button>
		</template>
	</CommonSearch>
	<div class="table-area">
		<div class="list-btn">
			<a-button type="primary" class="success" @click="toAddPage()" style="margin-right: 10px">新增</a-button>
			<a-button type="primary" class="success" @click="showTip('all', undefined)">删除</a-button>
		</div>
		<a-spin size="large" :spinning="state.tableData.loading">
			<CommonTable
				:dataSource="state.tableData.data"
				:columns="columns"
				rowKey="oid"
				:row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
				:scroll="{ x: '100%', y: '100%' }"
			>
				<template #bodyCell="{ column, record, index }">
					<!-- 收费名称 -->
					<template v-if="column.key === 'chargeCount'">
						<span v-if="record.chargeModel === 1">{{ record.chargeCount }}%</span>
						<span v-if="record.chargeModel === 2">{{ record.chargeCount }}人</span>
						<span v-if="record.chargeModel === 3">{{ (record.chargeCount / 100).toFixed(2) }}元</span>
					</template>
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a href="javascript:;" @click="toCheck(record)" v-permission="'查看'">查看</a>
							<a href="javascript:;" @click="toEditPage(record)" v-permission="`编辑`">编辑</a>
							<a v-if="record.ruleStatus === 1" href="javascript:;" @click="showTip('state', 0, record)" v-permission="`禁用`">禁用</a>
							<a v-if="record.ruleStatus === 0" href="javascript:;" @click="showTip('state', 1, record)" v-permission="`启用`">启用</a>
							<a href="javascript:;" @click="showTip('index', index, record)" v-permission="`删除`">删除</a>
						</div>
					</template>
					<!-- 团队类型 -->
					<template v-if="column.key === 'teamTypeId'">
						<span>{{ getTeamTypeName(record.teamTypeId) }}</span>
					</template>
					<!-- 产品类型 -->
					<template v-if="column.key === 'productType'">
						<span>{{ getProductTypeName(record.productType) }}</span>
					</template>
					<!-- 优先级 -->
					<template v-if="column.key === 'ruleStatus'">
						<span v-if="record.ruleStatus === 0">禁用</span>
						<span v-if="record.ruleStatus === 1">启用</span>
					</template>
					<!-- 扣费模式 -->
					<template v-if="column.key === 'deductionModel'">
						<span v-if="record.deductionModel === 1">冻结金额</span>
						<span v-if="record.deductionModel === 2">核销金额</span>
						<span v-else></span>
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
	<DelModal :params="cacheData.delParams" v-model="cacheData.delShow" @submit="tipSubmit" @cancel="tipCancel" />
</template>

<script setup lang="ts">
import { Ref } from 'vue';
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import DelModal from '@/components/common/DelModal.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import api from '@/api';
import { useGeneraRules } from '@/stores/modules/generaRules';
import { message } from 'ant-design-vue/es';
const navigatorBar = useNavigatorBar();
const generaRulesOptions = useGeneraRules();
// import { userList } from '@/api';
const route = useRouter();

const columns = [
	{
		title: '团队类型',
		dataIndex: 'teamTypeId',
		key: 'teamTypeId',
	},
	{
		title: '结算产品',
		dataIndex: 'productType',
		key: 'productType',
	},
	{
		title: '费用名称',
		dataIndex: 'costName',
		key: 'costName',
	},
	{
		title: '收费金额',
		dataIndex: 'chargeCount',
		key: 'chargeCount',
	},
	{
		title: '扣费模式',
		dataIndex: 'deductionModel',
		key: 'deductionModel',
	},
	{
		title: '费用说明',
		dataIndex: 'costExplanation',
		key: 'costExplanation',
	},
	{
		title: '状态',
		dataIndex: 'ruleStatus',
		key: 'ruleStatus',
	},
	{
		title: '优先级',
		dataIndex: 'level',
		key: 'level',
	},
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		width: 208,
	},
];

const state = reactive({
	tableData: {
		data: [],
		total: 400,
		loading: false,
		param: {
			teamTypeId: null, //团队类型id(对应ljykt_travel_agency数据库sys_team_type表oid)
			productType: null, //产品类型 1-景区 2-酒店 3-餐饮 6开始为综费产品id
			costName: '', //费用名称
			ruleStatus: null, //规则状态 1-启用 0-禁用
			pageNo: 1, //页号
			pageSize: 10, //页大小
		},
	},
	selectedRowKeys: [],
});

//搜索
const onHandleCurrentChange = (val: number) => {
	console.log('change:', val);
	state.tableData.param.pageNo = val;
	onSearch();
};
//翻页
const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	state.tableData.param.pageSize = size;
	onSearch();
};
//新增
const toAddPage = () => {
	route.push({ path: '/settlementManagement/currencySettlementRule/edit' });
};
//编辑
const toEditPage = (record: any) => {
	console.log(record.oid, encodeURIComponent(record.oid));
	route.push({ path: '/settlementManagement/currencySettlementRule/edit', query: { oid: encodeURIComponent(record.oid) } });
};
//查看
const toCheck = (record: any) => {
	route.push({ path: '/settlementManagement/currencySettlementRule/info', query: { oid: encodeURIComponent(record.oid) } });
};
const onSearch = () => {
	initList();
};
const initList = async () => {
	state.tableData.loading = true;
	let res = await api.currencySettlementRuleList(state.tableData.param);
	const { total, content } = res;
	state.tableData.total = total;
	const list: [any] = dealData(content);
	state.tableData.data = list;
	state.tableData.loading = false;
};
const dealData = (params: [any]) => {
	params.map((i: any) => {
		// i.key = i.oid;

		return i;
	});

	return params;
};
interface cacheDataType {
	delIndex: null | number | Array<any> | string;
	delShow: boolean;
	delParams?: delParamsType;
	delState?: string;
	state?: null | string | number;
}
interface delParamsType {
	title?: string;
	content?: string;
}
const cacheData: Ref<cacheDataType> = ref({
	delIndex: null,
	delShow: false,
	delParams: {},
	delState: '',
	state: null,
});
const showTip = (str: string, par: any, record: any) => {
	if (str === 'index') {
		cacheData.value.delParams = { title: '删除', content: '是否删除所选数据？' };
		cacheData.value.delIndex = [record.oid];
		cacheData.value.delState = 'del';
	} else if (str === 'all') {
		if (state.selectedRowKeys.length === 0) {
			message.error(`请先选择数据`);
			return;
		}
		cacheData.value.delParams = { title: '删除', content: '是否删除所选数据？' };
		cacheData.value.delIndex = state.selectedRowKeys;
		cacheData.value.delState = 'del';
	} else if (str === 'state') {
		let parStr = '';
		if (par === 1) {
			parStr = '启用';
		} else {
			parStr = '禁用';
		}
		cacheData.value.delIndex = record.oid;
		cacheData.value.state = par;
		cacheData.value.delState = 'state';
		cacheData.value.delParams = { title: parStr, content: `确定是否${parStr}？` };
	}
	cacheData.value.delShow = true;
};
const tipSubmit = async () => {
	// 修改状态
	if (cacheData.value.delState === 'state') {
		if (cacheData.value.state === 1) {
			api.currencySettlementEnableRule(cacheData.value.delIndex).then(() => {
				message.success(`修改成功`);
				initList();
				tipCancel();
			});
		} else {
			api.currencySettlementDisenableRule(cacheData.value.delIndex).then(() => {
				message.success(`修改成功`);
				initList();
				tipCancel();
			});
		}
	} else if (cacheData.value.delState === 'del') {
		///删除
		await api.deleteCurrencySettlementRule(cacheData.value.delIndex).then(() => {
			message.success(`删除成功`);
			initList();
			tipCancel();
		});
	}
};
const tipCancel = () => {
	cacheData.value.delState = '';
	cacheData.value.delIndex = null;
	cacheData.value.delShow = false;
};
const onSelectChange = (selectedRowKeys: any) => {
	console.log('selectedRowKeys changed: ', selectedRowKeys);
	state.selectedRowKeys = selectedRowKeys;
};
onMounted(async () => {
	getEnum();
	initList();
	// navigatorBar.setNavigator(['通用结算规则']);
});
// onBeforeUnmount(() => {
// 	navigatorBar.clearNavigator();
// });

const getEnum = async () => {
	await generaRulesOptions.getTeamTypeList();
	await generaRulesOptions.getHotelRatedList();
};
// 计算属性
const getTeamTypeName = computed(() => (value: number) => {
	if (generaRulesOptions.productTypeList) {
		const idx = generaRulesOptions.teamTypeList.findIndex((item) => item.oid === value);
		if (idx !== -1) {
			return generaRulesOptions.teamTypeList[idx]['name'];
		}
		return '';
	}
	return '';
});
const getProductTypeName = computed(() => (value: number) => {
	if (generaRulesOptions.productTypeList) {
		const idx = generaRulesOptions.productTypeList.findIndex((item) => item.value === value);
		if (idx !== -1) {
			return generaRulesOptions.productTypeList[idx]['name'];
		}
		return '';
	}
	return '';
});
</script>

<style lang="less" scoped>
.table-area {
	position: relative;
	overflow: hidden;
}
</style>
