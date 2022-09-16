<template>
  <div>
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane 
        v-for="(item, index) in pages" 
        :key="index" 
        :tab="item.label">
        <components :is="item.name" v-if="index == activeKey"></components></a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts" setup>
  const activeKey = ref(0);
  const pages = [
    {
      name: 'baseInfo',
      label: '基本信息管理'
    },
    {
      name: 'guideInfo',
      label: '导游信息'
    },
    {
      name: 'touristInfo',
      label: '游客信息'
    },
    {
      name: 'trafficInfo',
      label: '交通信息'
    },
    {
      name: 'traveInfo',
      label: '行程信息'
    },
    {
      name: 'fileInfo',
      label: '附件上传'
    }
  ]
</script>
<style lang="less" scoped>

</style>