<template>
  <div class="container">
    <div class="page-title">
      行程详情预览和打印
    </div>
    <div class="status-btns">
      <div class="status">
        当前状态：待逐项购买
      </div>
      <div class="btns">
        <a-button type="primary">打印行程单</a-button>
        <a-button>打印保单</a-button>
        <a-button>打印游客名单</a-button>
      </div>
    </div>
    <div class="info-card">
      <a-descriptions title="行程单ID：YNLJ202210020000009" bordered>
        <a-descriptions-item label="线路名称">丽江古城-束河古镇-泸沽湖 夕阳红老年品质5日游（湖北-10月）</a-descriptions-item>
        <a-descriptions-item label="Billing Mode">Prepaid</a-descriptions-item>
        <a-descriptions-item label="Automatic Renewal">YES</a-descriptions-item>
      </a-descriptions>
    </div>
  </div> 
</template>
<script lang="ts" setup>
</script>
<style lang="less" scoped>
.container {
  padding: 0 20px;
  .page-title {
    line-height: 44px;
    font-size: 16px;
    font-weight: bold;
    color: #1E2226;
    border-bottom: 1px solid #F1F2F5;
  }
  .status-btns {
    padding: 16px 0;
    display: flex;
    justify-content: space-between;
    .btns {
      .ant-btn {
        margin-left: 8px;
      }
    }
  }
  .info-card {
  }
}
</style>