<template>
	<div class="print-container">
		<travelDetail ref="travelDetailRef" />
	</div>
  	<div>
	
		<CommonTable :dataSource="state.tableData" :columns="state.columns" rowKey="oid">
			<template #button>
			</template>
			<template #bodyCell="{ column, text, index,record }">
				<template v-if="column.key === 'index'">
							<div>
								{{(travelStore.takeGroupList.cancellation.params.pageNo - 1) * (travelStore.takeGroupList.cancellation.params.pageSize) + (index + 1)}}
							</div>
						</template>

				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a @click="goToDetail(record)" v-permission="'已散团_行程详情'">行程详情</a>
						<a @click="goToLog(record)" v-permission="'已散团_查看日志'">查看日志</a>
						<a @click="getPrint(record)" v-permission="'已散团_打印'">打印</a>
					</div>
				</template>
			</template>
		</CommonTable>
		<CommonPagination
			:current="travelStore.takeGroupList.cancellation.params.pageNo"
			:page-size="travelStore.takeGroupList.cancellation.params.pageSize"
			:total="state.total"
			@change="onHandleCurrentChange"
			@showSizeChange="pageSideChange"
		/>
	</div>
</template>
<script lang="ts" setup>
	import CommonTable from '@/components/common/CommonTable.vue';
  import CommonPagination from '@/components/common/CommonPagination.vue';
  import { message } from 'ant-design-vue';

	import api from '@/api/index';

	import { useTravelStore } from '@/stores/modules/travelManagement';
	import { GroupMode, TakeGroupStatus } from '@/enum'
	import travelDetail from '../travelDetail.vue';
	const travelStore = useTravelStore();
	const router = useRouter()
	const travelDetailRef = ref()
	const state = reactive({
		total:  computed(() => travelStore.takeGroupList.cancellation.total),
		params: {
			pageNo: 1,
			pageSize: 10,
			status: 1
		},
		tableData: computed(() => travelStore.takeGroupList.cancellation.list),
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
			}
		]
	})
	const onSearch = async () => {
		travelStore.takeGroupList.cancellation.params.status = TakeGroupStatus.Cancellation
		const res = await travelStore.getTravelList(travelStore.takeGroupList.cancellation.params);
		travelStore.setTakeGroupList(res, 'cancellation')
	}
	const onHandleCurrentChange = (e:any) => {
		travelStore.takeGroupList.cancellation.params.pageNo = e
		onSearch()
	}
	const pageSideChange = () => {

	}
	const getPrint = (record: any) => {
	
		travelDetailRef.value.getPrint(record.oid)
	}
	const goToDetail = (row: any) => {
		router.push({
      path: '/travel/take_group/take_group_travel_detail',
      query: { oid: encodeURIComponent(row.oid) }
    });
	}
  const goToLog = (row: any) => {
    router.push({
      path: '/travel/travel_manage/travel_log',
      query: { oid: encodeURIComponent(row.oid) },
    });
  };
	onSearch()
</script>

<style scoped>
.print-container {
	position: absolute;
	top: 100px;
	width: 100%;
}
</style>