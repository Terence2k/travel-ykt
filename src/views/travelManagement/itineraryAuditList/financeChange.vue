<template>
	<div>
		<CommonTable :dataSource="state.tableData" :columns="state.columns">
      <template #describe>
        共<span class="color-red">{{state.total}}</span>条变更的行程单。其中待审核 <span class="color-red">{{state.total}}</span> 条。
      </template>
			<template #bodyCell="{ column, text, index, record }">
				<template v-if="column.key === 'index'">
					<div>
						{{ (travelStore.auditList.financeChange.params.pageNo - 1) * travelStore.auditList.financeChange.params.pageSize + (index + 1) }}
					</div>
				</template>
				<template v-if="column.key === 'newOrderAmount'">
					<div>
						{{accDiv(record.newOrderAmount,100)}}
					</div>
				</template>
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a @click="auditStatus(record)" v-permission="'变更审核_去审核'">去审核</a>
					</div>
				</template>
			</template>
		</CommonTable>
		<CommonPagination
			:current="travelStore.auditList.financeChange.params.pageNo"
			:page-size="travelStore.auditList.financeChange.params.pageSize"
			:total="state.total"
			@change="onHandleCurrentChange"
			@showSizeChange="pageSideChange"
		/>
	</div>
	<BaseModal title="行程单变更审核" v-model="changeAuditVisible" :width="1000">
		<div class="table_box">
			<table class="info_table" cellpadding="16px" border="1">
				<tr class="row">
					<td class="key">行程单编号</td>
					<td class="value">{{state.itineraryNo}}</td>
				</tr>
				<tr class="row">
					<td class="key">线路名称</td>
					<td class="value">{{state.routeName}}</td>
				</tr>
				<tr class="row">
					<td class="key">发团计调</td>
					<td class="value">{{state.travelOperatorName}}</td>
				</tr>
				<tr class="row">
					<td class="key">出散团时间</td>
					<td class="value">{{state.startDate}}-{{state.endDate}} <span style="margin-left:10px;">({{dayjs(state.endDate).diff(state.startDate, 'day')}}天)</span></td>
				</tr>
				<tr class="row">
					<td class="key">团客人数</td>
					<td class="value">{{state.touristCount}}</td>
				</tr>
			</table>
			<p style="margin-top:15px">地接社由请了行程变更，计调已同意。请审核金额变化:</p>
			<table class="info_table" cellpadding="16px" border="1">
				<tr class="row">
					<td class="key">变更项目</td>
					<td class="key">变更前内容</td>
					<td class="key">变更后内容</td>
				</tr>
				<tr class="row">
					<td class="key">酒店</td>
					<td class="value">
						<div>
							<p v-for="(item, index) in state.oldHotelList" :key="index">							
							<span>{{ state.oldHotelList[index].hotelName }}，</span> 
							<span v-for="(item, i) in state.oldHotelList[index].roomTypeList" :key="index">{{ state.oldHotelList[index].roomTypeList[i].roomTypeName }}</span>
							<span>{{ state.oldHotelList[index].roomCount }}间</span>
							<span>{{ dayjs(state.oldHotelList[index].endDate).diff(state.oldHotelList[index].startDate, 'day') }}天，</span>
							<span>费用总计 <span style="color: red">{{ accDiv(state.oldHotelList[index].orderFee,100) }}</span>元；</span></p>
						</div>
					</td>
					<td class="value">
						<div>
							<p v-for="(item, index) in state.newHotelList" :key="index">							
							<span>{{ state.newHotelList[index].hotelName }}，</span> 
							<span v-for="(item, i) in state.newHotelList[index].roomTypeList" :key="index">{{ state.newHotelList[index].roomTypeList[i].roomTypeName }}</span>
							<span>{{ state.newHotelList[index].roomCount }}间</span>
							<span>{{ dayjs(state.newHotelList[index].endDate).diff(state.newHotelList[index].startDate, 'day') }}天，</span>
							<span>费用总计 <span style="color: red">{{ accDiv(state.newHotelList[index].orderFee,100) }}</span>元；</span></p>
						</div>
					</td>
				</tr>
				<tr class="row">
					<td class="key">景区</td>
					<td class="value">
						<div>
							<p v-for="(item, index) in state.oldTicketList" :key="index">							
							<span>{{ state.oldTicketList[index].scenicName }}，</span> 
							<span>{{ state.oldTicketList[index].ticketName }}</span>
							<span>{{ state.oldTicketList[index].reservePeopleCount }}张，</span>
							<span>费用总计 <span style="color: red">{{ accMul(state.oldTicketList[index].reservePeopleCount,accDiv(state.oldTicketList[index].unitPrice,100)) }}</span>元；</span></p>
						</div>
					</td>
					<td class="value">
						<div>
							<p v-for="(item, index) in state.newTicketList" :key="index">							
							<span>{{ state.newTicketList[index].scenicName }}，</span> 
							<span>{{ state.newTicketList[index].ticketName }}</span>
							<span>{{ state.newTicketList[index].reservePeopleCount }}张，</span>
							<span>费用总计 <span style="color: red">{{ accMul(state.newTicketList[index].reservePeopleCount,accDiv(state.newTicketList[index].unitPrice,100)) }}</span>元；</span></p>
						</div>
					</td>
				</tr>
				<tr class="row">
					<td class="key">行程预冻结费用</td>
					<td class="value">
						<span style="color: red">{{ accDiv(state.oldOrderAmount,100) }}</span> 元
					</td>
					<td class="value">
						<span style="color: red">{{ accDiv(state.newOrderAmount,100)}}</span> 元
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
import { accDiv,accMul} from '@/utils/compute';
import { any } from 'vue-types';
const travelStore = useTravelStore();
const state = reactive({
	total: computed(() => travelStore.auditList.financeChange.total),
	params: {
		pageNo: 1,
		pageSize: 10,
		status: 1,
	},
	tableData: computed(() => travelStore.auditList.financeChange.list),
	oldHotelList: [] as any,
	newHotelList: [] as any,
	oldTicketList: [] as any,
	newTicketList: [] as any,
	rowDate:[] as any,
	newOrderAmount: '' as any,
	oldOrderAmount: '' as any,
	itineraryNo:'',
	routeName:'',
	travelOperatorName:'',
	startDate:'',
	endDate:'',
	touristCount:'',
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
			title: '团队类型',
			dataIndex: 'teamTypeName',
			key: 'teamTypeName',
		},
		{
			title: '发团计调',
			dataIndex: 'travelOperatorName',
			key: 'travelOperatorName',
		},
		{
			title: '团客人数',
			dataIndex: 'touristCount',
			key: 'touristCount',
		},
		{
			title: '预冻结金额',
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
	travelStore.auditList.financeChange.params.status = AuditStaus.FinanceChange;
	const res = await travelStore.getChangeItineraryList(travelStore.auditList.financeChange.params);
	// res.content.forEach( async (item: any) => {
	//   item.auditInfo = await getAuditButton(item.auditUuid);
	// })
	travelStore.setAuditList(res, 'financeChange');
	console.log(res, '12312313');
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
const getAuditButton = async (uuid: string) => {
	let res = await api.travelManagement.getAuditButton({ uuid: uuid });
	console.log(res);
	return res;
};
const sendAudit = (status: any) => {
	// 审核通过
	if (status == 2) {
		Modal.confirm({
			title: '行程变更审核提示',
			width: 560,
			closable: true,
			centered: true,
			icon: false,
			content: `您即将批准 ${state.rowDate.subTravelName} 申请的行程变更申请，变更后冻结金额将调整为 ${state.newOrderAmount/100} 元？是否同意？是否同意？`,
			onOk() {
				const queryData = {
					auditStatus:2,
					auditRemark: auditRemark.value, //审核描述
					changeId:state.rowDate.changeId, //changeId
					isPass: true,
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
			},
			onCancel() {},
		});
	} else if (status == 3) {
		// 审核不通过
		rejectAuditVisible.value = true;
	}
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
			state.itineraryNo=res.itineraryNo
			state.routeName=res.routeName
			state.travelOperatorName=res.travelOperatorName
			state.startDate=res.startDate
			state.endDate=res.endDate
			state.touristCount=res.touristCount
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
	travelStore.auditList.financeChange.params.pageNo = e;
	onSearch();
};
const pageSideChange = () => {};
onSearch();
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
