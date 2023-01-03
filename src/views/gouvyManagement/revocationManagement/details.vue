<template>
	<BaseModal v-model="dialogVisible" :title="state.title" width="1000px">
		<p v-if="state.detail.itinerarySubmitRevokeBasicVo.itineraryRevokeAuditStatus == 3">
			{{ state.detail.itinerarySubmitRevokeBasicVo.revokeTime }}
			&nbsp;
			{{ state.detail.itinerarySubmitRevokeBasicVo.revokeTravel }}
			&nbsp;
			{{ state.detail.itinerarySubmitRevokeBasicVo.revokeUserName }}
			&nbsp; 撤销原始行程单，并重提了新行程单，待你审核
		</p>
		<p v-if="state.detail.itinerarySubmitRevokeBasicVo.itineraryRevokeAuditStatus == 0">
			{{ state.detail.itinerarySubmitRevokeBasicVo.revokeTime }}
			&nbsp;
			{{ state.detail.itinerarySubmitRevokeBasicVo.revokeTravel }}
			&nbsp;
			{{ state.detail.itinerarySubmitRevokeBasicVo.revokeUserName }}
			&nbsp; 申请整团撤销原始行程单。待您审核
		</p>
		<FormWrap>
			<FormItem title="线路名称" :i-value="state.detail.itinerarySubmitRevokeBasicVo.routeName" />
			<tr class="row">
				<td class="key">行程单编号</td>
				<td class="value">{{state.detail.itinerarySubmitRevokeBasicVo.itineraryNo}}
				<span class="td-span" @click="gotoDetails(state.detail.itinerarySubmitRevokeBasicVo.itineraryId)">查看行程单</span>
				</td>
			</tr>
			<FormItem title="地接社" :i-value="state.detail.itinerarySubmitRevokeBasicVo.subTravelName" />
			<FormItem
				title="出散团时间"
				:iValue="'' + state.detail.itinerarySubmitRevokeBasicVo.itineraryStartDate + '-' + state.detail.itinerarySubmitRevokeBasicVo.itineraryEndDate"
			/>
			<FormItem title="团客人数" :i-value="state.detail.itinerarySubmitRevokeBasicVo.touristNum + '人'" />
			<FormItem title="原始减免人数" :i-value="state.detail.itinerarySubmitRevokeBasicVo.originalReduceNum + '人'" />
			<FormItem
				title="古维管理费"
				:i-value="
					'' +
					state.detail.itinerarySubmitRevokeBasicVo.touristNum +
					'人' +
					'*' +
					accDiv(state.detail.itinerarySubmitRevokeBasicVo.unitPrice, 100) +
					'元' +
					'=' +
					accMul(state.detail.itinerarySubmitRevokeBasicVo.touristNum, accDiv(state.detail.itinerarySubmitRevokeBasicVo.unitPrice, 100)) +
					'元' +
					' (预计)'
				"
			/>
			<FormItem title="出票状态" :i-value="state.detail.itinerarySubmitRevokeBasicVo.issueStatusName" />
			<FormItem title="撤销时间" :i-value="state.detail.itinerarySubmitRevokeBasicVo.revokeTime" />
			<tr
				class="row"
				v-if="
					state.detail.itinerarySubmitRevokeBasicVo.itineraryRevokeAuditStatus == 3 ||
					state.detail.itinerarySubmitRevokeBasicVo.itineraryRevokeAuditStatus == 4||
					state.detail.itinerarySubmitRevokeBasicVo.itineraryRevokeAuditStatus == 5
				"
			>
				<td class="key">重提后变更人数</td>
				<td class="value">
						{{ state.detail.itinerarySubmitRevokeBasicVo.peopleChangeCount }}人
						<span @click="toCompare" class="td-span"> 查看对比</span>
				</td>
			</tr>
			<FormItem title="撤销原因" :i-value="state.detail.itinerarySubmitRevokeBasicVo.revokeReason" />

			<tr class="row">
				<td class="key">附件</td>
				<td class="value">
					<Upload v-model="state.detail.itinerarySubmitRevokeBasicVo.revokeAttachment" :maxCount="state.maxnum" disabled />
				</td>
			</tr>
			<FormItem
				title="审核结果"
				v-if="
					state.detail.itinerarySubmitRevokeBasicVo.itineraryRevokeAuditStatus == 1||
					state.detail.itinerarySubmitRevokeBasicVo.itineraryRevokeAuditStatus == 4
				"
				:i-value="'审核通过'"
			/>
			<FormItem
				title="审核结果"
				v-if="
					state.detail.itinerarySubmitRevokeBasicVo.itineraryRevokeAuditStatus == 2||
					state.detail.itinerarySubmitRevokeBasicVo.itineraryRevokeAuditStatus == 5
				"
				:i-value="'' + '[驳回]：驳回原因：' + state.detail.itinerarySubmitRevokeBasicVo.auditRemark"
			/>
		</FormWrap>
		<template v-slot:footer>
			<div class="footer-wrap">
				<a-button @click="FailedDialogVisible = true" v-if="
						state.detail.itinerarySubmitRevokeBasicVo.itineraryRevokeAuditStatus == 0 ||
						state.detail.itinerarySubmitRevokeBasicVo.itineraryRevokeAuditStatus == 3
					">驳回</a-button>
				<a-button
					type="primary"
					@click="AuditAdopt"
					v-if="
						state.detail.itinerarySubmitRevokeBasicVo.itineraryRevokeAuditStatus == 0 ||
						state.detail.itinerarySubmitRevokeBasicVo.itineraryRevokeAuditStatus == 3
					"
					>同意撤销</a-button
				>
				<a-button type="primary" @click="dialogVisible = false">关闭</a-button>
			</div>
		</template>
	</BaseModal>
	<BaseModal title="审核不通过说明" v-model="FailedDialogVisible">
		<a-form ref="formRef" :rules="rules" :model="state">
			<a-form-item label="原因" name="refuesedReason">
				<a-textarea placeholder="审核不通过原因" v-model:value="state.refuesedReason" :rows="4" />
			</a-form-item>
		</a-form>
		<template v-slot:footer>
			<a-button type="primary" @click="cancel">关闭</a-button>
			<a-button type="primary" style="width: 120px" @click="auditFailed">确认审核不通过</a-button>
		</template>
	</BaseModal>
	<BaseModal  v-model="comparison" width="800px">
		<div class="div">
			<a-button type="primary" @click="comparison=false">返回</a-button>
			<p>全部游客{{state.data.length}}名,撤销后变更{{state.num}}人</p>
		</div>
		<CommonTable :dataSource="state.data" :columns="columns" :scrollY="false" style="padding: 0 0;">
			<template #bodyCell="{ column, index, record }">
				<template v-if="column.key === 'isChange'">
					<a-span v-if="(record.isChange==true)">是</a-span>
					<a-span v-else>否</a-span>
				</template>
			</template>
		</CommonTable>
		<template v-slot:footer>
		</template>
	</BaseModal>
	<!-- <Compare ref="compareRef" /> -->
</template>

<script lang="ts" setup>
import BaseModal from '@/components/common/BaseModal.vue';
import api from '@/api';
import { message } from 'ant-design-vue';
import FormWrap from '@/components/common/formWrap.vue';
import FormItem from '@/components/common/formItem.vue';
// import Compare from './components/compare.vue';
import { accDiv, accMul } from '@/utils/compute';
import CommonTable from '@/components/common/CommonTable.vue';
import Upload from '@/components/common/imageWrapper.vue';
import dayjs, { Dayjs } from 'dayjs';
import { string } from 'vue-types';
const dialogVisible = ref(false);
const FailedDialogVisible = ref(false);
const modelValue = ref(false);
const comparison =ref(false)
const route = useRouter();
const emit = defineEmits(['update:modelValue', 'cancel', 'onSearchList']);
const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	oid: string,
});
const state = reactive({
	detail: {
		itinerarySubmitRevokeBasicVo: {} as any,
		submitRevokeNewItineraryInfoVo: {},
		submitRevokeOldItineraryInfoVo: {},
	},
	title: '',
	refuesedReason: '',
	data:[],
	num:'',
	maxnum:0
});
const columns = [
	{
		title: '游客姓名',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: '身份证号码',
		dataIndex: 'certificateNo',
		key: 'certificateNo',
	},
	{
		title: '性别',
		dataIndex: 'genderName',
		key: 'genderName',
	},
	{
		title: '年龄',
		dataIndex: 'age',
		key: 'age',
	},
	{
		title: '联系方式',
		dataIndex: 'emergencyContactPhone',
		key: 'emergencyContactPhone',
	},
	{
		title: '客源地',
		dataIndex: 'sourceAddressName',
		key: 'sourceAddressName',
	},
	{
		title: '费用减免类型',
		dataIndex: 'specialCertificateTypeName',
		key: 'specialCertificateTypeName',
	},
    {
		title: '是否为变更后新增',
		dataIndex: 'isChange',
		key: 'isChange',
	}
];
const formRef = ref();
const rules: any = {
	refuesedReason: [{ required: true, trigger: 'blur', message: '请输入审核不通过原因' }],
};
const formRules: any = {
	time: [{ required: true, message: '请选择时间' }],
	applyNum: [{ required: true, message: '请填写' }],
};

const compareRef = ref();

const toCompare = () => {
	comparison.value=true
	queryRevokeTouristCompare()
};
const queryRevokeTouristCompare=()=>{
	api.queryRevokeTouristCompare(state.detail.itinerarySubmitRevokeBasicVo.revokeRecordId).then((res: any)=>{
		state.data=res.newTouristList
		let num=res.newTouristList.map((i)=>{
			return i.isChange==true
		})
		state.num=num.length
	})
}
const closeCompare = () => {
	compareRef.value.cancle();
};
const AuditAdopt = () => {
	api.itineraryRevokeAuditAdopt(state.detail.itinerarySubmitRevokeBasicVo.itineraryNo).then((res: any) => {
		message.success('审核通过');
		dialogVisible.value=false
	});
};
const auditFailed = () => {
	let data = {
		itineraryNo: state.detail.itinerarySubmitRevokeBasicVo.itineraryNo,
		refuesedReason:state.refuesedReason,
	};
	formRef.value.validateFields().then((values: any) => {
		api.itineraryRevokeAuditFailed(data).then((res: any) => {
			message.error('已驳回');
			cancel();
			dialogVisible.value=false
		});
	});
};
const cancel = () => {
	FailedDialogVisible.value = false;
	state.refuesedReason = '';
};
const toHistoryPage = () => {
	route.push('/scenic-spot/sold-out-history');
};

const init = async () => {
	let res = await api.itineraryRevoke(props.oid);
	state.detail.itinerarySubmitRevokeBasicVo = res;
	if(res.revokeAttachment)
	{
		state.detail.itinerarySubmitRevokeBasicVo.revokeAttachment=res.revokeAttachment.toString()
    state.maxnum=res.revokeAttachment.split(',').length
	}
	if (res.itineraryRevokeAuditStatus == 0) {
		state.title = '行程单整团撤销审核';
	}
	if (res.itineraryRevokeAuditStatus == 1 ||res.itineraryRevokeAuditStatus == 2) {
		state.title = '行程单整团撤销审核审核详情';
	}
	if (res.itineraryRevokeAuditStatus == 3) {
		state.title = '行程单撤销重提审核';
	}
	if (res.itineraryRevokeAuditStatus === 5 ||res.itineraryRevokeAuditStatus == 4) {
		state.title = '行程单撤销重提审核详情';
	}
};
const gotoDetails=(oid:any)=>{
	route.push({
		path: '/travel/travel_manage/travel_detail',
		query: {
			oid:oid,
		},
	});
}
defineExpose({
	close,
});
watch(
	() => props.modelValue,
	async (nVal) => {
		dialogVisible.value = nVal;
		if (dialogVisible.value) {
			init();
		}
	}
);
watch(dialogVisible, (nVal) => {
	emit('update:modelValue', nVal);
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
.div{
	width: 95%;
	display: flex;
	justify-content: space-between;
	margin-bottom: 20px;
}
.td-span{
	color: rgb(2, 167, 240);
	margin-left: 30px;
	cursor: pointer;
}
</style>
