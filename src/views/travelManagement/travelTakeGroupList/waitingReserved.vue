<template>
	<div>
		<CommonTable :row-selection="{onSelect}" :dataSource="state.tableData" :columns="state.columns" rowKey="oid">
		<template #button>
		</template>
		<template #bodyCell="{ column, text, index, record }">
			<template v-if="column.key === 'index'">
				<div>
						{{(state.params.pageNo - 1) * (state.params.pageSize) + (index + 1)}}
				</div>
		</template>

		<template v-if="column.key === 'groupTypeStr'">
				{{text}}
		</template>

		<template v-if="column.key === 'action'">
			<div class="action-btns">
        <a @click="goToPath(record)">进入预订</a>
        <a @click="goToPath(record)">行程变更</a>
			</div>
		</template>
				</template>
		</CommonTable>
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
	import CommonPagination from '@/components/common/CommonPagination.vue';

	import { useTravelStore } from '@/stores/modules/travelManagement';
	import { GroupMode, TakeGroupStatus } from '@/enum'

	const travelStore = useTravelStore();
	const router = useRouter()
	const state = reactive({
		total: computed(() => travelStore.takeGroupList.waitingReserved.total),
		params: {
				pageNo: 1,
				pageSize: 10,
				status: 1
		},
		tableData: computed(() => travelStore.takeGroupList.waitingReserved.list),
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
					dataIndex: 'groupTypeStr',
					key: 'groupTypeStr',
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
		travelStore.takeGroupList.waitingReserved.params.status = TakeGroupStatus.WaitingReserved
		const res = await travelStore.getTravelList(travelStore.takeGroupList.waitingReserved.params);
		travelStore.setTakeGroupList(res, 'waitingReserved')
	}
	const onHandleCurrentChange = () => {

	}
	const pageSideChange = () => {

	}
	const goToPath = (row: any) => {
		router.push({
			path: '/travel/take_group/changetravel',
			query: {
				id: row.oid,
				itineraryNo: row.itineraryNo
			}
		})
	}
  const onSelect = (record: any, selected: boolean, selectedRows: any[]) => {
    console.log(record, selected, selectedRows);
  }
	onSearch()
</script>