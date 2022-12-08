<template>
	<BaseModal :title="options.title" v-model="dialogVisible" @close="handleOk">
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
        <a-select
          ref="select"
          placeholder="请选择可用范围"
          v-model:value="formValidate.availableRange"
        >
          <a-select-option v-for="item in optionTypeList" :value="item.codeValue">
            {{ item.name }}
          </a-select-option>
        </a-select>
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
      <a-collapse v-model:activeKey="activeKey" :bordered="false" v-if="dialogVisible">
        <a-collapse-panel key="1" header="一卡通PC端">
          <a-tree
            v-model:checkedKeys="pcCheckedKeys"
            checkable
            :selectable="false"
            :tree-data="pcMenuTreeDate"
            :field-names="fieldNames"
          >
          </a-tree>
        </a-collapse-panel>
        <a-collapse-panel key="2" header="一卡通App端">
          <a-tree
            v-model:checkedKeys="appCheckedKeys"
            checkable
            :selectable="false"
            :tree-data="appMenuTreeDate"
            :field-names="fieldNames"
          >
          </a-tree>
        </a-collapse-panel>
      </a-collapse>
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
  import { convertTree, checkList } from '@/utils/util';
  import api from '@/api';
  import { message } from 'ant-design-vue';
  import type { TreeProps } from 'ant-design-vue';

  const pcCheckedKeys = ref<string[]>([]);
  const pcMenuTreeDate: Ref<Array<any>> = ref([]);
  const pcMenuIdsInfo: Ref<Array<any>> = ref([]);

  const appCheckedKeys = ref<string[]>([]);
  const appMenuTreeDate: Ref<Array<any>> = ref([]);
  const appMenuIdsInfo: Ref<Array<any>> = ref([]);

  const activeKey = ref(['']);

  watch(pcCheckedKeys, () => {
    console.log('pcCheckedKeys:', pcCheckedKeys.value);
    // 处理通过子级id查找返回父级id（只要选了子级就要返回父级无论有无选中父级）
    let arr = new Set();
    pcCheckedKeys.value.forEach((item: any) => {
      checkList( pcMenuTreeDate.value, item ).forEach((it: any) => arr.add(it));
    });
    console.log('arr:', arr);
    
    pcMenuIdsInfo.value = Array.from(arr);
  });

  watch(appCheckedKeys, () => {
    console.log('appCheckedKeys:', appCheckedKeys.value);
    // 处理通过子级id查找返回父级id（只要选了子级就要返回父级无论有无选中父级）
    let arr = new Set();
    appCheckedKeys.value.forEach((item: any) => {
      checkList( appMenuTreeDate.value, item ).forEach((it: any) => arr.add(it));
    });
    console.log('arr:', arr);
    appMenuIdsInfo.value = Array.from(arr);
  });
  
  const props = defineProps({
      modelValue: {
        type: Boolean,
        default: false
      },
      params: Object,
      optionTypeList: Array
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
    availableRange: [{ required: true, trigger: 'change', message: '请选择可用范围' }],
    menuIds: [{ required: true, trigger: 'change', message: '请选择角色权限' }],
    roleCode: [{ required: true, trigger: 'blur', message: '请输入角色编码' }],
  };

  const fieldNames: TreeProps['fieldNames'] = {
    key: 'value',
    title: 'label',
  };

  const handleOk = () => {
    emit('cancel');
  };
  
  const save = () => {
    formValidate.value.menuIds = pcMenuIdsInfo.value.concat(appMenuIdsInfo.value)
    formRef.value
    .validateFields()
    .then((values: any) => {
      if (formValidate.value.oid) {
        formValidate.value = {
          oid: formValidate.value.oid,
          availableRange: formValidate.value.availableRange,
          menuIds: formValidate.value.menuIds,
          roleCode: formValidate.value.roleCode,
          roleDescribe: formValidate.value.roleDescribe,
          roleName: formValidate.value.roleName,
          roleStatus: formValidate.value.roleStatus,
        };
        addOrUpdateAPI('editRole');
      } else {
        addOrUpdateAPI('addRole');
      }
    })
    .catch((info: any) => {
      console.log('Validate Failed:', info);
    });
  }

  //深度查找menuTreeDate 找出已有权限的父级菜单, 如果所属子菜单都有权限就推进menuIdsInfo去渲染权限树
  // const findDeepMenu = (menuList: any, oid: any, length?: any) => {
  //   let res = menuList.find((it: any) => it.value == oid);
  //   if(res) {
  //     // 如果父级菜单全选则选中
  //     if (res.children?.length == length) {
  //       checkedKeys.value.push(oid);
  //     }
  //   } else {
  //     menuList.forEach((item: any) => {
  //       if (item.children?.length) {
  //         findDeepMenu(item.children, oid);
  //       }
  //     })
  //   }
  // }

  const getDetailMenuIds = (data: any, isPc: boolean) => {
    data.forEach((item: any) => {
      if (item.childMenuList?.length) {
        getDetailMenuIds(item.childMenuList, isPc);
      } else {
        isPc ? pcMenuIdsInfo.value.push(item.oid) : appMenuIdsInfo.value.push(item.oid);
      }
      // menuIdsInfo.value = [159]
      
    })
  }

  const getDetail = async (id: number) => {
    await api.roleDetail(id).then((res: any) => {
      formValidate.value = res;
      console.log('角色权限菜单：', res.roleMenu);
      getDetailMenuIds(res.roleMenu.filter((item: any) => item.systemMark === 0), true);
      getDetailMenuIds(res.roleMenu.filter((item: any) => item.systemMark === 1), false);
      pcCheckedKeys.value = pcMenuIdsInfo.value;
      appCheckedKeys.value = appMenuIdsInfo.value;
    }).catch((err: any) => {
      console.error(err);
    })
  }

  const addOrUpdateAPI = (apiName: string) => {
    api[apiName]({...formValidate.value}).then((res: any) => {
      message.success('保存成功');
      formRef.value.resetFields();
      console.log('reset formValidate: ', toRaw(formValidate));
      emit('cancel');
      emit('onSearch');
    }).catch((err: any) => {
      console.error(err);
    })
  }

  const getMenuList = async () => {
    const res = await api.menuList();
    let pcMenu = res.filter((item: any) => item.systemMark === 0);
    let appMenu = res.filter((item: any) => item.systemMark === 1);
    ///转换树
      // pc端
      pcMenuTreeDate.value = convertTree(pcMenu, {
        value: 'oid',
        label: 'menuName',
        children: 'children',
      });
      // App端
      appMenuTreeDate.value = convertTree(appMenu, {
        value: 'oid',
        label: 'menuName',
        children: 'children',
      });
      
    if (props.params?.oid) {
      await getDetail(props.params.oid);
    }
  }

  const init = async () => {
    pcCheckedKeys.value = [];
    appCheckedKeys.value = [];
    pcMenuIdsInfo.value = [];
    appMenuIdsInfo.value = [];
    formValidate.value = {
      roleStatus: 1
    };
    if (props.params?.oid) {
      options.title = '编辑角色';
    } else {
      options.title = '新增角色';
    }
  }

  watch(() => props.modelValue, async (nVal) => {
    dialogVisible.value = nVal;
    if (dialogVisible.value) {
      await init();
      await getMenuList();
    }
	})
  
  watch(dialogVisible, nVal => {
    emit('update:modelValue', nVal);
  });
</script>

<style>

</style>