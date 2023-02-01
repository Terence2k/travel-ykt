<template>
  <div>
	
	<CommonTable :dataSource="state.tableData" :columns="state.columns" rowKey="oid">

		<template #bodyCell="{ column, text, index,record }">
			<!-- <template v-if="column.key === 'itineraryNo'">
			<div>
				<a @click="goToDetail(record)">{{text}}</a>
			</div>
			</template> -->
			<template v-if="column.key === 'index'">
				<div>
					{{(travelStore.traveList.drafts.params.pageNo - 1) * (travelStore.traveList.drafts.params.pageSize) + (index + 1)}}
				</div>
			</template>

			<template v-if="column.key === 'groupTypeStr'">
				{{text}}
			</template>

			<template v-if="column.key === 'action'">
				<div class="action-btns">
					<a @click="goToPath(record)" v-permission="'草稿_编辑'">编辑</a>
					<!-- <a v-if="record.groupType == GroupMode.TeamGroup" v-permission="'草稿_邀请地接社编辑'">邀请地接社编辑</a> -->
					<a @click="sendGroup(record)" v-permission="'草稿_发团'">发团</a>
					<a-popconfirm
						title="确定删除该行程单？"
						ok-text="是"
						cancel-text="否"
						@confirm="deleteTrave(record.oid)"
					>
						<a v-permission="'草稿_删除'">删除</a>
					</a-popconfirm>
					
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
	import { message, Modal } from 'ant-design-vue';

	import api from '@/api/index';

	import { useTravelStore } from '@/stores/modules/travelManagement';
	import { GroupMode, GroupStatus } from '@/enum'
	import { copy } from '@/utils';
	import { cloneDeep } from 'lodash';
	import { accDiv } from '@/utils/compute';
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
				width: 200
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
				title: '填报模式',
				dataIndex: 'groupTypeName',
				key: 'groupTypeName',
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
				title: '草稿编辑状态',
				dataIndex: 'childStatusName',
				key: 'childStatusName',
			},
			{
				title: '操作',
				fixed: 'right',
				key: 'action',
				width: 250
			}
		]
	})
	const onSearch = async () => {
		let params: any = {};
		travelStore.traveList.drafts.params.status = GroupStatus.Drafts
		params = cloneDeep(travelStore.traveList.drafts.params)
		params.groupType = travelStore.traveList.drafts.params.groupType === '0' ? '' : 
		travelStore.traveList.drafts.params.groupType;
		
		const res = await travelStore.getTravelList(params);

		travelStore.setTraveList(res, 'drafts')
	}
	const onHandleCurrentChange = (e:any) => {
		travelStore.traveList.drafts.params.pageNo = e
		onSearch()
	}
	const deleteTrave = (id: number) => {
		api.travelManagement.deleteTrave(id).then((res: any) => {
			onSearch()
			message.success('删除成功')
		})
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

  const sendGroup = (record: any) => {
    const formData = new FormData();
    formData.append('itineraryId', record.oid);
    api.travelManagement.sendGroup(formData).then((res: any) => {
		console.log(res)
		Modal.success({
			title: '发团成功',
			content: h('div', {}, [
				h('p', `已提交财务审核资金，预冻结费用：${accDiv(res, 100)}元，请耐心等待审核。本次行程单号: ${record.itineraryNo}，可复制后使用。`)
			]),
			closable: true,
			okText: '复制行程单号',
			onOk() {
				copy(record.itineraryNo)
			}
		});
		onSearch()
      	// message.success('发团成功');
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