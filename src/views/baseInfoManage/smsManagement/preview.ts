import { UnwrapRef, createVNode } from 'vue';
import { validateRules, validateFields, generateGuid, validPhone } from '@/utils';
import { useSmsStore } from '@/stores/modules/sms';
import { message, Modal } from 'ant-design-vue';
import api from '@/api/index';
import { cloneDeep, debounce } from 'lodash';
import { CheckOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Rule } from 'ant-design-vue/es/form';
import { getUserInfo, downloadFile } from '@/utils/util';

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
	const labelCol = { span: 6 };
	const smsStore = useSmsStore();
	const useinfo = getUserInfo();
	const options = reactive({ title: '设置接收人' });
	const dialogVisible = ref(false);
	const state = reactive<{ editableData: UnwrapRef<Record<string, DataItem>>; [k: string]: any }>({
		templateId: '',
		temId: '',
		formRef: null,
		formtwoRef: null,
		debounce: false,
		editableData: {},
		formValidate: {
			preParam: [],
		},
		newList: [],
		paramW: [],
		total: 0,
		isImport: false,
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
					state.newList = [];
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
		state.formValidate.phone = useinfo.mobile;
		api.getSysSmsTemplateSendPersons(state.param).then((res: any) => {
			state.tableData = res.content;
			state.total = res.total;
		});
	};
	const installsmsContent = async () => {
		api.getSysSmsTemplate(state.templateId).then((res: any) => {
			state.formValidate.smsContent = res.smsContent;
			state.temId = res.templateId;
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
		state.formtwoRef.validateFields().then((res: any) => {
			let params = state.formValidate.smsContent;
			for (let i = 0; i < state.formValidate.preParam.length; i++) {
				params = params.replace(`{${i + 1}}`, state.formValidate.preParam[i].unice);
				state.formValidate.smsLook = params;
			}
		});
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

	const goback = () => {
		router.go(-1);
	};

	const sendPreview = () => {
		state.formtwoRef.validateFields().then((res: any) => {
			if (!state.formValidate.smsLook) {
				message.error('请先生成预览内容');
				return;
			}
			let Tparams = [] as any;
			for (let i = 0; i < state.formValidate.preParam.length; i++) {
				Tparams.push(state.formValidate.preParam[i].unice);
			}
			const data = {
				templateOid: state.templateId,
				templateId: state.temId,
				params: Tparams,
				phone: state.formValidate.phone,
			};
			api.sendSmsRead(data).then((res: any) => {
				Modal.confirm({
					title: '预览发送',
					icon: createVNode(ExclamationCircleOutlined),
					okText: '继续群发',
					cancelText: '退出发送',
					content: createVNode(
						'div',
						{ style: 'color: #333;' },
						`已向手机号"${state.formValidate.phone}"发送预览短信成功，请注意查收，是否继续群发？`
					),
					async onOk() {
						smsMass();
					},
					onCancel() {
						return false;
					},
				});
			});
		});
	};

	const smsMass = () => {
		state.formtwoRef.validateFields().then((res: any) => {
			if (!state.formValidate.smsLook) {
				message.error('请先生成预览内容');
				return;
			}
			let Tparams = [] as any;
			for (let i = 0; i < state.formValidate.preParam.length; i++) {
				Tparams.push(state.formValidate.preParam[i].unice);
			}
			const data = {
				templateOid: state.templateId,
				templateId: state.temId,
				params: Tparams,
			};
			api
				.sendSmsByManual(data)
				.then((res: any) => {
					message.success('群发成功');
					Modal.confirm({
						title: '短信群发',
						okText: '继续群发',
						cancelText: '退出发送',
						icon: createVNode(ExclamationCircleOutlined),
						content: createVNode('div', { style: 'color: #333;' }, `短信群发成功，是否继续群发？`),
						async onOk() {
							smsMass();
						},
						onCancel() {
							return false;
						},
					});
				})
				.catch((error: any) => {
					Modal.confirm({
						title: '短信群发',
						okText: '重新发送',
						cancelText: '退出发送',
						icon: createVNode(ExclamationCircleOutlined),
						content: createVNode('div', { style: 'color: #333;' }, `短信群发失败，是否继续群发？`),
						async onOk() {
							smsMass();
						},
						onCancel() {
							return false;
						},
					});
				});
		});
	};

	const ImportContact = () => {
		state.isImport = true;
	};

	const downContact = () => {
		api.downloadTemplate().then((res: any) => {
			downloadFile(res, '短信收件人');
			message.success('下载成功');
		});
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

	onMounted(() => {
		install();
		installsmsContent();
	});
	return {
		...toRefs(state),
		...methods,
		dialogVisible,
		options,
		labelCol,
		onlook,
		onHandleCurrentChange,
		pageSideChange,
		CheckNum,
		sendPreview,
		goback,
		smsMass,
		ImportContact,
		downContact,
		install,
	};
}
