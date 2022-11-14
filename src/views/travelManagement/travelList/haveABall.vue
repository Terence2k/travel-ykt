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
				<a @click="goToPath(record)">查看行程单</a>
				<a @click="goToChange(record)">行程变更</a>
			</div>
		</template>
				</template>
		</CommonTable>
		<BaseModal title="可变更项目提醒" v-model="modelValue" :width="400">
			<p>
				当前行程单已有订单发生过核销，当前只允许变更导游信息、交通信息、附件信息 ，不可变更行程信息。是否要继续变更？
				如线下游客发生了调整，可填报新行程。
			</p>
			<template v-slot:footer>
				<a-button type="primary">填报新行程</a-button>
				<a-button @click="continueChange()">继续变更</a-button>
			</template>
		</BaseModal>
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
	import BaseModal from '@/components/common/BaseModal.vue';

	import { useTravelStore } from '@/stores/modules/travelManagement';
	import { GroupMode, GroupStatus } from '@/enum'

	const travelStore = useTravelStore();
	const router = useRouter()
	const modelValue =ref(false)
	const state = reactive({
		total: computed(() => travelStore.traveList.haveABall.total),
		params: {
				pageNo: 1,
				pageSize: 10,
				status: 1
		},
		id:'',
		itineraryNo:'',
		tableData: computed(() => travelStore.traveList.haveABall.list),
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
					title: '出团时间',
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
		travelStore.traveList.haveABall.params.status = GroupStatus.HaveABall
		const res = await travelStore.getTravelList(travelStore.traveList.haveABall.params);
	
		travelStore.setTraveList(res, 'haveABall')
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
	const continueChange = () => {
	router.push({
		path: '/travel/take_group/changetravel',
		query: {
			id: state.id,
			itineraryNo: state.itineraryNo,
		},
	});
};
	const goToChange = (row: any) => {
	(state.id = row.oid), (state.itineraryNo = row.itineraryNo);
	api.travelManagement.checkVerifyByItineraryId(row.itineraryNo).then((res) => {
		if (res.data) {
			router.push({
				path: '/travel/take_group/changetravel',
				query: {
					id: row.oid,
					itineraryNo: row.itineraryNo,
				},
			});
		} else {
			modelValue.value = true;
		}
	});
};
	const onHandleCurrentChange = () => {

	}
	const pageSideChange = () => {

	}
	const onSelect = (record: any, selected: boolean, selectedRows: any[]) => {
		console.log(record, selected, selectedRows);
	}
	onSearch()
</script>