import { cloneDeep } from 'lodash';
import dayjs from 'dayjs';
import { validateRules, validateFields, generateGuid } from '@/utils';
import { defineProps } from 'vue';
import type { UnwrapRef } from 'vue';
import { useTravelStore } from '@/stores/modules/travelManagement';
import { CODEVALUE } from '@/constant'
interface DataItem {
	transportationType: string;
	driver: string,
	approvedLoad: string,
	companyName: string,
	licencePlateColor: string,
	licencePlateNumber: string,
	time: string,
	useEndDate: string,
	useStartDate: string
}

const rules = {
	transportationType: [{ required: true, message: '请选择交通类型' }],
	licencePlateNumber: [{ required: true, message: '请输入车牌号' }],
	licencePlateColor: [{ required: true, message: '请选择车牌颜色' }],
	companyName: [{ required: true, message: '请输入车企名称' }],
	approvedLoad: [{ required: true, message: '请输入核载人数（人）' }],
	time: [{ required: true, message: '请选择用车时间段' }],
	driver: [{ required: true, message: '请输入驾驶员' }]
}

export function useTrafficInfo(props: any, emits: any): Record<string, any> {
	const { onCheck } = toRefs(props);
	const travelStore = useTravelStore();
	const trafficType = computed(() => travelStore.trafficType);
	const trafficColor = computed(() => travelStore.trafficColor);
	const state = reactive<{editableData: UnwrapRef<Record<string, DataItem>>, [k:string]: any}>({
		formRef: null,
		editableData: {},
		startRef: {},
		selectKey: ['transportationType', 'licencePlateColor'],
		inputKey: ['licencePlateNumber', 'companyName', 'approvedLoad', 'driver'], 
		rulesRef: {
			1: {
				licencePlateNumber: [{ required: true, message: '请选择行程类型' }]
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
				title: '交通类型',
				dataIndex: 'transportationType',
				key: 'transportationType',
				data: trafficType
			},
			{
				title: '车牌号',
				dataIndex: 'licencePlateNumber',
				key: 'licencePlateNumber',
			},
			{
				title: '车牌颜色',
				dataIndex: 'licencePlateColor',
				key: 'licencePlateColor',
				data: trafficColor
			},
			{
				title: '车企名称',
				dataIndex: 'companyName',
				key: 'companyName',
			},
			{
				title: '核载人数（人）',
				dataIndex: 'approvedLoad',
				key: 'approvedLoad',
			},
            {
				title: '用车时段',
				dataIndex: 'time',
				key: 'time',
			},
			{
				title: '驾驶员',
				dataIndex: 'driver',
				key: 'driver',
			},
			{
				title: '操作',
				key: 'action',
				fixed: 'right'
			}
		]
	});

	const methods = {
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
			
			emits('onSuccess', res ? {transportList: state.tableData} : {transportList: res});
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
		},
		handleTime(event: any, key: string) {
			console.log(event, key)
			state.editableData[key].useStartDate = event[0];
			state.editableData[key].useEndDate = event[1];
		}
	}
	travelStore.getTraveCode(CODEVALUE.TRAVE_CODE.TRAFFICTYPE, 'trafficType');
	travelStore.getTraveCode(CODEVALUE.TRAVE_CODE.TRAFFICCOLOR, 'trafficColor');
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