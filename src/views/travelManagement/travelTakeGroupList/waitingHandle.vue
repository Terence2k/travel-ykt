<template>
	<div class="print-container">
		<travelDetail ref="travelDetailRef" />
	</div>
	<div>
		<CommonTable :dataSource="state.tableData" :columns="state.columns" rowKey="oid">
			<template #button> </template>
			<template #bodyCell="{ column, text, index, record }">
				<template v-if="column.key === 'index'">
					<div>
						{{ (travelStore.takeGroupList.waitingHandle.params.pageNo - 1) * travelStore.takeGroupList.waitingHandle.params.pageSize + (index + 1) }}
					</div>
				</template>

				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a @click="goToDetail(record)" v-permission="'待处理_行程详情'">行程详情</a>
						<a @click="revoke(record)" v-permission="'待处理_申请撤销'">申请撤销</a>
						<a @click="goToLog(record)" v-permission="'待处理_查看日志'">查看日志</a>
						<a @click="getPrint(record)" v-permission="'待处理_打印'">打印</a>
					</div>
				</template>
			</template>
		</CommonTable>
		<ChangeItems v-model="modelValue" :changeParams="state.changeParams"></ChangeItems>
		<CommonPagination
			:current="travelStore.takeGroupList.waitingHandle.params.pageNo"
			:page-size="travelStore.takeGroupList.waitingHandle.params.pageSize"
			:total="state.total"
			@change="onHandleCurrentChange"
			@showSizeChange="pageSideChange"
		/>
	</div>

	<BaseModal title="整团撤销提醒" v-model="reRecokeAuditAllsVisible">
		<p>是否直接整团撤销？整团撤销需要组团社计调 、古维管理员审核。审核通过后系统会自动为 您撤销该行程，已冻结金额将返回给组团社。</p>
		<template v-slot:footer>
			<a-button @click="reRecokeAuditAllsVisible = false">取消</a-button>
			<a-button @click="openAllReapply" type="primary">继续撤销</a-button>
		</template>
	</BaseModal>
	<BaseModal title="第三方门票退订提醒" v-model="reRecokeAuditCheckVisible">
		<p>{{ reRecokeAuditCheckText }}</p>
		<p>请等待退订完成</p>
		<template v-slot:footer>
			<a-button @click="reRecokeAuditCheckVisible = false">确定</a-button>
		</template>
	</BaseModal>
	<AllRevoke ref="allRevokeRef" />
</template>
<script lang="ts" setup>
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import { message } from 'ant-design-vue';
import ChangeItems from '@/components/common/changeItems.vue';
import api from '@/api/index';
import BaseModal from '@/components/common/BaseModal.vue';
import travelDetail from '../travelDetail.vue';
import { useTravelStore } from '@/stores/modules/travelManagement';
import { GroupMode, TakeGroupStatus } from '@/enum';
import AllRevoke from './revoke/components/allRevoke.vue';

const travelStore = useTravelStore();
const router = useRouter();
const modelValue = ref(false);
const travelDetailRef = ref();
const reRecokeAuditAllsVisible = ref(false);
const reRecokeAuditCheckVisible = ref(false);
const reRecokeAuditCheckText = ref('');
const state = reactive({
	total: computed(() => travelStore.takeGroupList.waitingHandle.total),
	params: {
		pageNo: 1,
		pageSize: 10,
		status: 1,
	},
	tableData: computed(() => travelStore.takeGroupList.waitingHandle.list),
	changeParams: {} as any,
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
			title: '组团社',
			dataIndex: 'travelName',
			key: 'travelName',
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
			title: '带队导游',
			dataIndex: 'guides',
			key: 'guides',
		},
		{
			title: '团客人数',
			dataIndex: 'touristCount',
			key: 'touristCount',
		},
		{
			title: '操作',
			fixed: 'right',
			key: 'action',
		},
	],
});
const onSearch = async () => {
	travelStore.takeGroupList.waitingHandle.params.status = TakeGroupStatus.WaitingHandle;
	const res = await travelStore.getTravelList(travelStore.takeGroupList.waitingHandle.params);
	travelStore.setTakeGroupList(res, 'waitingHandle');
};
const onHandleCurrentChange = (e: any) => {
	travelStore.takeGroupList.waitingHandle.params.pageNo = e;
	onSearch();
};
const pageSideChange = () => {};
const getPrint = (record: any) => {
	
	travelDetailRef.value.getPrint(record.oid)
}
const checkPower = async (id: any) => {
	let pW = new FormData();

	pW.append('itineraryId', id);

	await api.travelManagement.repealNreapplyPage(pW);
	return true;
};

const checkOutSideTicketIsRefund = async (id: any) => {
	let pW = new FormData();

	pW.append('itineraryId', id);

	await api.travelManagement.checkOutSideTicketIsRefund(pW);

	return true;
};

//打开弹窗
const allRevokeRef = ref();

const openAllReapply = () => {
	reRecokeAuditAllsVisible.value = false;
	allRevokeRef.value.open();
};

const revoke = async (row: any) => {
	let valid, validTikcer;
	try {
		valid = await checkPower(row.oid);
		validTikcer = await checkOutSideTicketIsRefund(row.oid);
		if (valid && validTikcer) {
			reRecokeAuditAllsVisible.value = true;
		}
	} catch (error: any) {
		console.log(error, 'error');
		reRecokeAuditCheckText.value = error?.msg;
		reRecokeAuditCheckVisible.value = true;
	}
};

const goToDetail = (row: any) => {
	router.push({
		path: '/travel/take_group/take_group_travel_detail',
		query: { oid: encodeURIComponent(row.oid) },
	});
};
const goToLog = (row: any) => {
	router.push({
		path: '/travel/travel_manage/travel_log',
		query: { oid: encodeURIComponent(row.oid) },
	});
};
onSearch();
</script>
<style lang="less" scoped>
.model-div {
	text-align: center;
	margin-bottom: 30px;
}
.model-div > p {
	color: rgb(225, 225, 225);
	margin-top: 10px;
}
.print-container {
	position: absolute;
	top: 100px;
	width: 100%;
}
</style>
