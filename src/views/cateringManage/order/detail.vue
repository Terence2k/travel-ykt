<template>
	<div>
		<a-form labelAlign="left" :label-col="{ span: 3 }" :wrapper-col="{ span: 6 }">
			<a-card title="行程信息" :headStyle="tstyle" style="width: 100%; font-weight: 700" :bordered="false">
				<a-form-item label="行程类型">
					<span>标准团</span>
				</a-form-item>
				<a-form-item label="行程单号">
					<span>行程单号</span>
				</a-form-item>
				<a-form-item label="发团旅行社">
					<span>发团旅行社</span>
				</a-form-item>
				<a-form-item label="行程时间">
					<span>行程时间</span>
				</a-form-item>
				<a-form-item label="联系电话">
					<span>联系电话</span>
				</a-form-item>
				<a-form-item label="行程人数">
					<span>行程人数</span>
				</a-form-item>
			</a-card>
			<a-card title="订单信息" style="width: 100%" :bordered="false">
                <a-form-item label="产品名称">
					<span>产品名称</span>
				</a-form-item>
				<a-form-item label="单价">
					<span>单价</span>
				</a-form-item>
				<a-form-item label="预定人数">
					<span>预定人数</span>
				</a-form-item>
				<a-form-item label="费用">
					<span>费用</span>
				</a-form-item>
				<a-form-item label="就餐时间">
					<span>就餐时间</span>
				</a-form-item>
				<a-form-item label="预定时间">
					<span>预定时间</span>
				</a-form-item>
                <a-form-item label="核销人数">
					<span>核销人数</span>
				</a-form-item>
                <a-form-item label="核销时间">
					<span>核销时间</span>
				</a-form-item>
            </a-card>
		</a-form>
	</div>
</template>

<script lang="ts" setup>
const tstyle = { 'font-weight': '700' };
</script>

<style lang="less" scoped></style>
