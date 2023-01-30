<template>
	<div>
		<CommonTable :dataSource="state.tableData" :columns="state.columns" rowKey="oid">
			<template #bodyCell="{ column, text, index, record }">
				<template v-if="column.key === 'index'">
					<div>
							{{(travelStore.traveList.overtime.params.pageNo - 1) * (travelStore.traveList.overtime.params.pageSize) + (index + 1)}}
					</div>
				</template>

				<template v-if="column.key === 'groupTypeStr'">
						{{text}}
				</template>

				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a @click="revokeGroupToDraft(record.oid)" v-permission="'已过期_置为草稿'">置为草稿</a>
						<a @click="goToLog(record)" v-permission="'已过期_查看日志'">查看日志</a>
						<a @click="goToPath(record)" v-permission="'已过期_查看行程'">查看行程</a>
					</div>
				</template>
			</template>
		</CommonTable>
		<CommonPagination
			:current="travelStore.traveList.overtime.params.pageNo"
			:page-size="travelStore.traveList.overtime.params.pageSize"
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
	import { cloneDeep } from 'lodash';

	const travelStore = useTravelStore();
	const router = useRouter()
	const state = reactive({
		total: computed(() => travelStore.traveList.overtime.total),
		params: {
				pageNo: 1,
				pageSize: 10,
				status: 1
		},
		tableData: computed(() => travelStore.traveList.overtime.list),
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
					title: '原定行程时间',
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
					title: '过期原因',
					dataIndex: 'touristCount1',
					key: 'touristCount1',
			},
			{
					title: '操作',
					fixed: 'right',
					key: 'action',
			}
		]
	})
	const onSearch = async () => {
		let params: any = {};
		travelStore.traveList.overtime.params.status = GroupStatus.Overtime
		params = cloneDeep(travelStore.traveList.overtime.params)
		params.groupType = travelStore.traveList.overtime.params.groupType === '0' ? '' : 
		travelStore.traveList.overtime.params.groupType;
		
		const res = await travelStore.getTravelList(params);
		
		travelStore.setTraveList(res, 'overtime')
	}
	const revokeGroupToDraft = async (id:number) => {
		await api.travelManagement.revokeGroupToDraft(id);
		onSearch()
		message.success('操作成功')
	}
  const goToLog = (row: any) => {
    router.push({
      path: '/travel/travel_manage/travel_log',
      query: { oid: encodeURIComponent(row.oid) },
    });
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
		travelStore.traveList.overtime.params.pageNo = e
		onSearch()
	}
	const pageSideChange = () => {

	}
	const onSelect = (record: any, selected: boolean, selectedRows: any[]) => {
		console.log(record, selected, selectedRows);
	}
	onSearch()
</script>