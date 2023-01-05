<template>
	<div class="img-container">
		<a-upload-dragger v-if="isDragger"
			:maxCount="maxCount"
			v-model:file-list="fileList"
			list-type="picture-card"
			:beforeUpload="beforeUpload"
      :customRequest="uploadFile"
			accept=".pdf"
			@preview="handlePreview"
      @remove="removeImg"
      :disabled="disabled"
		>
      <template #[props.dynamicSlotName]="{ file, actions }">
        <slot name="customUpload" :file="file" :actions="actions"></slot>
      </template>
			<div>
        <slot></slot>
        <div v-if="!slotDefault">上传pdf</div>
      </div>
		</a-upload-dragger>
		<a-upload v-else
			:maxCount="maxCount"
			v-model:file-list="fileList"
			list-type="picture-card"
			:beforeUpload="beforeUpload"
      :customRequest="uploadFile"
			accept=".pdf"
			@preview="handlePreview"
      @remove="removeImg"
      :disabled="disabled"
		>
      <template #[props.dynamicSlotName]="{ file, actions }"> 
        <slot name="customUpload" :file="file" :actions="actions"></slot>
      </template>
			<div v-if="fileList!.length < maxCount">
        <slot></slot>
        <div>上传pdf</div>
      </div>
		</a-upload>
    
		<a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <a :href="previewImage">{{ pdfName }}</a>
		</a-modal>
	</div>
</template>
<script lang="ts" setup>
import { PlusOutlined } from '@ant-design/icons-vue';
import { defineComponent, ref, Ref } from 'vue';
import type { UploadProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { awsUploadFile, awsGetPreSignedUrl } from '@/utils/awsUpload';
import { getUserInfo } from '@/utils/util';

const props = defineProps({
	modelValue: {
		type: String,
	},
	maxCount: {
    type: Number,
    default: 99
  },
  disabled: {
    type: Boolean,
    default: false
  },
  isDragger: {
    type: Boolean,
    default: false
  },
  dynamicSlotName: {
    type: String,
    default: ''
  },
});
const pdfName = ref('合同附件')
const emit = defineEmits(['update:modelValue', 'result', 'remove']);
const userInfo = getUserInfo();
const slotDefault = !!useSlots().default;
const unHandleImage: Ref<string[]> = ref([]);
const tempData: Ref<string[]> = ref([]);

const getBase64 = (file: File) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
};
const beforeUpload = (file: any) => {
	const maxSize = 20 * 1024 * 1024;
	if (file.size > maxSize) {
		message.error('只能上传 20M 以下的文件');
		return false;
	}
	return true;
};

// 上传文件
const uploadFile = async (options: any) => {
    try {
      pdfName.value = options.file.name
      const { files } = await awsUploadFile({
        files: [options.file],
        onProgress: options.onProgress,
        businessType: userInfo.sysCompany?.businessType || 'form'
      });
      options.onSuccess(
        { success: true, msg: '上传成功', data: { filePath: files[0] } },
        { name: files[0], url: files[0] },
        files
      );
      tempData.value = unHandleImage.value.concat(files);
      emit('result', { success: true, msg: '上传成功', data: { filePath: files[0] } },
        { name: files[0], url: files[0] },
        files)
    return emit('update:modelValue', tempData.value?.join(','));
    } catch (e) {
      options.onError();
      options.status = 'error';
      fileList.value = fileList.value?.filter((ele: any) => ele.status == 'done');
      message.error('pdf上传失败');
      emit('result', { success: false, msg: '上传失败' })
    }
};
const previewVisible = ref(false);
const previewImage = ref('');
const fileList = ref<UploadProps['fileList']>([]);
//关闭预览
const handleCancel = () => {
	previewVisible.value = false;
};
const handlePreview = async (file: UploadProps['fileList'][number]) => {
	if (!file.url && !file.preview) {
		file.preview = (await getBase64(file.originFileObj)) as string;
	}
	previewImage.value = file.url || file.preview;
	previewVisible.value = true;
};
const removeImg = (file: any) => {
  emit('remove', {url: file.url, index: file.index});
  tempData.value.splice(Number(file.uid), 1);
  unHandleImage.value.splice(Number(file.uid), 1);
  setTimeout(() => {
    emit('update:modelValue', tempData.value?.join(','));
  }, 0);
  
}

const handleImage = async (val: any) => {
	fileList.value = val.split(',').map(async (item: any, index: any) => {
    if (item.indexOf('http:') === -1) {
      item = await awsGetPreSignedUrl(item);
    }
    return {
      uid: index.toString(),
      name: item,
      status: 'done',
      url: item,
    }
  })
  fileList.value = await Promise.all(fileList.value);
}

watch(
	() => props.modelValue,
	async (nVal) => {
    if (nVal) {
      unHandleImage.value = nVal?.split(',');
      tempData.value = nVal?.split(',');
      handleImage(nVal);
    }
	}
);
onMounted(() => {
  if (props.modelValue) {
    unHandleImage.value = props.modelValue?.split(',');
    tempData.value = props.modelValue?.split(',');
    handleImage(props.modelValue)
  };
})
const clearFileList = () => {
  fileList.value = []
}
defineExpose({
  clearFileList
})
</script>
<style lang="less" scoped>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
	font-size: 32px;
	color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
	margin-top: 8px;
	color: #666;
}
.img-container {
  span {
    display: flex;
  }
}
::v-deep(.ant-upload) {
  width: 102px;
  height: 102px;
  margin-right: 10px;
}
.file_box {
  display: inline-block;
  width: 104px;
  height: 104px;
  line-height: 88px;
  margin: 0 8px 8px 0;
  padding: 8px;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
}
</style>
