<template>
	<div class="addMore">
		<span @click="addMore">新增更多附件</span>
	</div>
	<div class="upload-file" v-for="item, index in fileUrl" :key="index">
		<div>
			<p v-if="item.attachmentType !== 4">{{item.attachmentTypeName}}</p>
			<div v-else>
				<!-- <p v-if="item.oid">{{item.attachmentName}}</p> -->
				<a-input style="margin: 10px 0; width: 316px;" v-model:value="item.attachmentName" placeholder="请输入合同名称" />
			</div>
			<Upload v-model="item.attachmentUrl" :max-count="1">
				<img src="@/assets/svg/upload.svg" alt="" />
				<div class="tips">点击或将文件拖拽到这里上传</div>
				<div class="extension">支持扩展名：.png .jpg</div>
			</Upload>
		</div>
		<!-- <a-button type="primary">签署合同</a-button> -->
	</div>
</template>
<script lang="ts" setup>
import Upload from '@/components/common/imageWrapper.vue';
import { useTravelStore } from '@/stores/modules/travelManagement';
const props = defineProps({
	onCheck: {
		type: Boolean,
	},
});

const emits = defineEmits(['onSuccess'])

const travelStore = useTravelStore();
const other = {
	attachmentName: '',
	attachmentType: 4,
	attachmentUrl: '',
	attachmentTypeName: '其他',
	oid: null
}
const fileUrl = computed(() => travelStore.attachmentList)

const addMore = () => {
	fileUrl.value.push(other)
}
console.log(fileUrl.value, 'fileUrl--------------')
watch(() => props.onCheck, (newVal) => {
	// console.log(newVal)

	travelStore.setFileInfo(fileUrl.value);
	const valid = fileUrl.value.some(it => it.attachmentType === 4 && !it.attachmentName)
	emits('onSuccess', {attachmentList: {valid: !valid, message: '请填写其他附件类型的名称', index: 5}})
	console.log(travelStore.attachmentList)
})
</script>
<style lang="less" scoped>
.addMore {
	display: flex;
	justify-content: flex-end;
	margin-right: 20px;
	span {
		display: inline-block;
		width: 124px;
		height: 32px;
		background-color: #36B374;
		border-radius: 2px;
		text-align: center;
		line-height: 32px;
		color: #fff;
		font-size: 14px;
		cursor: pointer;
	}
}
.upload-file {
	display: flex;
	align-items: flex-end;
	margin: 0 20px;
	border-bottom: 1px solid #f1f2f5;
	padding-bottom: 16px;
	&:last-of-type {
		border-bottom: none;
		margin-bottom: 100px;
	}
	button {
		margin-left: 56px;
	}
	p {
		color: #9da0a4;
		font-size: 16px;
	}
	.tips {
		color: #1e2226;
		font-size: 12px;
		margin: 20px 0 8px;
	}
	.extension {
		color: #c8c9cc;
		font-size: 12px;
	}
	::v-deep(.ant-upload-drag) {
		width: 318px;
		height: 190px;
		flex: 1;
		border: 1px solid #d5d5d5;
		border: 1px dashed #d3d4d6;
		background-color: #f9fafc;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	::v-deep(.ant-upload-btn ) {
		flex: 1;
		& > div {
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
		}
	}
	::v-deep(.ant-upload-list-picture-card-container) {
		width: 318px;
		height: 190px;
	}
}
</style>
