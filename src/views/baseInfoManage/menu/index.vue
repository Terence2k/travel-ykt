<template>
  <CommonTable :dataSource="state.tableData.data" :columns="columns">
      <template #button>
        <a-button type="primary" @click="addOrUpdate({ handle: 'add' })">新增</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'menuType'">
          <span>{{menuManage.menuType[record.menuType]}}</span>
        </template>
        <template v-if="column.key === 'menuStatus'">
          <span>{{menuManage.menuStatus[record.menuStatus]}}</span>
        </template>
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
  <AddUpdate 
    v-model="state.operationModal.isAddOrUpdate"
    :params="state.params"
    :menuList="state.tableData.data"
    @onSearch="onSearch"
    @cancel="cancel"/>
</template>

<script setup lang="ts">
  import CommonTable from '@/components/common/CommonTable.vue'
  import CommonPagination from '@/components/common/CommonPagination.vue'
  import AddUpdate from './AddUpdate.vue';
  import api from '@/api';
  import { message } from 'ant-design-vue';
  import { useMenuManage } from '@/stores/modules/menuManage';
  import { Modal } from 'ant-design-vue';
  
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
      dataIndex: 'buttonName',
      key: 'buttonName',
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
  const menuManage = useMenuManage();

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

  const handleMenuTree = (menuList: any) => {
    menuList.forEach((item: any) => {
      // 设置表格树形结构数据唯一标识key
      item.key = item.oid;
      if (item.children?.length) {
        handleMenuTree(item.children);
      } else {
        delete item.children;
      }
    });
  }

  const onSearch = () => {
    api.menuList().then((res: any) => {
      handleMenuTree(res);
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
    Modal.confirm({
      title: '删除菜单',
      width: 560,
      closable: true,
      centered: true,
      icon: false,
      content: `您即将删除菜单“${row.menuName}”，删除后该页面将不再可见，是否确定删除？`,
      onOk() {
        api.deleteMenu(row.oid).then((res: any) => {
          message.success('删除成功');
          onSearch();
        }).catch((err: any) => {
          message.error(err || '删除失败')
        })
      },
      onCancel() {},
    });
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
