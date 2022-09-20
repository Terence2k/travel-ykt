import { cloneDeep } from 'lodash';
import type { UnwrapRef } from 'vue';
interface DataItem {
	name: string;
	name1: string,
	name2: string,
	name3: string,
	name4: string,
	name5: string,
	name6: string
}
export function useGuideInfo(): Record<string, any> {
	const state = reactive<{editableData: UnwrapRef<Record<string, DataItem>>, [k:string]: any}>({
		editableData: {},
		tableKey: ['name', 'name1', 'name2', 'name3', 'name4', 'name5', 'name6'],
		tableData: [
			{
				name: '123',
				name1: '123',
				name2: '123',
				name3: '123',
				name4: '123',
				name5: '123',
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
				dataIndex: 'name6',
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
		]
	});

	const methods = {
		edit: (key: string) => {
			state.editableData[key] = cloneDeep(state.tableData.filter((item:any) => key === item.key)[0]);
		},
		save: (key: string) => {
			Object.assign(state.tableData.filter((item:any) => key === item.key)[0], state.editableData[key]);
			delete state.editableData[key];
		}
	}
	return {
		...toRefs(state),
		...methods
	}
}