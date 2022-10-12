<template>
  <CommonTable :dataSource="tableData.data" :columns="columns">
    <template #button>
      <a-button type="primary" @click="addOrUpdate({ handle: 'add' })">新增</a-button>
    </template>
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'index'">
        {{ index + 1 }}
      </template>
      <template v-if="column.key === 'action'">
        <div class="action-btns">
          <a @click="addOrUpdate({ row:record, handle: 'update' })">编辑</a>
          <a @click="resetPassword">重制密码</a>
          <a @click="disable(0, record.oid)" v-show="record.state === 1">禁用</a>
          <a @click="disable(1, record.oid)" v-show="record.state === 0">启用</a>
        </div>
      </template>
    </template>
  </CommonTable>
  <div class="buttom_box">
    <div>我的企业管理员，共 <span style="color:#de0025">{{ tableData.total }}</span> 名</div>
    <CommonPagination v-model:current="tableData.param.pageNo" v-model:page-size="tableData.param.pageSize"
      :total="tableData.total" @change="onHandleCurrentChange" @showSizeChange="pageSideChange" />
  </div>

  <CommonModal :title="title" v-model:visible="modalVisible" @close="closeModal" @cancel="closeModal" @conform="save">
    <a-form ref="teamRef" :model="form" :rules="formRules" name="addTeam" autocomplete="off" :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }">
      <a-form-item name="businessType" label="管理员角色">
        <a-select v-model:value="form.businessType" placeholder="请选择管理员角色">
          <a-select-option v-for="item in roleOption" :value="item.codeValue" :key="item.codeValue">{{
          item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="name" label="管理员姓名">
        <a-input v-model:value="form.name" placeholder="请输入管理员姓名">
        </a-input>
      </a-form-item>
      <a-form-item name="name" label="管理员手机号">
        <a-input v-model:value="form.name" placeholder="请输入管理员手机号">
        </a-input>
      </a-form-item>
      <a-form-item name="name" label="管理员密码">
        <a-input v-model:value="form.name" placeholder="请输入管理员密码" type="password">
        </a-input>
      </a-form-item>
    </a-form>
  </CommonModal>
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
    title: '管理员姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '管理员手机号（登录账号）',
    dataIndex: 'productsLength',
    key: 'productsLength',
  },
  {
    title: '管理员角色',
    dataIndex: 'stateName',
    key: 'stateName',
  },
  {
    title: '账号创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '最后登录时间',
    dataIndex: 'creatorName',
    key: 'creatorName',
  },
  {
    title: '最后修改时间',
    dataIndex: 'lastUpdateTime',
    key: 'lastUpdateTime',
  },
  {
    title: '当前状态',
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
let isAdd = true
const teamRef = ref()
const form = reactive({
  businessType: '',
  name: '',
})
const formRules: any = {
  name: [{ required: true, trigger: 'blur', message: '名字不能为空' }],
  state: [{ required: true, trigger: 'blur', message: '是否启用' }],
};
const roleOption = []
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
const modalVisible = ref<boolean>(false)
const title = ref<string>('添加管理员用户')
const onHandleCurrentChange = (val: number) => {
  state.tableData.param.pageNo = val;
  onSearch();
}
const pageSideChange = (current: number, size: number) => {
  state.tableData.param.pageSize = size;
  onSearch();
}
interface addInterface {
  row?: any
  handle: 'update' | 'add'
}
const addOrUpdate = ({ row, handle }: addInterface) => {
  modalVisible.value = true
  if (handle === 'add') {
    title.value = '添加管理员用户'
    isAdd = true
  } else if (handle === 'update') {
    title.value = '编辑管理员用户'
    /* const { name, state, productIds, oid } = row
    teamForm.name = name;
    teamForm.state = state;
    teamForm.oid = oid;
    normalProductIds = productIds; */
    isAdd = false
  }
}
const onSearch = async () => {
  // let res = await api.selectTeamTypeList(state.tableData.param)
  // state.tableData.data = res.content
  // state.tableData.total = res.total
}
const closeModal = () => {
  modalVisible.value = false
  teamRef.value.resetFields()
}
const save = () => {
  teamRef.value.validate().then(async (val: any) => {
    if (isAdd) {

    } else {
    }
  }).catch((err: string) => {
    console.log(err);
  })
}
const resetPassword = () => { }
const disable = () => { }
</script>

<style scoped lang="scss">
.buttom_box {
  margin-left: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>