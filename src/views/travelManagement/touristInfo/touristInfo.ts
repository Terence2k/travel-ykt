import { cloneDeep } from 'lodash';
import dayjs from 'dayjs';
import type { UnwrapRef } from 'vue';

import { useTravelStore } from '@/stores/modules/travelManagement';
import { validateRules, validateFields, generateGuid } from '@/utils';
import api from '@/api/index';
import { CODEVALUE } from '@/constant'
interface DataItem {
	certificateType: string;
	healthCode: string,
	sourceAddress: string,
	gender: string,
	name: string,
	certificateNo: string,
	certificatePicture: string
}

const rules = {
	certificateType: [{ required: true, message: '请选择行证件类型' }],
	certificateNo: [{ required: true, message: '请输入证件号码' }],
	name: [{ required: true, message: '请输入姓名' }],
	gender: [{ required: true, message: '请选择性别' }],
	sourceAddress: [{ required: true, message: '请选择客源地' }]
}
export function useTouristInfo(props: any, emits: any): Record<string, any> {
	const travelStore = useTravelStore()
	const { onCheck } = toRefs(props);
	const IDCard = computed(() => travelStore.IDCard)
	const state = reactive<{editableData: UnwrapRef<Record<string, DataItem>>, [k:string]: any}>({
		formRef: null,
		editableData: {},
		startRef: {},
		cityOptions: [],
		selectKey: ['certificateType', 'gender',],
		inputKey: ['certificateNo', 'name'],
		rulesRef: {
			1: {
				certificateNo: [{ required: true, message: '请选择行程类型' }]
			}
		},
        onSelect: (record: DataItem, selected: boolean, selectedRows: DataItem[]) => {
            console.log(record, selected, selectedRows);
        },
		tableData: [],
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
				dataIndex: 'sourceAddress',
				key: 'sourceAddress',
			},
			{
				title: '健康状态',
				dataIndex: 'healthCode',
				key: 'healthCode',
			},
            {
				title: '证件图片',
				dataIndex: 'certificatePicture',
				key: 'certificatePicture',
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
			Object.assign(
				state.tableData.filter((item:any) => key === item.key)[0], 
				state.editableData[key]
			);
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
				state.tableData.filter((item:any, index: number) => key === item.key)[0]
			)
		},
		save: async (key?: string) => {
			await methods.addRules(key)
			const res = await validateFields(state.formRef);
			emits('onSuccess', res ? {touristList: state.tableData} : {transportList: res});
			if (!res) return
			if (key) {
				methods.copyData(key);
				delete state.editableData[key];
			} else {
				for (let k in state.editableData) {
					methods.copyData(k);
					delete state.editableData[k];
				}
			}
			
		},
		add: () => {
			let key = generateGuid();
			state.tableData.push({key});
			methods.edit(key);
			console.log(state.tableData)
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
		...methods
	}
}