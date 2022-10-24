<template>
	<div class="warp">
		<!-- <header>基本信息</header> -->
		<div class="title">基本信息</div>

		<a-form labelAlign="left" :label-col="{ span: 3 }" :wrapper-col="{ span: 6 }">
			<a-form-item label="综费产品">
				<span>{{ formData.data.comprehensiveFeeProductName }}</span>
			</a-form-item>
			<a-form-item label="费用归属">
				<span>{{ formData.data.belongCompanyName }}</span>
			</a-form-item>
			<a-form-item label="费用说明">
				<span>{{ formData.data.feeExplanation || '' }}</span>
			</a-form-item>
			<a-form-item label="状态">
				<span>{{ formData.data.statusName }}</span>
			</a-form-item>
			<div class="title">收费规则</div>
			<a-form-item label="收费模式">
				<span>{{ formData.data.feeModel == 0 ? '人数' : '价格' }}</span>
			</a-form-item>
			<a-form-item label="收费金额">
				<span>{{ (formData.data.feeNumber || '') + ( formData.data.feeModel == 0 ? ' 元/人' : ' 元' ) }}</span>
			</a-form-item>
			<a-form-item label="是否按天收费">
				<span>{{ formData.data.confirmDailyChargeName }}</span>
			</a-form-item>
		</a-form>
		<div class="footer">
			<div class="tooter-btn">
				<a-button type="primary" @click.prevent="toEdit">返回</a-button>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
const route = useRouter();
const tstyle = { 'font-weight': '700' };
import api from '@/api';
import { useBusinessManageOption } from '@/stores/modules/businessManage';
import { settlementOptions } from '@/stores/modules/settlement';
const useOptions = settlementOptions();
const option = computed(() => useOptions.businessTypeOption);

// 跳转编辑页
const toEdit = () => {
	route.go(-1)
	// route.push({ path: '/settlementManagement/comprehensiveFee/edit' ,query: { edit: 1, oid: route.currentRoute.value?.query?.oid } });
};
const formData: any = reactive({
	data: {
		
	},
});
//初始化页面
const initPage = async (): Promise<void> => {
	api.getcomprehensiveFeeDetail(route.currentRoute.value?.query?.oid).then((res: any) => {
		formData.data = res;
		formData.data.belongCompanyName = option.value[formData.data.belongCompany]
	});
};
onMounted(() => {
	useOptions.getBusinessTypeOptionList();
	initPage();
})
</script>

<style lang="less" scoped>
.warp {
	padding: 0 20px;
	.title {
		height: 44px;
		line-height: 44px;
		font-weight: bold;
		color: #1e2226;
		margin-top: 12px;
		// margin-bottom: 16px;
		border-bottom: 1px solid #f1f2f5;
		font-size: 16px;
		font-family: Microsoft YaHei UI;
		font-weight: bold;
		color: #1e2226;
		box-sizing: content-box;
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
</style>
