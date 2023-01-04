import { cloneDeep } from 'lodash';
import dayjs from 'dayjs';
import type { UnwrapRef } from 'vue';

import { useTravelStore } from '@/stores/modules/travelManagement';
import { validateRules, validateFields, generateGuid, getAge, phoneReg, isPositiveInteger, getGenderByIdNumber } from '@/utils';
import api from '@/api/index';
import { CODEVALUE } from '@/constant'
import { message } from 'ant-design-vue';
import { HealthCode } from '@/enum';
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
	provinceId: string;
	cityId: string;
	age: string;
	oid: number;
	key: string;
	oldIdCard: string
}

const rules:{[k:string]: any} = {
	certificateType: [{ required: true, message: '请选择行证件类型' }],
	certificateNo: [{ required: true, message: '请输入证件号码' }],
	name: [{ required: true, message: '请输入姓名' }],
	gender: [{ required: true, message: '请选择性别' }],
	sourceAddressName: [{ required: true, message: '请选择客源地' }],
	age: [{ required: true, validator: isPositiveInteger }]
}
export function useTouristInfo(props: any, emits: any): Record<string, any> {
	const travelStore = useTravelStore()
	const route = useRoute();
	const { onCheck } = toRefs(props);
	const IDCard = computed(() => travelStore.IDCard)
	const specialId = computed(() => travelStore.specialId)
	const state = reactive<{editableData: UnwrapRef<Record<string, DataItem>>, [k:string]: any}>({
		fileUrl: {},
		isWarring: false,//健康码异常
		checkCode: false, //健康码点击
		highRish: false, //高风险
		checkHighRish: false,
		formRef: null,
		editableData: {},
		startRef: {},
		cityOptions: [],
		delOid: [],
		delKey: [],
		mustFillIn: ['certificateType', 'certificateNo', 'name', 'gender', 'age', 'sourceAddressName'],
		selectKey: ['certificateType', 'gender', 'specialCertificateType'],
		inputKey: ['certificateNo', 'name', 'emergencyContactName', 'emergencyContactPhone', 'age'],
		rulesRef: {},
        onSelect: (record: DataItem, selected: boolean, selectedRows: DataItem[]) => {
            console.log(record, selected, selectedRows);
			state.delOid = selectedRows.filter(item => item.oid).map(it => it.oid);
			state.delKey = selectedRows.filter(item => !item.oid).map(it => it.key);
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
				data: IDCard,
				width: 200,
			},
			{
				title: '证件号码',
				dataIndex: 'certificateNo',
				key: 'certificateNo',
				width: 200,
			},
			{
				title: '姓名',
				dataIndex: 'name',
				key: 'name',
				width: 200,
			},
			{
				title: '性别',
				dataIndex: 'gender',
				key: 'gender',
				data: travelStore.genderList,
				width: 200,
			},
			{
				title: '年龄',
				dataIndex: 'age',
				key: 'age',
				width: 200,
			},
			{
				title: '客源地',
				dataIndex: 'sourceAddressName',
				key: 'sourceAddressName',
				width: 200,
			},
			{
				title: '健康状态',
				dataIndex: 'healthCode',
				key: 'healthCode',
				width: 200,
			},
			{
				title: '紧急联系人',
				dataIndex: 'emergencyContactName',
				key: 'emergencyContactName',
				width: 200,
			},
			{
				title: '紧急联系人电话',
				dataIndex: 'emergencyContactPhone',
				key: 'emergencyContactPhone',
				width: 200,
			},
			{
				title: '特殊证件类型',
				dataIndex: 'specialCertificateType',
				key: 'specialCertificateType',
				data: specialId,
				width: 200,
			},
            {
				title: '证件图片',
				dataIndex: 'specialCertificatePicture',
				key: 'specialCertificatePicture',
				width: 400,
			},
			{
				title: '操作',
				key: 'action',
				fixed: 'right',
				width: 100,
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
				if (!res.length) {
					targetOption.isLeaf = true
				}
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
			console.log(state.editableData[key].specialCertificatePicture)
			if (state.editableData[key].specialCertificateType) {
				if (!state.editableData[key].specialCertificatePicture?.length) {
					text = `请上传游客${state.editableData[key].name}特殊证件图片`
					flag = false;
				} else {
					flag = true;
				}
			} else {
				flag = true;
			}
			return {
				flag,
				text
			};
		},
		isPhone(key: string) {
			let flag: boolean = false;
			let text = '';
			console.log(state.editableData[key].emergencyContactPhone)
			if (state.editableData[key].emergencyContactPhone && 
				!phoneReg.test(state.editableData[key].emergencyContactPhone)) {
				text = `请填写游客${state.editableData[key].name}正确的紧急联系人电话`
				flag = false;
			} else {
				text = ''
				flag = true;
			}
			return {
				flag,
				text
			}
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
		// 根据身份证获取客源地
		async getAreaByIdCardNo(idCardNo: string) {
			console.log(idCardNo)
			const formData = new FormData();
			formData.append('idCardNo', idCardNo)
			return await api.travelManagement.getAreaByIdCardNo({ idCardNo })
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
			state.fileUrl[key] = state.editableData[key].specialCertificatePicture?.join(',')
			state.editableData[key].edit = true
		},
		async del(record: any, index: number) {
			let key = record.key ? record.key : record.oid;
			record.oid && await api.travelManagement.deleteTourist([record.oid]);
			state.tableData.splice(index, 1);
			delete state.editableData[key];
			message.success('删除成功');
			// 
		},
		async bathDel() {

			state.delOid.length && await api.travelManagement.deleteTourist(state.delOid);

			travelStore.touristList = travelStore.touristList.filter((item: any) => !state.delOid.includes(item.oid) &&
					!state.delKey.includes(item.key));

			message.success('删除成功');
			
		},
		save: async (key?: string) => {
			
			await methods.addRules(key)
			const res = await validateFields(state.formRef);
			if (!res) return emits('onSuccess', {touristList: {valid: res, message: '请填写完整游客信息', index: 2}});
			if (key) {
				const result = methods.isOld(key)
				const isUpload = methods.isUpload(key)
				const isPhone = methods.isPhone(key)
				if (!result.flag) return message.error(result.text);
				if (!isUpload.flag) return message.error(isUpload.text);
				if (!isPhone.flag) return message.error(isPhone.text);
				methods.copyData(key);
				delete state.editableData[key];
			} else {
				for (let k in state.editableData) {
					const result = methods.isOld(k);
					const isUpload = methods.isUpload(k);
					const isPhone = methods.isPhone(k);
					if (!result.flag) return emits('onSuccess', {touristList: {valid: false, message: result.text, index: 2}});
					if (!isUpload.flag) return emits('onSuccess', {touristList: {valid: false, message: isUpload.text, index: 2}});
					if (!isPhone.flag) return emits('onSuccess', {touristList: {valid: false, message: isPhone.text, index: 2}});
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
			// console.log(val, option)
			state.editableData[key].provinceId = val[0]
			state.editableData[key].cityId = val[1]
			state.editableData[key].sourceAddress = val[val.length - 1];
			state.editableData[key].sourceAddressName = option.map((it:any) => it.label).join('/')
		},
		async changeIDCard(val: any, key: string, columns: string) {
			
			if (columns === 'certificateNo' &&
					state.editableData[key].certificateType === CODEVALUE.TRAVE_CODE.IDENTITY_CARD) {

				if (state.editableData[key].certificateNo?.length < 18) {
					state.editableData[key].age = '';
					return message.error('请输入正确的身份证')
				}
				if (state.editableData[key].oldIdCard !== state.editableData[key].certificateNo) {
					const res: any = await methods.getAreaByIdCardNo(state.editableData[key].certificateNo);
					if (res.provinceName) {
						state.editableData[key].sourceAddressName = res.provinceName;
						state.editableData[key].provinceId = res.provinceId;
					}
					if (res.cityName) {
						state.editableData[key].sourceAddressName += `/${res.cityName}`
						state.editableData[key].cityId = res.cityId;
					}
					if (res.areaName) {
						state.editableData[key].sourceAddressName += `/${res.areaName}`
						state.editableData[key].sourceAddress = res.areaId;
					}
					
					
					
					
				}
				
				
				const age: string = getAge(state.editableData[key].certificateNo) as any
				const gender: string = getGenderByIdNumber(state.editableData[key].certificateNo) as any
				console.log(gender)
				state.editableData[key].age = age || "";
				state.editableData[key].gender = gender;
				state.editableData[key].oldIdCard = state.editableData[key].certificateNo
				
			}
			if (columns === 'certificateNo' || columns === 'name') {
				if (state.editableData[key].certificateNo && state.editableData[key].name) {
					const res = await travelStore.getHealthCode([state.editableData[key]]);
					state.editableData[key].healthCode = res[0].healthCode;
					methods.copyData(key)
				}
			}
		},
		changeUpload(url: any, key: any) {
			state.editableData[key].specialCertificatePicture = state.editableData[key].specialCertificatePicture ? 
					state.editableData[key].specialCertificatePicture : []
			state.editableData[key].specialCertificatePicture.push(url.data.filePath);
		},
		removeImg(file: any, key: any) {
			console.log(state.editableData[key])
			state.editableData[key].specialCertificatePicture.splice(file.index, 1);
			console.log(file, key)
		},
		async getHealthCode() {
			state.checkCode = true;
			const res = await travelStore.getHealthCode(state.tableData)
			state.isWarring = res.some(item => item.healthCode === HealthCode.Red || item.healthCode === HealthCode.Yellow)
			console.log(state.isWarring)
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