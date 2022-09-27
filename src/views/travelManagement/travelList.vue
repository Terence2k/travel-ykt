<template>
	<div class="trave-contaner">
		<CommonSearch>
			<search-item label="关键词搜索">
				<a-input v-model:value="params.keyWord" placeholder="请输入游客姓名、导游姓名、旅行社名称、线路名称等关键字"/>
			</search-item>

			<search-item label="组团模式">
				<a-select
					v-model:value="params.groupType">
					<a-select-option 
						v-for="(value, key) in travelStore.groupMode" 
						:key="key" 
						:value="key">{{value}}</a-select-option>
				</a-select>
			</search-item>

			<search-item label="行程时间">
				<a-range-picker
					v-model:value="params.time"
					show-time
					format="YYYY-MM-DD HH:mm"
					value-format="YYYY-MM-DD HH:mm"
				/>
			</search-item>

			<template #button>
				<a-button>查询</a-button>
			</template>
		</CommonSearch>

		<a-tabs v-model:activeKey="activeKey">
			<a-tab-pane 
				v-for="(item) in pages" 
				:key="item.value" 
				:tab="item.label">
				
        <div class="d-flex justify-content-end">
					<a-button @click="goToPath" type="primary" style="margin-right: 20px">+协作组团</a-button>
					<a-button @click="goToPath" type="primary" style="margin-right: 20px">+非协作组团</a-button>
				</div>
				<component :onCheck="check" :is="item.name"></component>
			</a-tab-pane>
		</a-tabs>
	</div>
</template>
<script lang="ts" setup>
	import CommonSearch from '@/components/common/CommonSearch.vue'
  import SearchItem from '@/components/common/CommonSearchItem.vue'
  import drafts from './travelList/drafts.vue';
  import waitingGroup from './travelList/waitingGroup.vue';
  import unpaid from './travelList/Unpiad.vue';
  import refuseGroup from './travelList/refuseGroup.vue';
	import waitRegiment from './travelList/waitregiment.vue';
	import haveABall from './travelList/haveABall.vue';
	import closeAnAccount from './travelList/closeAnAccount.vue';
	import waitingChange from './travelList/waitingChange.vue';
	import cancellation from './travelList/cancellation.vue';

	import { useTravelStore } from '@/stores/modules/travelManagement';
	import { GroupStatus } from '@/enum';

	import api from '@/api'

	const travelStore = useTravelStore();
	const router = useRouter()
	const activeKey = ref(GroupStatus.Drafts);
	const check = ref(false)
	const params = reactive({
		keyWord: '',
		groupType: '',
		time: [],
		startDate: '',
		endDate: ''
	})
	const pages = [
		{
			name: drafts,
			label: travelStore.groupStatus[GroupStatus.Drafts],
			value: GroupStatus.Drafts
		},
		{
			name: waitingGroup,
			label: travelStore.groupStatus[GroupStatus.WaitingGroup],
			value: GroupStatus.WaitingGroup
		},
		{
			name: unpaid,
			label: travelStore.groupStatus[GroupStatus.Unpaid],
			value: GroupStatus.Unpaid
		},
		{
			name: refuseGroup,
			label: travelStore.groupStatus[GroupStatus.RefuseGroup],
			value: GroupStatus.RefuseGroup
		},
		{
			name: waitRegiment,
			label: travelStore.groupStatus[GroupStatus.WaitRegiment],
			value: GroupStatus.WaitRegiment
		},
		{
			name: haveABall,
			label: travelStore.groupStatus[GroupStatus.HaveABall],
			value: GroupStatus.HaveABall
		},
		{
			name: closeAnAccount,
			label: travelStore.groupStatus[GroupStatus.CloseAnAccount],
			value: GroupStatus.CloseAnAccount
		},
		{
			name: waitingChange,
			label: travelStore.groupStatus[GroupStatus.WaitingChange],
			value: GroupStatus.WaitingChange
		},
		{
			name: cancellation,
			label: travelStore.groupStatus[GroupStatus.Cancellation],
			value: GroupStatus.Cancellation
		}
	]
	
	const goToPath = () => {
		router.push({
			path: '/travel/travel_manage/add_travel',
			query: {}
		})
	}
	watch(() => params.time, newVal => {
		if (newVal) {
			params.startDate = newVal[0];
			params.endDate = newVal[1];
		} else {
			params.startDate = '';
			params.endDate = '';
		}
	})
</script>
<style lang="less" scoped>
	.trave-contaner {
		height: 100%;
		::v-deep(.ant-tabs-nav) {
			padding: 0 20px;
		}
		// ::v-deep(.ant-tabs-content-holder) {
		//   padding: 0 20px;
		// }
		
	}
</style>