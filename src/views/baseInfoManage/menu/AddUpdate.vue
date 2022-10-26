<template>
	<BaseModal :title="options.title" v-model="modelValue" @close="handleOk">
		<a-form ref="formRef" :model="formValidate" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 16, offset: 1 }" labelAlign="left">
			<a-form-item label="菜单名称" name="menuName">
				<a-input v-model:value="formValidate.menuName" placeholder="请输入菜单名称" />
			</a-form-item>
			<a-form-item label="菜单类型" name="menuType">
				<a-select ref="select" v-model:value="formValidate.menuType" placeholder="请选择菜单类型">
					<a-select-option :value="0">菜单夹</a-select-option>
					<a-select-option :value="1">功能模块</a-select-option>
					<a-select-option :value="2">tab页</a-select-option>
					<a-select-option :value="3">按钮</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item label="上级菜单" name="parentId">
				<a-tree-select
					v-model:value="formValidate.parentId"
					show-search
					:dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
					placeholder="请选择上级菜单"
					allow-clear
					tree-default-expand-all
					:tree-data="menuTreeDate"
				>
				</a-tree-select>
			</a-form-item>
			<a-form-item label="跳转路径" name="url">
				<a-input v-model:value="formValidate.url" placeholder="请输入跳转路径" />
			</a-form-item>
			<a-form-item label="操作按钮" name="buttonId" v-if="formValidate.menuType === 3">
				<a-select ref="select" v-model:value="formValidate.buttonId" placeholder="请选择操作按钮">
					<a-select-option v-for="item in btnGroupData" :value="item.oid">{{ item.name }}</a-select-option>
				</a-select>
			</a-form-item> 
			<a-form-item label="菜单编码" name="menuCode">
				<a-input v-model:value="formValidate.menuCode" placeholder="无需填写，保存自动生成" disabled />
			</a-form-item>
			<a-form-item label="接口地址" name="interfaceUrl">
				<a-input v-model:value="formValidate.interfaceUrl" placeholder="请输入接口地址"/>
			</a-form-item>
			<a-form-item label="顺序" name="sort">
				<a-input v-model:value="formValidate.sort" placeholder="请填写顺序" />
			</a-form-item>
			<a-form-item label="描述" name="menuDescribe">
				<a-input v-model:value="formValidate.menuDescribe" placeholder="请输入菜单描述" />
			</a-form-item>
			<a-form-item label="状态" name="menuStatus">
				<a-radio-group v-model:value="formValidate.menuStatus">
					<a-radio :value="1">开启</a-radio>
					<a-radio :value="0">关闭</a-radio>
				</a-radio-group>
			</a-form-item>
		</a-form>
		<template v-slot:footer>
			<a-button type="primary" @click="save">保存</a-button>
			<a-button @click="dialogVisible = false">取消</a-button>
		</template>
	</BaseModal>
</template>

<script lang="ts" setup>
import { ref, Ref, computed, watch, toRefs, reactive } from 'vue';
import BaseModal from '@/components/common/BaseModal.vue';
import type { FormInstance } from 'ant-design-vue';
import api from '@/api';
import { message } from 'ant-design-vue';
import { convertTree } from '@/utils/util';
import { cloneDeep } from 'lodash';

const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	params: Object,
	menuList: Array,
});
const emit = defineEmits(['update:modelValue', 'cancel', 'onSearch']);
const dialogVisible = ref(false);
const formRef = ref<FormInstance>() as any;
const formValidate: Ref<Record<string, any>> = ref({});
const options = reactive({ title: '新增菜单' });
const menuTreeDate: Ref<Array<any>> = ref([]);
const btnGroupData: Ref<Array<any>> = ref([]);
const rules: any = {
	menuName: [{ required: true, trigger: 'blur', message: '请输入菜单名称' }],
	menuType: [{ required: true, trigger: 'change', message: '请选择菜单类型' }],
	menuStatus: [{ required: true, trigger: 'change', message: '请选择菜单状态' }],
	buttonId: [{ required: true, trigger: 'change', message: '请选择操作按钮' }],
};

const handleOk = () => {
  emit('cancel');
};

const save = () => {
	formRef.value
		.validateFields()
		.then((values: any) => {
			if (formValidate.value.oid) {
				formValidate.value = {
					menuDescribe: formValidate.value.menuDescribe,
					menuName: formValidate.value.menuName,
					menuStatus: formValidate.value.menuStatus,
					menuType: formValidate.value.menuType,
					oid: formValidate.value.oid,
					parentId: formValidate.value.parentId,
					sort: formValidate.value.sort,
					url: formValidate.value.url,
					buttonId: formValidate.value.buttonId,
				};
				addOrUpdateAPI('editMenu');
			} else {
				addOrUpdateAPI('addMenu');
			}
		})
		.catch((info: any) => {
			console.log('Validate Failed:', info);
		});
};

const getBtnCode = () => {
	api
		.getBtnCode()
		.then((res: any) => {
			btnGroupData.value = res;
		})
		.catch(() => {
			message.error('获取按钮失败');
		});
};

const addOrUpdateAPI = (apiName: string) => {
	const queryData = cloneDeep(formValidate.value);
	console.log('queryData:', queryData);
	api[apiName](queryData)
		.then((res: any) => {
			message.success('保存成功');
			formRef.value.resetFields();
			emit('cancel');
			emit('onSearch');
		})
		.catch((err: any) => {
			console.error(err);
		});
};

const init = async () => {
	console.log('params', props.params);
	///转换树
	menuTreeDate.value = convertTree(props.menuList, {
		value: 'oid',
		label: 'menuName',
		children: 'children',
	});
	getBtnCode();
	formValidate.value = {};
	if (props.params?.oid) {
		formValidate.value = { ...props.params };
		options.title = '编辑菜单';
	} else {
    formValidate.value.menuStatus = 1;
		options.title = '新增菜单';
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

<style></style>
