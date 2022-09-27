<template>
	<CommonSearch>
		<search-item label="团单类型">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.auditStatus" style="width: 200px" placeholder="请选择归属景区">
				<a-select-option :value="-1">未提交</a-select-option>
				<a-select-option :value="0">待审核 </a-select-option>
				<a-select-option :value="1"> 审核通过</a-select-option>
				<a-select-option :value="2"> 审核未通过</a-select-option>
			</a-select>
		</search-item>
		<search-item label="行程单号">
			<a-input v-model:value="state.tableData.param.name" placeholder="请输入团单编号" />
		</search-item>
		<search-item label="组团社">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.scenicLevel" style="width: 200px" placeholder="请选择旅行社名称">
				<a-select-option :value="num" v-for="num in 10" :key="num">{{ num }}</a-select-option>
			</a-select>
		</search-item>
		<search-item label="地接社">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.scenicLevel" style="width: 200px" placeholder="请选择旅行社名称">
				<a-select-option :value="num" v-for="num in 10" :key="num">{{ num }}</a-select-option>
			</a-select>
		</search-item>
		<search-item label="预定时间">
			<a-space direction="vertical">
				<a-date-picker />
			</a-space>
		</search-item>
		<template #button>
			<a-button @click="initList">查询</a-button>
		</template>
	</CommonSearch>
	<div class="table-contaner">
		<a-tabs v-model:activeKey="activeKey">
			<a-tab-pane v-for="(item, index) in pages" :key="index" :tab="item.label">
				<component :is="item.name" v-if="index == activeKey"></component>
			</a-tab-pane>
		</a-tabs>
	</div>
</template>

<script setup lang="ts">
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import api from '@/api';
import trip from './trip/trip.vue';
import examine from './examine/examine.vue';
import settlement from './settlement/settlement.vue';
import transferred from './transferred/transferred.vue';
const navigatorBar = useNavigatorBar();
// import { userList } from '@/api';
const route = useRouter();
const activeKey = ref(0);
const check = ref(false);
const pages = [
	{
		name: trip,
		label: '行程中',
	},
	{
		name: examine,
		label: '结算审核',
	},
	{
		name: settlement,
		label: '已结算',
	},
	{
		name: transferred,
		label: '已申请转账',
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
onMounted(() => {
	initList();
	navigatorBar.setNavigator(['结算管理']);
});
onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
});
</script>

<style lang="less" scoped>
::v-deep(.ant-tabs-nav) {
	padding: 0px 20px !important;
}
// ::v-deep(.ant-tabs-top > .ant-tabs-nav) {
// 	margin: 0;
// }
.table-area .list-btn {
	padding: 0;
}
.ant-table-thead > tr > th {
	border-top: 1px solid #f0f0f0;
	background-color: #fcfcfc;
	&::before {
		height: 100% !important;
	}
}
.ant-table-body {
	height: 500px;
}
</style>
