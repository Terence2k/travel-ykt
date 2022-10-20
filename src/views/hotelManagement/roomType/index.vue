<template>
	<div class="roomType-wrapper">
		<div class="content-container">
			<div class="search-bar">
				<div class="item">
					<span class="field-select item">审核状态</span>
					<a-select
						class="select-status select item"
						:showArrow="true"
						:options="tableState.statusOptions"
						v-model:value="tableState.tableData.param.unitStatus"
						placeholder="请选择状态"
					>
					</a-select>
				</div>

				<div class="item">
					<span class="field-select item">星级星标</span>
					<a-select
						class="select-star select item"
						:showArrow="true"
						:options="tableState.starOptions"
						v-model:value="tableState.tableData.param.starCode"
						placeholder="请选择星级星标"
					>
					</a-select>
				</div>

				<div class="item">
					<span class="field-input item">酒店名称</span>
					<a-input class="input-hotel-name item" v-model:value="tableState.tableData.param.hotelName" placeholder="请输入酒店名称" />
				</div>

				<div class="item">
					<span class="field-input item">联系电话</span>
					<a-input class="input-hotel-name item" v-model:value="tableState.tableData.param.phone" placeholder="请输入联系电话" />
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
					<CommonTable :columns="columns" :rowSelection="rowSelection" :dataSource="dataSource">
						<template #bodyCell="{ column, record }">
							<template v-if="column.dataIndex === 'unitStatus'">
								<div class="cell-unitStatus">
									<span class="item">{{ getunitStatusName(record?.unitStatus) }}</span>
								</div>
							</template>
							<template v-if="column.dataIndex === 'actions'">
								<div class="cell-actions">
									<span @click="openNewPageByAction(record?.hotelId, record?.unitStatus)" class="item">
										{{ getActionText(record?.unitStatus) }}
									</span>
								</div>
							</template>
						</template>
					</CommonTable>
					<!-- <CommonPagination
						class="pagination-custom"
						:current="tableState.tableData.param.pageNo"
						:page-size="tableState.tableData.param.pageSize"
						:total="tableState.tableData.total"
						@change="onHandleCurrentChange"
						@showSizeChange="pageSideChange"
					>
					</CommonPagination> -->
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { SelectProps, TableColumnsType } from 'ant-design-vue';
import { ref } from 'vue';
import CommonTable from '@/components/common/CommonTable.vue';
//import CommonPagination from '@/components/common/CommonPagination.vue';
import api from '@/api';

//表格数据类型
interface DataSourceItem {
	key: string | number;
	hotelId: string | number;
	hotelName: string;
	starCode?: string | number;
	openStatus?: string;
	phone: string;
	address: string;
	unitStatus: string;
	submitTime: string;
}

let statusOptionsData = ref([
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
]);

let starOptionsData = ref([]);

const columns: TableColumnsType = [
	{
		title: '酒店名称',
		dataIndex: 'hotelName',
		key: 'hotelName',
		width: '14%',
	},
	{
		title: '酒店星级',
		dataIndex: 'starCode',
		key: 'starCode',
		width: '10%',
	},
	{
		title: '开业状态',
		dataIndex: 'openStatus',
		key: 'openStatus',
		width: '6%',
	},
	{
		title: '联系电话',
		dataIndex: 'phone',
		key: 'phone',
		width: '14%',
	},
	{
		title: '所在地址',
		dataIndex: 'address',
		key: 'address',
		width: '18%',
	},
	{
		title: '审核任务状态',
		dataIndex: 'unitStatus',
		key: 'unitStatus',
		width: '7%',
	},
	{
		title: '提交审核时间',
		dataIndex: 'submitTime',
		key: 'submitTime',
		width: '31%',
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
		data: ref([]),
		total: 1,
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			unitStatus: undefined,
			starCode: undefined,
			hotelName: undefined,
			phone: undefined,
		},
	},
	statusOptions: ref<SelectProps['options']>(statusOptionsData),
	starOptions: ref<SelectProps['options']>(starOptionsData),
});

const rowSelection = computed(() => {
	return {
		onChange: (selectedRowKeys: (string | number)[], selectedRows: DataSourceItem[]) => {
			console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
		},
		onSelect: (record: DataSourceItem, selected: boolean, selectedRows: DataSourceItem[]) => {
			console.log(record, selected, selectedRows);
		},
		onSelectAll: (selected: boolean, selectedRows: DataSourceItem[], changeRows: DataSourceItem[]) => {
			console.log(selected, selectedRows, changeRows);
		},
	};
});

const router = useRouter();

// let dataSource = ref([
// 	{
// 		key: 1,
// 		oid: 1,
// 		hotelName: '阳光商务一百酒店',
// 		starCode: '五星A级',
// 		openStatus: '开业',
// 		phone: '2121323232',
// 		address: '丽江市安平大道1号',
// 		unitStatus: 0,
// 		submitTime: '2022年10月19日',
// 	},
// 	{
// 		key: 2,
// 		oid: 2,
// 		hotelName: '千千酒店',
// 		starCode: '三星A级',
// 		openStatus: '开业',
// 		phone: '127178278237',
// 		address: '丽江市热河大道232号',
// 		unitStatus: 1,
// 		submitTime: '2022年10月18日',
// 	},
// ]);

const dataSource = computed(() => {
	if (Array.isArray(tableState.tableData.data)) {
		console.log('数据变化', tableState.tableData.data);
		return tableState.tableData.data.map((item) => {
			return {
				...item,
				key: item?.hotelId,
			};
		});
	}
});

const getunitStatusName = (unitStatus: number) => {
	return statusOptionsData.value.find((item) => item.value === unitStatus)?.label || '';
};

const onSearch = () => {
	console.log('tableState.tableData.param:', tableState.tableData.param);

	const userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
	const sysRoles = userInfo?.sysRoles;

	console.log(
		'当前角色列表：',
		sysRoles.map((item) => item?.roleCode)
	);
	if (Array.isArray(sysRoles) && sysRoles.map((item) => item?.roleCode).includes('ASSOCIATION_SUPER_ADMIN')) {
		console.log('我是协会超级管理员');
		api
			.getHotelListInAudit()
			.then((res: any) => {
				console.log('res------------------------:', res);
				tableState.tableData.data = res?.content || res;
				tableState.tableData.total = res.total;
				getHotelStarList();
			})
			.catch((err: any) => {
				console.log(err);
			});
	} else {
		console.log('我是酒店超级管理员');
	}
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

const getActionText = (unitStatus: number) => {
	let actionText = '';
	switch (unitStatus) {
		case 1:
			actionText = '进入审核';
			break;
		default:
			actionText = '编辑';
	}
	return actionText;
};

const openNewPageByAction = (oid: number, unitStatus: number) => {
	if (oid || oid === 0) {
		console.log('open edit page, id is:', oid);
		if (unitStatus === 1) {
			router.push({ path: '/hotelManagement/roomType/roomTypeCheck', query: { id: oid } });
		} else {
			router.push({ path: '/hotelManagement/roomType/roomTypeEdit', query: { id: oid } });
		}
	}
};

onMounted(() => {
	onSearch();
});
</script>

<style lang="less" scoped>
@import './styles/index.less';
</style>
