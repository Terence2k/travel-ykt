<template>
	<CommonSearch>
		<SearchItem label="是否存在减免">
			<a-select ref="select" style="width: 200px" placeholder="请选择减免情况" v-model:value="state.tableData.param.isReductionExist">
				<a-select-option value="1">是</a-select-option>
				<a-select-option value="0">否</a-select-option>
			</a-select>
		</SearchItem>
		<SearchItem label="接团旅行社">
			<a-input placeholder="请输入接团旅行社" style="width: 200px" v-model:value="state.tableData.param.subTravelName" />
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
			<!-- <a-button type="primary" class="btn" @click="print">批量打印票据</a-button> -->
		</div>
		<CommonTable :dataSource="state.tableData.data" :columns="columns" :scrollY="false">
			<template #bodyCell="{ column, index, record }">
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a href="javascript:;" @click="toSee(record.oid)">查看</a>
						<a href="javascript:;" @click="change">去改刷</a>
						<a href="javascript:;" @click="strong()">去强刷</a>
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
	<BaseModal title="古维订单强制核销" v-model="strongBrushVisible" :width="1000">
		<div class="table_box">
			<table class="info_table" cellpadding="16px" border="1">
				<tr class="row">
					<td class="key">团队类型</td>
					<td class="value">{{ }}</td>
				</tr>
				<tr class="row">
					<td class="key">线路名称</td>
					<td class="value">{{  }}</td>
				</tr>
				<tr class="row">
					<td class="key">行程单编号</td>
					<td class="value">{{}}</td>
				</tr>
				<tr class="row">
					<td class="key">组团社</td>
					<td class="value">
					</td>
				</tr>
				<tr class="row">
					<td class="key">地接社</td>
					<td class="value">{{ }}</td>
				</tr>
				<tr class="row">
					<td class="key">出散团时间</td>
					<td class="value">{{ }}</td>
				</tr>
				<tr class="row">
					<td class="key">团客人数</td>
					<td class="value">{{ }}</td>
				</tr>
				<tr class="row">
					<td class="key">已减免人数</td>
					<td class="value">{{ }}</td>
				</tr>
				<tr class="row">
					<td class="key">古维管理费</td>
					<td class="value">{{ }}</td>
				</tr>
				<tr class="row">
					<td class="key">可强刷时间</td>
					<td class="value">{{ }}</td>
				</tr>
				<tr class="row">
					<td class="key">已出票金额</td>
					<td class="value">{{ }}</td>
				</tr>
				<tr class="row">
					<td class="key">最后一次改刷时间</td>
					<td class="value">{{ }}</td>
				</tr>
				<tr class="row">
					<td class="key">改刷剩余时间</td>
					<td class="value">{{ }}</td>
				</tr>
			</table>
		</div>
		<template v-slot:footer>
			<a-button @click="(strongBrushVisible=false)">取消</a-button>
			<a-button type="primary" @click="changeSubmit">立即改刷</a-button>
			<a-button type="primary" @click="strongSubmit">立即强刷</a-button>
		</template>
	</BaseModal>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import BaseModal from '@/components/common/BaseModal.vue';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { accDiv, accMul } from '@/utils/compute';
import api from '@/api';
import { downloadFile } from '@/utils/util';
const route = useRouter();
const navigatorBar = useNavigatorBar();
const strongBrushVisible=ref(false)
// import { userList } from '@/api';
const columns = [
	{
		title: '订单编号',
		dataIndex: 'itineraryNo',
		key: 'itineraryNo',
	},
	{
		title: '关联行程单号',
		dataIndex: 'itineraryNo',
		key: 'itineraryNo',
	},
	{
		title: '发团社',
		dataIndex: 'travelName',
		key: 'travelName',
	},
	{
		title: '接团社',
		dataIndex: 'subTravelName',
		key: 'subTravelName',
	},
	{
		title: '行程日期',
		dataIndex: 'itineraryStartDate',
		key: 'itineraryStartDate',
	},
	{
		title: '行程人数',
		dataIndex: 'touristNum',
		key: 'touristNum',
	},
	{
		title: '应购买人数',
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
		title: '出票状态',
		dataIndex: 'totalPrice',
		key: 'totalPrice',
	},
	{
		title: '过期状态',
		dataIndex: 'checkStatusName',
		key: 'checkStatusName',
	},
	{
		title: '查验状态',
		dataIndex: 'checkStatusName',
		key: 'checkStatusName',
	},
	{
		title: '强刷状态',
		dataIndex: 'checkStatusName',
		key: 'checkStatusName',
	},
	{
		title: '改刷状态',
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
	state.tableData.param.pageNo = val;
	onSearch();
};
//查看
const toSee = (oid:any) => {
	route.push({ path: '/gouvyManagement/order/order_edit' ,query:{oid:oid}});
};
const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	// state.tableData.param.pageSize = size;
	// onSearch();
};
const onSearch = () => {
	api.gouvyOrder(state.tableData.param).then((res :any) => {
		state.tableData.data = res.content;
		state.tableData.total=res.total

	});
};
const strong=()=>{
	strongBrushVisible.value=true
}
const change=()=>{
	strongBrushVisible.value=true
}
const changeSubmit=()=>{

}
const strongSubmit=()=>{

}
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
};
onMounted(() => {
	onSearch();
});
onBeforeUnmount(() => {
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
.table_box {
	max-height: 80vh;
	padding: 1px 0;
	overflow: auto;

	.row {
		width: 100%;
		font-size: 14px;
		font-family: Microsoft YaHei UI;
		font-weight: 400;
		color: #1e2226;
		border: 1px solid #e9e9e9;
		td {
			text-align: center;
		}
	}

	.change_table {
		width: 100%;

		.key,
		.key_hd {
			width: 150px;
		}

		.key_hd {
			background: rgba(245, 247, 250, 0.39);
		}

		.value {
			min-width: 300px;
		}
	}

	.info_table {
		width: 100%;

		.key {
			width: 150px;
			background: rgba(245, 247, 250, 0.39);
		}
	}
}
</style>
