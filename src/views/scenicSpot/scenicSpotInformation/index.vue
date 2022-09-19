<template>
	<CommonSearch>
		<search-item label="审核状态">
			<a-select ref="select" style="width: 200px" placeholder="请选择审核状态">
				<a-select-option value="all">all</a-select-option>
			</a-select>
		</search-item>
		<search-item label="景区等级">
			<a-select ref="select" style="width: 200px" placeholder="请选择景区等级">
				<a-select-option value="all">all</a-select-option>
			</a-select>
		</search-item>
		<search-item label="景区名称">
			<a-select ref="select" style="width: 200px" placeholder="请选择景区名称">
				<a-select-option value="all">all</a-select-option>
			</a-select>
		</search-item>
		<template #button>
			<a-button>查询</a-button>
		</template>
	</CommonSearch>
	<div class="table-area">
		<div class="list-btn">
			<a-button type="primary" class="success">导出</a-button>
		</div>
		<CommonTable :dataSource="dataSource" :columns="columns">
			<template #bodyCell="{ column, record }">
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a href="javascript:;" @click="toEditPage(record, column)">查看</a>
						<a href="javascript:;">审核</a>
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

const navigatorBar = useNavigatorBar();
// import { userList } from '@/api';
const route = useRouter();
const dataSource = [
	{
		key: '1',
		name: '王某某',
		age: 32,
		address: '西湖区湖底公园1号',
		address1: '13199090090',
		address2: '西湖区湖底公园1号',
		address3: '等待',
		address4: '是',
	},
	{
		key: '2',
		name: '张某某',
		age: 42,
		address: '西湖区湖底公园1号',
		address1: '13199090090',
		address2: '西湖区湖底公园1号',
		address3: '是等待',
		address4: '是',
	},
	{
		key: '3',
		name: '张某某',
		age: 42,
		address: '西湖区湖底公园1号',
		address1: '13199090090',
		address2: '西湖区湖底公园1号',
		address3: '等待',
		address4: '是',
	},
];
const columns = [
	{
		title: '景区等级',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: '景区名称',
		dataIndex: 'age',
		key: 'age',
	},
	{
		title: '企业信用代码',
		dataIndex: 'address',
		key: 'address',
	},
	{
		title: '联系电话',
		dataIndex: 'address1',
		key: 'address1',
	},
	{
		title: '所在地址',
		dataIndex: 'address2',
		key: 'address2',
	},
	{
		title: '审核状态',
		dataIndex: 'address3',
		key: 'address3',
	},
	{
		title: '提供减免',
		dataIndex: 'address4',
		key: 'address',
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
//编辑
const toEditPage = (record: any, column: any) => {
	console.log(record, column);
	route.push('/scenic-spot/information/edit');
};
// const onSearch = () => {
// 	userList(state.tableData.param).then((res) => {
// 		console.log(res);
// 	});
// };
onMounted(() => {
	navigatorBar.setNavigator(['景区信息管理']);
});
onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
});
</script>

<style lang="less"></style>
