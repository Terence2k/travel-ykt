import { cloneDeep } from 'lodash';
import type { UnwrapRef } from 'vue';
import { validateRules, validateFields, generateGuid, validPhone } from '@/utils';
import { useSmsStore } from '@/stores/modules/sms';
import api from '@/api/index';
import { message } from 'ant-design-vue';
interface DataItem {
	key: string;
	name: string;
	position: string;
	phone: string;
	edit: boolean;
	oid: string;
}

const rules: { [k: string]: any } = {
	name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
	position: [{ required: true, message: '请输入职务', trigger: 'blur' }],
	phone: [{ validator: validPhone, trigger: 'blur' }],
};
export function usesmsInfo(props: any, emits: any): Record<string, any> {
	const smsStore = useSmsStore();
	const options = reactive({ title: '设置接收人' });
	const dialogVisible = ref(false);
	const state = reactive<{ editableData: UnwrapRef<Record<string, DataItem>>; [k: string]: any }>({
		templateId: '',
		formRef: null,
		editableData: {},
		newList: [],
		paramW: [],
		inputKey: ['name', 'position', 'phone'],
		rulesRef: {},
		onSelect: (record: DataItem, selected: boolean, selectedRows: DataItem[]) => {
			console.log(record, selected, selectedRows);
		},
		tableData: computed(() => smsStore.recipientList),
		columns: [
			{
				title: '序号',
				dataIndex: 'index',
				key: 'index',
			},
			{
				title: '姓名',
				dataIndex: 'name',
				key: 'name',
			},
			{
				title: '职务',
				dataIndex: 'position',
				key: 'position',
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
			methods.addRules(key);

			console.log(state.tableData);
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
		save: async (key?: any) => {
			const res = await validateFields(state.formRef);
			if (!res) return;
			if (key) {
				Object.assign(state.tableData.filter((item: any) => key == (item.key ? item.key : item.oid))[0], state.editableData[key]);
				delete state.editableData[key];
			} else {
				for (let k in state.editableData) {
					Object.assign(state.tableData.filter((item: any) => key == item.oid)[0], state.editableData[key]);
					delete state.editableData[k];
				}
			}
		},
		del: (key: string) => {
			state.newList.push({ ...state.tableData[key], ...{ delete: true } });
			state.tableData.splice(key, 1);
		},
		cancel: () => {
			state.formRef.value = '';
			dialogVisible.value = false;
		},
	};
	const install = async () => {
		console.log(props.params, '213');
		state.templateId = props.params?.oid;
		const data = {
			templateId: state.templateId,
			pageNo: 1, //页号
			pageSize: 10, //页大小
		};
		api.getSysSmsTemplateSendPersons(data).then((res: any) => {
			smsStore.setrecipientList(res.content);
		});
	};

	const onSubimt = () => {
		console.log(state.tableData, 'tableData');
		state.paramW = [].concat.call(state.tableData, state.newList);
		const data = {
			templateId: state.templateId, //短信模板
			sysSmsSendPersonVos: state.paramW,
		};
		api.handleSysSmsTemplateSendPerson(data).then((res: any) => {
			message.success('设置成功');
			emits('cancel');
			return;
		});
	};

	watch(dialogVisible, (nVal) => {
		emits('update:modelValue', nVal);
	});
	watch(
		() => props.modelValue,
		async (nVal) => {
			dialogVisible.value = nVal;
			if (dialogVisible.value) {
				await install();
				// methods.save();
			}
		}
	);

	return {
		...toRefs(state),
		...methods,
		dialogVisible,
		options,
		onSubimt,
	};
}
