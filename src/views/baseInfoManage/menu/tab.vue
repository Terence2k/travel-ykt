<template>
	<div class="trave-contaner">
		<a-tabs v-model:activeKey="activeKey">
			<a-tab-pane v-for="(item, index) in pages" :key="index" :tab="item.label">
				<component :is="item.name" v-if="index == activeKey"></component>
			</a-tab-pane>
		</a-tabs>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import app from './app.vue';
import index from './index.vue';
const tstyle = { 'font-weight': '700' };
const activeKey = ref(0);
const pages = [
	{
		name: index,
		label: '管理平台',
	},
	{
		name: app,
		label: 'app',
	},
];
</script>

<style lang="less" scoped>
.trave-contaner {
	::v-deep(.ant-tabs-nav) {
		padding: 16px 20px;
	}
	::v-deep(.ant-tabs-content-holder) {
		padding: 0 20px;
	}
}
</style>
