<template>
	<div>
		<CommonTable :dataSource="state.tableData" :columns="state.columns">
			<template #bodyCell="{ column, text, index, record }">
				<template v-if="column.key === 'index'">
					<div>
						{{ (travelStore.auditList.financeChange.params.pageNo - 1) * travelStore.auditList.financeChange.params.pageSize + (index + 1) }}
					</div>
				</template>

				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a @click="auditStatus(record)">去审核</a>
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
					<td class="key">变更项目</td>
					<td class="key">变更前内容</td>
					<td class="key">变更后内容</td>
				</tr>
				<tr class="row">
					<td class="key">行程信息</td>
					<td class="value">
						{{state.newHotelList[0].hotelName}}
					</td>
					<td class="value">
						
					</td>
				</tr>
				<tr class="row">
					<td class="key">行程预冻结费用</td>
					<td class="value"> <span style="color: red;">{{state.oldOrderAmount/100}}</span> 元</td>
					<td class="value"> <span style="color: red;">{{state.newOrderAmount/100}}</span> 元</td>
				</tr>
			</table>
		</div>
		<template v-slot:footer>
			<a-button @click="sendAudit(3)">驳回</a-button>
			<a-button type="primary" @click="sendAudit(2)">同意预冻结</a-button>
		</template>
	</BaseModal>
	<BaseModal title="驳回确认" v-model="rejectAuditVisible">
		驳回 {{ state.detail.travelOperatorName }} 申请的行程变更申请，填写驳回理由：
		<a-textarea v-model:value="rejectReason" placeholder="请填写驳回理由" :rows="4" />
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
const travelStore = useTravelStore();
const state = reactive({
	total: computed(() => travelStore.auditList.financeChange.total),
	params: {
		pageNo: 1,
		pageSize: 10,
		status: 1,
	},
	tableData: computed(() => travelStore.auditList.financeChange.list),
	detail: {} as any,
	oldHotelList:[] as any,
	newHotelList:[] as any,
	oldTicketList:[] as any,
	newTicketList:[] as any,
	newOrderAmount:'' as any,
	oldOrderAmount:'' as any,
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
			dataIndex: 'totalFee',
			key: 'totalFee',
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
const rejectReason = ref('');
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
	console.log('row:', row);
	await getDetail(row.changeId, row);
	changeAuditVisible.value = true;
};
const getAuditButton = async (uuid: string) => {
	let res = await api.travelManagement.getAuditButton({ uuid: uuid });
	console.log(res);
	return res;
};
const sendAudit = (status: any) => {
	console.log('state.detail:', state.detail);
	// 审核通过
	if (status == 2) {
		Modal.confirm({
			title: '行程变更审核提示',
			width: 560,
			closable: true,
			centered: true,
			icon: false,
			content: `您即将批准 ${state.detail.travelOperatorName} 申请的行程变更申请，是否同意？`,
			onOk() {
				const queryData = {
					rejectReason: rejectReason.value, //审核描述
					itineraryId: state.detail.oid, //uuid
					isPass: true,
				};
				console.log('queryData:', queryData);
				api.travelManagement
					.financeAudit(queryData)
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
		rejectReason: rejectReason.value, //审核描述
		itineraryId: state.detail.oid, //uuid
		isPass: false,
	};
	console.log('queryData:', queryData);
	api.travelManagement
		.financeAudit(queryData)
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
	const backup = row;
	await api.travelManagement
		.getItineraryChangeProductHistory(id)
		.then((res: any) => {
			state.newHotelList=res.newHotelList,
			state.oldHotelList=res.oldHotelList,
			state.newTicketList=res.newTicketList,
			state.oldTicketList=res.oldTicketList,
			state.newOrderAmount=res.newOrderAmount,
			state.oldOrderAmount=res.oldOrderAmount
			console.log(state.newHotelList,'21313')
		})
		.catch((err: any) => {
			console.error(err);
			state.detail = backup;
		});
};
const onHandleCurrentChange = (e: any) => {
	travelStore.auditList.financeChange.params.pageNo = e;
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
