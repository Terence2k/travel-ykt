<template>
	<div>
		<CommonSearch>
			<search-item label="预定时间">
				<a-space direction="vertical">
					<a-date-picker />
				</a-space>
			</search-item>
			<search-item label="入住时间">
				<a-space direction="vertical">
					<a-date-picker />
				</a-space>
			</search-item>
			<search-item label="行程单号">
				<a-input placeholder="请输入行程单号" />
			</search-item>
			<template #button>
				<a-button>查询</a-button>
			</template>
		</CommonSearch>
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
import CommonSearch from '@/components/common/CommonSearch.vue';
import SearchItem from '@/components/common/CommonSearchItem.vue';
import wait from './wait/index.vue';
import success from './success/index.vue';
import refuse from './refuse/index.vue';
import finish from './finish/index.vue';
import cancal from './cancal/index.vue';
const activeKey = ref(0);
const check = ref(false);
const pages = [
	{
		name: wait,
		label: '待审核',
	},
	{
		name: success,
		label: '审核完成',
	},
	{
		name: refuse,
		label: '审核不通过',
	},
	{
		name: cancal,
		label: '已取消',
	},
	{
		name: finish,
		label: '已完成',
	},
];
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
