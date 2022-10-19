<template>
	<div class="wrapper-tab-hotelInfo-display">
		<div class="scroll-container">
			<a-descriptions :column="1" title="基本信息" bordered>
				<a-descriptions-item label="酒店名称">{{ hotelInfo?.hotelName || '' }}</a-descriptions-item>
				<a-descriptions-item label="企业类型">{{ hotelInfo?.businessTypeName || '' }}</a-descriptions-item>
				<a-descriptions-item label="所属地区">{{ hotelInfo?.address || '' }}</a-descriptions-item>
				<a-descriptions-item label="统一社会信用代码">{{ hotelInfo?.creditCode || '' }}</a-descriptions-item>
				<a-descriptions-item label="营业执照">
					<a-image :width="200" :src="`${hotelInfo?.businessLicenseUrl}`">
						<!-- <template #placeholder>
							<a-image
								src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
								:width="200"
								:preview="false"
							/>
						</template> -->
					</a-image>
				</a-descriptions-item>
				<a-descriptions-item label="联系人姓名">
					{{ hotelInfo?.contactName || '' }}
				</a-descriptions-item>
				<a-descriptions-item label="联系人电话">{{ hotelInfo?.phone || '' }}</a-descriptions-item>
				<a-descriptions-item label="企业状态">{{ hotelInfo?.unitStatusName || '' }}</a-descriptions-item>
			</a-descriptions>

			<a-descriptions :column="1" title="减免属性" bordered>
				<a-descriptions-item label="是否支持减免">{{ hotelInfo?.isReducedName || '' }}</a-descriptions-item>
				<a-descriptions-item label="减免规则">{{ hotelInfo?.reduceRule || '' }}</a-descriptions-item>
			</a-descriptions>

			<a-descriptions :column="1" title="结算(首款)账户信息" bordered>
				<a-descriptions-item label="账户类型">{{ hotelInfo?.accountTypeName || '' }}</a-descriptions-item>
				<a-descriptions-item label="收款账号">{{ hotelInfo?.bankAccount || '' }}</a-descriptions-item>
				<a-descriptions-item label="账户名">{{ hotelInfo?.bankAccountName || '' }}</a-descriptions-item>
				<a-descriptions-item label="开户行地址">{{ hotelInfo?.accountAddress || '' }}</a-descriptions-item>
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
import { message } from 'ant-design-vue/es';
import api from '@/api';

const route = useRoute();
const hotelInfo = ref({});
watch(
	() => route.query,
	(res) => {
		const id = res.id;
		if (id || id === 0) {
			api.getHotelDetailInfo({}, id).then((res) => {
				hotelInfo.value = res;
				console.info(`id${id}酒店信息:`, res);
			});
		}
	},
	{ immediate: true }
);
</script>

<style lang="less" scoped>
@import './styles/hotelInfo-display.less';
</style>
