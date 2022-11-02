<template>
	<CommonSearch>
		<SearchItem label="门票名称">
			<a-input placeholder="输入门票名称" style="width: 200px" v-model:value="state.tableData.param.ticketName" />
		</SearchItem>
		<SearchItem label="门票分类">
			<a-select ref="select" style="width: 200px" placeholder="请选择门票分类" v-model:value="state.tableData.param.ticketType">
				<a-select-option value="0">联票</a-select-option>
				<a-select-option value="1">单票</a-select-option>
				<a-select-option value="2">演出票</a-select-option>
			</a-select>
		</SearchItem>
		<template #button>
			<a-button @click="reset()" class="btn">重置</a-button>
			<a-button @click="onSearch()">查询</a-button>
		</template>
	</CommonSearch>
	<div class="table-area">
		<CommonTable :dataSource="state.tableData.data" :columns="columns">
			<template #bodyCell="{ column, index, record }">
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a @click="SetUp({ row: record })">设置核销时间段</a>
					</div>
				</template>
				<template v-if="column.key === 'verificationType'">
					<a-span v-if="record.verificationType == 0">单点</a-span>
					<a-span v-else>多点</a-span>
				</template>
				<template v-if="column.key === 'ticketType'">
					<a-span v-if="record.ticketType == 0">联票</a-span>
					<a-span v-else-if="record.ticketType == 1">单票</a-span>
					<a-span v-else>演出票</a-span>
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
	<SetUpTime v-model="state.operationModal.isSetUpdate" :params="state.params" @cancel="cancel"></SetUpTime>
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
		dataIndex: 'ticketType',
		key: 'ticketType',
	},
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		width: 150,
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
			pageSize: 10,
		},
	},
	operationModal: {
		isSetUpdate: false,
	},
	params: {},
});
const onSearch = () => {
	api.getVerifManage(state.tableData.param).then((res: any) => {
		console.log('res:', res.content);
		state.tableData.data = res.content;
		state.tableData.total = res.total;
	});
};
const reset = () => {
	(state.tableData.param.ticketType = ''), (state.tableData.param.ticketName = ''), onSearch();
};
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
onMounted(() => {
	onSearch();
});
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
.btn {
	margin-right: 30px;
}
</style>
