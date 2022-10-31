<template>
  <div>
	
		<CommonTable :row-selection="{onSelect}" :dataSource="state.tableData" :columns="state.columns" rowKey="oid">
      <template #button>
      </template>
      <template #bodyCell="{ column, text, index,record }">
        <!-- <template v-if="column.key === 'itineraryNo'">
          <div>
            <a @click="goToDetail(record)">{{text}}</a>
          </div>
        </template> -->
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
            <a @click="goToPath(record)">编辑</a>
            <a>邀请地接社编辑</a>
            <a @click="sendGroup(record.oid)">发团</a>
          </div>
        </template>
			</template>
		</CommonTable>
		<CommonPagination
			:current="travelStore.traveList.drafts.params.pageNo"
			:page-size="travelStore.traveList.drafts.params.pageSize"
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
	import { GroupMode, GroupStatus } from '@/enum'

	const travelStore = useTravelStore();
	const router = useRouter()
	const state = reactive({
		total:  computed(() => travelStore.traveList.drafts.total),
		params: {
			pageNo: 1,
			pageSize: 10,
			status: 1
		},
		tableData: computed(() => travelStore.traveList.drafts.list),
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
		travelStore.traveList.drafts.params.status = GroupStatus.Drafts
		const res = await travelStore.getTravelList(travelStore.traveList.drafts.params);

		travelStore.setTraveList(res, 'drafts')
	}
	const onHandleCurrentChange = (e:any) => {
		travelStore.traveList.drafts.params.pageNo = e
		onSearch()
	}
	const pageSideChange = () => {

	}
	const goToPath = (row: any) => {
		router.push({
			path: '/travel/travel_manage/add_travel',
			query: {
				id: row.oid,
				itineraryNo: row.itineraryNo
			}
		})
	}

  const sendGroup = (id: string) => {
    const formData = new FormData();
    formData.append('itineraryId', id);
    api.travelManagement.sendGroup(formData).then((res: any) => {
      message.success('发团成功');
    })
  }

  // 跳转行程单详情
  // const goToDetail = (val: any) => {
  //   localStorage.setItem('tempData', JSON.stringify(val));
  //   router.push({
  //     name: 'travel_detail',
  //     params: {
  //       detailInfo: JSON.stringify(val)
  //     }
  //   })
  // }

	const onSelect = (record: any, selected: boolean, selectedRows: any[]) => {
			console.log(record, selected, selectedRows);
	}
	onSearch()
</script>