<template>
	<div>
		<div class="trave-contaner">
			<a-tabs v-model:activeKey="activeKey">
				<a-tab-pane v-for="(item, index) in pages" :key="index" :tab="item.label">
					<component @onSuccess="save" :onCheck="check" :is="item.name"></component>
				</a-tab-pane>
			</a-tabs>
			<div class="footer" v-if="route.query.Cedit">
				<div class="footer-btn">
					<a-button type="primary" v-if="activeKey > 1" @click="activeKey = activeKey - 1">上一步</a-button>
					<a-button
						type="primary"
						v-if="activeKey == 2"
						@click="
							() => {
								check = !check;
								sendTeam = false;
								isSaveBtn = true;
							}
						"
						>保存</a-button
					>
					<a-button type="primary" v-if="activeKey < 2" @click="activeKey = activeKey + 1">下一步</a-button>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import baseinfo from './baseinfo/index.vue';
import api from '@/api';
import cicerone from './cicerone/index.vue';
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
		label: '基本信息管理',
	},
	{
		name: cicerone,
		label: '导游信息',
	},
	{
		name: travelled,
		label: '行程信息',
	},
];
const typei = ref();
const Acstatus = ref(0);
const resdata = ref('');
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
// 保存接口
const saveItinerary = (val: any) => {
	if (!val.basicParam) {
		activeKey.value = activeKey.value - 2;
		return message.error('请填写基本信息');
	}
	if (!travelStore.guideList.length) {
		activeKey.value = activeKey.value - 1;
		return message.error('请选择带团导游');
	}

	if (Acstatus.value === 1) {
		aduit(val);
		Acstatus.value = 2;
		console.log('第一次');
	} else if (route.query.oid) {
		aduit(val);
		router.push('/travel/travelTtemplate/list');
		let msg = route.query.oid ? '编辑成功' : '新增成功';
		message.success(msg);
		console.log('第2次');
	} else {
		aduit(val, resdata.value);
		router.push('/travel/travelTtemplate/list');
		let msg = route.query.oid ? '编辑成功' : '新增成功';
		message.success(msg);
		console.log('第3次');
	}
};

const aduit = (val: any, oid?: any) => {
	let ajax = api.travelManagement.saveChangeTravel;
	let queryData = cloneDeep(val);
	queryData.basicParam.oid = oid;
	return ajax(
		{
			basicParam: queryData.basicParam || {},
			guideList: travelStore.guideList.filter((it: any) => it.edit),
		},
		isSaveBtn.value
	)
		.then((res: any) => {
			if (isSaveBtn.value) {
				resdata.value = res.oid;
			}
		})
		.catch((error: any) => {});
};

const getTraveDetail = () => {
	if (!route.query.oid) {
		travelStore.setBaseInfo({});
		travelStore.setGuideList([]);
		return;
	}
	api.travelManagement.saveChangeTraveldetail(route.query.oid).then((res: any) => {
		res.basic.teamId = res.basic.itineraryNo;
		res.basic.time = [res.basic.startDate, res.basic.endDate];
		res.basic.touristNum = res.basic.touristCount || 0;
		travelStore.setBaseInfo(res.basic);
		travelStore.setGuideList(res.guideList);
		travelStore.hotels = res.hotelList;
		travelStore.scenicTickets = res.ticketList;
	});
};
getTraveDetail();
// 防抖debounce，只执行一次saveItinerary
const debounceFun = debounce((val) => {
	console.log(val, 'val');
	for (let k in val) {
		if (!val[k]) return;
	}
	saveItinerary(val);
}, 500);
// 监听debounceFun
watch(obj, (newVal) => {
	debounceFun(newVal.data);
});

watch(activeKey, (newVal) => {
	if (newVal == 2 && !route.query.oid && Acstatus.value === 0) {
		Acstatus.value = 1;
		check.value = !check.value;
		isSaveBtn.value = !isSaveBtn.value;
	}
});

// 初始化
const initPage = async (): Promise<void> => {
	typei.value = route.query?.typei;
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
