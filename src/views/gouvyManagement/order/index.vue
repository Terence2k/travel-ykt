<template>
	<CommonSearch>
		<SearchItem label="是否存在减免">
			<a-select ref="select" style="width: 200px" placeholder="请选择减免情况" v-model:value="state.tableData.param.isReductionExist">
				<a-select-option value="1">是</a-select-option>
				<a-select-option value="0">否</a-select-option>
			</a-select>
		</SearchItem>
		<SearchItem label="接团旅行社">
			<a-input placeholder="请输入行程单号" style="width: 200px" v-model:value="state.tableData.param.subTravelName" />
		</SearchItem>
		<SearchItem label="行程时间">
			<a-date-picker
				format="YYYY-MM-DD"
				value-format="YYYY-MM-DD"
				placeholder="请选择行程开始时间"
				v-model:value="state.tableData.param.itineraryStartDate"
			/>
		</SearchItem>
		<SearchItem label="行程单号">
			<a-input placeholder="请输入行程单号" style="width: 200px" v-model:value="state.tableData.param.itineraryNo" />
		</SearchItem>
		<template #button>
			<a-button @click="reset">重置</a-button>
			<a-button class="btn" @click="onSearch">查询</a-button>
		</template>
	</CommonSearch>
	<div class="table-area">
		<div class="list-btn">
			<a-button type="primary" class="success" @click="download">导出</a-button>
			<a-button type="primary" class="btn" @click="print">批量打印票据</a-button>
		</div>
		<CommonTable :dataSource="state.tableData.data" :columns="columns" :scrollY="false">
			<template #bodyCell="{ column, index, record }">
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a href="javascript:;" @click="toSee(record.oid)">查看</a>
						<!-- <a href="javascript:;" @click="print">打印票据</a> -->
					</div>
				</template>
				<template v-if="column.key === 'itineraryStartDate'">
					<a-span>{{ record.itineraryStartDate }}~ {{ record.itineraryEndDate }}</a-span>
				</template>
				<template v-if="column.key === 'totalPrice'">
					<a-span>{{ accDiv(record.totalPrice, 100) }}</a-span>
				</template>
			</template>
		</CommonTable>
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
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { accDiv, accMul } from '@/utils/compute';
import api from '@/api';
import { downloadFile } from '@/utils/util';
const route = useRouter();
const navigatorBar = useNavigatorBar();
// import { userList } from '@/api';
const columns = [
	{
		title: '行程单号',
		dataIndex: 'itineraryNo',
		key: 'itineraryNo',
	},
	{
		title: '发团旅行社',
		dataIndex: 'travelName',
		key: 'travelName',
	},
	{
		title: '接团旅行社',
		dataIndex: 'subTravelName',
		key: 'subTravelName',
	},
	{
		title: '行程时间',
		dataIndex: 'itineraryStartDate',
		key: 'itineraryStartDate',
	},
	{
		title: '行程总人数',
		dataIndex: 'touristNum',
		key: 'touristNum',
	},
	{
		title: '缴费人数',
		dataIndex: 'purchaseNum',
		key: 'purchaseNum',
	},
	{
		title: '减免人数',
		dataIndex: 'reduceNum',
		key: 'reduceNum',
	},
	{
		title: '是否存在减免',
		dataIndex: 'isReductionExistName',
		key: 'isReductionExistName',
	},
	{
		title: '费用总计（元）',
		dataIndex: 'totalPrice',
		key: 'totalPrice',
	},
	{
		title: '线下查验状态',
		dataIndex: 'checkStatusName',
		key: 'checkStatusName',
	},
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		width: 208,
	},
];

const state = reactive({
	time: '',
	tableData: {
		data: [],
		total: 400,
		loading: false,
		param: {
			pageNo: 1,
			pageSize: 10,
			itineraryStartDate: '',
			itineraryNo: '',
			subTravelName: '',
			isReductionExist: '',
		},
	},
});

const onHandleCurrentChange = (val: number) => {
	console.log('change:', val);
	// state.tableData.param.pageNo = val;
	// onSearch();
};
//查看
const toSee = (oid:any) => {
	route.push({ path: '/gouvyManagement/order/order_edit' ,query:{oid:oid}});
};

const print = () => {
	message.success('已打印');
};
const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	// state.tableData.param.pageSize = size;
	// onSearch();
};
const onSearch = () => {
	api.gouvyOrder(state.tableData.param).then((res) => {
		state.tableData.data = res.content;
	});
};
const reset = () => {
	state.tableData.param.isReductionExist = '';
	state.tableData.param.itineraryNo = '';
	state.tableData.param.subTravelName = '';
	state.tableData.param.itineraryStartDate = '';
	onSearch();
};
const download = () => {
	api.exportGouvyOrder(state.tableData.param).then((res: any) => {
      	downloadFile(res, '古维订单')
			message.success('导出成功');
		})
	message.success('下载成功');
};
onMounted(() => {
	onSearch();
});
onBeforeUnmount(() => {
	// navigatorBar.clearNavigator();
});
</script>

<style lang="less" scoped>
.search-area {
	display: flex;
	flex-wrap: wrap;
	padding: 24px 52px 24px 20px;
	border-bottom: 1px #f1f2f5 solid;
	.search-items {
		display: flex;
		align-items: center;
		margin-right: 32px;
		.title {
			color: #1e2226;
			font-weight: bold;
			margin-right: 16px;
		}
	}
	.search-button {
		display: inline-flex;
		justify-content: flex-end;
		float: right;
		text-align: right;
		flex: 1;
	}
}

.list-btn {
	margin-right: 20px;
	margin-bottom: 10px;
}
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
.btn {
	margin-left: 50px;
}
</style>
