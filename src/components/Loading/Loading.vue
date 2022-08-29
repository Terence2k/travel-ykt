<template>
	<div class="loader-inner ball-pulse">
		<Spin :indicator="indicator" tip="正在加载..." />
	</div>
</template>
  
<script lang="ts">
import { Loading3QuartersOutlined } from '@ant-design/icons-vue';
import { Spin } from 'ant-design-vue'
import { defineComponent, h } from 'vue';
	export default defineComponent({
		name: 'Loading',
		components: {Spin},
		setup() {
			const indicator = h(Loading3QuartersOutlined, {
				style: {
					fontSize: '55px',
				},
				spin: true,
			});
			return {
				indicator,
			};
		},
	});
</script>
  
<style>
  .my_Loading {
    position: fixed;
    width: 100%;
    height: 100vh;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: rgba(0, 0, 0, 0.4);
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
  