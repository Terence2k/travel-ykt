<template>
	<CommonSearch>
		<search-item label="归属景区" v-if="state.tableData.param.productType === 1">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.scenicId" style="width: 180px" placeholder="请选择归属景区">
				<a-select-option v-for="item in state.scenicList" :value="item['ticketId']" :key="item['ticketName']">{{ item.ticketName }}</a-select-option>
			</a-select>
		</search-item>
		<search-item label="酒店名称" v-if="state.tableData.param.productType === 2">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.scenicId" style="width: 180px" placeholder="请选择归属景区">
				<a-select-option v-for="item in state.hotelNameList" :value="item['oid']" :key="item['oid']">{{ item.hotelName }}</a-select-option>
			</a-select>
		</search-item>
		<search-item label="门店名称" v-if="state.tableData.param.productType === 3">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.scenicId" style="width: 180px" placeholder="请选择归属景区">
				<a-select-option v-for="item in state.shopList" :value="item['shopId']" :key="item['shopId']">{{ item.shopName }}</a-select-option>
			</a-select>
		</search-item>
		<search-item label="产品名称">
			<a-input v-model:value="state.tableData.param.productName" placeholder="请输入费用名称" allowClear style="width: 180px" />
		</search-item>
		<search-item label="产品类型" v-if="state.tableData.param.productType === 1">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.productSonType" style="width: 180px" placeholder="请选择结算产品">
				<a-select-option :value="item.value" v-for="item in generaRulesOptions.productSonTypeList" :key="item.name">{{ item.name }}</a-select-option>
			</a-select>
		</search-item>
		<search-item :label="state.tableData.param.productType === 1 ? '是否有结算规则' : '是否有产品规划'">
			<a-select
				allowClear
				ref="select"
				v-model:value="state.tableData.param.hasProductRule"
				style="width: 180px"
				:placeholder="state.tableData.param.productType === 1 ? '请选择结算产品' : '请选择产品规划'"
			>
				<a-select-option :value="true">是</a-select-option>
				<a-select-option :value="false">否</a-select-option>
			</a-select>
		</search-item>
		<template #button>
			<a-button @click="initList">查询</a-button>
		</template>
	</CommonSearch>
	<div class="table-area">
		<a-tabs v-model:activeKey="state.tableData.param.productType" @change="tabsChange">
			<a-tab-pane :key="1" tab="景区"></a-tab-pane>
			<a-tab-pane :key="2" tab="酒店" force-render></a-tab-pane>
			<a-tab-pane :key="3" tab="餐饮"></a-tab-pane>
			<a-tab-pane :key="4" tab="综费产品"></a-tab-pane>
		</a-tabs>
		<a-spin size="large" :spinning="state.tableData.loading">
			<CommonTable :dataSource="state.tableData.data" :columns="columns" :scroll="{ x: '100%' }">
				<template #bodyCell="{ column, record }">
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a href="javascript:;" @click="toConfigure(record)">配置规则</a>
						</div>
					</template>
					<template v-if="column.key === 'hasProductRule'">
						<span v-if="record.hasProductRule">是</span>
						<span v-else>否</span>
					</template>
					<!-- 产品类型 -->
					<template v-if="column.key === 'productSonType'">
						<span>{{ getProductTypeName(record.productSonType) }}</span>
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
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import api from '@/api';
import { useGeneraRules } from '@/stores/modules/GeneraRules';
const navigatorBar = useNavigatorBar();
// import { userList } from '@/api';
const route = useRouter();
const activeKey = ref(1);
const columns = computed(() => {
	let column = [];
	if (Number(state.tableData.param.productType) === 1) {
		column = [
			{
				title: '产品名称',
				dataIndex: 'productName',
				key: 'productName',
			},
			{
				title: '归属景区',
				dataIndex: 'scenicName',
				key: 'scenicName',
			},
			{
				title: '产品类型',
				dataIndex: 'productSonType',
				key: 'productSonType',
			},
			{
				title: '是否有结算规则',
				dataIndex: 'hasProductRule',
				key: 'hasProductRule',
			},
		];
	} else if (Number(state.tableData.param.productType) === 2) {
		column = [
			{
				title: '房型名称',
				dataIndex: 'productName',
				key: 'productName',
			},
			{
				title: '酒店名称',
				dataIndex: 'scenicName',
				key: 'scenicName',
			},
			{
				title: '是否有产品规划',
				dataIndex: 'hasProductRule',
				key: 'hasProductRule',
			},
		];
	} else if (Number(state.tableData.param.productType) === 3) {
		column = [
			{
				title: '餐饮名称',
				dataIndex: 'productName',
				key: 'productName',
			},
			{
				title: '门店名称',
				dataIndex: 'scenicName',
				key: 'scenicName',
			},
			{
				title: '是否有产品规划',
				dataIndex: 'hasProductRule',
				key: 'hasProductRule',
			},
		];
	} else {
		column = [
			{
				title: '产品名称',
				dataIndex: 'productName',
				key: 'productName',
			},
			{
				title: '是否有产品规划',
				dataIndex: 'hasProductRule',
				key: 'hasProductRule',
			},
		];
	}

	const action = {
		title: '操作',
		key: 'action',
		fixed: 'right',
		width: 208,
	};
	column.push(action);
	return column;
});
const state = reactive({
	tableData: {
		data: [
			{
				name: 123456,
			},
		],
		total: 11,
		loading: false,
		param: {
			scenicId: null, //关联景区id
			productName: null, //产品名称
			productType: 1, //产品类型 1-景区 2-酒店 3-餐饮
			productSonType: null, //产品类型下拉列表，UNITE-联票 ONE-单票 SHOW-演出票
			hasProductRule: null, //是否有结算规则 true-是 false-否
			pageNo: 1, //页号
			pageSize: 10, //页大小
		},
	},
	scenicList: [],
	shopList: [],
	hotelNameList: [],
});
//搜索
const onHandleCurrentChange = (val: number) => {
	console.log('change:', val);
	state.tableData.param.pageNo = val;
	// onSearch();
	initList();
};
//翻页
const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	state.tableData.param.pageSize = size;
	// onSearch();
	initList();
};
const generaRulesOptions = useGeneraRules();
//查看
const toConfigure = (record: any) => {
	console.log(record, `record`);
	let query = {};
	if (state.tableData.param.productType === 1) {
		query = {
			productId: encodeURIComponent(record.productId),
			productType: encodeURIComponent(record.productType),
			productSonType: encodeURIComponent(record.productSonType),
		};
	} else {
		query = {
			productId: encodeURIComponent(record.productId),
			productType: encodeURIComponent(record.productType),
		};
	}
	route.push({
		path: '/settlementManagement/productSettlementRule/configureRules',
		query,
	});
};
// const onSearch = () => {
// 	userList(state.tableData.param).then((res) => {
// 		console.log(res);
// 	});
// };
const initList = async () => {
	state.tableData.loading = true;
	let res = await api.productRuleList(state.tableData.param);
	const { total, content } = res;
	state.tableData.total = total;
	const list: [any] = dealData(content);
	state.tableData.data = list;
	state.tableData.loading = false;
};
const dealData = (params: [any]) => {
	params.map((i: any) => {
		// i.key = i.productId;
		return i;
	});

	return params;
};
onMounted(() => {
	initList();
	getEnum();
});
// 统一获取枚举
const getEnum = async () => {
	await generaRulesOptions.getTeamTypeList();
	await productRuleLessInfos();
	await getShopList();
	await getAllOpenHotelNameList();
};
const getProductTypeName = computed(() => (value: string) => {
	const idx = generaRulesOptions.productSonTypeList.findIndex((item) => item.value === value);
	if (idx !== -1) {
		return generaRulesOptions.productSonTypeList[idx]['name'];
	}
	return;
});
// 景区下拉枚举
const productRuleLessInfos = async () => {
	const result = await api.productRuleLessInfos();
	state.scenicList = result;
};
// 门店下拉枚举
const getShopList = async () => {
	const result = await api.getShopList();
	state.shopList = result;
};
// 酒店下拉枚举
const getAllOpenHotelNameList = async () => {
	const result = await api.getAllOpenHotelNameList();
	state.hotelNameList = result;
};
const tabsChange = () => {
	state.tableData.param.scenicId = null;
	initList();
};
</script>

<style lang="less" scoped>
::v-deep(.ant-tabs-nav) {
	padding: 16px 20px;
}
.table-area {
	position: relative;
	overflow: hidden;
}
</style>
