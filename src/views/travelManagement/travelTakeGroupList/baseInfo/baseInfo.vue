<template>
	<div class="base-info-container">
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
				<span>{{formState.routeName}}</span>
			</a-form-item>
			<a-form-item label="行程类型" name="teamType">
				<span>{{formState.teamTypeName}}</span>
			</a-form-item>

			<a-form-item label="组团社（发团）" name="travelName">
				<span>{{formState.travelName}}</span>
			</a-form-item>

			<a-form-item label="组团社计调">
				<span>{{formState.travelOperatorName}}</span>
			</a-form-item>

			<a-form-item label="组团社计调电话" name="travelOperatorPhone">
				<span>{{formState.travelOperatorPhone}}</span>
			</a-form-item>
			<!--  v-if="teamGroupType === GroupMode.TeamGroup" -->
			<div>
				<a-form-item label="地接旅行社" name="subTravelOid">
					<span>{{formState.subTravelName}}</span>
				</a-form-item>

				<a-form-item label="地接计调" name="subTravelOperatorOid">
					<span>{{formState.subTravelOperatorName}}</span>
				</a-form-item>

				<a-form-item label="地接社计调电话" name="subTravelOperatorPhone">
					<span>{{formState.subTravelOperatorPhone}}</span>
				</a-form-item>
			</div>

			<a-form-item label="游客人数" name="touristNum">
				<span>{{formState.touristCount}}</span>
			</a-form-item>
			<a-form-item label="行程时间" name="time">
				<span>{{formState.startDate}}~{{formState.endDate}}</span>
				<span>修改时间</span>
				<!-- <a-range-picker
					style="width: 100%"
					@change="handleChangeTime"
					:disabled-date="disabledDate"
					v-model:value="formState.time"
					show-time
					format="YYYY-MM-DD HH:mm:ss"
					value-format="YYYY-MM-DD HH:mm:ss"
				/> -->
			</a-form-item>

			<a-form-item label="行程单号" name="teamId">
				<span>{{formState.itineraryNo}}</span>
			</a-form-item>
			<a-form-item label="行程当前状态" name="teamId">
				<span>{{formState.statusName}}</span> </a-form-item>
			<a-form-item label="关联行程单" name="teamId">
				<!-- <span>{{formState}}</span> -->
			</a-form-item>
		</a-form>
	</div>
</template>

<script lang="ts" setup>
import { getAmount, getUserInfo } from '@/utils/util';
import { ConfirmDailyCharge, FeeModel, GroupMode, RouteType } from '@/enum';
import api from '@/api/index';
import { useTravelStore } from '@/stores/modules/travelManagementDetail';
import dayjs, { Dayjs } from 'dayjs';
import { cloneDeep } from 'lodash';

interface TeamType {
	teamType: Array<any>;
	subTravelList: Array<any>;
	travelOperatorList: Array<any>;
}

const travelStore = useTravelStore();
// const touristCount = computed(() => (travelStore.touristList.length ? travelStore.touristList.length.toString() : 0));
const route = useRoute();
const list = reactive<TeamType>({
	teamType: [],
	subTravelList: [],
	travelOperatorList: [],
});
const formRef = ref();

const props = defineProps({
	onCheck: {
		type: Boolean,
	},
});

const emits = defineEmits(['onSuccess']);
const rulesRef = {
	time: [{ required: true, message: '请选择行程时间' }]
};

const formState = computed(() => travelStore.baseInfo);


const onSubmit = async () => {
	try {
		const values = await formRef.value.validateFields();
		// formState.value.touristNum = touristCount.value;
		// emits('onSuccess', { basicParam: formState.value });
	} catch (errorInfo) {
		emits('onSuccess', { basicParam: { valid: false, message: '请先填写基础信息', index: 0 } });
	}
};
const handleChangeTime = (event: any) => {
	// let dis = null;
	// if (event) {
	// 	formState.value.startDate = event[0];
	// 	formState.value.endDate = event[1];
	// 	dis = (current: Dayjs) => {
	// 		return (dayjs(event[0]) && dayjs(event[0]) > current && current) || (dayjs(event[1]) && dayjs(event[1]).add(1, 'day') < current && current);
	// 	};
	// } else {
	// 	formState.value.startDate = '';
	// 	formState.value.endDate = '';
	// 	dis = (current: Dayjs) => {
	// 		return (current && current < dayjs().endOf('day')) || current > dayjs().startOf('day');
	// 	};
	// }

	// travelStore.setDisabled = dis as any;
	// travelStore.teamTime = event;
};


const findByIdTeamType = async () => {
	// if (!travelStore.teamType) return;
	// const formData = new FormData();
	// formData.append('id', travelStore.teamType);
	// if (travelStore.teamType) {
	// 	let allFeesProducts = [];
	// 	const res = await api.travelManagement.findByIdTeamType(formData);

	// 	for (let i = 0; i < res.productVos.length; i++) {
	// 		// 综费产品itemId为4
	// 		if (res.productVos[i].itemId === 4) {
	// 			if (!res.productVos[i].productId) {
	// 				const res = await api.travelManagement.comprehensiveFeeProduct({
	// 					pageNo: 1,
	// 					pageSize: 99999,
	// 					status: 1,
	// 				});
	// 				allFeesProducts = res.content;
	// 			} else {
	// 				const result = await api.travelManagement.findProductInfo(res.productVos[i].productId);
	// 				result.peopleCount = travelStore.touristList.length;
	// 				result.unPrice = result.feeNumber;
	// 				result.isDay = true;
	// 				result.dayCount = dayjs(travelStore.baseInfo.endDate).diff(travelStore.baseInfo.startDate, 'day');
	// 				result.totalMoney = getAmount(result.confirmDailyCharge, result.feeNumber, result.feeModel);
	// 				allFeesProducts.push(result);
	// 			}
	// 		} else if (res.productVos[i].itemId === 2) {
	// 		} else if (res.productVos[i].itemId === 1) {
	// 		}
	// 	}
	// 	if (allFeesProducts.length === 1) {
	// 		travelStore.curentProduct = cloneDeep(allFeesProducts);
	// 	}

	// 	travelStore.setCompositeProducts(allFeesProducts);
	// }
};
// watch(
// 	() => props.onCheck,
// 	(newVal) => {
// 		onSubmit();
// 	}
// );
// watch(
// 	() => travelStore.baseInfo,
// 	(newVal) => {
// 		formState.value = newVal;
// 		console.log(newVal);
// 		if (route.query.id) {
// 			list.travelOperatorList = [
// 				{
// 					oid: newVal.subTravelOperatorOid,
// 					username: newVal.subTravelOperatorName,
// 					mobile: newVal.subTravelOperatorPhone,
// 				},
// 			];
// 			travelStore.setTeamType(travelStore.baseInfo.teamType);
// 		}
// 	}
// );
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
