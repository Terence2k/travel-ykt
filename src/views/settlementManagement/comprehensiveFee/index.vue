<template>
	<CommonSearch>
		<search-item label="综费产品">
			<a-input v-model:value="state.tableData.param.name" placeholder="请输入产品名称" />
		</search-item>
		<search-item label="启用状态">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.auditStatus" style="width: 200px" placeholder="请选择团单类型">
				<a-select-option :value="-1">启用</a-select-option>
				<a-select-option :value="0">禁用 </a-select-option>
			</a-select>
		</search-item>
		<template #button>
			<a-button @click="initList">查询</a-button>
		</template>
	</CommonSearch>
	<div class="table-area">
		<div class="list-btn">
			<a-button type="primary" class="success" @click="toAdd">新增</a-button>
			<a-button style="margin-left: 8px" @click="del">删除</a-button>
		</div>
		<a-spin size="large" :spinning="state.tableData.loading">
			<CommonTable :dataSource="state.tableData.data" :columns="columns" rowKey="key" :rowSelection="rowSelection">
				<template #bodyCell="{ column, record }">
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a href="javascript:;" @click="toCheck(record)">查看</a>
							<a href="javascript:;" @click="toEditPage(record)">编辑</a>
							<a href="javascript:;" @click="toDisable(record)">{{ record?.status === 2 ? '启用' : '禁用' }}</a>
							<a href="javascript:;" @click="toDelete(record)">删除</a>
						</div>
					</template>
				</template>
			</CommonTable>
		</a-spin>
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
import { message } from 'ant-design-vue';
import { Modal } from 'ant-design-vue';
import api from '@/api';

const navigatorBar = useNavigatorBar();
// import { userList } from '@/api';
const route = useRouter();

const columns = [
	{
		title: '综费产品',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: '收费金额',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: '是否必收费用',
		dataIndex: 'creditCode',
		key: 'creditCode',
	},
	{
		title: '费用说明',
		dataIndex: 'phone',
		key: 'phone',
	},
	{
		title: '状态',
		dataIndex: 'statusText',
		key: 'statusText',
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
		data: [
			{
				key: 1,
				name: 'John Brown sr.',
				age: 60,
				address: 'New York No. 1 Lake Park',
				status: 1,
				statusText: '启用',
			},
			{
				key: 2,
				name: 'Joe Black',
				age: 32,
				address: 'Sidney No. 1 Lake Park',
				status: 2,
				statusText: '禁用',
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
		selectedRowKeys: [], //当前选择的标识
	},
});

// 当前选择列
const rowSelection = ref({
	checkStrictly: false,
	onChange: (selectedRowKeys: [], selectedRows: any) => {
		console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
		state.tableData.selectedRowKeys = selectedRowKeys;
		console.log(state.tableData.selectedRowKeys);
	},
});
// 新增按钮
const toAdd = () => {
	route.push({ path: '/settlementManagement/comprehensiveFee/edit', });
	// route.push({ path: '/settlementManagement/comprehensiveFee/add' });
};
// 批量删除按钮
const del = () => {
	if (state.tableData.selectedRowKeys.length == 0) {
		message.warn('请先选择删除项');
		return;
	}
	console.log(`我要删除这些id===>  ${state.tableData.selectedRowKeys}`);
	deleteFun(state.tableData.selectedRowKeys);
};
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
const toEditPage = (record: any) => {
	console.log(record.oid, encodeURIComponent(record.oid));
	route.push({ path: '/settlementManagement/comprehensiveFee/edit', query: { edit: 1, oid: encodeURIComponent(record.oid) } });

	// route.push({ path: '/settlementManagement/comprehensiveFee/edit', query: { oid: encodeURIComponent(record.oid) } });
};
//禁用
const toDisable = (record: any) => {
	console.log(record.oid, encodeURIComponent(record.oid));
	let statusText = record.status === 2 ? '启用' : '禁用';
	Modal.confirm({
		title: statusText,
		width: 560,
		closable: true,
		centered: true,
		icon: false,
		content: `确定是否${statusText}`,
		onOk() {
			console.log(`我${statusText}了嗷`);
			// api
			// 	.deleteMenu(record.oid)
			// 	.then((res: any) => {
			// 		message.success('删除成功');
			// 		// onSearch();
			// 	})
			// 	.catch((err: any) => {
			// 		message.error(err || '删除失败');
			// 	});
		},
		onCancel() {},
	});
};
//单项删除
const toDelete = (record: any) => {
	console.log(record.key);
	deleteFun(record.key);
};
// 统一删除方法
const deleteFun = (id: any) => {
	Modal.confirm({
		title: '删除确认',
		width: 560,
		closable: true,
		centered: true,
		icon: false,
		content: `是否确定删除所选数据，删除会影响已支付本项费用的行程单结算`,
		onOk() {
			console.log('我删除了嗷');
			// api
			// 	.deleteMenu(id)
			// 	.then((res: any) => {
			// 		message.success('删除成功');
			// 		// onSearch();
			// 	})
			// 	.catch((err: any) => {
			// 		message.error(err || '删除失败');
			// 	});
		},
		onCancel() {},
	});
};
//查看
const toCheck = (record: any) => {
	route.push({ path: '/settlementManagement/comprehensiveFee/info', query: { oid: encodeURIComponent(record.oid) } });
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
	navigatorBar.setNavigator(['结算管理', '综费产品']);
});
onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
});
</script>

<style lang="less" scoped>
.table-area {
	position: relative;
	overflow: hidden;
}
</style>
