<template>
  <CommonSearch>
    <search-item label="旅行社名称">
      <a-select placeholder="请选择旅行社名称" v-model:value="tableData.param.businessType" allowClear>
        <a-select-option v-for="item in enableOption" :value="item.codeValue">{{ item.name }}
        </a-select-option>
      </a-select>
    </search-item>
    <search-item label="行程编号">
      <a-input v-model:value="tableData.param.name" placeholder="请输入行程单号" />
    </search-item>
    <template #button>
      <a-button @click="onQuery">查询</a-button>
    </template>
  </CommonSearch>
  <div class="tabs_box">
    <a-tabs v-model:activeKey="activeKey" @change="tabsChange">
      <a-tab-pane key="1" tab="全部">
        <CommonTable :dataSource="tableData.data" :columns="columns">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <div class="action-btns">
                <a @click="addOrUpdate({ row: record, handle: 'update' })">编辑</a>
                <a @click="">撤销</a>
                <a @click="">查看</a>
                <a @click="">审核资金</a>
              </div>
            </template>
          </template>
        </CommonTable>
        <CommonPagination v-model:current="tableData.param.pageNo" v-model:page-size="tableData.param.pageSize"
          :total="tableData.total" @change="onHandleCurrentChange" @showSizeChange="pageSideChange" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="待审核"></a-tab-pane>
      <a-tab-pane key="3" tab="未开始"></a-tab-pane>
      <a-tab-pane key="4" tab="进行中"></a-tab-pane>
      <a-tab-pane key="5" tab="已结束"></a-tab-pane>
      <a-tab-pane key="6" tab="已撤销"></a-tab-pane>
      <a-tab-pane key="7" tab="审核不通过"></a-tab-pane>
      <template #rightExtra>
        <a-button type="primary" @click="addOrUpdate({ handle: 'add' })" style="margin-right: 20px">新增拼团</a-button>
        <a-button type="primary" @click="" style="margin-right: 20px">导出</a-button>
        <a-button type="primary" @click="">打印行程单</a-button>
      </template>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue'
import CommonPagination from '@/components/common/CommonPagination.vue'
import CommonSearch from '@/components/common/CommonSearch.vue'
import SearchItem from '@/components/common/CommonSearchItem.vue'
import CommonModal from '@/views/baseInfoManage/dictionary/components/CommonModal.vue';
import api from '@/api';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute()
const goto = (name: string, val?: any) => {
  router.push({
    name // 'addTourists',
    // params: 
  })
}
const state = reactive({
  tableData: {
    data: [],
    total: 0,
    loading: false,
    param: {
      pageNo: 1,
      pageSize: 10,
      businessType: undefined,
      regionCode: undefined,
      auditStatus: undefined,
      name: undefined,
      provinceId: undefined,
      cityId: undefined,
      areaId: undefined
    },
  },
});
const form = reactive({})
const teamRef = ref()
const formRules = {}
const activeKey = ref('1')
const enableOption = [
  { codeValue: 1, name: '已启用' },
  { codeValue: 0, name: '已禁用' }
]
const { tableData } = toRefs(state)
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '行程单号',
    dataIndex: 'businessTypeName',
    key: 'businessTypeName',
  },
  {
    title: '自编团号',
    dataIndex: 'regionName',
    key: 'regionName',
  },
  {
    title: '线路名称',
    dataIndex: 'creditCode',
    key: 'creditCode',
  },
  {
    title: '旅行社名称',
    dataIndex: 'businessLicenseUrl',
    key: 'businessLicenseUrl',
  },
  {
    title: '行程人数',
    dataIndex: 'businessLicenseUrl',
    key: 'businessLicenseUrl',
  },
  {
    title: '行程费用',
    dataIndex: 'businessLicenseUrl',
    key: 'businessLicenseUrl',
  },
  {
    title: '导游名称',
    dataIndex: 'businessLicenseUrl',
    key: 'businessLicenseUrl',
  },
  {
    title: '行程时间',
    dataIndex: 'businessLicenseUrl',
    key: 'businessLicenseUrl',
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 208
  },
]
const onHandleCurrentChange = (val: number) => {
  state.tableData.param.pageNo = val;
  onSearch();
}

const pageSideChange = (current: number, size: number) => {
  state.tableData.param.pageSize = size;
  onSearch();
}
const onSearch = () => { }
const onQuery = () => {
  state.tableData.param.pageNo = 1;
  onSearch()
}

interface addInterface {
  row?: any
  handle: 'update' | 'add'
}
const addOrUpdate = ({ row, handle }: addInterface) => {
  if (handle === 'add') {
    goto('newGroup')
  } else if (handle === 'update') {
  }
}
const tabsChange = () => { }
</script>

<style scoped lang="scss">
.tabs_box {
  padding: 20px;
}

.table-area {
  padding: unset;
}
</style>