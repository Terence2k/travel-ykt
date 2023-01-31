<template>
	<div class="print-container">
		<travelDetail :travelOid="state.travelOid" />
	</div>
	<div>
		<CommonTable :dataSource="state.tableData" :columns="state.columns" rowKey="oid">
			<template #bodyCell="{ column, text, index, record }">
				<template v-if="column.key === 'index'">
					<div>
						{{ (travelStore.traveList.haveABall.params.pageNo - 1) * travelStore.traveList.haveABall.params.pageSize + (index + 1) }}
					</div>
				</template>

				<template v-if="column.key === 'groupTypeStr'">
					{{ text }}
				</template>

				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a @click="goToPath(record)" v-permission="'已接团_行程详情'">行程详情</a>
						<a @click="goToChange(record)" v-permission="'已接团_行程变更'">行程变更</a>
						<a @click="goToLog(record)" v-permission="'已接团_查看日志'">查看日志</a>
						<a @click="getPrint(record)">打印</a>
						<!-- <button ref="printBtn" v-print="print" style="opacity: 0;"></button> -->
					</div>
				</template>
			</template>
		</CommonTable>
		<ChangeItems v-model="modelValue" :changeParams="state.changeParams"></ChangeItems>

		<CommonPagination
			:current="travelStore.traveList.haveABall.params.pageNo"
			:page-size="travelStore.traveList.haveABall.params.pageSize"
			:total="state.total"
			@change="onHandleCurrentChange"
			@showSizeChange="pageSideChange"
		/>
		
	</div>
	
</template>
<script lang="ts" setup>
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import ChangeItems from '@/components/common/changeItems.vue';
import api from '@/api/index';
import BaseModal from '@/components/common/BaseModal.vue';
import { useTravelStore } from '@/stores/modules/travelManagement';
import travelDetail from '../travelDetail.vue';
import { GroupMode, GroupStatus } from '@/enum';
import { message } from 'ant-design-vue';
import { cloneDeep } from 'lodash';
const travelStore = useTravelStore();
const router = useRouter();
const modelValue = ref(false);
const state = reactive({
	total: computed(() => travelStore.traveList.haveABall.total),
	params: {
		pageNo: 1,
		pageSize: 10,
		status: 1,
	},
	changeParams: {} as any,
	travelOid: '',
	tableData: computed(() => travelStore.traveList.haveABall.list),
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
		// {
		// 		title: '组团社',
		// 		dataIndex: 'travelName',
		// 		key: 'travelName',
		// },
		{
			title: '地接社',
			dataIndex: 'subTravelName',
			key: 'subTravelName',
		},
		{
			title: '出团时间',
			dataIndex: 'startDate',
			key: 'startDate',
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
			title: '行程状态',
			dataIndex: 'statusName',
			key: 'statusName',
		},
		{
			title: '操作',
			fixed: 'right',
			key: 'action',
		},
	],
});
const onSearch = async () => {
	let params: any = {};
	travelStore.traveList.haveABall.params.status = GroupStatus.HaveABall
	params = cloneDeep(travelStore.traveList.haveABall.params)
	params.groupType = travelStore.traveList.haveABall.params.groupType === '0' ? '' : 
	travelStore.traveList.haveABall.params.groupType;
	
	const res = await travelStore.getTravelList(params);

	travelStore.setTraveList(res, 'haveABall');
};
const getPrint = (record: any) => {
	state.travelOid = record.oid;
}
const goToPath = (row: any) => {
	// router.push({
	// 	path: '/travel/travel_manage/add_travel',
	// 	query: {
	// 		id: row.oid,
	// 		itineraryNo: row.itineraryNo
	// 	}
	// })
	router.push({
		path: '/travel/travel_manage/travel_detail',
		query: {
			oid: encodeURIComponent(row.oid),
		},
	});
};

const goToChange = (row: any) => {
	state.changeParams.id = row.oid;
	state.changeParams.itineraryNo = row.itineraryNo;
	api.travelManagement.checkVerifyByItineraryId(row.itineraryNo).then((res) => {
		if (res) {
			modelValue.value = true;
		} else {
			message.error('该行程单发生过核销不可变更');
		}
	});
};
const goToLog = (row: any) => {
	router.push({
		path: '/travel/travel_manage/travel_log',
		query: { oid: encodeURIComponent(row.oid) },
	});
};
const onHandleCurrentChange = (e: any) => {
	travelStore.traveList.haveABall.params.pageNo = e;
	onSearch();
};
const pageSideChange = () => {};
const onSelect = (record: any, selected: boolean, selectedRows: any[]) => {
	console.log(record, selected, selectedRows);
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
	width: 100%;
}
</style>
