<template>
	<span class="toggle_screen" title="全屏切换" @click="toggleScreen">
		<FullscreenOutlined v-if="!isFullScreen" class="icon" />
		<FullscreenExitOutlined v-else class="icon" />
	</span>
</template>
<script setup lang="ts">
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons-vue';
import * as broswer from 'xyf_tools_js/lib/broswer';
const isFullScreen = ref(false);
const toggleScreen = () => {
	const flag = broswer.toggleFullscreen();
	isFullScreen.value = flag;
};
const resizeChange = () => {
	if (document.fullscreenElement) {
		isFullScreen.value = true;
	} else {
		isFullScreen.value = false;
	}
};

onMounted(async () => {
	window.addEventListener('resize', resizeChange);
});

onUnmounted(() => {
	window.removeEventListener('resize', resizeChange);
});
</script>
<style lang="less" scoped>
.toggle_screen {
	.icon {
		font-size: 20px;
		cursor: pointer;
		&:hover {
			color: #1890ff;
		}
	}
}
</style>
