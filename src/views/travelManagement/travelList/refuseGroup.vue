<template>
	<div>
		<CommonTable :row-selection="{onSelect}" :dataSource="state.tableData" :columns="state.columns" rowKey="oid">
		<template #button>
		</template>
		<template #bodyCell="{ column, text, index }">
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
				<a>撤为草稿</a>
			</div>
		</template>
				</template>
		</CommonTable>
		<CommonPagination
			:current="state.params.pageNo"
			:page-size="state.params.pageSize"
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
	const state = reactive({
		total: computed(() => travelStore.traveList.refuseGroup.list),
		params: {
				pageNo: 1,
				pageSize: 10,
				status: 1
		},
		tableData: computed(() => travelStore.traveList.refuseGroup.list),
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
					title: '团队类型',
					dataIndex: 'groupTypeStr',
					key: 'groupTypeStr',
			},
			{
					title: '团客人数',
					dataIndex: 'touristCount',
					key: 'touristCount',
			},
			{
					title: '任务状态',
					dataIndex: 'touristCount',
					key: 'touristCount',
			},
			{
					title: '拒绝/逾期时间',
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
		travelStore.traveList.refuseGroup.params.status = GroupStatus.RefuseGroup
		const res = await travelStore.getTravelList(travelStore.traveList.refuseGroup.params);
		
		travelStore.setTraveList(res, 'refuseGroup')
	}
	const onHandleCurrentChange = () => {

	}
	const pageSideChange = () => {

	}
	const onSelect = (record: any, selected: boolean, selectedRows: any[]) => {
		console.log(record, selected, selectedRows);
	}
	onSearch()
</script>