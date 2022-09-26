<template>
	<div class="table-area">
		<div class="list-btn" v-if="slotButton">
			<slot name="button"></slot>
		</div>
		<a-table v-bind="$attrs" :scroll="scroll" :row-selection="$attrs.rowSelection" :pagination="false" class="common-table">
			<template #bodyCell="data">
				<slot name="bodyCell" v-bind="data || {}"></slot>
			</template>
			<template #summary="data">
				<slot name="summary" v-bind="data || {}"></slot>
			</template>
		</a-table>
	</div>
</template>

<script setup lang="ts">
import { useSlots } from 'vue';
import { getElementPos } from '@/utils/util';

const props = defineProps({
	// 如果不需要表格自适应高度为false
	scrollY: {
		type: Boolean,
		default: true,
	},
	scroll: {
		type: Object,
		default: {
			x: '100vw',
			y: '100vh',
		},
	},
});
const attrs = useAttrs() as any;
const slotButton = !!useSlots().button;

const computeTableHeight = () => {
	if (props.scrollY) {
		nextTick(() => {
			// table-header
			const tableHeader = document.getElementsByClassName('ant-table-header')[0]?.offsetHeight || 0;
			// 分页
			const paginationHeight = document.getElementsByClassName('ant-pagination')[0]?.offsetHeight || 0;
			// common-table
			const commonTableHeight = document.getElementsByClassName('common-table')[0];
			// 计算总高度vh-除表格内容外高度
			let num = getElementPos(commonTableHeight).y + tableHeader + paginationHeight;
			const antTableBody = document.getElementsByClassName('ant-table-body')[0];
			// console.log('a-table-height:', num);
			// console.log('antheight:', antTableBody.offsetTop);`
			// console.log('getElementPos:', getElementPos(commonTableHeight).y);
			antTableBody.style.height = `calc(100vh - ${num + 25}px)`; // num + 微调
		});
	}
};

onBeforeMount(() => {
	// 如果没有操作列取消设置scrollx
	if (!attrs.columns.some((it: any) => it.fixed)) {
		props.scroll.x = '0';
	}
	if (!props.scrollY) {
		props.scroll.y = null;
	} else {
		props.scroll.y = props.scroll.y ? props.scroll.y : '100vh';
	}
});

onMounted(() => {
	computeTableHeight();
});

watch(
	() => attrs.dataSource?.length,
	(nVal) => {
		console.log('更新:', nVal);
		computeTableHeight();
	}
);
</script>

<style lang="scss">
.table-area {
	padding: 0 20px;
	.list-btn {
		display: flex;
		justify-content: flex-end;
		padding: 8px 0;
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
	// .ant-table-body {
	// 	height: calc(100vh - 394px);
	// }

	// 调整antable表头
	.ant-table-thead > tr > th {
		color: #1e2226;
		font-weight: bold;
		margin-right: 16px;
		background-color: #f5f7fa;
		// 去掉表头列右border
		&::before {
			display: none;
		}
	}
	.ant-table-cell {
		font-size: 12px;
	}
}
</style>
