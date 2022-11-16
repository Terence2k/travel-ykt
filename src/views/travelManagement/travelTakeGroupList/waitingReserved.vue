<template>
	<div>
		<CommonTable :row-selection="{ onSelect }" :dataSource="state.tableData" :columns="state.columns" rowKey="oid">
			<template #button> </template>
			<template #bodyCell="{ column, text, index, record }">
				<template v-if="column.key === 'index'">
					<div>
						{{ (state.params.pageNo - 1) * state.params.pageSize + (index + 1) }}
					</div>
				</template>

				<template v-if="column.key === 'groupTypeStr'">
					{{ text }}
				</template>

				<template v-if="column.key === 'action'">
					<div class="action-btns">
						<a @click="goToPath(record)">进入预订</a>
						<a @click="goToChange(record)">行程变更</a>
					</div>
				</template>
			</template>
		</CommonTable>
		<BaseModal title="选择可变更项目" v-model="modelValue" :width="500">
			<div class="model-div">
				<a-button type="primary" style="width:120px" @click="changeMission">修改出团信息</a-button>
				<p>包括导游、交通信息、附件内容，散团前均可修改</p>
			</div>
			<div class="model-div">
				<a-button type="primary" style="width:120px">修改预订产品</a-button>
				<p>包括行程时间、景区、酒店、餐饮等，未核销时可修改</p>
			</div>
			<div class="model-div">
				<a-button type="primary" style="width:120px" @click="addTourist">添加游客</a-button>
				<p>如有新增游客，可发起一条新行程单的填报</p>
			</div>
			<div class="model-div">
				<a-button type="primary" style="width:120px" @click="revoke">撤销并重提</a-button>
				<p>如需删除、修改游客，未核销时可撤销原行程单，重新填报</p>
			</div>
			<template v-slot:footer>
				<a-button @click="modelValue=false">取消</a-button>
			</template>
		</BaseModal>
		<CommonPagination
			:current="travelStore.takeGroupList.waitingReserved.params.pageNo"
			:page-size="travelStore.takeGroupList.waitingReserved.params.pageSize"
			:total="state.total"
			@change="onHandleCurrentChange"
			@showSizeChange="pageSideChange"
		/>
	</div>
</template>
<script lang="ts" setup>
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import BaseModal from '@/components/common/BaseModal.vue';
import { useTravelStore } from '@/stores/modules/travelManagement';
import { GroupMode, TakeGroupStatus } from '@/enum';
import api from '@/api';
import { AnyCnameRecord } from 'dns';
import { message } from 'ant-design-vue';
const travelStore = useTravelStore();
const router = useRouter();
const modelValue = ref(false);
const state = reactive({
	total: computed(() => travelStore.takeGroupList.waitingReserved.total),
	params: {
		pageNo: 1,
		pageSize: 10,
		status: 1,
	},
	id: '',
	itineraryNo: '',
	tableData: computed(() => travelStore.takeGroupList.waitingReserved.list),
	columns: [
		{
			title: ' 序号 ',
			key: 'index',
			width: '80px',
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
		},
	],
});
const onSearch = async () => {
	travelStore.takeGroupList.waitingReserved.params.status = TakeGroupStatus.WaitingReserved;
	const res = await travelStore.getTravelList(travelStore.takeGroupList.waitingReserved.params);
	travelStore.setTakeGroupList(res, 'waitingReserved');
};
const onHandleCurrentChange = () => {};
const pageSideChange = () => {};
const goToPath = (row: any) => {
	router.push({
		path: '/travel/travel_manage/add_travel',
		query: {
			id: row.oid,
			itineraryNo: row.itineraryNo,
		},
	});
};
const addTourist = () => {
		router.push({
			path: '/travel/take_group/addTourist',
			query: {
				id: state.id,
				itineraryNo: state.itineraryNo,
			},
		});
	};
	const revoke = () => {
		router.push({
			path: '/travel/take_group/revoke',
			query: {
				id: state.id,
				itineraryNo: state.itineraryNo,
			},
		});
	};
const changeMission = () => {
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
			modelValue.value = true;
		}else{
			message.error('该行程单发生过核销不可变更')
		}
	});
};
const onSelect = (record: any, selected: boolean, selectedRows: any[]) => {
	console.log(record, selected, selectedRows);
};
onSearch();
</script>
<style lang="less" scoped>
	.model-div
	{
		text-align: center;
		margin-bottom: 30px;
	}
	.model-div>p{
		color: rgb(225, 225, 225);
		margin-top: 10px;
	}
</style>
