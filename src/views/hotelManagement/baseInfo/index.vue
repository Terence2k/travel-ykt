<template>
	<div class="wrapper">
		<div class="content-container">
			<div class="search-bar">
				<div class="item">
					<span class="field-select item">审核状态</span>
					<a-select class="select-status select item" :showArrow="true" :options="statusOptions" v-model:value="status" placeholder="请选择状态">
					</a-select>
				</div>

				<div class="item">
					<span class="field-select item">星级星标</span>
					<a-select class="select-star select item" :showArrow="true" :options="starOptions" v-model:value="star" placeholder="请选择星级星标">
					</a-select>
				</div>

				<div class="item">
					<span class="field-input item">酒店名称</span>
					<a-input class="input-hotel-name item" v-model:value="hotelName" placeholder="请输入酒店名称" />
				</div>

				<div class="item">
					<span class="field-input item">联系电话</span>
					<a-input class="input-hotel-name item" v-model:value="phoneNumber" placeholder="请输入联系电话" />
				</div>

				<div class="item button-search-wrapper">
					<a-button @click="searchByFilter" class="button-search item">查询</a-button>
				</div>
			</div>

			<div class="table-bar">
				<div class="flex-container">
					<a-button class="button-create-item">新增</a-button>
				</div>
				<div class="table-container">
					<CommonTable :columns="columns" :dataSource="dataSource" :row-selection="rowSelection">
						<template #bodyCell="{ column, record }">
							<template v-if="column.dataIndex === 'auditStatus'">
								<div class="cell-auditStatus">
									<span class="item">{{ getAuditStatusName(parseInt(record?.auditStatus)) }}</span>
								</div>
							</template>
							<template v-if="column.dataIndex === 'actions'">
								<div class="cell-actions">
									<span @click="openEditPage" class="item">编辑</span>
									<span @click="openEditPage" class="item">审核</span>
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
interface DataSourceItem {
	oid: string | number;
	hotelName: string;
	hotelStarId: string | number;
	hotelStarCode: string;
	creditCode: string;
	phone: string;
	address: string;
	auditStatus: string;
	reduceRule: string;
}
const router = useRouter();
const status = ref<string>('');
const star = ref<string>('');
const hotelName = ref<string>('');
const phoneNumber = ref<string>('');

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
const statusOptions = ref<SelectProps['options']>(statusOptionsData);

const starOptionsData = ref([]);

const starOptions = ref<SelectProps['options']>(starOptionsData);

const columns: TableColumnsType = [
	{
		title: '酒店名称',
		dataIndex: 'hotelName',
		key: 'hotelName',
	},
	{
		title: '酒店星级',
		dataIndex: 'hotelStarCode',
		key: 'hotelStarCode',
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
		dataIndex: 'address',
		key: 'address',
	},
	{
		title: '审核状态',
		dataIndex: 'auditStatus',
		key: 'auditStatus',
	},
	{
		title: '提供减免',
		dataIndex: 'reduceRule',
		key: 'reduceRule',
	},
	{
		title: '操作',
		dataIndex: 'actions',
		key: 'actions',
		fixed: 'right',
		width: 160,
	},
];

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

// let dataSource: DataSourceItem[] = [
// 	{
// 		oid: 1,
// 		hotelName: '阳光商务一百酒店',
// 		hotelStarId: 1,
// 		hotelStarCode: '1星A级',
// 		creditCode: 'LJ32323EWC',
// 		phone: '8291829',
// 		address: '丽江市古城区雪山路778',
// 		auditStatus: '待审核',
// 		reduceRule: '16免1',
// 	},
// 	{
// 		oid: 2,
// 		hotelName: '世纪天宸酒店',
// 		hotelStarId: 2,
// 		hotelStarCode: '6星A级',
// 		creditCode: 'QJ5523ETY',
// 		phone: '855529',
// 		address: '丽江市古城区雪山路779',
// 		auditStatus: '审核通过',
// 		reduceRule: '10免1',
// 	},
// ];

const dataSource = computed(() => tableState.tableData.data);

const rowSelection = ref({
	checkStrictly: false,
	onChange: (selectedRowKeys: (string | number)[], selectedRows: DataSourceItem[]) => {
		console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
	},
	onSelect: (record: DataSourceItem, selected: boolean, selectedRows: DataSourceItem[]) => {
		console.log(record, selected, selectedRows);
	},
	onSelectAll: (selected: boolean, selectedRows: DataSourceItem[], changeRows: DataSourceItem[]) => {
		console.log(selected, selectedRows, changeRows);
	},
});

const tableState = reactive({
	tableData: {
		data: [],
		total: 400,
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			auditStatus: status,
			hotelStarId: star,
			hotelName: hotelName,
			phone: phoneNumber,
		},
	},
});

const onSearch = () => {
	api
		.getHotelTableInfo(tableState.tableData.param)
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

const openEditPage = () => {
	router.push({ path: '/hotelManagement/baseInfo/edit', query: { id: '1' } });
	console.log('open edit page');
};

const getHotelStarList = () => {
	api
		.getHotelStarList({})
		.then((res: any) => {
			if (Array.isArray(res) && res.length > 0) {
				starOptionsData.value = res.map((item) => {
					return {
						value: item.oid,
						label: item.starCode,
					};
				});
			}
		})
		.catch((err: any) => {
			console.log(err);
		});
};

onMounted(() => {
	onSearch();
	getHotelStarList();
});
</script>

<style lang="less" scoped>
@import './styles/index.less';
</style>
