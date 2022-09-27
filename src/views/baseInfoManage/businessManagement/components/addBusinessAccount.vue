<template>
  <CommonModal :visible="props.modalVisible" title="新增企业" @cancel="cancel" @close="cancel" @conform="save"
    :loading="loading">
    <businessLoginForm ref="businessLoginRef" :model="form"></businessLoginForm>
  </CommonModal>
</template>

<script setup lang="ts">
import api from '@/api';
import CommonModal from '@/views/baseInfoManage/dictionary/components/CommonModal.vue';
import businessLoginForm from '@/views/login/businessLoginForm.vue';
import { message } from 'ant-design-vue';
export interface Props {
  modalVisible?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  modalVisible: false,
})
const emit = defineEmits(['update:modalVisible','success'])
const businessLoginRef = ref()
const form = reactive({
  businessType: undefined,
  name: '',
  creditCode: '',
  phone: '',
  contactName: '',
  provinceId: '',
  cityId: '',
  areaId: '',
  businessLicenseUrl: undefined,
  account: '',
  region: [],
});
const loading = ref(false)
const cancel = () => {
  emit('update:modalVisible', false)
  businessLoginRef.value.restForm()
}
const save = () => {
  businessLoginRef.value.validate().then(async () => {
    loading.value = true;
    api.companyRegister(form).then((res: any) => {
      if (res == '提交成功，请耐心等待审核通过!') {
        message.success(res);
        cancel()
        emit('success')
      } else {
        message.error(res);
      }
    }).catch((err: string) => {
      console.log(err)
    })
    loading.value = false;
  })
    .catch((err: string) => {
      console.log('error', err);
    });
}
</script>

<style scoped lang="scss">

</style>