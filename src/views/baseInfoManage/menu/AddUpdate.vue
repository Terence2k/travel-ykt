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
      <a-form-item
        label="菜单名称"
        name="menuName"
      >
        <a-input v-model:value="formValidate.menuName" />
      </a-form-item>
      <a-form-item
        label="菜单类型"
        name="menuType"
      >
        <a-select
          ref="select"
          v-model:value="formValidate.menuType"
        >
          <a-select-option :value="0">菜单夹</a-select-option>
          <a-select-option :value="1">功能模块</a-select-option>
          <a-select-option :value="2">tab页</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="上级菜单"
        name="parentId"
      >
        <a-select
          ref="select"
          v-model:value="formValidate.parentId"
        >
          <a-select-option v-for="item in menuList" :value="item.oid">{{item.menuName}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="跳转路径"
        name="url"
      >
        <a-input v-model:value="formValidate.url" />
      </a-form-item>
      <a-form-item
        label="操作按钮"
        name="buttonCode"
      >
        <a-select
          ref="select"
          v-model:value="formValidate.buttonCode"
        >
          <a-select-option value="">all</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="菜单编码"
        name="menuCode"
      >
        <a-input v-model:value="formValidate.menuCode" placeholder="无需填写，保存自动生成" disabled/>
      </a-form-item>
      <a-form-item
        label="顺序"
        name="sort"
      >
        <a-input v-model:value="formValidate.sort" placeholder="请填写顺序"/>
      </a-form-item>
      <a-form-item
        label="描述"
        name="menuDescribe"
      >
        <a-input v-model:value="formValidate.menuDescribe" placeholder="请输入菜单描述"/>
      </a-form-item>
      <a-form-item
        label="状态"
        name="menuStatus"
      >
        <a-radio-group v-model:value="formValidate.menuStatus">
          <a-radio :value="1">开启</a-radio>
          <a-radio :value="0">关闭</a-radio>
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

  const props = defineProps({
      modelValue: {
        type: Boolean,
        default: false
      },
      params: Object,
      menuList: Array
  })
  const emit = defineEmits(['update:modelValue', 'cancel', 'onSearch']);
  const dialogVisible = ref(false);
  const formRef = ref<FormInstance>();
  const formValidate: Ref<Record<string, any>> = ref({});
  const options = reactive({ title: '新增菜单' });
  const rules: any = {
    menuName: [{ required: true, trigger: 'blur', message: '请输入菜单名称' }],
    menuType: [{ required: true, trigger: 'change', message: '请选择菜单类型' }],
  };

	const handleOk = async (callback:Function) => {

  };
  
  const save = () => {
    formRef.value
    .validateFields()
    .then((values: any) => {
      console.log('formValidate:', formValidate.value);
      if (formValidate.value.oid) {
        formValidate.value = {
          menuDescribe: formValidate.value.menuDescribe,
          menuName: formValidate.value.menuName,
          menuStatus: formValidate.value.menuStatus,
          menuType: formValidate.value.menuType,
          oid: formValidate.value.oid,
          parentId: formValidate.value.parentId,
          sort: formValidate.value.sort,
          url: formValidate.value.url,
        }
        addOrUpdateAPI('editMenu');
      } else {
        addOrUpdateAPI('addMenu');
      }
    })
    .catch((info: any) => {
      console.log('Validate Failed:', info);
    });
  }

  const addOrUpdateAPI = (apiName: string) => {
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
    console.log('menuList', props.menuList);
    formValidate.value = {};
    if (props.params?.oid) {
      formValidate.value = { ...props.params };
      options.title = '编辑菜单';
    } else {
      options.title = '新增菜单';
    }
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