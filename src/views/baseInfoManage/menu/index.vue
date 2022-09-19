<template>
  <CommonTable :dataSource="state.tableData.data" :columns="columns">
      <template #button>
        <a-button type="primary" @click="addOrUpdate({ handle: 'add' })">新增</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <div class="action-btns">
            <a @click="addOrUpdate({  row: record,  handle: 'update'})">编辑</a>
            <a @click="deleteRow(record)">删除</a>
          </div>
        </template>
    </template>
  </CommonTable>
  <CommonPagination
    :current="state.tableData.param.pageNo"
    :page-size="state.tableData.param.pageSize"
    :total="state.tableData.total"
    @change="onHandleCurrentChange"
    @showSizeChange="pageSideChange"
  />
</template>

<script setup lang="ts">
  import CommonTable from '@/components/common/CommonTable.vue'
  import CommonPagination from '@/components/common/CommonPagination.vue'
  import api from '@/api';
  import { message } from 'ant-design-vue';
  
  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'menuName',
      key: 'menuName',
    },
    {
      title: '菜单类型',
      dataIndex: 'menuType',
      key: 'menuType',
    },
    {
      title: '页面按钮',
      dataIndex: 'buttonCode',
      key: 'buttonCode',
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
    },
    {
      title: '状态',
      dataIndex: 'menuStatus',
      key: 'menuStatus',
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
      param: {
        pageNo: 1,
        pageSize: 10,
      }
    },
    params: {},
    operationModal: {
      isAddOrUpdate: false,
    },
  });

  const onHandleCurrentChange = (val: number) => {
    console.log('change:', val);
    state.tableData.param.pageNo = val;
    onSearch();
  }
  
  const pageSideChange = (current: number, size: number) => {
    console.log('changePageSize:', size);
    state.tableData.param.pageSize = size;
    onSearch();
  }

  const onSearch = () => {
    api.menuList(state.tableData.param).then((res: any) => {
      console.log('res:', res);
      state.tableData.data = res;
      state.tableData.total = res.total;
    })
  }

  const cancel = (): any => {
    state.operationModal.isAddOrUpdate = false;
  };

  const addOrUpdate = (param: any) => {
    const { row, handle } = param;
    console.log(row);
    console.log(handle);

    state.params = {};
    if (handle === 'update') {
      state.params = row;
    }
    state.operationModal.isAddOrUpdate = true;
  };

  const deleteRow = (row: any) => {
    console.log('row: ', row);
    
  }

  onMounted(() => {
    onSearch();
  })
</script>

<style lang="less">

  // table style
  .ant-table-thead > tr > th {
    border-top: 1px solid #f0f0f0;
    background-color: #FCFCFC;
    &::before {
      height: 100% !important;
    }
  }
</style>
