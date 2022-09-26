<template>
	<div>
		<div class="trave-contaner">
			<a-tabs v-model:activeKey="activeKey">
				<a-tab-pane v-for="(item, index) in pages" :key="index" :tab="item.label">
					<component :onCheck="check" :is="item.name"></component>
				</a-tab-pane>
			</a-tabs>
		</div>
	</div>
</template>
<script lang="ts" setup>
import hotelinfo from './hotelinfo/index.vue';
import peoinfo from './peoinfo/index.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
const navigatorBar = useNavigatorBar();
const activeKey = ref(0);
const check = ref(false);
const pages = [
	{
		name: hotelinfo,
		label: '酒店',
	},
	{
		name: peoinfo,
		label: '人员信息',
	}
];
onMounted(() => {
	navigatorBar.setNavigator(['订单管理','审核']);
});
onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
});
</script>
<style lang="less" scoped>
.trave-contaner {
	height: 100%;
	::v-deep(.ant-tabs-nav) {
		padding: 16px 20px;
	}
	// ::v-deep(.ant-tabs-content-holder) {
	//   padding: 0 20px;
	// }
}

.footer {
	position: sticky;
	bottom: 0;
	line-height: 64px;
	width: 100%;
	border-top: 1px solid #f1f2f5;
	background-color: #fff;
	padding-left: 16px;
	z-index: 99;
	button:first-of-type {
		margin-right: 16px;
	}
}
</style>
