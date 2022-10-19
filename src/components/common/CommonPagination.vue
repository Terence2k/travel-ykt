<template>
	<a-pagination v-bind="$attrs" show-quick-jumper />
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.ant-pagination {
	display: flex;
	justify-content: right;
	padding: 12px 20px 0 0;
	z-index: 100;
}
</style>
