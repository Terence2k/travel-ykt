<template>
	<div>
		<div class="trave-contaner">
			<a-tabs v-model:activeKey="activeKey">
				<a-tab-pane v-for="(item, index) in pages" :key="index" :tab="item.label">
					<component @onSuccess="save" :onCheck="check" :is="item.name" v-if="index == activeKey"></component>
				</a-tab-pane>
			</a-tabs>
			<div class="footer">
				<a-button type="primary" @click="check = !check">保存</a-button>
				<a-button type="primary">下一步</a-button>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import baseinfo from './baseinfo/index.vue';
import cicerone from './cicerone/index.vue';
import travelled from './travelled/index.vue';
import { ref } from 'vue';
const activeKey = ref(0);
const check = ref(false)
const pages = [
	{
		name: baseinfo,
		label: '基本信息管理',
	},
	{
		name: cicerone,
		label: '导游信息',
	},
	{
		name: travelled,
		label: '行程信息',
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
.footer {
		position: sticky;
		bottom: 0;
		line-height: 64px;
		width: 100%;
		border-top: 1px solid #F1F2F5;
    background-color: #fff;
    padding-left: 16px;
    z-index: 99;
		button:first-of-type {
			margin-right: 16px;
		}
	}
</style>
