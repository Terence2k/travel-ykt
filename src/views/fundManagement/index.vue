<template>
  <div class="header">
    <div class="header_left">
      <div class="header_left_top">
        <div class="info_item">已绑定的收款账户：{{ fundInfo.bankAccountName }}</div>
        <div class="info_item">开户行：{{ fundInfo.bank }}</div>
        <div class="info_item">银行账号： {{ fundInfo.bankAccount }}</div>
      </div>
      <div class="header_left_bottom">
        <div class="list_item">
          <div class="text">当前可用余额</div>
          <div>
            <div class="number">{{ fundInfo.availableBalance }}</div>
            <div v-if="fundInfo.yktAccountNumber">
              <span class="list_item_operate" @click="goTo" v-permission="'去充值'">去充值</span>
              <span class="list_item_operate" v-permission="'申请退款'">申请退款</span>
            </div>
            <div v-else>
              开通一卡通资金子账户后可充值
            </div>
          </div>
        </div>
        <div class="split_line"></div>
        <div class="list_item">
          <div class="text">当前预冻结金额</div>
          <div>
            <div class="number">{{ fundInfo.accountFrozen }}</div>
            <div>
              <span class="list_item_operate" v-permission="'查看详情'">查看详情</span>
            </div>
          </div>
        </div>
        <div class="split_line"></div>
        <div class="list_item">
          <div class="text">已充值金额</div>
          <div>
            <div class="number">{{ fundInfo.rechargedMoney }}</div>
            <div>
              <span class="list_item_operate">
                <a-select v-model:value="form.rechargeTime" style="width: 95px" @change="getBaseInfo">
                  <a-select-option v-for="item in tiemOptions" :value="item.value" :key="item.value">{{
                    item.key
                  }}
                  </a-select-option>
                </a-select>
              </span>
            </div>
          </div>
        </div>
        <div class="split_line"></div>
        <div class="list_item">
          <div class="text">已支出金额</div>
          <div>
            <div class="number">{{ fundInfo.expenditureMoney }}</div>
            <div>
              <span class="list_item_operate">
                <a-select v-model:value="form.expenditureTime" style="width: 95px" @change="getBaseInfo">
                  <a-select-option v-for="item in tiemOptions" :value="item.value" :key="item.value">{{
                    item.key
                  }}
                  </a-select-option>
                </a-select>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="header_right">
      <div class="header_right_top info_item">一卡通账户名称：{{ fundInfo.yktAccountName }}</div>
      <div class="header_right_bottom">
        <div class="info_item">一卡通资金子账号：<span v-show="!fundInfo.yktAccountNumber">当前未开通</span></div>
        <div class="count" v-show="fundInfo.yktAccountNumber">{{ fundInfo.yktAccountNumber }}</div>
        <a-button type="primary" v-show="!fundInfo.yktAccountNumber">
          申请开通
        </a-button>
      </div>
    </div>
  </div>
  <div class="info_details">
    <a-tabs v-model:activeKey="activeKey" @change="tabsChange">
      <a-tab-pane key="1" tab="充值记录查询" v-if="getTabPermission('充值记录查询')">
        <CommonSearch>
          <search-item label="充值时间">
            <!-- <a-date-picker v-model:value="tableData1.param.createTime" :format="dateFormat" :valueFormat="dateFormat"
              placeholder="请选择充值时间" /> -->
            <picker v-model="tableData1.param.createTime" type="date" :value-format="dateFormat" placeholder="请选择充值时间">
            </picker>
          </search-item>
          <search-item label="充值流水号">
            <a-input v-model:value="tableData1.param.serialNumber" placeholder="请输入订单号" allowClear />
          </search-item>
          <search-item label="充值金额">
            <a-input v-model:value="startAmount1" allowClear style="width:150px" @change="() => { inputChange(1) }" />
            <span style="margin:0 20px">-</span>
            <a-input v-model:value="endAmount1" allowClear style="width:150px" @change="() => { inputChange(2) }" />
            <span style="margin-left: 20px">元</span>
          </search-item>
          <template #button>
            <a-button @click="onQuery" v-permission="'充值记录查询_查询'">查询</a-button>
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
      <a-tab-pane key="2" tab="资金支出记录" v-if="getTabPermission('资金支出记录')">
        <CommonSearch>
          <search-item label="支出时间">
            <!-- <a-date-picker v-model:value="tableData2.param.createTime" :format="dateFormat" :valueFormat="dateFormat"
              placeholder="请选择支出时间" /> -->
            <picker v-model="tableData2.param.createTime" type="date" :value-format="dateFormat" placeholder="请选择支出时间">
            </picker>
          </search-item>
          <search-item label="支出流水号">
            <a-input v-model:value="tableData2.param.serialNumber" placeholder="请输入订单号" allowClear />
          </search-item>
          <search-item label="支出金额">
            <a-input v-model:value="startAmount2" allowClear style="width:150px" @change="() => { inputChange(3) }" />
            <span style="margin:0 20px">-</span>
            <a-input v-model:value="endAmount2" allowClear style="width:150px" @change="() => { inputChange(4) }" />
            <span style="margin-left: 20px">元</span>
          </search-item>
          <template #button>
            <a-button @click="onQuery" v-permission="'资金支出记录_查询'">查询</a-button>
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
      <a-tab-pane key="3" tab="预冻结资金" v-if="getTabPermission('预冻结资金')">
        <CommonSearch>
          <search-item label="预冻结时间">
            <!-- <a-date-picker v-model:value="tableData3.param.createTime" :format="dateFormat" :valueFormat="dateFormat"
              placeholder="请选择预冻结时间" /> -->
            <picker v-model="tableData3.param.createTime" type="date" :value-format="dateFormat" placeholder="请选择预冻结时间">
            </picker>
          </search-item>
          <search-item label="预冻结流水号">
            <a-input v-model:value="tableData3.param.serialNumber" placeholder="请输入订单号" allowClear />
          </search-item>
          <search-item label="预冻结金额">
            <a-input v-model:value="startAmount3" allowClear style="width:150px" @change="() => { inputChange(5) }" />
            <span style="margin:0 20px">-</span>
            <a-input v-model:value="endAmount3" allowClear style="width:150px" @change="() => { inputChange(6) }" />
            <span style="margin-left: 20px">元</span>
          </search-item>
          <template #button>
            <a-button @click="onQuery" v-permission="'预冻结资金_查询'">查询</a-button>
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
import { getTabPermission } from '@/utils/util';
import picker from '@/components/common/datePicker.vue'
import { accDiv, accMul } from '@/utils/compute';
const accDivValue = (value: any) => {
  if (typeof value === 'number') {
    return accDiv(value, 100)
  } else {
    return undefined
  }
}
const accMulValue = (value: any) => {
  if (typeof value === 'number') {
    return accMul(value, 100)
  } else {
    return null
  }
}
const router = useRouter();
const activeKey = ref('1');
const dateFormat = 'YYYY-MM-DD';
const startAmount1 = ref()
const startAmount2 = ref()
const startAmount3 = ref()
const endAmount1 = ref()
const endAmount2 = ref()
const endAmount3 = ref()
const form = reactive({
  rechargeTime: 1,
  expenditureTime: 1,
  companyId: ''
})
const fundInfo = reactive({
  bank: '',
  bankAccountName: '',
  bankAccount: '',
  availableBalance: 0,
  accountFrozen: 0,
  rechargedMoney: 0,
  expenditureMoney: 0,
  yktAccountName: '',
  yktAccountNumber: ''
})
const tiemOptions = [
  { key: '本月', value: 1 },
  { key: '近3个月', value: 2 },
  { key: '今年', value: 3 },
  { key: '去年', value: 4 }
]
const state = reactive({
  tableData1: {
    data: [],
    total: 0,
    loading: false,
    param: {
      pageNo: 1,
      pageSize: 10,
      runningAmountType: 1,
      createTime: '',
      serialNumber: '',
      startAmount: undefined,
      endAmount: undefined,
      companyId: undefined
    },
  },
  tableData2: {
    data: [],
    total: 0,
    loading: false,
    param: {
      pageNo: 1,
      pageSize: 10,
      runningAmountType: 3,
      createTime: '',
      serialNumber: '',
      startAmount: undefined,
      endAmount: undefined,
      companyId: undefined
    },
  },
  tableData3: {
    data: [],
    total: 0,
    loading: false,
    param: {
      pageNo: 1,
      pageSize: 10,
      runningAmountType: 2,
      createTime: '',
      serialNumber: '',
      startAmount: undefined,
      endAmount: undefined,
      companyId: undefined
    },
  }
});
const { tableData1, tableData2, tableData3 } = toRefs(state)
const columns1 = [
  {
    title: '充值流水号',
    dataIndex: 'serialNumber',
    key: 'serialNumber',
  },
  {
    title: '充值金额',
    dataIndex: 'runningAmount',
    key: 'runningAmount',
  },
  {
    title: '充值时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '充值前余额',
    dataIndex: 'amountBeforeRunning',
    key: 'amountBeforeRunning',
  },
  {
    title: '充值后余额',
    dataIndex: 'amountAfterRunning',
    key: 'amountAfterRunning',
  },
  {
    title: '充值资金来源（银行账户）',
    dataIndex: 'fundAccount',
    key: 'fundAccount',
  },
  {
    title: '操作员',
    dataIndex: 'userName',
    key: 'userName',
  }
]
const columns2 = [
  {
    title: '支出流水号',
    dataIndex: 'serialNumber',
    key: 'serialNumber',
  },
  {
    title: '支出金额',
    dataIndex: 'runningAmount',
    key: 'runningAmount',
  },
  {
    title: '支出时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '支出前余额',
    dataIndex: 'amountBeforeRunning',
    key: 'amountBeforeRunning',
  },
  {
    title: '支出后余额',
    dataIndex: 'amountAfterRunning',
    key: 'amountAfterRunning',
  },
  {
    title: '支出资金来源（银行账户）',
    dataIndex: 'fundAccount',
    key: 'fundAccount',
  },
  {
    title: '操作员',
    dataIndex: 'userName',
    key: 'userName',
  }
]
const columns3 = [
  {
    title: '预冻结流水号',
    dataIndex: 'serialNumber',
    key: 'serialNumber',
  },
  {
    title: '预冻结金额',
    dataIndex: 'runningAmount',
    key: 'runningAmount',
  },
  {
    title: '预冻结时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '预冻结前余额',
    dataIndex: 'amountBeforeRunning',
    key: 'amountBeforeRunning',
  },
  {
    title: '预冻结后余额',
    dataIndex: 'amountAfterRunning',
    key: 'amountAfterRunning',
  },
  {
    title: '预冻结资金来源（银行账户）',
    dataIndex: 'fundAccount',
    key: 'fundAccount',
  },
  {
    title: '操作员',
    dataIndex: 'userName',
    key: 'userName',
  }
]
let timer: NodeJS.Timeout
const inputChange = (type: number) => {
  timer && clearTimeout(timer)
  switch (type) {
    case 1:
      timer = setTimeout(() => {
        if (!startAmount1.value) {
          state.tableData1.param.startAmount = undefined
        } else {
          let val = Number(startAmount1.value)
          if (!isNaN(val)) {
            state.tableData1.param.startAmount = accMulValue(val)
          } else {
            message.warning('请输入正确金额！')
          }
        }
      }, 500);
      break;
    case 2:
      timer = setTimeout(() => {
        if (!endAmount1.value) {
          state.tableData1.param.endAmount = undefined
        } else {
          let val = Number(endAmount1.value)
          if (!isNaN(val)) {
            state.tableData1.param.endAmount = accMulValue(val)
          } else {
            message.warning('请输入正确金额！')
          }
        }
      }, 500);
      break;
    case 3:
      timer = setTimeout(() => {
        if (!startAmount2.value) {
          state.tableData2.param.startAmount = undefined
        } else {
          let val = Number(startAmount2.value)
          if (!isNaN(val)) {
            state.tableData2.param.startAmount = accMulValue(val)
          } else {
            message.warning('请输入正确金额！')
          }
        }
      }, 500);
      break;
    case 4:
      timer = setTimeout(() => {
        if (!endAmount2.value) {
          state.tableData2.param.endAmount = undefined
        } else {
          let val = Number(endAmount2.value)
          if (!isNaN(val)) {
            state.tableData2.param.endAmount = accMulValue(val)
          } else {
            message.warning('请输入正确金额！')
          }
        }
      }, 500);
      break;
    case 5:
      timer = setTimeout(() => {
        if (!startAmount3.value) {
          state.tableData3.param.startAmount = undefined
        } else {
          let val = Number(startAmount3.value)
          if (!isNaN(val)) {
            state.tableData3.param.startAmount = accMulValue(val)
          } else {
            message.warning('请输入正确金额！')
          }
        }
      }, 500);
      break;
    case 6:
      timer = setTimeout(() => {
        if (!endAmount3.value) {
          state.tableData3.param.endAmount = undefined
        } else {
          let val = Number(endAmount3.value)
          if (!isNaN(val)) {
            state.tableData3.param.endAmount = accMulValue(val)
          } else {
            message.warning('请输入正确金额！')
          }
        }
      }, 500);
      break;
  }
}
const tabsChange = (val: string) => {
  switch (val) {
    case '1':
      if (state.tableData1.data.length === 0) {
        onSearch()
      }
      break;
    case '2':
      if (state.tableData2.data.length === 0) {
        onSearch()
      }
      break;
    case '3':
      if (state.tableData3.data.length === 0) {
        onSearch()
      }
      break;
  }
}
const onQuery = () => {
  if (activeKey.value === '1') {
    state.tableData1.param.pageNo = 1
    onSearch()
  } else if (activeKey.value === '2') {
    state.tableData2.param.pageNo = 1
    onSearch()
  } else if (activeKey.value === '3') {
    state.tableData3.param.pageNo = 1
    onSearch()
  }
}
const onSearch = async () => {
  if (activeKey.value === '1') {
    let res = await api.findCapitalDetailedList(state.tableData1.param)
    if (res?.content) {
      res.content.forEach((item: any) => {
        item.runningAmount = accDivValue(item.runningAmount)
        item.amountBeforeRunning = accDivValue(item.amountBeforeRunning)
        item.amountAfterRunning = accDivValue(item.amountAfterRunning)
      })
      state.tableData1.data = res.content
      state.tableData1.total = res.total
    } else {
      state.tableData1.data = []
      state.tableData1.total = 0
    }
  } else if (activeKey.value === '2') {
    let res = await api.findCapitalDetailedList(state.tableData2.param)
    if (res?.content) {
      res.content.forEach((item: any) => {
        item.runningAmount = accDivValue(item.runningAmount)
        item.amountBeforeRunning = accDivValue(item.amountBeforeRunning)
        item.amountAfterRunning = accDivValue(item.amountAfterRunning)
      })
      state.tableData2.data = res.content
      state.tableData2.total = res.total
    } else {
      state.tableData2.data = []
      state.tableData2.total = 0
    }
  } else if (activeKey.value === '3') {
    let res = await api.findCapitalDetailedList(state.tableData3.param)
    if (res?.content) {
      res.content.forEach((item: any) => {
        item.runningAmount = accDivValue(item.runningAmount)
        item.amountBeforeRunning = accDivValue(item.amountBeforeRunning)
        item.amountAfterRunning = accDivValue(item.amountAfterRunning)
      })
      state.tableData3.data = res.content
      state.tableData3.total = res.total
    } else {
      state.tableData3.data = []
      state.tableData3.total = 0
    }
  }
}
const goTo = () => {
  router.push({
    name: 'recharge',
  })
}
const onHandleCurrentChange = (val: number) => {
  state.tableData1.param.pageNo = val;
  onSearch();
}

const pageSideChange = (current: number, size: number) => {
  state.tableData1.param.pageSize = size;
  onSearch();
}
const getUserInfo = () => {
  let userInfo = window.localStorage.getItem('userInfo')!;
  const userInfoObj = JSON.parse(userInfo)
  const { sysCompany: { oid } } = userInfoObj
  form.companyId = oid
  state.tableData1.param.companyId = oid
  state.tableData2.param.companyId = oid
  state.tableData3.param.companyId = oid
}
const getBaseInfo = async () => {
  let {
    bank,
    bankAccountName,
    bankAccount,
    availableBalance,
    accountFrozen,
    rechargedMoney,
    expenditureMoney,
    yktAccountName,
    yktAccountNumber
  } = await api.findTravelFund(toRaw(form))
  fundInfo.bank = bank;
  fundInfo.bankAccountName = bankAccountName;
  fundInfo.bankAccount = bankAccount;
  fundInfo.availableBalance = accDivValue(availableBalance);
  fundInfo.accountFrozen = accDivValue(accountFrozen);
  fundInfo.rechargedMoney = accDivValue(rechargedMoney);
  fundInfo.expenditureMoney = accDivValue(expenditureMoney);
  fundInfo.yktAccountName = yktAccountName;
  fundInfo.yktAccountNumber = yktAccountNumber;
}
const expenditureTimeChange = () => { }
onMounted(() => {
  getUserInfo()
  getBaseInfo()
  onSearch()
})
</script>

<style scoped lang="scss">
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  appearance: none;
}

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