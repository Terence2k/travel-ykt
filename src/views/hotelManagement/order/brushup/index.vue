<template>
	<div class="warp">
		<div class="trave-contaner">
			<div class="form_pad">
				<header class="form_head" v-if="route.query?.brush">申请改刷</header>
				<header>行程信息</header>
				<a-form name="basic" :model="editableData" :rules="rulesRef" ref="formRef" labelAlign="left" :label-col="{ span: 4 }">
					<div class="form_item_box">
						<div class="form_item mr40">
							<a-form-item label="订单编号"> {{ state.formdata.invalidOrderNo }} </a-form-item>
							<a-form-item label="行程人数"> {{ state.formdata.tripNumber }} </a-form-item>
							<a-form-item label="预定房数"> {{ state.formdata.scheduledRooms }} </a-form-item>
							<a-form-item label="减免规则"> 满{{ state.formdata.fullRule }} 减 {{ state.formdata.reduceRule }} </a-form-item>
							<a-form-item label="接团旅行社"> {{ state.formdata.subTravelName }} </a-form-item>
						</div>
						<div class="form_item mr40">
							<a-form-item label="行程单号"> {{ state.formdata.itineraryNo }} </a-form-item>
							<a-form-item label="行程类型"> {{ state.formdata.teamType }} </a-form-item>
							<a-form-item label="行程时间"> {{ state.formdata.arrivalDate }} - {{ state.formdata.departureDate }} </a-form-item>
							<a-form-item label="发团旅行社"> {{ state.formdata.travelName }} </a-form-item>
							<!-- <a-form-item label="地接社计调电话"> {{ state.formdata.travelName }} </a-form-item> -->
						</div>
					</div>
					<div class="title">订单房型信息</div>
					<CommonTable :columns="columns" :dataSource="state.data" :scrollY="false">
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
							<!-- <template v-if="column.key === 'Subtotal'">
								<div>
									{{ accDiv(accMul(record.orderAmount, record.reserveNumber), 100) }}
								</div>
							</template> -->
							<template v-if="column.key === 'refreshNum'">
								<div>
									<a-form-item v-if="editableData[record.key ? record.key : record.refreshNum]" name="refreshNum">
										<a-input style="width: 50px" v-model:value="editableData[record.key ? record.key : record.refreshNum]['refreshNum']"> </a-input>
									</a-form-item>
									<template v-else>
										{{ text }}
									</template>
								</div>
							</template>
							<template v-if="column.key === 'action'">
								<a class="item" v-if="!editableData[record.key]" @click="edit(record.key)">编辑</a>
								<a class="item" v-else @click="save(record.key)">确定</a>
							</template>
						</template>
					</CommonTable>
					<div class="table_total" v-if="!route.query?.brush">总计：已预订<span>8700.00</span>元，已核销<span>7500.00</span>元</div>
					<div v-if="route.query?.brush">
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
					</div>
				</a-form>
			</div>
		</div>
		<div class="footer">
			<div class="footer_btn">
				<a-button type="primary" @click="auditing()">提交申请</a-button>
				<a-button @click="cancel">取消</a-button>
			</div>
		</div>
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
import { accDiv, accMul } from '@/utils/compute';
import { toNumber } from '@vue/shared';
const router = useRouter();
const navigatorBar = useNavigatorBar();
const route = useRoute();

interface DataItem {
	key: string;
	roomTypeName: string;
	refreshNum: string;
	num: string;
	oid: any;
}

const formRef = ref();
const columns = [
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
		title: '预定时间',
		dataIndex: 'orderAmount',
		key: 'orderAmount',
	},
	{
		title: '入住时间',
		dataIndex: 'reserveNumber',
		key: 'reserveNumber',
	},
	{
		title: '离店时间',
		dataIndex: 'Subtotal',
		key: 'Subtotal',
	},
	{
		title: '预定房数',
		dataIndex: 'num',
		key: 'num',
	},
	{
		title: '减免规则',
		dataIndex: 'Subtotal',
		key: 'Subtotal',
	},
	{
		title: '减免人数',
		dataIndex: 'Subtotal',
		key: 'Subtotal',
	},
	{
		title: '减免金额(元)',
		dataIndex: 'Subtotal',
		key: 'Subtotal',
	},
	{
		title: '费用(元)',
		dataIndex: 'Subtotal',
		key: 'Subtotal',
	},
	{
		title: '已核销房数',
		dataIndex: 'Subtotal',
		key: 'Subtotal',
	},
	{
		title: '核销时间',
		dataIndex: 'Subtotal',
		key: 'Subtotal',
	},
	{
		title: '实际核销费用',
		dataIndex: 'Subtotal',
		key: 'Subtotal',
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

const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});
const state = reactive({
	data: [
		{
			key: '123456',
			oid: 12,
			refreshNum: '5',
			num: '5',
			roomTypeName: '房间1',
		},
		{
			key: '12345345346',
			oid: 19,
			num: '4',
			refreshNum: '4',
			roomTypeName: '房间2',
		},
	] as any,
	formdata: {} as any,
});

const rulesRef = {
	aduit: [
		{ required: true, trigger: 'blur', message: '请输入改刷原因' },
		{ min: 1, max: 200, message: '只能输入200字', trigger: 'change' },
	],
};

const edit = (key: string) => {
	console.log(key, 'key');
	editableData[key] = cloneDeep(state.data.filter((item: any) => key === item.key)[0]);
	const cur = cloneDeep(state.data.filter((item: any) => key == item.key)[0]);
	cur.edit = true;
	editableData[key] = cur;
};
const copyData = (key: any) => {
	Object.assign(state.data.filter((item: any) => key == item.key)[0], editableData[key]);
};
const save = async (key?: string) => {
	if (key) {
		copyData(key);
		if (toNumber(editableData[key].refreshNum) > toNumber(editableData[key].num)) {
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

const initPage = async (): Promise<void> => {
	console.log(route?.query?.brush);
	api.HotelOrderInfo(route?.query?.orderNo).then((res: any) => {
		// state.data = res.hotelTypeList;
		state.formdata = res;
	});
};

const auditing = () => {
	formRef.value.validate().then(() => {
		const refreshVOList = state.data.map((item: any) => {
			return {
				roomTypeName: item.roomTypeName,
				refreshNum: item.refreshNum,
			};
		});
		const data = {
			orderNo: route.query.orderNo,
			refreshVOList: refreshVOList,
		};
		api.changeRefreshRoom(data);
	});
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
}
</style>
