<template>
	<div class="table-area">
		<div class="list-btn">
			<a-button type="primary" class="success" @click="toAddPage()" style="margin-right: 10px">新增</a-button>
			<a-button type="primary" class="success" @click="showTip('all', undefined)">删除</a-button>
		</div>
		<a-spin size="large" :spinning="state.tableData.loading">
			<CommonTable
				:data-source="state.tableData.data"
				:columns="columns"
				:row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
				rowKey="oid"
				:scroll="{ x: '100%' }"
			>
				<template #bodyCell="{ column, record, index }">
					<!-- 团队类型 -->
					<template v-if="column.key === 'teamTypeId'">
						<span>{{ getTeamTypeName(record.teamTypeId) }}</span>
					</template>
					<!-- 产品类型 -->
					<template v-if="column.key === 'productType'">
						<span v-if="state.tableData.param['productSonType'] === 'ONE'">单票</span>
						<span v-if="state.tableData.param['productSonType'] === 'SHOW'">演出票</span>
						<span v-if="state.tableData.param['productSonType'] === 'UNITE'">{{
							getProductName(record.productSonType, record.chargeProductSonId)
						}}</span>
					</template>
					<!-- 优先级 -->
					<template v-if="column.key === 'ruleStatus'">
						<span v-if="record.ruleStatus === 0">禁用</span>
						<span v-if="record.ruleStatus === 1">启用</span>
					</template>
					<!-- 收费名称 -->
					<template v-if="column.key === 'chargeCount'">
						<span> {{ record.chargeCount }}</span>
						<span v-if="record.chargeModel === 1">%</span>
						<span v-if="record.chargeModel === 2">人</span>
						<span v-if="record.chargeModel === 3">元</span>
					</template>
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a href="javascript:;" @click="toCheck(record)">查看</a>
							<a href="javascript:;" @click="toEditPage(record)">编辑</a>
							<a v-if="record.ruleStatus === 1" href="javascript:;" @click="showTip('state', 0, record)">禁用</a>
							<a v-if="record.ruleStatus === 0" href="javascript:;" @click="showTip('state', 1, record)">启用</a>
							<a href="javascript:;" @click="showTip('index', index, record)">删除</a>
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
	<DelModal :params="cacheData.delParams" v-model="cacheData.delShow" @submit="tipSubmit" @cancel="tipCancel" />
</template>

<script setup lang="ts">
import { UnwrapRef, Ref } from 'vue';
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import DelModal from '@/components/common/DelModal.vue';
import { message } from 'ant-design-vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import api from '@/api';
const navigatorBar = useNavigatorBar();
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
			productSonType: 'ONE',
			productId: 1,
			productType: 1,
			pageNo: 1,
			pageSize: 10,
		},
	},
	selectedRowKeys: [],
	teamTypeList: [],
	productTypeList: [
		{ value: 1, name: '景区' },
		{ value: 2, name: '酒店' },
		{ value: 3, name: '餐饮' },
	],
	productSonList: [],
});

//搜索
const onHandleCurrentChange = (val: number) => {
	console.log('change:', val);
	state.tableData.param.pageNo = val;
	// onSearch();
};
//翻页
const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	state.tableData.param.pageSize = size;
	// onSearch();
};
//新增
const toAddPage = () => {
	route.push({
		path: '/settlementManagement/productSettlementRule/edit',
		query: {
			productId: encodeURIComponent(state.tableData.param['productId']),
			productType: encodeURIComponent(state.tableData.param['productType']),
			productSonType: encodeURIComponent(state.tableData.param['productSonType']),
		},
	});
};
//编辑
const toEditPage = (record: any) => {
	console.log(record.oid, encodeURIComponent(record.oid));
	route.push({
		path: '/settlementManagement/productSettlementRule/edit',
		query: {
			oid: encodeURIComponent(record.oid),
			productId: encodeURIComponent(state.tableData.param['productId']),
			productType: encodeURIComponent(state.tableData.param['productType']),
			productSonType: encodeURIComponent(state.tableData.param['productSonType']),
		},
	});
};
//查看
const toCheck = (record: any) => {
	route.push({
		path: '/settlementManagement/productSettlementRule/info',
		query: {
			oid: encodeURIComponent(record.oid),
			productId: encodeURIComponent(state.tableData.param['productId']),
			productType: encodeURIComponent(state.tableData.param['productType']),
			productSonType: encodeURIComponent(state.tableData.param['productSonType']),
		},
	});
};
// const onSearch = () => {
// 	userList(state.tableData.param).then((res) => {
// 		console.log(res);
// 	});
// };
const initList = async () => {
	const { productId, productType, productSonType } = route.currentRoute.value.query;
	state.tableData.param['productId'] = productId;
	state.tableData.param['productType'] = productType;
	state.tableData.param['productSonType'] = productSonType;
	let productRuleList = await api.productRuleList({
		productId,
		productType,
		productSonType,
		pageNo: 1, //页号
		pageSize: 10,
	});
	state.productSonList = productRuleList.content[0].productSonList;
	await getTeamType();
	// state.tableData.loading = true;
	let res: any = await api.productRuleConfigList(state.tableData.param);
	const { total, content } = res;
	state.tableData.total = total;
	const list: [any] = dealData(content);
	state.tableData.data = list;
	state.tableData.loading = false;
};

const dealData = (params: [any]) => {
	params.map((i: any) => {
		return i;
	});
	return params;
};
// 修改状态
const updateStatus = async (ids: Array<number>, ruleStatus: number) => {
	const result = await api.productRuleUpdateStatus({
		ids,
		ruleStatus,
	});
	console.log(result);
};
interface cacheDataType {
	delIndex: null | number | Array<any> | string;
	delShow: boolean;
	delParams?: delParamsType;
	delState?: string;
	state?: string | null | number;
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
		cacheData.value.delIndex = [record.oid];
		cacheData.value.state = par;
		cacheData.value.delState = 'state';
		cacheData.value.delParams = { title: parStr, content: `确定是否${parStr}？` };
	}
	cacheData.value.delShow = true;
};
const tipSubmit = async () => {
	// 修改状态
	if (cacheData.value.delState === 'state') {
		await updateStatus(cacheData.value.delIndex, cacheData.value.state);
	} else if (cacheData.value.delState === 'del') {
		///删除
		await api.deleteProductRule({ ids: cacheData.value.delIndex });
	}
	initList();
	tipCancel();
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
onMounted(() => {
	initList();
	// navigatorBar.setNavigator(['产品结算规则']);
});
// onBeforeUnmount(() => {
// 	navigatorBar.clearNavigator();
// });
// 获取团队枚举值
const getTeamType = async () => {
	const result = await api.productRuleTeamType();
	state.teamTypeList = result;
};

// 计算属性
const getTeamTypeName = computed(() => (value: number) => {
	return state.teamTypeList.find((item) => item.oid === value)['name'];
});
const getProductTypeName = computed(() => (value: number) => {
	return state.productTypeList.find((item) => item.value === value)['name'];
});
const getProductName = computed(() => (productSonType: string, chargeProductSonId: numebr) => {
	if (state.productSonList.length > 0) {
		const idx: number = state.productSonList.findIndex((item) => item.productSonId === chargeProductSonId);
		if (idx !== -1) {
			return state.productSonList[idx]['productSonName'];
		} else {
			return;
		}
	} else {
		return productSonType;
	}
});
</script>

<style lang="less" scoped>
.table-area {
	position: relative;
	overflow: hidden;
}
</style>
