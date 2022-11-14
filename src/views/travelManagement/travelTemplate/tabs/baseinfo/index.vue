<template>
	<div class="warp">
		<div class="form_pad">
			<a-form labelAlign="left" ref="formRef" :model="formState" :rules="rulesRef" :label-col="{ span: 3 }" :wrapper-col="{ span: 6 }">
				<a-form-item label="模板名称" v-if="route.query?.Cinfo">
					{{ formState.routeName }}
				</a-form-item>
				<a-form-item label="模板名称" name="routeName" v-else>
					<a-input v-model:value="formState.routeName" />
				</a-form-item>
				<a-form-item label="行程类型" v-if="route.query?.Cinfo">
					{{ formState.teamTypeName }}
				</a-form-item>
				<a-form-item label="行程类型" v-else name="teamType">
					<a-radio-group v-model:value="formState.teamType" name="radioGroup" style="width: 100%">
						<a-row type="flex">
							<a-col :span="8" v-for="item in list.teamType" :key="item.oid" class="mb-2">
								<a-radio :value="item.oid">{{ item.name }}</a-radio>
							</a-col>
						</a-row>
					</a-radio-group>
				</a-form-item>
				<a-form-item label="发团旅行社">
					<a-input v-model:value="formState.travelName" disabled />
				</a-form-item>
				<a-form-item label="发团计调">
					<a-input v-model:value="formState.travelOperatorName" disabled />
				</a-form-item>
				<a-form-item label="计调电话">
					<a-input v-model:value="formState.travelOperatorPhone" disabled />
				</a-form-item>
				<a-form-item label="地接社" v-if="route.query?.Cinfo">
					{{ formState.subTravelName }}
				</a-form-item>
				<a-form-item v-else label="选择地接社" name="subTravelOid">
					<a-select
						v-model:value="formState.subTravelOid"
						placeholder="请选择地接旅行社"
						@change="(val: any, option: any) => gettravelOperatorList(val, option)"
					>
						<a-select-option :value="item.oid" :name="item.name" v-for="item in list.subTravelList" :key="item.oid">
							{{ item.name }}
						</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item label="地接社计调" v-if="route.query?.Cinfo">
					{{ formState.subTravelOperatorName }}
				</a-form-item>
				<a-form-item label="地接社计调" v-else name="subTravelOperatorOid">
					<a-select
						v-model:value="formState.subTravelOperatorOid"
						@change="handleChange"
						placeholder="请先选择地接社"
						:disabled="formState.subTravelName == ''"
					>
						<a-select-option :value="item.oid" v-for="item in list.travelOperatorList" :key="item.oid" :name="item.username" :phone="item.mobile">
							{{ item.username }}
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
import { useTravelStore } from '@/stores/modules/travelManagement';
import { computed, reactive, ref, UnwrapRef, watch } from 'vue';
const travelStore = useTravelStore();
const route = useRoute();
const navigatorBar = useNavigatorBar();
const formRef = ref();

const props = defineProps({
	onCheck: {
		type: Boolean,
	},
});
const touristCount = computed(() => (travelStore.touristList.length ? travelStore.touristList.length.toString() : 0));

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
const emits = defineEmits(['onSuccess']);
const teamGroupType = computed(() => {
	if (route.query.type) {
		return Number(route.query.type);
	} else {
		return travelStore.baseInfo.groupType;
	}
});
let userInfo: any = {};
userInfo = getUserInfo();

let addParams: any = {
	oid: '',
	routeName: '',
	travelName: userInfo.sysCompany.name,
	travelOperatorName: userInfo.username,
	travelOperatorPhone: userInfo.mobile,
	travelOperatorOid: userInfo.oid,
	travelOid: userInfo.sysCompany.oid,
	subTravelOid: '',
	subTravelName: '',
	subTravelOperatorOid: '',
	subTravelOperatorPhone: '',
};
// if (route.query.oid) {
// 	addParams.oid = route.query.oid
// }
const formState = ref<{ [k: string]: any }>(route.query.oid ? computed(() => travelStore.baseInfo) : addParams);

const getTeamTypeList = async () => {
	// page.teamType
	const res = await api.commonApi.getTeamTypeList();
	list.teamType = res;
};

const getSubtravelList = async () => {
	const res = await api.travelManagement.getSubtravelList(page.subTravelList);
	list.subTravelList = res.content;
};

const gettravelOperatorList = async (travelId: number, option: any) => {
	formState.value.subTravelOperatorOid = '';
	formState.value.subTravelName = option.name;
	list.travelOperatorList = await api.travelManagement.gettravelOperatorList({ travelId });
};

const onSubmit = async () => {
	try {
		const values = await formRef.value.validateFields();
		emits('onSuccess', { basicParam: formState.value });
	} catch (errorInfo) {
		emits('onSuccess', { basicParam: { valid: false, message: '请先填写基础信息', index: 0 } });
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
	// routeType: [{ required: true, message: '请选择线路类型' }],
	routeName: [{ required: true, message: '请选择模板名称' }],
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
	formState.value.subTravelOperatorPhone = option.phone;
	formState.value.subTravelOperatorName = option.name;
};
onMounted(() => {
	if (route.query?.id) {
		navigatorBar.setNavigator(['行程模板管理', '新增']);
	} else {
		navigatorBar.setNavigator(['行程模板管理', '查看']);
	}
	initPage();
	getSubtravelList();
});
onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
});
watch(
	() => travelStore.baseInfo,
	(newVal) => {
		formState.value = newVal;
		console.log(newVal);
		if (route.query.oid) {
			formState.value.oid = route.query.oid
			list.travelOperatorList = [
				{
					oid: newVal.subTravelOperatorOid,
					username: newVal.subTravelOperatorName,
					mobile: newVal.subTravelOperatorPhone,
				},
			];
			travelStore.setTeamType(travelStore.baseInfo.teamType);
		}
	}
);
watch(
	() => props.onCheck,
	(newVal) => {
		onSubmit();
	}
);
getTeamTypeList();
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
