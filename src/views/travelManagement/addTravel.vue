<template>
	<div class="trave-contaner">
		<a-tabs v-model:activeKey="activeKey">
			<a-tab-pane v-for="(item, index) in pages" :key="index" :tab="item.label">
				<component @onSuccess="save" :onCheck="check" :is="item.name"></component>
			</a-tab-pane>
		</a-tabs>
		<div class="footer d-flex justify-content-between" v-if="travelStore.teamStatus">
			<div class="footer-btn">
				<a-button type="primary" @click="() => { check = !check; sendTeam = false; isSaveBtn = true }">保存</a-button>
				<a-button v-show="activeKey < pages.length - 1" type="primary" @click="activeKey = activeKey + 1">下一步</a-button>
			</div>
			<div class="submit-btn" @click="() => { check = !check; sendTeam = true; isSaveBtn = false }">提交发团</div>
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
import insurance from './insurance/insurance.vue';
import { cloneDeep, debounce } from 'lodash';
import api from '@/api';
import { message } from 'ant-design-vue';
import { useTravelStore } from '@/stores/modules/travelManagement';
import dayjs, { Dayjs } from 'dayjs';
import { getAmount } from '@/utils';
const traveListData = JSON.parse(sessionStorage.getItem('traveList') as any) || {};
const route = useRoute();
const router = useRouter();
const travelStore = useTravelStore();
const activeKey = ref(0);
const check = ref(false); //触发保存
const sendTeam = ref(false); //发团判断
const isSaveBtn = ref(false); //是否点击保存按钮
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
	{
		name: insurance,
		label: '确认保险',
	},
];
let rulesPass = reactive<{ [k: string]: any }>([]);
let obj = reactive({
	data: {},
});
const save = (e: any) => {
	console.log(e)
	rulesPass.push(e);
	for (let i = 0; i < rulesPass.length; i++) {
		obj.data = cloneDeep({
			...obj.data,
			...rulesPass[i],
		});
	}
};

const sendGroup = async (id: string) => {

	const formData = new FormData();
	formData.append('itineraryId', id)
	try {
		await api.travelManagement.sendGroup(formData)
		router.push('/travel/travel_manage/travel_list')
		message.success('发团成功')
		sendTeam.value = false
	} catch (error) {
		sendTeam.value = false
	}
}

const saveItinerary = (val: any) => {
	if (!travelStore.teamStatus) return
	if (sendTeam.value) {
		if (!travelStore.guideList.length) return message.error('请选择带团导游');
		if (!travelStore.touristList.length) return message.error('请添加游客');
		if (!travelStore.trafficList.length) return message.error('请添加交通信息');
	}
	const traveListData = JSON.parse(sessionStorage.getItem('traveList') as any) || {};
	const itineraryId =  route.query.id || traveListData.oid
	let ajax = itineraryId ? api.travelManagement.editItinerary : api.travelManagement.saveItinerary;
	// 综费产品 > 1
	const productRes = travelStore.compositeProducts.length > 1
	if (productRes) {
		return message.error('请选择一项综费产品')
	}
	return ajax({
		oid: itineraryId ? itineraryId.toString() : null,
		attachmentList: travelStore.attachmentList.length ? travelStore.attachmentList :
		[
			{
				oid: null, //oid
				attachmentName: "旅行合同", //附件名称
				attachmentType: 2, //附件类型：1-旅行合同，2-接待协议，3-租车合同，4-其它
				attachmentUrl: "http://test.jpg" //附件url
			},
			{
				oid: null, //oid
				attachmentName: "旅行合同", //附件名称
				attachmentType: 3, //附件类型：1-旅行合同，2-接待协议，3-租车合同，4-其它
				attachmentUrl: "http://test.jpg" //附件url
			},
			{
				oid: null, //oid
				attachmentName: "旅行合同", //附件名称
				attachmentType: 1, //附件类型：1-旅行合同，2-接待协议，3-租车合同，4-其它
				attachmentUrl: "http://test.jpg" //附件url
			}
		],
		basicParam: val.basicParam || {},
		guideList: travelStore.guideList.filter((it: any) => it.edit),
		itineraryInfoParam: {
			compositeProducts: travelStore.curentProduct,
		},
		touristList: travelStore.touristList.filter((it: any) => it.edit),
		transportList: travelStore.trafficList.filter((it: any) => it.edit),
	}, isSaveBtn.value).then((res: any) => {
		res && sessionStorage.setItem('traveList', JSON.stringify(res));
		getTraveDetail();
		if (sendTeam.value) {
			sendGroup(itineraryId)
		}
		if (isSaveBtn.value) {
			// router.push('/travel/travel_manage/travel_list')
			let msg = route.query.id ? '编辑成功' : '新增成功'
			message.success(msg);
		}
		
	});
};



const debounceFun = debounce((val) => {
	for (let k in val) {
		if (val[k].valid === false) {
			activeKey.value = val[k].index;
			return message.error(val[k].message);
		}
	}
	saveItinerary(val);
}, 500);
watch(obj, (newVal) => {
	debounceFun(newVal.data);
});

const getTraveDetail = () => {
	const traveListData = JSON.parse(sessionStorage.getItem('traveList') as any) || {};
	if (!route.query.id && !traveListData.oid) {
		travelStore.setBaseInfo({});
		travelStore.setGuideList([]);
		travelStore.setTouristList([]);
		travelStore.setTrafficList([]);
		return;
	}
	api.travelManagement
		.getItineraryDetail({
			oid: route.query.id || traveListData.oid,
			pageNo: 1,
			pageSize: 100000,
		}, isSaveBtn.value)
		.then((res: any) => {
			res.basic.teamId = res.basic.itineraryNo;
			res.basic.time = [res.basic.startDate, res.basic.endDate];
			res.basic.touristNum = res.basic.touristCount || 0;
			travelStore.setBaseInfo(res.basic);
			travelStore.setFileInfo(res.attachmentList);
			travelStore.setGuideList(res.guideList);
			travelStore.setTouristList(res.touristList.content.map((it: any) => {
				it.specialCertificatePicture = it.specialCertificatePicture.split(',');
				return it;
			}));
			res.transportList = res.transportList.map((it:any) => {
				it.time = [it.startDate, it.endDate]
				return it;
			})
			travelStore.setTrafficList(res.transportList);
			res.waitBuyItem.waitBuyHotel = res.waitBuyItem.waitBuyHotel ? res.waitBuyItem.waitBuyHotel.map((it:any) => {
				it.hotelId = it.productId;
				it.hotelName = it.productName
				return it;
			}) : [];
			res.waitBuyItem.waitBuyTicket = res.waitBuyItem.waitBuyTicket ? res.waitBuyItem.waitBuyTicket.map((it:any) => {
				it.scenicId = it.productId;
				it.scenicName = it.productName;
				return it;
			}) : [];
			const hotel = [...res.waitBuyItem.waitBuyHotel, ...res.hotelList]
			travelStore.hotels = hotel as any;
			// travelStore.curentProduct = res.productList;
			travelStore.scenicTickets = [...res.waitBuyItem.waitBuyTicket, ...res.ticketList] as any;
			travelStore.teamTime = [res.basic.startDate, res.basic.endDate]  as any
			travelStore.setDisabled = (current: Dayjs): any => {
				return (dayjs(res.basic.startDate) && dayjs(res.basic.startDate) > current && current) ||
					(dayjs(res.basic.endDate) && dayjs(res.basic.endDate).add(1, 'day') < current && current)
			}
		});
};

watch(activeKey, newVal => {
	if (newVal === 4) {
		const allFeesProducts =  travelStore.compositeProducts.map((it:any) => {
			it.peopleCount = travelStore.touristList.length;
			it.unPrice = it.feeNumber;
			it.dayCount = dayjs(travelStore.baseInfo.endDate).diff(travelStore.baseInfo.startDate, 'day')
			it.totalMoney = getAmount(
				it.confirmDailyCharge,
				it.feeNumber,
				it.feeModel
			)
			return it;
		})
		travelStore.setCompositeProducts(allFeesProducts);
		isSaveBtn.value = false
		check.value = !check.value;
	}
})

getTraveDetail();
travelStore.getItineraryStatus();
// !route.query.id && saveItinerary({})
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
