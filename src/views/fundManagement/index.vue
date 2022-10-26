<template>
  <div class="header">
    <div class="header_left">
      <div class="header_left_top">
        <div class="info_item">已绑定的收款账户：丽江黑松白鹿旅游服务有限公司</div>
        <div class="info_item">开户行：中国建设银行丽江分行古城支行</div>
        <div class="info_item">银行账号： 589 3728203 980</div>
      </div>
      <div class="header_left_bottom">
        <div class="list_item">
          <div class="text">当前可用余额</div>
          <div>
            <div class="number">50,000.00</div>
            <div>
              <span class="list_item_operate" @click="goTo">去充值</span>
              <span class="list_item_operate">申请退款</span>
            </div>
          </div>
        </div>
        <div class="split_line"></div>
        <div class="list_item">
          <div class="text">当前预冻结金额</div>
          <div>
            <div class="number">98,500.50</div>
            <div>
              <span class="list_item_operate">查看详情</span>
            </div>
          </div>
        </div>
        <div class="split_line"></div>
        <div class="list_item">
          <div class="text">已充值金额</div>
          <div>
            <div class="number">10,000.00</div>
            <div>
              <span class="list_item_operate">查看详情</span>
            </div>
          </div>
        </div>
        <div class="split_line"></div>
        <div class="list_item">
          <div class="text">已支出金额</div>
          <div>
            <div class="number">113,000.00</div>
            <div>
              <span class="list_item_operate">查看详情</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="header_right">
      <div class="header_right_top info_item">一卡通账户名称：丽江黑松白鹿旅行社</div>
      <div class="header_right_bottom">
        <div class="info_item">一卡通资金子账号：<span>当前未开通</span></div>
        <div class="count">6225 0088 4399 0074</div>
        <!-- <a-button type="primary">
          申请开通
        </a-button> -->
      </div>
    </div>
  </div>
  <div class="info_details">
    <a-tabs v-model:activeKey="activeKey" @change="tabsChange">
      <a-tab-pane key="1" tab="充值记录查询">
        <CommonSearch>
          <search-item label="充值时间">
            <a-date-picker v-model:value="tableData1.param.value1" />
          </search-item>
          <search-item label="充值流水号">
            <a-input v-model:value="tableData1.param.value1" placeholder="请输入订单号" allowClear />
          </search-item>
          <search-item label="充值金额">
            <a-input v-model:value="tableData1.param.value1" allowClear style="width:150px" />
            <span style="margin:0 20px">-</span>
            <a-input v-model:value="tableData1.param.value1" allowClear style="width:150px" />
            <span style="margin-left: 20px">元</span>
          </search-item>
          <template #button>
            <a-button @click="onQuery">查询</a-button>
          </template>
        </CommonSearch>
        <CommonTable :dataSource="tableData1.data" :columns="columns1">
        </CommonTable>
        <div class="buttom_box">
          <div>共 <span style="color:#de0025">{{ tableData1.total }}</span> 条消息</div>
          <CommonPagination v-model:current="tableData1.param.pageNo" v-model:page-size="tableData1.param.pageSize"
            :total="tableData1.total" @change="onHandleCurrentChange" @showSizeChange="pageSideChange" />
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="资金支出记录">
        <CommonSearch>
          <search-item label="支出时间">
            <a-date-picker v-model:value="tableData2.param.value1" />
          </search-item>
          <search-item label="支出流水号">
            <a-input v-model:value="tableData2.param.value1" placeholder="请输入订单号" allowClear />
          </search-item>
          <search-item label="支出金额">
            <a-input v-model:value="tableData2.param.value1" allowClear style="width:150px" />
            <span style="margin:0 20px">-</span>
            <a-input v-model:value="tableData2.param.value1" allowClear style="width:150px" />
            <span style="margin-left: 20px">元</span>
          </search-item>
          <template #button>
            <a-button @click="onQuery">查询</a-button>
          </template>
        </CommonSearch>
        <CommonTable :dataSource="tableData2.data" :columns="columns2">
        </CommonTable>
        <div class="buttom_box">
          <div>共 <span style="color:#de0025">{{ tableData2.total }}</span> 条消息</div>
          <CommonPagination v-model:current="tableData2.param.pageNo" v-model:page-size="tableData2.param.pageSize"
            :total="tableData2.total" @change="onHandleCurrentChange" @showSizeChange="pageSideChange" />
        </div>
      </a-tab-pane>
      <a-tab-pane key="3" tab="预冻结资金">
        <CommonSearch>
          <search-item label="预冻结时间">
            <a-date-picker v-model:value="tableData3.param.value1" />
          </search-item>
          <search-item label="预冻结流水号">
            <a-input v-model:value="tableData3.param.value1" placeholder="请输入订单号" allowClear />
          </search-item>
          <search-item label="预冻结金额">
            <a-input v-model:value="tableData3.param.value1" allowClear style="width:150px" />
            <span style="margin:0 20px">-</span>
            <a-input v-model:value="tableData3.param.value1" allowClear style="width:150px" />
            <span style="margin-left: 20px">元</span>
          </search-item>
          <template #button>
            <a-button @click="onQuery">查询</a-button>
          </template>
        </CommonSearch>
        <CommonTable :dataSource="tableData3.data" :columns="columns3">
        </CommonTable>
        <div class="buttom_box">
          <div>共 <span style="color:#de0025">{{ tableData3.total }}</span> 条消息</div>
          <CommonPagination v-model:current="tableData3.param.pageNo" v-model:page-size="tableData3.param.pageSize"
            :total="tableData3.total" @change="onHandleCurrentChange" @showSizeChange="pageSideChange" />
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue'
import CommonPagination from '@/components/common/CommonPagination.vue'
import CommonSearch from '@/components/common/CommonSearch.vue'
import SearchItem from '@/components/common/CommonSearchItem.vue'
import api from '@/api';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const goTo = () => {
  router.push({
    name: 'recharge',
  })
}
const activeKey = ref('1')
const state = reactive({
  tableData1: {
    data: [],
    total: 0,
    loading: false,
    param: {
      pageNo: 1,
      pageSize: 10,
      auditStatus: 2,
    },
  },
  tableData2: {
    data: [],
    total: 0,
    loading: false,
    param: {
      pageNo: 1,
      pageSize: 10,
      auditStatus: 1,
    },
  },
  tableData3: {
    data: [],
    total: 0,
    loading: false,
    param: {
      pageNo: 1,
      pageSize: 10,
      auditStatus: 3,
    },
  }
});
const { tableData1, tableData2, tableData3 } = toRefs(state)
const columns1 = [
  {
    title: '充值流水号',
    dataIndex: 'account',
    key: 'account',
  },
  {
    title: '充值金额',
    dataIndex: 'account',
    key: 'account',
  },
  {
    title: '充值时间',
    dataIndex: 'account',
    key: 'account',
  },
  {
    title: '充值前余额',
    dataIndex: 'account',
    key: 'account',
  },
  {
    title: '充值后余额',
    dataIndex: 'account',
    key: 'account',
  },
  {
    title: '充值资金来源（银行账户）',
    dataIndex: 'account',
    key: 'account',
  },
  {
    title: '操作员',
    dataIndex: 'account',
    key: 'account',
  }
]
const columns2 = [
  {
    title: '支出流水号',
    dataIndex: 'account',
    key: 'account',
  },
  {
    title: '支出金额',
    dataIndex: 'account',
    key: 'account',
  },
  {
    title: '支出时间',
    dataIndex: 'account',
    key: 'account',
  },
  {
    title: '支出前余额',
    dataIndex: 'account',
    key: 'account',
  },
  {
    title: '支出后余额',
    dataIndex: 'account',
    key: 'account',
  },
  {
    title: '支出资金来源（银行账户）',
    dataIndex: 'account',
    key: 'account',
  },
  {
    title: '操作员',
    dataIndex: 'account',
    key: 'account',
  }
]
const columns3 = [
  {
    title: '预冻结流水号',
    dataIndex: 'account',
    key: 'account',
  },
  {
    title: '预冻结金额',
    dataIndex: 'account',
    key: 'account',
  },
  {
    title: '预冻结时间',
    dataIndex: 'account',
    key: 'account',
  },
  {
    title: '预冻结前余额',
    dataIndex: 'account',
    key: 'account',
  },
  {
    title: '预冻结后余额',
    dataIndex: 'account',
    key: 'account',
  },
  {
    title: '预冻结资金来源（银行账户）',
    dataIndex: 'account',
    key: 'account',
  },
  {
    title: '操作员',
    dataIndex: 'account',
    key: 'account',
  }
]
const tabsChange = (val: string) => {
  switch (val) {
    case '1':

      break;
    case '2':

      break;
    case '3':

      break;
  }
}
const onQuery = () => { }
const onSearch = () => { }
const onHandleCurrentChange = (val: number) => {
  state.tableData1.param.pageNo = val;
  onSearch();
}

const pageSideChange = (current: number, size: number) => {
  state.tableData1.param.pageSize = size;
  onSearch();
}
</script>

<style scoped lang="scss">
.header {
  display: flex;
  padding: 24px 20px;
  border-bottom: 12px #f1f2f5 solid;

  .info_item {
    margin-right: 40px;
    font-size: 16px;
    font-family: Source Han Sans SC;
    font-weight: 500;
    color: #1E2226;
  }

  .header_left {
    display: flex;
    flex-wrap: wrap;
    flex: 4;

    .header_left_top {
      display: flex;
      width: 100%;
      padding-bottom: 12px;
      border-bottom: 1px solid #F1F2F5;
    }

    .header_left_bottom {
      display: flex;
      align-items: center;

      .split_line {
        width: 0px;
        height: 90px;
        margin: 0 15px;
        border: 1px solid #C8C9CC;
      }

      .list_item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        /* height: 130px;
        width: 25%;
        min-width: 200px; */
        padding: 20px 0;

        .text {
          margin-right: 30px;
          font-size: 16px;
          font-family: Source Han Sans SC;
          font-weight: 500;
          color: #1E2226;
        }

        .number {
          font-size: 30px;
          font-family: DIN;
          font-weight: 400;
          color: #36B374;
        }

        .list_item_operate {
          margin-right: 10px;
          cursor: pointer;
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #4197EF;
        }
      }
    }
  }

  .header_right {
    display: flex;
    flex-wrap: wrap;
    flex: 1;

    .header_right_bottom {
      .info_item {
        margin-bottom: 10px;
      }

      .count {
        font-size: 20px;
        font-family: DIN;
        font-weight: 400;
        color: #36B374;
      }
    }
  }
}

.info_details {
  padding: 20px;

  .buttom_box {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.layout-main-search {
  border-bottom: unset;
}
</style>