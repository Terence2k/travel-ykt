import { cloneDeep } from 'lodash';
import dayjs from 'dayjs';
import { validateRules, validateFields, generateGuid, validPhone, isPositiveInteger } from '@/utils';
import { defineProps } from 'vue';
import type { UnwrapRef } from 'vue';
import { useTravelStore } from '@/stores/modules/travelManagement';
import { CODEVALUE } from '@/constant'
import api from '@/api';
import { message } from 'ant-design-vue';
interface DataItem {
	transportationType: string;
	driver: string,
	approvedLoad: string,
	companyName: string,
	licencePlateColor: string,
	licencePlateNumber: string,
	time: string,
	endDate: string,
	startDate: string
	edit: boolean
}

const rules = {
	transportationType: [{ required: true, message: '请输入交通类型' }],
	licencePlateNumber: [{ required: true, message: '请输入车牌号' }],
	licencePlateColor: [{ required: true, message: '请选择车牌颜色' }],
	companyName: [{ required: true, message: '请输入车企名称' }],
	approvedLoad: [{ required: true,  validator: isPositiveInteger }],
	time: [{ required: true, message: '请选择用车时间段' }],
	driver: [{ required: true, message: '请输入驾驶员' }],
	driverPhone: [{ required: true, validator: validPhone }]
}

export function useTrafficInfo(props: any, emits: any): Record<string, any> {
	const { onCheck } = toRefs(props);
	const route = useRoute()
	const travelStore = useTravelStore();
	const trafficType = computed(() => travelStore.trafficType);
	const trafficColor = computed(() => travelStore.trafficColor);
	const state = reactive<{editableData: UnwrapRef<Record<string, DataItem>>, [k:string]: any}>({
		formRef: null,
		editableData: {},
		startRef: {},
		selectKey: ['transportationType', 'licencePlateColor'],
		inputKey: ['licencePlateNumber', 'companyName', 'approvedLoad', 'driver', 'driverPhone'], 
		rulesRef: {
			1: {
				licencePlateNumber: [{ required: true, message: '请选择行程类型' }]
			}
		},
        onSelect: (record: DataItem, selected: boolean, selectedRows: DataItem[]) => {
            console.log(record, selected, selectedRows);
        },
		tableData: computed(() => travelStore.trafficList),
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
				width: 300
			},
			{
				title: '驾驶员',
				dataIndex: 'driver',
				key: 'driver',
			},
			{
				title: '驾驶员手机号',
				dataIndex: 'driverPhone',
				key: 'driverPhone',
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
			console.log(state.tableData.filter((item:any) => key == (item.key ? item.key : item.oid))[0], 
			state.editableData[key])
			Object.assign(
				state.tableData.filter((item:any) => key == (item.key ? item.key : item.oid))[0], 
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
				state.tableData.filter((item:any, index: number) => key === (item.key ? item.key : item.oid))[0]
			)
			state.editableData[key].edit = true
		},
		async del(record: any, index: number) {
			let key = record.key ? record.key : record.oid;
			record.oid && await api.travelManagement.deleteTraffic([record.oid]);
			state.tableData.splice(index, 1);
			delete state.editableData[key];
			message.success('删除成功');
			// 
		},
		save: async (key?: string) => {
			await methods.addRules(key)
			const res = await validateFields(state.formRef);
			
			if (!res) return emits('onSuccess', {transportList: {valid: res, message: '请填写完整交通信息', index: 3}});
			if (key) {
				methods.copyData(key);
				delete state.editableData[key];
			} else {
				for (let k in state.editableData) {
					console.log(k, '======================')
					methods.copyData(k);
					delete state.editableData[k];
				}
				emits('onSuccess', {transportList: state.tableData});
			}
			travelStore.setTrafficList(state.tableData)
		},
		add: () => {
			let key = generateGuid();
			state.tableData.push({key, edit: true, oid: null, time: cloneDeep(travelStore.teamTime)});
			methods.edit(key);
			state.editableData[key].startDate = travelStore.teamTime[0];
			state.editableData[key].endDate = travelStore.teamTime[1];
			console.log(state.tableData)
		},
		handleTime(event: any, key: string) {
			if (event) {
				state.editableData[key].startDate = event[0];
				state.editableData[key].endDate = event[1];
			} else {
				state.editableData[key].startDate = '';
				state.editableData[key].endDate = '';
			}
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
		...methods,
		travelStore
	}
}