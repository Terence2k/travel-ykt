import _, { cloneDeep } from 'lodash';
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
	const router = useRouter();
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
		hotelData: computed(() => travelStore.hotelList),
		newticket: [],
		newhotel: [],
		ticketingDate: [],
		itineraryId: '',
		startTime: '',
		endTime: '',
		audtiStatus: true,
		timeformState: reactive({}),
		timeformRef: ref(''),
		tiemformshow: false,
		tiecketparams: [],
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

		ticketColumns: [
			{
				title: ' ?????? ',
				key: 'index',
				width: '80px',
			},
			{
				title: '????????????',
				dataIndex: 'scenicName',
				key: 'scenicName',
			},
			{
				title: '??????',
				dataIndex: 'startDate',
				key: 'startDate',
			},
			{
				title: '????????????',
				dataIndex: 'ticketName',
				key: 'ticketName',
			},
			{
				title: '???????????????',
				dataIndex: 'unitPrice',
				key: 'unitPrice',
			},
			{
				title: '??????????????????',
				dataIndex: 'peopleCount',
				key: 'peopleCount',
			},
			{
				title: '????????????',
				dataIndex: 'reservePeopleCount',
				key: 'reservePeopleCount',
			},
			{
				title: '?????????????????????',
				dataIndex: 'orderFee',
				key: 'orderFee',
			},
			{
				title: '????????????',
				dataIndex: 'orderStatusName',
				key: 'orderStatusName',
			},
			{
				title: '??????',
				key: 'action',
				fixed: 'right',
			},
		],
		hotelColumns: [
			{
				title: ' ?????? ',
				key: 'index',
				width: '80px',
			},
			{
				title: '????????????',
				dataIndex: 'hotelStar',
				key: 'hotelStar',
			},
			{
				title: '????????????',
				dataIndex: 'hotelName',
				key: 'hotelName',
			},
			{
				title: '????????????',
				dataIndex: 'roomName',
				key: 'roomName'
			},
			{
				title: '???????????????',
				dataIndex: 'limitPeopleCount',
				key: 'limitPeopleCount',
			},
			{
				title: '????????????',
				dataIndex: 'startDate',
				key: 'startDate',
			},
			{
				title: '????????????',
				dataIndex: 'endDate',
				key: 'endDate',
			},
			// {
			// 	title: '???????????????',
			// 	dataIndex: 'unitPrice',
			// 	key: 'unitPrice',
			// },
			// {
			// 	title: '????????????',
			// 	dataIndex: 'reservePeopleCount',
			// 	key: 'reservePeopleCount',
			// },
			{
				title: '???????????????',
				dataIndex: 'orderFee',
				key: 'orderFee',
			},
			{
				title: '??????',
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
		add(key: string, popup: string, oid: string, record?: any) {
			console.log(record);
			if (record) {
				if (record.roomTypeList == null) {
					record.roomTypeList = [
						{
							checkInNumber: '', //????????????
							hotelRoomTypeId: '', //??????id
							unitPrice: 0, //????????????
							roomCount: '', //????????????
							roomTypeName: '', //????????????
							orderAmount: 0,
						},
					];
				}
				editId.productRow = record;
				console.log(editId.productRow);
			} else {
				editId.productRow = {};
				editId[key] = '';
			}
			if (oid) {
				editId[key] = oid;
			}
			state[popup] = true;
		},
		delhotel(key: string) {
			if (state.hotelData[key].oid) {
				state.newhotel.push({
					...state.hotelData[key],
					...{ deleted: true, edit: true, arrivalDate: state.hotelData[key].startDate, departureDate: state.hotelData[key].endDate },
				});
			}
			state.hotelData.splice(key, 1);
		},
		delticket(key: string) {
			if (state.ticketData[key].oid) {
				state.newticket.push({ ...state.ticketData[key], ...{ deleted: true, edit: true } });
			}
			state.ticketData.splice(key, 1);
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
		onSearch() {
			api.getBasicInfo().then((res: any) => {
				state.payablePrice = accDiv(res.price, 100);
			});
		},
	};
	const changTiemshow = () => {
		state.tiemformshow = !state.tiemformshow;
		if (state.timeformState.startTime && state.timeformState.endTime) {
			state.startTime = state.timeformState.startTime;
			state.endTime = state.timeformState.endTime;
			// let dis = null;
			// dis = (current: Dayjs) => {
			// 	return (
			// 		(dayjs(state.timeformState.startTime) && dayjs(state.timeformState.startTime).subtract(1, 'day') >= current && current) ||
			// 		(dayjs(state.timeformState.endTime) && dayjs(state.timeformState.endTime).add(1, 'day') <= current && current)
			// 	);
			// };

			// travelStore.setDisabled = dis as any;
			travelStore.teamTime[0] = state.timeformState.startTime;
			travelStore.teamTime[1] = state.timeformState.endTime;
		}
	};
	const install = () => {
		console.log('getNopassChangeProductDeatil', route.query.remark);
		if (route.query.remark == '0') {
			api.travelManagement
				.changDetail({
					oid: route.query.oid,
					pageNo: 1,
					pageSize: 100000,
				})
				.then((res: any) => {
					state.startTime = res.basic?.startDate;
					state.endTime = res.basic?.endDate;
					travelStore.hotelList = res.hotelList;
					travelStore.ticketsList = res.ticketList;
					travelStore.touristList = res.touristList.content;
					state.itineraryId = res.basic.oid;
					res.hotelList.map((it: any) => {
						it.roomName = it.roomTypeList.map((item: any) => `${item.roomTypeName} * ${item.roomCount}<br />`).join('')
						return it;
					})
					const time: any = [];
					time.push(res.basic.startDate, res.basic.endDate);
					travelStore.teamTime = time;
				});
		} else {
			api.travelManagement.getProductChangeAuditDetail(route.query.oid).then((res: any) => {
				res.startDate = dayjs(res.startDate).format('YYYY-MM-DD HH:mm:ss');
				res.endDate = dayjs(res.endDate).format('YYYY-MM-DD HH:mm:ss');
				state.startTime = res.startDate;
				state.endTime = res.endDate;
				travelStore.hotelList = res.newHotelList;
				travelStore.ticketsList = res.newTicketList;
				travelStore.touristList = res.newTicketList;
				state.itineraryId = res.itineraryId;
				res.newHotelList.map((it: any) => {
					it.roomName = it.roomTypeList.map((item: any) => `${item.roomTypeName} * ${item.roomCount}<br />`).join('')
					return it;
				})
				const time: any = [];
				time.push(res.startDate, res.endDate);
				travelStore.teamTime = time;
			});
		}
	};
	const submitReview = async (callback: Function) => {
		const start = ref();
		const end = ref();
		if (state.timeformState.startTime && state.timeformState.endTime) {
			end.value = dayjs(dayjs(state.timeformState.endTime).format('YYYY-MM-DD')).valueOf();
			start.value = dayjs(dayjs(state.timeformState.startTime).format('YYYY-MM-DD')).valueOf();
		}

		for (let index = 0; index < travelStore.hotelList?.length; index++) {
			const hoteltime = dayjs(travelStore.hotelList[index].startDate).valueOf();
			if (hoteltime > end.value || hoteltime < start.value) {
				Modal.confirm({
					title: '????????????',
					icon: createVNode(ExclamationCircleOutlined),
					content: createVNode('div', { style: 'color: #333;' }, `?????????????????????????????????????????????????????????????????????`),
					async onOk() {
						return false;
					},
					onCancel() {
						return false;
					},
				});
				return false;
			}
		}

		for (let index = 0; index < travelStore.ticketsList?.length; index++) {
			const tickettime = dayjs(travelStore.ticketsList[index].startDate).valueOf();
			if (tickettime > end.value || tickettime < start.value) {
				Modal.confirm({
					title: '????????????',
					icon: createVNode(ExclamationCircleOutlined),
					content: createVNode('div', { style: 'color: #333;' }, `?????????????????????????????????????????????????????????????????????`),
					async onOk() {
						return false;
					},
					onCancel() {
						return false;
					},
				});
				return false;
			}
		}
		if (state.hotelData) {
			state.hotelparams = [].concat.call(state.hotelData, state.newhotel);
			state.hotelparams = state.hotelparams.filter((item: any) => item.edit == true, state.hotelparams);
			for (let index = 0; index < state.hotelparams?.length; index++) {
				if ((state.hotelparams[index]?.oid || state.hotelparams[index]?.key) && state.hotelparams[index].edit) {
					delete state.hotelparams[index].edit;
				}
			}
		}
		if (state.ticketData) {
			state.tiecketparams = [].concat.call(state.ticketData, state.newticket);
			state.tiecketparams = state.tiecketparams.filter((item: any) => item.edit == true, state.tiecketparams);
			for (let index = 0; index < state.tiecketparams?.length; index++) {
				if ((state.tiecketparams[index]?.oid || state.tiecketparams[index]?.key) && state.tiecketparams[index].edit) {
					delete state.tiecketparams[index].edit;
				}
			}
		}
		refund();
	};
	const refund = () => {
		const data = {
			itineraryId: state.itineraryId,
			startDate: '',
			endDate: '',
			reserveHotelParams: state.hotelparams,
			addTicketParams: state.tiecketparams,
		};
		if (state.timeformState.endTime && state.timeformState.startTime) {
			data.startDate = state.timeformState.startTime;
			data.endDate = state.timeformState.endTime;
		}
		api.travelManagement.travelChangeCheckTicketRefund(data).then((res: any) => {
			if (res.checkStatus == true) {
				Modal.confirm({
					title: '????????????',
					icon: createVNode(ExclamationCircleOutlined),
					content: createVNode('div', { style: 'color: #333;' }, `${res.checkMessage}`),
					async onOk() {
						Auditfun(data);
						return false;
					},
					onCancel() {
						return false;
					},
				});
				return false;
			} else {
				Auditfun(data);
			}
		});
		return;
	};
	const Auditfun = (data: any) => {
		api.travelManagement
			.travelChangeOrderProduct(data)
			.then((res: any) => {
				message.success('??????????????????');
				router.go(-2);
			})
			.catch((error: any) => {
				state.tiecketparams = state.tiecketparams.map((item: any) => {
					item.edit = true;
					return item;
				});
				state.hotelparams = state.hotelparams.map((item: any) => {
					item.edit = true;
					return item;
				});
			});
	};
	onMounted(() => {
		install();
	});
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
		changTiemshow,
	};
}
