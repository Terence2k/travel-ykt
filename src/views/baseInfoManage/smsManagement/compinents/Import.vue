<template>
	<BaseModal title="导入名单" v-model="dialogVisible">
		<a-upload
			v-model:file-list="state.excel"
			name="file"
			accept=".xlsx"
			:maxCount="1"
			:multiple="false"
			:action="action"
			:headers="hearders"
			@change="handleChange"
			:data="{templateOid:state.templateOId}"
		>
			<a-button>
				<upload-outlined></upload-outlined>
				点击上传excel
			</a-button>
		</a-upload>
		<template v-slot:footer>
			<a-button @click="cancel">取消</a-button>
			<a-button type="primary" @click="cancel">确定</a-button>
		</template>
	</BaseModal>
</template>

<script lang="ts" setup>
import { ref, Ref, computed, watch, toRefs, reactive } from 'vue';
import BaseModal from '@/components/common/BaseModal.vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import api from '@/api';
import { getUserInfo } from '@/utils/util';
import { message } from 'ant-design-vue/es';
const router = useRouter();

const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	params: Object,
});

const state = reactive({
	templateOId: '' as any,
	excel: [] as any,
	param: {
			templateId: '' as any,
			pageNo: 1,
			pageSize: 10,
		},
});
const useinfo = getUserInfo();
const emit = defineEmits(['update:modelValue', 'onSearch']);
const dialogVisible = ref(false);
const init = async () => {
	state.templateOId = props.params;
	state.param.templateId = props.params
};

const cancel = async () => {
	dialogVisible.value = false
	// router.go(0)
	emit('onSearch')
};


const hearders = { authorization: useinfo.authorization };
const action = '/ykt/customer-service/public/api/smsTemplate/importSmsSendPerson';
interface FileItem {
	uid: string;
	name?: string;
	status?: string;
	response?: string;
	url?: string;
}
interface FileInfo {
	file: FileItem;
	fileList: FileItem[];
}

const handleChange = (info: FileInfo) => {
	if (info.file.status !== 'uploading') {
		console.log(info.file, info.fileList);
	}
	if (info.file.status === 'done') {
		message.success(`${info.file.name} 上传成功`);
	} else if (info.file.status === 'error') {
		message.error(`${info.file.name}  上传失败`);
	}
};

watch(
	() => props.modelValue,
	async (nVal) => {
		dialogVisible.value = nVal;
		if (dialogVisible.value) {
			await init();
		}
	}
);

watch(dialogVisible, (nVal) => {
	emit('update:modelValue', nVal);
});
</script>

<style lang="less" scoped>
.upload-file {
	margin: 0 auto;
	border-bottom: 1px solid #f1f2f5;
	padding-bottom: 16px;
	&:last-of-type {
		border-bottom: none;
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
	::v-deep(.ant-upload-btn) {
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
