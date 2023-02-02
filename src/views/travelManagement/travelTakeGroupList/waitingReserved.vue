<template>
	<div>
		<CommonTable :dataSource="state.tableData" :columns="state.columns" rowKey="oid">
			<template #button> </template>
			<template #bodyCell="{ column, text, index, record }">
				<template v-if="column.key === 'index'">
					<div>
						{{ (travelStore.takeGroupList.waitingReserved.params.pageNo - 1) * travelStore.takeGroupList.waitingReserved.params.pageSize + (index + 1) }}
					</div>
				</template>
				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a @click="goToPath(record)" v-permission="'待预订_进入预订'">进入预订</a>
						<a @click="goToChange(record)" v-permission="'待预订_行程变更'">行程变更</a>
            <a @click="goToDetail(record)" v-permission="'待预订_查看行程'">查看行程</a>
					</div>
				</template>
			</template>
		</CommonTable>
		<ChangeItems v-model="modelValue" :changeParams="state.changeParams"></ChangeItems>
		<CommonPagination
			:current="travelStore.takeGroupList.waitingReserved.params.pageNo"
			:page-size="travelStore.takeGroupList.waitingReserved.params.pageSize"
			:total="state.total"
			@change="onHandleCurrentChange"
			@showSizeChange="pageSideChange"
		/>
	</div>
</template>
<script lang="ts" setup>
import CommonTable from '@/components/common/CommonTable.vue';
import ChangeItems from '@/components/common/changeItems.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import BaseModal from '@/components/common/BaseModal.vue';
import { useTravelStore } from '@/stores/modules/travelManagement';
import { GroupMode, TakeGroupStatus } from '@/enum';
import api from '@/api';
import { AnyCnameRecord } from 'dns';
import { message } from 'ant-design-vue';
const travelStore = useTravelStore();
const router = useRouter();
const modelValue = ref(false);
const state = reactive({
	total: computed(() => travelStore.takeGroupList.waitingReserved.total),
	params: {
		pageNo: 1,
		pageSize: 10,
		status: 1,
	},
	changeParams:{} as any,
	tableData: computed(() => travelStore.takeGroupList.waitingReserved.list),
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
	travelStore.takeGroupList.waitingReserved.params.status = TakeGroupStatus.WaitingReserved;
	const res = await travelStore.getTravelList(travelStore.takeGroupList.waitingReserved.params);
	travelStore.setTakeGroupList(res, 'waitingReserved');
};
const onHandleCurrentChange = (e: any) => {
		travelStore.takeGroupList.waitingReserved.params.pageNo = e
		onSearch()
};
const pageSideChange = () => {};
const goToPath = (row: any) => {
	router.push({
		path: '/travel/travel_manage/add_travel',
		query: {
			id: row.oid,
			itineraryNo: row.itineraryNo,
      tab: 4
		},
	});
};
const goToDetail = (row: any) => {
  router.push({
    path: '/travel/take_group/take_group_travel_detail',
    query: { oid: encodeURIComponent(row.oid) }
  });
}
const goToChange = (row: any) => {
	state.changeParams.id = row.oid;
	state.changeParams.itineraryNo = row.itineraryNo;
	api.travelManagement.checkVerifyByItineraryId(row.itineraryNo).then((res) => {
		if (res) {
			modelValue.value = true;
		}else{
			message.error('该行程单发生过核销不可变更')
		}
	});
};
onSearch();
</script>
<style lang="less" scoped>
	.model-div
	{
		text-align: center;
		margin-bottom: 30px;
	}
	.model-div>p{
		color: rgb(225, 225, 225);
		margin-top: 10px;
	}
</style>
