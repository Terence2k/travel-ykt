<template>
  <CommonTable :dataSource="tableData.data" :columns="columns">
    <template #button>
      <a-button type="primary" @click="addOrUpdate({ handle: 'add' })">新增</a-button>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'businessLicenseUrl'">
        <a-image width="100%" :src="record.businessLicenseUrl" />
      </template>
      <template v-if="column.key === 'action'">
        <div class="action-btns">
          <a @click="addOrUpdate({ row:record, handle: 'add' })">编辑</a>
          <a-popconfirm title="是否删除该团队类型？删除后，旅行社将无法填写该类型的行程单，请谨慎操作！" ok-text="确认" cancel-text="取消"
            @confirm="deleteTeam(record.oid)">
            <a>删除</a>
          </a-popconfirm>
          <a @click="disable(record)">禁用</a>
        </div>
      </template>
    </template>
  </CommonTable>
  <CommonPagination v-model:current="tableData.param.pageNo" v-model:page-size="tableData.param.pageSize"
    :total="tableData.total" @change="onHandleCurrentChange" @showSizeChange="pageSideChange" />
  <!-- <addBusinessAccount></addBusinessAccount> -->
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue'
import CommonPagination from '@/components/common/CommonPagination.vue'
import addBusinessAccount from '@/views/baseInfoManage/teamTypeManagement/addUpdateModal.vue';
import api from '@/api';
import { message } from 'ant-design-vue';
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '团队类型名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '必购项目',
    dataIndex: 'products',
    key: 'products',
  },
  {
    title: '当前状态',
    dataIndex: 'state',
    key: 'state',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '创建人',
    dataIndex: 'creatorName',
    key: 'creatorName',
  },
  {
    title: '最后修改时间',
    dataIndex: 'astUpdateTime',
    key: 'astUpdateTime',
  },
  {
    title: '最后修改人',
    dataIndex: 'lastUpdaterName',
    key: 'lastUpdaterName',
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 208
  },
]

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
  }
});
const { tableData } = toRefs(state)
const modalVisible = ref<boolean>(false)
interface addInterface {
  row?: any
  handle: 'update' | 'add'
}
const addOrUpdate = ({ row, handle }: addInterface) => {
  modalVisible.value = true
}
const deleteTeam = (oid: string) => { }
const disable = () => { }
const onHandleCurrentChange = (val: number) => {
  state.tableData.param.pageNo = val;
  onSearch();
}

const pageSideChange = (current: number, size: number) => {
  state.tableData.param.pageSize = size;
  onSearch();
}
const onSearch = () => { }
</script>

<style scoped lang="scss">

</style>disable