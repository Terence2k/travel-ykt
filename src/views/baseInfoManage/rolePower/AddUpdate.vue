<template>
	<BaseModal :title="options.title" v-model="modelValue">
		<a-form
      ref="formRef"
      :model="formValidate"
      :rules="rules"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 16, offset: 1 }"
      labelAlign="left"
    >
      <a-form-item
        label="角色名称"
        name="roleName"
      >
        <a-input v-model:value="formValidate.roleName" placeholder="请输入角色名称"/>
      </a-form-item>
      <a-form-item
        label="可用范围"
        name="availableRange"
      >
        <a-input v-model:value="formValidate.availableRange" placeholder="请选择可用范围"/>
      </a-form-item>
      <a-form-item
        label="状态"
        name="roleStatus"
      >
        <a-radio-group v-model:value="formValidate.roleStatus">
          <a-radio :value="1">开启</a-radio>
          <a-radio :value="0">关闭</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        label="角色权限"
        name="menuIds"
      >
        <a-tree
          v-model:checkedKeys="checkedKeys"
          checkable
          :tree-data="menuTreeDate"
          :field-names="fieldNames"
        >
        </a-tree>
      </a-form-item>
      <a-form-item
        label="角色编码"
        name="roleCode"
      >
        <a-input v-model:value="formValidate.roleCode" placeholder="请输入角色编码"/>
      </a-form-item>
      <a-form-item
        label="角色描述"
        name="roleDescribe"
      >
        <a-input v-model:value="formValidate.roleDescribe" placeholder="请输入角色描述"/>
      </a-form-item>
      <a-form-item
        label="编辑人"
        name="lastUpdaterName"
      >
        <a-input v-model:value="formValidate.lastUpdaterName" disabled placeholder="无需填写，保存自动生成"/>
      </a-form-item>
      <a-form-item
        label="编辑时间"
        name="lastUpdateTime"
      >
        <a-input v-model:value="formValidate.lastUpdateTime" disabled placeholder="无需填写，保存自动生成"/>
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
  import { convertTree } from '@/utils/util';
  import api from '@/api';
  import { message } from 'ant-design-vue';
  import type { TreeProps } from 'ant-design-vue';

  const checkedKeys = ref<string[]>(['0-0-0', '0-0-1']);
  const menuTreeDate: Ref<Array<any>> = ref([]);

  watch(checkedKeys, () => {
    formValidate.value.menuIds = Object.values(checkedKeys.value);
  });
  
  const props = defineProps({
      modelValue: {
        type: Boolean,
        default: false
      },
      params: Object,
  })
  const emit = defineEmits(['update:modelValue', 'cancel', 'onSearch']);
  const dialogVisible = ref(false);
  const formRef = ref<FormInstance>();
  const formValidate: Ref<Record<string, any>> = ref({});
  const options = reactive({ title: '新增角色' });
  const rules: any = {
    roleName: [{ required: true, trigger: 'blur', message: '请输入角色名称' }],
    mobile: [{ required: true, trigger: 'blur', message: '请输入可用范围' }],
    roleStatus: [{ required: true, trigger: 'change', message: '请选择角色状态' }],
    availableRange: [{ required: true, trigger: 'blur', message: '请选择可用范围' }],
    menuIds: [{ required: true, trigger: 'change', message: '请选择角色权限' }],
  };
  

  const fieldNames: TreeProps['fieldNames'] = {
    key: 'value',
    title: 'label',
  };
  
  const save = () => {
    formRef.value
    .validateFields()
    .then((values: any) => {
      console.log('formValidate.value:', formValidate.value);
      
      // if (formValidate.value.oid) {
      //   addOrUpdateAPI('editUser');
      // } else {
      //   addOrUpdateAPI('addUser');
      // }
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

  const getMenuList = () => {
    api.menuList().then((res: any) => {
      console.log('res:', res);
      
      ///转换树
      menuTreeDate.value = convertTree(res, {
        value: 'oid',
        label: 'menuName',
        children: 'children',
      });
      console.log('menuTreeDate:', menuTreeDate.value);
    })
  }

  const init = async () => {
    console.log('params', props.params);
    formValidate.value = {};
    if (props.params?.oid) {
      formValidate.value = { ...props.params };
      options.title = '编辑角色';
    } else {
      options.title = '新增角色';
    }
  }

  onMounted(() => {
    getMenuList();
  })

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