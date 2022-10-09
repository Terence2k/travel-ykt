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
export function useTraveInfo(): Record<string, any> {
	const state = reactive<{editableData: UnwrapRef<Record<string, DataItem>>, [k:string]: any}>({
		editableData: {},
		addHotelPop: false,
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
			},
			{
				title: '费用名称',
				dataIndex: 'name',
				key: 'name',
			},
			{
				title: '日期',
				dataIndex: 'name5',
				key: 'name5',
			},
			{
				title: '单价（元）',
				dataIndex: 'name4',
				key: 'name4',
			},
			{
				title: '人数',
				dataIndex: 'name3',
				key: 'name3',
			},
			{
				title: '金额（元）',
				dataIndex: 'name1',
				key: 'name1',
			}
		],
        ticketColumns: [
            {
				title: ' 序号 ',
				key: 'index',
				width: '80px'
			},
			{
				title: '景区名称',
				dataIndex: 'name',
				key: 'name',
			},
            {
				title: '日期',
				dataIndex: 'name',
				key: 'name',
			},
            {
				title: '单价（元）',
				dataIndex: 'name',
				key: 'name',
			},
            {
				title: '行程人数',
				dataIndex: 'name',
				key: 'name',
			},
            {
				title: '费用预估（元）',
				dataIndex: 'name',
				key: 'name',
			},
			{
				title: '操作',
				key: 'action',
				fixed: 'right'
			}
        ],
        hotelColumns: [
            {
				title: ' 序号 ',
				key: 'index',
				width: '80px'
			},
			{
				title: '酒店类型',
				dataIndex: 'name',
				key: 'name',
			},
            {
				title: '日期',
				dataIndex: 'name',
				key: 'name',
			},
            {
				title: '单价（元）',
				dataIndex: 'name',
				key: 'name',
			},
            {
				title: '人数',
				dataIndex: 'name',
				key: 'name',
			},
            {
				title: '预估金额（元）',
				dataIndex: 'name',
				key: 'name',
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
		},
		add(key: string) {
			state[key] = true;
		}
	}
	return {
		...toRefs(state),
		...methods
	}
}