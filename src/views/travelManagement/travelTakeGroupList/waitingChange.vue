<template>
  <div>
	
		<CommonTable :dataSource="state.tableData" :columns="state.columns" rowKey="oid">
      <template #button>
      </template>
      <template #bodyCell="{ column, text, index,record }">
        <template v-if="column.key === 'itineraryNo'">
          <div>
            <a @click="goToDetail(record)">{{text}}</a>
          </div>
        </template>
        <template v-if="column.key === 'index'">
					<div>
						{{(travelStore.takeGroupList.waitingChange.params.pageNo - 1) * (travelStore.takeGroupList.waitingChange.params.pageSize) + (index + 1)}}
					</div>
				</template>
        <template v-if="column.key === 'action'">
          <div class="action-btns">
            <!-- <a v-permission="'待变更_催促审核'">催促审核</a> -->
          </div>
        </template>
			</template>
		</CommonTable>
		<CommonPagination
			:current="travelStore.takeGroupList.waitingChange.params.pageNo"
			:page-size="travelStore.takeGroupList.waitingChange.params.pageSize"
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

	const travelStore = useTravelStore();
	const router = useRouter()
	const state = reactive({
		total:  computed(() => travelStore.takeGroupList.waitingChange.total),
		params: {
			pageNo: 1,
			pageSize: 10,
			status: 1
		},
		tableData: computed(() => travelStore.takeGroupList.waitingChange.list),
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
				title: '草稿编辑状态',
				dataIndex: 'childStatusName',
				key: 'childStatusName',
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
		travelStore.takeGroupList.waitingChange.params.status = TakeGroupStatus.WaitingChange
		const res = await travelStore.getTravelList(travelStore.takeGroupList.waitingChange.params);
		travelStore.setTakeGroupList(res, 'waitingChange')
	}
	const onHandleCurrentChange = (e:any) => {
		travelStore.takeGroupList.waitingChange.params.pageNo = e
		onSearch()
	}
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