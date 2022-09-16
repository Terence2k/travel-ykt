<template>
	<BaseModal :title="options.title" v-model="modelValue" :onOk="handleOk">
		<a-form
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
        label="所属角色"
        name="roleIds"
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
  import { addUser } from '@/api';
import { message } from 'ant-design-vue';

  const props = defineProps({
      modelValue: {
        type: Boolean,
        default: false
      },
      params: Object,
      roleList: Array
  })
  const emit = defineEmits(['update:modelValue']);
  const dialogVisible = ref(false);
  const formValidate: Ref<Record<string, any>> = ref({});
  const options = reactive({ title: '新增用户' });
  const rules: any = {
    username: [{ required: true, trigger: 'blur', message: '请输入用户姓名' }],
    mobile: [{ required: true, trigger: 'blur', message: '请输入用户电话' }],
    account: [{ required: true, trigger: 'blur', message: '请输入账号' }],
    roleIds: [{ required: true, trigger: 'blur', message: '请选择所属角色' }],
    userStatus: [{ required: true, trigger: 'change', message: '请选择用户状态' }],
  };

	const handleOk = async (callback:Function) => {

  };

  const save = () => {
    formValidate.value.companyId = null;
    console.log('formValidate:', formValidate.value);
    addUser({...formValidate.value}).then((res: any) => {
      // console.log('res:', res);
      message.success('新增成功')
    }).catch((err: any) => {
      console.error(err);
      
    })
  }

  const init = async () => {
    console.log('params', props.params);
    formValidate.value = {};
    if (props.params?.oid) {
      formValidate.value = { ...props.params };
      options.title = '编辑用户';
    } else {
      options.title = '新增用户';
    }
  }

  watch(() => props.modelValue, async (nVal) => {
    console.log('nval:', nVal);
    dialogVisible.value = nVal;
    if (dialogVisible.value) {
      await init();
    }
	})
  
  watch(dialogVisible, nVal => {
    console.log('dialogVisible:', nVal);
    emit('update:modelValue', nVal);
  });
</script>

<style>

</style>