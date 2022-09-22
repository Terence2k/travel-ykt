<template>
  <a-upload v-bind="$attrs" v-model:file-list="fileList" name="avatar" list-type="picture-card" class="avatar-uploader"
    :show-upload-list="true" action="https://www.mocky.io/v2/5cc8019d300000980a055e76" @preview="handlePreview"
    @change="handleChange" accept=".jpg,.jpeg,.png,.gif.JPG,.JPEG,.PNG,.bmp,.webp">
    <div v-if="previewImage">
      <a-modal :visible="previewVisible" :title="previewTitle" @cancel="handleCancel" :footer="null"
        width="fit-content">
        <img :src="previewImage" alt="img" class="image" />
      </a-modal>
    </div>
    <div v-if="fileList.length < props.imgNum">
      <loading-outlined v-if="loading"></loading-outlined>
      <plus-outlined v-else></plus-outlined>
      <div class="ant-upload-text">上传</div>
    </div>
  </a-upload>
</template>
<script lang="ts" setup>
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { defineComponent, ref } from 'vue';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
export interface Props {
  imgNum?: number,
  action?: string,
  uploadedFile?: string | []
}
const emits = defineEmits(['update:uploadedFile', 'uploaded'])
const props = withDefaults(defineProps<Props>(), {
  imgNum: 1,
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76"
})
const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');
/* function getBase64(img: Blob, callback: (base64Url: string) => void) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
} */
const fileList = ref([]);
const loading = ref<boolean>(false);
const imageUrl = ref<string>('');

const handleChange = (info: UploadChangeParam) => {
  if (info.file.status === 'uploading') {
    loading.value = true;
    return;
  }
  if (info.file.status === 'done') {
    // Get this url from response in real world.
    loading.value = false;
    // emits('uploaded', fileList)
    if (info.fileList.length != 0) {
      let arr: string[] = []
      info.fileList.forEach((item: any) => {
        arr.push(item.response.url)
      })
      emits('update:uploadedFile', arr)
      emits('uploaded')
    } else {
      emits('update:uploadedFile', '')
    }
  }
  if (info.file.status === 'error') {
    loading.value = false;
    message.error('上传失败！');
  }
};
/* const beforeUpload = (file: UploadProps['fileList'][number]) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}; */

function getBase641(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
const handlePreview = async (file: UploadProps['fileList'][number]) => {
  if (!file.url && !file.preview) {
    file.preview = (await getBase641(file.originFileObj)) as string;
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};
const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = '';
  previewImage.value = '';
};
</script>
<style scoped lang="scss">
.image {
  max-width: 100%;
}

.avatar-uploader>.ant-upload {
  width: 128px;
  height: 128px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>