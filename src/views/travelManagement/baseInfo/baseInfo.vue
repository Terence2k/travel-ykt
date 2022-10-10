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
			:wrapper-col="{ span: 6 }"
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
					<a-radio :value="item.oid" v-for="item in list.teamType" :key="item.oid">{{item.name}}</a-radio>
				</a-radio-group>
			</a-form-item>

			<a-form-item label="组团社（发团）" name="travelName">
				<a-input v-model:value="formState.travelName" disabled />
			</a-form-item>

			<a-form-item label="组团社计调">
				<a-select v-model:value="formState.travelOperatorOid" placeholder="请选择组团社做团人" disabled>
					<a-select-option :value="userInfo.oid">{{userInfo.username}}</a-select-option>
				</a-select>
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
				<a-select v-model:value="formState.subTravelOperatorOid" placeholder="请选择地接做团人">
					<a-select-option 
						:value="item.oid" 
						v-for="item in list.travelOperatorList" 
						:key="item.oid">
						{{item.username}}
					</a-select-option>
				</a-select>
			</a-form-item>

			<a-form-item label="地接社计调电话" name="subTravelContactPhone">
				<a-input v-model:value="formState.subTravelContactPhone" />
			</a-form-item>

			<a-form-item label="行程人数" name="touristNum">
				<a-input v-model:value="formState.touristNum" plcaeholder="单位：人" />
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

interface FormState {
	groupType: any;
	contactPhone: string;
	subTravelOperatorOid: string;
	travelOid: string;
	touristNum: number | string;
	subTravelContactPhone: string;
	routeName: string;
	endDate: string;
	startDate: string;
	teamId: string;
	teamType: string;
	subTravelOid: string;
	travelName: string;
	travelOperatorOid: string | number;
	routeType: string | number
}
interface TeamType {
	teamType: Array<any>;
	subTravelList: Array<any>;
	travelOperatorList: Array<any>;
}

const route = useRoute()
const userInfo = getUserInfo()
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

const formState = reactive<FormState>({
	groupType: route.query.type,
	contactPhone: userInfo.mobile,
	subTravelOperatorOid: '',
	travelOid: userInfo.sysCompany.oid,
	travelOperatorOid: userInfo.oid,
	touristNum: '',
	subTravelContactPhone: '',
	routeName: '',
	endDate: '',
	startDate: '',
	teamId: '',
	teamType: '',
	subTravelOid: '',
	routeType: 1,
	travelName: userInfo.sysCompany.name
});
const onFinish = (values: any) => {
	console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
	console.log('Failed:', errorInfo);
};
const onSubmit = async () => {
	try {
		const values = await formRef.value.validateFields()
		emits('onSuccess', {basicParam: formState});
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
watch(() => props.onCheck, (newVal) => {
	onSubmit()
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
</style>