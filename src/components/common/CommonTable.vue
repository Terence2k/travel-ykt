<template>
	<div class="table-area">
		<div class="list-btn" v-if="slotButton">
			<slot name="button"></slot>
		</div>
		<a-table v-bind="$attrs" :scroll="{ x: '100vw', y: '100vh' }" :pagination="false" class="common-table">
			<template #bodyCell="data">
				<slot name="bodyCell" v-bind="data || {}"></slot>
			</template>
		</a-table>
	</div>
</template>

<script setup lang="ts">
  import { useSlots } from "vue";
  const attrs = useAttrs() as any;
  const slotButton = !!useSlots().button;

  const computeTableHeight = () => {
    nextTick(() => {
      const headerHeight = document.getElementsByClassName('layout-header')[0]?.offsetHeight || 0;
      const navigationHeight = document.getElementsByClassName('navigation_wrapper')[0]?.offsetHeight || 0;
      const layoutHeight = document.getElementsByClassName('layout-main-search')[0]?.offsetHeight || 0;
      const btnListhHeight = document.getElementsByClassName('list-btn')[0]?.offsetHeight || 0;
      const tableHeader = document.getElementsByClassName('ant-table-header')[0]?.offsetHeight || 0;
      const paginationHeight = document.getElementsByClassName('ant-pagination')[0]?.offsetHeight || 0;
      const tooterHeight = document.getElementsByClassName('tooter-btn')[0]?.offsetHeight + 10 || 0;
      const tabsHeight = document.getElementsByClassName('ant-tabs-nav')[0]?.offsetHeight || 0;

      // 计算总高度vh-除表格内容外高度
      let num = headerHeight
      + navigationHeight
      + layoutHeight
      + btnListhHeight
      + tableHeader
      + paginationHeight
      + tooterHeight
      + tabsHeight;
      console.log('a-table-height:', num);
      
      const antTableBody = document.getElementsByClassName('ant-table-body')[0];
      antTableBody.style.height = `calc(100vh - ${num + 40}px)`;

    })
  }

  onMounted(() => {
    computeTableHeight()
  });

  watch(() => attrs.dataSource.length, (nVal) => {
    console.log('更新:', nVal);
    computeTableHeight()
  })
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
