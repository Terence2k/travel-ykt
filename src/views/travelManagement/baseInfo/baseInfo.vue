<template>
	<div class="base-info-container">
		<div class="import-btn" v-if="travelStore.teamStatus">
			<a-button type="primary" @click="(dialogVisible = true)">导入模板</a-button>
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
			<a-select 
				v-model:value="formState.teamType" 
				placeholder="请选择行程类型" 
				@change="(val, option) => changeRadio(val, option)">
				<a-select-option 
					:value="item.oid" 
					:name="item.name"
					v-for="item in list.teamType" 
					:key="item.oid">
					{{item.name}}
				</a-select-option>
			</a-select>
			<!-- <a-radio-group 
				v-model:value="formState.teamType" 
				name="radioGroup" 
				@change="changeRadio" 
				style="width: 100%">
				<a-row type="flex">
					<a-col :span="8" v-for="item in list.teamType" :key="item.oid" class="mb-2">
						<a-radio :value="item.oid">{{item.name}}</a-radio>
					</a-col>
				</a-row>
			</a-radio-group> -->
				
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
					<a-select v-model:value="formState.subTravelOperatorOid" @change="handleChange" placeholder="请选择地接计调">
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
				<a-input v-model:value="touristListCount" placeholder="添加游客名单后自动计算"  disabled/>
			</a-form-item>

			<!-- <a-form-item label="线路类型" name="routeType">
				<a-radio-group v-model:value="formState.routeType" name="radioGroup">
					<a-radio :value="RouteType.Routemodel">线路模版</a-radio>
					<a-radio :value="RouteType.CustomRoute">自定义线路</a-radio>
				</a-radio-group>
			</a-form-item> -->

			<a-form-item label="行程时间" name="time">
				<div class="d-flex align-item-center">
					<a-form-item name="startDate" style="margin-bottom: 0">
						<!-- <a-date-picker 
							:disabled-date="disabledDateStart"
							:disabled-time="disabledDateTime(formState.endDate, 'end')"
							:show-time="{ format: 'HH:mm:ss' }" 
							format="YYYY-MM-DD HH:mm:ss"
							value-format="YYYY-MM-DD HH:mm:ss"
							v-model:value="formState.startDate" />  -->
							<datePicker 
								placeholder="选择行程开始日期"
									popper-class="hidden-date-picker"
									v-model="formState.startDate"
									:disabled-date="disabledDateStart"
									value-format="YYYY-MM-DD HH:mm:ss"
									:disabled-hours="() => disabledHours(formState.endDate, formState.startDate, 'end')"
									:disabled-minutes="() => disabledMinutes(formState.endDate, formState.startDate, 'end')"
									:disabled-seconds="() => disabledSeconds(formState.endDate, formState.startDate, 'end')"
									type="datetime" />
					</a-form-item >
					<span class="flex-1 text-center"> 至 </span> 
					<a-form-item name="endDate" style="margin-bottom: 0"> 
						<!-- <a-date-picker  
							:disabled-date="disabledDate"
							:disabled-time="disabledDateTime(formState.startDate, 'start')"
							:show-time="{ format: 'HH:mm:ss' }" 
							format="YYYY-MM-DD HH:mm:ss"
							value-format="YYYY-MM-DD HH:mm:ss"
							v-model:value="formState.endDate" /> -->
							<datePicker 
									popper-class="hidden-date-picker"
									v-model="formState.endDate"
									placeholder="选择行程结束日期"
									:default-time="new Date(2022, 12, 1, 23, 59, 59)"
									:disabled-date="disabledDate"
									value-format="YYYY-MM-DD HH:mm:ss"
									:disabled-hours="() => disabledHours(formState.startDate, formState.endDate, 'start')"
									:disabled-minutes="() => disabledMinutes(formState.startDate, formState.endDate, 'start')"
									:disabled-seconds="() => disabledSeconds(formState.startDate, formState.endDate, 'start')"
									type="datetime" />
					</a-form-item>
				</div>
				<!-- :disabled-date="disabledDate" -->
				<!-- <a-range-picker
					style="width: 100%"
					:disabled-date="disabledDate"
					@change="handleChangeTime"
					v-model:value="formState.time"
					show-time
					format="YYYY-MM-DD HH:mm:ss"
					value-format="YYYY-MM-DD HH:mm:ss"
				/> -->
			</a-form-item>

			<a-form-item label="行程单号" name="teamId">
				<a-input v-model:value="formState.teamId" disabled placeholder="保存草稿后自动生成" />
			</a-form-item>
			<a-form-item label="自编团号">
				<a-input v-model:value="formState.selfTeamNo" placeholder="请输入自编团号" />
			</a-form-item>
		</a-form>
	</div>
	<BaseModal v-model="dialogVisible" title="选择行程单模板" :text="{confirm: '确认', cancel: '取消'}" :onOk="handleOk">
		<a-select 
			v-model:value="templateId" 
			style="width: 100%"
			placeholder="选择模板" >
			<a-select-option 
				:value="item.oid" 
				:name="item.templateName"
				v-for="item in list.templateList" 
				:key="item.oid">
				{{item.templateName}}
			</a-select-option>
		</a-select>
	</BaseModal>
</template>

<script lang="ts" setup>
import { disabledRangeTime, generateGuid, getAmount, getUserInfo, disabledDateTime, disabledHours, disabledMinutes, disabledSeconds } from '@/utils/util';
import { ConfirmDailyCharge, FeeModel, GroupMode, RouteType } from '@/enum';
import api from '@/api/index';
import BaseModal from '@/components/common/BaseModal.vue';
import { useTravelStore } from '@/stores/modules/travelManagement';
import dayjs, { Dayjs } from 'dayjs';
import { cloneDeep } from 'lodash';
import { Modal } from 'ant-design-vue';
import { createVNode } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import datePicker from '@/components/common/datePicker.vue';

interface TeamType {
	teamType: Array<any>;
	subTravelList: Array<any>;
	travelOperatorList: Array<any>;
	templateList: Array<any>
}

const travelStore = useTravelStore();
const touristListCount = computed(() => travelStore.touristList.length)
const touristCount = computed(() => travelStore.touristList.length ? travelStore.touristList.length.toString() : 0)
const route = useRoute()
const dialogVisible = ref(false);
const templateId = ref();
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
	travelOperatorList: [],
	templateList: []
})
const formRef = ref();

const props = defineProps({
	onCheck: {
		type: Boolean
	}
})

const emits = defineEmits(['onSuccess', 'getTravelDetail'])
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
		subTravelOperatorOid: undefined,
		travelOid: userInfo.sysCompany.oid,
		travelOperatorOid: userInfo.oid,
		touristNum: touristCount.value,
		subTravelOperatorPhone: '',
		routeName: '',
		endDate: '',
		startDate: '',
		teamId: '',
		teamType: '',
		subTravelOid: undefined,
		routeType: 1,
		travelName: userInfo.sysCompany.name,
		subTravelName: ''
	}
}
// 模板列表
const getTravelTemplateList = async () => {
	const {content} = await api.travelManagement.getTravelTemplateList({
		pageNo: 1,
		pageSize: 999999,
		templateStatus: 1
	});
	list.templateList = content;
}


// 导入模板
const getTemplate = async () => {
	try {
		const res: any = await api.travelManagement.saveChangeTraveldetail(templateId.value);
		res.basic.touristNum = travelStore.touristList.length || res.basic?.touristCount || 0;
		let baseInfoParams = {}
		const guideList = res.guideList.map((it: any) => {
			it.edit = true;
			it.oid = null;
			it.key = generateGuid();
			return it
		})
		const hotelList = res.hotelList.map((it: any) => {
			it.oid = null;
			it.orderFee = it.orderFee / 100;
			return it;
		})
		const ticketList = res.ticketList.map((it: any) => {
			it.oid = null;
			it.unitPrice = it.unitPrice / 100;
			return it;
		})
		// res.hotelList.map((it: any) => {
		// 	it.orderFee = it.orderFee / 100
		// 	return it;
		// })
		if (route.query.type) {
			baseInfoParams = {
				...travelStore.baseInfo,
				...res.basic,
				groupType: route.query.type,
			}
		} else {
			baseInfoParams = {
				...travelStore.baseInfo,
				...res.basic,
			}
		}
		travelStore.setBaseInfo(baseInfoParams);
		travelStore.setGuideList([
			...travelStore.guideList,
			...guideList,
			
		]);
		travelStore.setAllHotel([
			...hotelList
		])
		travelStore.setAllTicket([
			...ticketList
		])
	} catch (error) {
	}
}
const showConfirm = () => {
	Modal.confirm({
		title: '提示',
		icon: createVNode(ExclamationCircleOutlined),
		content: createVNode('div', { style: 'color:red;' }, '当前行程单草稿中已有内容，是否还要从模板导入内容？导入后将丢失已有内容，请谨慎操作。'),
		okText: '继续导入',
		cancelText: '取消',
		onOk() {
			getTemplate();
		},
		onCancel() {
			console.log('Cancel');
		},
		class: 'test',
	});
};
// 导入确定
const handleOk = async (callback: Function) => {
	const traveListData = JSON.parse(sessionStorage.getItem('traveList') as any) || {};
	const itineraryId =  route.query.id || traveListData.oid
	if (itineraryId) {
		showConfirm()
		return callback()
	}
	getTemplate();
	return callback()
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
// 开始时间限制
const disabledDateStart = (current: Dayjs) => {
	if (formState.value.endDate) {
		return current && current > dayjs(formState.value.endDate).startOf('day');
	}
	
}
// 结束时间限制
const disabledDate = (current: Dayjs) => {
	if (formState.value.startDate && current <  dayjs(formState.value.startDate).startOf('day')) {
		return current && current < dayjs(formState.value.startDate).startOf('day');
	} else {
		return current && current < dayjs().startOf('day');
	}
	
}
// 结束时分秒限制
// const disabledDateTime = (c)

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
	formState.value.subTravelOperatorOid = undefined;
	formState.value.subTravelName = option.name
	list.travelOperatorList = await api.travelManagement.gettravelOperatorList({travelId});
}
const handleChange = (event: any, option: any) => {
	formState.value.subTravelOperatorPhone = option.phone
	formState.value.subTravelOperatorName = option.name
}



const handleChangeTime = (event: any) => {
	let dis = null;
	let disTime = null;
	if (event) {
		// formState.value.startDate = event[0];
		// formState.value.endDate = event[1];

		let start = {
			hour: 0,
			min: 0,
			second: 0
		}

		let end = {
			hour: 0,
			min: 0,
			second: 0
		}

		start.hour = dayjs(event[0]).hour();
		start.min = dayjs(event[0]).minute();
		start.second = dayjs(event[0]).second();
		end.hour = dayjs(event[1]).hour();
		end.min = dayjs(event[1]).minute();
		end.second = dayjs(event[1]).second();
		console.log(start, end, '---------')
		dis = (current: Dayjs) => {
			
			return (dayjs(event[0]) && dayjs(event[0]).startOf('day') > current && current) ||
			(dayjs(event[1]) && dayjs(event[1]).endOf('day') < current && current)
		}

		disTime = disabledRangeTime(start, end);
		travelStore.setStarEndHMS = {
			start,
			end
		}
		travelStore.defaultStartTime = new Date(2022, 12, 1, start.hour, start.min, start.second);
		travelStore.defaultEndTime = new Date(2022, 12, 1, end.hour, end.min, end.second);
		console.log(dis, '---------')
	} else {
		// formState.value.startDate = '';
		// formState.value.endDate = '';
		dis = (current: Dayjs) => {
			return current && current < dayjs().endOf('day') || 
			current > dayjs().startOf('day');
		}
	}
	
	travelStore.setDisabled = dis as any;
	travelStore.setDisabledTime = disTime as any;
	travelStore.teamTime = event; 
	
}



const changeRadio = (event:any, option:any) =>  {
	console.log(event,option)
	formState.value.teamTypeName = option.name;
	// .target.value
	travelStore.setTeamType(event);

}

const findByIdTeamType = async () => {
	if (!travelStore.teamType) return
	const formData = new FormData();
	formData.append('id', travelStore.teamType);
	if (travelStore.teamType) {
		let allFeesProducts = []
		const res = await api.travelManagement.findByIdTeamType(formData);
		
		for (let i = 0; i < res.productVos.length; i++) {
			// 综费产品itemId为4
			if (res.productVos[i].itemId === 4) {
				if (!res.productVos[i].productId) {
					travelStore.isOptional = true;
					const res = await api.travelManagement.comprehensiveFeeProduct({
						pageNo: 1,
						pageSize: 99999,
						status: 1
					});
					allFeesProducts = res.content.map((it: any) => {
						it.isDaily = it.confirmDailyCharge ? true : false;
						it.productName = it.comprehensiveFeeProductName;
						return it;
					});
				} else {
					travelStore.isOptional = false;
					const result = await api.travelManagement.findProductInfo(res.productVos[i].productId)
					result.peopleCount = travelStore.touristList.length;
					result.unPrice = result.feeNumber;
					result.isDaily = result.confirmDailyCharge ? true : false;
					result.productName = result.comprehensiveFeeProductName;
					result.dayCount = dayjs(travelStore.baseInfo.endDate).diff(travelStore.baseInfo.startDate, 'day')
					result.totalMoney = getAmount(
						result.confirmDailyCharge,
						result.feeNumber,
						result.feeModel
					)
					allFeesProducts.push(result)
					
				}
			} else if (res.productVos[i].itemId === 2) {
				
			} else if (res.productVos[i].itemId === 1) {
				
			}
				
		}
		if (travelStore.productList[0]?.productId) {
			travelStore.curentProduct = allFeesProducts.filter((it: any) => it.oid === travelStore.productList[0].productId);
		}else if (allFeesProducts.length >= 1) {
			console.log(allFeesProducts)
			travelStore.curentProduct = cloneDeep([allFeesProducts[0]]);
		} else {
			travelStore.curentProduct = [];
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
	list.travelOperatorList = [{
		oid: newVal.subTravelOperatorOid,
		username: newVal.subTravelOperatorName,
		mobile: newVal.subTravelOperatorPhone
	}];
	travelStore.setTeamType(travelStore.baseInfo.teamType);
})
watch(
	() => travelStore.teamType,
	(newVal) => {
		findByIdTeamType();
		
	}
);

watch(() => [formState.value.startDate, formState.value.endDate], ([newStar, newEnd]) => {
	console.log(newStar, newEnd)
	formState.value.time = newStar && newEnd ? [newStar, newEnd] : null
	handleChangeTime(formState.value.time);
})

getTeamTypeList();
getSubtravelList();
getTravelTemplateList();
</script>
<style lang="less" scoped>
	.base-info-container {
		padding: 0 20px;
	}
	.import-btn {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 10px;
	}
	.mb-2 {
		margin-bottom: 5px;
	}
</style>