<template>
	<div class="trave-contaner">
		<CommonSearch>
			<search-item label="组团社">
				<a-input v-model:value="params[activeKey].travelName" placeholder="输入组团社名称以查找" />
			</search-item>

            <search-item label="地接社">
				<a-input v-model:value="params[activeKey].subTravelName" placeholder="输入地接社名称以查找" />
			</search-item>

            <search-item label="行程编号">
				<a-input v-model:value="params[activeKey].itineraryNo" placeholder="输入行程单号以查找" />
			</search-item>

            <search-item label="线路名称">
				<a-input v-model:value="params[activeKey].routeName" placeholder="输入线路名称以查找" />
			</search-item>

            <search-item label="出团日期">
				<datePicker
					v-model="params[activeKey].time"
					type="datetimerange"
					popper-class="hidden-date-picker"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					value-format="YYYY-MM-DD HH:mm:ss"
				/>
			</search-item>

			<template #button>
				<a-button style="margin-right: 30px" @click="reset">重置</a-button>
				<a-button @click="onSearch">查询</a-button>
			</template>
		</CommonSearch>

		<a-tabs v-model:activeKey="activeKey">
			<a-tab-pane v-for="item, index in filterPages" :key="item.value" :tab="item.label">
				<component :index="index + 1" :item="item" :search="search" :queryParams="params[activeKey]" :activeKey="activeKey" :is="item.name"></component>
			</a-tab-pane>
		</a-tabs>
	</div>
</template>
<script lang="ts" setup>
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import pageList from './pageList.vue';
import { traveListParams, useTravelStore } from '@/stores/modules/travelManagement';
import { GroupStatus, GroupType, TravelCheckOne } from '@/enum';
import { getUserInfo, getTabPermission } from '@/utils/util';
import { ROLE } from '@/constant';
import { Field } from '@/type';
import { cloneDeep } from 'lodash';

const userInfo = getUserInfo();
const travelStore = useTravelStore();
const activeKey = ref(GroupStatus.Drafts);
const search = ref(false);
const queryParams = {
	time: [],
	startDate: '',
	endDate: '',
    routeName: '',
    subTravelName: '',
    travelName: ''
}
const params = reactive<any>({
	'1': {},
	'2': {},
	'3': {},
	'4': {},
	'5': {},
	'6': {},
	'7': {},
	'8': {},
	'9': {},
	'10': {},
});
const roleOne = [ROLE.CULTURE_BUREAU, ROLE.ANCIENT_UYGUR, ROLE.SUPERVISE, ROLE.ASSOCIATION]
let pages: any = [];

if (roleOne.includes(userInfo.sysCompany.businessType)) {
	for (let k in travelStore.travelCheckOne) {
		pages.push({
			name: pageList,
			label: travelStore.travelCheckOne[k],
			value: k,
			chart: 'drafts'
		})
	}
} else if (userInfo.sysCompany.businessType === ROLE.YKT) {
	for (let k in travelStore.travelCheckTwo) {
		pages.push({
			name: pageList,
			label: travelStore.travelCheckTwo[k],
			value: k,
			chart: 'drafts'
		})
	}
	
} else if (userInfo.sysCompany.businessType === ROLE.GROUP) {
	for (let k in travelStore.travelCheckThree) {
		pages.push({
			name: pageList,
			label: travelStore.travelCheckOne[k],
			value: k,
			chart: 'drafts'
		})
	}
	
}

const filterPages = pages.filter((item: any) => getTabPermission(item.label));
activeKey.value = filterPages.length ? filterPages[0].value : pages[0].value;


const chart = computed(() => pages.filter((it: any) => it.value === activeKey.value)[0].chart as Field);

//查询
const onSearch = async () => {
	if (params[activeKey.value].time?.length) {
		params[activeKey.value].startDate = params[activeKey.value].time[0];
		params[activeKey.value].endDate = params[activeKey.value].time[1];
	}
	search.value = !search.value
	
};
//重置
const reset = () => {
	params[activeKey.value] = cloneDeep(queryParams);
	onSearch();
};
watch(
	() => params.time,
	(newVal) => {
		if (newVal) {
			params.startDate = newVal[0];
			params.endDate = newVal[1];
		} else {
			params.startDate = '';
			params.endDate = '';
		}
	}
);
// travelStore.getItineraryStatus();

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
	.btn {
		margin-bottom: 20px;
	}
}
</style>
