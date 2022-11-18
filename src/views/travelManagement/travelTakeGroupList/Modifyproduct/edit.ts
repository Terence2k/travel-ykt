import { cloneDeep } from 'lodash';
import { createVNode, UnwrapRef } from 'vue';
import api from '@/api';
import { useTravelStore } from '@/stores/modules/travelManagementDetail';
import { stat } from 'fs';
import { ConfirmDailyCharge, FeeModel } from '@/enum';
import { message, Modal } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';
import { CheckOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { accDiv, accMul } from '@/utils/compute';
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
	const editId = reactive<{ [k: string]: any }>({
		addTicketPop: '',
		addHotelPop: '',
		reserveTicketPop: '',
	});
	const showId = reactive<{ [k: string]: any }>({
		showTicketPop: '',
		showHotelPop: '',
	});
	const gouvyId = reactive<{ [k: string]: any }>({
		id: '',
		isReductionPassed: '',
	});


	const state = reactive<{ editableData: UnwrapRef<Record<string, DataItem>>; [k: string]: any }>({
		editableData: {},
		addHotelPop: false,
		addTicketPop: false,
		modelValue: false,
		ticketingValue: false,
		reserveTicketPop: false,
		selectPersonnelPop: false,
		payablePrice: '',
		showTicketPop: false,
		showHotelPop: false,
		ticketData: computed(() => travelStore.ticketsList),
		holteDate: computed(() => travelStore.hotelList),
		ticketingDate: [],
		itineraryId: '',
		startTime: '',
		endTime: '',
		timeformState : reactive({}),
		timeformRef : ref(''),
		tiemformshow:false,
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

		ticketingColumns: [
			{
				title: '购买状态',
				dataIndex: 'purchasedName',
				key: 'purchasedName',
			},
			{
				title: '游客姓名',
				dataIndex: 'touristName',
				key: 'touristName',
			},
			{
				title: '身份证件类型',
				dataIndex: 'certificateTypeName',
				key: 'certificateTypeName',
			},
			{
				title: '身份证号码',
				dataIndex: 'certificateNo',
				key: 'certificateNo',
			},
			{
				title: '性别',
				dataIndex: 'genderName',
				key: 'genderName',
			},
			{
				title: '年龄',
				dataIndex: 'age',
				key: 'age',
			},
			{
				title: '联系方式',
				dataIndex: 'purchased',
				key: 'purchased',
			},
			{
				title: '客源地',
				dataIndex: 'sourceAddressName',
				key: 'sourceAddressName',
			},
			{
				title: '减免规则',
				dataIndex: 'discountRuleName',
				key: 'discountRuleName',
			},
			{
				title: '实际缴费金额',
				dataIndex: 'actualPrice',
				key: 'actualPrice',
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
	const disabledDate = (current: Dayjs) => {
		return current && current < dayjs().subtract(1, 'day');
	};

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
			console.log(key, oid);
			editId.productRow = {};
			editId[key] = '';
			if (oid) {
				editId[key] = oid;
			}
			state[popup] = true;
		},
		show(key: string, oid?: any) {
			showId[key] = '';
			if (oid) {
				showId[key] = oid;
			}
			state[key] = true;
		},
		choice(data: any) {
			state[data.selectPersonnelPop] = true;
			gouvyId.id = data.id;
			gouvyId.isReductionPassed = data.isReductionPassed;
		},
		seeReject(key: string) {
			state[key] = true;
			console.log(key);
		},
		see(data: any) {
			state[data.ticketingValue] = true;
			api.getItineraryTourist(data.itineraryId).then((res) => {
				console.log(res, '213131231');
				state.ticketingDate = res;
			});
		},
		onSearch() {
			api.getBasicInfo().then((res) => {
				state.payablePrice = accDiv(res.price, 100);
			});
		},
		async reserveHotel(row: any) {
			const res = await api.travelManagement.hotelDetail(row.oid);
			let str = res.roomTypeList.map((it: any) => {
				return `${it.roomTypeName}（${it.roomCount}间）`;
			});
			Modal.confirm({
				title: '酒店房型预定确认？',
				icon: createVNode(CheckOutlined),
				content: createVNode(
					'div',
					{ style: 'color: #333;' },
					`您即将提交${row.startDate}日入住 “${row.hotelName}” 的订单，
				 		行程人数（${travelStore.hotelList.length}人），
						${str.join('，')}，订单金额（${row.orderFee}元）。`
				),
				onOk() {
					const formData = new FormData();
					formData.append('oid', row.oid);

					// api.travelManagement.reserveHotel(formData).then((res:any) => {
					// 	travelStore.setHotelsStatus(row.oid)
					// 	message.success('预定成功')
					// })
				},
				onCancel() {
					console.log('Cancel');
				},
				class: 'test',
			});
		},
	};
	const changTiemshow =() => {
		state.tiemformshow = !state.tiemformshow
		if(state.timeformState.time){
			state.startTime = state.timeformState.time[0]
			state.endTime = state.timeformState.time[1]
			let dis = null;
				dis = (current: Dayjs) => {
					return (
						(dayjs(state.startTime ) && dayjs(state.startTime ) > current && current) ||
						(dayjs(state.endTime) && dayjs(state.endTime).add(0, 'day') < current && current)
					);
				};
			
				travelStore.setDisabled = dis as any;
				travelStore.teamTime = state.timeformState.time		
		}
	}
	const install = () => {
		api.travelManagement
			.changDetail({
				oid: route.query.oid,
				pageNo: 1,
				pageSize: 100000,
			})
			.then((res: any) => {
				state.startTime = res.basic.startDate;
				state.endTime = res.basic.endDate;
				travelStore.hotelList = res.hotelList;
				travelStore.ticketsList = res.ticketList;
				state.itineraryId = res.basic.oid;
				let dis = null;
				if (res) {
					dis = (current: Dayjs) => {
						return (
							(dayjs(res.basic.startDate) && dayjs(res.basic.startDate) > current && current) ||
							(dayjs(res.basic.endDate) && dayjs(res.basic.endDate).add(1, 'day') < current && current)
						);
					};
				}
				travelStore.setDisabled = dis as any;
				const time: any = [];
				time.push(res.basic.startDate, res.basic.endDate);
				travelStore.teamTime = time;
			});
	};
	const submitReview = () => {
		let ajax = api.travelManagement.travelChangeOrderProduct;
		return ajax({
			itineraryId: state.itineraryId,
			startDate:state.startTime,
			endDate:state.endTime,
			reserveHotelParams: travelStore.hotelList,
			addTicketParams: travelStore.ticketsList,
		}).then((res: any) => {});
	};
	install();
	// const rowRadioSelection = {

	// 	type: 'radio',

	// 	columnTitle:"选择",

	// 	onChange: (selectedRowKeys: any, selectedRows: any) => {

	// 		console.log(selectedRowKeys, selectedRows)
	// 		travelStore.curentProduct = [selectedRows] as any
	// 	},
	// 	// selectedRowKeys: [travelStore.curentProduct[0].oid]

	// }
	// if(travelStore.reserveStatus)
	// {
	// 	travelStore.getManagementExpenses(route.query.id)
	// }
	return {
		...toRefs(state),
		...methods,
		editId,
		showId,
		gouvyId,
		travelStore,
		install,
		submitReview,
		disabledDate,
		changTiemshow
	};
}
