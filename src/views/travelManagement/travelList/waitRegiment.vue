<template>
	<div>
		<CommonTable :dataSource="state.tableData" :columns="state.columns" rowKey="oid">
			<template #bodyCell="{ column, text, index, record }">
				<template v-if="column.key === 'index'">
					<div>
							{{(travelStore.traveList.waitRegiment.params.pageNo - 1) * (travelStore.traveList.waitRegiment.params.pageSize) + (index + 1)}}
					</div>
				</template>

				<template v-if="column.key === 'groupTypeStr'">
						{{text}}
				</template>

				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a @click="revokeGroupToDraft(record.oid)" v-permission="'待审核_撤回任务'">撤回任务</a>
						<a @click="goToPath(record)" v-permission="'待审核_查看行程'">查看行程</a>
						<!-- <a v-permission="'待审核_催办'">催办</a> -->
					</div>
				</template>
			</template>
		</CommonTable>
		<CommonPagination
			:current="travelStore.traveList.waitRegiment.params.pageNo"
			:page-size="travelStore.traveList.waitRegiment.params.pageSize"
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
	import { message } from 'ant-design-vue';
	import { cloneDeep } from 'lodash-es';

	const router = useRouter()
	const travelStore = useTravelStore();
	const state = reactive({
		total: computed(() => travelStore.traveList.waitRegiment.total),
		params: {
				pageNo: 1,
				pageSize: 10,
				status: 1
		},
		tableData:  computed(() => travelStore.traveList.waitRegiment.list),
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
					title: '行程时间',
					dataIndex: 'time',
					key: 'time',
			},
			{
					title: '团队类型',
					dataIndex: 'teamTypeName',
					key: 'teamTypeName',
			},
			// {
			// 		title: '审核来源',
			// 		dataIndex: 'teamTypeName1',
			// 		key: 'teamTypeName1',
			// },
			// {
			// 		title: '当前审核人员',
			// 		dataIndex: 'teamTypeName1',
			// 		key: 'teamTypeName1',
			// },
			// {
			// 		title: '带队导游',
			// 		dataIndex: 'guides',
			// 		key: 'guides',
			// },
			// {
			// 		title: '团客人数',
			// 		dataIndex: 'touristCount',
			// 		key: 'touristCount',
			// },
			{
					title: '操作',
					key: 'action',
					width: 200
			}
		]
	})
	const onSearch = async () => {
		// const res = await travelStore.getTravelList({pageNo: 1, pageSize: 10, status: GroupStatus.WaitRegiment});
		// state.tableData = res.content
		// state.total = res.total;
		let params: any = {};
		travelStore.traveList.waitRegiment.params.status = GroupStatus.WaitRegiment
		params = cloneDeep(travelStore.traveList.waitRegiment.params)
		params.groupType = travelStore.traveList.waitRegiment.params.groupType === '0' ? '' : 
		travelStore.traveList.waitRegiment.params.groupType;
		const res = await travelStore.getTravelList(params);

		travelStore.setTraveList(res, 'waitRegiment')
	}

	const revokeGroupToDraft = async (id:number) => {
		// console.log(id)
		await api.travelManagement.revokeGroupToDraft(id);
		onSearch()
		message.success('撤回成功')
	}

	const goToPath = (row: any) => {
		router.push({
			path: '/travel/travel_manage/travel_detail',
			query: {
				oid: row.oid
			}
		})
	}

	const onHandleCurrentChange = (e:any) => {
		travelStore.traveList.waitRegiment.params.pageNo = e
		onSearch()
	}
	const pageSideChange = () => {

	}
	const onSelect = (record: any, selected: boolean, selectedRows: any[]) => {
		console.log(record, selected, selectedRows);
	}
	onSearch()
</script>