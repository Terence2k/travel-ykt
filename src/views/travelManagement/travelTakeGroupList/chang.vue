<template>
	<div class="trave-contaner">
		<a-tabs v-model:activeKey="activeKey" @change="changeTab">
			<a-tab-pane v-for="(item, index) in pages" :key="index" :tab="item.label">
				<component :onCheck="check" :is="item.name"></component>
			</a-tab-pane>
		</a-tabs>
		<div class="footer d-flex justify-content-between">
			<div class="footer-btn">
				<a-button type="primary" @click="saveOrder">保存修改</a-button>
				<a-button type="primary" @click="activeKey = activeKey + 1" v-if="activeKey<2">下一步</a-button>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
// import baseInfo from './baseInfo/baseInfo.vue';
import guideInfo from './guideInfo/guideInfo.vue';
// import touristInfo from './touristInfo/touristInfo.vue';
// import traveInfo from './traveInfo/traveInfo.vue';
import trafficInfo from './trafficInfo/trafficInfo.vue';
import fileInfo from './fileInfo/fileInfo.vue';
import { cloneDeep, debounce } from 'lodash';
import api from '@/api';
import { message } from 'ant-design-vue';
import { useTravelStore } from '@/stores/modules/travelManagementDetail';
import dayjs, { Dayjs } from 'dayjs';
import { getAmount } from '@/utils';
const route = useRoute();
const router = useRouter();
const travelStore = useTravelStore();
const activeKey = ref(0);
const check = ref(false); //触发保存
const pages = [
	// {
	// 	name: baseInfo,
	// 	label: '基本信息管理',
	// },
	{
		name: guideInfo,
		label: '导游信息',
	},
	// {
	// 	name: touristInfo,
	// 	label: '游客信息',
	// },
	{
		name: trafficInfo,
		label: '交通信息',
	},
	// {
	// 	name: traveInfo,
	// 	label: '行程信息',
	// },
	{
		name: fileInfo,
		label: '附件上传',
	}
];
let rulesPass = reactive<{ [k: string]: any }>([]);
let obj = reactive({
	data: {},
});

const saveOrder = () => {
	let guideData=[].concat.call(travelStore.delGuideList, travelStore.guideList);
	guideData = guideData.filter((item: any) => item.edit == true);
	let transportData=[].concat.call(travelStore.delTrafficList, travelStore.trafficList)
	transportData = transportData.filter((item: any) => item.edit == true);
  let queryData = {
    oid: travelStore.baseInfo.oid,
    attachmentList: travelStore.attachmentList,
    guideList: guideData,
    transportList: transportData
   };
	api.travelManagement.changeItineraryBasic(queryData)
		.then((res: any) => {
      console.log('保存修改：', res);
      router.go(-1)
      message.success('变更成功')
		});
}
const getTraveDetail = () => {
	api.travelManagement
		.changDetail({
			oid: route.query.id,
			pageNo: 1,
			pageSize: 100000,
		})
		.then((res: any) => {
			travelStore.setBaseInfo(res.basic);
			travelStore.setGuideList(res.guideList);
			res.attachmentList.length && travelStore.setFileInfo(res.attachmentList);
			res.transportList = res.transportList.map((it: any) => {
				it.time = [it.startDate, it.endDate];
				return it;
			});
			travelStore.setTrafficList(res.transportList);
			let dis = null;
			if (res.basic) {
				dis = (current: Dayjs) => {
					return (
						(dayjs(res.basic.startDate) && dayjs(res.basic.startDate) > current && current) ||
						(dayjs(res.basic.endDate) && dayjs(res.basic.endDate).add(1, 'day') < current && current)
					);
				};
			}
				travelStore.setDisabled = dis as any;
			
		});
};
const changeTab = (event: number) => {
	// sendTeam.value = false;
	// if (event === 4) {
	// 	const allFeesProducts =  travelStore.compositeProducts.map((it:any) => {
	// 		it.peopleCount = travelStore.touristList.length;
	// 		it.unPrice = it.feeNumber;
	// 		it.isDay = true;
	// 		it.dayCount = dayjs(travelStore.baseInfo.endDate).diff(travelStore.baseInfo.startDate, 'day')
	// 		it.totalMoney = getAmount(
	// 			it.confirmDailyCharge,
	// 			it.feeNumber,
	// 			it.feeModel
	// 		)
	// 		return it;
	// 	})
	// 	travelStore.setCompositeProducts(allFeesProducts);
	// 	isSaveBtn.value = false
	// 	check.value = !check.value;
	// }
};

getTraveDetail();
</script>
<style lang="less" scoped>
.trave-contaner {
	height: 100%;
	::v-deep(.ant-tabs-nav) {
		padding: 0 20px;
	}
	::v-deep(.ant-tabs-tab) {
		padding: 16px 0;
	}
	// ::v-deep(.ant-tabs-content-holder) {
	//   padding: 0 20px;
	// }
}
.submit-btn {
	width: 90px;
	height: 90px;
	background: linear-gradient(143deg, #40f3cb 0%, #36b374 100%);
	box-shadow: 2px 6px 20px rgba(54, 179, 116, 0.34);
	border-radius: 50%;
	text-align: center;
	line-height: 90px;
	color: #fff;
	font-size: 16px;
	position: relative;
	top: -48px;
	right: 20px;
	cursor: pointer;
}

.footer {
	margin-top: 100px;
	position: sticky;
	bottom: 0;
	line-height: 64px;
	width: 100%;
	border-top: 1px solid #f1f2f5;
	background-color: #fff;
	padding-left: 16px;
	z-index: 99;
	button:first-of-type {
		margin-right: 16px;
	}
}
</style>
