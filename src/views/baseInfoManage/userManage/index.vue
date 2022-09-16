<template>
  <CommonSearch>
    <!-- <search-item label="单位类型">
      <a-select
        ref="select"
        placeholder="请选择单位类型"
      >
        <a-select-option value="">all</a-select-option>
      </a-select>
    </search-item> -->
    <search-item label="角色名称">
      <a-select
        ref="select"
        mode="multiple"
        placeholder="请选择角色"
      >
        <a-select-option v-for="item in state.optionRoleList" :value="item.roleId">
          {{ item.roleName }}
        </a-select-option>
      </a-select>
    </search-item>
    <search-item label="状态">
      <a-select
        ref="select"
        placeholder="请选择状态"
        v-model:value="state.tableData.param.status"
        allowClear
      >
        <a-select-option :value="1">启用</a-select-option>
        <a-select-option :value="0">停用</a-select-option>
      </a-select>
    </search-item>
    <search-item label="查询">
      <a-input v-model:value="state.tableData.param.keyWord" placeholder="请输入用户姓名/手机号"/>
    </search-item>
    <template #button>
      <a-button @click="onSearch">查询</a-button>
    </template>
  </CommonSearch>
  <CommonTable :dataSource="state.tableData.data" :columns="columns">
      <template #button>
        <a-button type="primary" @click="addOrUpdate({ handle: 'add' })">新增</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <div class="action-btns">
            <a @click="addOrUpdate({  row: record,  handle: 'update'})">编辑</a>
            <a @click="editStatus(record.oid, 0)" v-if="record.userStatus === 1">停用</a>
            <a @click="editStatus(record.oid, 1)" v-if="record.userStatus === 0">启用</a>
            <a>查看</a>
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
  <AddUpdate 
    v-model="state.operationModal.isAddOrUpdate"
    :params="state.params"
    :roleList="state.optionRoleList"
    @onSearch="onSearch"
    @cancel="cancel"/>
</template>

<script setup lang="ts">
  import CommonTable from '@/components/common/CommonTable.vue'
  import CommonPagination from '@/components/common/CommonPagination.vue'
  import CommonSearch from '@/components/common/CommonSearch.vue'
  import SearchItem from '@/components/common/CommonSearchItem.vue'
  import AddUpdate from './AddUpdate.vue';
  import api from '@/api';
import { message } from 'ant-design-vue';
  
  const columns = [
    {
      title: '用户姓名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: '所属单位类型',
      dataIndex: 'unitTypeName',
      key: 'unitTypeName',
    },
    {
      title: '所属单位',
      dataIndex: 'unitName',
      key: 'unitName',
    },
    {
      title: '所属角色',
      dataIndex: 'roleList',
      key: 'roleList',
    },
    {
      title: '状态',
      dataIndex: 'userStatusName',
      key: 'userStatusName',
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
        keyWord: '',
        roleName: '',
        status: null,
      },
    },
    params: {},
    operationModal: {
      isAddOrUpdate: false
    },
    optionRoleList: []
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
    api.userList(state.tableData.param).then((res: any) => {
      console.log('res:', res);
      state.tableData.data = res.content;
      state.tableData.total = res.total;
    })
  }

  const cancel = (): any => {
    state.operationModal.isAddOrUpdate = false;
  };

  const getRoleList = () => {
    api.roleList(
      {
        pageNo: 1,
        pageSize: 100000,
      }
    ).then((res: any) => {
      console.log('角色列表:', res);
      state.optionRoleList = res.content.map((item: any) => {
        return {
          roleName: item.roleName,
          roleId: item.oid
        }
      });
    })
  }

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

  const editStatus = (id: any, status: any) => {
    let formData = new FormData();
    formData.append('oid', id);
    formData.append('status', status);
    api.editStatus(formData).then((res: any) => {
      message.success('操作成功');
      state.operationModal.isAddOrUpdate = false;
      onSearch();
    })
  }

  onMounted(() => {
    getRoleList();
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
  .ant-table-body{
    height: 500px;
  }
</style>
