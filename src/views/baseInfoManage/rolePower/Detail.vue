<template>
	<BaseModal :title="options.title" v-model="modelValue" :onOk="handleOk">
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
        name="availableRange"
      >
      {{ formValidate.availableRange }}
      </a-form-item>
      <a-form-item
        label="状态"
        name="roleStatus"
      >
      {{ formValidate.roleStatus }}
      </a-form-item>
      <a-form-item
        label="角色权限"
        name="menuIds"
      >
      {{ formValidate.menuIds }}
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
		</template>
	</BaseModal>
</template>

<script lang="ts" setup>
  import { ref, Ref, computed, watch, toRefs, reactive } from 'vue';
	import BaseModal from '@/components/common/BaseModal.vue';

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
  const formValidate: Ref<Record<string, any>> = ref({});
  const options = reactive({ title: '查看角色' });

	const handleOk = async (callback:Function) => {

  };

  const init = async () => {
    console.log('params', props.params);
    formValidate.value = {};
    formValidate.value = { ...props.params };
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