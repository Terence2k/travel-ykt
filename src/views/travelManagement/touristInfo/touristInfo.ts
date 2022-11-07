import { cloneDeep } from 'lodash';
import dayjs from 'dayjs';
import type { UnwrapRef } from 'vue';

import { useTravelStore } from '@/stores/modules/travelManagement';
import { validateRules, validateFields, generateGuid, getAge } from '@/utils';
import api from '@/api/index';
import { CODEVALUE } from '@/constant'
import { message } from 'ant-design-vue';
interface DataItem {
	certificateType: string;
	healthCode: string;
	sourceAddress: string;
	gender: string;
	name: string;
	certificateNo: string;
	certificatePicture: string;
	sourceAddressName: string;
	specialCertificateType: string;
	addressId: [];
	specialCertificatePicture: [];
	edit: boolean;
	emergencyContactName: string;
	emergencyContactPhone: string;
}

const rules:{[k:string]: any} = {
	certificateType: [{ required: true, message: '请选择行证件类型' }],
	certificateNo: [{ required: true, message: '请输入证件号码' }],
	name: [{ required: true, message: '请输入姓名' }],
	gender: [{ required: true, message: '请选择性别' }],
	sourceAddressName: [{ required: true, message: '请选择客源地' }]
}
export function useTouristInfo(props: any, emits: any): Record<string, any> {
	const travelStore = useTravelStore()
	const route = useRoute();
	const { onCheck } = toRefs(props);
	const IDCard = computed(() => travelStore.IDCard)
	const specialId = computed(() => travelStore.specialId)
	const state = reactive<{editableData: UnwrapRef<Record<string, DataItem>>, [k:string]: any}>({
		formRef: null,
		editableData: {},
		startRef: {},
		cityOptions: [],
		selectKey: ['certificateType', 'gender', 'specialCertificateType'],
		inputKey: ['certificateNo', 'name', 'emergencyContactName', 'emergencyContactPhone'],
		rulesRef: {},
        onSelect: (record: DataItem, selected: boolean, selectedRows: DataItem[]) => {
            console.log(record, selected, selectedRows);
        },
		tableData: computed(() => travelStore.touristList),
		columns: [
			{
				title: ' 序号 ',
				key: 'index',
				width: '80px'
			},
			{
				title: '证件类型',
				dataIndex: 'certificateType',
				key: 'certificateType',
				data: IDCard
			},
			{
				title: '证件号码',
				dataIndex: 'certificateNo',
				key: 'certificateNo'
			},
			{
				title: '姓名',
				dataIndex: 'name',
				key: 'name',
			},
			{
				title: '性别',
				dataIndex: 'gender',
				key: 'gender',
				data: travelStore.genderList
			},
			{
				title: '客源地',
				dataIndex: 'sourceAddressName',
				key: 'sourceAddressName',
			},
			{
				title: '健康状态',
				dataIndex: 'healthCode',
				key: 'healthCode',
			},
			{
				title: '紧急联系人',
				dataIndex: 'emergencyContactName',
				key: 'emergencyContactName',
			},
			{
				title: '紧急联系人电话',
				dataIndex: 'emergencyContactPhone',
				key: 'emergencyContactPhone',
			},
			{
				title: '特殊证件类型',
				dataIndex: 'specialCertificateType',
				key: 'specialCertificateType',
				data: specialId
			},
            {
				title: '证件图片',
				dataIndex: 'specialCertificatePicture',
				key: 'specialCertificatePicture',
			},
			{
				title: '操作',
				key: 'action',
				fixed: 'right'
			}
		]
	});

	const methods = {
		async getCityList(data:any, length: number) {
			const res = await api.commonApi.getCityList(data);
			return res.map((item:any) => {
				return {
					value: item.oid,
					label: item.name,
					isLeaf: length >=3 ? true : false
				}
			})
		},
		loadData (selectedOptions:any) {
			console.log(selectedOptions)
			const targetOption = selectedOptions[selectedOptions.length - 1];
			targetOption.loading = true;
			const length = selectedOptions.length + 1
			methods.getCityList(`${targetOption.value}/${length}`, length).then(res => {
				targetOption.children = res
				targetOption.loading = false;
			})
		},
		copyData(key:any) {
			console.log(key)
			Object.assign(
				state.tableData.filter((item:any) => key == (item.key ? item.key : item.oid))[0], 
				state.editableData[key]
			);
		},
		// 特殊证件判断
		isUpload(key: any): {flag: boolean, text: string} {
			let flag: boolean = false;
			let text = ''
			if (state.editableData[key].specialCertificateType) {
				(!state.editableData[key].specialCertificatePicture
				|| !state.editableData[key].specialCertificatePicture.length) &&
				(text = `请上传游客${state.editableData[key].name}特殊证件图片`)
				flag = false;
			} else {
				flag = true;
			}
			return {
				flag,
				text
			};
		},
		// 老人判断
		isOld(key: any): {flag: boolean, text: string} {
			let flag: boolean = false;
			let text = ''
			if (state.editableData[key].certificateType !== CODEVALUE.TRAVE_CODE.IDENTITY_CARD) {
				return {
					flag: true,
					text: ''
				}
			};

			const age = getAge(state.editableData[key].certificateNo)
			if (age < 60) {
				return {
					flag: true,
					text: ''
				};
			}

			if (!state.editableData[key].emergencyContactName) {
				text = `游客中存在60以上的老人，请填写游客${state.editableData[key].name}紧急联系人`
				flag = false;
			} else if (!state.editableData[key].emergencyContactPhone) {
				text = `游客中存在60以上的老人，请填写游客${state.editableData[key].name}紧急联系人电话`
				flag = false;
			} else {
				flag = true;
			}
			
			return {
				flag,
				text
			};
			
		},
		addRules(key?: any) {
			state.rulesRef = {}
			
			const rule = validateRules(rules, state.editableData, key)
			
			for (let k in rule) {
				state.rulesRef[k] = rule[k]
			}
		},
		edit: (key: string) => {
			state.editableData[key] = cloneDeep(
				state.tableData.filter((item:any, index: number) => key == (item.key ? item.key : item.oid))[0]
			)
			state.editableData[key].edit = true
		},
		del(key: string) {
			console.log(key)
			state.tableData.splice(key, 1);
			// state.tableData = state.tableData.filter((item: any) => key !== (item.key ? item.key : item.oid));
		},
		save: async (key?: string) => {
			
			await methods.addRules(key)
			const res = await validateFields(state.formRef);
			if (!res) return emits('onSuccess', {touristList: {valid: res, message: '请填写完整游客信息', index: 2}});
			if (key) {
				const result = methods.isOld(key)
				const isUpload = methods.isUpload(key)
				if (!result.flag) return message.error(result.text);
				if (!isUpload.flag) return message.error(isUpload.text);
				methods.copyData(key);
				delete state.editableData[key];
			} else {
				for (let k in state.editableData) {
					const result = methods.isOld(k);
					const isUpload = methods.isUpload(k);
					if (!result.flag) return emits('onSuccess', {touristList: {valid: false, message: result.text, index: 2}});
					if (!isUpload.flag) return emits('onSuccess', {touristList: {valid: false, message: isUpload.text, index: 2}});
					methods.copyData(k);
					delete state.editableData[k];
				}
				emits('onSuccess', {touristList: state.tableData});
			}
			
			
			
			travelStore.setTouristList(state.tableData)
			
		},
		add: () => {
			let key = generateGuid();
			state.tableData.push({key, edit: true, oid: null});
			methods.edit(key);
			console.log(state.tableData)
		},
		handleChange(val: any, option: any, key: string) {
			console.log(val, option)
			state.editableData[key].sourceAddress = val[val.length - 1];
			state.editableData[key].sourceAddressName = option.map((it:any) => it.label).join('/')
		}
	}
	watch(onCheck, (newVal) => {
		// console.log(newVal)
		methods.addRules()
		methods.save()
	})
	
	
	travelStore.getTraveCode(CODEVALUE.TRAVE_CODE.IDCARD, 'IDCard');
	travelStore.getTraveCode(CODEVALUE.TRAVE_CODE.SPECIALID, 'specialId');
	methods.getCityList('0/1', 0).then(res => {
		state.cityOptions = res
	});
	return {
		...toRefs(state),
		...methods,
		travelStore
	}
}