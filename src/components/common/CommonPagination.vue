<template>
  <div class="user-pagination">
    <div class="total-info" v-if="attrs.total">共{{attrs.total}}条</div>
    <a-pagination v-bind="$attrs" show-quick-jumper @change="onHandleCurrentChange"/>
  </div>
</template>

<script setup lang="ts">
const attrs = useAttrs();
const emit = defineEmits(['change']);
const onHandleCurrentChange = (e: number) => {
  emit('change', e)
}
</script>

<style lang="scss" scoped>
.ant-pagination {
	display: flex;
	justify-content: right;
	padding: 12px 20px 0 0;
	z-index: 100;
}
.user-pagination {
  display: flex;
  justify-content: flex-end;
  background-color: #fff;
  .total-info {
    display: flex;
	  padding: 12px 10px 0 0;
    align-items: center;
  }
}
</style>
