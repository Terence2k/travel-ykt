<template>
  <CommonSearch>
    <search-item label="启用状态">
      <a-select placeholder="请选择启用状态" v-model:value="tableData.param.businessType" allowClear>
        <a-select-option v-for="item in enableOption" :value="item.codeValue">{{ item.name }}
        </a-select-option>
      </a-select>
    </search-item>
    <search-item label="门店名称">
      <a-input v-model:value="tableData.param.name" placeholder="请输入门店名称" />
    </search-item>
    <search-item label="门店操作员">
      <a-input v-model:value="tableData.param.name" placeholder="请输入门店操作员" />
    </search-item>
    <template #button>
      <a-button @click="onQuery">查询</a-button>
    </template>
  </CommonSearch>
  <CommonTable :dataSource="tableData.data" :columns="columns">
    <template #button>
      <a-button type="primary" @click="addOrUpdate({ handle: 'add' })">创建新门店</a-button>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <div class="action-btns">
          <a @click="addOrUpdate({ row: record, handle: 'update' })">修改</a>
          <a @click="">禁用</a>
          <a @click="">启用</a>
        </div>
      </template>
    </template>
  </CommonTable>
  <div class="buttom_box">
    <div>共 <span style="color:#de0025;">{{ tableData.total }}</span> 个散客门店</div>
    <CommonPagination v-model:current="tableData.param.pageNo" v-model:page-size="tableData.param.pageSize"
      :total="tableData.total" @change="onHandleCurrentChange" @showSizeChange="pageSideChange" />
  </div>
  <CommonModal :title="state.title" v-model:visible="modalVisible" @cancel="cancel" @close="cancel"
    :conform-text="'提交审核'">
    <a-form ref="teamRef" :model="form" :rules="formRules" name="addStore" autocomplete="off" :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }">
      <a-form-item name="username" label="门店名称">
        <a-input v-model:value="form.username" placeholder="请输入门店名称">
        </a-input>
      </a-form-item>
      <a-form-item name="mobile" label="门店地址">
        <a-input v-model:value="form.mobile" placeholder="请输入门店地址">
        </a-input>
      </a-form-item>
      <a-form-item name="mobile" label="门店操作员">
        <a-input v-model:value="form.mobile" placeholder="请输入门店操作员姓名">
        </a-input>
      </a-form-item>
      <a-form-item name="mobile" label="门店电话">
        <a-input v-model:value="form.mobile" placeholder="请输入门店联系电话">
        </a-input>
      </a-form-item>
      <a-form-item name="mobile" label="操作员登录账号">
        <a-input v-model:value="form.mobile" placeholder="请设置一个操作员账号">
        </a-input>
      </a-form-item>
      <a-form-item name="mobile" label="操作员登录密码">
        <a-input v-model:value="form.mobile" placeholder="请设置操作员登录密码">
        </a-input>
      </a-form-item>
      <a-form-item name="isReduced" label="启用状态">
        <a-radio-group v-model:value="form.isReduced">
          <a-radio :value="1">启用</a-radio>
          <a-radio :value="0">禁用</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
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
  title: '创建散客门店',
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
const teamRef = ref()
const formRules = {}
const enableOption = [
  { codeValue: 1, name: '已启用' },
  { codeValue: 0, name: '已禁用' }
]
const { tableData, modalVisible } = toRefs(state)
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '门店名称',
    dataIndex: 'businessTypeName',
    key: 'businessTypeName',
  },
  {
    title: '门店地址',
    dataIndex: 'regionName',
    key: 'regionName',
  },
  {
    title: '门店操作员',
    dataIndex: 'creditCode',
    key: 'creditCode',
  },
  {
    title: '门店电话',
    dataIndex: 'businessLicenseUrl',
    key: 'businessLicenseUrl',
  },
  {
    title: '审核状态',
    dataIndex: 'businessLicenseUrl',
    key: 'businessLicenseUrl',
  },
  {
    title: '启用状态',
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
const cancel = () => {
  state.modalVisible = false
}
interface addInterface {
  row?: any
  handle: 'update' | 'add'
}
const addOrUpdate = ({ row, handle }: addInterface) => {
  modalVisible.value = true
  if (handle === 'add') {
    state.title = '创建散客门店'
  } else if (handle === 'update') {
    state.title = '编辑散客门店'
  }
}
</script>

<style scoped lang="scss">
.buttom_box {
  padding: 0 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>