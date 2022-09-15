<template>
  <!-- 
    @onOk = "handleOk"
    @onCancel = "visible = false" -->
  <Modal
    v-model:visible = "visible"
    :maskClosable = "false"
    :width="width"
    :wrapClassName="full ? $style['full-modal'] : undefined"
  >
    <slot></slot>
    <template #footer>
      <div v-if="!slotFooter" class="default-footer">
        <a-button class="btn" type="primary" @click="handleOk" :loading="confirmLoading">{{text.confirm}}</a-button>
        <a-button class="btn" @click="visible = false">{{text.cancel}}</a-button>
      </div>
      <slot name="footer"></slot>
    </template>
  </Modal>
</template>

<script lang="ts" setup>
import { ref } from '@vue/reactivity';
import { message, Modal } from 'ant-design-vue';
import { watch } from '@vue/runtime-core';
import _ from 'lodash';
import { useCssModule } from '@vue/runtime-dom';
import { useSlots } from "vue";

  const emits = defineEmits(['update:modelValue', 'close']);
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    onOk: {
      type: Function
    },
    width: {
      type: [String, Number ],
      default: '540px'
    },
    full: {
      type: Boolean,
      default: true
    },
    text: {
      type: Object,
      default: {
        confirm: '保存',
        cancel: '取消'
      }
    }
  })
  const visible = ref(false);
  const confirmLoading = ref(false);
  const slotFooter = !!useSlots().footer;
  const { modelValue } = toRefs(props);
  const $style = useCssModule();

  watch(visible, val => {
    emits('update:modelValue', val)
    !val && emits('close')
  });
  watch(modelValue, (nVal: boolean) => {
    visible.value = nVal;
  });
  const handleOk = async () => {
    if (!_.isFunction(props.onOk)) {
      console.log('isFunction')
      visible.value = false;
    } else {
      try {
        confirmLoading.value = true;
        if (props.onOk.length === 0) {
          await props.onOk();
          confirmLoading.value = false;
          visible.value = false;
          console.log('props.onOk', props.onOk.length)
        } else {
          props.onOk((err:any) => {
            confirmLoading.value = false;
            if (err === false) {
              return;
            } else if (err) {
              message.error(err.message);
            } else {
              visible.value = false;
            }
          });
        }
      } catch (err:any) {
        confirmLoading.value = false;
        if (err !== false) {
          message.error(err.message);
        }
      }
    }
  };
</script>

<style lang="less" module>
  .full-modal {
    :global {
      top: 50%;
      transform: translateY(-50%);
      .ant-modal-header {
        border-bottom: none;
        padding: 22px 24px 19px;
        .ant-modal-title {
          font-size: 16px;
          font-weight: bold;
          color: #1E2226;
        }
      }
      .ant-modal-footer {
        border-top: none;
        padding: 16px 24px;
        .ant-btn {
          border-radius: 2px;
          width: 76px;
          height: 40px;
        }
      }
    }
  }
  
</style>