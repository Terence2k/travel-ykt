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
			<a-form-item
			label="行程类型"
			name="teamType"
			>
			<!-- <a-input v-model:value="formState.username" /> -->
				<a-radio-group v-model:value="formState.teamType" name="radioGroup">
					<a-radio :value="item.oid" v-for="item in list.teamType" :key="item.oid">{{item.name}}</a-radio>
				</a-radio-group>
			</a-form-item>

			<a-form-item label="发团旅行社" name="username">
				<a-input v-model:value="formState.username" disabled />
			</a-form-item>

			<a-form-item label="做团人">
				<a-select v-model:value="formState.travelOid" placeholder="请选择组团社做团人">
					<a-select-option value="lucy">Lucy</a-select-option>
				</a-select>
			</a-form-item>

			<a-form-item label="联系电话" name="contactPhone">
				<a-input v-model:value="formState.contactPhone" />
			</a-form-item>

			<a-form-item label="地接旅行社" name="subTravelOid">
				<a-select v-model:value="formState.subTravelOid" placeholder="请选择地接旅行社" @change="gettravelOperatorList">
					<a-select-option :value="item.oid" v-for="item in list.subTravelList" :key="item.oid">{{item.name}}</a-select-option>
				</a-select>
			</a-form-item>

			<a-form-item label="地接计调">
				<a-select v-model:value="formState.subTravelOperatorOid" placeholder="请选择地接做团人">
					<a-select-option 
						:value="item.oid" 
						v-for="item in list.travelOperatorList" 
						:key="item.oid">
						{{item.username}}
					</a-select-option>
				</a-select>
			</a-form-item>

			<a-form-item label="联系电话" name="subTravelContactPhone">
				<a-input v-model:value="formState.subTravelContactPhone" />
			</a-form-item>

			<a-form-item label="行程人数" name="touristNum">
				<a-input v-model:value="formState.touristNum" plcaeholder="单位：人" />
			</a-form-item>

			<a-form-item label="线路类型" name="routeType">
				<a-radio-group v-model:value="formState.routeType" name="radioGroup">
					<a-radio value="1">线路模版</a-radio>
					<a-radio value="2">自定义线路</a-radio>
				</a-radio-group>
			</a-form-item>

			<a-form-item label="线路名称" name="routeName">
				<a-select v-model:value="formState.routeName" placeholder="请选择线路名称">
					<a-select-option value="lucy">Lucy</a-select-option>
				</a-select>
			</a-form-item>

			<a-form-item label="* 行程时间">
				<div class="d-flex align-item-center">
					<a-form-item name="startDate" style="margin-bottom: 0">
						<a-date-picker :show-time="{ format: 'HH:mm' }" v-model:value="formState.startDate" /> 
					</a-form-item >
					<span class="flex-1 text-center"> 至 </span> 
					<a-form-item name="endDate" style="margin-bottom: 0"> 
						<a-date-picker  :show-time="{ format: 'HH:mm' }" v-model:value="formState.endDate" />
					</a-form-item>
				</div>
			</a-form-item>

			<a-form-item label="行程单号" name="teamId">
				<a-input v-model:value="formState.teamId" disabled />
			</a-form-item>

			<!-- <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
			<a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
			</a-form-item>

			<a-form-item :wrapper-col="{ offset: 8, span: 16 }">
			<a-button type="primary" html-type="submit">Submit</a-button>
			</a-form-item> -->
		</a-form>
	</div>
</template>

<script lang="ts" setup>
import api from '@/api/index';
interface FormState {
	username: string;
	contactPhone: string;
	remember: boolean;
	subTravelOperatorOid: string;
	travelOid: string;
	touristNum: number | string;
	subTravelContactPhone: string;
	routeType: string;
	routeName: string;
	endDate: string;
	startDate: string;
	teamId: string;
	teamType: string;
	subTravelOid: string;
}
interface TeamType {
	teamType: Array<any>;
	subTravelList: Array<any>;
	travelOperatorList: Array<any>;
}
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

const onSubmit = async () => {
	try {
		const values = await formRef.value.validateFields()
		console.log('Success:', values);
	} catch (errorInfo) {
		console.log('Failed:', errorInfo);
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
	console.log(newVal)
	onSubmit()
})

const rulesRef = {
	teamType: [{ required: true, message: '请选择行程类型' }],
	username: [{ required: true, message: '请输入发团旅行社' }],
	contactPhone: [{ required: true, message: '请输入组团社联系电话' }],
	subTravelContactPhone: [{ required: true, message: '请输入地接社联系电话' }],
	travelOid: [{ required: true, message: '请选择组团社社'}],
	touristNum: [{ required: true, message: '请输入行程人数' }],
	routeType: [{ required: true, message: '请选择线路类型' }],
	routeName: [{ required: true, message: '请选择线路名称' }],
	startDate: [{ required: true, message: '请选择行程开始时间' }],
	endDate: [{ required: true, message: '请选择行程结束时间' }],
	teamId: [{ required: true, message: '请输入行程单号' }],
	subTravelOid: [{ required: true, message: '请选择地接旅行社'}]
};

const formState = reactive<FormState>({
	username: '1',
	contactPhone: '',
	remember: true,
	subTravelOperatorOid: '',
	travelOid: '',
	touristNum: '',
	subTravelContactPhone: '',
	routeType: '',
	routeName: '',
	endDate: '',
	startDate: '',
	teamId: '',
	teamType: '',
	subTravelOid: ''
});
const onFinish = (values: any) => {
	console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
	console.log('Failed:', errorInfo);
};
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