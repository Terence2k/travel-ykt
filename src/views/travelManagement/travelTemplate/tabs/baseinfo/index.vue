<template>
	<div class="warp">
		<div class="form_pad">
			<!-- 查看 -->
			<a-form v-if="route.query?.typei" labelAlign="left" :label-col="{ span: 3 }" :wrapper-col="{ span: 6 }">
				<a-form-item label="行程类型" name="teamType"> 标准团 </a-form-item>
				<a-form-item label="发团旅行社" name="a"> 黑白水国际旅行社 </a-form-item>
				<a-form-item label="做团人" name="a"> tutu发团人 </a-form-item>
				<a-form-item label="联系电话" name="a"> 133333333 </a-form-item>
				<a-form-item label="地接旅行社" name="a"> 地接旅行社 </a-form-item>
				<a-form-item label="地接计调" name="a"> 地接做团人 </a-form-item>
				<a-form-item label="联系电话" name="a"> 133333333 </a-form-item>
				<a-form-item label="模板名称" name="a"> 模板1 </a-form-item>
			</a-form>
			<!-- 新增 -->
			<a-form v-else labelAlign="left" ref="formRef" :model="formState" :rules="rulesRef" :label-col="{ span: 3 }" :wrapper-col="{ span: 6 }">
				<a-form-item label="模板名称" name="teamType">
					<a-input v-model:value="formState.teamType" />
				</a-form-item>
				<a-form-item label="行程类型" name="teamType">
					<a-radio-group v-model:value="formState.teamType" name="radioGroup" style="width: 100%">
						<a-row type="flex">
							<a-col :span="8" v-for="item in list.teamType" :key="item.oid" class="mb-2">
								<a-radio :value="item.oid">{{ item.name }}</a-radio>
							</a-col>
						</a-row>
					</a-radio-group>
				</a-form-item>
				<a-form-item label="发团旅行社" name="a">
					<a-input :placeholder="userInfo.sysCompany.name" disabled />
				</a-form-item>
				<a-form-item label="发团计调" name="a">
					<a-input :placeholder="userInfo.username" disabled />
				</a-form-item>
				<a-form-item label="计调电话" name="a">
					<a-input :placeholder="userInfo.mobile"  disabled/>
				</a-form-item>
				<a-form-item label="选择地接社" name="a">
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
				<a-form-item label="地接社计调" name="a">
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
				<a-form-item label="联系电话" name="a">
					<a-input v-model:value="formState.subTravelOperatorPhone" disabled />
				</a-form-item>
			</a-form>
		</div>
		<!-- <div class="footer">
			<a-button type="primary">保存</a-button>
		</div> -->
	</div>
</template>

<script setup lang="ts">
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import { getAmount, getUserInfo } from '@/utils/util';
import CommonSearch from '@/components/common/CommonSearch.vue';
import api from '@/api';
import { computed, reactive, ref, UnwrapRef, watch } from 'vue';
const route = useRoute();
const navigatorBar = useNavigatorBar();
const formRef = ref();

const props = defineProps({
	onCheck: {
		type: Boolean,
	},
});

interface TeamType {
	teamType: Array<any>;
	subTravelList: Array<any>;
	travelOperatorList: Array<any>;
}
const page = reactive({
	teamType: {
		pageNo: 1,
		pageSize: 10000,
	},
	subTravelList: {
		pageNo: 1,
		pageSize: 10000,
	},
});
const list = reactive<TeamType>({
	teamType: [],
	subTravelList: [],
	travelOperatorList: [],
});
let addParams: any = {};
if (route.query.id) {
} else {
	addParams = {
		oid: null,
		teamType: '1',
	};
}

const type = ref('');
const emits = defineEmits(['onSuccess']);
const formState = ref<{ [k: string]: any }>(addParams);

const getTeamTypeList = async () => {
	// page.teamType
	const res = await api.commonApi.getTeamTypeList();
	list.teamType = res;
};

const getSubtravelList = async () => {
	const res = await api.travelManagement.getSubtravelList(page.subTravelList);
	list.subTravelList = res.content;
}

const gettravelOperatorList = async (travelId: number, option: any) => {
	formState.value.subTravelOperatorOid = '';
	formState.value.subTravelName = option.name
	list.travelOperatorList = await api.travelManagement.gettravelOperatorList({travelId});
}
let userInfo: any = {}
userInfo = getUserInfo()
const onSubmit = async () => {
	try {
		const values = await formRef.value.validateFields();
		emits('onSuccess', { basicParam: formState.value });
	} catch (errorInfo) {
		emits('onSuccess', { basicParam: false });
	}
};

// 初始化
const initPage = async (): Promise<void> => {};

const rulesRef = {
	teamType: [{ required: true, message: '请选择行程类型' }],
	// travelName: [{ required: true, message: '请输入发团旅行社' }],
	contactPhone: [{ required: true, message: '请输入组团社联系电话' }],
	subTravelContactPhone: [{ required: true, message: '请输入地接社联系电话' }],
	travelOid: [{ required: true, message: '请选择组团社社' }],
	touristNum: [{ required: true, message: '请输入行程人数' }],
	// routeType: [{ required: true, message: '请选择线路类型' }],
	routeName: [{ required: true, message: '请选择或输入线路名称' }],
	// startDate: [{ required: true, message: '请选择行程开始时间' }],
	// endDate: [{ required: true, message: '请选择行程结束时间' }],
	time: [{ required: true, message: '请选择行程时间' }],
	subTravelOperatorOid: [{ required: true, message: '请选择计调' }],
	subTravelOid: [{ required: true, message: '请选择地接旅行社' }],
};
// const changeRadio = (event:any) =>  {
// 	travelStore.setTeamType(event.target.value);

// }
const handleChange = (event: any, option: any) => {
	formState.value.subTravelOperatorPhone = option.phone
	formState.value.subTravelOperatorName = option.name
}
onMounted(() => {
	if (route.query?.id) {
		navigatorBar.setNavigator(['行程模板管理', '新增']);
	} else {
		navigatorBar.setNavigator(['行程模板管理', '查看']);
	}
	initPage();
	getSubtravelList()
});
onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
});
watch(
	() => props.onCheck,
	(newVal) => {
		onSubmit();
	}
);
getTeamTypeList()
</script>

<style scoped lang="less">
.warp {
	width: 100%;
	box-sizing: border-box;
	header {
		// width: 64px;
		// margin-bottom: 8px;
		height: 56px;
		line-height: 56px;
		font-weight: bold;
		color: #1e2226;
		// margin: 0 8px 16px;
		margin-bottom: 16px;
		border-bottom: 1px solid #f1f2f5;
	}
	.title {
		height: 56px;
		line-height: 56px;
		font-weight: bold;
		color: #1e2226;
		// margin: 0 8px 16px;
		margin-bottom: 16px;
		border-bottom: 1px solid #f1f2f5;
	}
	.edit_btn {
		background-color: #5db179;
		color: white;
		border-radius: 5px;
	}

	.form_pad {
		padding: 0 16px 60px;
	}
	.footer {
		position: fixed;
		bottom: 11px;
		background-color: #fff;
		line-height: 64px;
		width: 83.5%;
		border-top: 1px solid #f1f2f5;
		button {
			margin-left: 20px;
		}
	}
}
</style>
