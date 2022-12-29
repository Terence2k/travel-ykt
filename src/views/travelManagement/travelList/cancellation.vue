<template>
	<div>
		<CommonTable :dataSource="state.tableData" :columns="state.columns" rowKey="oid">
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
				<a @click="goToPath(record)" v-permission="'已散团_行程详情'">行程详情</a>
				<a v-permission="'已散团_查看日志'">查看日志</a>
			</div>
		</template>
				</template>
		</CommonTable>
		<CommonPagination
			:current="travelStore.traveList.cancellation.params.pageNo"
			:page-size="travelStore.traveList.cancellation.params.pageSize"
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

	import { useTravelStore } from '@/stores/modules/travelManagement';
	import { GroupMode, GroupStatus } from '@/enum'

	const travelStore = useTravelStore();
	const router = useRouter()
	const state = reactive({
		total: computed(() => travelStore.traveList.cancellation.total),
		params: {
				pageNo: 1,
				pageSize: 10,
				status: 1
		},
		tableData: computed(() => travelStore.traveList.cancellation.list),
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
					title: '团队类型',
					dataIndex: 'teamTypeName',
					key: 'teamTypeName',
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
			// {
			// 		title: '原定行程时间',
			// 		dataIndex: 'time',
			// 		key: 'time',
			// },
			
			{
					title: '团客人数',
					dataIndex: 'touristCount',
					key: 'touristCount',
			},
			{
					title: '散团时间',
					dataIndex: 'endDate',
					key: 'endDate',
			},
			{
					title: '操作',
					fixed: 'right',
					key: 'action',
			}
		]
	})
	const onSearch = async () => {
		travelStore.traveList.cancellation.params.status = GroupStatus.Cancellation
		const res = await travelStore.getTravelList(travelStore.traveList.cancellation.params);
		
		travelStore.setTraveList(res, 'cancellation')
	}
	const onHandleCurrentChange = (e:any) => {
		travelStore.traveList.cancellation.params.pageNo = e
		onSearch()
	}
	const pageSideChange = () => {

	}
	const onSelect = (record: any, selected: boolean, selectedRows: any[]) => {
		console.log(record, selected, selectedRows);
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
				oid: encodeURIComponent(row.oid) 
			} 
		});
	}
	onSearch()
</script>