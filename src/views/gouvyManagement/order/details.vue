<template>
	<div class="warp">
		<div class="top-div">
			<header>行程信息</header>
			<a-button type="primary" style="margin-top:15px;" @click="go()">返回上一页</a-button>
		</div>
		<a-form labelAlign="left" :label-col="{ span: 3 }" :wrapper-col="{ span: 6 }">
			<a-form-item label="行程类型">
				<span>{{state.tableData.data.teamTypeName}}</span>
			</a-form-item>
			<a-form-item label="行程单号">
				<span>{{state.tableData.data.itineraryNo}}</span>
			</a-form-item>
			<a-form-item label="发团旅行社">
				<span>{{state.tableData.data.travelName}}</span>
			</a-form-item>
			<a-form-item label="行程时间">
				<span>{{state.tableData.data.itineraryStartDate}}~{{state.tableData.data.itineraryEndDate}}</span>
			</a-form-item>
			<a-form-item label="地接社计调">
				<span>{{ state.tableData.data.subTravelOperatorName }} {{state.tableData.data.subTravelOperatorPhone}}</span>
			</a-form-item>
			<a-form-item label="行程人数">
				<span>{{state.tableData.data.touristNum}}人</span>
			</a-form-item>
			<a-form-item label="应购票人数">
				<span>{{state.tableData.data.purchaseNum}}人</span>
			</a-form-item>
			<a-form-item label="减免人数">
				<span>{{state.tableData.data.reduceNum}}人</span>
			</a-form-item>
			<div class="title">订单信息</div>
			<a-form-item label="订单编号">
				<span>{{state.tableData.data.orderNo}}</span>
			</a-form-item>
			<a-form-item label="当前状态">
				<span>{{state.tableData.data.issueStatusName}}</span>
			</a-form-item>
			<a-form-item label="费用明细">
				<p>购票人数： {{state.tableData.data.purchaseNum}} X {{accDiv(state.tableData.data.unitPrice,100)}} ={{accMul(state.tableData.data.purchaseNum,accDiv(state.tableData.data.unitPrice,100))}} 元</p>
				<p>申请减免： {{state.tableData.data.reduceNum}} X {{accDiv(state.tableData.data.unitPrice,100)}} ={{accMul(state.tableData.data.reduceNum,accDiv(state.tableData.data.unitPrice,100))}} 元</p>
				<p>查验减免： {{state.tableData.data.checkNum}} X {{accDiv(state.tableData.data.unitPrice,100)}} ={{accMul(state.tableData.data.checkNum,accDiv(state.tableData.data.unitPrice,100))}} 元</p>
			</a-form-item>
			<a-form-item label="费用总计">
				<span>{{accDiv(state.tableData.data.totalPrice,100)}} 元</span>
			</a-form-item>
			<div class="title">购买人员明细</div>
			<p style="text-align: center; font-size: 18px;" v-if="(state.tableData.data.issueStatus==1)">当前古维费已经于 {{state.tableData.data.issueTime}} 全部出票。全部游客{{state.tableData.data.touristNum}}名,已减免{{state.tableData.data.reduceNum}}人,实缴{{state.tableData.data.purchaseNum}}人。</p>
			<CommonTable :dataSource="state.tableData.touristList" :columns="columns" :scrollY="false">
				<template #bodyCell="{ column, index,record}">
					<template v-if="column.key === 'actualPrice'">
						<span>{{accDiv(record.actualPrice,100)}}</span>
					</template>
				</template>
			</CommonTable>
		</a-form>
	</div>
</template>

<script lang="ts" setup>
import CommonTable from '@/components/common/CommonTable.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import BaseModal from '@/components/common/BaseModal.vue';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { accDiv,accMul} from '@/utils/compute';
import api from '@/api';
const route = useRoute();
const router = useRouter();
const dialogVisible = ref(false);
const navigatorBar = useNavigatorBar();
const tstyle = { 'font-weight': '700' };
const state = reactive({
	tableData: {
		data:[] as any,
		touristList:[]
	},
});
const columns = [
	{
		title: '购买状态',
		dataIndex: 'purchasedName',
		key: 'purchasedName',
	},
	{
		title: '游客姓名',
		dataIndex: 'touristName',
		key: 'touristName',
	},
	{
		title: '身份证件类型',
		dataIndex: 'certificateTypeName',
		key: 'certificateTypeName',
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
	// {
	// 	title: '联系方式',
	// 	dataIndex: '',
	// 	key: '',
	// },
	{
		title: '客源地',
		dataIndex: 'sourceAddressName',
		key: 'sourceAddressName',
	},
	{
		title: '减免规则',
		dataIndex: 'discountRuleName',
		key: 'discountRuleName',
	},
	{
		title: '实际缴费金额',
		dataIndex: 'actualPrice',
		key: 'actualPrice',
	},
];
const go = () => {
	// router.push({ path: '/gouvyManagement/order/list' });
	router.go(-1);
};
const detailsList = () => {
	api.gouvyOrderDetail(route?.query?.oid).then((res) => {
		state.tableData.data = res;
		state.tableData.touristList=res.touristList
	});
};
onMounted(() => {
	detailsList()
});
</script>

<style lang="less" scoped>
.warp {
	padding: 0 16px;
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
	.btn {
		margin-left: 50px;
	}
	.top-div{
		display: flex;
		justify-content: space-between;
	}
}
</style>
