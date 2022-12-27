<template>
	<div>
		<div class="trave-contaner">
			<a-tabs v-model:activeKey="activeKey">
				<a-tab-pane v-for="(item, index) in pages" :key="index" :tab="item.label">
					<component @onSuccess="save" :onCheck="check" :is="item.name"></component>
				</a-tab-pane>
			</a-tabs>
			<!-- <div class="footer" >
				<div class="footer-btn">
					<a-button
						type="primary"
						@click="
							() => {
								check = !check;
								sendTeam = false;
								isSaveBtn = true;
							}
						"
						>提交修改</a-button
					>
					<a-button type="primary" >提交财务审核</a-button>
				</div>
			</div> -->
		</div>
	</div>
</template>
<script lang="ts" setup>
import baseinfo from './baseinfo/index.vue';
import api from '@/api';
import production from './production/edit.vue';
import travelled from './traveInfo/traveInfo.vue';
import { ref, onMounted, reactive } from 'vue';
import { useTravelStore } from '@/stores/modules/travelManagement';
import { cloneDeep, debounce } from 'lodash';
import { message } from 'ant-design-vue';
const travelStore = useTravelStore();
const route = useRoute();
const router = useRouter();
const activeKey = ref(0);
const check = ref(false); //触发保存
const sendTeam = ref(false); //发团判断
const isSaveBtn = ref(false); //是否点击保存按钮
let pages = [
	{
		name: baseinfo,
		label: '修改基本信息',
	},
	{
		name: production,
		label: '修改预订产品',
	},
];

// let rulesPass = reactive<{ [k: string]: any }>([]);
// let obj = reactive({
// 	data: {},
// });
const save = (e: any) => {
	// rulesPass.push(e);
	// for (let i = 0; i < rulesPass.length; i++) {
	// 	obj.data = cloneDeep({
	// 		...obj.data,
	// 		...rulesPass[i],
	// 	});
	// }
};
// // 保存接口
// const saveItinerary = (val: any) => {
// 	if (!val.basicParam) return message.error('请填写基本信息')
// 	if (!travelStore.guideList.length) return message.error('请选择带团导游')
// 	let ajax = api.travelManagement.saveChangeTravel;
// 	return ajax(
// 		{
// 			basicParam: val.basicParam || {},
// 			guideList: travelStore.guideList.filter((it: any) => it.edit),
// 		},
// 		isSaveBtn.value
// 	).then((res: any) => {
// 		if (isSaveBtn.value) {
// 			router.push('/travel/travelTtemplate/list');
// 			let msg = route.query.oid ? '编辑成功' : '新增成功';
// 			message.success(msg);
// 		}
// 	}).catch((error:any)=>{
// 	})

// };
// const getTraveDetail = () => {
// 	if (!route.query.oid) {
// 		travelStore.setBaseInfo({});
// 		travelStore.setGuideList([]);
// 		return;
// 	} else {
// 		pages.push({
// 			name: travelled,
// 			label: '行程信息',
// 		});
// 	}
// 	api.travelManagement.saveChangeTraveldetail(route.query.oid).then((res: any) => {
// 		res.basic.teamId = res.basic.itineraryNo;
// 		res.basic.time = [res.basic.startDate, res.basic.endDate];
// 		res.basic.touristNum = res.basic.touristCount || 0;
// 		travelStore.setBaseInfo(res.basic);
// 		travelStore.setGuideList(res.guideList);
// 		travelStore.hotels = res.hotelList;
// 		travelStore.scenicTickets = res.ticketList;
// 	});
// };
// getTraveDetail();
// // 防抖debounce，只执行一次saveItinerary
// const debounceFun = debounce((val) => {
// 	console.log(val);
// 	for (let k in val) {
// 		if (!val[k]) return;
// 	}
// 	saveItinerary(val);
// }, 500);
// // 监听debounceFun
// watch(obj, (newVal) => {
// 	debounceFun(newVal.data);
// });

// 初始化
const initPage = async (): Promise<void> => {
};

onMounted(() => {
	initPage();
});
</script>
<style lang="less" scoped>
.trave-contaner {
	::v-deep(.ant-tabs-nav) {
		padding: 16px 20px;
	}
	::v-deep(.ant-tabs-content-holder) {
		padding: 0 20px;
	}
}
.ant-table-thead > tr > th {
	border-top: 1px solid #f0f0f0;
	background-color: #fcfcfc;
	&::before {
		height: 100% !important;
	}
}
.ant-table-body {
	height: 500px;
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
