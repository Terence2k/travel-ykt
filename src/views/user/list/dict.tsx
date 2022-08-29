import type { ColumnsType } from 'ant-design-vue/es/table/interface';
export const coloumns: ColumnsType = [
	{
		key: 'code',
		dataIndex: 'code',
		title: '客户编号',
		width: 160,
		customRender({ text }) {
			return <a-button type="primary">{text}</a-button>;
		},
	},
	{
		key: 'contact',
		dataIndex: 'contact',
		title: '联系方式',
		width: 130,
	},
	{
		key: 'name',
		dataIndex: 'name',
		title: '客户信息',
		width: 100,
	},
	{
		key: 'type',
		dataIndex: 'type',
		title: '客户类型',
		width: 100,
	},
	{
		key: 'phone',
		dataIndex: 'phone',
		title: '客户电话',
		width: 100,
	},
	{
		key: 'createTime',
		dataIndex: 'createTime',
		title: '创建时间',
		width: 130,
		ellipsis: true,
	},
	{
		key: 'createUserName',
		dataIndex: 'createUserName',
		title: '创建人',
		width: 90,
	},
	{
		key: 'chargeUserName',
		dataIndex: 'chargeUserName',
		title: '负责人',
		width: 90,
	},
	{
		key: 'carNum',
		dataIndex: 'carNum',
		title: '客户车辆数',
		width: 110,
	},
	{
		key: 'dismantNum',
		dataIndex: 'dismantNum',
		title: '已拆解车辆',
		width: 110,
	},
	{
		key: 'undismantNum',
		dataIndex: 'undismantNum',
		title: '未拆解车辆',
		width: 110,
	},
	{
		key: 'city',
		dataIndex: 'city',
		title: '所在省市',
		width: 100,
		ellipsis: true,
	},
	{
		fixed: 'right',
		key: 'action',
		title: '操作',
		width: 140,
	},
];

export const searchDict = [
	{
		type: 'input',
		label: '关键字',
		attr: 'key',
		placeholder: '客户编号、客户信息',
	},
	{
		type: 'timeRange',
		label: '时间范围',
		attr: 'createTime',
		// showTime: { format: "HH:mm" },
		format: 'YYYY-MM-DD',
	},
	{
		type: 'time',
		label: '时间选择',
		attr: 'date',
		format: 'YYYY-MM-DD',
	},
	{
		type: 'select',
		label: '性别',
		attr: 'sex',
		placeholder: '选择性别',
		options: [],
		fun: async () => {
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve([
						{
							name: '男',
							value: '1',
						},
						{
							name: '女',
							value: '2',
						},
					]);
				}, 2000);
			});
		},
	},
];
