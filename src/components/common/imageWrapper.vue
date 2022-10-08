<template>
	<div class="clearfix">
		<a-upload
			:maxCount="1"
			v-model:file-list="fileList"
			action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
			list-type="picture-card"
			:beforeUpload="beforeUpload"
			:uploadFile="uploadFile"
			accept=".jpg,.png"
			@preview="handlePreview"
		>
			<div style="margin-top: 8px">上传图片</div>
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
const uploadFile = async (event: any) => {
	console.log('shanghcuan ', event);

	const file = new FormData();
	file.append('file', event.file);
	// const { path } = await api.resource.uploadFile(file);
	// state.ruleForm.businessLicense = path;
};
const previewVisible = ref(false);
const previewImage = ref('');

const fileList = ref<UploadProps['fileList']>([
	{
		uid: '-1',
		name: 'image.png',
		status: 'done',
		url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
	},
]);
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