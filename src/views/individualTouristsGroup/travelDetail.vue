<template>
  <div class="container" id="printBox">
    <div class="page-title">
      行程详情预览和打印
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
          <a-descriptions-item label="行程时间" :span="2">{{ state.basicData.startDate + ' - ' + state.basicData.endDate
}}</a-descriptions-item>
          <a-descriptions-item label="导游">{{ state.guideList[0]?.guideName }}
            {{ state.guideList[0]?.guidePhone }}</a-descriptions-item>
          <a-descriptions-item label="散客拼团社" :span="2">{{ state.basicData.travelName }}</a-descriptions-item>
          <a-descriptions-item label="中心操作员">{{ state.basicData.travelOperatorName }}
            {{ state.basicData.travelOperatorPhone }}</a-descriptions-item>
          <a-descriptions-item label="电子合同数量" :span="2">{{ state.basicData.subTravelName }}</a-descriptions-item>
          <a-descriptions-item label="游客总人数">{{ state.basicData.touristCount }}</a-descriptions-item>
          <a-descriptions-item label="古维减免人数" :span="2">{{ state.basicData.guWeiReduceCount }}</a-descriptions-item>
          <a-descriptions-item label="行程冻结金额（元）">{{ state.basicData.totalFee }}</a-descriptions-item>
          <a-descriptions-item label="联系人" :span="2">{{ state.basicData.travelOperatorName }}</a-descriptions-item>
          <a-descriptions-item label="联系人电话">{{ state.basicData.travelOperatorPhone }}</a-descriptions-item>
          <a-descriptions-item label="用车车牌号" :span="2">{{ state.transportList[0]?.licencePlateNumber
}}</a-descriptions-item>
          <a-descriptions-item label="自编团号">{{ state.basicData.selfTeamNo }}</a-descriptions-item>
        </a-descriptions>
      </a-col>
      <a-col :span="7">
        <a-descriptions title="&nbsp;" bordered layout="vertical">
          <a-descriptions-item label="行程单二维码" :labelStyle="labelStyle" :contentStyle="contentStyle">
            待提交后生成
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
          <template v-if="column.key === 'healthyCode'">
            <span :class="cmpHealthyColor(text)">{{ text }}</span>
          </template>
          <!-- 是否按天收费 -->
          <template v-if="column.key === 'isDaily'">
            {{ cmpRowValue(record.isDaily, 'isDaily') }}
          </template>
          <!-- 入住天数 -->
          <template v-if="column.key === 'stayDays'">
            {{ cmpRowValue(record, 'stayDays') }}
          </template>
          <!-- 合同行程日期 -->
          <template v-if="column.key === 'tripDate'">
            {{ record.tripStartTime + ' - ' + record.tripEndTime }}
          </template>
          <template v-if="column.key === 'action'">
            <div class="action-btns">
              <a>查看订单</a>
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
  itineraryDetail: {}
});
const printBtn = ref();

const getPrint = () => {
  state.param.pageNo = 1;
  state.param.pageSize = 999999;
  getItineraryDetail(route.currentRoute.value.query.oid, true);
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
    getItineraryDetail(route.currentRoute.value.query.oid);
  }, // 关闭打印的callback(无法区分确认or取消)
  clickMounted() { },

})
const route = useRouter();
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
    case 'stayDays':
      res = dayjs(val.endDate).diff(val.startDate, 'day')
      break;
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
    lineHeight: '352px',
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
  getItineraryDetail(route.currentRoute.value.query.oid);
}
// 批量获取健康码
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
}
const configCodeName = (certificateCodes: any, targetArr: any) => {
  for (let i = 0, l = certificateCodes.length; i < l; i++) {
    const item = certificateCodes[i];
    for (let j = 0, l = targetArr.length; j < l; j++) {
      const citem = targetArr[j];
      if (item.certificateId === citem.certificateNo) {
        targetArr[j].healthyCode = item.codeName
      }
    }
  }
}
const getItineraryDetail = (orderId: any, isPrint?: any) => {
  let queryData = {
    oid: orderId,
    ...state.param
  }
  api.travelManagement.getItineraryDetail(queryData).then(async (res: any) => {
    state.basicData = res.basic;
    state.guideList = res.guideList;
    state.transportList = res.transportList;
    // 获取身份证列表
    const certificateIds = res.touristList?.content.map((item: any) => {
      return { certificateId: item.certificateNo }
    })
    // 根据身份证列表查询健康码列表
    const certificateCodes = await getHealthyCodes(certificateIds)
    // 将健康码和游客列表数据关联
    configCodeName(certificateCodes, res.touristList.content)
    // 获取合同信息
    const { content } = await api.getContractList({
      pageNo: 1,
      pageSize: 10000,
    })
    res.contractList = content
    state.itineraryDetail = res;
    nextTick(() => {
      if (isPrint) {
        printBtn.value.click();
      }
    })
  })
    .catch((err: any) => {
      console.log(err);
    });
}
getItineraryDetail(route.currentRoute.value.query.oid);
</script>
<style lang="less" scoped>
.container {
  padding: 0 20px;

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
</style>