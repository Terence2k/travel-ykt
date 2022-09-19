<template>
  <div class="trave-contaner">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane 
        v-for="(item, index) in pages" 
        :key="index" 
        :tab="item.label">
        <component :is="item.name" v-if="index == activeKey"></component>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts" setup>
import baseInfo from './baseInfo/baseInfo.vue';
import guideInfo from './guideInfo/guideInfo.vue';
import touristInfo from './touristInfo/touristInfo.vue';
import traveInfo from './traveInfo/traveInfo.vue';
import trafficInfo from './trafficInfo/trafficInfo.vue';
import fileInfo from './fileInfo/fileInfo.vue';
  const activeKey = ref(0);
  const pages = [
    {
      name: baseInfo,
      label: '基本信息管理'
    },
    {
      name: guideInfo,
      label: '导游信息'
    },
    {
      name: touristInfo,
      label: '游客信息'
    },
    {
      name: trafficInfo,
      label: '交通信息'
    },
    {
      name: traveInfo,
      label: '行程信息'
    },
    {
      name: fileInfo,
      label: '附件上传'
    }
  ]
</script>
<style lang="less" scoped>
  .trave-contaner {
    ::v-deep(.ant-tabs-nav) {
      padding: 16px 20px;
    }
    ::v-deep(.ant-tabs-content-holder) {
      padding: 0 20px;
    }
    
  }
</style>