<template>
	<div class="clearfix">
		<a-upload
			:maxCount="maxCount"
			v-model:file-list="fileList"
			list-type="picture-card"
			:beforeUpload="beforeUpload"
      :customRequest="uploadFile"
			accept=".jpg,.png"
			@preview="handlePreview"
      @remove="removeImg"
		>
			<div style="margin-top: 8px">
        上传图片
      </div>
		</a-upload>

		<a-modal :visible="previewVisible" title="预览图片" :footer="null" @cancel="handleCancel">
			<img alt="example" style="width: 100%" :src="previewImage" />
		</a-modal>
	</div>
</template>
<script lang="ts" setup>
import { PlusOutlined } from '@ant-design/icons-vue';
import { defineComponent, ref } from 'vue';
import type { UploadProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import awsUploadFile from '@/utils/awsUpload';
import { getUserInfo } from '@/utils/util';

const props = defineProps({
	modelValue: {
		type: String,
	},
	maxCount: {
    type: Number,
    default: 99
  },
});
const emit = defineEmits(['update:modelValue']);
const userInfo = getUserInfo();

const getBase64 = (file: File) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
};
const beforeUpload = (file: any) => {
	console.log(file, 'before');

	const maxSize = 20 * 1024 * 1024;
	if (file.size > maxSize) {
		message.error('只能上传 20M 以下的文件');
		return false;
	}

	return true;
};

// 上传文件
const uploadFile = async (options: any) => {
    console.log('options:', options)
    try {
      const { files } = await awsUploadFile({
        files: [options.file],
        onProgress: options.onProgress,
        businessType: userInfo.sysCompany.businessType
      });
      console.log('files', files);
      options.onSuccess(
        { success: true, msg: '上传成功', data: { filePath: files[0].url } },
        { name: files[0].name, url: files[0].url },
        files
      );
    return emit('update:modelValue', files?.map((item: any) => item.url));
    } catch (e) {
      console.log(e);
      options.onError(e);
    }
};
const previewVisible = ref(false);
const previewImage = ref('');

// const fileList = ref<UploadProps['fileList']>([
//   {
//     uid: '-1',
//     name: 'image.png',
//     status: 'done',
//     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
//   },
//   {
//     uid: '-2',
//     name: 'image.png',
//     status: 'done',
//     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
//   },
// ]);
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
  emit('update:modelValue', fileList.value?.map((item: any) => item.url));
  
}

watch(
	() => props.modelValue,
	async (nVal) => {
    console.log('modelValue:', nVal);
    
	}
);
onMounted(() => {
    console.log('modelValue:', props.modelValue);
})
</script>
<style>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
	font-size: 32px;
	color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
	margin-top: 8px;
	color: #666;
}
</style>
