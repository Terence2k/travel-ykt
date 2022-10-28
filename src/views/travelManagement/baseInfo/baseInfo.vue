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
			
			<a-radio-group 
				v-model:value="formState.teamType" 
				name="radioGroup" 
				@change="changeRadio" 
				style="width: 100%">
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
				<a-input v-model:value="formState.travelOperatorName" disabled />
				<!-- <a-select v-model:value="formState.travelOperatorOid" placeholder="请选择组团社做团人" disabled>
					<a-select-option :value="userInfo.oid">{{userInfo.username}}</a-select-option>
				</a-select> -->
			</a-form-item>

			<a-form-item label="组团社计调电话" name="travelOperatorPhone">
				<a-input v-model:value="formState.travelOperatorPhone" disabled />
			</a-form-item>
			<!--  v-if="teamGroupType === GroupMode.TeamGroup" -->
			<div>
				<a-form-item label="地接旅行社" name="subTravelOid">
					<a-select 
						v-model:value="formState.subTravelOid" 
						placeholder="请选择地接旅行社" 
						@change="(val, option) => gettravelOperatorList(val, option)">
						<a-select-option 
							:value="item.oid" 
							:name="item.name"
							v-for="item in list.subTravelList" 
							:key="item.oid">
							{{item.name}}
						</a-select-option>
					</a-select>
				</a-form-item>

				<a-form-item label="地接计调" name="subTravelOperatorOid">
					<a-select v-model:value="formState.subTravelOperatorOid" @change="handleChange" placeholder="请选择地接做团人">
						<a-select-option 
							:value="item.oid" 
							v-for="item in list.travelOperatorList" 
							:key="item.oid"
							:name="item.username"
							:phone="item.mobile"
							>
							{{item.username}}
						</a-select-option>
					</a-select>
				</a-form-item>

				<a-form-item label="地接社计调电话" name="subTravelOperatorPhone">
					<a-input v-model:value="formState.subTravelOperatorPhone" placeholder="选定地接社计调后自动读出" disabled />
				</a-form-item>
			</div>

			<a-form-item label="游客人数" name="touristNum">
				<a-input v-model:value="formState.touristNum" placeholder="添加游客名单后自动计算"  disabled/>
			</a-form-item>

			<!-- <a-form-item label="线路类型" name="routeType">
				<a-radio-group v-model:value="formState.routeType" name="radioGroup">
					<a-radio :value="RouteType.Routemodel">线路模版</a-radio>
					<a-radio :value="RouteType.CustomRoute">自定义线路</a-radio>
				</a-radio-group>
			</a-form-item> -->

			<a-form-item label="行程时间" name="time">
				<!-- <div class="d-flex align-item-center">
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
				</div> -->
				<a-range-picker
					style="width: 100%"
					@change="handleChangeTime"
					v-model:value="formState.time"
					show-time
					format="YYYY-MM-DD HH:mm:ss"
					value-format="YYYY-MM-DD HH:mm:ss"
				/>
			</a-form-item>

			<a-form-item label="行程单号" name="teamId">
				<a-input v-model:value="formState.teamId" disabled placeholder="保存草稿后自动生成" />
			</a-form-item>
		</a-form>
	</div>
</template>

<script lang="ts" setup>
import { getUserInfo } from '@/utils/util';
import { ConfirmDailyCharge, FeeModel, GroupMode, RouteType } from '@/enum';
import api from '@/api/index';
import { useTravelStore } from '@/stores/modules/travelManagement';
import dayjs from 'dayjs';

interface TeamType {
	teamType: Array<any>;
	subTravelList: Array<any>;
	travelOperatorList: Array<any>;
}

const travelStore = useTravelStore();
const touristCount = computed(() => travelStore.touristList.length ? travelStore.touristList.length.toString() : 0)
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
const teamGroupType = computed(() => {
	if (route.query.type) {
		return Number(route.query.type)
	} else {
		return travelStore.baseInfo.groupType
	}
}) //协作类型
let userInfo: any = {}
let addParams: any = {}
if (route.query.id) {
	
} else {
	userInfo = getUserInfo()
	addParams = {
		oid: null,
		travelOperatorName: userInfo.username,
		groupType: teamGroupType.value,
		travelOperatorPhone: userInfo.mobile,
		subTravelOperatorOid: '',
		travelOid: userInfo.sysCompany.oid,
		travelOperatorOid: userInfo.oid,
		touristNum: touristCount.value,
		subTravelOperatorPhone: '',
		routeName: '',
		endDate: '',
		startDate: '',
		teamId: '',
		teamType: '',
		subTravelOid: '',
		routeType: 1,
		travelName: userInfo.sysCompany.name,
		subTravelName: ''
	}
}


const rulesRef = {
	teamType: [{ required: true, message: '请选择行程类型' }],
	// travelName: [{ required: true, message: '请输入发团旅行社' }],
	travelOperatorPhone: [{ required: true, message: '请输入组团社联系电话' }],
	subTravelOperatorPhone: [{ required: true, message: '请输入地接社联系电话' }],
	travelOid: [{ required: true, message: '请选择组团社社'}],
	touristNum: [{ required: true, message: '请输入行程人数' }],
	// routeType: [{ required: true, message: '请选择线路类型' }],
	routeName: [{ required: true, message: '请选择或输入线路名称' }],
	// startDate: [{ required: true, message: '请选择行程开始时间' }],
	// endDate: [{ required: true, message: '请选择行程结束时间' }],
	time: [{ required: true, message: '请选择行程时间' }],
	subTravelOperatorOid: [{ required: true, message: '请选择计调' }],
	subTravelOid: [{ required: true, message: '请选择地接旅行社'}]
};



const formState = ref<{[k:string]: any}>(route.query.id ? computed(() => travelStore.baseInfo) : addParams);

const onSubmit = async () => {
	try {
		const values = await formRef.value.validateFields()
		formState.value.touristNum = touristCount.value
		emits('onSuccess', {basicParam: formState.value});
	} catch (errorInfo) {
		emits('onSuccess', {basicParam: {valid: false, message: '请先填写基础信息', index: 0} });
	}
};
const getTeamTypeList = async () => {
	// page.teamType
	const res = await api.commonApi.getTeamTypeList();
	list.teamType = res;
}
const getSubtravelList = async () => {
	const res = await api.travelManagement.getSubtravelList(page.subTravelList);
	list.subTravelList = res.content;
}
const gettravelOperatorList = async (travelId: number, option: any) => {
	formState.value.subTravelOperatorOid = '';
	formState.value.subTravelName = option.name
	list.travelOperatorList = await api.travelManagement.gettravelOperatorList({travelId});
}
const handleChange = (event: any, option: any) => {
	formState.value.subTravelOperatorPhone = option.phone
	formState.value.subTravelOperatorName = option.name
}
const handleChangeTime = (event: any) => {
	if (event) {
		formState.value.startDate = event[0];
		formState.value.endDate = event[1];
	} else {
		formState.value.startDate = '';
		formState.value.endDate = '';
	}
	
}

const changeRadio = (event:any) =>  {
	travelStore.setTeamType(event.target.value);

}

/**
 * 
 * @param model 收费模式
 * @param price 单价
 * @returns count 总价
 */

const getPrice = (model: any, price: number) => {
	let count = 0
	switch(model) {
		case FeeModel.Number :
			count = price * travelStore.touristList.length
			break;
		case FeeModel.Price :
			count = price
			break;
	}
	return count
}


/**
 * 
 * @param a 是否按天收费
 * @param price 单价
 * @param model 收费模式
 * @returns countPrice 总价
 */

const getAmount = (a:any, price: number, model: any) => {
	let countPrice = 0
	switch (a) {
		case ConfirmDailyCharge.NotDay :
			countPrice = getPrice(model, price)
			break;
		case ConfirmDailyCharge.IsDay :
			const dayCount = dayjs(travelStore.baseInfo.endDate).diff(travelStore.baseInfo.startDate, 'day');
			countPrice = getPrice(model, price) * dayCount
			break;
	}
	return countPrice
}
const findByIdTeamType = async () => {
		if (!travelStore.teamType) return
		const formData = new FormData();
		formData.append('id', travelStore.teamType);
		if (travelStore.teamType) {
			let allFeesProducts = []
			const res = await api.travelManagement.findByIdTeamType(formData);
			
			for (let i = 0; i < res.productVos.length; i++) {
				if (res.productVos[i].itemId === 0) {
					const result = await api.travelManagement.findProductInfo(res.productVos[i].productId)
					result.peopleCount = travelStore.touristList.length;
					result.unPrice = result.feeNumber;
					result.isDay = true;
					result.dayCount = dayjs(travelStore.baseInfo.endDate).diff(travelStore.baseInfo.startDate, 'day')
					result.totalMoney = getAmount(
						result.confirmDailyCharge,
						result.feeNumber,
						result.feeModel
					)
					allFeesProducts.push(result)
				}
			}
			
			
			travelStore.setCompositeProducts(allFeesProducts);
		}
		
	}
watch(() => props.onCheck, (newVal) => {
	onSubmit()
})
watch(() => travelStore.baseInfo, newVal => {
	formState.value = newVal;
	console.log(newVal)
	if (route.query.id) {
		list.travelOperatorList = [{
			oid: newVal.subTravelOperatorOid,
			username: newVal.subTravelOperatorName,
			mobile: newVal.subTravelOperatorPhone
		}];
		travelStore.setTeamType(travelStore.baseInfo.teamType);
	}
})
watch(
	() => travelStore.teamType,
	(newVal) => {
		findByIdTeamType();
	}
);
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