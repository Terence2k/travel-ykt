<template>
	<div class="print-container">
		<travelDetail ref="travelDetailRef" />
	</div>
	<div>
		<CommonTable :dataSource="state.tableData" :columns="state.columns" rowKey="oid">
			<template #bodyCell="{ column, text, index, record }">
				<template v-if="column.key === 'index'">
					<div>
							{{(travelStore.traveList.waitingChange.params.pageNo - 1) * (travelStore.traveList.waitingChange.params.pageSize) + (index + 1)}}
					</div>
				</template>

				<template v-if="column.key === 'groupTypeStr'">
						{{text}}
				</template>

				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<!-- <a v-permission="'待变更_去审核'">去审核</a> -->
						<a @click="goToLog(record)" v-permission="'待变更_查看日志'">查看日志</a>
						<a @click="goToPath(record)" v-permission="'待变更_查看行程'">查看行程</a>
						<a @click="getPrint(record)" v-permission="'待变更_打印'">打印</a>
					</div>
				</template>
			</template>
		</CommonTable>
		<CommonPagination
			:current="travelStore.traveList.waitingChange.params.pageNo"
			:page-size="travelStore.traveList.waitingChange.params.pageSize"
			:total="state.total"
			@change="onHandleCurrentChange"
			@showSizeChange="pageSideChange"
		/>
	</div>
</template>
<script lang="ts" setup>
	import CommonTable from '@/components/common/CommonTable.vue';
	import CommonPagination from '@/components/common/CommonPagination.vue';

	import api from '@/api/index';
	import travelDetail from '../travelDetail.vue';
	import { useTravelStore } from '@/stores/modules/travelManagement';
	import { GroupMode, GroupStatus } from '@/enum'
	import { cloneDeep } from 'lodash';

	const router = useRouter()
	const travelStore = useTravelStore();
	const travelDetailRef = ref();
	const state = reactive({
		total: computed(() => travelStore.traveList.waitingChange.total),
		params: {
				pageNo: 1,
				pageSize: 10,
				status: 1
		},
		tableData: computed(() => travelStore.traveList.waitingChange.list),
		columns: [
			{
					title: ' 序号 ',
					key: 'index',
					width: '80px'
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
					title: '团客人数',
					dataIndex: 'touristCount',
					key: 'touristCount',
			},
			{
					title: '当前状态',
					dataIndex: 'statusName',
					key: 'statusName',
			},
			{
					title: '操作',
					fixed: 'right',
					key: 'action',
			}
		]
	})
	const goToPath = (row: any) => {
		router.push({
		path: '/travel/travel_manage/travel_detail',
		query: {
			oid: row.oid
		}
		})
	}
  	const getPrint = (record: any) => {
		travelDetailRef.value.getPrint(record.oid)
	}
  const goToLog = (row: any) => {
    router.push({
      path: '/travel/travel_manage/travel_log',
      query: { oid: encodeURIComponent(row.oid) },
    });
  };
	const onSearch = async () => {
		let params: any = {};
		travelStore.traveList.waitingChange.params.status = GroupStatus.WaitingChange
		params = cloneDeep(travelStore.traveList.waitingChange.params)
		params.groupType = travelStore.traveList.waitingChange.params.groupType === '0' ? '' : 
		travelStore.traveList.waitingChange.params.groupType;
		
		const res = await travelStore.getTravelList(params);
		
		travelStore.setTraveList(res, 'waitingChange')
	}
	const onHandleCurrentChange = (e:any) => {
		travelStore.traveList.waitingChange.params.pageNo = e
		onSearch()
	}
	const pageSideChange = () => {

	}
	const onSelect = (record: any, selected: boolean, selectedRows: any[]) => {
		console.log(record, selected, selectedRows);
	}
	onSearch()
</script>
<style scoped>
.print-container {
	position: absolute;
	width: 100%;
}
</style>