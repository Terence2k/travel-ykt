<template>
	<div class="warp">
		<!-- <header>基本信息</header> -->
		<!-- <div class="title">基本信息</div> -->

		<a-form labelAlign="left" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
			<!-- <a-form-item label="结算状态" required>
				<span>{{ formData.data.accountingIsNormal == 1 ? '正常' : formData.data.accountingIsNormal == 2 ? '异常' : '-' }}</span>
			</a-form-item>
			<a-form-item label="团队类型" required>
				<span>{{ formData.data.teamTypeName }}</span>
			</a-form-item>
			<a-form-item label="行程单号" required>
				<span>{{ formData.data.itineraryNo || '' }}</span>
			</a-form-item>
			<a-form-item label="线路名称" required>
				<span>{{ formData.data.routeName }}</span>
			</a-form-item>
			<a-form-item label="组团社" required>
				<span>{{ formData.data.travelName }}</span>
			</a-form-item>
			<a-form-item label="地接社" required>
				<span>{{ formData.data.subTravelName }}</span>
			</a-form-item>
			<a-form-item label="行程时间" required>
				<span>{{ formData.data.startDate }} - {{ formData.data.endDate }}</span>
			</a-form-item>
			<a-form-item label="游客人数" required>
				<span>{{ formData.data.touristNum }}</span>
			</a-form-item>
			<a-form-item label="行程费用" required>
				<span>{{ formData.data.totalFee }}</span>
			</a-form-item>
			<a-form-item label="结算费用" required>
				<span>{{ formData.data.settlementCost }}</span>
			</a-form-item> -->

			<div class="title">结算信息</div>
			<CommonTable :dataSource="formData.settlementInformationVOList" :columns="columns" :scrollY="false" :scroll="{ y: '300px' }">
				<template #bodyCell="{ column, record, index }">
					<!-- 费用归属 -->
					<template v-if="column.key === 'companyType'">
						<span>{{ getBelongCompanyName(record.companyType) }}</span>
					</template>
					<!-- 结算费用 单位转成元-->
					<template v-if="column.key === 'settlementCost'">
						<span> {{ twoDecimalPlaces(record.settlementCost) }} </span>
					</template>
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<!-- <a href="javascript:;" @click="editItem(record,index)">调整费用</a> -->
							<a href="javascript:;" @click="itemDetail(record.oid,record.itineraryNo)">分账明细</a>
						</div>
					</template>
				</template>
			</CommonTable>
		</a-form>
		<div class="footer">
			<div class="tooter-btn">
				<a-button type="primary" @click.prevent="toPass" v-if="formData.showExamineBtn">审核通过</a-button>
				<a-button @click.prevent="onCancel">取消</a-button>
			</div>
		</div>
	</div>
	<detail-modal v-model="adjustData.detailShow" :params="adjustData.modalParams" />
	<!-- <adjust-modal v-model="adjustData.editShow" @submit="adjustConfirm" :params="adjustData.modalParams" /> -->
	<DelModal :params="modalData.params" v-model="modalData.show" @submit="tipSubmit" @cancel="tipCancel" />
</template>

<script lang="ts" setup>
import api from '@/api';
import CommonTable from '@/components/common/CommonTable.vue';
import { message } from 'ant-design-vue';
import DelModal from '@/components/common/DelModal.vue';
import AdjustModal from '@/views/settlementManagement/settlement/examine/adjustModal.vue';
import DetailModal from '@/views/settlementManagement/settlement/examine/detailModal.vue';
import { settlementOptions } from '@/stores/modules/settlement';
import { twoDecimalPlaces } from '../index'
// import lodash from 'lodash';
export interface StateType {
	data: TableDataType;
	settlementInformationVOList: Array<any>;
	showExamineBtn: boolean;
}
export interface TableDataType {
	data: Array<DataType>;
}
export interface DataType {
	oid?: number | string | null; //oid
	settlementInformationId?: number | string | null; //结算信息id
	productType?: number | string | null; //产品类型 1-景区 2-酒店 3-餐饮
	productSonType?: number | string | null; //产品子分类，用于区分景区票的分类：UNITE-联票 ONE-单票 SHOW-演出票 SELF-没有子产品，即产品本身
	productId?: number | string | null; //产品id
	productName?: number | string | null; //产品名称
	costName?: number | string | null; //费用名称
	settlementCost?: number | string | null; //结算费用
	costType?: number | string | null; //结算类型 0-减 1-加
	companyName?: number | string | null; //结算方名称
	companyType?: number | string | null; //结算方类别
	companyId?: number | string | null; //结算方id
	itineraryId?: number | string | null; //行程单id
	itineraryNo?: number | string | null; //行程单号
	orderNo?: number | string | null; //业态订单号
	ruleId?: number | string | null; //结算规则快照id
	ruleType?: number | string | null; //结算规则类型 1-通用 2-产品
}
const route = useRouter();
const useOptions = settlementOptions();
const initOption = async () => {
	await useOptions.getBusinessTypeOptionList();
};
// 计算属性 匹配费用归属企业类型
const getBelongCompanyName = computed(() => (value: any) => {
	if (useOptions.businessTypeOptionListAll) {
		const idx = useOptions.businessTypeOptionListAll.findIndex((item) => item.codeValue === value);
		if (idx !== -1) {
			return useOptions.businessTypeOptionListAll[idx]['name'];
		}
		return '';
	}
	return '';
});
// 取消
const onCancel = () => {
	route.go(-1);
};
const columns = [
	{
		title: '序号',
		customRender: ({ text, record, index }) => {
			return `${index + 1}`;
		},
	},
	{
		title: '结算方类别',
		dataIndex: 'companyType',
		key: 'companyType',
	},
	{
		title: '结算方',
		dataIndex: 'companyName',
		key: 'companyName',
	},
	{
		title: '结算账户',
		dataIndex: 'companyAccount',
		key: 'companyAccount',
	},
	{
		title: '结算费用（元）',
		dataIndex: 'settlementCost',
		key: 'settlementCost',
	},
	{
		title: '结算时间',
		dataIndex: 'settlementTime',
		key: 'settlementTime',
	},
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		width: 208,
	},
];
const formData: any = reactive<StateType>({
	data: {
		data: [],
	},
	settlementInformationVOList: [],
	showExamineBtn: false,
});
// 缓存编辑表格模态框数据
const adjustData = ref({
	editItem: {},
	editShow: false,
	editIndex: 0,
	modalParams: {},
	detailShow: false,
});
const modalData = ref({
	show: false,
	params: {},
	data: {}, // 传参对象
});
const tipSubmit = async () => {
	api.settlementUpdate(modalData.value.data).then((res: any) => {
		message.success('操作成功');
		// 返回上级列表
		onCancel();
	});
	tipCancel();
};
const tipCancel = () => {
	modalData.value.data = {};
	modalData.value.show = false;
};
// 审核通过
const toPass = () => {
	modalData.value.params = { title: '审核通过', content: '是否确定所选数据审核通过？' };
	modalData.value.data = {
		status: 15,
		itineraryNoList: [route.currentRoute.value?.query.itineraryNo],
	};
	modalData.value.show = true;
};
// 结算明细
const itemDetail = (oid: any,itineraryNo: any) => {
	adjustData.value.detailShow = true;
	adjustData.value.modalParams = { oid,itineraryNo };
};
//初始化页面
const initPage = async (): Promise<void> => {
	formData.showExamineBtn = route.currentRoute.value?.query.showExamineBtn == 'true' ? true : false;
	api
		.examineDetail(route.currentRoute.value?.query.itineraryNo)
		.then((res: any) => {
			formData.data = res;
			formData.settlementInformationVOList = res.settlementInformationVOList;
		})
		.catch(() => {
			onCancel();
		});
};

onMounted(() => {
	initOption();
	initPage();
});
// 调整费用
// const editItem = ((record: any,index: any) => {
//     console.log('调整费用id',record,index);
// 	adjustData.value.editIndex = index;
//     adjustData.value.editShow = true;
// 	adjustData.value.modalParams = { from: lodash.cloneDeep(record) };
// })
// 调整费用模态框关闭回调 此时调用接口
// const adjustConfirm = ((e: any) => {
//     console.log('我回来了');
//     console.log(e.form.settlementCost);
// 	message.success('保存成功');
// 	formData.settlementInformationVOList[adjustData.value.editIndex].settlementCost = e.form.settlementCost;
//     //
// })

</script>

<style lang="less" scoped>
.warp {
	padding: 0 20px;
	padding-bottom: 64px;
	.title {
		height: 44px;
		line-height: 44px;
		font-weight: bold;
		color: #1e2226;
		margin-top: 12px;
		border-bottom: 1px solid #f1f2f5;
		font-size: 16px;
		font-family: Microsoft YaHei UI;
		font-weight: bold;
		color: #1e2226;
		box-sizing: content-box;
		margin-bottom: 20px;
	}
	.footer {
		position: fixed;
		bottom: 12px;
		line-height: 64px;
		height: 64px;
		width: calc(100% - 288px);
		border-top: 1px solid #f1f2f5;
		margin-left: -16px;
		margin-right: 24px;
		background-color: #fff;
		z-index: 99;

		.tooter-btn {
			width: 60%;
			margin-left: 16px;
		}
		button:first-of-type {
			margin-right: 16px;
		}
	}
}
.ant-form-item {
	font-size: 14px;
	font-family: Microsoft YaHei UI;
	font-weight: 400;
	color: #1e2226;
	margin-top: 6px;
	margin-bottom: 0;
	height: 32px;
}
.ant-form-item:first-child {
	margin-top: 13px;
}
::v-deep(.ant-form-item-control-input) {
	height: 18px;
}
::v-deep(.ant-form-item-label > label) {
	position: relative;
	display: inline-flex;
	align-items: center;
	max-width: 100%;
	height: 32px;
	font-size: 14px;
	font-family: Microsoft YaHei UI;
	font-weight: 400;
	color: #1e2226;
}
.table-area {
	padding: 0;
	margin-bottom: 16px;
}
</style>
