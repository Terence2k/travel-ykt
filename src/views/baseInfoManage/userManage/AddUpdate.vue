<template>
	<BaseModal :title="options.title" v-model="modelValue" :onOk="handleOk">
		<a-form
      ref="formRef"
      :model="formValidate"
      :rules="rules"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 16, offset: 1 }"
      labelAlign="left"
    >
      <!-- <a-form-item
        label="单位类型"
        name="username"
      >
        <a-input v-model:value="formValidate.username" />
      </a-form-item> -->
      <a-form-item
        label="用户名称"
        name="username"
      >
        <a-input v-model:value="formValidate.username" />
      </a-form-item>
      <a-form-item
        label="账号"
        name="account"
      >
        <a-input v-model:value="formValidate.account" />
      </a-form-item>
      <a-form-item
        label="手机号码"
        name="mobile"
      >
        <a-input v-model:value="formValidate.mobile" />
      </a-form-item>
      <a-form-item
        label="可用范围"
        name="businessType"
      >
        <a-select
          ref="select"
          placeholder="请输入可用范围"
          allowClear
          v-model:value="formValidate.businessType"
          @change="getRoleList"
        >
          <a-select-option v-for="item in roleManage.businessType" :value="item.value">
            {{ item.title }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="所属角色"
        name="roleIds"
        v-if="formValidate.businessType"
      >
        <a-select
          ref="select"
          mode="multiple"
          v-model:value="formValidate.roleIds"
        >
          <a-select-option v-for="item in roleList" :value="item.roleId">{{ item.roleName }}</a-select-option>
        </a-select>
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
  import { ref, Ref, computed, watch, toRefs, reactive } from 'vue';
	import BaseModal from '@/components/common/BaseModal.vue';
  import type { FormInstance } from 'ant-design-vue';
  import api from '@/api';
  import { message } from 'ant-design-vue';
  import { getUserInfo } from '@/utils/util';
  import { useRoleManage } from '@/stores/modules/roleManage';

  const props = defineProps({
      modelValue: {
        type: Boolean,
        default: false
      },
      params: Object
  })
  const emit = defineEmits(['update:modelValue', 'cancel', 'onSearch']);
  const dialogVisible = ref(false);
  const formRef = ref<FormInstance>();
  const formValidate: Ref<Record<string, any>> = ref({});
  const options = reactive({ title: '新增用户' });
  const rules: any = {
    username: [{ required: true, trigger: 'blur', message: '请输入用户姓名' }],
    mobile: [{ required: true, trigger: 'blur', message: '请输入用户电话' }],
    account: [{ required: true, trigger: 'blur', message: '请输入账号' }],
    roleIds: [{ required: true, trigger: 'blur', message: '请选择所属角色' }],
    businessType: [{ required: true, trigger: 'change', message: '请选择可用范围' }],
    userStatus: [{ required: true, trigger: 'change', message: '请选择用户状态' }],
  };
  const userInfo = getUserInfo();
  const roleList: Ref<Array<any>> = ref([]);
  const roleManage = useRoleManage();

	const handleOk = async (callback:Function) => {

  };
  
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
    formValidate.value.companyId = null;
    formValidate.value.password = '123456';
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
      formValidate.value = { ...props.params };
      formValidate.value.roleIds = formValidate.value.roleList.map((item: any) => item.oid)
      options.title = '编辑用户';
    } else {
      options.title = '新增用户';
    }
  }

  const getRoleList = (businessType: string) => {
    api.getRoleListByType(businessType).then((res: any) => {
      roleList.value = res.map((item: any) => {
        return {
          roleName: item.roleName,
          roleId: item.oid
        }
      });
    })
  }

  watch(() => props.modelValue, async (nVal) => {
    dialogVisible.value = nVal;
    if (dialogVisible.value) {
      await init();
    }
	})
  
  watch(dialogVisible, nVal => {
    emit('update:modelValue', nVal);
  });
</script>

<style>

</style>