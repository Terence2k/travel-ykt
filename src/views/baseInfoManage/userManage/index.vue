<template>
  <CommonSearch v-if="!isBusinessSuperAdmin">
    <search-item label="角色名称">
      <a-input v-model:value="state.tableData.param.roleName" placeholder="请输入角色名称"/>
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
      <a-button @click="querySearch" v-permission="'查询'">查询</a-button>
    </template>
  </CommonSearch>
  <CommonTable :dataSource="state.tableData.data" :columns="columns">
      <template #button>
        <a-button type="primary" @click="addOrUpdate({ handle: 'add' })" v-permission="'新增'">新增</a-button>
      </template>
      <template #bodyCell="{ column, index, record }">
        <template v-if="column.key === 'index'">
            <div>
                {{(state.tableData.param.pageNo - 1) * (state.tableData.param.pageSize) + (index + 1)}}
            </div>
        </template>
        <template v-if="column.key === 'roleList'">
          <span v-for="item, index in record.roleList">
            {{`${item.roleName}${index == record.roleList.length - 1? '' : '，' }`}}
          </span>
        </template>
        <template v-if="column.key === 'action'">
          <div class="action-btns">
            <a @click="addOrUpdate({  row: record,  handle: 'update'})" v-permission="'编辑'">编辑</a>
            <!-- <a @click="resetPassword(record.oid)">重置密码</a> -->
            <a @click="resetPw({  row: record,  handle: 'update'})" v-permission="'重置密码'">重置密码</a>
            <template v-if="record.roleList.some((item: any) => item.roleCode != 'PLATFORM_SUPER_ADMIN')">
              <a @click="editStatus(record.oid, 0)" v-if="record.userStatus === 1" v-permission="'禁用'">禁用</a>
              <a @click="editStatus(record.oid, 1)" v-if="record.userStatus === 0" v-permission="'启用'">启用</a>
            </template>
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
    @onSearch="onSearch"
    @cancel="cancel"/>
  <ResetPassword 
    v-model="state.operationModal.isResetPw"
    :params="state.params"
    @onSearch="onSearch"
    @cancel="cancel"/>
</template>

<script setup lang="ts">
  import CommonTable from '@/components/common/CommonTable.vue'
  import CommonPagination from '@/components/common/CommonPagination.vue'
  import CommonSearch from '@/components/common/CommonSearch.vue'
  import SearchItem from '@/components/common/CommonSearchItem.vue'
  import AddUpdate from './AddUpdate.vue';
  import ResetPassword from './ResetPassword.vue';
  import api from '@/api';
  import { message } from 'ant-design-vue';
  import { getUserInfo } from '@/utils/util';
  import { Modal } from 'ant-design-vue';
  import { Ref } from 'vue';
  
  const columns: Ref<Array<any>> = ref([]);

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
      roleParam: {
        businessType: ''
      }
    },
    params: {},
    operationModal: {
      isAddOrUpdate: false,
      isResetPw: false
    },
    optionRoleList: [] as any
  });
  const userInfo = getUserInfo();
  const isBusinessSuperAdmin = ref(false);
  // const isGroupSuperAdmin = ref(false);

  const onHandleCurrentChange = (val: number) => {
    state.tableData.param.pageNo = val;
    onSearch();
  }
  
  const pageSideChange = (current: number, size: number) => {
    state.tableData.param.pageSize = size;
    onSearch();
  }

  const querySearch = () => {
    state.tableData.param.pageNo = 1;
    onSearch();
  }

  const onSearch = () => {
    api.userList(state.tableData.param).then((res: any) => {
      state.tableData.data = res.content;
      state.tableData.total = res.total;
    })
  }

  const cancel = (): any => {
    state.operationModal.isAddOrUpdate = false;
    state.operationModal.isResetPw = false;
  };

  const addOrUpdate = (param: any) => {
    const { row, handle } = param;
    state.params = {};
    if (handle === 'update') {
      state.params = row;
    }
    state.operationModal.isAddOrUpdate = true;
  };

  const resetPw = (param: any) => {
    const { row, handle } = param;
    state.params = {};
    if (handle === 'update') {
      state.params = row;
    }
    state.operationModal.isResetPw = true;
  };

  const editStatus = (id: any, status: any) => {
    let formData = new FormData();
    formData.append('oid', id);
    formData.append('status', status);
    api.editStatus(formData).then((res: any) => {
      message.success('操作成功');
      onSearch();
    })
  }

  // 重置密码
  // const resetPassword = (id: any) => {
  //     Modal.confirm({
  //       title: '重置密码',
  //       width: 560,
  //       closable: true,
  //       centered: true,
  //       icon: false,
  //       content: `是否确认重置密码？`,
  //       onOk() {
  //         let formData = new FormData();
  //         formData.append('userId', id);
  //         formData.append('newPassword', '123456');
  //         api.adminResetPassword(formData).then((res: any) => {
  //           message.success('密码重置成功');
  //           onSearch();
  //         })
  //       },
  //       onCancel() {},
  //     });
  // }

  onBeforeMount(() => {
    // 企业超级管理员不显示搜索区域
    isBusinessSuperAdmin.value = userInfo.sysRoles.some((item: any) => !['PLATFORM_SUPER_ADMIN', 'GROUP_SUPER_ADMIN'].includes(item.roleCode));
    // 集团超级管理员不显示操作
    // isGroupSuperAdmin.value = userInfo.sysRoles.some((item: any) => ['GROUP_SUPER_ADMIN'].includes(item.roleCode));
    columns.value = [
      {
        title: '序号',
        key: 'index',
        width: '80px'
      },
      {
        title: '所属企业',
        dataIndex: 'unitName',
        key: 'unitName',
      },
      {
        title: '企业类型',
        dataIndex: 'businessTypeName',
        key: 'businessTypeName',
      },
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
        title: '登录账号',
        dataIndex: 'account',
        key: 'account',
      },
      {
        title: '角色',
        dataIndex: 'roleList',
        key: 'roleList',
      },
      {
        title: '账号创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '最后登录时间',
        dataIndex: 'lastLoginTime',
        key: 'lastLoginTime',
      },
      {
        title: '当前状态',
        dataIndex: 'userStatusName',
        key: 'userStatusName',
      },
      {
        title: '操作',
        key: 'action',
        width: 208
      },
    ]
    columns.value.forEach((item: any, index: any) => {
      // if (item.key === 'action' && isGroupSuperAdmin.value) {
      // if (item.key === 'action') {
      //   delete columns.value[index];
      // }
      if (['unitName', 'businessTypeName'].includes(item.key) && isBusinessSuperAdmin.value) {
        delete columns.value[index];
      }
    })
  })

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
