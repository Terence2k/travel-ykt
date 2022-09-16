<template>
	<div class="table-area">
		<div class="list-btn">
			<slot name="button"></slot>
		</div>
		<a-table v-bind="$attrs" :scroll="{ x: '100vw', y: '100vh' }" :pagination="false" class="common-table">
			<template #bodyCell="data">
				<slot name="bodyCell" v-bind="data || {}"></slot>
			</template>
		</a-table>
	</div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
.table-area {
	.list-btn {
		display: flex;
		justify-content: flex-end;
		padding: 24px 52px 16px;
	}
	// 操作列按钮
	.action-btns {
		a {
			display: inline-block;
			margin: 0 6px;
			&:first-of-type {
				margin-left: 0;
			}
		}
	}
}
.common-table {
	// 调整antable内容高度
	.ant-table-body {
		height: calc(100vh - 450px);
	}

	// 调整antable表头字体
	.ant-table-thead > tr > th {
		color: #1e2226;
		font-weight: bold;
		margin-right: 16px;
	}
}
</style>
