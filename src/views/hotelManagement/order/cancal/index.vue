<template>
	<div>
		<CommonTable :columns="columns" :dataSource="data">
			<template #bodyCell="{ column, record }">
				<template v-if="column.dataIndex === 'actions'">
					<div class="action-btns">
						<a @click="visible = true">查看</a>
						<a>审核</a>
						<a>打印票据</a>
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
		<BaseModal :title="'审核'" v-model="visible" :onOk="handleOk">
			<a-form>
				<a-form-item label="状态">
					<a-radio-group >
						<a-radio value="1">通过</a-radio>
						<a-radio value="2">不通过</a-radio>
					</a-radio-group>
				</a-form-item>
				<a-form-item label="">
					<a-textarea placeholder="审核不通过原因" :rows="4" disabled />
				</a-form-item>
			</a-form>
			<template v-slot:footer>
				<a-button style="width: 76px" @click="visible = false">关闭</a-button>
			</template>
		</BaseModal>
	</div>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import BaseModal from '@/components/common/BaseModal.vue';
import api from '@/api';
import { SelectProps, TableColumnsType } from 'ant-design-vue';
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';

const visible = ref(false);
const router = useRouter();
const navigatorBar = useNavigatorBar();

const columns = [
	{
		title: '行程单号',
		dataIndex: 'a',
		key: 'a',
	},
	{
		title: '旅行社名称',
		dataIndex: 'b',
		key: 'b',
	},
	{
		title: '预定时间',
		dataIndex: 'c',
		key: 'c',
	},
	{
		title: '入住时间',
		dataIndex: 'd',
		key: 'd',
	},
	{
		title: '离店时间',
		dataIndex: 'e',
		key: 'e',
	},
	{
		title: '预定房数',
		dataIndex: 'f',
		key: 'f',
	},
	{
		title: '减免人数',
		dataIndex: 'g',
		key: 'g',
	},
	{
		title: '费用(元)',
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
		a: '1',
		b: '1',
		c: '1',
		d: '1',
		e: '1',
		f: '1',
		g: '1',
		h: '2',
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

// const getCateringList = () => {
// 	api.getCateringPage(state.tableData.param).then((res: any) => {
// 		state.tableData.total = res.total;
// 		state.tableData.data = res.content;
// 	});
// };

const openInfoPage = (record: any) => {
	router.push({ path: '/catering/basic_Information/basic_info', query: { oid: record.oid } });
};
const openEditPage = (record: any) => {
	router.push({ path: '/catering/basic_Information/basic_edit', query: { oid: record.oid } });
};

onMounted(() => {
	navigatorBar.setNavigator(['订单管理']);
	// getCateringList();
});
onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
});
</script>

<style lang="less">
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
