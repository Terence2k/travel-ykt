<template>
	<div class="table_box">
		<table class="info_table" cellpadding="16px" border="1">
			<slot name="default"> </slot>
		</table>
	</div>
</template>

<script setup lang="ts" name="form-wrap">
const props = defineProps({
	label: {
		type: String || Number,
		default: '',
	},
	value: {
		type: String || Number,
		default: '',
	},
});
</script>

<style scoped lang="less">
.table_box {
	max-height: 80vh;
	padding: 1px 0;
	overflow: auto;

	.row {
		width: 100%;
		font-size: 14px;
		font-family: Microsoft YaHei UI;
		font-weight: 400;
		color: #1e2226;
		border: 1px solid #e9e9e9;
		td {
			text-align: center;
		}
	}

	.change_table {
		width: 100%;

		.key,
		.key_hd {
			width: 150px;
		}

		.key_hd {
			background: rgba(245, 247, 250, 0.39);
		}

		.value {
			min-width: 300px;
		}
	}

	.info_table {
		width: 100%;

		.key {
			width: 250px;
			background: rgba(245, 247, 250, 0.39);
		}
	}
}
</style>
