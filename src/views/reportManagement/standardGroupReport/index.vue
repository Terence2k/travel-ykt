<template>
    <CommonSearch>
		<search-item label="报表名称">
			<a-select allowClear ref="select" v-model:value="state.reportId" style="width: 200px" placeholder="请选择报表名称">
				<a-select-option v-for="(item, index) in optionsList" :value="item.lable" :key="index"
					>{{ item.lable }}
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
            v-if="item.lable == state.reportId"
        ></component>
    </div>
</template>
<script setup lang="ts">
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import managementCenterGeneralReport from '../components/managementCenterGeneralReport/index.vue';
import managementCenterDetailsReport from '../components/managementCenterDetailsReport/index.vue';
import earthingGeneralReport from '../components/earthingGeneralReport/index.vue';
import earthingDetailsReport from '../components/earthingDetailsReport/index.vue';
import scenicSpotAccountReport from '../components/scenicSpotAccountReport/index.vue';
import scenicSpotSummaryReport from '../components/scenicSpotSummaryReport/index.vue';
import scenicSpotHotelReport from '../components/scenicSpotHotelReport/index.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import { watch } from 'vue';
import {
	StateType,
} from '.';
const navigatorBar = useNavigatorBar();
const optionsList:any = [
    {
        name: managementCenterGeneralReport,
        lable: '管理中心总账报表',
    },
    {
        name: managementCenterDetailsReport,
        lable: '管理中心明细账报表',
    },
    {
        name: earthingGeneralReport,
        lable: '地接总账报表',
    },
    {
        name: earthingDetailsReport,
        lable: '地接明细账报表',
    },
    {
        name: scenicSpotAccountReport,
        lable: '景点账目报表',
    },
    {
        name: scenicSpotSummaryReport,
        lable: '景点汇总报表',
    },
    {
        name: scenicSpotHotelReport,
        lable: '酒店账目报表',
    }
]
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
            navigatorBar.setNavigator(['报表管理', '标准团结算报表',state.reportId]);
        } else {
            navigatorBar.clearNavigator();
        }
    })
onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
});
</script>