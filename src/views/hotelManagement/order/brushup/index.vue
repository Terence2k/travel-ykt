<template>
	<div class="warp">
		<div class="trave-contaner">
			<div class="form_pad">
				<header class="form_head" v-if="route.query?.brush">申请改刷</header>
				<header>行程信息</header>
				<a-form name="basic" :model="editableData" :rules="rulesRef" ref="formRef" labelAlign="left" :label-col="{ span: 4 }">
					<div class="form_item_box">
						<div class="form_item mr40">
							<a-form-item label="订单编号"> {{ state.formdata.orderNo }} </a-form-item>
							<a-form-item label="行程人数"> {{ state.formdata.tripNumber }} </a-form-item>
							<a-form-item label="预定房数"> {{ state.formdata.scheduledRooms }} </a-form-item>
							<a-form-item label="减免规则"> 满{{ state.formdata.fullRule }} 减 {{ state.formdata.reduceRule }} </a-form-item>
							<a-form-item label="接团旅行社"> {{ state.formdata.subTravelName }} </a-form-item>
						</div>
						<div class="form_item mr40">
							<a-form-item label="行程单号"> {{ state.formdata.itineraryNo }} </a-form-item>
							<a-form-item label="行程类型"> {{ state.formdata.teamType }} </a-form-item>
							<a-form-item label="行程时间"> {{ state.formdata.arrivalDate }} - {{ state.formdata.departureDate }} </a-form-item>
							<a-form-item label="预定时间"> {{ state.formdata.arrivalDate }} - {{ state.formdata.departureDate }} </a-form-item>
							<a-form-item label="发团旅行社"> {{ state.formdata.travelName }} </a-form-item>
							<!-- <a-form-item label="地接社计调电话"> {{ state.formdata.travelName }} </a-form-item> -->
						</div>
					</div>
					<div class="title">订单房型信息</div>
					<CommonTable 
						v-if="route.query.brush || route.query.process"
						:columns="route.query.brush ? brushcolumns : processcolumns"
						:dataSource="state.data"
						:scrollY="false"
					>
						<template #bodyCell="{ column, index, record, text }">
							<template v-if="column.key === 'index'">
								<div>
									{{ index + 1 }}
								</div>
							</template>
							<!-- <template v-if="column.key === 'orderAmount'">
								<div>
									{{ accDiv(record.orderAmount, 100) }}
								</div>
							</template> -->
							<!-- 费用 -->
							<template v-if="column.key === 'Subtotal'">
								<div>
									{{ accDiv(accMul(record.orderAmount, record.reserveNumber), 100) }}
								</div>
							</template>
							<template v-if="column.key === 'expenses'">
								<div>
									{{ accDiv(accMul(record.orderAmount, record.verificationRoom), 100) }}
								</div>
							</template>
							<template v-if="column.key === 'refreshNum'">
								<div>
									<a-form-item v-if="editableData[record.hotelRoomTypeId]" name="refreshNum">
										<a-input style="width: 50px" v-model:value="editableData[record.hotelRoomTypeId]['refreshNum']"> </a-input>
									</a-form-item>
									<template v-else>
										{{ text }}
									</template>
								</div>
							</template>
							<template v-if="column.key === 'action' && route.query?.brush">
								<a class="item" v-if="!editableData[record.hotelRoomTypeId]" @click="edit(record.hotelRoomTypeId)">编辑</a>
								<span v-else>
									<a style="margin-right: 16px" class="item" @click="save(record.hotelRoomTypeId)">确定</a>
									<a class="item" @click="cancle(record.hotelRoomTypeId)">取消</a>
								</span>
							</template>
						</template>
					</CommonTable>
					<CommonTable v-else
						:columns="route.query.detail == 1 ? brushcolumnsdet : processcolumns"
						:dataSource="state.data"
						:scrollY="false"
					>
						<template #bodyCell="{ column, index, record, text }">
							<template v-if="column.key === 'index'">
								<div>
									{{ index + 1 }}
								</div>
							</template>
							<!-- <template v-if="column.key === 'orderAmount'">
								<div>
									{{ accDiv(record.orderAmount, 100) }}
								</div>
							</template> -->
							<!-- 费用 -->
							<template v-if="column.key === 'Subtotal'">
								<div>
									{{ accDiv(accMul(record.orderAmount, record.reserveNumber), 100) }}
								</div>
							</template>
							<template v-if="column.key === 'expenses'">
								<div>
									{{ accDiv(accMul(record.orderAmount, record.verificationRoom), 100) }}
								</div>
							</template>
							<template v-if="column.key === 'refreshNum'">
								<div>
									<a-form-item v-if="editableData[record.hotelRoomTypeId]" name="refreshNum">
										<a-input style="width: 50px" v-model:value="editableData[record.hotelRoomTypeId]['refreshNum']"> </a-input>
									</a-form-item>
									<template v-else>
										{{ text }}
									</template>
								</div>
							</template>
							<template v-if="column.key === 'action' && route.query?.brush">
								<a class="item" v-if="!editableData[record.hotelRoomTypeId]" @click="edit(record.hotelRoomTypeId)">编辑</a>
								<span v-else>
									<a style="margin-right: 16px" class="item" @click="save(record.hotelRoomTypeId)">确定</a>
									<a class="item" @click="cancle(record.hotelRoomTypeId)">取消</a>
								</span>
							</template>
						</template>
					</CommonTable>
					<div class="table_total" v-if="!route.query?.brush">
						总计：已预订<span>{{ ScheduledMoney(state.data) || 0 }}</span
						>元，已核销<span>{{ VerificationMoney(state.data) || 0 }}</span
						>元
					</div>
					<!-- <div v-if="route.query?.brush">
						<div class="title">改刷原因（200字）</div>
						<a-form-item label="" name="aduit">
							<a-textarea v-model:value="editableData.aduit" :auto-size="{ minRows: 4, maxRows: 10 }"
						/></a-form-item>
					</div>
					<div v-else>
						<div class="title">改刷记录</div>
						<div>当前订单还未发生改刷</div>
						<div>
							<a-form-item class="mb_0">已于 2022.10.23 09:00:23 提交改刷，正在等待审核。</a-form-item>
							<a-form-item class="mb_0" label="改刷前：" :label-col="{ span: 2 }"> 已核销【大床房13，双床房13，套间13】 </a-form-item>
							<a-form-item class="mb_0" label="改刷后：" :label-col="{ span: 2 }"> 核销【大床房13，双床房15，套间13】 </a-form-item>
							<a-form-item class="mb_0" label="改刷原因：" :label-col="{ span: 2 }">
								测试文字我也不知道为什么，测试文字我也不知道为什么。
							</a-form-item>
							<a-form-item class="mb_0" label="审核时间：" :label-col="{ span: 2 }"> 2022.10.24 09:00:23 </a-form-item>
							<a-form-item class="mb_0" label="驳回理由：" :label-col="{ span: 2 }"> 测试文字我也不知道为什么 </a-form-item>
						</div>
					</div> -->
				</a-form>
			</div>
		</div>
		<div class="footer" v-if="route.query?.brush">
			<div class="footer_btn">
				<a-button type="primary" @click="auditing()">提交申请</a-button>
				<a-button @click="cancel">取消</a-button>
			</div>
		</div>
		<div class="footer" v-else-if="route.query?.process">
			<div class="footer_btn">
				<a-button type="primary" @click="processTrue()">审核通过</a-button>
				<a-button @click="processfalse()">审核不通过</a-button>
			</div>
		</div>
		<div class="footer" v-else>
			<div class="footer_btn">
				<a-button @click="cancel">返回</a-button>
			</div>
		</div>
		<BaseModal title="改刷申请通过确认" v-model="state.VisibleTrue" :width="500">
			<p>确认要同意此次改刷申请？同意后，已核销房 间数量将按照改刷后的结果进行财务结算。</p>
			<template v-slot:footer>
				<a-button type="primary" @click="visibleTrueSub()">确定</a-button>
				<a-button @click="state.VisibleTrue = false">取消</a-button>
			</template>
		</BaseModal>
		<BaseModal title="改刷驳回反馈" v-model="state.VisibleFalse" :width="500">
			<a-form :model="state.VisibleFalseData" ref="VisibleFalseRef">
				<a-form-item label="" :name="['cause']" :rules="[{ required: true, trigger: 'blur', message: '请输入审核不通过原因' }]">
					<a-textarea v-model:value="state.VisibleFalseData.cause" placeholder="请输入审核不通过原因" :auto-size="{ minRows: 4, maxRows: 10 }" />
				</a-form-item>
			</a-form>
			<template v-slot:footer>
				<a-button type="primary" @click="VisibleFalseSub()">确定</a-button>
				<a-button @click="modalCancel()">取消</a-button>
			</template>
		</BaseModal>
	</div>
</template>
<script lang="ts" setup>
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import { onMounted, reactive, toRaw, UnwrapRef, watch, ref } from 'vue';
import BaseModal from '@/components/common/BaseModal.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import api from '@/api';
import { cloneDeep } from 'lodash-es';
import { CloseOutlined } from '@ant-design/icons-vue';
import type { Rule } from 'ant-design-vue/es/form';
import { message } from 'ant-design-vue';
import CommonTable from '@/components/common/CommonTable.vue';
import { accDiv, accMul, accSub } from '@/utils/compute';
import { toNumber } from '@vue/shared';
const router = useRouter();
const navigatorBar = useNavigatorBar();
const route = useRoute();

interface DataItem {
	key: string;
	roomTypeName: string;
	arrivalDate: string;
	departureDate: string;
	reserveNumber: string;
	verificationRoom: string;
	verificationTime: string;
	hotelRoomTypeId: string;
	refreshNum: string;
}

const formRef = ref();
const VisibleFalseRef = ref();

const col = []
const brushcolumns = [
	{
		title: '序号',
		dataIndex: 'index',
		key: 'index',
	},
	{
		title: '房型',
		dataIndex: 'roomTypeName',
		key: 'roomTypeName',
	},
	{
		title: '入住时间',
		dataIndex: 'arrivalDate',
		key: 'arrivalDate',
	},
	{
		title: '离店时间',
		dataIndex: 'departureDate',
		key: 'departureDate',
	},
	{
		title: '预定房数',
		dataIndex: 'reserveNumber',
		key: 'reserveNumber',
	},
	{
		title: '费用(元)',
		dataIndex: 'Subtotal',
		key: 'Subtotal',
	},
	{
		title: '已核销房数',
		dataIndex: 'verificationRoom',
		key: 'verificationRoom',
	},
	{
		title: '核销时间',
		dataIndex: 'verificationTime',
		key: 'verificationTime',
	},
	{
		title: '实际核销费用',
		dataIndex: 'expenses',
		key: 'expenses',
	},
	{
		title: '改刷房数',
		dataIndex: 'refreshNum',
		key: 'refreshNum',
	},
	{
		title: '操作',
		dataIndex: 'action',
		key: 'action',
	},
];
const brushcolumnsdet = [
	{
		title: '序号',
		dataIndex: 'index',
		key: 'index',
	},
	{
		title: '房型',
		dataIndex: 'roomTypeName',
		key: 'roomTypeName',
	},
	{
		title: '入住时间',
		dataIndex: 'arrivalDate',
		key: 'arrivalDate',
	},
	{
		title: '离店时间',
		dataIndex: 'departureDate',
		key: 'departureDate',
	},
	{
		title: '预定房数',
		dataIndex: 'reserveNumber',
		key: 'reserveNumber',
	},
	{
		title: '费用(元)',
		dataIndex: 'Subtotal',
		key: 'Subtotal',
	},
	{
		title: '已核销房数',
		dataIndex: 'verificationRoom',
		key: 'verificationRoom',
	},
	{
		title: '核销时间',
		dataIndex: 'verificationTime',
		key: 'verificationTime',
	},
	{
		title: '实际核销费用',
		dataIndex: 'expenses',
		key: 'expenses',
	}
];
const processcolumns = [
	{
		title: '序号',
		dataIndex: 'index',
		key: 'index',
	},
	{
		title: '房型',
		dataIndex: 'roomTypeName',
		key: 'roomTypeName',
	},
	{
		title: '入住时间',
		dataIndex: 'arrivalDate',
		key: 'arrivalDate',
	},
	{
		title: '离店时间',
		dataIndex: 'departureDate',
		key: 'departureDate',
	},
	{
		title: '预定房数',
		dataIndex: 'reserveNumber',
		key: 'reserveNumber',
	},
	{
		title: '费用(元)',
		dataIndex: 'Subtotal',
		key: 'Subtotal',
	},
	{
		title: '已核销房数',
		dataIndex: 'verificationRoom',
		key: 'verificationRoom',
	},
	{
		title: '改刷后房数',
		dataIndex: 'refreshNum',
		key: 'refreshNum',
	},
	{
		title: '已核销费用',
		dataIndex: 'expenses',
		key: 'expenses',
	},
	{
		title: '实际核销费用',
		dataIndex: 'expenses',
		key: 'expenses',
	},
	{
		title: '核销时间',
		dataIndex: 'verificationTime',
		key: 'verificationTime',
	},
];

const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});
const state = reactive({
	data: [] as any,
	formdata: {} as any,
	VisibleTrue: false,
	VisibleFalse: false,
	auditUuid: '',
	VisibleFalseData: {
		cause: '',
	},
	detail:route.query?.detail
});

const rulesRef = {
	aduit: [
		{ required: true, trigger: 'blur', message: '请输入改刷原因' },
		{ min: 1, max: 200, message: '只能输入200字', trigger: 'change' },
	],
};

const edit = (key: string) => {
	editableData[key] = cloneDeep(state.data.filter((item: any) => key === item.hotelRoomTypeId)[0]);
	const cur = cloneDeep(state.data.filter((item: any) => key == item.hotelRoomTypeId)[0]);
	cur.edit = true;
	editableData[key] = cur;
};

const copyData = (key: any) => {
	Object.assign(state.data.filter((item: any) => key == item.hotelRoomTypeId)[0], editableData[key]);
};

const cancle = (key: any) => {
	delete editableData[key];
};

const save = async (key?: string) => {
	if (key) {
		copyData(key);
		if (toNumber(editableData[key].refreshNum) > toNumber(editableData[key].reserveNumber)) {
			message.error('改刷房数不能大于预定房数');
			return;
		}
		if (!Number(editableData[key].refreshNum)) {
			message.error('请输入大于0的正整数');
			return;
		}
		delete editableData[key];
	} else {
		for (let k in editableData) {
			copyData(k);
			delete editableData[k];
		}
	}
};

const processTrue = () => {
	state.VisibleTrue = true;
	return;
};

const processfalse = () => {
	state.VisibleFalse = true;
	return;
};

const visibleTrueSub = () => {
	api.getAuditButton({ uuid: state.auditUuid }).then((res: any) => {
		if (res) {
			const data = {
				auditTypeCode: 4, //审核类code（详情参考CompanyAuditStatusEnum）
				auditRemark: '',
				uuid: state.auditUuid, //uuid
				roleId: res.roleId, //角色id为查询是否拥有审核权限时返回的角色id，若返回的角色id为null，则不传
				businessType: res.auditBusinessType,
				auditStatus: 2, //审核类型
			};
			api.orderhandle(data).then((Res: any) => {
				message.success('操作成功');
				state.VisibleTrue = false;
				router.go(-1);
			});
		} else {
			message.error('您当前账号没有权限审核');
			return;
		}
	});
};

const VisibleFalseSub = () => {
	VisibleFalseRef.value.validate().then(() => {
		api.getAuditButton({ uuid: state.auditUuid }).then((res: any) => {
			if (res) {
				const data = {
					auditTypeCode: 4, //审核类code（详情参考CompanyAuditStatusEnum）
					auditRemark: state.VisibleFalseData.cause,
					uuid: state.auditUuid, //uuid
					roleId: res.roleId, //角色id为查询是否拥有审核权限时返回的角色id，若返回的角色id为null，则不传
					businessType: res.auditBusinessType,
					auditStatus: 3, //审核类型
				};
				api.orderhandle(data).then((Res: any) => {
					message.success('操作成功');
					state.VisibleFalse = false;
					router.go(-1);
				});
			} else {
				message.error('您当前账号没有权限审核');
				return;
			}
		});
	});
};

const modalCancel = () => {
	VisibleFalseRef.value.resetFields();
	state.VisibleFalse = false;
};

const initPage = async (): Promise<void> => {

	let hotelTypeList = [] as any;
	api.HotelOrderInfo(route?.query?.orderNo).then((res: any) => {
		hotelTypeList = res.hotelTypeList;
		state.formdata = res;
		state.auditUuid = res.auditUuid;
		if (route.query.process || route.query.detail == 2) {
			api.getRefreshRoomData(route?.query?.orderNo).then((Res: any) => {
				hotelTypeList.forEach((item: any) => {
					// 多条重复
					// let sss =Res.hotelOrderRefreshVOList.filter((el: any) => el.roomTypeName === item.roomTypeName).map((el:any) => el.refreshNum)
					// 单挑
					let Num = Res.hotelOrderRefreshVOList.find((el: any) => el.roomTypeName === item.roomTypeName);
					item.refreshNum = item.verificationRoom + Num.refreshNum;
				});
				state.data = hotelTypeList;
			});
		} else {
			state.data = hotelTypeList;
		}
	});
};

const ScheduledMoney = computed(() => (params: any) => {
	let money = 0 as number;
	if (params) {
		for (let index = 0; index < params.length; index++) {
			money = accMul(params[index].orderAmount, params[index].reserveNumber) + money;
		}
		return accDiv(money, 100);
	}
});

const VerificationMoney = computed(() => (params: any) => {
	let money = 0 as number;
	if (params) {
		for (let index = 0; index < params.length; index++) {
			money = accMul(params[index].orderAmount, params[index].verificationRoom) + money;
		}
		return accDiv(money, 100);
	}
});

const auditing = () => {
	// formRef.value.validate().then(() => {
	for (let index = 0; index < state.data.length; index++) {
		if (!state.data[index].refreshNum) {
			message.error('请填写改刷房数');
			return;
		}
		if (state.data[index].refreshNum) {
			state.data[index].Num = accSub(state.data[index].refreshNum, state.data[index].reserveNumber);
		}
	}
	const refreshVOList = state.data.map((item: any) => {
		return {
			roomTypeName: item.roomTypeName,
			refreshNum: item.Num,
		};
	});
	const data = {
		orderNo: route.query.orderNo,
		refreshVOList: refreshVOList,
	};
	api.changeRefreshRoom(data).then((res: any) => {
		message.success('申请改刷成功');
		router.go(-1);
		return;
	});
	// });
};

const cancel = () => {
	router.go(-1);
	formRef.value.resetFields();
};

onMounted(() => {
	initPage();
	if (route.query.brush) {
		navigatorBar.setNavigator(['酒店管理', '订单管理', '申请改刷']);
	} else {
		navigatorBar.setNavigator(['酒店管理', '订单管理', `订单：${route.query.orderNo}`]);
	}
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
		// margin-bottom: 16px;
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
		.form_head {
			text-align: center;
		}
		.form_item_box {
			display: flex;

			.form_item {
				flex: 1;
			}
			.mr40 {
				margin-right: 40px;
				margin-top: 16px;
			}
		}
		.table_total {
			padding: 6px 20px;
			text-align: right;
			span {
				color: red;
			}
		}
	}
	.footer {
		position: fixed;
		bottom: 11px;
		background-color: #fff;
		line-height: 64px;
		width: 83%;
		border-top: 1px solid #f1f2f5;
		.footer_btn {
			text-align: center;
		}
		button {
			margin-left: 20px;
		}
	}

	// .ant-form-item{
	//     margin-bottom: 10px;
	// }
	.mb_0 {
		margin-bottom: 0;
	}
	.ant-form-item {
		margin-bottom: 0;
	}
}
</style>
