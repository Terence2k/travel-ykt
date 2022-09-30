<template>
	<BaseModal :modelValue="modelValue" title="审核" width="900px" @cancel="cancel">
		<a-form ref="formRef" :model="formValidate" :label-col="{ span: 4 }" :wrapper-col="{ flex: 16 }" labelAlign="left">
			<a-form-item label="下架日期" name="menuType">
				<div v-for="(timeItem, index) in formValidate.data.timeList" :key="index" class="time-item">
					<a-date-picker :show-time="{ format: 'HH:mm' }" v-model:value="timeItem.start" />
					至
					<a-date-picker :show-time="{ format: 'HH:mm' }" v-model:value="timeItem.end" />
					<a-button type="primary" v-if="formValidate.data.timeList.length > 1" danger @click="del(index)">删除</a-button>
				</div>
			</a-form-item>
			<div class="btn-wrapper">
				<a-button type="primary" @click="addTimeList">添加</a-button>
			</div>
			<!-- <a-form-item label="下架时段" name="menuType">
				<a-date-picker :show-time="{ format: 'HH:mm' }" v-model:value="formValidate.data.time" />
				至
				<a-date-picker :show-time="{ format: 'HH:mm' }" v-model:value="formValidate.data.time" />
			</a-form-item> -->
			<a-form-item label="原因" name="menuType">
				<a-textarea v-model:value="formValidate.data.reason" placeholder="请输入原因" :rows="4" />
			</a-form-item>
		</a-form>
		<div class="btn-wrapper">
			<a href="javascript:;" @click="toHistoryPage">查看历史下架了记录</a>
		</div>
		<template v-slot:footer>
			<div class="footer-wrapper">
				<a-button type="primary" @click="apply">申请</a-button>
				<a-button @click="dialogVisible = false">取消</a-button>
			</div>
		</template>
	</BaseModal>
</template>

<script lang="ts" setup>
import BaseModal from '@/components/common/BaseModal.vue';
import api from '@/api';

const modelValue = ref(false);
const route = useRouter();
const formValidate = reactive({
	data: {
		time: '',
		reason: '',
		timeList: [{ star: null, end: null }],
	},
});
const props = defineProps({
	// modelValue: {
	// 	type: Boolean,
	// 	default: false,
	// },
	// params: Object,
	// menuList: Array,
});
const addTimeList = () => {
	formValidate.data.timeList.push({ star: null, end: null });
};
const del = (index) => {
	formValidate.data.timeList.splice(index, 1);
};
const apply = () => {
	console.log('apply');
};
const toHistoryPage = () => {
	route.push('/scenic-spot/sold-out-history');
};
// 打开弹窗
const open = () => {
	modelValue.value = true;
};
// 关闭弹窗
const cancel = () => {
	modelValue.value = false;
	console.log(modelValue.value, 'modelValue');
};

defineExpose({
	open,
	close,
});
// const emit = defineEmits(['update:modelValue', 'cancel', 'onSearch']);
</script>

<style lang="scss" scoped>
.ant-modal-body {
	margin: 0;
	padding: 0;
	background-color: red;
}
.btn-wrapper {
	display: flex;
	justify-content: end;
	button {
		margin-bottom: 20px;
	}
	a {
		color: #4197ef;
	}
}
.footer-wrapper {
	border-top: 1px solid #ddd;
	padding-top: 20px;
}
.time-item {
	margin-top: 10px;
	button {
		margin-left: 20px;
	}
}
</style>
