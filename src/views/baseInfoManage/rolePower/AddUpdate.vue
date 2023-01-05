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
      <a-collapse v-model:activeKey="activeKey" :bordered="false" v-if="collapseVisible">
        <a-collapse-panel key="1" header="一卡通PC端" :forceRender="true">
          <el-tree
              ref="pcMenutree"
              node-key="value"
              :default-checked-keys="pcCheckedKeys"
              :expand-on-click-node="false"
              :props="defaultProps"
              show-checkbox
              check-strictly
              :data="pcMenuTreeData"
              @check="handCheck" 
              @check-change="checkChange" 
            ></el-tree>
        </a-collapse-panel>
        <a-collapse-panel key="2" header="一卡通App端" :forceRender="true">
          <el-tree
              ref="appMenutree"
              node-key="value"
              :default-checked-keys="appCheckedKeys"
              :expand-on-click-node="false"
              :props="defaultProps"
              show-checkbox
              check-strictly
              :data="appMenuTreeData"
              @check="handCheck"
              @check-change="checkChange" 
            ></el-tree>
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
  import { ref, Ref, watch, reactive } from 'vue';
	import BaseModal from '@/components/common/BaseModal.vue';
  import type { FormInstance } from 'ant-design-vue';
  import { convertTree } from '@/utils/util';
  import api from '@/api';
  import { message } from 'ant-design-vue';
  
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
  const collapseVisible = ref(false);
  const formRef = ref<FormInstance>();
  const formValidate: Ref<Record<string, any>> = ref({});
  const options = reactive({ title: '新增角色' });
  const rules: any = {
    roleName: [{ required: true, trigger: 'blur', message: '请输入角色名称' }],
    roleStatus: [{ required: true, trigger: 'change', message: '请选择角色状态' }],
    availableRange: [{ required: true, trigger: 'change', message: '请选择可用范围' }],
    menuIds: [{ required: true, trigger: 'change', message: '请选择角色权限' }],
    roleCode: [{ required: true, trigger: 'blur', message: '请输入角色编码' }],
  };
  
  const defaultProps = {
      label: 'label',
      children: 'children'
  }
  
  const pcMenutree = ref();
  const appMenutree = ref();

  const pcCheckedKeys = ref<string[]>([]);
  const pcMenuTreeData: Ref<Array<any>> = ref([]);

  const appCheckedKeys = ref<string[]>([]);
  const appMenuTreeData: Ref<Array<any>> = ref([]);

  const activeKey = ref([]);
  
  const handCheck = (data: any, node: any) => {
    console.log('handCheckdata:', data);
    console.log('handChecknode:', node);
    hanleCheck(data, node);
  }

  const hanleCheck = (data: any, node: any) => {

    // 获取当前节点是否被选中
    const isChecked = data.model.systemMark === 0 ? pcMenutree.value.getNode(data).checked : appMenutree.value.getNode(data).checked;
    // 如果当前节点被选中，则遍历下级子节点并选中，如果当前节点取消选中，则遍历下级节点并取消
    if (isChecked) {
      // 判断该节点是否有下级节点，如果有那么遍历设置下级节点为选中
      data.children && data.children.length > 0 && setChildreChecked(data.children, true)
    } else {
      // 如果节点取消选中，则取消该节点下的子节点选中
      data.children && data.children.length > 0 && setChildreChecked(data.children, false)
    }
  }
  const setChildreChecked = (node: any, isChecked: any) => {
    node.forEach((item: any) => {
      console.log('item:', item);
      
      item.children && item.children.length > 0 && setChildreChecked(item.children, isChecked)
      // 修改勾选状态
      item.model.systemMark === 0 ? pcMenutree.value.setChecked(item.value, isChecked) : appMenutree.value.setChecked(item.value, isChecked);
    })
  }

  const checkChange = (data: any, checked: any, indeterminate: any) => {
    // console.log(data, checked, indeterminate);
    // 选中全部子节点，父节点也默认选中，但是子节点再次取消勾选或者全部子节点取消勾选也不会影响父节点勾选状态
    let checkNode = data.model.systemMark === 0 ? pcMenutree.value.getNode(data) : appMenutree.value.getNode(data);//获取当前节点
    console.log('checkNode:', checkNode);
    console.log('checkNode.parent:', checkNode.parent);
    // 勾选部分子节点，父节点变为半选状态
    if (checkNode.parent && checkNode.parent.childNodes.some((ele: any) => ele.checked || ele.indeterminate) ) {
      checkNode.parent.indeterminate = true
    }
    // 勾选全部子节点，父节点变为全选状态
    if (checkNode.parent && checkNode.parent.childNodes.every((ele: any) => ele.checked)) {
      checkNode.parent.checked = true
      checkNode.parent.indeterminate = false
    }
    // 如果取消所有第二节点的勾选状态，则第一层父节点也取消勾选
    // if (checkNode.level === 2 && checkNode.parent.childNodes.every(ele => !ele.checked && !ele.indeterminate)) {
    //   console.log('取消父节点')
    //   checkNode.parent.checked = false
    //   checkNode.parent.indeterminate = false
    // }
  }

  const handleOk = () => {
    emit('cancel');
  };
  
  const save = () => {
    formValidate.value.menuIds = getCheckedKeys();
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
  const findDeepMenu = (menuList: any, oid: any, length?: any, isPc?: boolean) => {
    let res = menuList.find((it: any) => it.value == oid);
    if(res) {
      isPc ? pcCheckedKeys.value.push(oid) : appCheckedKeys.value.push(oid);
    } else {
      menuList.forEach((item: any) => {
        if (item.children?.length) {
          findDeepMenu(item.children, oid, length, isPc);
        }
      })
    }
  }

  const getDetailMenuIds = (data: any, isPc: boolean) => {
    data.forEach((item: any) => {
      findDeepMenu(isPc ? pcMenuTreeData.value : appMenuTreeData.value, item.oid, item.childMenuList?.length, isPc);
      if (item.childMenuList?.length) {
        getDetailMenuIds(item.childMenuList, isPc);
      }
    })
  }

  const getDetail = async (id: number) => {
    await api.roleDetail(id).then((res: any) => {
      formValidate.value = res;
      console.log('角色权限菜单：', res.roleMenu);
      getDetailMenuIds(res.roleMenu.filter((item: any) => item.systemMark === 0), true);
      getDetailMenuIds(res.roleMenu.filter((item: any) => item.systemMark === 1), false);
    }).catch((err: any) => {
      console.error(err);
    })
  }

  const getCheckedKeys = () => {
    let pcIds = [...new Set(pcMenutree.value.getCheckedKeys().concat(pcMenutree.value.getHalfCheckedKeys()))];
    let appIds = [...new Set(appMenutree.value.getCheckedKeys().concat(appMenutree.value.getHalfCheckedKeys()))];
    return pcIds.concat(appIds);
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
      pcMenuTreeData.value = convertTree(pcMenu, {
        value: 'oid',
        label: 'menuName',
        children: 'children',
      });
      // App端
      appMenuTreeData.value = convertTree(appMenu, {
        value: 'oid',
        label: 'menuName',
        children: 'children',
      });
      
    if (props.params?.oid) {
      await getDetail(props.params.oid);
    }
    collapseVisible.value = true;
  }

  const init = async () => {
    activeKey.value = [];
    pcCheckedKeys.value = [];
    appCheckedKeys.value = [];
    pcMenuTreeData.value = [];
    appMenuTreeData.value = [];
    collapseVisible.value = false;
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
  
  watch(collapseVisible, nVal => {
    if (nVal) {
      setTimeout(() => {
        // 如父节点的子节点不是全选则设置父节点为半选中
        pcMenutree.value.getCheckedNodes().forEach((item: any) => {
          let node = pcMenutree.value.getNode(item);
          if (node.childNodes.some((el: any) => !el.checked)) {
            node.indeterminate = true;
          }
        })
        appMenutree.value.getCheckedNodes().forEach((item: any) => {
          let node = appMenutree.value.getNode(item);
          if (node.childNodes.some((el: any) => !el.checked)) {
            node.indeterminate = true;
          }
        })
      }, 0);
    }
  });
</script>


<style lang="less" scoped>
:deep(.el-checkbox__input.is-indeterminate .el-checkbox__inner) {
  background-color: #36B374;
  border-color: #36B374;
}
:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #36B374;
  border-color: #36B374;
}
:deep(.el-checkbox__inner:hover) {
  border-color: #36B374;
}
</style>