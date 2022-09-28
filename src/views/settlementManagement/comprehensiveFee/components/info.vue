<template>
	<div class="warp">
		<!-- <header>基本信息</header> -->
		<div class="title">基本信息</div>

		<a-form labelAlign="left" :label-col="{ span: 3 }" :wrapper-col="{ span: 6 }">
			<a-form-item label="综费产品">
				<span>导服费</span>
			</a-form-item>
			<a-form-item label="是否必收费用">
				<span>必收</span>
			</a-form-item>
			<a-form-item label="费用说明">
				<span>————</span>
			</a-form-item>
			<a-form-item label="状态">
				<span>启用</span>
			</a-form-item>
			<div class="title">扣费规则</div>
			<a-form-item label="收费模式">
				<span>人数</span>
			</a-form-item>
			<a-form-item label="收款数量">
				<span>10</span>
			</a-form-item>
		</a-form>
		<div class="footer">
			<div class="tooter-btn">
				<a-button type="primary" @click.prevent="toEdit">编辑</a-button>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
const route = useRouter();
const tstyle = { 'font-weight': '700' };
const toEdit = () => {
	route.push({ path: '/settlementManagement/comprehensiveFee/edit' ,query: { edit: 1, oid: encodeURIComponent(1) } });
};
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
	margin-top: 13px;
	margin-bottom: 0;
	height: 32px;
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
