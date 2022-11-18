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
				<a>查看结算明细</a>
			</div>
		</template>
				</template>
		</CommonTable>
		<CommonPagination
			:current="travelStore.traveList.closeAnAccount.params.pageNo"
			:page-size="travelStore.traveList.closeAnAccount.params.pageSize"
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
		total: computed(() => travelStore.traveList.closeAnAccount.total),
		params: {
				pageNo: 1,
				pageSize: 10,
				status: 1
		},
		tableData: computed(() => travelStore.traveList.closeAnAccount.list),
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
					dataIndex: 'groupTypeStr',
					key: 'groupTypeStr',
			},
			{
					title: '团客人数',
					dataIndex: 'touristCount',
					key: 'touristCount',
			},
			{
					title: '结算完成时间',
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
		travelStore.traveList.closeAnAccount.params.status = GroupStatus.CloseAnAccount
		const res = await travelStore.getTravelList(travelStore.traveList.closeAnAccount.params);
		
		travelStore.setTraveList(res, 'closeAnAccount')
	}
	const onHandleCurrentChange = (e:any) => {
		travelStore.traveList.closeAnAccount.params.pageNo = e
		onSearch()
	}
	const pageSideChange = () => {

	}
	const onSelect = (record: any, selected: boolean, selectedRows: any[]) => {
		console.log(record, selected, selectedRows);
	}
	onSearch()
</script>