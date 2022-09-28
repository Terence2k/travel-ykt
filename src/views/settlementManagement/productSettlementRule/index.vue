<template>
	<CommonSearch>
		<search-item label="归属景区">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.auditStatus" style="width: 200px" placeholder="请选择归属景区">
				<a-select-option :value="-1">未提交</a-select-option>
				<a-select-option :value="0">待审核 </a-select-option>
				<a-select-option :value="1"> 审核通过</a-select-option>
				<a-select-option :value="2"> 审核未通过</a-select-option>
			</a-select>
		</search-item>
		<search-item label="产品名称">
			<a-input v-model:value="state.tableData.param.name" placeholder="请输入费用名称" />
		</search-item>
		<search-item label="产品类型">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.scenicLevel" style="width: 200px" placeholder="请选择结算产品">
				<a-select-option :value="num" v-for="num in 10" :key="num">{{ num }}</a-select-option>
			</a-select>
		</search-item>
		<search-item label="是否有产品规则">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.scenicLevel" style="width: 200px" placeholder="请选择结算产品">
				<a-select-option :value="num" v-for="num in 10" :key="num">{{ num }}</a-select-option>
			</a-select>
		</search-item>
		<template #button>
			<a-button @click="initList">查询</a-button>
		</template>
	</CommonSearch>
	<div class="table-area">
		<a-tabs v-model:activeKey="activeKey">
			<a-tab-pane :key="1" tab="景区"></a-tab-pane>
			<a-tab-pane :key="2" tab="酒店" force-render></a-tab-pane>
			<a-tab-pane :key="3" tab="餐饮"></a-tab-pane>
		</a-tabs>
		<a-spin size="large" :spinning="state.tableData.loading">
			<CommonTable :dataSource="state.tableData.data" :columns="columns">
				<template #bodyCell="{ column, record }">
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a href="javascript:;" @click="toConfigure(record)">配置规则</a>
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
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import api from '@/api';
const navigatorBar = useNavigatorBar();
// import { userList } from '@/api';
const route = useRouter();
const activeKey = ref(1);
const columns = [
	{
		title: '团单类型',
		dataIndex: 'scenicLevel',
		key: 'scenicLevel',
	},
	{
		title: '结算产品',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: '费用名称',
		dataIndex: 'creditCode',
		key: 'creditCode',
	},
	{
		title: '收费金额',
		dataIndex: 'phone',
		key: 'phone',
	},
	{
		title: '费用说明',
		dataIndex: 'addressDetail',
		key: 'addressDetail',
	},
	{
		title: '状态',
		dataIndex: 'auditStatus',
		key: 'auditStatus',
	},
	{
		title: '优先级',
		dataIndex: 'derateRule',
		key: 'derateRule',
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
		data: [
			{
				name: 123456,
			},
		],
		total: 400,
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			scenicLevel: null, //景区等级(字典序号)
			auditStatus: null, //审核状态（-1未提交  0待审核  1审核通过  2审核未通过）
			name: '',
		},
	},
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
//查看
const toConfigure = (record: any) => {
	route.push({ path: '/settlementManagement/productSettlementRule/configureRules', query: { oid: encodeURIComponent(record.oid) } });
};
// const onSearch = () => {
// 	userList(state.tableData.param).then((res) => {
// 		console.log(res);
// 	});
// };
const initList = async () => {
	// state.tableData.loading = true;
	// let res = await api.getScenicSpotInformationList(state.tableData.param);
	// const { total, content } = res;
	// state.tableData.total = total;
	// const list: [any] = dealData(content);
	// state.tableData.data = list;
	// state.tableData.loading = false;
};
const status = {
	'-1': '未提交',
	0: '待审核',
	1: '审核通过',
	2: '审核未通过',
};
onMounted(() => {
	initList();
	navigatorBar.setNavigator(['产品结算规则']);
});
onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
});
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
