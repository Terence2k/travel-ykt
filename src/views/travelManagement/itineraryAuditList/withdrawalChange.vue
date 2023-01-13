<template>
	<div>
		<CommonTable :dataSource="state.tableData" :columns="state.columns">
      <template #describe>
		共<span class="color-red">{{state.total}}</span>条行程单。其中待审核 <span class="color-red">{{waitAuditNum}}</span> 条。
      </template>
			<template #bodyCell="{ column, text, index, record }">
				<template v-if="column.key === 'index'">
					<div>
						{{ (travelStore.auditList.withdrawalChange.params.pageNo - 1) * travelStore.auditList.withdrawalChange.params.pageSize + (index + 1) }}
					</div>
				</template>
				<template v-if="column.key === 'totalFee'">
					<div>
						{{accDiv(record.totalFee,100)}}
					</div>
				</template>
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a @click="auditStatus(record)" v-permission="'撤销重提审核_去审核'" v-if="record.financeAuditStatus==1">去审核</a>
						<a @click="auditStatus(record)" v-permission="'撤销重提审核_查看'" v-else>查看</a>
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
	<BaseModal title="行程单重提审核" v-model="changeAuditVisible" :width="1000">
		<div class="table_box">
			<p>已撤销的行程单：</p>
			<table class="info_table" cellpadding="16px" border="1">
				<tr class="row">
					<td class="key">行程单编号</td>
					<td class="value">{{ state.detailData.itineraryNo}}</td>
				</tr>
				<tr class="row">
					<td class="key">线路名称</td>
					<td class="value">{{ state.detailData.routeName }}</td>
				</tr>
				<tr class="row">
					<td class="key">组团社计调</td>
					<td class="value">{{ state.detailData.travelOperatorName }} {{ state.detailData.travelOperatorPhone }}</td>
				</tr>
				<tr class="row">
					<td class="key">地接社</td>
					<td class="value">{{ state.detailData.subTravelName }}</td>
				</tr>
				<tr class="row">
					<td class="key">出散团时间</td>
					<td class="value">{{state.detailData.startDate}}-{{ state.detailData.endDate }} ({{ dayjs(state.detailData.endDate).diff(state.detailData.startDate, 'day') }})天，</td>
				</tr>
				<tr class="row">
					<td class="key">撤销前团客人数</td>
					<td class="value">{{state.detailData.routeName}}</td>
				</tr>
				<tr class="row">
					<td class="key">撤销前冻结金额</td>
					<td class="value">{{accDiv(state.detailData.routeName,100)  }}元</td>
				</tr>
			</table>
			<p style="margin-top:15px">2022.10.10.23 09:00:23 丽江市黑白水旅行社已撤销原始行程单，并创建了以下新行程单，请审核需冻结金额：</p>
			<table class="info_table" cellpadding="16px" border="1">
				<tr class="row">
					<td class="key">行程单编号</td>
					<td class="value">{{  }}</td>
				</tr>
				<tr class="row">
					<td class="key">线路名称</td>
					<td class="value">{{  }}</td>
				</tr>
				<tr class="row">
					<td class="key">出散团时间</td>
					<td class="value">{{  }}</td>
				</tr>
				<tr class="row">
					<td class="key">团客人数</td>
					<td class="value">{{  }}人</td>
				</tr>
				<tr class="row">
					<td class="key">古维管理费</td>
					<td class="value">{{  }}</td>
				</tr>
				
				<tr class="row">
					<td class="key">综费产品</td>
					<td class="value">{{  }}</td>
				</tr>
				<tr class="row">
					<td class="key">酒店</td>
					<td class="value">{{}}</td>
				</tr>
				<tr class="row">
					<td class="key">景区</td>
					<td class="value">{{}}</td>
				</tr>
				<tr class="row">
					<td class="key">本次预冻结金额</td>
					<td class="value">{{accDiv()  }}元</td>
				</tr>
				<tr class="row">
					<td class="key">公司账户可用余额</td>
					<td class="value">{{accDiv()  }}元</td>
				</tr>
			</table>
		</div>
		<p style="margin-top: 20px; font-size: 18px;">2022.10.23 19:00:45 您已审核，审核结果：【驳回】驳回原因：xxxxxxxxxxxxxx</p>
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
import { accDiv, accMul } from '@/utils/compute';
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
	detailData:[] as any,
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
			dataIndex: 'touristCount',
			key: 'touristCount',
		},
		{
			title: '变更后人数',
			dataIndex: 'newTouristCount',
			key: 'newTouristCount',
		},
		{
			title: '撤销前冻结金额',
			dataIndex: 'touristCount',
			key: 'touristCount',
		},
		{
			title: '变更后金额',
			dataIndex: 'totalFee',
			key: 'totalFee',
		},
		{
			title: '审核结果',
			dataIndex: 'financeAuditStatusName',
			key: 'financeAuditStatusName',
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
const waitAuditNum = ref(0);
const onSearch = async () => {
	travelStore.auditList.withdrawalChange.params.status = AuditStaus.withdrawalChange;
	const res = await travelStore.getAuditList(travelStore.auditList.withdrawalChange.params);
	if (!waitAuditNum.value) {
      res.content.forEach((item: any) => {
        if (item.financeAuditStatus === 1) {
          waitAuditNum.value += 1;
        }
      })
    }
	travelStore.setAuditList(res, 'withdrawalChange');
};
const cancel = (): any => {
	changeAuditVisible.value = false;
	rejectAuditVisible.value = false;
	onSearch();
};
const auditStatus = async (row: any) => {
	await getDetail(row.oid, row);
	changeAuditVisible.value = true;
};
const sendAudit = (status: any) => {
	// 审核通过
	if (status == 2) {
		Modal.confirm({
			title: '撤销重提审核提示',
			width: 560,
			closable: true,
			centered: true,
			icon: false,
			content: `您即将批准 ${state.rowDate.subTravelName} 申请的撤销重提申请，撤销重提后冻结金额将调整为 ${state.newOrderAmount/100} 元？是否同意？是否同意？`,
			onOk() {
				const queryData = {
					auditStatus:2,
					auditRemark: auditRemark.value, //审核描述
					// changeId:state.rowDate.changeId, //changeId
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
	await api.travelManagement
		.getAuditInfo(id)
		.then((res: any) => {
			state.detailData=res
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
	// max-height: 80vh;
	// padding: 1px 0;
	// overflow: auto;

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
