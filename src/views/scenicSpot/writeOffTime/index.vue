<template>
	<CommonSearch>
		<SearchItem label="门票名称">
			<a-input placeholder="输入门票名称" style="width: 200px" v-model:value="state.tableData.param.ticketName" />
		</SearchItem>
		<SearchItem label="门票分类">
			<a-select ref="select" style="width: 200px" placeholder="请选择门票分类" v-model:value="state.tableData.param.ticketType">
				<a-select-option value="0">单票</a-select-option>
				<a-select-option value="1">演出票</a-select-option>
				<a-select-option value="2">联票</a-select-option>
			</a-select>
		</SearchItem>
		<template #button>
			<a-button @click="onSearch()">查询</a-button>
		</template>
	</CommonSearch>
	<div class="table-area">
		<CommonTable :dataSource="dataSource" :columns="columns">
			<template #bodyCell="{ column, index, record }">
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a @click="SetUp({ row: record })">设置核销时间段</a>
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
	<SetUpTime v-model="state.operationModal.isSetUpdate" :params="state.params"></SetUpTime>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import SetUpTime from './setUpTime.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import api from '@/api';
const route = useRouter();
const navigatorBar = useNavigatorBar();
// import { userList } from '@/api';
const dataSource = [
	{
		ticketName: '木府',
		verificationType: '多点核销',
		scenicName: '木府',
		ticketDataType: '单票',
		address4: '待审核',
	},
	{
		ticketName: '木府纳西族演出',
		verificationType: '单点核销',
		scenicName: '木府',
		ticketDataType: '演出票',
		address4: '待审核',
	},
	{
		ticketName: '古城一票游',
		verificationType: '多点核销',
		scenicName: '丽江古城，木府',
		ticketDataType: '联票',
		address4: '待审核',
	},
];
const columns = [
	{
		title: '门票名称',
		dataIndex: 'ticketName',
		key: 'ticketName',
	},
	{
		title: '票种',
		dataIndex: 'verificationType',
		key: 'verificationType',
	},
	{
		title: '归属景区',
		dataIndex: 'scenicName',
		key: 'scenicName',
	},
	{
		title: '门票分类',
		dataIndex: 'ticketDataType',
		key: 'ticketDataType',
	},
	{
		title: '审核状态',
		dataIndex: 'address4',
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
			ticketName: '',
			ticketType: '',
			pageNo: 1,
			pageSize: 9999,
		},
	},
	operationModal: {
		isSetUpdate: false,
	},
	params: {},
});
const onSearch = () => {
	api.getWriteOffTimeList(state.tableData.param).then((res: any) => {
		console.log('res:', res);
		//   state.tableData.data = res.content;
		//   state.tableData.total = res.total;
	});
	console.log(state.tableData.param, '1111111111111');
};
const SetUp = (param: any) => {
	const row = param;
	state.params = row;
	state.operationModal.isSetUpdate = true;
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
