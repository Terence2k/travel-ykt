<template>
	<BaseModal :modelValue="modelValue" title="行程单整团撤销审核" @cancel="cancel" width="1000px">
		<FormWrap>
			<FormItem title="团队类型" :iValue="state.detail.teamTypeName" />
			<FormItem title="线路名称" :iValue="state.detail.routeName" />
			<FormItem title="行程单编号" :iValue="state.detail.itineraryNo" />
			<FormItem title="地接社" :iValue="state.detail.subTravelName" />
			<FormItem title="出散团时间" :iValue="'' + state.detail.startDate + '-' + state.detail.endDate" />
			<FormItem title="团客人数" :iValue="state.detail.originTouristCount + '人'" />
			<FormItem title="古维管理费" :iValue="'' + state.detail.maintainFee / 100 + '元'" />
			<FormItem title="综费产品" :iValue="state.detail.productFee" />

			<tr class="row">
				<td class="key">景区预定</td>
				<td class="value">
					<p v-for="(item, index) in state.detail.ticketList" :key="index">
						<span>{{ state.detail.ticketList[index].scenicName }}，</span>
						<span>{{ state.detail.ticketList[index].ticketName }}</span>
						<span>{{ state.detail.ticketList[index].reservePeopleCount }}张，</span>
						<span
							>费用总计
							<span style="color: red">{{
								state.detail.ticketList[index].reservePeopleCount * (state.detail.ticketList[index].unitPrice / 100)
							}}</span
							>元；</span
						>
					</p>
				</td>
			</tr>
			<tr class="row">
				<td class="key">酒店预定：</td>
				<td class="value">
					<div style="margin-bottom: 20px">
						<p v-for="(item, index) in state.detail.hotelList" :key="index">
							<span>{{ state.detail.hotelList[index].hotelName }}，</span>
							<span v-for="(item, i) in state.detail.hotelList[index].roomTypeList" :key="i">{{
								state.detail.hotelList[index].roomTypeList[i].roomTypeName
							}}</span>
							<span>{{ state.detail.hotelList[index].roomCount }}间</span>
							<span>{{ dayjs(state.detail.hotelList[index].endDate).diff(state.detail.hotelList[index].startDate, 'day') }}天，</span>
							<span
								>费用总计 <span style="color: red">{{ state.detail.hotelList[index].orderFee / 100 }}</span
								>元；</span
							>
						</p>
					</div>
				</td>
			</tr>

			<FormItem title="撤销原因" :iValue="state.detail.revokeReason" />
			<tr class="row">
				<td class="key">附件</td>
				<td class="value">
					<div style="margin-bottom: 20px">
						<p v-for="(item, index) in picList" :key="index">
							<a-image width="20%" :src="item" />
						</p>
					</div>
				</td>
			</tr>
		</FormWrap>

		<template v-slot:footer>
			<div class="footer-wrap">
				<a-button @click="cancel">取消</a-button>
			</div>
		</template>
	</BaseModal>
</template>

<script lang="ts" setup>
import BaseModal from '@/components/common/BaseModal.vue';
import api from '@/api';
import { message } from 'ant-design-vue';
import FormWrap from '@/components/common/formWrap.vue';
import FormItem from '@/components/common/formItem.vue';
import { Form } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';

const useForm = Form.useForm;
const modelValue = ref(false);
const route = useRouter();

const picList = computed(() => {
	return state.detail?.revokeAttachment?.split(',') || [];
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
//二次确定
const reRecokeAuditSureVisible = ref(false);
//驳回成功
const reRecokeAuditSuccessVisible = ref(false);
// 驳回
const reRecokeAuditVisible = ref(false);

const formValidate = reactive({
	data: {
		revokeReason: '',
	},
});

const { resetFields, validate, validateInfos, mergeValidateInfo, scrollToField } = useForm(
	formValidate,
	reactive({
		'data.revokeReason': [{ required: true, message: '请选择' }],
	})
);

const closeModel = () => {
	resetFields();
	reRecokeAuditVisible.value = false;
};

const formRef = ref();

const formRules: any = {
	time: [{ required: true, message: '请选择时间' }],
	applyNum: [{ required: true, message: '请填写' }],
};

const failURL = ref(
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=='
);

const props = defineProps({
	// modelValue: {
	// 	type: Boolean,
	// 	default: false,
	// },
});

const addTimeList = () => {
	formValidate.data.dateList.push({ time: [] });
};

const del = (index: number) => {
	formValidate.data.dateList.splice(index, 1);
};

const sendAudit = (state: number) => {
	console.log(state, '驳会状态');
	switch (state) {
		case 2:
			reRecokeAuditSureVisible.value = true;
			break;
		case 3:
			reRecokeAuditVisible.value = true;
			break;

		default:
			break;
	}
};
const idRec = ref<string | number | null>('');

const apply = async () => {
	validate()
		.then(async (res) => {
			let param = {
				status: -1,
				auditReason: formValidate.data.revokeReason,
				revokeId: idRec.value,
			};

			await api.travelManagement.revokeAudit(param);

			reRecokeAuditSuccessVisible.value = true;
			reRecokeAuditVisible.value = false;

			// route.push({ path: '/scenic-spot/singleVote/edit', query: { t: formValidate.data.revokeReason, s: 'new' } });
		})
		.catch((err) => {
			console.log('error', err);
		});
};

const sureAudit = async () => {
	let param = {
		status: 1,
		auditReason: formValidate.data.revokeReason,
		revokeId: idRec.value,
	};

	await api.travelManagement.revokeAudit(param);

	reRecokeAuditSuccessVisible.value = true;
	reRecokeAuditSureVisible.value = false;
};
const emits = defineEmits(['finish']);

const finish = () => {
	reRecokeAuditSuccessVisible.value = false;
	modelValue.value = false;
	emits('finish');
};

const toHistoryPage = () => {
	route.push('/scenic-spot/sold-out-history');
};
// 打开弹窗
const open = (id: number | null) => {
	modelValue.value = true;
	idRec.value = id;
	initInfo(id);
};

const initInfo = async (id: number | null) => {
	let res = await api.travelManagement.getAuditDetail(id);
	state.detail = res;
	console.log(res);
};
// 关闭弹窗
const cancel = () => {
	console.log('close');

	resetFields();
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
