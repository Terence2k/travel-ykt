<template>
  <div class="search-area">
    <div class="search-items">
      <div class="title">单位类型</div>
      <a-select
        ref="select"
        style="width: 200px;"
        placeholder="请选择单位类型"
      >
        <a-select-option value="all">all</a-select-option>
      </a-select>
    </div>
    <div class="search-items">
      <div class="title">角色名称</div>
      <a-select
        ref="select"
        style="width: 200px;"
        placeholder="请选择角色"
      >
        <a-select-option value="all">all</a-select-option>
      </a-select>
    </div>
    <div class="search-items">
      <div class="title">状态</div>
      <a-select
        ref="select"
        style="width: 200px;"
        placeholder="请选择状态"
      >
        <a-select-option value="all">all</a-select-option>
      </a-select>
    </div>
    <div class="search-items">
      <div class="title">查询</div>
      <a-input placeholder="请输入用户姓名/手机号" style="width: 200px;"/>
    </div>
    <div class="search-button">
      <a-button>查询</a-button>
    </div>
  </div>
  <div class="table-area">
    <div class="list-btn">
      <a-button type="primary" class="success">新增</a-button>
    </div>
    <a-table :dataSource="dataSource" :columns="columns" :scroll="{ x: '100vw', y: `100vh` }">
      <template #bodyCell="{ column }">
        <template v-if="column.key === 'action'">
          <div class="action-btns">
            <a>编辑</a>
            <a>禁用</a>
            <a>查看</a>
          </div>
        </template>
    </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
  const dataSource = [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
      address1: '西湖区湖底公园1号',
      address2: '西湖区湖底公园1号',
      address3: '西湖区湖底公园1号',
    },
    {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
      address1: '西湖区湖底公园1号',
      address2: '西湖区湖底公园1号',
      address3: '西湖区湖底公园1号',
    },
    {
      key: '3',
      name: '胡彦祖',
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
      width: 208
    },
  ]
</script>

<style lang="less">
  .search-area {
    display: flex;
    flex-wrap: wrap;
    padding: 24px 52px 24px 20px;
    border-bottom: 1px #f1f2f5 solid;
    .search-items {
      display: flex;
      align-items: center;
      margin-right: 32px;
      .title {
        color: #1E2226;
        font-weight: bold;
        margin-right: 16px;
      }
    }
    .search-button {
      display: inline-flex;
      justify-content: flex-end;
      float: right;
      text-align: right;
      flex: 1;
    }
  }
  .table-area {
    height: 100%;
    overflow: hidden;
    .list-btn {
      display: flex;
      justify-content: flex-end;
      padding: 24px 52px 16px;
    }
    .success {
      background-color: #36B374;
      color: #fff;
    }
    .action-btns {
      a {
        margin: 0 6px;
        &:first-of-type {
          margin-left: 0;
        }
      }
    }
  }

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
