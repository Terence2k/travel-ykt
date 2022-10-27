<template>
	<div class="verificationRecord-display-wrapper">
		<div class="scroll-container">
			<a-descriptions :column="1" title="基本信息" bordered>
				<a-descriptions-item label="订单编号">{{ verificationRecordInfo?.orderNo || '' }}</a-descriptions-item>
				<a-descriptions-item label="核销项目">{{ verificationRecordInfo?.verificationItemName || '' }}</a-descriptions-item>
				<a-descriptions-item label="核销时间">{{ verificationRecordInfo?.verificationTime || '' }}</a-descriptions-item>
				<a-descriptions-item label="归属景区">{{ verificationRecordInfo?.scenicName || '' }}</a-descriptions-item>
				<a-descriptions-item label="旅行社名称">
					{{ verificationRecordInfo?.sendTravelName || '' }}
				</a-descriptions-item>
				<a-descriptions-item label="核销状态">{{ verificationRecordInfo?.verifCount || '' }}</a-descriptions-item>
			</a-descriptions>
		</div>
		<div class="footer">
			<div class="button-container">
				<a-button class="button" @click="closeDetailsPage">关闭</a-button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue/es';
import api from '@/api';

const route = useRoute();
const router = useRouter();
const verificationRecordInfo = ref({});
watch(
	() => route.query,
	(res) => {
		const id = res.id;
		if (id || id === 0) {
			api.getWriteOffRecordDetails(id).then((res) => {
				verificationRecordInfo.value = res;
				console.info(`id${id}核销记录详情:`, res);
			});
		}
	},
	{ immediate: true }
);

const closeDetailsPage = () => {
	router.push({ path: '/scenic-spot/verificationRecord' });
};
</script>

<style lang="less" scoped>
@import './styles/verificationRecord-display.less';
</style>
