<template>
  <a-modal v-bind="$attrs" centered>
    <template #title v-if="props.title">
      <span class="modal_title">{{ props.title }}</span>
    </template>
    <slot></slot>
    <template #footer>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk" v-show="props.isConform">{{
      props.conformText }}</a-button>
      <a-button key="back" @click="handleCancel" v-show="props.isCancel">{{ props.cancelText }}</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
export interface Props {
  title?: string
  loading?: boolean
  cancelText?: string
  conformText?: string
  isConform?: boolean
  isCancel?: boolean
}
// const props = defineProps<Props>()
const props = withDefaults(defineProps<Props>(), {
  loading: false,
  cancelText: "取消",
  conformText: "保存",
  isConform: true,
  isCancel: true
})
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'conform'): void
}>()
const handleOk = () => {
  emit('conform')
}
const handleCancel = () => {
  emit('close')
}
</script>

<style scoped lang="scss">
.modal_title {
  font-size: 16px;
  font-family: Microsoft YaHei UI;
  font-weight: bold;
  color: #262626;
}
</style>