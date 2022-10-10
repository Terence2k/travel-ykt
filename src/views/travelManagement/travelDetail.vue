<template>
  <div class="container">
    <div class="page-title">
      行程详情预览和打印
    </div>
    <div class="status-btns">
      <div class="status">
        当前状态：{{params.statusName}}
      </div>
      <div class="btns">
        <a-button type="primary">打印行程单</a-button>
        <a-button>打印保单</a-button>
        <a-button>打印游客名单</a-button>
      </div>
    </div>
    <a-row>
      <a-col :span="17">
        <a-descriptions :title="`行程单ID：${params.itineraryNo}`" bordered>
          <a-descriptions-item label="线路名称" :span="3">丽江古城-束河古镇-泸沽湖 夕阳红老年品质5日游（湖北-10月）</a-descriptions-item>
          <a-descriptions-item label="组团模式" :span="2">组团模式</a-descriptions-item>
          <a-descriptions-item label="团队类型" :span="2">团队类型</a-descriptions-item>
          <a-descriptions-item label="组团社" :span="2">组团社</a-descriptions-item>
          <a-descriptions-item label="组团社计调" :span="2">组团社计调</a-descriptions-item>
          <a-descriptions-item label="地接社" :span="2">地接社</a-descriptions-item>
          <a-descriptions-item label="地接社计调" :span="2">地接社计调</a-descriptions-item>
          <a-descriptions-item label="游客人数" :span="2">游客人数</a-descriptions-item>
          <a-descriptions-item label="古维费应缴人数" :span="2">古维费应缴人数</a-descriptions-item>
          <a-descriptions-item label="行程开始时间" :span="2">行程开始时间</a-descriptions-item>
          <a-descriptions-item label="行程结束时间" :span="2">行程结束时间</a-descriptions-item>
          <a-descriptions-item label="已添加景区" :span="2">已添加景区</a-descriptions-item>
          <a-descriptions-item label="已添加餐饮" :span="2">已添加餐饮</a-descriptions-item>
          <a-descriptions-item label="已添加酒店" :span="2">已添加酒店</a-descriptions-item>
          <a-descriptions-item label="预估应缴费（元）" :span="2">预估应缴费（元）</a-descriptions-item>
        </a-descriptions>
      </a-col>
      <a-col :span="7">
        <a-descriptions title="&nbsp;" bordered layout="vertical">
          <a-descriptions-item label="行程单二维码">待提交后生成</a-descriptions-item>
        </a-descriptions>
      </a-col>
    </a-row>
  </div> 
</template>
<script lang="ts" setup>
  import { ref, Ref, computed, watch, toRefs, reactive } from 'vue';
  const params: Ref<Record<string, any>> = ref({});
  onMounted(() => {
    const tempData = localStorage.getItem('tempData');
    if (tempData) {
      params.value = JSON.parse(tempData);
    } else {
      let { detailInfo } = useRoute().params as any; //isUpdate 传false的时候，解构后也是string类型
      params.value = JSON.parse(decodeURIComponent(detailInfo));
      localStorage.setItem('tempData', decodeURIComponent(detailInfo));
    }
  })
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