<template>
	<a-table v-bind="$attrs" :scroll="{ x: '100vw' }" :pagination="false">
		<template #bodyCell="data">
			<slot name="bodyCell" v-bind="data || {}"></slot>
		</template>
	</a-table>
</template>

<script setup lang="ts"></script>

<style lang="scss">
// 调整antable内容高度
.ant-table-content {
	height: calc(100vh - 350px);
}

// 调整antable表头字体
.ant-table-thead > tr > th {
	color: #1e2226;
	font-weight: bold;
	margin-right: 16px;
}
</style>
