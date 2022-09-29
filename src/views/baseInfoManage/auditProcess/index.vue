<template>
  <CommonTable :dataSource="tableData.data" :columns="columns">
    <template #button>
      <p>当前共有 10 种审核流程</p>
    </template>
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'index'">
        {{ index + 1 }}
      </template>
      <template v-if="column.key === 'action'">
        <div class="action-btns">
          <a @click="addOrUpdate({ row:record, handle: 'update' })">编辑</a>
        </div>
      </template>
    </template>
  </CommonTable>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue'
import CommonPagination from '@/components/common/CommonPagination.vue'
import CommonModal from '@/views/baseInfoManage/dictionary/components/CommonModal.vue';
import api from '@/api';
import { message } from 'ant-design-vue';
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '审核流程名称',
    dataIndex: 'auditTypeName',
    key: 'auditTypeName',
  },
  {
    title: '流程说明释义',
    dataIndex: 'auditTypeExplain',
    key: 'auditTypeExplain',
  },
  {
    title: '事件触发的操作页面',
    dataIndex: 'auditTypePage',
    key: 'auditTypePage',
  },
  {
    title: '参与审核部门或角色',
    dataIndex: 'companyOrRoles',
    key: 'companyOrRoles',
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
    },
  }
});
const { tableData } = toRefs(state)
interface addInterface {
  row?: any
  handle: 'update' | 'add'
}
const addOrUpdate = ({ row, handle }: addInterface) => {
  if (handle === 'add') {
  } else if (handle === 'update') {
  }
}
</script>

<style scoped lang="scss">

</style>