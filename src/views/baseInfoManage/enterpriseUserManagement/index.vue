<template>
  <CommonTable :dataSource="tableData.data" :columns="columns">
    <template #button>
      <a-button type="primary" @click="addOrUpdate({ handle: 'add' })" v-permission="'新增'">新增</a-button>
    </template>
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'index'">
        {{ index + 1 }}
      </template>
      <template v-if="column.key === 'roleList'">
        <span v-for="item, index in record.roleList">
          {{ `${item.roleName}${index == record.roleList.length - 1 ? '' : '，'}` }}
        </span>
      </template>
      <template v-if="column.key === 'action'">
        <div class="action-btns">
          <a @click="addOrUpdate({ row: record, handle: 'update' })" v-permission="'编辑'">编辑</a>
          <a @click="resetPassword(record.oid)" v-permission="'重置密码'">重置密码</a>
          <a @click="disable(0, record.oid)" v-show="record.state === 1" v-permission="'禁用'">禁用</a>
          <a @click="disable(1, record.oid)" v-show="record.state === 0" v-permission="'启用'">启用</a>
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
      <a-form-item name="roleIds" label="管理员角色">
        <a-select v-model:value="form.roleIds" placeholder="请选择管理员角色" mode="multiple">
          <a-select-option v-for="item in roleOption" :value="item.roleId" :key="item.roleId">{{
              item.roleName
          }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="username" label="管理员姓名">
        <a-input v-model:value="form.username" placeholder="请输入管理员姓名">
        </a-input>
      </a-form-item>
      <a-form-item name="mobile" label="管理员手机号">
        <a-input v-model:value="form.mobile" placeholder="请输入管理员手机号">
        </a-input>
      </a-form-item>
      <a-form-item name="password" label="管理员密码" v-if="state.isAdd">
        <a-input v-model:value="form.password" placeholder="请输入管理员密码">
        </a-input>
      </a-form-item>
    </a-form>
  </CommonModal>
  <CommonModal title="强制重置密码" v-model:visible="resetPasswordVisible" @cancel="resetPasswordCancel"
    @close="resetPasswordCancel" @conform="resetPasswordConform" :conform-text="'确认'">
    <a-form ref="formRef" name="reset-password" :model="formState" :rules="rules" v-bind="layout">
      <a-form-item has-feedback label="输入原始密码" name="oldPass">
        <a-input v-model:value="formState.oldPass" type="password" autocomplete="off" />
      </a-form-item>
      <a-form-item has-feedback label="输入新密码" name="pass">
        <a-input v-model:value="formState.pass" type="password" autocomplete="off" />
      </a-form-item>
      <a-form-item has-feedback label="再输入一次" name="checkPass">
        <a-input v-model:value="formState.checkPass" type="password" autocomplete="off" />
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
import type { Rule } from 'ant-design-vue/es/form';
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '管理员姓名',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: '管理员手机号',
    dataIndex: 'mobile',
    key: 'mobile',
  },
  {
    title: '管理员账号',
    dataIndex: 'account',
    key: 'account',
  },
  {
    title: '管理员角色',
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
    title: '最后修改时间',
    dataIndex: 'lastUpdateTime',
    key: 'lastUpdateTime',
  },
  {
    title: '当前状态',
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
const teamRef = ref()
const formRef = ref()
const resetPasswordVisible = ref(false)
const form = reactive({
  oid: '',
  roleIds: [],
  companyId: '',
  password: '',
  mobile: '',
  account: '',
  userStatus: 1,
  username: '',
})
const formState = reactive({
  oid: '',
  pass: '',
  oldPass: '',
  checkPass: '',
})
let validatePass = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请输入密码！');
  } else {
    if (formState.checkPass !== '') {
      formRef.value.validateFields('checkPass');
    }
    return Promise.resolve();
  }
};
let validatePass2 = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请再次输入密码！');
  } else if (value !== formState.pass) {
    return Promise.reject("两次输入的密码不一致！");
  } else {
    return Promise.resolve();
  }
};
const rules: Record<string, Rule[]> = {
  pass: [{ required: true, validator: validatePass, trigger: 'change' }],
  checkPass: [{ validator: validatePass2, trigger: 'change' }],
  oldPass: [{ required: true, trigger: 'blur', message: '请输入原始密码' }]
};
const formRules: any = {
  roleIds: [{ required: true, trigger: 'blur', message: '请选择管理员角色' }],
  username: [{ required: true, trigger: 'blur', message: '请输入管理员姓名' }],
  mobile: [{ required: true, trigger: 'blur', message: '请输入管理员手机号' }],
  password: [{ required: true, trigger: 'blur', message: '请输入管理员密码' }],
};
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const roleOption = ref<any[]>([])
const state = reactive({
  isAdd: true,
  companyId: '',
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
    state.isAdd = true
  } else if (handle === 'update') {
    title.value = '编辑管理员用户'
    const { oid, roleList, password, mobile, account, userStatus, username } = row
    form.oid = oid;
    form.password = password;
    form.mobile = mobile;
    form.account = account;
    form.userStatus = userStatus;
    form.username = username;
    form.companyId = '';
    const roleIds = roleList.map((item: any) => {
      return item.oid
    })
    form.roleIds = roleIds;
    state.isAdd = false
  }
}
const onSearch = () => {
  api.userList(state.tableData.param).then((res: any) => {
    state.tableData.data = res.content;
    state.tableData.total = res.total;
  })
}
const getRoleList = () => {
  form.roleIds = [];
  let userInfo = window.localStorage.getItem('userInfo');
  userInfo = JSON.parse(userInfo as string)
  const { sysCompany: { businessType, oid } } = userInfo
  state.companyId = oid
  api.getRoleListByType(businessType).then((res: any) => {
    roleOption.value = res.map((item: any) => {
      return {
        roleName: item.roleName,
        roleId: item.oid
      }
    });
  })
}
const closeModal = () => {
  modalVisible.value = false
  teamRef.value.resetFields()
}
const save = () => {
  teamRef.value.validate().then(async (val: any) => {
    if (state.isAdd) {
      form.companyId = state.companyId
      form.account = form.mobile
      api.addUser(toRaw(form)).then((res: any) => {
        message.success('添加管理员成功！');
        onSearch();
        closeModal();
      })
    } else {
      api.editUser(toRaw(form)).then((res: any) => {
        message.success('编辑管理员成功！');
        onSearch();
        closeModal();
      })
    }
  }).catch((err: string) => {
    console.log(err);
  })
}
const resetPasswordCancel = () => {
  resetPasswordVisible.value = false
  formRef.value.resetFields();
}
const resetPasswordConform = () => {
  formRef.value.validateFields().then(() => {
    api.editPassWord({ oid: formState.oid, newPassword: formState.pass, oldPassword: formState.oldPass }).then((res) => {
      message.success('重置密码成功！');
      resetPasswordCancel();
    })
  })
}
const resetPassword = (oid: string) => {
  formState.oid = oid
  resetPasswordVisible.value = true
}
const disable = () => { }
onMounted(() => {
  onSearch();
  getRoleList();
})
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