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
			<a-button @click="reset" v-permission="'重置'">重置</a-button>
			<a-button class="btn" @click="onSearch" v-permission="'查询'">查询</a-button>
		</template>
	</CommonSearch>
	<div class="table-area">
		<div class="list-btn">
			<a-button type="primary" class="success" @click="download" v-permission="'导出'">导出</a-button>
			<!-- <a-button type="primary" class="btn" @click="print">批量打印票据</a-button> -->
		</div>
		<CommonTable :dataSource="state.tableData.data" :columns="columns" :scrollY="false">
			<template #bodyCell="{ column, index, record }">
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a href="javascript:;" @click="toSee(record.oid)" v-permission="'查看'">查看</a>
						<a href="javascript:;" @click="change(record)" v-permission="'去改刷'" v-if="record.updateBrushStatus == 2">去改刷</a>
						<a href="javascript:;" @click="strong(record)" v-permission="'去强刷'" v-if="record.forceBrushStatus == 1 || record.forceBrushStatus == 2"
							>去强刷</a
						>
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
	<BaseModal :title="state.title" v-model="strongBrushVisible" :width="1000">
		<div class="table_box">
			<table class="info_table" cellpadding="16px" border="1">
				<tr class="row">
					<td class="key">团队类型</td>
					<td class="value">{{ state.tableData.details.teamTypeName }}</td>
				</tr>
				<tr class="row">
					<td class="key">线路名称</td>
					<td class="value">{{ state.tableData.details.routeName }}</td>
				</tr>
				<tr class="row">
					<td class="key">行程单编号</td>
					<td class="value">{{ state.tableData.details.itineraryNo }} <span class="spanSee" @click="gotoDetails(state.tableData.details.itineraryId)">查看行程单</span></td>
				</tr>
				<tr class="row">
					<td class="key">组团社</td>
					<td class="value">{{ state.tableData.details.travelName }}</td>
				</tr>
				<tr class="row">
					<td class="key">地接社</td>
					<td class="value">{{ state.tableData.details.subTravelName }}</td>
				</tr>
				<tr class="row">
					<td class="key">出散团时间</td>
					<td class="value">
						{{ state.tableData.details.itineraryStartDate }}-{{ state.tableData.details.itineraryEndDate }} (共{{
							dayjs(state.tableData.details.itineraryEndDate).diff(state.tableData.details.itineraryStartDate, 'day')
						}}天)
					</td>
				</tr>
				<tr class="row">
					<td class="key">团客人数</td>
					<td class="value">{{ state.tableData.details.touristNum }}人</td>
				</tr>
				<tr class="row" v-if="state.tableData.forceBrushStatus == '1'">
					<td class="key">可减免人数</td>
					<td class="value">{{ state.tableData.details.reduceNum }}人</td>
				</tr>
				<tr class="row" v-if="state.tableData.updateBrushStatus == '2'">
					<td class="key">已减免人数</td>
					<td class="value">{{ state.tableData.details.reduceNum }}人<span class="spanSee" @click="see(state.tableData.details.itineraryId)">查看详情</span></td>
				</tr>
				<tr class="row" v-if="state.tableData.forceBrushStatus == '1'">
					<td class="key">查验未到场人数</td>
					<td class="value">{{ state.tableData.details.notPresentNum }}人</td>
				</tr>
				<tr class="row" v-if="state.tableData.forceBrushStatus == '1'">
					<td class="key">建议强刷人数</td>
					<td class="value">{{ state.tableData.details.purchaseNum }}人</td>
				</tr>
				<tr class="row" v-if="state.tableData.updateBrushStatus == '2'">
					<td class="key">已出票金额</td>
					<td class="value">{{ accMul(accDiv(state.tableData.details.unitPrice, 100), state.tableData.details.purchaseNum) }}元</td>
				</tr>
				<tr class="row" v-if="state.tableData.updateBrushStatus == '2'">
					<td class="key">最后一次改刷时间</td>
					<td class="value">{{ state.tableData.details.lastUpdateBrushTime }}</td>
				</tr>
				<tr class="row" v-if="state.tableData.updateBrushStatus == '2'">
					<td class="key">改刷剩余时间</td>
					<td class="value">{{ state.tableData.details.deadline }}</td>
				</tr>
			</table>
		</div>
		<template v-slot:footer>
			<a-button @click="cancel()">取消</a-button>
			<a-button type="primary" @click="changeSubmit" v-if="state.tableData.updateBrushStatus == '2'">立即改刷</a-button>
			<a-button type="primary" @click="strongSubmit" v-if="state.tableData.forceBrushStatus == '1'">立即强刷</a-button>
		</template>
	</BaseModal>
	<BaseModal title="强刷提示" v-model="Visible" :width="400">
		<p>
			当前行程单已于 {{ state.tableData.details.endDate }} 过期。古维订单还未核销，但其他订单有核销记录。系统将于 2022.10.12 09:00:23
			对该古维订单做自动强刷。您无需手动操作。
		</p>
		<template v-slot:footer>
			<a-button type="primary" @click="Visible = false">确认</a-button>
		</template>
	</BaseModal>
	<BaseModal title="选择需要强刷的游客" v-model="selectStrongTouristVisible" :width="1000">
		<div class="div-select">
			<a-button @click="selectStrongTouristVisible = false">返回</a-button>
			<p>
				全部游客{{ state.touristNum }}名，<span v-if="state.checkStatus == '1'"
					>已完成线下查验，共{{ state.notPresentNum }}人未到场，有{{ state.reduceNum }}人可减免。</span
				>
				<span v-else>未完成查验</span>
			</p>
		</div>
		<CommonTable
			:row-selection="{ onSelect, onSelectAll }"
			:columns="strongColumns"
			:dataSource="state.strongTouristList"
			rowKey="oid"
			:scrollY="false"
			style="padding: 0"
		>
			<template #bodyCell="{ column, index, record }"> </template>
		</CommonTable>
		<div class="checked-div">
			<a-checkbox v-model:checked="checked"
				><span
					>已阅读并知晓：线下查验时未到场的、已通过减免申请的、已购买的无需核销，其余游客均可勾选强刷。请检查确认无误，强刷后不可撤回。</span
				></a-checkbox
			>
		</div>
		<template v-slot:footer>
			<a-button type="primary" @click="submit">确认本次勾选游客，提交强刷</a-button>
		</template>
	</BaseModal>
	<BaseModal title="改刷游客详情" v-model="touristDetails" :width="800">
		<div class="div-select">
			<a-button @click="touristDetails = false">返回</a-button>
			<p>全部游客{{state.touristData.total}}名,已减免{{state.touristData.reduceNum}}人。</p>
		</div>
		<CommonTable :columns="ticketingColumns" :dataSource="state.touristData.touristList" :scrollY="false">
			<template #bodyCell="{ column, text, index, record }">
				<!-- <template v-if="column.key === 'actualPrice'">
					<span>{{ accDiv(record.actualPrice, 100) }}</span>
				</template> -->
			</template>
		</CommonTable>
		<template v-slot:footer>
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
import dayjs, { Dayjs } from 'dayjs';
const route = useRouter();
const navigatorBar = useNavigatorBar();
const strongBrushVisible = ref(false);
const Visible = ref(false);
const selectStrongTouristVisible = ref(false);
const checked = ref(false);
const touristDetails = ref(false);
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
		dataIndex: 'issueStatusName',
		key: 'issueStatusName',
	},
	{
		title: '行程状态',
		dataIndex: 'itineraryStatusName',
		key: 'itineraryStatusName',
	},
	{
		title: '查验状态',
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
const strongColumns = [
	{
		title: '线下查验结果',
		dataIndex: 'checkResult',
		key: 'checkResult',
	},
	{
		title: '游客姓名',
		dataIndex: 'touristName',
		key: 'touristName',
	},
	{
		title: '身份证号码',
		dataIndex: 'certificateNo',
		key: 'certificateNo',
	},
	{
		title: '性别',
		dataIndex: 'genderName',
		key: 'genderName',
	},
	{
		title: '年龄',
		dataIndex: 'age',
		key: 'age',
	},
	// {
	// 	title: '联系方式',
	// 	dataIndex: 'touristNum',
	// 	key: 'touristNum',
	// },
	{
		title: '客源地',
		dataIndex: 'sourceAddress',
		key: 'sourceAddress',
	},
	{
		title: '减免符合条件',
		dataIndex: 'reduceCondition',
		key: 'reduceCondition',
	},
];
const ticketingColumns = [
	{
		title: '游客姓名',
		dataIndex: 'touristName',
		key: 'touristName',
	},
	{
		title: '身份证号码',
		dataIndex: 'certificateNo',
		key: 'certificateNo',
	},
	{
		title: '性别',
		dataIndex: 'genderName',
		key: 'genderName',
	},
	{
		title: '年龄',
		dataIndex: 'age',
		key: 'age',
	},
	{
		title: '联系方式',
		dataIndex: 'purchased',
		key: 'purchased',
	},
	{
		title: '客源地',
		dataIndex: 'sourceAddressName',
		key: 'sourceAddressName',
	},
	{
		title: '费用减免类型',
		dataIndex: 'discountRuleName',
		key: 'discountRuleName',
	},
	{
		title: '减免依据',
		dataIndex: 'specialCertificateImg',
		key: 'specialCertificateImg',
	},
];
const state = reactive({
	payTimer: null,
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
		details: [] as any,
		forceBrushStatus: '',
		updateBrushStatus: '',
	},
	title: '',
	strongTouristList: [],
	touristNum: '',
	reduceNum: '',
	notPresentNum: '',
	checkStatus: '',
	touristData:[] as any
});

const onHandleCurrentChange = (val: number) => {
	console.log('change:', val);
	state.tableData.param.pageNo = val;
	onSearch();
};
//查看
const toSee = (oid: any) => {
	route.push({ path: '/gouvyManagement/order/order_edit', query: { oid: oid } });
};
const pageSideChange = (current: number, size: number) => {
	console.log('changePageSize:', size);
	// state.tableData.param.pageSize = size;
	// onSearch();
};
const onSearch = () => {
	api.gouvyOrder(state.tableData.param).then((res: any) => {
		state.tableData.data = res.content;
		state.tableData.total = res.total;
	});
};
const orderDetails = (item: any) => {
	api.brushOrder(item).then((res: any) => {
		state.tableData.details = res;
		let downTime = dayjs(res.deadline).format('YYYY-MM-DD HH:mm:ss');
		// let downTime='2022-12-09 17:31:00'
		if (dayjs(downTime).valueOf() > dayjs().valueOf()) {
			countDown(downTime);
			state.payTimer = setInterval(() => {
				countDown(downTime);
			}, 1000);
		} else {
			state.tableData.details.deadline = '00:00';
		}
	});
};
const countDown = (end: any) => {
	let nowTime = Date.parse(new Date()); //现在时间
	let endTime = Date.parse(end); //活动结束时间
	let changeTime = endTime - nowTime; //时间戳差值
	// 所剩天数换算
	let day = parseInt(changeTime / 1000 / 60 / 60 / 24) > 0 ? parseInt(changeTime / 1000 / 60 / 60 / 24) + '天' : '';
	//所剩小时换算，不足10时，前面补0
	let hour =
		parseInt((changeTime / 1000 / 60 / 60) % 24) > 9
			? parseInt((changeTime / 1000 / 60 / 60) % 24) + '小时'
			: '0' + parseInt((changeTime / 1000 / 60 / 60) % 24) + '小时';
	//所剩分钟换算，不足10时，前面补0
	let min =
		parseInt((changeTime / 1000 / 60) % 60) > 9
			? parseInt((changeTime / 1000 / 60) % 60) + '分'
			: '0' + parseInt((changeTime / 1000 / 60) % 60) + '分';
	// 所剩秒数换算，不足10时，前面补0
	let sec = parseInt((changeTime / 1000) % 60) > 9 ? parseInt((changeTime / 1000) % 60) + '秒' : '0' + parseInt((changeTime / 1000) % 60) + '秒';
	if (changeTime <= 0) {
		// 如果差值小于0，代表活动已结束，清空定时器
		clearInterval(state.payTimer);
		state.payTimer = null;
		state.tableData.details.deadline = '00:00';
	} else {
		// 如活动未结束，赋值所剩时间
		state.tableData.details.deadline = day + hour + min + sec;
	}
};
const strong = (item: any) => {
	orderDetails(item.oid);
	state.tableData.forceBrushStatus = item.forceBrushStatus;
	if (item.forceBrushStatus == 2) {
		Visible.value = true;
	} else {
		state.title = '古维订单强刷';
		strongBrushVisible.value = true;
	}
};
const change = (item: any) => {
	orderDetails(item.oid);
	state.tableData.updateBrushStatus = item.updateBrushStatus;
	strongBrushVisible.value = true;
	state.title = '古维订单改刷';
};
const changeSubmit = () => {};
const strongSubmit = () => {
	selectStrongTouristVisible.value = true;
	api.listTourist(state.tableData.details.oid).then((i: any) => {
		state.strongTouristList = i.touristList;
		state.touristNum = i.touristNum;
		state.reduceNum = i.reduceNum;
		state.notPresentNum = i.notPresentNum;
		state.checkStatus = i.checkStatus;
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
		downloadFile(res, '古维订单');
		message.success('导出成功');
	});
};
const cancel = () => {
	strongBrushVisible.value = false;
	state.tableData.forceBrushStatus = '';
	state.tableData.updateBrushStatus = '';
};
const onSelect = (record: any, selected: boolean, selectedRows: any) => {};
const onSelectAll = (record: any, selected: boolean, selectedRows: any) => {};
const see = (id:any) => {
	touristDetails.value=true
	console.log(id,'id')
	api.getItineraryTourist(id).then((res: any) => {
		state.touristData=res
		console.log(state.touristData,'数据')
	});
};
const gotoDetails=(oid:any)=>{
	route.push({
		path: '/travel/travel_manage/travel_detail',
		query: {
			oid:oid,
		},
	});
}
const submit = () => {
	if (!checked.value) {
		message.warning('请阅读并勾选确认');
		return false;
	}
	console.log(checked.value, '勾选');
};
onMounted(() => {
	onSearch();
});
onBeforeUnmount(() => {});
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
.div-select {
	display: flex;
	justify-content: space-between;
	margin-bottom: 10px;
	p {
		line-height: 30px;
	}
}
.checked-div {
	margin-top: 30px;
}
.spanSee {
	color: rgb(2, 167, 240);
	margin-left: 30px;
	cursor: pointer;
}
</style>
