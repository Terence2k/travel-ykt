<template>
	<div>
		<CommonTable :columns="columns" :dataSource="data">
			<template #bodyCell="{ column, record }">
				<template v-if="column.dataIndex === 'actions'">
					<div class="action-btns">
						<a @click="toSee">查看</a>
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
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import api from '@/api';
import { SelectProps, TableColumnsType } from 'ant-design-vue';
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import details from './details.vue';
const router = useRouter();
const navigatorBar = useNavigatorBar();
const visible = ref(false);
const columns = [
	{
		title: '行程单号',
		dataIndex: 'a',
		key: 'a',
	},
	{
		title: '线路名称',
		dataIndex: 'b',
		key: 'b',
	},
	{
		title: '发团旅行社',
		dataIndex: 'c',
		key: 'c',
	},
	{
		title: '接团旅行社',
		dataIndex: 'd',
		key: 'd',
	},
	{
		title: '行程日期',
		dataIndex: 'e',
		key: 'e',
	},
	{
		title: '行程人数',
		dataIndex: 'f',
		key: 'f',
	},
	{
		title: '减免人数',
		dataIndex: 'g',
		key: 'g',
	},
	{
		title: '申请减免金额',
		dataIndex: 'h',
		key: 'h',
	},
	{
		title: '操作',
		dataIndex: 'actions',
		key: 'actions',
		fixed: 'right',
		width: 160,
	},
];

const data = [
	{
		a: '审核通过',
		b: '2022.2.23',
		c: '2022.2.24',
		d: '30',
		e: '25',
		f: '2',
		g: '1100',
		h: '20',
		i: '2022.2.23  19:30',
		m: '1000',
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
			name: null,
			auditStatus: null,
		},
		type: '1',
	},
});

const onHandleCurrentChange = (val: number) => {
	console.log('change:', val);
	state.tableData.param.pageNo = val;
	// onSearch();
};

const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	// state.tableData.param.pageSize = size;
	// onSearch();
};

// const getCateringList = () => {
// 	api.getCateringPage(state.tableData.param).then((res: any) => {
// 		state.tableData.total = res.total;
// 		state.tableData.data = res.content;
// 	});
// };

const toSee=()=>{
	router.push({ path: '/gouvyManagement/exemptionManagement/exemption-management_edit'});
}

onMounted(() => {
	// navigatorBar.setNavigator(['订单管理']);
	// getCateringList();
});
onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
});
</script>

<style scoped lang="less">
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
