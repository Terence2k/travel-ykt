<template>
	<BaseModal :modelValue="modelValue" title="行程单重提审核" @cancel="cancel" width="1000px">
		<FormWrap>
			<FormItem title="线路名称" :iValue="state.detail.teamTypeName" />
			<FormItem title="行程单编号" :iValue="state.detail.itineraryNo" />
			<FormItem title="线路名称" :iValue="state.detail.routeName" />
			<FormItem title="地接社" :iValue="state.detail.travelName" />
			<FormItem title="地接社计调" :iValue="'' + state.detail.travelOperatorName + state.detail.travelOperatorPhone" />
			<FormItem title="出散团时间" :iValue="state.detail.travelName" />
			<FormItem title="团客人数" :iValue="state.detail.travelName" />
			<FormItem title="古维减免人数" :iValue="state.detail.travelName" />
			<FormItem title="重提后变更人数" :iValue="state.detail.travelName" />
			<FormItem title="重提后变更人数" :iValue="state.detail.travelName" />
			<FormItem title="撤销原因" :iValue="state.detail.travelName" />
			<FormItem title="附件" :iValue="state.detail.travelName" />
		</FormWrap>
		<a-button @click="toCompare">去查看</a-button>
		<h3 class="tips">以下是撤销前、重提后的行程内容对比：</h3>

		<div class="table_box">
			<table class="info_table" cellpadding="16px" border="1">
				<tr class="row">
					<td class="key title">变更项目</td>
					<td class="key title">变更前内容</td>
					<td class="key title">变更后内容</td>
				</tr>
				<tr class="row">
					<td class="key">行程信息</td>
					<td class="value">
						<div style="margin-bottom: 20px">
							<p style="text-align: left; margin-bottom: 0px">酒店：</p>
							<!-- <p v-for="(item, index) in state.oldHotelList" :key="index">
								<span>{{ state.oldHotelList[index].hotelName }}，</span>
								<span v-for="(item, i) in state.oldHotelList[index].roomTypeList" :key="index">{{
									state.oldHotelList[index].roomTypeList[i].roomTypeName
								}}</span>
								<span>{{ state.oldHotelList[index].roomCount }}间</span>
								<span>{{ dayjs(state.oldHotelList[index].endDate).diff(state.oldHotelList[index].startDate, 'day') }}天，</span>
								<span
									>费用总计 <span style="color: red">{{ state.oldHotelList[index].orderFee / 100 }}</span
									>元；</span
								>
							</p> -->
						</div>
						<div>
							<p style="text-align: left; margin-bottom: 0px">景区：</p>
							<!-- <p v-for="(item, index) in state.oldTicketList" :key="index">
								<span>{{ state.oldTicketList[index].scenicName }}，</span>
								<span>{{ state.oldTicketList[index].ticketName }}</span>
								<span>{{ state.oldTicketList[index].reservePeopleCount }}张，</span>
								<span
									>费用总计
									<span style="color: red">{{ state.oldTicketList[index].reservePeopleCount * (state.oldTicketList[index].unitPrice / 100) }}</span
									>元；</span
								>
							</p> -->
						</div>
					</td>
					<td class="value">
						<div style="margin-bottom: 20px">
							<p style="text-align: left; margin-bottom: 0px">酒店：</p>
							<!-- <p v-for="(item, index) in state.newHotelList" :key="index">
								<span>{{ state.newHotelList[index].hotelName }}，</span>
								<span v-for="(item, i) in state.newHotelList[index].roomTypeList" :key="index">{{
									state.newHotelList[index].roomTypeList[i].roomTypeName
								}}</span>
								<span>{{ state.newHotelList[index].roomCount }}间</span>
								<span>{{ dayjs(state.newHotelList[index].endDate).diff(state.newHotelList[index].startDate, 'day') }}天，</span>
								<span
									>费用总计 <span style="color: red">{{ state.newHotelList[index].orderFee / 100 }}</span
									>元；</span
								>
							</p> -->
						</div>
						<div>
							<p style="text-align: left; margin-bottom: 0px">景区：</p>
							<!-- <p v-for="(item, index) in state.newTicketList" :key="index">
								<span>{{ state.newTicketList[index].scenicName }}，</span>
								<span>{{ state.newTicketList[index].ticketName }}</span>
								<span>{{ state.newTicketList[index].reservePeopleCount }}张，</span>
								<span
									>费用总计
									<span style="color: red">{{ state.newTicketList[index].reservePeopleCount * (state.newTicketList[index].unitPrice / 100) }}</span
									>元；</span
								>
							</p> -->
						</div>
					</td>
				</tr>
				<tr class="row">
					<td class="key">行程预冻结费用</td>
					<!-- <td class="value">
						<span style="color: red">{{ state.oldOrderAmount / 100 }}</span> 元
					</td>
					<td class="value">
						<span style="color: red">{{ state.newOrderAmount / 100 }}</span> 元
					</td> -->
				</tr>
			</table>
		</div>

		<template v-slot:footer>
			<div class="footer-wrap">
				<a-button @click="sendAudit(3)">驳回</a-button>
				<a-button type="primary" @click="sendAudit(2)">同意撤销</a-button>
			</div>
		</template>
	</BaseModal>
	<Compare ref="compareRef" />
</template>

<script lang="ts" setup>
import BaseModal from '@/components/common/BaseModal.vue';
import api from '@/api';
import { message } from 'ant-design-vue';
import FormWrap from '@/components/common/formWrap.vue';
import FormItem from '@/components/common/formItem.vue';
import Compare from './compare.vue';

import dayjs, { Dayjs } from 'dayjs';

const modelValue = ref(false);
const route = useRouter();

interface formType {
	data: {
		ticketId: null | number;
		ticketType: string;
		downReason: string;
		applyNum: null | number;
		dateList: any[];
	};
}

const formValidate = reactive<formType>({
	data: {
		ticketId: null,
		ticketType: 'UNITE',
		downReason: '',
		applyNum: null,
		dateList: [{ startDateTime: '', endDateTime: '', time: [] }],
	},
});
const state = reactive({
	detail: {
		teamTypeName: '',
		itineraryNo: '',
		routeName: '',
		travelName: '',
		travelOperatorName: '',
		travelOperatorPhone: '',
		subTravelName: '',
		endDate: '',
		touristCount: '',
		maintainFee: '',
		productFee: '',
		hotelFee: '',
		ticketFee: '',
		cateringFee: '',
	},
});

const formRef = ref();

const formRules: any = {
	time: [{ required: true, message: '请选择时间' }],
	applyNum: [{ required: true, message: '请填写' }],
};

const failURL = ref(
	'data:image/png;base64,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'
);

const props = defineProps({
	// modelValue: {
	// 	type: Boolean,
	// 	default: false,
	// },
});

const compareRef = ref();

const toCompare = () => {
	compareRef.value.open();
};

const closeCompare = () => {
	compareRef.value.cancle();
};

const addTimeList = () => {
	formValidate.data.dateList.push({ time: [] });
};

const del = (index: number) => {
	formValidate.data.dateList.splice(index, 1);
};

const sendAudit = (state: number) => {
	console.log(state, '驳会状态');
};

const apply = () => {
	formRef.value
		.validateFields()
		.then(async (res: any) => {
			cancel();
			message.success('改刷成功');
			// let params = formValidate.data;
			// params.dateList.map((i) => {
			// 	i.startDateTime = i.time[0];
			// 	i.endDateTime = i.time[1];
			// 	delete i.time;
			// 	return i;
			// });
			// console.log(res, params);
			// // let apiRes = api.scenicTicketDown(params);
			// console.log(apiRes, 'apiRes');
		})
		.catch((err: any) => {
			console.log(err);
		});
};
const toHistoryPage = () => {
	route.push('/scenic-spot/sold-out-history');
};
// 打开弹窗
const open = (id: number | null) => {
	modelValue.value = true;
	formValidate.data.ticketId = id;
};
// 关闭弹窗
const cancel = () => {
	modelValue.value = false;
	// formRef.value.resetFields();
	formValidate.data.dateList = [{ startDateTime: '', endDateTime: '', time: [] }];
	console.log(modelValue.value, 'modelValue');
};

defineExpose({
	open,
	close,
});
// const emit = defineEmits(['update:modelValue', 'cancel', 'onSearch']);
</script>

<style scoped lang="less">
.tips {
	margin: 20px 0;
}
.footer-wrap {
	display: flex;
	justify-content: space-evenly;
}
.table_box {
	max-height: 80vh;
	padding: 1px 0;
	overflow: auto;

	.row {
		width: 100%;
		font-size: 14px;
		font-family: Microsoft YaHei UI;
		font-weight: 400;
		color: #1e2226;
		border: 1px solid #e9e9e9;
		td {
			text-align: center;
		}
	}

	.change_table {
		width: 100%;

		.key,
		.key_hd {
			width: 150px;
		}

		.key_hd {
			background: rgba(245, 247, 250);
		}

		.value {
			min-width: 300px;
		}
	}

	.info_table {
		width: 100%;

		.key {
			width: 150px;
			background: rgba(245, 247, 250, 0.39);
		}
		.title {
			background: rgba(245, 247, 250);
		}
	}
}
</style>
