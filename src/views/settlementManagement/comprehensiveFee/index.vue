<template>
	<CommonSearch>
		<search-item label="综费产品">
			<a-input v-model:value="state.tableData.param.comprehensiveFeeProductName" placeholder="请输入费用名称" />
		</search-item>
		<search-item label="启用状态">
			<a-select allowClear ref="select" v-model:value="state.tableData.param.status" style="width: 200px" placeholder="请选择状态">
				<a-select-option :value="1">启用</a-select-option>
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
	</div>
	<div>
		<a-spin size="large" :spinning="state.tableData.loading">
			<CommonTable :dataSource="state.tableData.data" :columns="columns" rowKey="oid" :row-selection="rowSelection">
				<template #bodyCell="{ column, record }">
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a href="javascript:;" @click="toCheck(record)">查看</a>
							<a href="javascript:;" @click="toEditPage(record)">编辑</a>
							<a href="javascript:;" @click="toDisable(record)">{{ record?.status === 0 ? '启用' : '禁用' }}</a>
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
const route = useRouter();

const columns = [
	{
		title: '综费产品',
		dataIndex: 'comprehensiveFeeProductName',
		key: 'comprehensiveFeeProductName',
	},
	{
		title: '收费金额',
		dataIndex: 'feeText',
		key: 'feeText',
	},
	{
		title: '费用归属',
		dataIndex: 'belongCompanyName',
		key: 'belongCompanyName',
	},
	{
		title: '是否必收费用',
		dataIndex: 'confirmNeedFeeTypeName',
		key: 'confirmNeedFeeTypeName',
	},
	{
		title: '费用说明',
		dataIndex: 'feeExplanation',
		key: 'feeExplanation',
	},
	{
		title: '状态',
		dataIndex: 'statusName',
		key: 'statusName',
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
			comprehensiveFeeProductName: null, //综费产品名称
			status: null, //启用状态：0-启用  1-禁用
		},
	},
	selectedRowKeys: [], //当前选择的标识
});

// 当前选择列
const rowSelection = computed(() => {
	return {
		onChange: (selectedRowKeys: [], selectedRows: any) => {
			state.selectedRowKeys = selectedRowKeys;
			console.log(state.selectedRowKeys);
		},
	}
})
const onSelect = (selectedRowKeys: [],record: any, selected: boolean, selectedRows: any[]) => {
		console.log(selectedRowKeys);
	}
// 新增按钮
const toAdd = () => {
	route.push({ path: '/settlementManagement/comprehensiveFee/edit' });
	// route.push({ path: '/settlementManagement/comprehensiveFee/add' });
};
// 批量删除按钮
const del = () => {
	if (state.selectedRowKeys.length == 0) {
		message.warn('请先选择删除项');
		return;
	}
	deleteFun(state.selectedRowKeys);
};
//搜索
const onHandleCurrentChange = (val: number) => {
	state.tableData.param.pageNo = val;
	initList();
};
//翻页
const pageSideChange = (current: number, size: number) => {
	state.tableData.param.pageSize = size;
	initList();
};
//编辑
const toEditPage = (record: any) => {
	route.push({ path: '/settlementManagement/comprehensiveFee/edit', query: { edit: 1, oid: encodeURIComponent(record.oid) } });
};
//禁用 & 启用 (启用状态：1-启用  0-禁用)
const toDisable = (record: any) => {
	let statusText = record.status === 0 ? '启用' : '禁用';
	let apiFun = record.status === 0 ? api.comprehensiveFeeEnable : api.comprehensiveFeeDisenable;
	Modal.confirm({
		title: statusText,
		width: 560,
		closable: true,
		centered: true,
		icon: false,
		content: `确定是否${statusText}`,
		onOk() {
			apiFun(record.oid)
				.then((res: any) => {
					message.success(`${statusText}成功`);
					initList();
				})
				.catch((err: any) => {
					message.error(err || `${statusText}失败`);
				});
		},
		onCancel() {},
	});
};
//单项删除
const toDelete = (record: any) => {
	deleteFun([record.oid]);
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
			api
				.comprehensiveFeeDelete(id)
				.then((res: any) => {
					message.success('删除成功');
					initList();
				})
				.catch((err: any) => {
					message.error(err || '删除失败');
				});
		},
		onCancel() {},
	});
};
//查看
const toCheck = (record: any) => {
	route.push({ path: '/settlementManagement/comprehensiveFee/info', query: { oid: encodeURIComponent(record.oid) } });
};
// 初始化列表
const initList = async () => {
	state.tableData.loading = true;
	api
		.getcomprehensiveFeeList(state.tableData.param)
		.then((res) => {
			console.log(res);
			const { total, content } = res;
			state.tableData.total = total;
			const list: [any] = dealData(content);
			state.tableData.data = list;
			state.tableData.loading = false;
		})
		.catch((err) => {
			state.tableData.loading = false;
		});
};
// 数据处理
const dealData = (params: [any]) => {
	params.map((i: any) => {
		// feeModel 收费模式: 0-人数 1-价格
		// feeNumber 收费数量
		i.feeText = i.feeModel == 0 ? `${i.feeNumber} 元/人` : `${i.feeNumber} 元`;	
		return i;
	});

	return params;
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
