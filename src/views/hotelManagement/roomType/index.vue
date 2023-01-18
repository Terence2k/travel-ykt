<template>
	<div class="roomType-wrapper">
		<div class="content-container">
			<div class="search-bar">
				<div class="item">
					<span class="field-select item">星级星标</span>
					<a-select
						v-model:value="tableState.tableData.param.starCode"
						class="select-writeOff-status select item"
						:showArrow="true"
						:options="tableState.starCodeOptions"
						placeholder="请选择星级星标"
					>
					</a-select>
				</div>

				<div class="item">
					<span class="field-input item">酒店名称</span>
					<a-input class="input-order-num item" v-model:value="tableState.tableData.param.hotelName" placeholder="请输入酒店名称" />
				</div>

				<div class="item">
					<span class="field-input item">联系电话</span>
					<a-input class="input-order-num item" v-model:value="tableState.tableData.param.phone" placeholder="请输入联系电话" />
				</div>

				<div class="item button-search-wrapper">
					<!-- <a-button @click="clearFilter" class="button-clear item">重置</a-button> -->
					<a-button @click="searchByFilter" class="button-search item" v-permission="'查询'">查询</a-button>
				</div>
			</div>
			<div class="table-bar">
				<div class="flex-container">
					<span v-if="tableState.pageIsShow" class="title"
						>共<span class="tip">{{ tableState.inAuditRecordNum }}</span
						>条待审核的消息</span
					>
					<template v-else><span class="title">暂无权限查看此页面</span></template>
					<a-button class="button-create-item" v-permission="'导出'">导出</a-button>
				</div>
				<div class="table-container">
					<CommonTable :columns="columns" :rowSelection="rowSelection" :dataSource="dataSource">
						<template #bodyCell="{ column, record }">
							<template v-if="column.dataIndex === 'unitStatus'">
								<div class="cell-unitStatus">
									<span class="item">{{ record?.unitStatus === 0 ? '开业' : '停业' }}</span>
								</div>
							</template>
							<template v-if="column.dataIndex === 'unitTaskStatus'">
								<div class="cell-unitTaskStatus">
									<span class="item">待审核</span>
								</div>
							</template>
							<template v-if="column.dataIndex === 'actions'">
								<div class="cell-actions">
									<span @click="openNewPageByAction(record?.hotelId, record)" class="item" v-permission="'进入审核'">进入审核</span>
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
import { SelectProps, TableColumnsType, message } from 'ant-design-vue';
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

let starCodeOptionsData = ref([]);

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
		dataIndex: 'unitStatus',
		key: 'unitStatus',
		width: '6%',
	},
	{
		title: '联系电话',
		dataIndex: 'phone',
		key: 'phone',
		width: '12%',
	},
	{
		title: '所在地址',
		dataIndex: 'address',
		key: 'address',
		width: '18%',
	},
	{
		title: '审核任务状态',
		dataIndex: 'unitTaskStatus',
		key: 'unitTaskStatus',
		width: '9%',
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
			starCode: undefined,
			hotelName: '',
			phone: '',
		},
	},
	pageIsShow: false,
	inAuditRecordNum: 0,
	starCodeOptions: ref<SelectProps['options']>(starCodeOptionsData),
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

const dataSource = computed(() => {
	if (Array.isArray(tableState.tableData.data)) {
		return tableState.tableData.data.map((item) => {
			return {
				...item,
				key: item?.hotelId,
			};
		});
	}
});

// const getUnitStatusName = (unitStatus: number) => {
// 	if (unitStatus || unitStatus === 0) {
// 		return statusOptionsData.value.find((item) => item.value === unitStatus)?.label || '';
// 	}
// };

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
		tableState.pageIsShow = true;
		api
			.getHotelListInAudit({
				starCode: '',
				hotelName: '',
				phone: '',
			})
			.then((res: any) => {
				tableState.inAuditRecordNum = res?.length || 0;
				tableState.tableData.data = res?.content || res;
				tableState.tableData.total = res?.total || 0;
				getHotelStarList();
			})
			.catch((err: any) => {
				message.error(err?.message || err);
			});
	} else if (Array.isArray(sysRoles) && sysRoles.map((item) => item?.roleCode).includes('HOTEL_SUPER_ADMIN')) {
		console.log('我是酒店超级管理员');
		router.push({ path: '/hotelManagement/roomType/roomTypeEdit' });
	} else {
		console.log('什么角色都不是');
	}
};

const searchByFilter = () => {
	api
		.getHotelListInAudit({
			starCode: tableState.tableData.param.starCode,
			hotelName: tableState.tableData.param.hotelName,
			phone: tableState.tableData.param.phone,
		})
		.then((res: any) => {
			tableState.inAuditRecordNum = res?.length || 0;
			tableState.tableData.data = res?.content || res;
			tableState.tableData.total = res?.total || 0;
		})
		.catch((err: any) => {
			message.error(err?.message || err);
		});
};

const getHotelStarList = () => {
	api
		.getHotelStarList({})
		.then((res: any) => {
			if (Array.isArray(res) && res.length > 0) {
				starCodeOptionsData.value = res.map((item) => {
					return {
						value: item.starCode, //item.oid,
						label: item.starCode,
					};
				});
			}
		})
		.catch((err: any) => {
			message.error(err?.message || err);
		});
};

const openNewPageByAction = (oid: number, record: any) => {
	if (oid || oid === 0) {
		console.log('open edit page, id is:', oid);
		router.push({ name: 'roomTypeCheck', query: { id: oid, hotelName: record?.hotelName, submitTime: record?.submitTime } });
	}
};

onMounted(() => {
	onSearch();
});
</script>

<style lang="less" scoped>
@import './styles/index.less';
</style>
