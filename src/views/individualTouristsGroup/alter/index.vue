<template>
	<div>
		<div class="trave-contaner">
			<a-tabs v-model:activeKey="activeKey">
				<a-tab-pane v-for="(item, index) in pages" :key="index" :tab="item.label">
					<component :onCheck="check" :is="item.name"></component>
				</a-tab-pane>
				<template #rightExtra>
					<span class="close_btn" @click="$router.go(-1)">
						<close-outlined />
					</span>
				</template>
			</a-tabs>
		</div>
	</div>
</template>
<script lang="ts" setup>
import baseinfo from './baseinfo/index.vue';
import production from './production/edit.vue';
import { ref, onMounted, reactive } from 'vue';
import { useTravelStore } from '@/stores/modules/travelManagement';
import { CloseOutlined } from '@ant-design/icons-vue';
const activeKey = ref(0);
const check = ref(false); //触发保存
let pages = [
	{
		name: baseinfo,
		label: '修改基本信息',
	},
	{
		name: production,
		label: '修改预订产品',
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
	border-top: 1px solid #f1f2f5;
	background-color: #fff;
	padding-left: 16px;
	z-index: 99;
	button:first-of-type {
		margin-right: 16px;
	}
}
.close_btn {
	cursor: pointer;
}
</style>
