<template>
	<div class="trave-contaner">
		<a-tabs v-model:activeKey="activeKey">
			<a-tab-pane v-for="(item, index) in pages" :key="index" :tab="item.label">
				<component @onSuccess="save" :onCheck="check" :is="item.name"></component>
			</a-tab-pane>
		</a-tabs>
		<div class="footer d-flex justify-content-between">
			<div class="footer-btn">
				<a-button type="primary" @click="check = !check">保存</a-button>
				<a-button type="primary" @click="activeKey = activeKey + 1">下一步</a-button>
			</div>
			<div class="submit-btn">
				提交发团
			</div>
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
import insurance from './insurance/insurance.vue'
import { cloneDeep, debounce } from 'lodash';
import api from '@/api';
import { message } from 'ant-design-vue';
import { useTravelStore } from '@/stores/modules/travelManagement';
	const route = useRoute()
	const router = useRouter()
	const travelStore = useTravelStore();
	const activeKey = ref(0);
	const check = ref(false)
	const pages = [
		{
			name: baseInfo,
			label: '基本信息管理'
		},
		{
			name: guideInfo,
			label: '导游信息'
		},
		{
			name: touristInfo,
			label: '游客信息'
		},
		{
			name: trafficInfo,
			label: '交通信息'
		},
		{
			name: traveInfo,
			label: '行程信息'
		},
		{
			name: fileInfo,
			label: '附件上传'
		},
		{
			name: insurance,
			label: '确认保险'
		}
	]
	let rulesPass = reactive<{[k:string]:any}>([])
	let obj = reactive({
		data: {}
	})
	const save = (e: any) => {
		rulesPass.push(e)
		for (let i = 0; i < rulesPass.length; i++) {
		obj.data = cloneDeep({
			...obj.data,
			...rulesPass[i]
		})
		}

	}
	const saveItinerary = (val:any) => {
		let ajax = route.query.id ? api.travelManagement.editItinerary : api.travelManagement.saveItinerary
		return ajax(
		{
			oid: route.query.id,
			attachmentParam: val.attachmentParam || {
			receptionAgreement: "http://test1.jpg",
			rentCarContract: "http://test2.jpg",
			travelContract: "http://test.jpg"
		},
			basicParam: val.basicParam || {},
			guideList: travelStore.guideList.filter((it: any) => it.edit),
			itineraryInfoParam: {
				compositeProducts: travelStore.compositeProducts
			},
				touristList: travelStore.touristList.filter((it: any) => it.edit),
				transportList: travelStore.trafficList.filter((it: any) => it.edit)
			}
		).then((res: any) => {
			let msg = route.query.id ? '编辑成功' : '新增成功'
			message.success(msg);
			router.push('/travel/travel_manage/travel_list')
		})
	}
	const debounceFun = debounce((val) => {
		console.log(val)
		for (let k in val) {
			if (!val[k]) return
		}
		saveItinerary(val)
	} ,500)
	watch(obj, (newVal) => {
		debounceFun(newVal.data)
	})

  	const getTraveDetail = () => {
		if (!route.query.id) {
			travelStore.setBaseInfo({});
			travelStore.setGuideList([]);
			travelStore.setTouristList([]);
			travelStore.setTrafficList([]);
			return
		} 
		api.travelManagement.getItineraryDetail({
			oid: route.query.id,
			pageNo: 1,
			pageSize: 100000
		}).then((res: any) => {
			res.basic.teamId = res.basic.itineraryNo
			res.basic.time = [res.basic.startDate, res.basic.endDate]
			res.basic.touristNum = res.basic.touristCount
			res.basic.travelOperatorOid = res.basic.travelOperator.oid
			res.basic.contactPhone = res.basic.travelOperator.mobile
			res.basic.username = res.basic.travelOperator.username
			res.basic.subTravelOperatorOid = res.basic.subTravelOperator.oid
			res.basic.subTravelContactPhone = res.basic.subTravelOperator.mobile
			travelStore.setBaseInfo(res.basic);
			travelStore.setGuideList(res.guideList);
			travelStore.setTouristList(res.touristList.content);
			travelStore.setTrafficList(res.transportList);
		
		})
	}
	
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
.submit-btn {
	width: 90px;
	height: 90px;
	background: linear-gradient(143deg, #40F3CB 0%, #36B374 100%);
	box-shadow: 2px 6px 20px rgba(54,179,116,0.34);
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
