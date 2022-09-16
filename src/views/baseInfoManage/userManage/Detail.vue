<template>
	<BaseModal :title="options.title" v-model="modelValue" :onOk="handleOk">
		<a-form
      :model="formValidate"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 16, offset: 1 }"
      labelAlign="left"
    >
      <a-form-item
        label="用户名称"
        name="username"
      >
      {{ formValidate.username }}
      </a-form-item>
      <a-form-item
        label="账号"
        name="account"
      >
      {{ formValidate.account }}
      </a-form-item>
      <a-form-item
        label="手机号码"
        name="mobile"
      >
      {{ formValidate.mobile }}
      </a-form-item>
      <a-form-item
        label="所属角色"
        name="roleIds"
      >
      <span v-for="item, index in formValidate.roleList">
      {{`${item.roleName}${index == formValidate.roleList.length - 1? '' : '，' }`}}</span>
      </a-form-item>
      <a-form-item
        label="状态"
        name="userStatus"
      >
      {{ formValidate.userStatus }}
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
      roleList: Array
  })
  const emit = defineEmits(['update:modelValue', 'cancel', 'onSearch']);
  const dialogVisible = ref(false);
  const formValidate: Ref<Record<string, any>> = ref({});
  const options = reactive({ title: '查看用户' });

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