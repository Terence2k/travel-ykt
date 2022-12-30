<template>
	<el-config-provider :locale="zhCn">
		<el-time-picker v-bind="$attrs" />
	</el-config-provider>
</template>

<script setup lang="ts">
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import { useAttrs } from 'vue';
const attrs = useAttrs();
</script>

<style lang="less" scoped></style>

