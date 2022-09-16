<template>
  <div class="layout-main-search">
      <div class="search-condition">
          <slot name="default"></slot>
      </div>
      <div class="search-button">
          <slot name="button"></slot>
      </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.layout-main-search {
  display: flex;
  flex-wrap: wrap;
  padding: 24px 52px 24px 20px;
  border-bottom: 12px #f1f2f5 solid;
}

.search-condition {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
  flex: 3;
  align-items: center;
}

.search-button {
  display: inline-flex;
  justify-content: flex-end;
  float: right;
  text-align: right;
  flex: 1;
}
:deep(.ant-input) {
  width: 200px;
}
:deep(.ant-select) {
  width: 200px;
}
</style>