<template>
	<BaseModal :title="options.title" v-model="dialogVisible">
		<a-form
      :model="formValidate"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 16, offset: 1 }"
      labelAlign="left"
    >
      <a-form-item
        label="角色名称"
        name="roleName"
      >
      {{ formValidate.roleName }}
      </a-form-item>
      <a-form-item
        label="可用范围"
        name="availableRangeName"
      >
      {{ formValidate.availableRangeName }}
      </a-form-item>
      <a-form-item
        label="状态"
        name="roleStatusName"
      >
      {{ formValidate.roleStatusName }}
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
      {{ formValidate.roleCode }}
      </a-form-item>
      <a-form-item
        label="角色描述"
        name="roleDescribe"
      >
      {{ formValidate.roleDescribe }}
      </a-form-item>
      <a-form-item
        label="编辑人"
        name="lastUpdaterName"
      >
      {{ formValidate.lastUpdaterName }}
      </a-form-item>
      <a-form-item
        label="编辑时间"
        name="lastUpdateTime"
      >
      {{ formValidate.lastUpdateTime }}
      </a-form-item>
    </a-form>
		<template v-slot:footer>
			<a-button @click="dialogVisible = false">取消</a-button>
			<!-- <a-button @click="getCheckedKeys">确定</a-button> -->
		</template>
	</BaseModal>
</template>

<script lang="ts" setup>
  import { ref, Ref, watch, reactive } from 'vue';
	import BaseModal from '@/components/common/BaseModal.vue';
  import api from '@/api';
  import { convertTree } from '@/utils/util';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    params: Object,
  })
  const defaultProps = {
    label: 'label',
    children: 'children'
  }
  const emit = defineEmits(['update:modelValue', 'cancel', 'onSearch']);
  const dialogVisible = ref(false);
  const collapseVisible = ref(false);
  const formValidate: Ref<Record<string, any>> = ref({});
  const options = reactive({ title: '查看角色' });
  
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

  //查找menuTreeDate 找出已有权限的父级菜单, 如果所属子菜单都有权限就推进menuIdsInfo去渲染权限树
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
      // menuIdsInfo.value = [159]
      
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
    console.log('pcMenutree.getCheckedKeys:', pcMenutree.value.getCheckedKeys());
    console.log('pcMenutree.getHalfCheckedKeys:', pcMenutree.value.getHalfCheckedKeys());
    
    console.log('appMenutree.getCheckedKeys:', appMenutree.value.getCheckedKeys());
    console.log('appMenutree.getHalfCheckedKeys:', appMenutree.value.getHalfCheckedKeys());
  }

  const init = async () => {
    activeKey.value = [];
    pcCheckedKeys.value = [];
    appCheckedKeys.value = [];
    pcMenuTreeData.value = [];
    appMenuTreeData.value = [];
    collapseVisible.value = false;
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