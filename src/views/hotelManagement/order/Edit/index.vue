<template>
	<div class="warp">
		<div class="trave-contaner">
			<a-tabs v-model:activeKey="activeKey">
				<a-tab-pane key="1" tab="订单信息" force-render>
					<div class="form_pad">
						<header>行程信息</header>
						<a-form name="basic" labelAlign="left" :label-col="{ span: 3 }" :wrapper-col="{ span: 6 }">
							<a-form-item label="行程类型"> {{ state.data.teamType }} </a-form-item>
							<a-form-item label="行程单号"> {{ state.data.itineraryNo }} </a-form-item>
							<a-form-item label="发团旅行社"> {{ state.data.travelName }} </a-form-item>
							<a-form-item label="接团旅行社"> {{ state.data.subTravelName }} </a-form-item>
							<a-form-item label="行程时间"> {{ state.data.arrivalDate }} - {{ state.data.departureDate }} </a-form-item>
							<a-form-item label="行程人数"> {{ state.data.tripNumber }} </a-form-item>
							<a-form-item label="预定人数"> {{ state.data.scheduledNumber }} </a-form-item>
							<a-form-item label="预定房数"> {{ state.data.scheduledRooms }} </a-form-item>

							<div class="title">订房信息</div>
							<CommonTable :columns="columns" :dataSource="state.data.hotelTypeList" :scrollY="false">
								<template #bodyCell="{ column, index,record}">
									<template v-if="column.key === 'index'">
										<div>
											{{ index + 1 }}
										</div>
									</template>
									<template v-if="column.key === 'orderAmount'">
										<div>
											{{accDiv( record.orderAmount,100)}}
										</div>
									</template>
									<template v-if="column.key === 'Subtotal'">
										<div>
											{{accDiv(accMul( record.orderAmount,record.reserveNumber),100)}}
										</div>
									</template>
									</template
								>
							</CommonTable>
						</a-form>
					</div>
				</a-tab-pane>
			</a-tabs>
		</div>
		<BaseModal :title="'审核'" v-model="visible">
			<a-form ref="formRef" :model="state.formdata" :rules="rules">
				<a-form-item label="状态" name="flag">
					<a-radio-group v-model:value="state.formdata.flag">
						<a-radio :value="true">通过</a-radio>
						<a-radio :value="false">不通过</a-radio>
					</a-radio-group>
				</a-form-item>
				<a-form-item label="原因" v-if="state.formdata.flag === false" name="rejectReason">
					<a-textarea placeholder="审核不通过原因" :rows="4" v-model:value="state.formdata.rejectReason" />
				</a-form-item>
			</a-form>
			<template v-slot:footer>
				<a-button type="primary" @click="success">确认</a-button>
				<a-button style="width: 76px" @click="resetForm">关闭</a-button>
			</template>
		</BaseModal>
		<div class="footer">
			<a-button type="primary" v-if="state.data.auditStatus == 1" @click="auditing()">审核</a-button>
			<a-button @click="notAuditing()">返回</a-button>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import { onMounted, reactive, toRaw, UnwrapRef, watch, ref } from 'vue';
import BaseModal from '@/components/common/BaseModal.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import api from '@/api';
import type { Rule } from 'ant-design-vue/es/form';
import { message } from 'ant-design-vue';
import CommonTable from '@/components/common/CommonTable.vue';
import { accDiv,accMul} from '@/utils/compute';

const router = useRouter();
const navigatorBar = useNavigatorBar();

const route = useRoute();
const visible = ref(false);
const activeKey = ref('1');
const formRef = ref();
const formState = ref();
const columns = [
	{
		title: '序号',
		dataIndex: 'index',
		key: 'index',
	},
	{
		title: '房间类型',
		dataIndex: 'roomTypeName',
		key: 'roomTypeName',
	},
	{
		title: '单价',
		dataIndex: 'orderAmount',
		key: 'orderAmount',
	},
	{
		title: '预定数量(标)',
		dataIndex: 'reserveNumber',
		key: 'reserveNumber',
	},
	{
		title: '小计(元)',
		dataIndex: 'Subtotal',
		key: 'Subtotal',
	},
];

const state = reactive({
	data: [] as any,
	formdata: {
		flag: '' as any,
		rejectReason: '',
	},
});

const auditing = () => {
	visible.value = true;
};

const rules: any = {
	flag: [{ required: true, trigger: 'change', message: '请选择审核状态' }],
	rejectReason: [{ required: true, trigger: 'blur', message: '请输入审核不通过原因' }],
};
const resetForm = () => {
	visible.value = false;
	formRef.value.resetFields();
};

const success = () => {
	console.log(formRef.value);
	formRef.value.validateFields().then(() => {
		api
			.aduitHotelOrder(route?.query?.orderNo, state.formdata.flag, state.formdata.rejectReason)
			.then((res: any) => {
				visible.value = false;
				router.push({ path: '/hotelManagement/hotelOrder/index' });
				message.success('审核成功')
			})
			.catch((err: any) => {
				message.error(err)
			});
	});
};
const notAuditing = () => {
	router.push({ path: '/hotelManagement/hotelOrder/index' });
};

const initPage = async (): Promise<void> => {
	console.log(route?.query?.orderNo);
	api.HotelOrderInfo(route?.query?.orderNo).then((res: any) => {
		state.data = res;
	});
};

onMounted(() => {
	initPage();
	navigatorBar.setNavigator(['订单管理', '查看']);
});
onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
});
</script>
<style lang="less" scoped>
.warp {
	.trave-contaner {
		height: 100%;
		::v-deep(.ant-tabs-nav) {
			padding: 16px 20px;
		}
		// ::v-deep(.ant-tabs-content-holder) {
		//   padding: 0 20px;
		// }
	}
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
	width: 100%;
	box-sizing: border-box;
	.edit_btn {
		background-color: #5db179;
		color: white;
		border-radius: 5px;
	}

	.form_pad {
		padding: 0 16px 100px;
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
	// .ant-form-item{
	//     margin-bottom: 10px;
	// }
}
</style>
