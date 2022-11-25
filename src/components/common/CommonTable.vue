<template>
	<div class="table-area">
		<div class="list-btn" v-if="slotButton">
			<slot name="button"></slot>
		</div>
    <div class="describe" v-if="slotDescribe">
      <slot name="describe"></slot>
    </div>
		<a-table v-bind="$attrs" :scroll="scroll" :pagination="false" class="common-table">
			<template #headerCell="data">
				<slot name="headerCell" v-bind="data || {}"></slot>
			</template>
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
import { getElementPos, getStyles } from '@/utils/util';

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
const slotDescribe = !!useSlots().describe;

const computeTableHeight = () => {
	if (props.scrollY) {
    setTimeout(() => {
			// table-header
			const tableHeader = document.getElementsByClassName('ant-table-header');
			// 分页
			const pagination = document.getElementsByClassName('ant-pagination');
			// common-table
			const commonTable = document.getElementsByClassName('common-table');
      
			// 计算总高度vh-除表格内容外高度
			let num = getElementPos(commonTable[commonTable.length - 1]).y
      +
      getStyles(tableHeader[tableHeader.length - 1], 'height') 
      + 
      getStyles(pagination[pagination.length - 1], 'height') ;
			const antTableBody = document.getElementsByClassName('ant-table-body');
      antTableBody[antTableBody.length - 1].style.height = `calc(100vh - ${num + 25}px)`; // num + 微调

    }, 0);
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
  .describe {
    margin-bottom: 12px;
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
