<template>
	<div>
		<CommonSearch>
			<search-item label="预定时间">
				<a-space direction="vertical">
					<a-date-picker />
				</a-space>
			</search-item>
			<search-item label="行程单号">
				<a-input placeholder="请输入行程单号" />
			</search-item>
			<template #button>
				<a-button @click="onSearch">查询</a-button>
			</template>
		</CommonSearch>
		<div class="trave-contaner">
			<a-tabs v-model:activeKey="activeKey">
				<a-tab-pane v-for="(item, index) in pages" :key="index" :tab="item.label">
					<component :is="item.name" v-if="index == activeKey"></component>
				</a-tab-pane>
			</a-tabs>
		</div>
	</div>
</template>
<script lang="ts" setup>
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import wait from './wait/index.vue';
import end from './end/index.vue';
import cancel from './cancel/index.vue';
import { ref } from 'vue';
const activeKey = ref(0);
const pages = [
	{
		name: wait,
		label: '待核销',
	},
	{
		name: end,
		label: '核销完成',
	},
	{
		name: cancel,
		label: '已作废',
	},
];
</script>
<style lang="less" scoped>
.trave-contaner {
	:v-deep(.ant-tabs-nav) {
		padding: 16px 20px;
	}
	:v-deep(.ant-tabs-content-holder) {
		padding: 0 20px;
	}
}
.ant-table-thead > tr > th {
	border-top: 1px solid #f0f0f0;
	background-color: #fcfcfc;
	&::before {
		height: 100% !important;
	}
}
.ant-table-body {
	height: 500px;
}
</style>
