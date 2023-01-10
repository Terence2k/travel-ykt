<template>
  <div class="container" id="printBox">
    <div class="page-title">
      行程详情预览和打印
    </div>
    <div class="status-btns">
      <div class="status">
        当前状态：{{state.basicData.statusName}}
      </div>
      <div class="btns">
        
        <button ref="printBtn" v-print="print" style="opacity: 0;"></button>	
        <a-button type="primary" @click="getPrint">打印行程单</a-button>
      </div>
    </div>
    <a-row>
      <a-col :span="17">
        <a-descriptions :title="`行程单ID：${state.basicData.itineraryNo}`" bordered>
          <a-descriptions-item label="线路名称" :span="3">{{state.basicData.routeName}}</a-descriptions-item>
          <a-descriptions-item label="组团模式" :span="2">{{state.basicData.groupTypeName}}</a-descriptions-item>
          <a-descriptions-item label="团队类型">{{state.basicData.teamTypeName}}</a-descriptions-item>
          <a-descriptions-item label="组团社" :span="2">{{state.basicData.travelName}}</a-descriptions-item>
          <a-descriptions-item label="组团社计调" >{{state.basicData.travelOperatorName}} {{state.basicData.travelOperatorPhone}}</a-descriptions-item>
          <a-descriptions-item label="地接社" :span="2">{{state.basicData.subTravelName}}</a-descriptions-item>
          <a-descriptions-item label="地接社计调">{{state.basicData.subTravelOperatorName}} {{state.basicData.subTravelOperatorPhone}}</a-descriptions-item>
          <a-descriptions-item label="游客人数" :span="2">{{state.basicData.touristCount}}</a-descriptions-item>
          <a-descriptions-item label="古维费应缴人数">{{state.basicData.guWeiCount}}</a-descriptions-item>
          <a-descriptions-item label="行程时间" :span="2">{{state.basicData.startDate}} - {{ state.basicData.endDate }}</a-descriptions-item>
          <a-descriptions-item label="综费应缴人数">{{state.basicData.productPeopleCount }}</a-descriptions-item>
          <a-descriptions-item label="已添加景区" :span="2">{{state.basicData.ticketCount}}</a-descriptions-item>
          <a-descriptions-item label="已添加酒店">{{state.basicData.hotelCount}}</a-descriptions-item>
          <a-descriptions-item label="已添加餐饮" :span="2">{{state.basicData.cateringCount}}</a-descriptions-item>
          <a-descriptions-item label="预估应缴费（元）">{{accDiv(state.basicData.totalFee, 100)}}</a-descriptions-item>
        </a-descriptions>
      </a-col>
      <a-col :span="7">
        <a-descriptions title="&nbsp;" bordered layout="vertical">
          <a-descriptions-item label="行程单二维码" :labelStyle="labelStyle" :contentStyle="contentStyle">
            <!-- 1-草稿 2-待协作 3-待管理部门审核(发团) 4-待管理部门审核(变更) 5-待财务审核(发团) 6-待财务审核(变更) 20-待财务审核（撤销重提） -->
            <template v-if="[1, 2, 3, 4, 5, 6, 7, 20].includes(state.basicData.status)">
              接团后生成
            </template>
            <template v-else>
              <qrcode-vue :value="codeUrl" :size="200" level="H" />
            </template>
          </a-descriptions-item>
        </a-descriptions>
      </a-col>
    </a-row>
    <div v-for="item in getOptions(state.itineraryDetail)">
      <div class="page-title" style="margin-top: 32px;">
        {{item.title}}<span class="descriptions" v-html="item.descriptions"></span>
      </div>
      <CommonTable :columns="item.columns" :dataSource="item.dataSource" :scrollY="false">
        <template #bodyCell="{ column, text, index, record }">
            <template v-if="column.key === 'index'">
              <div>
                {{(state.param.pageNo - 1) * (state.param.pageSize) + (index + 1)}}
              </div>
            </template>
            <!-- 时段 -->
            <template v-if="column.key === 'time'">
              <div>
                {{record.startDate}} - {{record.endDate}}
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
            <!-- 费用（元） -->
            <template v-if="column.key === 'orderFee'">
              <div>
                {{ accDiv(record.totalFee, 100) || '' }}
              </div>
            </template>
            <!-- 应缴总金额 -->
            <template v-if="column.key === 'payablePrice'">
              <div>
                {{ accDiv(record.payablePrice, 100) || '' }}
              </div>
            </template>
            <!-- 入住天数 -->
            <template v-if="column.key === 'stayDays'">
              {{ getDiffDay(record.startDate, record.endDate) }}
            </template>
            <!-- 是否按天收取 -->
            <template v-if="column.key === 'isDaily'">
              {{ record.isDaily ? '是' : '否' }}
            </template>
            <template v-if="column.key === 'action'">
              <div class="action-btns">
                <a @click="toOrderDetail(record, item.title)">查看订单</a>
              </div>
            </template>
            <template v-if="column.key === 'attachmentUrl'">
              <a-image v-for="item in record.attachmentUrl" width="200px" :src="item"/>
            </template>
        </template>
      </CommonTable>
      <CommonPagination
        :current="state.param.pageNo"
        :page-size="state.param.pageSize"
        :total="item.total"
			  @change="onHandleCurrentChange"
        v-if="item.pagination"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, Ref, CSSProperties } from 'vue';
  import api from '@/api';
  import CommonTable from '@/components/common/CommonTable.vue';
  import CommonPagination from '@/components/common/CommonPagination.vue';
  import { getOptions } from './travelDetail/travelDetail';
  import { accDiv } from '@/utils/compute';
  import { getStyles, getDiffDay } from '@/utils/util';
  import QrcodeVue from 'qrcode.vue'
  import { awsGetPreSignedUrl } from '@/utils/awsUpload';

  const codeUrl = ref();

  const state = reactive({
		basicData: {
      travelOperator: {},
      subTravelOperator: {}
    } as any,
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
    getItineraryDetail(route.currentRoute.value.query.oid, true);
  }

  const print = ref({
    id: 'printBox',//这里的id就是上面我们的打印区域id
    popTitle: '', // 打印配置页上方的标题
    extraHead: '', // 最上方的头部文字，附加在head标签上的额外标签，使用逗号分割
    preview: false, // 是否启动预览模式，默认是false
    previewTitle: '预览的标题', // 打印预览的标题
    previewPrintBtnLabel: '预览结束，开始打印', // 打印预览的标题下方的按钮文本，点击可进入打印
    zIndex: 20002, // 预览窗口的z-index，默认是20002，最好比默认值更高
    previewBeforeOpenCallback() {}, // 预览窗口打开之前的callback
    previewOpenCallback() {}, // 预览窗口打开时的callback
    beforeOpenCallback() {}, // 开始打印之前的callback
    openCallback() {}, // 调用打印时的callback
    closeCallback() {
      state.param.pageNo = 1;
      state.param.pageSize = 10;
      getItineraryDetail(route.currentRoute.value.query.oid);
    }, // 关闭打印的callback(无法区分确认or取消)
    clickMounted() {},

  })
  const route = useRouter();
  // 行程单二维码标签样式
  const labelStyle = computed((): CSSProperties => {
    return {
      display: 'flex',
      justifyContent: 'center'
    };
  });
  // 行程单二维码内容样式
  const contentStyle = computed((): any => {
      return {
        display: 'flex',
        justifyContent: 'center',
        color: '#9DA0A4',
      };
  });

	const onHandleCurrentChange = (e: any) => {
    state.param.pageNo = e;
    getItineraryDetail(route.currentRoute.value.query.oid);
	}

  const getItineraryDetail = (orderId: any, isPrint?: any) => {
    let queryData = {
      oid: orderId,
      ...state.param
    }
	  api.travelManagement.getItineraryDetail(queryData).then(async (res: any) => {
      state.basicData = res.basic;
      state.itineraryDetail = res;
      state.itineraryDetail.attachmentList.forEach(async(item: any) => {
        let result = item.attachmentUrl.split(',').map(async(item: any) => {
          if (item) item = await awsGetPreSignedUrl(item);
          return item;
        });
        item.attachmentUrl = await Promise.all(result);
      })
      codeUrl.value = JSON.stringify({
        itineraryNo: state.basicData.itineraryNo,
        oid: state.basicData.oid
      })
      nextTick(() => {
        if (isPrint) {
          printBtn.value.click();
        }
      })
      state.itineraryDetail.guWeiDetail = await api.getManagementExpenses(orderId);
		})
		.catch((err: any) => {
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

  // 跳转古维订单
  const toGuweiOrder = (value: any) => {
    route.push({ path: '/gouvyManagement/order/order_edit', query: { oid: value } });
  };

  // 跳转酒店订单
  const toHotelOrder = (value: any) => {
    route.push({ path: '/hotelManagement/hotelOrder/orderEdit', query: { orderNo: value } });
  };

  // 跳转景区订单
  const toScenicDetail = (value: any) => {
    route.push({ path: '/scenic-spot/order-manage/edit', query: { oid: value } });
  };

  getItineraryDetail(route.currentRoute.value.query.oid);
  onMounted(() => {
    document.getElementsByClassName('ant-descriptions-view')[1].style.height = `${getStyles(document.getElementsByClassName('ant-descriptions-view')[0], 'height')}px`;
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