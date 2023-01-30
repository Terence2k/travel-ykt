<template>
  <div class="container" id="printBox">
    <a-descriptions :column="2" :title="`行程单ID：${state.basicData.itineraryNo}`" bordered>
      <a-descriptions-item label="线路名称" :span="2">{{state.basicData.routeName}}</a-descriptions-item>
      <a-descriptions-item label="组团模式">{{state.basicData.groupTypeName}}</a-descriptions-item>
      <a-descriptions-item label="团队类型">{{state.basicData.teamTypeName}}</a-descriptions-item>
      <a-descriptions-item label="组团社">{{state.basicData.travelName}}</a-descriptions-item>
      <a-descriptions-item label="组团社计调">{{state.basicData.travelOperatorName}} {{state.basicData.travelOperatorPhone}}</a-descriptions-item>
      <a-descriptions-item label="地接社">{{state.basicData.subTravelName}}</a-descriptions-item>
      <a-descriptions-item label="地接社计调">{{state.basicData.subTravelOperatorName}} {{state.basicData.subTravelOperatorPhone}}</a-descriptions-item>
      <a-descriptions-item label="游客人数">{{state.basicData.touristCount}}</a-descriptions-item>
      <a-descriptions-item label="古维费应缴人数">{{state.basicData.guWeiCount}}</a-descriptions-item>
      <a-descriptions-item label="行程时间">{{state.basicData.startDate}} - {{ state.basicData.endDate }}</a-descriptions-item>
      <a-descriptions-item label="综费应缴人数">{{state.basicData.productPeopleCount }}</a-descriptions-item>
      <a-descriptions-item label="已添加景区">{{state.basicData.ticketCount}}</a-descriptions-item>
      <a-descriptions-item label="已添加酒店">{{state.basicData.hotelCount}}</a-descriptions-item>
      <a-descriptions-item label="已添加餐饮">{{state.basicData.cateringCount}}</a-descriptions-item>
      <a-descriptions-item label="预估应缴费（元）">{{accDiv(state.basicData.totalFee, 100)}}元</a-descriptions-item>
      <a-descriptions-item label="关联行程单">{{state.basicData.relatedItineraryNo}}</a-descriptions-item>
      <a-descriptions-item label="保险购买方">{{state.basicData.insuranceStatusName}}</a-descriptions-item>
    </a-descriptions>
    <div class="page-title" style="margin-top: 32px;">
      行程日志记录（共{{state.operationLog.total}}条）
    </div>
    <CommonTable :dataSource="state.operationLog.content" :columns="columns" :scrollY="false">
        <template #bodyCell="{ column, index, record }">
          <template v-if="column.key === 'index'">
              <div>
                  {{(state.param.pageNo - 1) * (state.param.pageSize) + (index + 1)}}
              </div>
          </template>
      </template>
    </CommonTable>
    <CommonPagination
      :current="state.param.pageNo"
      :page-size="state.param.pageSize"
      :total="state.operationLog.total"
			@change="onHandleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { Ref } from 'vue';
import CommonTable from '@/components/common/CommonTable.vue'
  import CommonPagination from '@/components/common/CommonPagination.vue'
import { accDiv } from '@/utils/compute';
import api from '@/api';

const columns: Ref<Array<any>> = ref([
  {
    title: '序号',
    key: 'index',
    width: '80px'
  },
  {
    title: '操作',
    dataIndex: 'operationDesc',
    key: 'operationDesc',
  },
  {
    title: '之前状态',
    dataIndex: 'beforeStatusText',
    key: 'beforeStatusText',
  },
  {
    title: '之后状态',
    dataIndex: 'afterStatusText',
    key: 'afterStatusText',
  },
  {
    title: '操作人',
    dataIndex: 'operationUserName',
    key: 'operationUserName',
  },
  {
    title: '操作时间',
    dataIndex: 'operationDate',
    key: 'operationDate',
  },
  {
    title: '说明',
    dataIndex: 'operationRemark',
    key: 'operationRemark',
  },
]);
const state = reactive({
  basicData: {} as any,
  param: {
    pageNo: 1,
    pageSize: 10,
  },
  insuranceStatusName: '',
  itineraryDetail: {} as any,
  operationLog: {
    content: [],
    total: 0,
    pageNo: 1,
    pageSize: 10,
  }
});
const route = useRouter();


const getItineraryDetail = (orderId: any) => {
  let queryData = {
    oid: orderId,
    ...state.param
  }
  api.travelManagement.getItineraryDetail(queryData).then(async (res: any) => {
    state.basicData = res.basic;
    state.itineraryDetail = res;
  })
  .catch((err: any) => {
    console.log(err);
  });
}

const getItineraryOperationLog = (orderId: any) => {
  let queryData = {
    itineraryId: orderId,
    ...state.param
  }
  api.travelManagement.getItineraryOperationLog(queryData).then(async (res: any) => {
    console.log('getItineraryOperationLog:', res);
    state.operationLog = res;
  })
  .catch((err: any) => {
    console.log(err);
  });
}
const onHandleCurrentChange = (e:any) => {
  state.param.pageNo = e
  getItineraryOperationLog(route.currentRoute.value.query.oid);
}

getItineraryDetail(route.currentRoute.value.query.oid);
getItineraryOperationLog(route.currentRoute.value.query.oid);
</script>

<style lang="less" scoped>
.container {
  padding: 20px;
  .page-title {
    line-height: 44px;
    font-size: 16px;
    font-weight: bold;
    color: #1E2226;
    .descriptions {
      margin-left: 5px;
    }
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
  .table-area {
    padding: 0;
  }
  :deep(.qr-code.ant-descriptions-item-content) {
    height: 384px;
    text-align: center;
    color: #9DA0A4;
  }
  
  .table-url {
    display: block;
    white-space: nowrap;
    max-width: 600px;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>