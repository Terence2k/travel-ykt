<template>
	<tr class="row">
		<td class="key">{{ props.title }}</td>
		<td class="value">{{ props.iValue }}</td>
	</tr>
</template>

<script setup lang="ts">
// const props = defineProps({
// 	label: {
// 		type: String || Number,
// 		default: '',
// 	},
// 	value: {
// 		type: String || Number,
// 		default: '',
// 	},
// });

const props = defineProps({
	iValue: String,
	title: String,
	star: Boolean,
});
onMounted(() => {
	console.log(props);
});
</script>

<style scoped lang="less">
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
		background: rgba(245, 247, 250, 0.8);
	}
}
</style>
