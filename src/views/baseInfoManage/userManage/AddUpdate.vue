<template>
	<BaseModal :title="options.title" v-model="dialogVisible">
		<a-form
      ref="formRef"
      :model="formValidate"
      :rules="rules"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 16, offset: 1 }"
      labelAlign="left"
    >
      <a-form-item
        label="选择企业类型"
        name="businessType"
        v-if="isPlatformSuperAdmin"
      >
        <a-select
          ref="select"
          placeholder="请选择企业类型"
          allowClear
          v-model:value="formValidate.businessType"
          :disabled="formValidate.oid ? true : false"
          @change="getRoleList"
        >
          <a-select-option v-for="item in businessTypeOption" :value="item.codeValue">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="选择企业"
        name="companyId"
        v-if="isPlatformSuperAdmin"
      >
        <a-select
          ref="select"
          placeholder="选择一个企业"
          allowClear
          v-model:value="formValidate.companyId"
          :disabled="formValidate.oid ? true : false"
        >
          <a-select-option v-for="item in companyOptions" :value="item.oid">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="管理员角色"
        name="roleIds"
      >
        <a-select
          ref="select"
          mode="multiple"
          v-model:value="formValidate.roleIds"
          placeholder="请选择管理员角色"
          :disabled="formValidate.oid ? true : false"
        >
          <a-select-option v-for="item in roleList" :value="item.roleId">{{ item.roleName }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="管理员姓名"
        name="username"
      >
        <a-input v-model:value="formValidate.username" placeholder="请输入管理员姓名"/>
      </a-form-item>
      <a-form-item
        label="管理员手机号"
        name="mobile"
      >
        <a-input v-model:value="formValidate.mobile" placeholder="请输入管理员手机号"/>
      </a-form-item>
      <a-form-item
        label="登录账号"
        name="account"
      >
        <a-input v-model:value="formValidate.account" placeholder="请输入登录账号" :disabled="formValidate.oid ? true : false"/>
      </a-form-item>
      <a-form-item
        label="登录密码"
        name="password"
      >
        <a-input-password v-model:value="formValidate.password" :visibilityToggle="false" placeholder="请输入登录密码"/>
      </a-form-item>
      <a-form-item
        label="状态"
        name="userStatus"
      >
        <a-radio-group v-model:value="formValidate.userStatus">
          <a-radio :value="1">启用</a-radio>
          <a-radio :value="0">禁用</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
		<template v-slot:footer>
			<a-button type="primary" @click="save">保存</a-button>
			<a-button @click="dialogVisible = false">取消</a-button>
		</template>
	</BaseModal>
</template>

<script lang="ts" setup>
  import { ref, Ref, computed, watch, reactive } from 'vue';
	import BaseModal from '@/components/common/BaseModal.vue';
  import type { FormInstance } from 'ant-design-vue';
  import api from '@/api';
  import { message } from 'ant-design-vue';
  import { getUserInfo } from '@/utils/util';
  import { useBusinessManageOption } from '@/stores/modules/businessManage';
  import type { Rule } from 'ant-design-vue/es/form';
  import { validPhone } from '@/utils';

  const props = defineProps({
      modelValue: {
        type: Boolean,
        default: false
      },
      params: Object
  })
  const emit = defineEmits(['update:modelValue', 'onSearch', 'cancel']);
  const dialogVisible = ref(false);
  const formRef = ref<FormInstance>();
  const formValidate: Ref<Record<string, any>> = ref({});
  const options = reactive({ title: '新增用户' });
  const validateAccount = async (_rule: Rule, value: string) => {
    if (formValidate.value.oid && value === formValidate.value.account) return Promise.resolve();
    
    const formData = new FormData();
    formData.append('account', value);
    await api.checkAccount(formData).then((res: any) => {
      return Promise.resolve();
    }).catch((err: any) => {
      return Promise.reject(err);
    })
  };
  const rules: any = {
    username: [{ required: true, trigger: 'blur', message: '请输入管理员姓名' }],
	  mobile: [{ required: true, validator: validPhone, trigger: 'blur' }],
    account: [{ validator: validateAccount, required: true, trigger: 'blur'}],
    password: [{ required: true, trigger: 'blur', message: '请输入登录密码' }],
    roleIds: [{ required: true, trigger: 'blur', message: '请选择管理员角色' }],
    businessType: [{ required: true, trigger: 'change', message: '请选择企业类型' }],
    companyId: [{ required: true, trigger: 'change', message: '请选择企业' }],
    userStatus: [{ required: true, trigger: 'change', message: '请选择用户状态' }],
  };
  const userInfo = getUserInfo();
  const roleList: Ref<Array<any>> = ref([]);
  const isPlatformSuperAdmin = ref(false);
  const businessManageOptions = useBusinessManageOption();
  const businessTypeOption = computed(() => businessManageOptions.businessTypeOption);
  const companyOptions = computed(() => businessManageOptions.companyOptions);

  const save = () => {
    formRef.value
    .validateFields()
    .then((values: any) => {
      if (formValidate.value.oid) {
        addOrUpdateAPI('editUser');
      } else {
        addOrUpdateAPI('addUser');
      }
    })
    .catch((info: any) => {
      console.log('Validate Failed:', info);
    });
  }

  const addOrUpdateAPI = (apiName: string) => {
    if (typeof formValidate.value.roleIds === 'number') formValidate.value.roleIds = [formValidate.value.roleIds];
    console.log('formValidate:', formValidate.value);
    api[apiName]({...formValidate.value}).then((res: any) => {
      // console.log('res:', res);
      message.success('保存成功');
      formRef.value.resetFields();
      console.log('reset formValidate: ', toRaw(formValidate));
      emit('cancel');
      emit('onSearch');
    }).catch((err: any) => {
      console.error(err);
    })
  }

  const init = async () => {
    console.log('params', props.params);
    formValidate.value = {};
    if (props.params?.oid) {
      formValidate.value.businessType = props.params.businessType;
      getRoleList(formValidate.value.businessType);
      formValidate.value = { ...props.params };
      formValidate.value.roleIds = formValidate.value.roleList.map((item: any) => item.oid);
      options.title = '编辑用户';
    } else {
      getRoleList(userInfo.sysCompany?.businessType);
      formValidate.value.userStatus = 1;
      options.title = '新增用户';
    }
  }

  const getRoleList = (businessType: string) => {
    formValidate.value.roleIds = [];
    api.getRoleListByType(businessType).then((res: any) => {
      roleList.value = res.map((item: any) => {
        return {
          roleName: item.roleName,
          roleId: item.oid
        }
      });
    })
    businessManageOptions.getCompanyByBusinessType(businessType);
  }

  watch(() => props.modelValue, async (nVal) => {
    dialogVisible.value = nVal;
    if (dialogVisible.value) {
      await init();
    } else {
      // 关闭弹窗重置校验
      formRef.value.resetFields();
    }
	})
  
  watch(dialogVisible, nVal => {
    emit('update:modelValue', nVal);
  });
  
  const initOpeion = async () => {
    await businessManageOptions.getBusinessTypeOption();
    // PLATFORM_SUPER_ADMIN: 一卡通平台管理员
    isPlatformSuperAdmin.value = userInfo.sysRoles.some((item: any) => item.roleCode === 'PLATFORM_SUPER_ADMIN');
  };

  onMounted(() => {
    initOpeion();
  })
</script>

<style>

</style>