<template>
    <CommonSearch>
		<search-item label="报表名称">
			<a-select allowClear ref="select" v-model:value="state.reportId" style="width: 200px" placeholder="请选择报表名称">
				<a-select-option v-for="(item, index) in filterPages" :value="item.label" :key="index"
					>{{ item.label }}
				</a-select-option>
			</a-select>
		</search-item>
		<template #button>
			<!-- <a-button @click="reset" style="margin-right: 30px" >重置</a-button>
			<a-button @click="initList" >查询</a-button> -->
		</template>
	</CommonSearch>
    <div v-for="(item, index) in optionsList" :key="index">
        <component
            :is="item.name"
            v-if="item.label == state.reportId"
        ></component>
    </div>
</template>
<script setup lang="ts">
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import individualSettlementSummaryReport from '../components/individualSettlementSummaryReport/index.vue';
import individualSettlementDetailReport from '../components/individualSettlementDetailReport/index.vue';
import travelAgencyAndHotelReport from '../components/travelAgencyAndHotelReport/index.vue';
import travelAgencyAndScenicSpotReport from '../components/travelAgencyAndScenicSpotReport/index.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import { watch } from 'vue';
import {
	StateType,
} from '.';
import { getTabPermission } from '@/utils';

const navigatorBar = useNavigatorBar();
const optionsList:any = [
    {
        name: individualSettlementSummaryReport,
        label: '散客结算汇总报表',
    },
    {
        name: individualSettlementDetailReport,
        label: '散客结算明细报表',
    },
    {
        name: travelAgencyAndScenicSpotReport,
        label: '旅行社与景区对账报表',
    },
    {
        name: travelAgencyAndHotelReport,
        label: '旅行社与酒店对账报表',
    },
]
const filterPages = optionsList.filter((item: any) => getTabPermission(item.label));

const state = reactive<StateType>({
	reportId: null
});
const reset = () => {

}
const initList = () => {
    
}
watch(() => state.reportId,
    async (newVal) => {
        if (newVal) {
            navigatorBar.setNavigator(['报表管理', '散客团结算报表',state.reportId]);
        } else {
            navigatorBar.clearNavigator();
        }
    })
onBeforeUnmount(() => {
    navigatorBar.clearNavigator();
});
onMounted(() => {
    // 渲染列表第一个表格
    if(filterPages.length > 0) {
        state.reportId = filterPages[0].label
    }
})
</script>