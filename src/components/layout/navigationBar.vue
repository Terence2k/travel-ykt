<template>
	<a-breadcrumb class="navigation_wrapper">
		<a-breadcrumb-item v-for="title in state.routeList" :key="title">{{ title }}</a-breadcrumb-item>
	</a-breadcrumb>
</template>

<script setup></script>

<style lang="less">
.navigation_wrapper {
	background-color: #fff;
}
</style>
