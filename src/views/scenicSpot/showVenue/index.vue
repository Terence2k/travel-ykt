<template>
	<CommonSearch>
		<SearchItem label="输入搜索">
			<a-input v-model="state.tableData.param.venueName" placeholder="演出名称/关键词" style="width: 200px" />
		</SearchItem>
		<SearchItem label="归属景区">
			<a-select ref="select" style="width: 200px" v-model="state.tableData.param.scenicId" placeholder="请选择">
				<a-select-option value="all">all</a-select-option>
			</a-select>
		</SearchItem>
		<template #button>
			<a-button @click="search">查询</a-button>
		</template>
	</CommonSearch>
	<editModel ref="editModelRef" />
	<div class="table-area">
		<div class="list-btn">
			<a-button type="primary" class="success" @click="add()">新增</a-button>
		</div>
		<CommonTable :dataSource="state.tableData.data" :columns="columns">
			<template #bodyCell="{ column, index }">
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a href="javascript:;" @click="toEditPage()">编辑座位</a>
						<a href="javascript:;" @click="del(index)">删除</a>
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
		<delModal :params="{ title: '删除', content: '是否确定该条数据' }" v-model="delShow" @submit="delSubmit" @cancel="delCancel" />
	</div>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import editModel from './components/edit.vue';
import delModal from '@/components/common/DelModal.vue';
import api from '@/api';
const route = useRouter();
const navigatorBar = useNavigatorBar();
// import { userList } from '@/api';

const columns = [
	{
		title: '序号',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: '演出名称',
		dataIndex: 'age',
		key: 'age',
	},
	{
		title: '演出场馆',
		dataIndex: 'venueName',
		key: 'venueName',
	},
	{
		title: '归属景区',
		dataIndex: 'address2',
		key: 'address2',
	},
	{
		title: '审核状态',
		dataIndex: 'address2',
		key: 'address2',
	},
	{
		title: '开始时间',
		dataIndex: 'address3',
		key: 'address3',
	},
	{
		title: '周期',
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
	time: '',
	tableData: {
		data: [],
		total: 400,
		loading: false,
		param: {
			venueName: '',
			scenicId: '',
			pageNo: 1,
			pageSize: 10,
		},
	},
});

const onHandleCurrentChange = (val: number) => {
	state.tableData.param.pageNo = val;
	init();
};

const pageSideChange = (current: number, size: number) => {
	state.tableData.param.pageSize = size;
	init();
};
//编辑
const toEditPage = () => {
	editModelRef.value.open();
	// route.push({ path: '/scenic-spot/shows/show-edit' });
};
const editModelRef = ref();
//新增
const add = () => {
	editModelRef.value.open();
	// route.push({ path: '/scenic-spot/shows/show-edit' });
};

const init = async () => {
	// userList(state.tableData.param).then((res) => {
	// 	console.log(res);
	// });
	let res = await api.getShowVenueList(state.tableData.param);
	state.tableData.data = res.content;
};

const search = () => {
	init();
};
// 删除提示
const delShow = ref(false);
const delOid = ref<null | number>();
const del = (record: any) => {
	delShow.value = true;
	delOid.value = record;
	// emits('del-verification-obj', index);
};
const delSubmit = () => {
	// emits('del-verification-obj', toRaw(delOid.value));
	// console.log(delOid.value);
	// api.singleVoteDel(delOid.value);
	delCancel();
};
const delCancel = () => {
	delShow.value = false;
	delOid.value = null;
};
onMounted(() => {
	// navigatorBar
	// 重新定义面包屑
	// navigatorBar.setNavigator(['演出票']);
	init();
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
