<template>
  <CommonSearch>
    <search-item label="委派状态">
      <a-select placeholder="请选择委派状态" v-model:value="tableData.param.businessType" allowClear>
        <a-select-option v-for="item in tourGuideTypeOption" :value="item.codeValue">{{ item.name }}
        </a-select-option>
      </a-select>
    </search-item>
    <search-item label="导游姓名">
      <a-input v-model:value="tableData.param.name" placeholder="请输入导游姓名" />
    </search-item>
    <search-item label="导游电话">
      <a-input v-model:value="tableData.param.name" placeholder="请输入导游电话" />
    </search-item>
    <search-item label="导游证号">
      <a-input v-model:value="tableData.param.name" placeholder="请输入导游证号" />
    </search-item>
    <template #button>
      <a-button @click="onSearch">查询</a-button>
    </template>
  </CommonSearch>
  <CommonTable :dataSource="tableData.data" :columns="columns">
    <template #button>
      <a-button type="primary" style="margin-right:20px">导出</a-button>
      <a-button type="primary" @click="addTourGuide">委派新导游</a-button>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'businessLicenseUrl'">
        <a-image width="100%" :src="record.businessLicenseUrl" />
      </template>
      <template v-if="column.key === 'action'">
        <div class="action-btns">
          <a @click="viewProfile">查看资料</a>
          <a-popconfirm title="确认取消委派吗?" ok-text="确认" cancel-text="取消" @confirm="cancelDelegate(record.oid)">
            <a>取消委派</a>
          </a-popconfirm>
          <a-popconfirm title="确认撤回邀请吗?" ok-text="确认" cancel-text="取消" @confirm="cancelInvitation(record.oid)">
            <a>撤回邀请</a>
          </a-popconfirm>
        </div>
      </template>
    </template>
  </CommonTable>
  <CommonPagination v-model:current="tableData.param.pageNo" v-model:page-size="tableData.param.pageSize"
    :total="tableData.total" @change="onHandleCurrentChange" @showSizeChange="pageSideChange" />
  <CommonModal title="导游信息" v-model:visible="modalVisible" @cancel="cancel" @close="cancel" :is-conform="false"
    :cancel-text="'关闭'">
    <div class="guide_state">已委派</div>
    <div class="check_info">
      <div class="row_info">
        <div>
          导游名称：
        </div>
        <div>
          {{ form.name }}
        </div>
      </div>
      <div class="row_info">
        <div>
          导游证号：
        </div>
        <div>
          {{ form.businessTypeName }}
        </div>
      </div>
      <div class="row_info">
        <div>
          身份证号：
        </div>
        <div>
          {{ form.regionName }}
        </div>
      </div>
      <div class="row_info">
        <div>
          联系电话：
        </div>
        <div>
          {{ form.creditCode }}
        </div>
      </div>
      <div class="row_info">
        <div>
          导游星级：
        </div>
        <div>
          {{ form.contactName }}
        </div>
      </div>
      <div class="row_info">
        <div>
          导游等级：
        </div>
        <div>
          {{ form.phone }}
        </div>
      </div>
      <div class="row_info">
        <div>
          签约开始时间：
        </div>
        <div>
          {{ form.account }}
        </div>
      </div>
      <div class="row_info">
        <div>
          签约结束时间：
        </div>
        <div>
          {{ form.account }}
        </div>
      </div>
      <div class="row_info">
        <div>
          签约附件：
        </div>
        <div>
          {{ '无' }}
        </div>
      </div>
    </div>
  </CommonModal>
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
  modalVisible: false
});
const form = reactive({})
const tourGuideTypeOption = []
const { tableData, modalVisible } = toRefs(state)
const columns = [
  {
    title: '导游姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '导游电话',
    dataIndex: 'businessTypeName',
    key: 'businessTypeName',
  },
  {
    title: '导游证号',
    dataIndex: 'regionName',
    key: 'regionName',
  },
  {
    title: '身份证号',
    dataIndex: 'creditCode',
    key: 'creditCode',
  },
  {
    title: '委派状态',
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
const cancel = () => {
  state.modalVisible = false
}
const addTourGuide = () => {
  router.push({
    name: 'addTourGuide'
  })
}
const viewProfile = () => {
  state.modalVisible = true
}
const cancelDelegate = (id: string) => { }
const cancelInvitation = (id: string) => { }
</script>

<style scoped lang="scss">
.guide_state {
  width: 100%;
  text-align: right;
  font-size: 16px;
  font-family: Microsoft YaHei UI;
  font-weight: bold;
  color: #262626;
}

.check_info {

  .row_info {
    display: flex;
    margin-bottom: 20px;
    font-size: 14px;
    font-family: Microsoft YaHei UI;
    font-weight: 400;
    color: #1E2226;
  }
}
</style>