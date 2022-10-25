<template>
	<CommonSearch>
		<SearchItem label="是否存在减免">
			<a-select ref="select" style="width: 200px" placeholder="请选择减免情况">
				<a-select-option value="0">是</a-select-option>
				<a-select-option value="1">否</a-select-option>
			</a-select>
		</SearchItem>
		<SearchItem label="审核状态">
			<a-select ref="select" style="width: 200px" placeholder="请选择审核状态">
				<a-select-option value="待审核">待审核</a-select-option>
				<a-select-option value="审核通过">审核通过</a-select-option>
				<a-select-option value="审核不通过">审核不通过</a-select-option>
			</a-select>
		</SearchItem>
		<SearchItem label="行程时间">
			<a-date-picker :show-time="{ format: 'HH:mm' }" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" placeholder="请选择行程时间" />
		</SearchItem>
		<SearchItem label="行程单号">
			<a-input placeholder="请输入行程单号" style="width: 200px" />
		</SearchItem>
		<template #button>
			<a-button @click="reset">重置</a-button>
			<a-button class="btn" @click="onSearch">查询</a-button>
		</template>
	</CommonSearch>
	<div class="table-area">
		<div class="list-btn">
			<a-button type="primary" class="success" @click="download">导出</a-button>
			<a-button type="primary"  class="btn" @click="print">批量打印票据</a-button>
		</div>
		<CommonTable :dataSource="dataSource" :columns="columns">
			<template #bodyCell="{ column, index }">
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a href="javascript:;" @click="toSee">查看</a>
						<!-- <a href="javascript:;" @click="toExamine">审核</a> -->
						<a href="javascript:;" @click="print">打印票据</a>
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
import { reactive} from 'vue';
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue';

const route = useRouter();
const navigatorBar = useNavigatorBar();
// import { userList } from '@/api';
const dataSource = [
	{
		key: '1',
		name: 'YNLJ135680',
		age: '黑白水旅行社',
		add:'白鹿旅行社',
		address: '2022.2.23~2022.2.25',
		address2: '30',
		address3: '40',
		address4: '5',
		address6: '是',
		status:'待审核',
		change:'撤销'
	},
];
const columns = [
	{
		title: '行程单号',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: '发团旅行社',
		dataIndex: 'age',
		key: 'age',
	},
	{
		title: '接团旅行社',
		dataIndex: 'add',
		key: 'add',
	},
	{
		title: '行程时间',
		dataIndex: 'address',
		key: 'address',
	},
	{
		title: '行程人数',
		dataIndex: 'address2',
		key: 'address2',
	},
	{
		title: '变更类型',
		dataIndex: 'change',
		key: 'change',
	},
	{
		title: '应购买人数',
		dataIndex: 'address3',
		key: 'address3',
	},
	{
		title: '全额购买人数',
		dataIndex: 'address3',
		key: 'address3',
	},
	{
		title: '减免人数',
		dataIndex: 'address3',
		key: 'address3',
	},
	{
		title: '费用（元）',
		dataIndex: 'address3',
		key: 'address3',
	},
	{
		title: '是否存在减免',
		dataIndex: 'address6',
		key: 'address6',
	},
	{
		title: '审核状态',
		dataIndex: 'status',
		key: 'status',
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
			pageNo: 1,
			pageSize: 10,
		},
	},
});

const onHandleCurrentChange = (val: number) => {
	console.log('change:', val);
	// state.tableData.param.pageNo = val;
	// onSearch();
};
//查看
const toSee = () => {
	route.push({ path: '/gouvyManagement/orderChange/order-change_edit'});
};
//审核
// const toExamine = () => {
// 	route.push({ path: '/gouvyManagement/orderChange/order-change_edit' ,query:{index:1}});
// };
const print =()=>{
	message.success('已打印');
}
const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	// state.tableData.param.pageSize = size;
	// onSearch();
};
const onSearch = () => {
	// userList(state.tableData.param).then((res) => {
	// 	console.log(res);
	// });
};
const reset =()=>{
	
}
const download =()=>{
	message.success('下载成功');
}
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
.btn{
	margin-left: 50px;
}
</style>
