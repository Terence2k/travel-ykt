<template>
	<div class="verificationRecord-display-wrapper">
		<div class="scroll-container">
			<a-descriptions :column="1" title="基本信息" bordered>
				<a-descriptions-item label="订单编号">{{ verificationRecordInfo?.hotelName || '' }}</a-descriptions-item>
				<a-descriptions-item label="核销项目">{{ verificationRecordInfo?.businessTypeName || '' }}</a-descriptions-item>
				<a-descriptions-item label="核销时间">{{ verificationRecordInfo?.address || '' }}</a-descriptions-item>
				<a-descriptions-item label="归属景区">{{ verificationRecordInfo?.creditCode || '' }}</a-descriptions-item>
				<a-descriptions-item label="旅行社名称">
					{{ verificationRecordInfo?.contactName || '' }}
				</a-descriptions-item>
				<a-descriptions-item label="订票人数">{{ verificationRecordInfo?.phone || '' }}</a-descriptions-item>
				<a-descriptions-item label="核销人数">{{ verificationRecordInfo?.unitStatusName || '' }}</a-descriptions-item>
				<a-descriptions-item label="订单金额">{{ verificationRecordInfo?.phone || '' }}</a-descriptions-item>
				<a-descriptions-item label="核销状态">{{ verificationRecordInfo?.phone || '' }}</a-descriptions-item>
			</a-descriptions>
		</div>
		<div class="footer">
			<div class="button-container">
				<!-- <a-button class="button">审核通过</a-button>
				<a-button class="button">审核不通过</a-button> -->
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue/es';
import api from '@/api';

const route = useRoute();
const verificationRecordInfo = ref({});
watch(
	() => route.query,
	(res) => {
		const id = res.id;
		if (id) {
			// api.getHotelDetailInfo({}, id).then((res) => {
			// 	verificationRecordInfo.value = res;
			// 	console.info(`id${id}酒店信息:`, res);
			// });
		}
	},
	{ immediate: true }
);
</script>

<style lang="less" scoped>
@import './styles/verificationRecord-display.less';
</style>
