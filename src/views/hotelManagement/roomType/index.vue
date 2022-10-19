<template>
	<div class="baseInfo-wrapper">
		<div class="content-container">
			<div class="search-bar">
				<div class="item">
					<span class="field-select item">审核状态</span>
					<a-select
						class="select-status select item"
						:showArrow="true"
						:options="statusOptions"
						v-model:value="tableState.tableData.auditStatus"
						placeholder="请选择状态"
					>
					</a-select>
				</div>

				<div class="item">
					<span class="field-select item">星级星标</span>
					<a-select
						class="select-star select item"
						:showArrow="true"
						:options="starOptions"
						v-model:value="tableState.tableData.hotelStarId"
						placeholder="请选择星级星标"
					>
					</a-select>
				</div>

				<div class="item">
					<span class="field-input item">酒店名称</span>
					<a-input class="input-hotel-name item" v-model:value="tableState.tableData.hotelName" placeholder="请输入酒店名称" />
				</div>

				<div class="item">
					<span class="field-input item">联系电话</span>
					<a-input class="input-hotel-name item" v-model:value="tableState.tableData.phone" placeholder="请输入联系电话" />
				</div>

				<div class="item button-search-wrapper">
					<a-button @click="searchByFilter" class="button-search item">查询</a-button>
				</div>
			</div>

			<div class="table-bar">
				<div class="flex-container">
					<a-button class="button-create-item">导出</a-button>
				</div>
				<div class="table-container">
					<CommonTable :columns="columns" :row-selection="rowSelection" :dataSource="dataSource">
						<template #bodyCell="{ column, record }">
							<template v-if="column.dataIndex === 'auditStatus'">
								<div class="cell-auditStatus">
									<span class="item">{{ record?.auditStatus }}</span>
								</div>
							</template>
							<template v-if="column.dataIndex === 'actions'">
								<div class="cell-actions">
									<span @click="openCheckPage(record?.oid)" class="item">进入审核</span>
								</div>
							</template>
						</template>
					</CommonTable>
					<CommonPagination
						class="pagination-custom"
						:current="tableState.tableData.param.pageNo"
						:page-size="tableState.tableData.param.pageSize"
						:total="tableState.tableData.total"
						@change="onHandleCurrentChange"
						@showSizeChange="pageSideChange"
					>
					</CommonPagination>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { SelectProps, TableColumnsType } from 'ant-design-vue';
import { ref } from 'vue';
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import api from '@/api';

//表格数据类型
interface DataSourceItem {
	key: string | number;
	oid: string | number;
	hotelName: string;
	hotelStarId: string | number;
	openStatus: string;
	phone: string;
	address: string;
	auditStatus: string;
	lastAuditDate: string;
}

let statusOptionsData = [
	{
		value: 0,
		label: '未提交',
	},
	{
		value: 1,
		label: '待审核',
	},
	{
		value: 2,
		label: '审核通过',
	},
	{
		value: 3,
		label: '审核不通过',
	},
];

const columns: TableColumnsType = [
	{
		title: '酒店名称',
		dataIndex: 'hotelName',
		key: 'hotelName',
	},
	{
		title: '酒店星级',
		dataIndex: 'hotelStarId',
		key: 'hotelStarId',
	},
	{
		title: '开业状态',
		dataIndex: 'openStatus',
		key: 'openStatus',
	},
	{
		title: '联系电话',
		dataIndex: 'phone',
		key: 'phone',
	},
	{
		title: '所在地址',
		dataIndex: 'address',
		key: 'address',
	},
	{
		title: '审核任务状态',
		dataIndex: 'auditStatus',
		key: 'auditStatus',
	},
	{
		title: '提交审核时间',
		dataIndex: 'lastAuditDate',
		key: 'lastAuditDate',
	},
	{
		title: '操作',
		dataIndex: 'actions',
		key: 'actions',
		fixed: 'right',
		width: 160,
	},
];

const tableState = reactive({
	tableData: {
		data: [],
		total: 1,
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			auditStatus: undefined,
			hotelStarId: undefined,
			hotelName: undefined,
			phone: undefined,
		},
	},
});

const router = useRouter();

const getAuditStatusName = (auditStatus: number) => {
	let statusName = '';
	switch (auditStatus) {
		case 0:
			statusName = '未提交';
			break;
		case 1:
			statusName = '待审核';
			break;
		case 2:
			statusName = '审核通过';
			break;
		case 3:
			statusName = '审核未通过';
			break;
	}

	return statusName;
};

const onSearch = () => {
	// api
	// 	.getHotelTableInfo(tableState.tableData.param)
	// 	.then((res: any) => {
	// 		console.log('res:', res);
	// 		tableState.tableData.data = res.content;
	// 		tableState.tableData.total = res.total;
	// 	})
	// 	.catch((err: any) => {
	// 		console.log(err);
	// 	});
};

const searchByFilter = () => {
	tableState.tableData.param.pageNo = 1;
	onSearch();
};

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
</script>

<style lang="less" scoped>
@import './styles/index.less';
</style>
