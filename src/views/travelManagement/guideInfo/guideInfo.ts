import { cloneDeep } from 'lodash';
import dayjs, { Dayjs } from 'dayjs';
import type { UnwrapRef } from 'vue';

import { validateRules, validateFields, generateGuid } from '@/utils';

import api from '@/api/index';
interface DataItem {
	name: string;
	name1: string,
	name2: string,
	name3: string,
	name4: string,
	name5: string,
	name6: string
}

const rules = {
	name: [{ required: true, message: '请选择带团时间' }],
	name5: [{ required: true, message: '请选择导游' }]
}

export function useGuideInfo(): Record<string, any> {
	const state = reactive<{editableData: UnwrapRef<Record<string, DataItem>>, [k:string]: any}>({
		editableData: {},
		guideParams: {
			pageNo: 1,
			pageSize: 10
		},
		tableData: [
			{
				key: '1',
				name: '2022-09-21 09:59:14',
				name1: '123',
				name2: '123',
				name3: '123',
				name4: '123',
				name5: '',
				name6: '123'
			}
		],
		columns: [
			{
				title: ' 序号 ',
				key: 'index',
				width: '80px'
				// render: (text: any, record: any, index: number) => `${index + 1}`,  //每一页都从1开始
				// render:(text, record, index) => 
				// `${(pagination.current - 1) * (pagination.pageSize) + (index + 1)}`  
				//当前页数减1乘以每一页页数再加当前页序号+1
			},
			{
				title: '已选带团时间',
				dataIndex: 'name',
				key: 'name',
			},
			{
				title: '已选导游',
				dataIndex: 'name5',
				key: 'name5',
			},
			{
				title: '导游电话',
				dataIndex: 'name4',
				key: 'name4',
			},
			{
				title: '导游编号',
				dataIndex: 'name3',
				key: 'name3',
			},
			{
				title: '导游类型',
				dataIndex: 'name2',
				key: 'name2',
			},
			{
				title: '签约旅行社',
				dataIndex: 'name1',
				key: 'name1',
			},
			{
				title: '操作',
				key: 'action',
				fixed: 'right'
			}
		],
		rulesRef: {
			1: {
				name5: [{ required: true, message: '请选择行程类型' }]
			}
		},
		formRef: null
	});

	const methods = {
		
		edit: (key: string) => {
			const cur = cloneDeep(state.tableData.filter((item:any) => key === item.key)[0])
			cur.name && (cur.name = dayjs(cur.name, 'YYYY-MM-DD HH:mm'));
			state.editableData[key] = cur;
		},

		save: async (key: string) => {
			state.rulesRef = {}
			const rule = await validateRules(rules, state.editableData, key)
			for (let k in rule) {
				state.rulesRef[k] = rule[k]
			}
			const res = await validateFields(state.formRef);
			if (!res) return
			if (key) {
				state.editableData[key].name = dayjs(state.editableData[key].name).format('YYYY-MM-DD HH:mm');
				Object.assign(state.tableData.filter((item:any) => key === item.key)[0], state.editableData[key]);
				delete state.editableData[key];
			} else {
				for (let k in state.editableData) {
					state.editableData[k].name = dayjs(state.editableData[k].name).format('YYYY-MM-DD HH:mm');
					Object.assign(state.tableData.filter((item:any) => k === item.key)[0], state.editableData[k]);
					delete state.editableData[k];
				}
			}
		},

		add: () => {
			let key = generateGuid();
			state.tableData.push({key, name: undefined});
			methods.edit(key);
			console.log(state.tableData)
		},

		getGuideList() {
			api.travelManagement.getGuideList(state.guideParams)
		}
	}
	return {
		...toRefs(state),
		...methods
	}
}