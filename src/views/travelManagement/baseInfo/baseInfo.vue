<template>
	<div class="base-info-container">
		<div class="import-btn">
			<a-button type="primary">导入模板</a-button>
		</div>
		<a-form
			ref="formRef"
			:model="formState"
			:rules="rulesRef"
			autocomplete="off"
			labelAlign="left"
			:label-col="{ span: 2 }"
			:wrapper-col="{ span: 7 }"
		>
			<a-form-item label="线路名称" name="routeName">
				<a-input 
					v-model:value="formState.routeName" 
					placeholder="请输入线路名称" />
			</a-form-item>

			<a-form-item
			label="行程类型"
			name="teamType"
			>
			<!-- <a-input v-model:value="formState.username" /> -->
			
			<a-radio-group v-model:value="formState.teamType" name="radioGroup">
				<a-row type="flex">
					<a-col :span="8" v-for="item in list.teamType" :key="item.oid" class="mb-2">
						<a-radio :value="item.oid">{{item.name}}</a-radio>
					</a-col>
					
				</a-row>
			</a-radio-group>
				
			</a-form-item>

			<a-form-item label="组团社（发团）" name="travelName">
				<a-input v-model:value="formState.travelName" disabled />
			</a-form-item>

			<a-form-item label="组团社计调">
				<a-input v-model:value="formState.username" disabled />
				<!-- <a-select v-model:value="formState.travelOperatorOid" placeholder="请选择组团社做团人" disabled>
					<a-select-option :value="userInfo.oid">{{userInfo.username}}</a-select-option>
				</a-select> -->
			</a-form-item>

			<a-form-item label="组团社计调电话" name="contactPhone">
				<a-input v-model:value="formState.contactPhone" disabled />
			</a-form-item>

			<a-form-item label="地接旅行社" name="subTravelOid">
				<a-select v-model:value="formState.subTravelOid" placeholder="请选择地接旅行社" @change="gettravelOperatorList">
					<a-select-option :value="item.oid" v-for="item in list.subTravelList" :key="item.oid">{{item.name}}</a-select-option>
				</a-select>
			</a-form-item>

			<a-form-item label="地接计调" name="subTravelOperatorOid">
				<a-select v-model:value="formState.subTravelOperatorOid" @change="handleChange" placeholder="请选择地接做团人">
					<a-select-option 
						:value="item.oid" 
						v-for="item in list.travelOperatorList" 
						:key="item.oid"
						:phone="item.mobile"
						>
						{{item.username}}
					</a-select-option>
				</a-select>
			</a-form-item>

			<a-form-item label="地接社计调电话" name="subTravelContactPhone">
				<a-input v-model:value="formState.subTravelContactPhone" placeholder="选定地接社计调后自动读出" disabled />
			</a-form-item>

			<a-form-item label="游客人数" name="touristNum">
				<a-input v-model:value="formState.touristNum" placeholder="添加游客名单后自动计算"  disabled/>
			</a-form-item>

			<!-- <a-form-item label="线路类型" name="routeType">
				<a-radio-group v-model:value="formState.routeType" name="radioGroup">
					<a-radio :value="RouteType.Routemodel">线路模版</a-radio>
					<a-radio :value="RouteType.CustomRoute">自定义线路</a-radio>
				</a-radio-group>
			</a-form-item> -->

			<a-form-item label="* 行程时间">
				<div class="d-flex align-item-center">
					<a-form-item name="startDate" style="margin-bottom: 0">
						<a-date-picker 
							:show-time="{ format: 'HH:mm:ss' }" 
							format="YYYY-MM-DD HH:mm:ss"
							value-format="YYYY-MM-DD HH:mm:ss"
							v-model:value="formState.startDate" /> 
					</a-form-item >
					<span class="flex-1 text-center"> 至 </span> 
					<a-form-item name="endDate" style="margin-bottom: 0"> 
						<a-date-picker  
							:show-time="{ format: 'HH:mm:ss' }" 
							format="YYYY-MM-DD HH:mm:ss"
							value-format="YYYY-MM-DD HH:mm:ss"
							v-model:value="formState.endDate" />
					</a-form-item>
				</div>
			</a-form-item>

			<a-form-item label="行程单号" name="teamId">
				<a-input v-model:value="formState.teamId" disabled placeholder="保存草稿后自动生成" />
			</a-form-item>
		</a-form>
	</div>
</template>

<script lang="ts" setup>
import { getUserInfo } from '@/utils/util';
import { RouteType } from '@/enum';
import api from '@/api/index';
import { useTravelStore } from '@/stores/modules/travelManagement';

interface TeamType {
	teamType: Array<any>;
	subTravelList: Array<any>;
	travelOperatorList: Array<any>;
}

const travelStore = useTravelStore();
const touristCount = computed(() => travelStore.touristList.length ? travelStore.touristList.length : '添加游客名单后自动计算')
const route = useRoute()
const page = reactive({
	teamType: {
		pageNo: 1,
		pageSize: 10000
	},
	subTravelList: {
		pageNo: 1,
		pageSize: 10000
	}
})
const list = reactive<TeamType>({
	teamType: [],
	subTravelList: [],
	travelOperatorList: []
})
const formRef = ref();

const props = defineProps({
	onCheck: {
		type: Boolean
	}
})

const emits = defineEmits(['onSuccess'])

let userInfo: any = {}
let addParams: any = {}
if (route.query.id) {
	
} else {
	userInfo = getUserInfo()
	addParams = {
		username: userInfo.username,
		groupType: route.query.type,
		contactPhone: userInfo.mobile,
		subTravelOperatorOid: '',
		travelOid: userInfo.sysCompany.oid,
		travelOperatorOid: userInfo.oid,
		touristNum: touristCount.value,
		subTravelContactPhone: '',
		routeName: '',
		endDate: '',
		startDate: '',
		teamId: '',
		teamType: '',
		subTravelOid: '',
		routeType: 1,
		travelName: userInfo.sysCompany.name
	}
}


const rulesRef = {
	teamType: [{ required: true, message: '请选择行程类型' }],
	// travelName: [{ required: true, message: '请输入发团旅行社' }],
	contactPhone: [{ required: true, message: '请输入组团社联系电话' }],
	subTravelContactPhone: [{ required: true, message: '请输入地接社联系电话' }],
	travelOid: [{ required: true, message: '请选择组团社社'}],
	touristNum: [{ required: true, message: '请输入行程人数' }],
	// routeType: [{ required: true, message: '请选择线路类型' }],
	routeName: [{ required: true, message: '请选择或输入线路名称' }],
	startDate: [{ required: true, message: '请选择行程开始时间' }],
	endDate: [{ required: true, message: '请选择行程结束时间' }],
	subTravelOperatorOid: [{ required: true, message: '请选择计调' }],
	subTravelOid: [{ required: true, message: '请选择地接旅行社'}]
};



const formState = ref<{[k:string]: any}>(route.query.id ? travelStore.baseInfo : addParams);

const onSubmit = async () => {
	try {
		const values = await formRef.value.validateFields()
		formState.value.touristNum = touristCount.value
		emits('onSuccess', {basicParam: formState.value});
	} catch (errorInfo) {
		emits('onSuccess', {basicParam: false});
	}
};
const getTeamTypeList = async () => {
	const res = await api.commonApi.getTeamTypeList(page.teamType);
	list.teamType = res.content;
}
const getSubtravelList = async () => {
	const res = await api.travelManagement.getSubtravelList(page.subTravelList);
	list.subTravelList = res.content;
}
const gettravelOperatorList = async (travelId: number) => {
	list.travelOperatorList = await api.travelManagement.gettravelOperatorList({travelId});
}
const handleChange = (event: any, option: any) => {
	formState.value.subTravelContactPhone = option.phone
}
watch(() => props.onCheck, (newVal) => {
	onSubmit()
})
watch(() => travelStore.baseInfo, newVal => {
	formState.value = newVal;
	if (route.query.id) {
		list.travelOperatorList = [newVal.subTravelOperator];
	}
})
getTeamTypeList();
getSubtravelList();
</script>
<style lang="less" scoped>
	.base-info-container {
		padding: 0 20px;
	}
	.import-btn {
		display: flex;
		justify-content: end;
		margin-bottom: 10px;
	}
	.mb-2 {
		margin-bottom: 5px;
	}
</style>