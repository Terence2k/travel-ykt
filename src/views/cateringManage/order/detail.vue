<template>
	<div class="warp">
		<header>行程信息</header>
		<a-form labelAlign="left" :label-col="{ span: 3 }" :wrapper-col="{ span: 6 }">
			<a-form-item label="行程类型">
				<span>标准团</span>
			</a-form-item>
			<a-form-item label="行程单号">
				<span>YNLJ1569374</span>
			</a-form-item>
			<a-form-item label="发团旅行社">
				<span>黑白水旅行社</span>
			</a-form-item>
			<a-form-item label="行程时间">
				<span>2022.2.23~2022.2.25</span>
			</a-form-item>
			<a-form-item label="联系电话">
				<span>18101235678</span>
			</a-form-item>
			<a-form-item label="行程人数">
				<span>30人</span>
			</a-form-item>
			<div class="title">订单信息</div>
			<a-form-item label="产品名称">
				<span>雪山行午餐包</span>
			</a-form-item>
			<a-form-item label="单价">
				<span>30元/人</span>
			</a-form-item>
			<a-form-item label="预定人数">
				<span>25人</span>
			</a-form-item>
			<a-form-item label="费用">
				<span>750元</span>
			</a-form-item>
			<a-form-item label="就餐时间">
				<span>2022.2.24</span>
			</a-form-item>
			<a-form-item label="预定时间">
				<span>2022.2.23 12:30</span>
			</a-form-item>
			<a-form-item label="核销人数">
				<span>25人</span>
			</a-form-item>
			<a-form-item label="核销时间">
				<span>2022.2.23 12:30</span>
			</a-form-item>
		</a-form>
	</div>
</template>

<script lang="ts" setup>
const tstyle = { 'font-weight': '700' };
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
}
</style>
