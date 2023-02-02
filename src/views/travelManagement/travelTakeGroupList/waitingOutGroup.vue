<template>
	<div>
		<CommonTable :dataSource="state.tableData" :columns="state.columns" rowKey="oid">
			<template #button> </template>
			<template #bodyCell="{ column, text, index, record }">
				<template v-if="column.key === 'index'">
					<div>
						{{
							(travelStore.takeGroupList.waitingOutGroup.params.pageNo - 1) * travelStore.takeGroupList.waitingOutGroup.params.pageSize + (index + 1)
						}}
					</div>
				</template>

				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a @click="goToDetail(record)" v-permission="'待出团_行程详情'">行程详情</a>
						<a v-if="dateTime > dayjs(record.startDate).unix()" @click="outGroup(record)" v-permission="'待出团_手动出团'">手动出团</a>
						<a @click="goToChange(record)" v-permission="'待出团_行程变更'">行程变更</a>
						<a @click="goToLog(record)" v-permission="'待出团_查看日志'">查看日志</a>
						<a @click="goToPath(record)" v-permission="'待出团_进入预订'">进入预订</a>
					</div>
				</template>
			</template>
		</CommonTable>
		<ChangeItems v-model="modelValue" :changeParams="state.changeParams"></ChangeItems>

		<CommonPagination
			:current="travelStore.takeGroupList.waitingOutGroup.params.pageNo"
			:page-size="travelStore.takeGroupList.waitingOutGroup.params.pageSize"
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
import { useTravelStore } from '@/stores/modules/travelManagement';
import { GroupMode, TakeGroupStatus } from '@/enum';
import api from '@/api/index';
import { message } from 'ant-design-vue';
import BaseModal from '@/components/common/BaseModal.vue';
import dayjs from 'dayjs';
const travelStore = useTravelStore();
const router = useRouter();
const modelValue = ref(false);
const dateTime = ref(dayjs().unix());
const state = reactive({
	total: computed(() => travelStore.takeGroupList.waitingOutGroup.total),
	params: {
		pageNo: 1,
		pageSize: 10,
		status: 1,
	},
	changeParams: {} as any,
	tableData: computed(() => travelStore.takeGroupList.waitingOutGroup.list),
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
	travelStore.takeGroupList.waitingOutGroup.params.status = TakeGroupStatus.WaitingOutGroup;
	const res = await travelStore.getTravelList(travelStore.takeGroupList.waitingOutGroup.params);
	travelStore.setTakeGroupList(res, 'waitingOutGroup');
};
const onHandleCurrentChange = (e: any) => {
	travelStore.takeGroupList.waitingOutGroup.params.pageNo = e;
	onSearch();
};
const pageSideChange = () => {};
const outGroup = async (row: any) => {
	await api.travelManagement.handGoOut(row.oid)
	message.success('操作成功')
	onSearch();
	console.log('手动出团：', row);
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
console.log('dateTime.value:', dateTime.value);

watch(
	() => dateTime.value,
	async (nVal) => {
		if (nVal) {
			console.log('dateTime.value:', dateTime.value);
		}
	}
);
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
</style>
