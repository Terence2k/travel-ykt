<template>
	<div>
		<CommonSearch>
			<search-item label="审核状态">
				<a-select ref="select"  placeholder="请选择状态" v-model:value="state.tableData.param.auditStatus">
					<a-select-option :value="0">未提交</a-select-option>
					<a-select-option :value="1">待审核</a-select-option>
					<a-select-option :value="2">审核通过</a-select-option>
					<a-select-option :value="3">审核未通过</a-select-option>
				</a-select>
			</search-item>
			<search-item label="门店名称">
				<a-input placeholder="请输入门店名称" v-model:value="state.tableData.param.shopName"/>
			</search-item>
			<search-item label="联系电话">
				<a-input placeholder="请输入联系电话"  v-model:value="state.tableData.param.phone"/>
			</search-item>
			<template #button>
				<a-button @click="getCateringList">查询</a-button>
			</template>
		</CommonSearch>
		<CommonTable :columns="columns" :dataSource="state.tableData.data" >
			<template #button>
				<a-button type="primary">导出</a-button>
			</template>
			<template #bodyCell="{ column,record }">
				<template v-if="column.dataIndex === 'actions'">
					<div class="action-btns">
						<a @click="openInfoPage(record)">查看</a>
						<a @click="openEditPage(record)" v-if="record.auditStatus != '审核通过' ">审核</a>
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
		>
		</CommonPagination>
	</div>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import api from '@/api';
import { SelectProps, TableColumnsType } from 'ant-design-vue';
import { ref, reactive, onMounted,onBeforeUnmount } from 'vue';

const router = useRouter();
const navigatorBar = useNavigatorBar();

const columns = [
	{
		title: '门店名称',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: '企业信用代码',
		dataIndex: 'creditCode',
		key: 'creditCode',
	},
	{
		title: '联系电话',
		dataIndex: 'phone',
		key: 'phone',
	},
	{
		title: '所在地址',
		dataIndex: 'addressDetail',
		key: 'addressDetail',
	},
	{
		title: '审核状态',
		dataIndex: 'auditStatus',
		key: 'auditStatus',
	},
	{
		title: '操作',
		dataIndex: 'actions',
		key: 'actions',
		fixed: 'right',
		width: 160,
	},
];

const state = reactive({
	tableData: {
		data: [],
		total: 0,
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			phone: null,
			shopName: null,
			auditStatus: null,
		},
	},
});

const onHandleCurrentChange = (val: number) => {
	console.log('change:', val);
	state.tableData.param.pageNo = val;
	// onSearch();
};

const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	state.tableData.param.pageSize = size;
	// onSearch();
};

const getCateringList = () => {
	api.getCateringPage(state.tableData.param).then((res: any) => {
		state.tableData.total = res.total;
		const list: [any] = dealData(res.content);
		state.tableData.data = list;
	});
};

const status = {
	0: '未提交',
	1: '待审核',
	2: '审核通过',
	3: '审核未通过',
};
const dealData = (params: [any]) => {
	params.map((i: any) => {
		i.auditStatus = status[i.auditStatus];
		return i;
	});
	return params;
};

const openInfoPage = (record:any) => {
	router.push({ path: '/catering/basic_Information/basic_info',query: { oid: record.oid } });

};
const openEditPage = (record:any) => {
	router.push({ path: '/catering/basic_Information/basic_edit',query: { oid: record.oid } });
};

onMounted(() => {
	navigatorBar.setNavigator(['基础信息管理']);
	getCateringList();
});
onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
});
</script>

<style lang="less" scoped>
// table style
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
