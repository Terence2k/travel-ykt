<template>
	<div class="wrapper">
		<a-tabs v-model:activeKey="activeTabKey">
			<a-tab-pane key="1" tab="Tab 1">Content of Tab Pane 1</a-tab-pane>
			<a-tab-pane key="2" tab="Tab 2" force-render>Content of Tab Pane 2</a-tab-pane>
		</a-tabs>
	</div>
</template>

<script setup lang="ts">
const activeTabKey = ref('1');
</script>

<style lang="less" scoped></style>
