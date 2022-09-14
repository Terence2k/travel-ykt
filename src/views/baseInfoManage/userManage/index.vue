<template>
  <CommonSearch>
    <search-item label="单位类型">
      <a-select
        ref="select"
        placeholder="请选择单位类型"
      >
        <a-select-option value="all">all</a-select-option>
      </a-select>
    </search-item>
    <search-item label="角色名称">
      <a-select
        ref="select"
        placeholder="请选择角色"
      >
        <a-select-option value="all">all</a-select-option>
      </a-select>
    </search-item>
    <search-item label="状态">
      <a-select
        ref="select"
        placeholder="请选择状态"
      >
        <a-select-option value="all">all</a-select-option>
      </a-select>
    </search-item>
    <search-item label="查询">
      <a-input placeholder="请输入用户姓名/手机号"/>
    </search-item>
    <template #button>
      <a-button>查询</a-button>
    </template>
  </CommonSearch>
  <CommonTable :dataSource="dataSource" :columns="columns">
      <template #button>
        <a-button type="primary" class="success">新增</a-button>
      </template>
      <template #bodyCell="{ column }">
        <template v-if="column.key === 'action'">
          <div class="action-btns">
            <a>编辑</a>
            <a>禁用</a>
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
</template>

<script setup lang="ts">
  import CommonTable from '@/components/common/CommonTable.vue'
  import CommonPagination from '@/components/common/CommonPagination.vue'
  import CommonSearch from '@/components/common/CommonSearch.vue'
  import SearchItem from '@/components/common/CommonSearchItem.vue'
  import { userList } from '@/api';
  const dataSource = [
    {
      key: '1',
      name: '王某某',
      age: 32,
      address: '西湖区湖底公园1号',
      address1: '西湖区湖底公园1号',
      address2: '西湖区湖底公园1号',
      address3: '西湖区湖底公园1号',
    },
    {
      key: '2',
      name: '张某某',
      age: 42,
      address: '西湖区湖底公园1号',
      address1: '西湖区湖底公园1号',
      address2: '西湖区湖底公园1号',
      address3: '西湖区湖底公园1号',
    },
    {
      key: '3',
      name: '张某某',
      age: 42,
      address: '西湖区湖底公园1号',
      address1: '西湖区湖底公园1号',
      address2: '西湖区湖底公园1号',
      address3: '西湖区湖底公园1号',
    },
  ];
  const columns = [
    {
      title: '用户姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '手机号',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '所属单位类型',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '所属单位',
      dataIndex: 'address1',
      key: 'address1',
    },
    {
      title: '所属角色',
      dataIndex: 'address2',
      key: 'address2',
    },
    {
      title: '状态',
      dataIndex: 'address3',
      key: 'address3',
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
      total: 400,
      loading: false,
      param: {
        pageNo: 1,
        pageSize: 10,
      },
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
    // onSearch();
  }

  const onSearch = () => {
    userList(state.tableData.param).then(res => {
      console.log(res)
    })
  }
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
