<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { ref } from 'vue';

dayjs.locale('zh-cn');
const locale = ref(zhCN);
</script>

<template>
	<!-- {{ title }} -->
	<a-config-provider :locale="locale">
		<RouterView key="appWrapper" />
	</a-config-provider>
</template>

<style>
@import './assets/base.css';
</style>
