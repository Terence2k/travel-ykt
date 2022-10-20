<template>
  <CommonSearch>
    <search-item label="状态">
      <a-select
        ref="select"
        placeholder="请选择状态"
        v-model:value="state.tableData.param.status"
        allowClear
      >
        <a-select-option :value="1">启用</a-select-option>
        <a-select-option :value="0">禁用</a-select-option>
      </a-select>
    </search-item>
    <search-item label="可用范围">
      <a-select
        ref="select"
        placeholder="请输入可用范围"
        allowClear
        v-model:value="state.tableData.param.availableRange"
      >
        <a-select-option v-for="item in businessTypeOption" :value="item.codeValue">
          {{ item.name }}
        </a-select-option>
      </a-select>
    </search-item>
    <search-item label="角色名称">
      <a-input v-model:value="state.tableData.param.roleName" placeholder="请输入角色名称"/>
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
            <a @click="editStatus(record.oid, 0)" v-if="record.roleStatus === 1">禁用</a>
            <a @click="editStatus(record.oid, 1)" v-if="record.roleStatus === 0">启用</a>
            <a @click="showDetails(record)">查看</a>
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
    :optionTypeList="businessTypeOption"
    @onSearch="onSearch"
    @cancel="cancel"/>
  <Detail
    v-model="state.operationModal.showDetails"
    :params="state.params"
    @cancel="cancel"/>
</template>

<script setup lang="ts">
  import CommonTable from '@/components/common/CommonTable.vue'
  import CommonPagination from '@/components/common/CommonPagination.vue'
  import CommonSearch from '@/components/common/CommonSearch.vue'
  import SearchItem from '@/components/common/CommonSearchItem.vue'
  import AddUpdate from './AddUpdate.vue';
  import Detail from './Detail.vue';
  import api from '@/api';
  import { message } from 'ant-design-vue';
  import { useBusinessManageOption } from '@/stores/modules/businessManage';
  
  const columns = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: '可用范围',
      dataIndex: 'availableRangeName',
      key: 'availableRangeName',
    },
    {
      title: '状态',
      dataIndex: 'roleStatusName',
      key: 'roleStatusName',
    },
    {
      title: '用户数量',
      dataIndex: 'userCount',
      key: 'userCount',
    },
    {
      title: '编辑人',
      dataIndex: 'lastUpdaterName',
      key: 'lastUpdaterName',
    },
    {
      title: '编辑时间',
      dataIndex: 'lastUpdateTime',
      key: 'lastUpdateTime',
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
        availableRange: '',
        roleName: '',
        status: null,
      },
      roleParam: {
        pageNo: 1,
        pageSize: 100000,
      }
    },
    params: {},
    operationModal: {
      isAddOrUpdate: false,
      showDetails: false
    },
  });
  const businessManageOptions = useBusinessManageOption();
  const businessTypeOption = computed(() => businessManageOptions.businessTypeOption);

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
    api.roleList(state.tableData.param).then((res: any) => {
      console.log('res:', res);
      state.tableData.data = res.content;
      state.tableData.total = res.total;
    })
  }

  const cancel = (): any => {
    state.operationModal.isAddOrUpdate = false;
    state.operationModal.showDetails = false;
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

  const editStatus = (id: any, status: any) => {
    let formData = new FormData();
    formData.append('oid', id);
    formData.append('status', status);
    api.editRoleStatus(formData).then((res: any) => {
      message.success('操作成功');
      state.operationModal.isAddOrUpdate = false;
      onSearch();
    })
  }

  const showDetails = (row: any) => {
    state.params = {};
    state.params = row;
    state.operationModal.showDetails = true;
  }
  
  const initOpeion = async () => {
    await businessManageOptions.getBusinessTypeOption();
  };

  onMounted(() => {
    initOpeion();
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
