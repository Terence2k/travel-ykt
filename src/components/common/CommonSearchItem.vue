<template>
  <div class="search-items">
		<span class="mr4 red" v-if="props.star">*</span>
    <span class="mr4 title" v-if="props.label">{{ props.label }}：</span>
    <slot name="default"></slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  label: String,
  star: Boolean,
});
onMounted(() => {
  console.log('props:', props);
  
});
</script>

<style lang="scss" scoped>
.search-items {
  display: flex;
  align-items: center;
  margin-right: 32px;
  .title {
    color: #1E2226;
    font-weight: bold;
    margin-right: 16px;
  }
}
.red {
	color: red;
}
</style>