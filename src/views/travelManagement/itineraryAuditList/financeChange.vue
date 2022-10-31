<template>
	<div>
		<CommonTable :dataSource="state.tableData" :columns="state.columns">
		<template #button>
		</template>
		<template #bodyCell="{ column, text, index }">
			<template v-if="column.key === 'index'">
				<div>
						{{(state.params.pageNo - 1) * (state.params.pageSize) + (index + 1)}}
				</div>
		</template>

		<template v-if="column.key === 'action'">
			<div class="action-btns">
				<a>去审核</a>
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
	import { AuditStaus } from '@/enum'

	const travelStore = useTravelStore();
	const state = reactive({
		total: 0,
		params: {
				pageNo: 1,
				pageSize: 10,
				status: 1
		},
		tableData: [],
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
					title: '发团计调',
					dataIndex: 'travelOperatorName',
					key: 'travelOperatorName',
			},
			{
					title: '团客人数',
					dataIndex: 'touristCount',
					key: 'touristCount',
			},
			{
					title: '预冻结金额',
					dataIndex: 'totalFee',
					key: 'totalFee',
			},
			{
					title: '操作',
					fixed: 'right',
					key: 'action',
			}
		]
	})
	const onSearch = async () => {
		const res = await travelStore.getAuditList({pageNo: 1, pageSize: 10, status: AuditStaus.FinanceChange});
		state.tableData = res.content
		state.total = res.total;
	}
	const onHandleCurrentChange = () => {

	}
	const pageSideChange = () => {

	}
	onSearch()
</script>