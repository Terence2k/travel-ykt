import { cloneDeep } from 'lodash';
import dayjs from 'dayjs';
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
		tableData: [
			{
				key: '1',
				name: '2022-09-21 09:59:14',
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
		]
	});

	const methods = {
		edit: (key: string) => {
			const cur = cloneDeep(state.tableData.filter((item:any) => key === item.key)[0])
			cur.name = dayjs(cur.name, 'YYYY-MM-DD HH:mm');
			state.editableData[key] = cur;
		},
		save: (key: string) => {
			const cur = state.editableData[key]
			cur.name = dayjs(cur.name).format('YYYY-MM-DD HH:mm');
			Object.assign(state.tableData.filter((item:any) => key === item.key)[0], state.editableData[key]);
			delete state.editableData[key];
		}
	}
	return {
		...toRefs(state),
		...methods
	}
}