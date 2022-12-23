import { cloneDeep } from 'lodash';
import type { UnwrapRef } from 'vue';
import { validateRules, validateFields, generateGuid, validPhone } from '@/utils';
import { useSmsStore } from '@/stores/modules/sms';
import api from '@/api/index';
import { message } from 'ant-design-vue';
import { Rule } from 'ant-design-vue/es/form';
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

export function usesmsInfo(): Record<string, any> {
	const router = useRouter();
	const route = useRoute();
	const labelCol = { span:6 };
	const smsStore = useSmsStore();
	const options = reactive({ title: '设置接收人' });
	const dialogVisible = ref(false);
	const state = reactive<{ editableData: UnwrapRef<Record<string, DataItem>>; [k: string]: any }>({
		templateId: '',
		formRef: null,
		formtwoRef: null,
		editableData: {},
		formValidate: {
			preParam:[]
		},
		newList: [],
		paramW: [],
		total: 0,
		param: {
			templateId: route?.query.templateId,
			pageNo: 1,
			pageSize: 10,
		},
		inputKey: ['name', 'position', 'phone'],
		rulesRef: {},
		onSelect: (record: DataItem, selected: boolean, selectedRows: DataItem[]) => {
			console.log(record, selected, selectedRows);
		},
		// tableData: computed(() => smsStore.recipientList),
		tableData: [],
		pre: [],
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
	// 校验
	const CheckNum = async (_rule: Rule, value: string, index: number) => {
		if (value === '') {
			return Promise.reject('请输入参数');
		} else {
			return Promise.resolve();
		}
	};

	const methods = {
		add: () => {
			let key = generateGuid();
			state.tableData.push({ key, edit: true, oid: null });
			methods.edit(key);
			methods.addRules(key);
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
			const param = [].concat.call(state.editableData[key]);
			const data = {
				templateId: state.templateId, //短信模板
				sysSmsSendPersonVos: param,
			};
			api.handleSysSmsTemplateSendPerson(data).then((res: any) => {
				message.success('设置成功');
				delete state.editableData[key];
				install();
				return;
			});
		},
		del: (key: string) => {
			state.newList.push({ ...state.tableData[key], ...{ delete: true } });
			if (state.tableData[key].oid) {
				const data = {
					templateId: state.templateId, //短信模板
					sysSmsSendPersonVos: state.newList,
				};
				api.handleSysSmsTemplateSendPerson(data).then((res: any) => {
					message.success('删除成功');
					state.tableData.splice(key, 1);
					install();
				});
			} else {
				state.tableData.splice(key, 1);
			}
		},
		cancel: () => {
			state.formRef.value = '';
			dialogVisible.value = false;
		},
	};
	const install = async () => {
		state.templateId = route?.query.templateId;
		api.getSysSmsTemplateSendPersons(state.param).then((res: any) => {
			state.tableData = res.content;
			state.total = res.total;
		});
		api.getSysSmsTemplate(state.templateId).then((res: any) => {
			state.formValidate.smsContent = res.smsContent;
			if (state.formValidate.smsContent) {
				let j = 0;
				for (let i = 0; i < state.formValidate.smsContent.length; i++) {
					if (state.formValidate.smsContent[i] == '{') {
						j++;
						state.formValidate.preParam.push({ key: j, unice: '' });
					}
				}
			}
		});
	};

	const onHandleCurrentChange = (val: any) => {
		state.param.pageNo = val;
		install();
	};
	const pageSideChange = (current: number, size: number) => {
		state.param.pageSize = size;
		install();
	};

	const onlook = () => {
		
		state.formtwoRef.validateFields().then((res:any)=>{
			console.log(state.formValidate.preParam,'state.formValidate.preParam');
			// for (let i = 0; i < state.formValidate.smsContent.length; i++) {
			// 	for (let j = 0; j < state.formValidate.preParam.length; j++) {
			// 		if (state.formValidate.smsContent[i] == j) {
			// 			console.log(state.formValidate.smsContent[i]);
						
						// state.formValidate.smsContent[i] = state.formValidate.preParam[i].unice
			// 		}
			// 		console.log(state.formValidate.smsContent,'state.formValidate.smsContent');
					
			// 	}
			// }
			// for (let i = 0; i < state.formValidate.smsContent.length; i++) {
				// console.log(state.formValidate.preParam[i].unice,'state.formValidate.preParam[i].unice');
				// state.formValidate.smsContent.replace("Microsoft","Runoob")
				// if (state.formValidate.smsContent.indexOf(`{${i}}`)) {
					// console.log(state.formValidate.smsContent.match(i),'state.formValidate.smsContent.match(i)');
				// 	state.formValidate.smsContent.indexOf(`{${i}}`)[0] = state.formValidate.preParam[i].unice
				// 	console.log(state.formValidate.smsContent.indexOf(`{${i}}`)[0],'state.formValidate.smsContent.match(i)[0]');
					
				// }
				//  state.formValidate.smsLook = state.formValidate.smsContent
				
			// }
			state.formValidate.smsContent.replace('1','123')
			console.log(state.formValidate.smsContent);
			
			
		})
		// formRef.value.validate().then(() => {
		// 	const data = {
		// 		templateOid: props?.params?.oid, //短信模板oid
		// 		startDate: formValidate.value.time[0], //开始时间
		// 		endDate: formValidate.value.time[1], //结束时间
		// 	};
		// 	api.getTemplateReadInfo(data).then((res: any) => {
		// 		formValidate.value.previewData = res;
		// 		formValidate.value.tips = '短信内容已生成，确认无误即可确定发送！';
		// 	});
		// });
	};
	// watch(dialogVisible, (nVal) => {
	// 	emits('update:modelValue', nVal);
	// });
	// watch(
	// 	() => props.modelValue,
	// 	async (nVal) => {
	// 		dialogVisible.value = nVal;
	// 		if (dialogVisible.value) {
	// 			await install();
	// 			// methods.save();
	// 		}
	// 	}
	// );
	install();
	return {
		...toRefs(state),
		...methods,
		dialogVisible,
		options,
		labelCol,
		onlook,
		onHandleCurrentChange,
		pageSideChange,
		CheckNum
	};
}