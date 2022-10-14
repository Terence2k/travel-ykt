<template>
  <div class="container" v-if="state.data.travelOid">
    <div class="page-title">
      行程详情预览和打印
    </div>
    <div class="status-btns">
      <div class="status">
        当前状态：{{state.params.statusName}}
      </div>
      <div class="btns">
        <a-button type="primary">打印行程单</a-button>
        <a-button>打印保单</a-button>
        <a-button>打印游客名单</a-button>
      </div>
    </div>
    <a-row>
      <a-col :span="17">
        <a-descriptions :title="`行程单ID：${state.params.itineraryNo}`" bordered>
          <a-descriptions-item label="线路名称" :span="3">{{state.data.routeName}}</a-descriptions-item>
          <a-descriptions-item label="组团模式" :span="2">{{state.data.groupTypeName}}</a-descriptions-item>
          <a-descriptions-item label="团队类型">{{state.data.teamTypeName}}</a-descriptions-item>
          <a-descriptions-item label="组团社" :span="2">{{state.data.travelName}}</a-descriptions-item>
          <a-descriptions-item label="组团社计调" >{{state.data.travelOperator.username}} {{state.data.travelOperator.mobile}}</a-descriptions-item>
          <a-descriptions-item label="地接社" :span="2">{{state.data.subTravelName}}</a-descriptions-item>
          <a-descriptions-item label="地接社计调">{{state.data.subTravelOperator.username}} {{state.data.subTravelOperator.mobile}}</a-descriptions-item>
          <a-descriptions-item label="游客人数" :span="2">{{state.data.touristCount}}</a-descriptions-item>
          <a-descriptions-item label="古维费应缴人数">{{state.data.guWeiCount}}</a-descriptions-item>
          <a-descriptions-item label="行程开始时间" :span="2">{{state.data.startDate}}</a-descriptions-item>
          <a-descriptions-item label="行程结束时间">{{state.data.endDate}}</a-descriptions-item>
          <a-descriptions-item label="已添加景区" :span="2">{{state.data.ticketCount}}</a-descriptions-item>
          <a-descriptions-item label="已添加餐饮">{{state.data.cateringCount}}</a-descriptions-item>
          <a-descriptions-item label="已添加酒店" :span="2">{{state.data.hotelCount}}</a-descriptions-item>
          <a-descriptions-item label="预估应缴费（元）">{{state.data.totalFee}}</a-descriptions-item>
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
        {{item.title}}<span class="descriptions" v-html="item.descriptions"></span>
      </div>
      <CommonTable :columns="item.columns" :dataSource="item.dataSource" :scrollY="false">
        <template #bodyCell="{ column, text, index, record }">
            <template v-if="column.key === 'index'">
                <div>
                    {{index + 1}}
                </div>
            </template>
            <template v-if="column.key === 'action'">
              <div class="action-btns">
                <a>退订</a>
              </div>
            </template>
        </template>
      </CommonTable>
      <CommonPagination
        :current="state.param.pageNo"
        :page-size="state.param.pageSize"
        :total="item.dataSource.length"
        v-if="item.pagination"
      />
    </div>

    <div class="page-title">
      变更历史记录
    </div>
    <!-- <a-steps direction="vertical" size="small" :current="3">
      <a-step title="Finished" description="This is a description." />
      <a-step title="In Progress" description="This is a description." />
      <a-step title="Waiting" description="This is a description." />
    </a-steps> -->
  </div>
</template>
<script lang="ts" setup>
  import { ref, Ref, CSSProperties } from 'vue';
  import api from '@/api';
  import CommonTable from '@/components/common/CommonTable.vue';
  import CommonPagination from '@/components/common/CommonPagination.vue';
  import { getOptions } from './travelDetail/travelDetail';
  const state = reactive({
		data: {
      travelOperator: {},
      subTravelOperator: {}
    } as any,
    param: {
      pageNo: 1,
      pageSize: 10,
    },
    params: {} as any,
    itineraryDetail: {}
  });
  // 行程单二维码标签样式
  const labelStyle = computed((): CSSProperties => {
    return {
      display: 'flex',
      justifyContent: 'center'
    };
  });
  // 行程单二维码内容样式
  const contentStyle = computed((): CSSProperties => {
    return {
      lineHeight: '352px',
      display: 'flex',
      justifyContent: 'center',
      color: '#9DA0A4',
    };
  });

  const getItineraryDetail = () => {
    let queryData = {
      oid: state.params.oid,
      ...state.param
    }
	  api.travelManagement.getItineraryDetail(queryData).then((res: any) => {
      state.data = res.basic;
      state.itineraryDetail = res;
		})
		.catch((err: any) => {
			console.log(err);
		});
  }

  onMounted(() => {
    const tempData = localStorage.getItem('tempData');
    if (tempData) {
      state.params = JSON.parse(tempData);
    } else {
      let { detailInfo } = useRoute().params as any;
      state.params = JSON.parse(decodeURIComponent(detailInfo));
    }
    getItineraryDetail();
    
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
}
</style>