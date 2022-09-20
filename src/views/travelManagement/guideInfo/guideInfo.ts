export function useGuideInfo(): Record<string, any> {
	const state = reactive({
		editableData: {},
		tableData: [
			{
				name: '123'
			}
		],
		columns: [
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
	return {
		...toRefs(state)
	}
}