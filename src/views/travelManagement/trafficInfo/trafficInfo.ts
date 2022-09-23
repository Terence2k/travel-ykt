import { cloneDeep } from 'lodash';
import dayjs from 'dayjs';
import { generateGuid } from '@/utils/util'
import { defineProps } from 'vue';
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
export function useTrafficInfo(props: any): Record<string, any> {
    // const rowSelection = ref({
    //     checkStrictly: false,
    //     onChange: (selectedRowKeys: (string | number)[], selectedRows: DataItem[]) => {
    //       console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    //     },
    //     onSelect: (record: DataItem, selected: boolean, selectedRows: DataItem[]) => {
    //       console.log(record, selected, selectedRows);
    //     },
    //     onSelectAll: (selected: boolean, selectedRows: DataItem[], changeRows: DataItem[]) => {
    //       console.log(selected, selectedRows, changeRows);
    //     },
    // });
	const { onCheck } = toRefs(props);
	const state = reactive<{editableData: UnwrapRef<Record<string, DataItem>>, [k:string]: any}>({
		formRef: null,
		editableData: {},
		startRef: {},
		cityOptions: [
			{
			  value: 'zhejiang',
			  label: 'Zhejiang',
			  children: [
				{
				  value: 'hangzhou',
				  label: 'Hangzhou',
				  children: [
					{
					  value: 'xihu',
					  label: 'West Lake',
					},
				  ],
				},
			  ]
			}
		],
		selectKey: ['name', 'name4'],
		inputKey: ['name5', 'name3', 'name2', 'name1'], 
		rulesRef: {
			1: {
				name5: [{ required: true, message: '请选择行程类型' }]
			}
		},
        onSelect: (record: DataItem, selected: boolean, selectedRows: DataItem[]) => {
            console.log(record, selected, selectedRows);
        },
		tableData: [
			{
				key: '1',
				name: 'lucy',
				name1: '123',
				name2: '123',
				name3: '123',
				name4: '123',
				name5: '123',
				name6: []
			}
		],
		columns: [
			{
				title: ' 序号 ',
				key: 'index',
				width: '80px'
			},
			{
				title: '交通类型',
				dataIndex: 'name',
				key: 'name',
			},
			{
				title: '车牌号',
				dataIndex: 'name5',
				key: 'name5',
			},
			{
				title: '车牌颜色',
				dataIndex: 'name4',
				key: 'name4',
			},
			{
				title: '车企名称',
				dataIndex: 'name3',
				key: 'name3',
			},
			{
				title: '核载人数（人）',
				dataIndex: 'name2',
				key: 'name2',
			},
            {
				title: '用车时段',
				dataIndex: 'name6',
				key: 'name6',
			},
			{
				title: '驾驶员',
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
		validateRules(key?:string) {
			state.rulesRef = {}
			let rules = {
				name: [{ required: true, message: '请选择交通类型' }],
				name5: [{ required: true, message: '请输入车牌号' }],
				name4: [{ required: true, message: '请选择车牌颜色' }],
				name3: [{ required: true, message: '请输入车企名称' }],
				name2: [{ required: true, message: '请输入核载人数（人）' }],
				name6: [{ required: true, message: '请选择用车时间段' }],
				name1: [{ required: true, message: '请输入驾驶员' }]
			}
			if (key) {
				state.rulesRef[key] = rules;
			} else {
				for (let k in state.editableData) {
					state.rulesRef[k] = rules;
				}
			}
			
		},
		async validateFields() {
			let flag = false
			try {
				const values = await state.formRef.validateFields()
				// console.log('Success:', values);
				flag = true
			} catch (errorInfo) {
				// console.log('Failed:', errorInfo);
			}
			return flag;
		},
		edit: (key: string) => {
			const cur = cloneDeep(state.tableData.filter((item:any, index: number) => key === item.key)[0])
			state.editableData[key] = cur;
		},
		save: async (key?: string) => {
			await methods.validateRules(key);
			const res = await methods.validateFields();
			if (!res) return
			if (key) {
				Object.assign(state.tableData.filter((item:any) => key === item.key)[0], state.editableData[key]);
				delete state.editableData[key];
			} else {
				for (let k in state.editableData) {
					Object.assign(state.tableData.filter((item:any) => k === item.key)[0], state.editableData[k]);
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
		methods.validateRules();
		methods.save()
	})
	return {
		...toRefs(state),
		...methods
	}
}