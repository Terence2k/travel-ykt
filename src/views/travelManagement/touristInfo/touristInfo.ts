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
export function useTouristInfo(props: any): Record<string, any> {
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
		selectKey: ['name', 'name3',],
		inputKey: ['name5', 'name4'],
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
				title: '证件类型',
				dataIndex: 'name',
				key: 'name',
			},
			{
				title: '证件号码',
				dataIndex: 'name5',
				key: 'name5',
			},
			{
				title: '姓名',
				dataIndex: 'name4',
				key: 'name4',
			},
			{
				title: '性别',
				dataIndex: 'name3',
				key: 'name3',
			},
			{
				title: '客源地',
				dataIndex: 'name2',
				key: 'name2',
			},
			{
				title: '健康状态',
				dataIndex: 'name1',
				key: 'name1',
			},
            {
				title: '证件图片',
				dataIndex: 'name6',
				key: 'name6',
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
				name: [{ required: true, message: '请选择行证件类型' }],
				name5: [{ required: true, message: '请输入证件号码' }],
				name4: [{ required: true, message: '请输入姓名' }],
				name3: [{ required: true, message: '请选择性别' }],
				name2: [{ required: true, message: '请选择客源地' }]
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