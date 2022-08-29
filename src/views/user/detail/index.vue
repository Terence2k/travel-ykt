<template>
	<div class="box">{{ hello }}</div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
const hello = ref('详情');
const a = '/user/person_list/313';
const reg = '/user/person_list/:id';
</script>
<style lang="less" scoped>
.box {
	color: #60d659;
}
</style>
