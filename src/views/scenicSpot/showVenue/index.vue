<template>
	<CommonSearch>
		<SearchItem label="输入搜索">
			<a-input placeholder="门票名称/关键词" style="width: 200px" />
		</SearchItem>
		<SearchItem label="归属景区">
			<a-select ref="select" style="width: 200px" placeholder="请选择">
				<a-select-option value="all">all</a-select-option>
			</a-select>
		</SearchItem>
		<template #button>
			<a-button>查询</a-button>
		</template>
	</CommonSearch>
	<div class="table-area">
		<div class="list-btn">
			<a-button type="primary" class="success" @click="add()">新增</a-button>
		</div>
		<CommonTable :dataSource="dataSource" :columns="columns">
			<template #bodyCell="{ column, index }">
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a href="javascript:;" @click="toEditPage()">编辑</a>
						<a href="javascript:;" @click="del(index)">删除</a>
						<a>下架申请</a>
					</div>
				</template>
			</template>
		</CommonTable>
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
const route = useRouter();
const navigatorBar = useNavigatorBar();
// import { userList } from '@/api';
const dataSource = [
	{
		key: '1',
		name: '1',
		age: '千古情',
		address: '西湖区湖底公园1号',
		address2: '待审核',
		address3: '上架',
	},
];
const columns = [
	{
		title: '序号',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: '演出票名称',
		dataIndex: 'age',
		key: 'age',
	},
	{
		title: '归属景区',
		dataIndex: 'address',
		key: 'address',
	},
	{
		title: '审核状态',
		dataIndex: 'address2',
		key: 'address2',
	},
	{
		title: '平台上下架状态',
		dataIndex: 'address3',
		key: 'address3',
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
			pageNo: 1,
			pageSize: 10,
		},
	},
});

const onHandleCurrentChange = (val: number) => {
	console.log('change:', val);
	state.tableData.param.pageNo = val;
	onSearch();
};

const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	state.tableData.param.pageSize = size;
	// onSearch();
};
//编辑
const toEditPage = () => {
	route.push({ path: '/scenic-spot/showTickets/show_edit' });
};
//新增
const add = () => {
	route.push({ path: '/scenic-spot/showTickets/show_edit' });
};
//删除
const del = (index) => {
	console.log(index, '111111111');
};
const onSearch = () => {
	// userList(state.tableData.param).then((res) => {
	// 	console.log(res);
	// });
};
onMounted(() => {
	// navigatorBar
	// 重新定义面包屑
	// navigatorBar.clearNavigator();
	// navigatorBar.setNavigator(['演出票']);
});
onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
});
</script>

<style lang="less" scoped>
.search-area {
	display: flex;
	flex-wrap: wrap;
	padding: 24px 52px 24px 20px;
	border-bottom: 1px #f1f2f5 solid;
	.search-items {
		display: flex;
		align-items: center;
		margin-right: 32px;
		.title {
			color: #1e2226;
			font-weight: bold;
			margin-right: 16px;
		}
	}
	.search-button {
		display: inline-flex;
		justify-content: flex-end;
		float: right;
		text-align: right;
		flex: 1;
	}
}

.list-btn {
	margin-right: 20px;
	margin-bottom: 10px;
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
