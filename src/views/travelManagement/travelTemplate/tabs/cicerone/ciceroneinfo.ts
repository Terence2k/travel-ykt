import { cloneDeep, isArray } from 'lodash';
import dayjs, { Dayjs } from 'dayjs';
import type { UnwrapRef } from 'vue';

import { validateRules, validateFields, generateGuid } from '@/utils';

import api from '@/api/index';
import { useTravelStore } from '@/stores/modules/travelManagement';
interface DataItem {
	time: string;
	endDate: string,
	startDate: string,
	belongTravelAgencyName: string,
	guideName: string,
	guidePhone: string,
	guideType: string | number,
	guideCertificateNo: string,	
	guideOid: string | number,
	belongTravelOid: string
}

const rules = {
	time: [{ required: true, message: '请选择带团时间' }],
	guideOid: [{ required: true, message: '请选择导游' }]
}

export function useGuideInfo(props: any, emits: any): Record<string, any> {
	const { onCheck } = toRefs(props);
	const travelStore = useTravelStore()
	const route = useRoute()
	const state = reactive<{editableData: UnwrapRef<Record<string, DataItem>>, [k:string]: any}>({
		editableData: {},
		guideParams: {
			pageNo: 1,
			pageSize: 10,
			queryType: 2
		},
		guideData: [],
		tableData: route.query.id ? travelStore.guideList : [],
		columns: [
			{
				title: ' 序号 ',
				key: 'index',
				width: '80px'
			},
			{
				title: '已选带团时间',
				dataIndex: 'time',
				key: 'time',
				width: '250px'
			},
			{
				title: '已选导游',
				dataIndex: 'guideName',
				key: 'guideName',
			},
			{
				title: '导游电话',
				dataIndex: 'guidePhone',
				key: 'guidePhone',
			},
			{
				title: '导游编号',
				dataIndex: 'guideCertificateNo',
				key: 'guideCertificateNo',
			},
			{
				title: '导游类型',
				dataIndex: 'guideType',
				key: 'guideType',
				data: travelStore.guideType
			},
			{
				title: '签约旅行社',
				dataIndex: 'belongTravelAgencyName',
				key: 'belongTravelAgencyName',
			},
			{
				title: '操作',
				key: 'action',
				fixed: 'right'
			}
		],
		rulesRef: {
			1: {
				guideName: [{ required: true, message: '请选择行程类型' }]
			}
		},
		formRef: null
	});

	const methods = {
		copyData(key:any) {
			Object.assign(
				state.tableData.filter((item:any) => key === (item.key ? item.key : item.oid))[0], 
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
			const cur = cloneDeep(
				state.tableData.filter((item:any) => key === (item.key ? item.key : item.oid))[0]
			);
			cur.time = cur.startDate && 
						cur.endDate && 
						[cur.startDate, cur.endDate] || [];
			state.editableData[key] = cur;
		},
		del(key: string) {
			console.log(key)
			state.tableData.splice(key, 1);
			// state.tableData = state.tableData.filter((item: any) => key !== (item.key ? item.key : item.oid));
		},

		save: async (key?: string) => {
			state.rulesRef = {}
			const rule = await validateRules(rules, state.editableData, key)
			for (let k in rule) {
				state.rulesRef[k] = rule[k]
			}
			const res = await validateFields(state.formRef);
			
			if (!res) return emits('onSuccess', {guideList: res});
			if (key) {
				state.editableData[key].startDate = state.editableData[key].time[0]
				state.editableData[key].endDate = state.editableData[key].time[1]
				methods.copyData(key)
				delete state.editableData[key];
			} else {
				for (let k in state.editableData) {
					state.editableData[k].startDate = state.editableData[k].time[0]
					state.editableData[k].endDate = state.editableData[k].time[1]
					methods.copyData(k)
					delete state.editableData[k];
				}
				emits('onSuccess', {guideList: state.tableData});
			}
			travelStore.setGuideList(state.tableData)
		},

		add: () => {
			let key = generateGuid();
			state.tableData.push({key});
			methods.edit(key);
			console.log(state.tableData)
		},

		async getGuideList() {
			const res = await api.travelManagement.getGuideList(state.guideParams);
			state.guideData = res.content;
		},
		guideChange(value:any, { item }: any, key:any) {
			state.editableData[key] = {
				...state.editableData[key],
				guidePhone: item.phone,
				belongTravelOid: item.belongTravelAgencyId,
				guideType: item.guideType || 2,	
				guideCertificateNo: item.guideCertificateNo,
				guideOid: item.oid,	
				belongTravelAgencyName: item.belongTravelAgencyName,
				guideName: item.guideName	
			}
			methods.copyData(key)
		}
		
	}
	watch(onCheck, (newVal) => {
		// console.log(newVal)
		methods.addRules()
		methods.save()
	})
	return {
		...toRefs(state),
		...methods
	}
}