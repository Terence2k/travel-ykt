<template>
	<div>
		<CommonTable :dataSource="state.tableData" :columns="state.columns">
      <template #describe>
        共<span class="color-red">{{state.total}}</span>条撤销后重提的行程单。其中待审核 <span class="color-red">{{state.total}}</span> 条。
      </template>
			<template #bodyCell="{ column, text, index, record }">
				<template v-if="column.key === 'index'">
					<div>
						{{ (travelStore.auditList.withdrawalChange.params.pageNo - 1) * travelStore.auditList.withdrawalChange.params.pageSize + (index + 1) }}
					</div>
				</template>
				<template v-if="column.key === 'newOrderAmount'">
					<div>
						{{record.newOrderAmount/100}}
					</div>
				</template>
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a @click="auditStatus(record)" v-permission="'撤销重提审核_去审核'">去审核</a>
					</div>
				</template>
			</template>
		</CommonTable>
		<CommonPagination
			:current="travelStore.auditList.withdrawalChange.params.pageNo"
			:page-size="travelStore.auditList.withdrawalChange.params.pageSize"
			:total="state.total"
			@change="onHandleCurrentChange"
			@showSizeChange="pageSideChange"
		/>
	</div>
	<BaseModal title="行程单变更审核" v-model="changeAuditVisible" :width="1000">
		<div class="table_box">
			<table class="info_table" cellpadding="16px" border="1">
				<tr class="row">
					<td class="key">变更项目</td>
					<td class="key">变更前内容</td>
					<td class="key">变更后内容</td>
				</tr>
				<tr class="row">
					<td class="key">行程信息</td>
					<td class="value">
						<div style="margin-bottom:20px" v-if="state.oldHotelList!=null">
							<p style="text-align:left; margin-bottom: 0px;">酒店：</p>
							<p v-for="(item, index) in state.oldHotelList" :key="index">							
							<span>{{ state.oldHotelList[index].hotelName }}，</span> 
							<span v-for="(item, i) in state.oldHotelList[index].roomTypeList" :key="index">{{ state.oldHotelList[index].roomTypeList[i].roomTypeName }}</span>
							<span>{{ state.oldHotelList[index].roomCount }}间</span>
							<span>{{ dayjs(state.oldHotelList[index].endDate).diff(state.oldHotelList[index].startDate, 'day') }}天，</span>
							<span>费用总计 <span style="color: red">{{ state.oldHotelList[index].orderFee / 100 }}</span>元；</span></p>
						</div>
						<div v-if="state.oldTicketList!=null">
							<p style="text-align:left; margin-bottom: 0px;">景区：</p>
							<p v-for="(item, index) in state.oldTicketList" :key="index">							
							<span>{{ state.oldTicketList[index].scenicName }}，</span> 
							<span>{{ state.oldTicketList[index].ticketName }}</span>
							<span>{{ state.oldTicketList[index].reservePeopleCount }}张，</span>
							<span>费用总计 <span style="color: red">{{ state.oldTicketList[index].reservePeopleCount * (state.oldTicketList[index].unitPrice/100) }}</span>元；</span></p>
						</div>
					</td>
					<td class="value" v-if="state.newHotelList!=null">
						<div style="margin-bottom:20px" >
							<p style="text-align:left; margin-bottom: 0px;">酒店：</p>
							<p v-for="(item, index) in state.newHotelList" :key="index">							
							<span>{{ state.newHotelList[index].hotelName }}，</span> 
							<span v-for="(item, i) in state.newHotelList[index].roomTypeList" :key="index">{{ state.newHotelList[index].roomTypeList[i].roomTypeName }}</span>
							<span>{{ state.newHotelList[index].roomCount }}间</span>
							<span>{{ dayjs(state.newHotelList[index].endDate).diff(state.newHotelList[index].startDate, 'day') }}天，</span>
							<span>费用总计 <span style="color: red">{{ state.newHotelList[index].orderFee / 100 }}</span>元；</span></p>
						</div>
						<div v-if="state.newTicketList!=null">
							<p style="text-align:left; margin-bottom: 0px;">景区：</p>			
							<p v-for="(item, index) in state.newTicketList" :key="index">							
							<span>{{ state.newTicketList[index].scenicName }}，</span> 
							<span>{{ state.newTicketList[index].ticketName }}</span>
							<span>{{ state.newTicketList[index].reservePeopleCount }}张，</span>
							<span>费用总计 <span style="color: red">{{ state.newTicketList[index].reservePeopleCount * (state.newTicketList[index].unitPrice/100) }}</span>元；</span></p>
						</div>
					</td>
				</tr>
				<tr class="row">
					<td class="key">行程预冻结费用</td>
					<td class="value">
						<span style="color: red">{{ state.oldOrderAmount / 100 }}</span> 元
					</td>
					<td class="value">
						<span style="color: red">{{ state.newOrderAmount / 100 }}</span> 元
					</td>
				</tr>
			</table>
		</div>
		<template v-slot:footer>
			<a-button @click="sendAudit(3)">驳回</a-button>
			<a-button type="primary" @click="sendAudit(2)">同意预冻结</a-button>
		</template>
	</BaseModal>
	<BaseModal title="驳回确认" v-model="rejectAuditVisible">
		驳回 {{ state.rowDate.subTravelName }} 申请的行程变更申请，填写驳回理由：
		<a-textarea v-model:value="auditRemark" placeholder="请填写驳回理由" :rows="4" />
		<template v-slot:footer>
			<a-button @click="rejectAuditVisible = false">取消</a-button>
			<a-button type="primary" @click="rejectAudit">确定</a-button>
		</template>
	</BaseModal>
</template>
<script lang="ts" setup>
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import BaseModal from '@/components/common/BaseModal.vue';
import { message } from 'ant-design-vue';
import { Modal } from 'ant-design-vue';
import api from '@/api/index';
import { useTravelStore } from '@/stores/modules/travelManagement';
import { AuditStaus } from '@/enum';
import dayjs, { Dayjs } from 'dayjs';
const travelStore = useTravelStore();
const state = reactive({
	total: computed(() => travelStore.auditList.withdrawalChange.total),
	params: {
		pageNo: 1,
		pageSize: 10,
		status: 1,
	},
	tableData: computed(() => travelStore.auditList.withdrawalChange.list),
	oldHotelList: [] as any,
	newHotelList: [] as any,
	oldTicketList: [] as any,
	newTicketList: [] as any,
	newOrderAmount: '' as any,
	oldOrderAmount: '' as any,
	rowDate:[] as any,
	columns: [
		{
			title: ' 序号 ',
			key: 'index',
			width: '80px',
		},
		{
			title: '行程单号',
			dataIndex: 'itineraryNo',
			key: 'itineraryNo',
		},
		{
			title: '线路名称',
			dataIndex: 'routeName',
			key: 'routeName',
		},
		{
			title: '地接社',
			dataIndex: 'subTravelName',
			key: 'subTravelName',
		},
		{
			title: '行程时间',
			dataIndex: 'time',
			key: 'time',
		},
		{
			title: '撤销前人数',
			dataIndex: 'teamTypeName',
			key: 'teamTypeName',
		},
		{
			title: '变更后人数',
			dataIndex: 'travelOperatorName',
			key: 'travelOperatorName',
		},
		{
			title: '撤销前冻结金额',
			dataIndex: 'touristCount',
			key: 'touristCount',
		},
		{
			title: '变更后金额',
			dataIndex: 'newOrderAmount',
			key: 'newOrderAmount',
		},
		{
			title: '审核结果',
			dataIndex: 'newOrderAmount',
			key: 'newOrderAmount',
		},
		{
			title: '操作',
			fixed: 'right',
			key: 'action',
		},
	],
});
const changeAuditVisible = ref(false);
const rejectAuditVisible = ref(false);
const auditRemark = ref('');
const onSearch = async () => {
	travelStore.auditList.withdrawalChange.params.status = AuditStaus.withdrawalChange;
	const res = await travelStore.getAuditList(travelStore.auditList.withdrawalChange.params);
	travelStore.setAuditList(res, 'withdrawalChange');
};
const cancel = (): any => {
	changeAuditVisible.value = false;
	rejectAuditVisible.value = false;
	onSearch();
};
const auditStatus = async (row: any) => {
	await getDetail(row.changeId, row);
	changeAuditVisible.value = true;
};
const sendAudit = (status: any) => {
	// 审核通过
	// if (status == 2) {
	// 	Modal.confirm({
	// 		title: '行程变更审核提示',
	// 		width: 560,
	// 		closable: true,
	// 		centered: true,
	// 		icon: false,
	// 		content: `您即将批准 ${state.rowDate.subTravelName} 申请的行程变更申请，变更后冻结金额将调整为 ${state.newOrderAmount/100} 元？是否同意？是否同意？`,
	// 		onOk() {
	// 			const queryData = {
	// 				auditStatus:2,
	// 				auditRemark: auditRemark.value, //审核描述
	// 				changeId:state.rowDate.changeId, //changeId
	// 				isPass: true,
	// 			};
	// 			console.log('queryData:', queryData);
	// 			api.travelManagement
	// 				.changeItineraryAudit(queryData)
	// 				.then((res: any) => {
	// 					console.log('审核返回信息：', res);
	// 					message.success('保存成功');
	// 					cancel();
	// 				})
	// 				.catch((err: any) => {
	// 					console.error(err);
	// 				});
	// 		},
	// 		onCancel() {},
	// 	});
	// } else if (status == 3) {
	// 	// 审核不通过
	// 	rejectAuditVisible.value = true;
	// }
};
const rejectAudit = () => {
	const queryData = {
		auditStatus:3,
		auditRemark: auditRemark.value, //审核描述
		changeId:state.rowDate.changeId , //uuid
		isPass: false,
	};
	console.log('queryData:', queryData);
	api.travelManagement
		.changeItineraryAudit(queryData)
		.then((res: any) => {
			console.log('审核返回信息：', res);
			message.success('保存成功');
			cancel();
		})
		.catch((err: any) => {
			console.error(err);
		});
};
const getDetail = async (id: any, row: any) => {
	state.rowDate=row;
	const backup = row;
	await api.travelManagement
		.getItineraryChangeProductHistory(id)
		.then((res: any) => {
			state.newHotelList = res.newHotelList;
			state.oldHotelList = res.oldHotelList;
			state.newTicketList = res.newTicketList;
			state.oldTicketList = res.oldTicketList;
			state.newOrderAmount = res.newOrderAmount;
			state.oldOrderAmount = res.oldOrderAmount;
		})
		.catch((err: any) => {
			console.error(err);
		});
};
const onHandleCurrentChange = (e: any) => {
	travelStore.auditList.withdrawalChange.params.pageNo = e;
	onSearch();
};
const pageSideChange = () => {};
onSearch();

watch(changeAuditVisible, (nVal) => {
	if (!nVal) state.detail = {};
});
</script>
<style scoped lang="less">
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
