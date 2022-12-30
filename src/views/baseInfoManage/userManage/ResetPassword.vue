<template>
	<BaseModal title="重置密码" v-model="dialogVisible">
		<a-form
      ref="formRef"
      :model="formValidate"
      :rules="rules"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 16, offset: 1 }"
      labelAlign="left"
    >
      <a-form-item
        label="登录密码"
        name="password"
      >
        <a-input-password v-model:value="formValidate.password" :visibilityToggle="false" placeholder="请输入登录密码"/>
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
  const rules: any = {
    password: [{ required: true, trigger: 'blur', message: '请输入登录密码' }],
  };
  const save = () => {
    formRef.value
    .validateFields()
    .then((values: any) => {
      addOrUpdateAPI('editUser');
    })
    .catch((info: any) => {
      console.log('Validate Failed:', info);
    });
  }

  const addOrUpdateAPI = (apiName: string) => {
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
    formValidate.value = { ...props.params };
    formValidate.value.roleIds = formValidate.value.roleList.map((item: any) => item.oid);
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
</script>

<style>

</style>