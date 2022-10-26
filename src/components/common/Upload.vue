<template>
	<a-upload-dragger
		v-model:file-list="fileList"
		name="avatar"
		list-type="picture-card"
		class="avatar-uploader"
		:show-upload-list="false"
		action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
		:before-upload="beforeUpload"
		@change="handleChange"
	>
		<img v-if="imageUrl" :src="imageUrl" alt="avatar" />
		<div v-else>
			<loading-outlined v-if="loading"></loading-outlined>

			<div v-else>
				<plus-outlined v-if="!slotDefalut"></plus-outlined>
				<slot></slot>
			</div>
		</div>
	</a-upload-dragger>
</template>
<script lang="ts" setup>
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';

function getBase64(img: Blob, callback: (base64Url: string) => void) {
	const reader = new FileReader();
	reader.addEventListener('load', () => callback(reader.result as string));
	reader.readAsDataURL(img);
	console.log(reader);
}
const slotDefalut = !!useSlots().default;
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
		getBase64(info.file.originFileObj!, (base64Url: string) => {
			imageUrl.value = base64Url;
			loading.value = false;
		});
	}
	if (info.file.status === 'error') {
		loading.value = false;
		message.error('upload error');
	}
};
const beforeUpload = (file: any) => {
	const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
	if (!isJpgOrPng) {
		message.error('You can only upload JPG file!');
	}
	const isLt2M = file.size / 1024 / 1024 < 2;
	if (!isLt2M) {
		message.error('Image must smaller than 2MB!');
	}
	return isJpgOrPng && isLt2M;
};
</script>
<style lang="less" scoped>
:v-deep(.ant-upload-drag) {
	width: 318px;
	height: 190px;
	border: 1px solid #d5d5d5;
}
:v-deep(.ant-upload-btn) {
	& > div {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}
</style>
