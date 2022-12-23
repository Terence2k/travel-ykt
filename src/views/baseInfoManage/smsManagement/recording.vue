<template>
	<div>
		<CommonSearch>
			<search-item label="发送时间">
				<picker  v-model="state.tableData.param.time" value-format="YYYY-MM-DD" placeholder="请选择发送时间" type="date" />
			</search-item>
			<search-item label="发送人">
				<a-input placeholder="请输入发送人姓名" v-model:value="state.tableData.param.Name" />
			</search-item>
			<template #button>
				<a-button style="margin-right: 20px;" @click="getCateringList">重置</a-button>
				<a-button type="primary" @click="getCateringList">查询</a-button>
			</template>
		</CommonSearch>
		<CommonTable :columns="columns" :dataSource="state.tableData.data" style="padding: 6px;">
			<template #bodyCell="{ column, record, index }">
				<template v-if="column.key === 'index'">
					<div>
						{{ index + 1 }}
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
import picker from '@/components/common/datePicker.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import api from '@/api';
import { SelectProps, TableColumnsType } from 'ant-design-vue';
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';

const router = useRouter();
const navigatorBar = useNavigatorBar();

const columns = [
	{
		title: ' 序号 ',
		key: 'index',
		width: '80px',
	},
	{
		title: '短信名称',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: '发送人',
		dataIndex: 'creditCode',
		key: 'creditCode',
	},
	{
		title: '发送时间',
		dataIndex: 'phone',
		key: 'phone',
	},
	{
		title: '接受人数',
		dataIndex: 'addressDetail',
		key: 'addressDetail',
	},
	{
		title: '发送状态',
		dataIndex: 'auditStatus',
		key: 'auditStatus',
	}
];

const state = reactive({
	tableData: {
		data: [] as any,
		total: 0,
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			Name: null,
			time: null,
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

const openInfoPage = (record: any) => {
	router.push({ path: '/catering/basic_Information/basic_info', query: { oid: record.oid } });
};
const openEditPage = (record: any) => {
	router.push({ path: '/catering/basic_Information/basic_edit', query: { oid: record.oid } });
};

onMounted(() => {
	// navigatorBar.setNavigator(['基础信息管理']);
	getCateringList();
});
// onBeforeUnmount(() => {
// 	navigatorBar.clearNavigator();
// });
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
