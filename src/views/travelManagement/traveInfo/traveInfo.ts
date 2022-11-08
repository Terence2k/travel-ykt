import { cloneDeep } from 'lodash';
import dayjs from 'dayjs';
import { createVNode, UnwrapRef } from 'vue';
import api from '@/api';
import { useTravelStore } from '@/stores/modules/travelManagement';
import { stat } from 'fs';
import { ConfirmDailyCharge, FeeModel } from '@/enum';
import { message, Modal } from 'ant-design-vue';
import { CheckOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { accDiv,accMul} from '@/utils/compute';
interface DataItem {
	name: string;
	name1: string;
	name2: string;
	name3: string;
	name4: string;
	confirmDailyChargeName: string;
	name6: string;
}
export function useTraveInfo(props: any, emits: any): Record<string, any> {
	const { onCheck } = toRefs(props);
	const travelStore = useTravelStore();
	const route = useRoute();
	const editId = reactive<{[k: string]: any}>({
		addTicketPop: '',
		addHotelPop: '',
		reserveTicketPop: ''
	})
	const showId = reactive<{[k: string]: any}>({
		showTicketPop: '',
		showHotelPop: '',
	})
	const state = reactive<{ editableData: UnwrapRef<Record<string, DataItem>>; [k: string]: any }>({
		editableData: {},
		addHotelPop: false,
		addTicketPop: false,
		modelValue:false,
		reserveTicketPop: false,
		selectPersonnelPop:false,
		payablePrice:'',
		showTicketPop: false,
		showHotelPop: false,
		id:'',
		allFeesProducts: computed(() => travelStore.compositeProducts),
		ticketData: computed(() => travelStore.scenicTickets),
		holteDate: computed(() => travelStore.hotels),
		gouvyDate:computed(() => travelStore.gouvyList),
		tableData: [
			{
				key: '1',
				name: '2022-09-21 09:59:14',
				name1: '123',
				name2: '123',
				name3: '123',
				name4: '123',
				confirmDailyChargeName: '123',
				name6: '123',
			},
		],
		params: {
			comprehensiveFeeProductName: '',
			status: 1,
			pageNo: 1,
			pageSize: 999,
		},
		columns: [
			{
				title: ' 序号 ',
				key: 'index',
				width: '80px',
			},
			{
				title: '费用名称',
				dataIndex: 'comprehensiveFeeProductName',
				key: 'comprehensiveFeeProductName',
			},
			{
				title: '结算归属',
				dataIndex: 'belongCompanyName',
				key: 'belongCompanyName',
			},
			{
				title: '收费模式',
				dataIndex: 'feeModel',
				key: 'feeModel',
				data: travelStore.feeModel,
			},
			{
				title: '是否按天收取',
				dataIndex: 'confirmDailyChargeName',
				key: 'confirmDailyChargeName',
			},
			{
				title: '单价（元）',
				dataIndex: 'feeNumber',
				key: 'feeNumber',
			},
			{
				title: '人数',
				dataIndex: 'peopleCount',
				key: 'peopleCount',
			},
			{
				title: '行程天数',
				dataIndex: 'dayCount',
				key: 'dayCount',
			},
			{
				title: '金额（元）',
				dataIndex: 'totalMoney',
				key: 'totalMoney',
			},
		],
		gouvyColumns:[
			{
				title:'费用名称',
				dataIndex: 'feeName',
				key: 'feeName',
			},
			{
				title:'团队游客人数',
				dataIndex: 'touristNum',
				key: 'touristNum',

			},
			{
				title:'应缴人数',
				dataIndex: 'payableNum',
				key: 'payableNum',
			},
			{
				title:'应缴总金额',
				dataIndex: 'payablePrice',
				key: 'payablePrice',
			},
			{
				title:'是否发起过减免申请',
				dataIndex: 'isInitiateReductionName',
				key: 'isInitiateReductionName',
			},
			{
				title:'减免申请是否通过',
				dataIndex: 'isReductionPassedName',
				key: 'isReductionPassedName',
			},
			{
				title:'出票状态',
				dataIndex: 'issueStatusName',
				key: 'issueStatusName',
			},
			{
				title: '操作',
				key: 'action',
				fixed: 'right',
			},
		],
		ticketColumns: [
			{
				title: ' 序号 ',
				key: 'index',
				width: '80px',
			},
			{
				title: '景区名称',
				dataIndex: 'scenicName',
				key: 'scenicName',
			},
			{
				title: '日期',
				dataIndex: 'startDate',
				key: 'startDate',
			},
			{
				title: '门票名称',
				dataIndex: 'ticketName',
				key: 'ticketName',
			},
			{
				title: '单价（元）',
				dataIndex: 'unitPrice',
				key: 'unitPrice',
			},
			{
				title: '团队游客人数',
				dataIndex: 'reservePeopleCount',
				key: 'reservePeopleCount',
			},
			{
				title: '购票人数',
				dataIndex: 'reservePeopleCount',
				key: 'reservePeopleCount',
			},
			{
				title: '费用预估（元）',
				dataIndex: 'totalFee',
				key: 'totalFee',
			},
			// {
			// 	title: '支付状态',
			// 	dataIndex: 'reserveStatusName',
			// 	key: 'reserveStatusName',
			// },
			{
				title: '操作',
				key: 'action',
				fixed: 'right',
			},
		],
		hotelColumns: [
			{
				title: ' 序号 ',
				key: 'index',
				width: '80px',
			},
			{
				title: '酒店类型',
				dataIndex: 'hotelStar',
				key: 'hotelStar',
			},
			{
				title: '酒店名称',
				dataIndex: 'hotelName',
				key: 'hotelName',
			},
			{
				title: '房间数量',
				dataIndex: 'roomCount',
				key: 'roomCount',
			},
			{
				title: '入住时间',
				dataIndex: 'startDate',
				key: 'startDate',
			},
			{
				title: '离店时间',
				dataIndex: 'endDate',
				key: 'endDate',
			},
			// {
			// 	title: '单价（元）',
			// 	dataIndex: 'unitPrice',
			// 	key: 'unitPrice',
			// },
			// {
			// 	title: '入住人数',
			// 	dataIndex: 'reservePeopleCount',
			// 	key: 'reservePeopleCount',
			// },
			{
				title: '金额（元）',
				dataIndex: 'orderFee',
				key: 'orderFee',
			},
			{
				title: '操作',
				key: 'action',
				fixed: 'right',
			},
		],
	});


	const methods = {
		edit: (key: string) => {
			const cur = cloneDeep(state.tableData.filter((item: any) => key === item.key)[0]);
			cur.name = dayjs(cur.name, 'YYYY-MM-DD HH:mm');
			state.editableData[key] = cur;
		},
		save: (key: string) => {
			const cur = state.editableData[key];
			cur.name = dayjs(cur.name).format('YYYY-MM-DD HH:mm');
			Object.assign(state.tableData.filter((item: any) => key === item.key)[0], state.editableData[key]);
			delete state.editableData[key];
		},
		add(key: string, popup: string, oid?: any) {
			console.log(key, oid)
			editId.productRow = {}
			editId[key] = ''
			if (oid) {
				editId[key] = oid
			}
			state[popup] = true;
			
		},
		show(key: string, oid?: any) {
			showId[key] = ''
			if (oid) {
				showId[key] = oid
			}
			state[key] = true;
		},
		choice(data :any)
		{
			state[data.selectPersonnelPop]=true
			state.id=data.id
			console.log(state.id,'13131')
		},
		see(key: string)
		{
			state[key] = true;
			console.log(key)
		},
		onSearch () {
			api.getBasicInfo().then((res) => {
				state.payablePrice=accDiv(res.price, 100)
			});
		},
		async reserveHotel (row: any) {
			const res = await api.travelManagement.hotelDetail(row.oid)
			let str = res.roomTypeList.map((it:any) => {
				return `${it.roomTypeName}（${it.roomCount}间）`
			})
			Modal.confirm({
				title: '酒店房型预定确认？',
				icon: createVNode(CheckOutlined),
				content: createVNode('div', { style: 'color: #333;' }, 
				 `您即将提交${row.startDate}日入住 “${row.hotelName}” 的订单，
				 		行程人数（${travelStore.touristList.length}人），
						${str.join('，')}，订单金额（${row.orderFee}元）。`),
				onOk() {
					const formData = new FormData();
					formData.append('oid', row.oid)
					
					api.travelManagement.reserveHotel(formData).then((res:any) => {
						travelStore.setHotelsStatus(row.oid)
						message.success('预定成功')
					})
				},
				onCancel() {
					console.log('Cancel');
				},
				class: 'test',
			});
		},
	};
	const rowRadioSelection = {

		type: 'radio',
		
		columnTitle:"选择",
		
		onChange: (selectedRowKeys: any, selectedRows: any) => {
			
			console.log(selectedRowKeys, selectedRows)
			travelStore.curentProduct = [selectedRows] as any
		},
		selectedRowKeys: [travelStore.curentProduct[0].oid]
	
	}
	if(travelStore.reserveStatus)
	{
		travelStore.getManagementExpenses(route.query.id)
	}
	return {
		...toRefs(state),
		...methods,
		editId,
		showId,
		travelStore,
		rowRadioSelection
	};
}
