import { cloneDeep } from 'lodash';
import type { UnwrapRef } from 'vue';
import { validateRules, validateFields, generateGuid, getAge } from '@/utils';
import api from '@/api/index';
import { message } from 'ant-design-vue';
interface DataItem {
	name: string;
	auditTypeExplain: string;
	phone: string;
	edit: boolean;
}

const rules: { [k: string]: any } = {
	name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
	auditTypeExplain: [{ required: true, message: '请输入职务', trigger: 'blur' }],
	phone: [{ required: true, message: '请输入电话', trigger: 'blur' }],
};
export function useTouristInfo(props: any, emits: any): Record<string, any> {
	const options = reactive({ title: '设置接收人' });
	const dialogVisible = ref(false);
	const state = reactive<{ editableData: UnwrapRef<Record<string, DataItem>>; [k: string]: any }>({
		formRef: null,
		editableData: {},
		startRef: {},
		cityOptions: [],
		inputKey: ['name', 'auditTypeExplain', 'phone'],
		rulesRef: {},
		onSelect: (record: DataItem, selected: boolean, selectedRows: DataItem[]) => {
			console.log(record, selected, selectedRows);
		},
		tableData:[],
		columns: [
			{
				title: '序号',
				dataIndex: 'index',
				key: 'index',
				width: '60px',
			},
			{
				title: '姓名',
				dataIndex: 'name',
				key: 'name',
				width: '150px',
			},
			{
				title: '职务',
				dataIndex: 'auditTypeExplain',
				key: 'auditTypeExplain',
			},
			{
				title: '手机号',
				dataIndex: 'phone',
				key: 'phone',
			},
			{
				title: '操作',
				dataIndex: 'action',
				key: 'action',
			},
		],
	});

	const methods = {
		add: () => {
			let key = generateGuid();
			state.tableData.push({ key, edit: true, oid: null });
			methods.edit(key);
		},
		edit: (key: string) => {
			state.editableData[key] = cloneDeep(state.tableData.filter((item: any, index: number) => key == (item.key ? item.key : item.oid))[0]);
			state.editableData[key].edit = true;
		},
		addRules(key?: any) {
			state.rulesRef = {};
			const rule = validateRules(rules, state.editableData, key);
			for (let k in rule) {
				state.rulesRef[k] = rule[k];
			}
		},
		save: async (key?: string) => {
			await methods.addRules(key);
			const res = await validateFields(state.formRef);
		},
		del: (key: string) => {
			state.tableData.splice(key, 1);
		},
		cancel: () => {
			state.formRef.value = '';
			dialogVisible.value = false;
		},
	};
	const init = async () => {};
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
		emits('update:modelValue', nVal);
	});
	return {
		...toRefs(state),
		...methods,
		dialogVisible,
		options,
	};
}
