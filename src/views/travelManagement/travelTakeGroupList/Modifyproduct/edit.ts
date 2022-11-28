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
			{
				title: '支付状态',
				dataIndex: 'orderStatusName',
				key: 'orderStatusName',
			},
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
		add(key: string, popup: string, oid: string, record?: any) {
			console.log(record);
			if (record) {
				if (record.roomTypeList == null) {
					record.roomTypeList = [
						{
							checkInNumber: '', //入住人数
							hotelRoomTypeId: '', //房型id
							unitPrice: 0, //房型单价
							roomCount: '', //订房数量
							roomTypeName: '', //房型名称
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
				state.newhotel.push({ ...state.hotelData[key], ...{ deleted: true, edit: true } });
			}
			console.log(state.newhotel);

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
		if (state.timeformState.time) {
			state.startTime = state.timeformState.time[0];
			state.endTime = state.timeformState.time[1];
			let dis = null;
			dis = (current: Dayjs) => {
				return (
					(dayjs(state.startTime) && dayjs(state.startTime) >= current && current) ||
					(dayjs(state.endTime) && dayjs(state.endTime).add(1, 'day') <= current && current)
				);
			};

			travelStore.setDisabled = dis as any;
			travelStore.teamTime = state.timeformState.time;
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
					let dis = null;
					if (res) {
						dis = (current: Dayjs) => {
							return (
								(dayjs(res.basic.startDate) && dayjs(res.basic.startDate).subtract(1, 'day') >= current && current) ||
								(dayjs(res.basic.endDate) && dayjs(res.basic.endDate).add(0, 'day') <= current && current)
							);
						};
					}
					travelStore.setDisabled = dis as any;
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
				let dis = null;
				if (res) {
					dis = (current: Dayjs) => {
						return (
							(dayjs(res.startDate) && dayjs(res.startDate).subtract(1, 'day') >= current && current) ||
							(dayjs(res.endDate) && dayjs(res.endDate).add(0, 'day') <= current && current)
						);
					};
				}
				travelStore.setDisabled = dis as any;
				const time: any = [];
				time.push(res.startDate, res.endDate);
				travelStore.teamTime = time;
			});
		}
	};
	const submitReview = async (callback: Function) => {
		const start = ref();
		const end = ref();
		if (state.timeformState.time) {
			end.value = dayjs(dayjs(state.timeformState.time[1]).format('YYYY-MM-DD')).valueOf();
			start.value = dayjs(dayjs(state.timeformState.time[0]).format('YYYY-MM-DD')).valueOf();
		}

		for (let index = 0; index < travelStore.hotelList?.length; index++) {
			const hoteltime = dayjs(travelStore.hotelList[index].startDate).valueOf();
			if (hoteltime > end.value || hoteltime < start.value) {
				Modal.confirm({
					title: '保存失败',
					icon: createVNode(ExclamationCircleOutlined),
					content: createVNode('div', { style: 'color: #333;' }, `您修改了行程时间。当前填写的酒店预订时间冲突！`),
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
					title: '保存失败',
					icon: createVNode(ExclamationCircleOutlined),
					content: createVNode('div', { style: 'color: #333;' }, `您修改了行程时间。当前填写的景区预订时间冲突！`),
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
		Audits();
	};
	const Audits = () => {
		const data = {
			itineraryId: state.itineraryId,
			startDate: '',
			endDate: '',
			reserveHotelParams: state.hotelparams,
			addTicketParams: state.tiecketparams,
		};
		if (state.timeformState.time) {
			data.startDate = state.timeformState.time[0];
			data.endDate = state.timeformState.time[1];
		}
		api.travelManagement
			.travelChangeOrderProduct(data)
			.then((res: any) => {
				message.success('提交审核成功');
				router.push({
					path: '/travel/travel_manage/travel_list',
				});
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
