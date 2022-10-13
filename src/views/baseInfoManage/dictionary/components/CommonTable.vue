<template>
	<div class="table-box">
		<div class="list-btns-box">
			<slot name="button"></slot>
		</div>
		<a-table v-bind="$attrs" :pagination="false" class="common-table-box">
			<template #bodyCell="data">
				<slot name="bodyCell" v-bind="data || {}"></slot>
			</template>
		</a-table>
	</div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
.table-box {
	padding: 0;

	.list-btns-box {
		margin-bottom: 17px;
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

.common-table-box {

	// 调整antable表头字体
	.ant-table-thead>tr>th {
		color: #1e2226;
		font-weight: bold;
		margin-right: 16px;
	}
}
</style>
