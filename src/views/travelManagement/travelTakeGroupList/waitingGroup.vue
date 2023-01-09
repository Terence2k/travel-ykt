<template>
	<div>
		<CommonTable :dataSource="state.tableData" :columns="state.columns" rowKey="oid">
		<template #button>
		</template>
		<template #bodyCell="{ column, text, index, record }">
      <template v-if="column.key === 'itineraryNo'">
        <div>
          <a @click="goToDetail(record)">{{text}}</a>
        </div>
      </template>
			<template v-if="column.key === 'index'">
				<div>
						{{(travelStore.takeGroupList.waitingGroup.params.pageNo - 1) * (travelStore.takeGroupList.waitingGroup.params.pageSize) + (index + 1)}}
				</div>
		</template>

		<template v-if="column.key === 'action'">
			<div class="action-btns">
				<a @click="takeGroup(record.oid)" v-permission="'待接团_同意接团'">同意接团</a>
				<a @click="rejectGroup(record.oid)" v-permission="'待接团_拒绝接团'">拒绝接团</a>
			</div>
		</template>
				</template>
		</CommonTable>
		<CommonPagination
			:current="travelStore.takeGroupList.waitingGroup.params.pageNo"
			:page-size="travelStore.takeGroupList.waitingGroup.params.pageSize"
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
	import api from '@/api/index';
  import { message } from 'ant-design-vue';


	const travelStore = useTravelStore();
	const router = useRouter()
	const state = reactive({
		total: computed(() => travelStore.takeGroupList.waitingGroup.total),
		params: {
				pageNo: 1,
				pageSize: 10,
				status: 1
		},
		tableData: computed(() => travelStore.takeGroupList.waitingGroup.list),
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
		travelStore.takeGroupList.waitingGroup.params.status = TakeGroupStatus.WaitingGroup
		const res = await travelStore.getTravelList(travelStore.takeGroupList.waitingGroup.params);
		travelStore.setTakeGroupList(res, 'waitingGroup')
	}
  const takeGroup = (id: string) => {
    api.travelManagement.takeGroup(id).then((res: any) => {
      onSearch()
      message.success('接团成功');
    })
  }
  const rejectGroup = (id: string) => {
    api.travelManagement.rejectGroup(id).then((res: any) => {
      onSearch()
      message.success('已拒绝接团');
    })
  }
	const onHandleCurrentChange = (e: any) => {
		travelStore.takeGroupList.waitingGroup.params.pageNo = e
		onSearch()
  };
	const pageSideChange = () => {

	}
	const goToDetail = (row: any) => {
		router.push({
      path: '/travel/travel_manage/travel_detail',
      query: { oid: encodeURIComponent(row.oid) }
    });
	}
	onSearch()
</script>