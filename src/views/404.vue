<template>
  <a-result status="404" title="404" sub-title="抱歉, 你访问的页面不存在。">
    <template #extra>
      <a-button type="primary" @click="$router.push('/')">返回首页</a-button>
    </template>
  </a-result>
</template>

<script setup lang="ts">
import MyWorker from "../utils/worker.ts?worker";

const worker = new MyWorker();

onMounted(() => {
  worker.postMessage("开启线程");
  worker.onmessage = (e: { data: string }) => {
    console.log(e.data);
    setTimeout(() => {
      worker.postMessage("线程关闭");
      worker.terminate();
    }, 1000);
  };
});
</script>
