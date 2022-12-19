<template>
	<div>
		<CommonTable :row-selection="{onSelect}" :dataSource="state.tableData" :columns="state.columns" rowKey="oid">
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
				<a @click="goToPath(record)" v-permission="'待处理_行程详情'">行程详情</a>
				<a @click="openAllReapply(record)" v-permission="'待处理_申请撤销'">申请撤销</a>
				<a v-permission="'待处理_查看日志'">查看日志</a>
			</div>
		</template>
				</template>
		</CommonTable>
		<CommonPagination
			:current="travelStore.traveList.waitingTask.params.pageNo"
			:page-size="travelStore.traveList.waitingTask.params.pageSize"
			:total="state.total"
			@change="onHandleCurrentChange"
			@showSizeChange="pageSideChange"
		/>
	</div>
	<allRevoke :itineraryId="itineraryId" ref="allRevokeRef" />
</template>
<script lang="ts" setup>
	import CommonTable from '@/components/common/CommonTable.vue';
	import CommonPagination from '@/components/common/CommonPagination.vue';
	import allRevoke from '@/views/travelManagement/travelTakeGroupList/revoke/components/allRevoke.vue';
	import api from '@/api/index';

	import { useTravelStore } from '@/stores/modules/travelManagement';
	import { GroupMode, GroupStatus } from '@/enum'
	import { message } from 'ant-design-vue';


	const travelStore = useTravelStore();
	const router = useRouter()
	const state = reactive({
		total: computed(() => travelStore.traveList.waitingTask.total),
		params: {
				pageNo: 1,
				pageSize: 10,
				status: 1
		},
		tableData: computed(() => travelStore.traveList.waitingTask.list),
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
					title: '带队导游',
					dataIndex: 'guides',
					key: 'guides',
			},
			{
					title: '团客人数',
					dataIndex: 'touristCount',
					key: 'touristCount',
			},
			// {
			// 		title: '已冻结金额',
			// 		dataIndex: 'touristCount1',
			// 		key: 'touristCount1',
			// },
			{
					title: '操作',
					fixed: 'right',
					key: 'action',
			}
		]
	})
	const onSearch = async () => {
		travelStore.traveList.waitingTask.params.status = GroupStatus.WaitingTask
		const res = await travelStore.getTravelList(travelStore.traveList.waitingTask.params);
		travelStore.setTraveList(res, 'waitingTask')
	}
	const onHandleCurrentChange = (e:any) => {
		travelStore.traveList.waitingTask.params.pageNo = e
		onSearch()
	}
	const pageSideChange = () => {

	}
	const onSelect = (record: any, selected: boolean, selectedRows: any[]) => {
		console.log(record, selected, selectedRows);
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
	onSearch()
	const checkPower = async (row: any) => {
		let pW = new FormData();

		pW.append('itineraryId', row.oid);

		await api.travelManagement.repealNreapplyPage(pW);

		return true;
	};
	const checkOutSideTicketIsRefund = async (row: any) => {
		let pW = new FormData();

		pW.append('itineraryId', row.oid);

		await api.travelManagement.checkOutSideTicketIsRefund(pW);

		return true;
	};
	//打开弹窗
	const allRevokeRef = ref();
	const itineraryId = ref();
	const openAllReapply = async (row: any) => {
		itineraryId.value = row.oid;
		try {
			await checkPower(row);
			await checkOutSideTicketIsRefund(row);
			allRevokeRef.value.open()
		} catch (error: any) {
			// message.error(error)
		}
		

	};
</script>