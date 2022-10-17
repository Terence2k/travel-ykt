<template>
	<CommonSearch>
		<SearchItem label="输入搜索">
			<a-input placeholder="门票名称/关键词" style="width: 200px" />
		</SearchItem>
		<SearchItem label="门票分类">
			<a-select ref="select" style="width: 200px" placeholder="请选择">
				<a-select-option value="all">all</a-select-option>
			</a-select>
		</SearchItem>
		<template #button>
			<a-button>查询</a-button>
		</template>
	</CommonSearch>
	<div class="table-area">
		<CommonTable :dataSource="dataSource" :columns="columns">
			<template #bodyCell="{ column, index }">
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a @click="SetUp()">设置核销时间段</a>
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
	<SetUpTime v-model="state.operationModal.isSetUpdate"></SetUpTime>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import SetUpTime from './setUpTime.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
const route = useRouter();
const navigatorBar = useNavigatorBar();
// import { userList } from '@/api';
const dataSource = [
	{
		age: '木府',
		address: '多点核销',
		address2: '木府',
		address3: '单票',
		address4: '待审核',
	},
];
const columns = [
	{
		title: '门票名称',
		dataIndex: 'age',
		key: 'age',
	},
	{
		title: '票种',
		dataIndex: 'address',
		key: 'address',
	},
	{
		title: '归属景区',
		dataIndex: 'address2',
		key: 'address2',
	},
	{
		title: '门票分类',
		dataIndex: 'address4',
		key: 'address3',
	},
	{
		title: '审核状态',
		dataIndex: 'address3',
		key: 'address4',
	},
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		widthmin: 350,
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
	operationModal: {
		isSetUpdate: false,
	},
});

const SetUp = () => {
    state.operationModal.isSetUpdate=true
};
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
// .table-area {
// 	overflow: hidden;
// 	.list-btn {
// 		display: flex;
// 		justify-content: flex-end;
// 		padding: 24px 52px 16px;
// 	}
// 	.success {
// 		background-color: #36b374;
// 		color: #fff;
// 	}
// 	.action-btns {
// 		a {
// 			margin: 0 6px;
// 			&:first-of-type {
// 				margin-left: 0;
// 			}
// 		}
// 	}
// }

// table style
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
