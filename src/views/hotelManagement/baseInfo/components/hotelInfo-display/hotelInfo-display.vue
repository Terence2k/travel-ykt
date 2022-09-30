<template>
	<div class="wrapper-tab-hotelInfo-display">
		<div class="scroll-container">
			<a-descriptions :column="1" title="基本信息" bordered>
				<a-descriptions-item label="酒店名称">Cloud Database</a-descriptions-item>
				<a-descriptions-item label="企业类型">Prepaid</a-descriptions-item>
				<a-descriptions-item label="所属地区">YES</a-descriptions-item>
				<a-descriptions-item label="统一社会信用代码">2018-04-24 18:00:00</a-descriptions-item>
				<a-descriptions-item label="营业执照">2019-04-24 18:00:00</a-descriptions-item>
				<a-descriptions-item label="联系人姓名">
					<a-badge status="processing" text="Running" />
				</a-descriptions-item>
				<a-descriptions-item label="联系人电话">$80.00</a-descriptions-item>
				<a-descriptions-item label="企业状态">$20.00</a-descriptions-item>
			</a-descriptions>

			<a-descriptions :column="1" title="减免属性" bordered>
				<a-descriptions-item label="是否支持减免">Cloud Database</a-descriptions-item>
				<a-descriptions-item label="减免规则">Prepaid</a-descriptions-item>
			</a-descriptions>

			<a-descriptions :column="1" title="结算(首款)账户信息" bordered>
				<a-descriptions-item label="账户类型">Cloud Database</a-descriptions-item>
				<a-descriptions-item label="收款账号">Prepaid</a-descriptions-item>
				<a-descriptions-item label="账户名">Prepaid</a-descriptions-item>
				<a-descriptions-item label="开户行地址">Prepaid</a-descriptions-item>
			</a-descriptions>
		</div>
		<div class="footer">
			<div class="button-container">
				<a-button class="button">审核通过</a-button>
				<a-button class="button">审核不通过</a-button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import api from '@/api';
const route = useRoute();
watch(
	() => route.query,
	(res) => {
		const id = res.id;
		if (id) {
			api.getHotelInfoAuditResult({}).then((res) => {
				console.info('获取审核信息 ：', res);
			});
		}
	},
	{ immediate: true }
);
</script>

<style lang="less" scoped>
@import './styles/hotelInfo-display.less';
</style>
