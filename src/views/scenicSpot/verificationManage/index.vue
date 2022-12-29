<template>
	<div class="verification-manage-wrapper">
		<div class="content-container">
			<div class="search-bar">
				<div class="item">
					<span class="field-input item">输入搜索</span>
					<a-input class="input-search item" v-model:value="tableState.tableData.param.itemName" placeholder="核销项目名称" />
				</div>
				<div class="item">
					<span class="field-select item">归属景区</span>
					<a-select
						v-model:value="tableState.tableData.param.scenicId"
						class="select-status item"
						:showArrow="true"
						:options="tableState.scenicSpotOptions"
						placeholder="请选择状态"
					>
					</a-select>
				</div>
				<a-button @click="searchByFilter" class="button-search item" v-permission="'查询'">查询</a-button>
			</div>

			<div class="table-bar">
				<div class="flex-container">
					<a-button class="button-create-item" @click="addOrUpdate({ handle: 'add' })" v-permission="'新增'">新增</a-button>
				</div>
				<div class="table-container">
					<CommonTable :dataSource="dataSource" :columns="columns">
						<!-- <template #button>
							<div class="flex-container">
								<a-button class="button-create-item" >新增</a-button>
							</div>
						</template> -->
						<template #bodyCell="{ column, record }">
							<!-- <template v-if="column.dataIndex === 'scenicId'">
								<div class="cell-scenicId">
									<span class="item">{{ getScenicSpotNameById(record.scenicId) }}</span>
								</div>
							</template> -->
							<!-- <template v-if="column.dataIndex === 'auditStatus'">
								<div class="cell-auditStatus">
									<span class="item">{{ getAuditStatusNameById(record.auditStatus) }}</span>
								</div>
							</template> -->
							<template v-if="column.dataIndex === 'actions'">
								<div class="cell-actions">
									<span class="item" @click="addOrUpdate({ row: record, handle: 'update' })" v-permission="'编辑'">编辑</span>
									<span class="item" @click="openDelModal(record?.oid)" v-permission="'删除'">删除</span>
								</div>
							</template>
						</template>
					</CommonTable>
					<CommonPagination
						class="pagination-custom"
						:current="tableState.tableData.param.pageNumber"
						:page-size="tableState.tableData.param.pageSize"
						:total="tableState.tableData.total"
						@change="onHandleCurrentChange"
						@showSizeChange="pageSideChange"
					>
					</CommonPagination>
					<DelModal
						:params="{ title: '删除', content: '是否确定该条数据' }"
						v-model="tableState.delShow"
						@submit="deleteWriteOffItem"
						@cancel="delCancel"
					/>
					<VerificationManageAddUpdate v-model="tableState.operationModal.isAddOrUpdate" :params="tableState.params" :methods="methods">
					</VerificationManageAddUpdate>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { SelectProps } from 'ant-design-vue';
import type { TableColumnsType } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import DelModal from '@/components/common/DelModal.vue';
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import VerificationManageAddUpdate from './components/verificationManage-add-update/verificationManage-add-update.vue';
import api from '@/api';

const columns: TableColumnsType = [
	{
		title: '序号',
		dataIndex: 'oid',
		key: 'oid',
		width: 100,
	},
	{
		title: '核销项目名称',
		dataIndex: 'itemName',
		key: 'itemName',
		width: 300,
	},
	{
		title: '归属景区',
		dataIndex: 'scenicName',
		key: 'scenicName',
		width: 400,
	},
	// {
	// 	title: '审核状态',
	// 	dataIndex: 'auditStatus',
	// 	key: 'auditStatus',
	// 	width: '40%',
	// },
	// {
	// 	title: '平台上架状态',
	// 	dataIndex: 'platformLaunchStatus',
	// 	key: 'platformLaunchStatus',
	// 	width: '40%',
	// },
	{
		title: '操作',
		dataIndex: 'actions',
		key: 'actions',
		fixed: 'right',
		width: 160,
	},
];

let scenicSpotOptionsData = ref([]);
const tableState = reactive({
	tableData: {
		data: ref([]),
		total: 1,
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			itemName: undefined,
			scenicId: undefined,
		},
	},
	scenicSpotOptions: ref<SelectProps['options']>(scenicSpotOptionsData),
	params: {},
	delItemId: undefined,
	delShow: false,
	operationModal: {
		isAddOrUpdate: false,
	},
});

const dataSource = computed(() => tableState.tableData.data);

const onHandleCurrentChange = (val: number) => {
	console.log('change:', val);
	tableState.tableData.param.pageNo = val;
	onSearch();
};

const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	tableState.tableData.param.pageSize = size;
	onSearch();
};

const onSearch = () => {
	console.log('search params:', tableState.tableData.param);
	api
		.getWriteOffItemList(tableState.tableData.param)
		.then((res: any) => {
			console.log('res:', res);
			tableState.tableData.data = res.content;
			tableState.tableData.total = res.total;
		})
		.catch((err: any) => {
			console.log(err);
		});
};

const searchByFilter = () => {
	tableState.tableData.param.pageNo = 1;
	onSearch();
};

const addOrUpdate = (param: any) => {
	const { row, handle } = param;
	console.log('数据：', row);
	console.log('操作：', handle);

	tableState.params = {};
	if (handle === 'update') {
		tableState.params = row;
	}
	tableState.operationModal.isAddOrUpdate = true;
};

const deleteWriteOffItem = () => {
	tableState.delShow = false;
	if (tableState.delItemId || tableState.delItemId) {
		api
			.deleteWriteOffItem(tableState.delItemId)
			.then((res) => {
				message.success('删除成功');
				onSearch();
			})
			.catch((err: any) => {
				message.error(err || '删除失败');
			});
	}

	tableState.delItemId = undefined;
};

const methods = reactive({
	success: searchByFilter,
});

const getScenicSpotNameById = (id: number) => {
	if (id || id === 0) {
		return scenicSpotOptionsData.value?.find((item) => item.value === id)?.label || '';
	}
};

const getAuditStatusNameById = (id: number) => {
	let result = '';
	switch (
		id //0.未提交  1.待审核  2.审核通过  3.审核未通过
	) {
		case 0:
			result = '未提交';
			break;
		case 1:
			result = '待审核';
			break;
		case 2:
			result = '审核通过';
			break;
		case 3:
			result = '审核未通过';
			break;
	}
	return result;
};

const openDelModal = (id: number) => {
	tableState.delShow = true;
	tableState.delItemId = id;
};

const delCancel = () => {
	tableState.delShow = false;
	tableState.delItemId = undefined;
};

onMounted(() => {
	onSearch();
	api.getViewList().then((res) => {
		console.log(res);
		scenicSpotOptionsData.value = res.map((item) => {
			return {
				value: item.ticketId,
				label: item.ticketName,
			};
		});
	});
});
</script>

<style lang="less" scoped>
@import './styles/index.less';
</style>
