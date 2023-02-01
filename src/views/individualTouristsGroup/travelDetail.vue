<template>
  <div class="container" id="printBox">
    <div class="header">
      <div class="page-title">
        行程详情预览和打印
      </div>
      <span class="close_btn" @click="back">
        <close-outlined />
      </span>
    </div>
    <div class="status-btns">
      <div class="status">
        当前状态：{{ state.basicData.statusName }}
      </div>
      <div class="btns">

        <button ref="printBtn" v-print="print" style="opacity: 0;">点击打开打印预览</button>
        <a-button type="primary" @click="getPrint">打印行程单</a-button>
      </div>
    </div>
    <a-row>
      <a-col :span="17">
        <a-descriptions :title="`行程单ID：${state.basicData.itineraryNo}`" bordered>
          <a-descriptions-item label="线路名称" :span="3">{{ state.basicData.routeName }}</a-descriptions-item>
          <a-descriptions-item label="团队类型" :span="2">{{ state.basicData.teamTypeName }}</a-descriptions-item>
          <a-descriptions-item label="散客组团类型">{{ state.basicData.groupTypeName }}</a-descriptions-item>
          <a-descriptions-item label="行程时间" :span="2">{{
            state.basicData.startDate + ' - ' +
              state.basicData.endDate
          }}</a-descriptions-item>
          <a-descriptions-item label="导游">{{ state.guideList[0]?.guideName }}
            {{ state.guideList[0]?.guidePhone }}</a-descriptions-item>
          <a-descriptions-item label="散客拼团社" :span="2">{{ state.basicData.travelName }}</a-descriptions-item>
          <a-descriptions-item label="中心操作员">{{ state.basicData.travelOperatorName }}
            {{ state.basicData.travelOperatorPhone }}</a-descriptions-item>
          <a-descriptions-item label="电子合同数量" :span="2">{{ state.basicData.subTravelName }}</a-descriptions-item>
          <a-descriptions-item label="游客总人数">{{ state.basicData.touristCount }}</a-descriptions-item>
          <a-descriptions-item label="古维减免人数" :span="2">{{ state.basicData.guWeiReduceCount }}</a-descriptions-item>
          <a-descriptions-item label="行程冻结金额（元）">{{ accDiv(state.basicData.totalFee, 100) }}元</a-descriptions-item>
          <a-descriptions-item label="联系人" :span="2">{{ state.basicData.travelOperatorName }}</a-descriptions-item>
          <a-descriptions-item label="联系人电话">{{ state.basicData.travelOperatorPhone }}</a-descriptions-item>
          <a-descriptions-item label="用车车牌号" :span="2">{{
            state.transportList[0]?.licencePlateNumber
          }}</a-descriptions-item>
          <a-descriptions-item label="自编团号">{{ state.basicData.selfTeamNo }}</a-descriptions-item>
        </a-descriptions>
      </a-col>
      <a-col :span="7">
        <a-descriptions title="&nbsp;" bordered layout="vertical">
          <a-descriptions-item label="行程单二维码" :labelStyle="labelStyle" :contentStyle="contentStyle">
            <!-- 1-草稿，5-待财务审核 -->
            <template v-if="[1, 5].includes(state.basicData.status)">
              财务审核通过后自动生成
            </template>
            <template v-else-if="codeUrl">
              <qrcode-vue :value="codeUrl" :size="200" level="H" />
            </template>
          </a-descriptions-item>
        </a-descriptions>
      </a-col>
    </a-row>
    <div v-for="item in getOptions(state.itineraryDetail)">
      <div class="page-title" style="margin-top: 32px;">
        {{ item.title }}<span class="descriptions" v-html="item.descriptions"></span>
      </div>
      <CommonTable :columns="item.columns" :dataSource="item.dataSource" :scrollY="false">
        <template #bodyCell="{ column, text, index, record }">
          <template v-if="column.key === 'index'">
            <div>
              {{ (state.param.pageNo - 1) * (state.param.pageSize) + (index + 1) }}
            </div>
          </template>
          <!-- 时段 -->
          <template v-if="column.key === 'time'">
            <div>
              {{ record.startDate }} - {{ record.endDate }}
            </div>
          </template>
          <!-- 费用总计（元） -->
          <template v-if="column.key === 'orderFee'">
            <div>
              {{ accDiv(record.orderFee, 100) || '' }}
            </div>
          </template>
          <!-- 单价（元） -->
          <template v-if="column.key === 'unitPrice'">
            <div>
              {{ accDiv(record.unitPrice, 100) || '' }}
            </div>
          </template>
          <!-- 费用（元） -->
          <template v-if="column.key === 'totalFee'">
            <div>
              {{ accDiv(record.totalFee, 100) || '' }}
            </div>
          </template>
          <!-- 合同费用 -->
          <template v-if="column.key === 'contractAmount'">
            <div>
              {{ accDiv(record.contractAmount, 100) || '' }}
            </div>
          </template>
          <!-- 景区费用 -->
          <template v-if="column.key === 'ticketTotalFee'">
            <div>
              {{ cmpRowValue(record, 'ticketTotalFee') }}
            </div>
          </template>
          <!-- 证件类型 -->
          <template v-if="column.key === 'certificateType'">
            <div>
              {{ cmpRowValue(record.certificateType, 'certificateType') }}
            </div>
          </template>
          <!-- 健康码 -->
          <!-- <template v-if="column.key === 'healthyCode'">
            <span :class="cmpHealthyColor(text)">{{ text }}</span>
          </template> -->
          <!-- 是否按天收费 -->
          <template v-if="column.key === 'isDaily'">
            {{ cmpRowValue(record.isDaily, 'isDaily') }}
          </template>
          <!-- 入住天数 -->
          <template v-if="column.key === 'stayDays'">
            {{ getDiffDay(record.startDate, record.endDate) }}
          </template>
          <!-- 合同行程日期 -->
          <template v-if="column.key === 'tripDate'">
            {{ record.tripStartTime + ' - ' + record.tripEndTime }}
          </template>
          <!-- 应缴总金额 -->
          <template v-if="column.key === 'payablePrice'">
            <div>
              {{ accDiv(record.payablePrice, 100) || '' }}
            </div>
          </template>
          <template v-if="column.key === 'action'">
            <div class="action-btns">
              <a @click="toOrderDetail(record, item.title)">查看订单</a>
            </div>
          </template>
          <template v-if="column.key === 'action1'">
            <div class="action-btns">
              <a v-show="route.query.isAudit !== '1'" @click="toOrderDetail(record, item.title)">查看订单</a>
            </div>
          </template>
          <template v-if="column.key === 'action2'">
            <div class="action-btns">
              <a @click="contractDetail(record)">查看</a>
            </div>
          </template>
          <template v-if="column.key === 'attachmentUrl'">
            <a-image width="100%" :src="record.attachmentUrl" />
          </template>
        </template>
      </CommonTable>
      <CommonPagination :current="state.param.pageNo" :page-size="state.param.pageSize" :total="item.total"
        @change="onHandleCurrentChange" v-if="item.pagination" />
    </div>
    <CommonModal title="合同详情" v-model:visible="contractDetailsVisible" @close="contractDetailsClose"
      @cancel="contractDetailsClose" conform-text="确认" @conform="contractDetailsClose" :is-cancel="false" width="40%">
      <div class="contract_details">
        <div class="details_item">
          <div class="key">合同编号：</div>
          <div class="value"> {{ contractDetailsForm.contractNo }}</div>
        </div>
        <div class="details_item">
          <div class="key">合同类型：</div>
          <div class="value"> {{ contractDetailsForm.contractTypeName }}</div>
        </div>
        <div class="details_item">
          <div class="key">内含线路/委托项目：</div>
          <div class="value"> {{ contractDetailsForm.lineNames }}</div>
        </div>
        <div class="details_item">
          <div class="key">人数：</div>
          <div class="value"> {{ contractDetailsForm.touristPeopleNumber }}</div>
        </div>
        <div class="details_item">
          <div class="key">行程日期：</div>
          <div class="value"> {{ contractDetailsForm.tripStartTime + '-' + contractDetailsForm.tripEndTime }}</div>
        </div>
        <div class="details_item">
          <div class="key">合同签约旅行社：</div>
          <div class="value"> {{ contractDetailsForm.companyName }}</div>
        </div>
        <div class="details_item">
          <div class="key">签署网点：</div>
          <div class="value"> {{ contractDetailsForm.storeName }}</div>
        </div>
        <div class="details_item">
          <div class="key">合同费用（元）：</div>
          <div class="value"> {{ contractDetailsForm.contractAmount / 100 }}</div>
        </div>
      </div>
    </CommonModal>
  </div>
</template>
<script lang="ts" setup>
import { ref, Ref, CSSProperties } from 'vue';
import api from '@/api';
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import { getOptions } from '@/views/individualTouristsGroup/travelDetail/travelDetail';
import { accDiv } from '@/utils/compute';
import dayjs from 'dayjs';
import { CloseOutlined } from '@ant-design/icons-vue';
import { useRouter, useRoute } from 'vue-router';
import QrcodeVue from 'qrcode.vue'
import { getStyles, getDiffDay } from '@/utils/util';
import CommonModal from '@/views/baseInfoManage/dictionary/components/CommonModal.vue';

const router = useRouter();
const route = useRoute();
const codeUrl = ref();
const back = () => {
  router.push({
    name: 'individualTouristsGroup',
  })
}
const contractDetailsVisible = ref(false)
const contractDetailsForm = ref({})
const state = reactive({
  basicData: {
    travelOperator: {},
    subTravelOperator: {}
  } as any,
  guideList: [] as any,
  transportList: [] as any,
  param: {
    pageNo: 1,
    pageSize: 10,
  },
  itineraryDetail: {} as any
});
const printBtn = ref();

const getPrint = () => {
  state.param.pageNo = 1;
  state.param.pageSize = 999999;
  getItineraryDetail(router.currentRoute.value.query.oid, true);
}

const print = ref({
  id: 'printBox',//这里的id就是上面我们的打印区域id，实现指哪打哪
  popTitle: '', // 打印配置页上方的标题
  extraHead: '', // 最上方的头部文字，附加在head标签上的额外标签，使用逗号分割
  preview: false, // 是否启动预览模式，默认是false
  previewTitle: '预览的标题', // 打印预览的标题
  previewPrintBtnLabel: '预览结束，开始打印', // 打印预览的标题下方的按钮文本，点击可进入打印
  zIndex: 20002, // 预览窗口的z-index，默认是20002，最好比默认值更高
  previewBeforeOpenCallback() { }, // 预览窗口打开之前的callback
  previewOpenCallback() { }, // 预览窗口打开时的callback
  beforeOpenCallback() { }, // 开始打印之前的callback
  openCallback() { }, // 调用打印时的callback
  closeCallback() {
    state.param.pageNo = 1;
    state.param.pageSize = 10;
    getItineraryDetail(router.currentRoute.value.query.oid);
  }, // 关闭打印的callback(无法区分确认or取消)
  clickMounted() { },

})

// 行程单二维码标签样式
const labelStyle = computed((): CSSProperties => {
  return {
    display: 'flex',
    justifyContent: 'center'
  };
});
const cmpRowValue = computed(() => (val: any, type: string) => {
  let res
  switch (type) {
    case 'certificateType':
      switch (val) {
        case 'IDENTITY_CARD':
          res = '身份证'
          break
        case 'PASSPORT':
          res = '护照'
          break
        case 'COMPATRIOT_CARD':
          res = '港澳台同胞证'
          break
        default:
          res = '/'
      }
      break;
    case 'isDaily':
      if (val) {
        res = '是'
      } else {
        res = '否'
      }
      break;
    // case 'stayDays':
    //   res = dayjs(val.endDate).diff(val.startDate, 'day')
    //   break;
    case 'ticketTotalFee':
      const x = val.reservePeopleCount || 0
      const y = val.unitPrice || 0
      res = accDiv(x * y, 100) || 0
      val.ticketTotalFee = res
      break;
    default:
      break;
  }
  return res
})
// 行程单二维码内容样式
const contentStyle = computed((): CSSProperties => {
  return {
    display: 'flex',
    justifyContent: 'center',
    color: '#9DA0A4',
  };
});
const cmpHealthyColor = computed(() => (text: string) => {
  if (text === '绿码') {
    return 'green_text'
  } else if (text === '黄码') {
    return 'yellow_text'
  } else if (text === '红码') {
    return 'red_text'
  }
})
const onHandleCurrentChange = (e: any) => {
  state.param.pageNo = e;
  getItineraryDetail(router.currentRoute.value.query.oid);
}
/* // 批量获取健康码
const getHealthyCodes = async (ids: number[]) => {
  let res = await api.getHealthyCode(ids)
  if (res) {
    res.forEach((item: any) => {
      // 00:绿码，01：黄码，10：红码
      switch (item.healthCodeStatus) {
        case '00':
          item.codeName = '绿码'
          break;
        case '01':
          item.codeName = '黄码'
          break;
        case '10':
          item.codeName = '红码'
          break;
        default:
          item.codeName = '暂无健康码'
      }
    })
  }
  return res || []
} */
/* const configCodeName = (certificateCodes: any, targetArr: any) => {
  for (let i = 0, l = certificateCodes.length; i < l; i++) {
    const item = certificateCodes[i];
    for (let j = 0, l = targetArr.length; j < l; j++) {
      const citem = targetArr[j];
      if (item.certificateId === citem.certificateNo) {
        targetArr[j].healthyCode = item.codeName
      }
    }
  }
} */
const getItineraryDetail = (orderId: any, isPrint?: any) => {
  let queryData = {
    oid: orderId,
    ...state.param
  }
  api.travelManagement.getItineraryDetail(queryData).then(async (res: any) => {
    state.basicData = res.basic;
    state.guideList = res.guideList;
    state.transportList = res.transportList;
    /*  // 获取身份证列表
     const certificateIds = res.touristList?.content.map((item: any) => {
       return { certificateId: item.certificateNo }
     })
     // 根据身份证列表查询健康码列表
     const certificateCodes = await getHealthyCodes(certificateIds)
     // 将健康码和游客列表数据关联
     configCodeName(certificateCodes, res.touristList.content) */
    // 获取合同信息
    const content = await api.getContractListByItineraryId(route.query.oid)
    res.contractList = content ? content : []
    state.itineraryDetail = res;
    codeUrl.value = JSON.stringify({
      yktNo: state.basicData.yktNo
    })
    nextTick(() => {
      if (isPrint) {
        printBtn.value.click();
      }
    })
    if ([1, 5].includes(state.basicData.status)) {
      let res = await api.getBasicInfo();
      state.itineraryDetail.guWeiDetail = [{
        feeName: '古维管理费',
        touristNum: state.itineraryDetail.touristList.total,
        payableNum: state.itineraryDetail.touristList.total,
        payablePrice: state.itineraryDetail.touristList.total * res.price,
        isInitiateReductionName: '否',
        isReductionPassedName: '否',
        feeStatus: '预计应缴费用',
        issueStatusName: '未出票',
      }]
      state.basicData.guWeiCount = state.itineraryDetail.touristList.total;
    } else {
      state.itineraryDetail.guWeiDetail = await api.getManagementExpenses(orderId);
    }
    if (route.query.isAudit === '1') {
      state.itineraryDetail.isAudit = 'inline-block'
    } else {
      state.itineraryDetail.isAudit = 'none'
    }
  }).catch((err: any) => {
    console.log(err);
  });
}

const toOrderDetail = (row: any, title: any) => {
  switch (title) {
    case '古维管理费':
      toGuweiOrder(row.oid);
      break;
    case '酒店费用':
      toHotelOrder(row.hotelOrderNo);
      break;
    case '景区费用':
      toScenicDetail(row.ticketOrderNo);
      break;
  }
}
const contractDetail = (record: any) => {
  contractDetailsVisible.value = true
  contractDetailsForm.value = record
}
const contractDetailsClose = () => {
  contractDetailsVisible.value = false
  contractDetailsForm.value = {}
}
// 跳转古维订单
const toGuweiOrder = (value: any) => {
  router.push({ path: '/gouvyManagement/order/order_edit', query: { oid: value } });
};

// 跳转酒店订单
const toHotelOrder = (value: any) => {
  router.push({ path: '/hotelManagement/hotelOrder/orderEdit', query: { orderNo: value } });
};

// 跳转景区订单
const toScenicDetail = (value: any) => {
  router.push({ path: '/scenic-spot/order-manage/edit', query: { oid: value } });
};
onMounted(() => {
  document.getElementsByClassName('ant-descriptions-view')[1].style.height = `${getStyles(document.getElementsByClassName('ant-descriptions-view')[0], 'height')}px`;
})
watch(
  () => route,
  (newVal) => {
    if (newVal.name === "individualTouristsGroupDetail" && newVal.query.oid) {
      getItineraryDetail(router.currentRoute.value.query.oid);
    }
  },
  { immediate: true, deep: true })
</script>
<style lang="less" scoped>
.container {
  padding: 0 20px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .close_btn {
      cursor: pointer;
    }
  }

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

  .green_text {
    color: #71b621;
  }

  .yellow_text {
    color: #bfbe26;
  }

  .red_text {
    color: #d70095;
  }
}

.contract_details {
  padding: 24px;

  .details_item {
    display: flex;
    margin-bottom: 24px;

    .key {
      width: 200px;
    }
  }
}
</style>