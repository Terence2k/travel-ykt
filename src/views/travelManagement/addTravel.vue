<template>
	<div class="trave-contaner">
		<a-tabs v-model:activeKey="activeKey">
			<a-tab-pane v-for="(item, index) in pages" :key="index" :tab="item.label">
				<component @onSuccess="save" :onCheck="check" :is="item.name"></component>
			</a-tab-pane>
		</a-tabs>
		<div class="footer">
			<a-button type="primary" @click="check = !check">保存</a-button>
			<a-button type="primary">发团</a-button>
		</div>
	</div>
</template>
<script lang="ts" setup>
import baseInfo from './baseInfo/baseInfo.vue';
import guideInfo from './guideInfo/guideInfo.vue';
import touristInfo from './touristInfo/touristInfo.vue';
import traveInfo from './traveInfo/traveInfo.vue';
import trafficInfo from './trafficInfo/trafficInfo.vue';
import fileInfo from './fileInfo/fileInfo.vue';
import { cloneDeep, debounce } from 'lodash';
import api from '@/api';
import { message } from 'ant-design-vue';
import { useTravelStore } from '@/stores/modules/travelManagement';
const route = useRoute();
const travelStore = useTravelStore();
const activeKey = ref(0);
const check = ref(false);
const pages = [
	{
		name: baseInfo,
		label: '基本信息管理',
	},
	{
		name: guideInfo,
		label: '导游信息',
	},
	{
		name: touristInfo,
		label: '游客信息',
	},
	{
		name: trafficInfo,
		label: '交通信息',
	},
	{
		name: traveInfo,
		label: '行程信息',
	},
	{
		name: fileInfo,
		label: '附件上传',
	},
];
let rulesPass = reactive<{ [k: string]: any }>([]);
let obj = reactive({
	data: {},
});
const save = (e: any) => {
	rulesPass.push(e);
	for (let i = 0; i < rulesPass.length; i++) {
		obj.data = cloneDeep({
			...obj.data,
			...rulesPass[i],
		});
	}
};
const debounceFun = debounce((val) => {
	console.log(val);
	for (let k in val) {
		if (!val[k]) return;
	}
	saveItinerary(val);
}, 500);
watch(obj, (newVal) => {
	debounceFun(newVal.data);
});

// 有id是编辑无id是新增，左下角保存按钮
const getTraveDetail = () => {
	if (!route.query.id) return;
	api.travelManagement
		.getItineraryDetail({
			oid: route.query.id,
			pageNo: 1,
			pageSize: 100000,
		})
		.then((res: any) => {
			res.basic.teamId = res.basic.itineraryNo;
			res.basic.touristNum = res.basic.touristCount;
			res.basic.travelOperatorOid = res.basic.travelOperator.oid;
			res.basic.contactPhone = res.basic.travelOperator.mobile;
			res.basic.username = res.basic.travelOperator.username;
			res.basic.subTravelOperatorOid = res.basic.subTravelOperator.oid;
			res.basic.subTravelContactPhone = res.basic.subTravelOperator.mobile;
			travelStore.setBaseInfo(res.basic);
			travelStore.setGuideList(res.guideList);
			travelStore.setTouristList(res.touristList.content);
			travelStore.setTrafficList(res.transportList);
		});
};
const saveItinerary = (val: any) => {
	let ajax = route.query.id ? api.travelManagement.editItinerary : api.travelManagement.saveItinerary;
	return ajax({
		oid: route.query.id,
		attachmentParam: val.attachmentParam || {
			receptionAgreement: 'http://test1.jpg',
			rentCarContract: 'http://test2.jpg',
			travelContract: 'http://test.jpg',
		},
		basicParam: val.basicParam || {},
		guideList: travelStore.guideList.filter((it:any) => it.edit),
		itineraryInfoParam: {
			compositeProducts: travelStore.compositeProducts,
		},
		touristList: travelStore.touristList.filter((it:any) => it.edit),
		transportList: travelStore.trafficList.filter((it:any) => it.edit),
	}).then((res: any) => {
		message.success(res.message);
	});
};
getTraveDetail();
</script>
<style lang="less" scoped>
.trave-contaner {
	height: 100%;
	::v-deep(.ant-tabs-nav) {
		padding: 16px 20px;
	}
	// ::v-deep(.ant-tabs-content-holder) {
	//   padding: 0 20px;
	// }
}

.footer {
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
