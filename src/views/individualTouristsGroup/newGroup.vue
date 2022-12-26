<template>
	<div class="content_box">
		<a-tabs v-model:activeKey="activeKey" @change="nextTep" @tabClick="tabClick">
			<a-tab-pane key="1" tab="填写基本信息">
				<a-form ref="formRef" :model="form" :rules="formRules" name="addStore" autocomplete="off" :label-col="labelCol">
					<div class="form_item_box">
						<div class="form_item mr40">
							<a-form-item name="routeName" label="线路名称">
								<a-input v-model:value="form.routeName" placeholder="给拼团线路取个名字">
								</a-input>
							</a-form-item>
							<a-form-item name="guideOid" label="导游">
								<a-select placeholder="请选择本社签约导游" v-model:value="form.guideOid" allowClear @change="guideChange">
									<a-select-option v-for="item in guideOption" :value="item.oid" :key="item.oid">{{ item.guideName }}
									</a-select-option>
								</a-select>
							</a-form-item>
							<a-form-item name="travelOperatorName" label="联系人">
								<a-input v-model:value="form.travelOperatorName" placeholder="请输入联系人姓名">
								</a-input>
							</a-form-item>
							<a-form-item name="itineraryNo" label="行程单号">
								<a-input v-model:value="form.itineraryNo" placeholder="无需填写，提交审核后自动生成" disabled>
								</a-input>
							</a-form-item>
							<a-form-item name="selfTeamNo" label="自编团号">
								<a-input v-model:value="form.selfTeamNo" placeholder="请输入自编团号">
								</a-input>
							</a-form-item>
						</div>
						<div class="form_item mr40">
							<el-form ref="dateFormRef" :model="form" :rules="dateRules" :label-width="labelWidth"
								label-position="right">
								<el-form-item label="行程日期：" prop="travelData">
									<picker v-model="form.travelData" @change="datePickerChange" type="datetimerange"
										:value-format="dateTimeFormat" start-placeholder="请选择开始时间" end-placeholder="请选择结束时间"
										style="width:100%">
									</picker>
								</el-form-item>
							</el-form>
							<a-form-item name="groupTypeName" label="散客组团类型">
								<a-input v-model:value="form.groupTypeName" placeholder="无需填写，选择行程日期后自动判断" disabled>
								</a-input>
							</a-form-item>
							<a-form-item name="travelOperatorPhone" label="联系人号码">
								<a-input v-model:value="form.travelOperatorPhone" placeholder="请输入联系人手机号">
								</a-input>
							</a-form-item>
							<a-form-item name="touristPeopleNumber" label="游客人数">
								<div style="display: flex;justify-content: space-between; align-items: center;">
									<a-input v-model:value="form.touristPeopleNumber" placeholder="无需填写，选择合同后自动生成" disabled
										style="flex:3">
									</a-input>
									<div class="append">查看全部游客</div>
								</div>
							</a-form-item>
							<a-form-item name="licensePlate" label="用车车牌号">
								<a-input v-model:value="form.licensePlate" placeholder="输入车牌号">
								</a-input>
							</a-form-item>
						</div>
					</div>
					<div class="tag">选择合同</div>
					<CommonTable :dataSource="selectedContract" :columns="contractColumns">
						<template #bodyCell="{ column, record, index }">
							<template v-if="column.key === 'index'">
								{{ index + 1 }}
							</template>
							<template v-if="column.key === 'tripDate'">
								{{ record.tripStartTime + '-' + record.tripEndTime }}
							</template>
							<template v-if="column.key === 'action'">
								<div class="action-btns">
									<a @click="checkDetails(record.oid)">查看</a>
									<a @click="deleteContract(index, record)">删除</a>
								</div>
							</template>
						</template>
					</CommonTable>
					<div class="cost_count">
						<div class="cost_item">费用合计</div>
						<div class="cost_item">{{ form.totalExpenses }}</div>
					</div>
					<div class="add_box">
						<a-button @click="addContract" type="primary">添加</a-button>
					</div>
				</a-form>
				<div class="operation">
					<a-button @click="saveDraft" type="primary" style="margin-right:20px">保存草稿</a-button>
					<a-button @click="nextTep('2')" type="primary">下一步</a-button>
				</div>
			</a-tab-pane>
			<a-tab-pane key="2" tab="产品预订">
				<traveInfo></traveInfo>
				<div class="operation">
					<a-button @click="saveDraft" type="primary" style="margin-right:20px">保存草稿</a-button>
					<a-button @click="nextTep('1')" type="primary" style="margin-right:20px">上一步</a-button>
					<a-button @click="" type="primary">提交审核</a-button>
				</div>
			</a-tab-pane>
			<template #rightExtra>
				<span class="close_btn" @click="back">
					<close-outlined />
				</span>
			</template>
		</a-tabs>
	</div>
	<CommonModal title="添加合同（可多选）" v-model:visible="addContractVisible" @close="addContractClose"
		@cancel="addContractClose" :conform-text="'添加'" @conform="addContractConform" width="65%">
		<CommonSearch>
			<search-item label="行程开始时间">
				<picker v-model="contractTable.param.startTime" type="date" :value-format="dateFormat" placeholder="请选择开始时间">
				</picker>
			</search-item>
			<search-item label="关键词">
				<a-input v-model:value="contractTable.param.key" placeholder="搜索线路名称或委托项目" allowClear />
			</search-item>
			<search-item label="合同编号">
				<a-input v-model:value="contractTable.param.contractNo" allowClear />
			</search-item>
			<template #button>
				<a-button @click="getContract">查询</a-button>
			</template>
		</CommonSearch>
		<CommonTable :dataSource="contractTable.data" :columns="contractColumns1" :scroll="scroll"
			:row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }">
			<template #bodyCell="{ column, record, index }">
				<template v-if="column.key === 'index'">
					{{ index + 1 }}
				</template>
				<template v-if="column.key === 'tripDate'">
					{{ record.tripStartTime + '-' + record.tripEndTime }}
				</template>
			</template>
		</CommonTable>
	</CommonModal>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { CloseOutlined } from '@ant-design/icons-vue';
import CommonTable from '@/components/common/CommonTable.vue'
import CommonPagination from '@/components/common/CommonPagination.vue'
import CommonSearch from '@/components/common/CommonSearch.vue'
import SearchItem from '@/components/common/CommonSearchItem.vue'
import picker from '@/components/common/datePicker.vue';
import CommonModal from '@/views/baseInfoManage/dictionary/components/CommonModal.vue';
import traveInfo from './traveInfo.vue';
import api from '@/api';
import { message } from 'ant-design-vue/es';
import { cloneDeep } from 'lodash';
import { useTravelStore } from '@/stores/modules/travelManagement';
import dayjs from 'dayjs';
const travelStore = useTravelStore();
const router = useRouter();
const route = useRoute();
const isRefresh = ref('0')
const back = () => {
	dateFormRef.value?.resetFields()
	formRef.value?.resetFields()
	router.push({
		name: 'individualTouristsGroup',
		/* name: 'electronicContratList',
		params: {
			isRefresh: isRefresh.value
		} */
	})
}
const isAdd = ref(true)
const dataOid = ref()
const scroll = { y: '60vh' }
const labelWidth = '110px'
const labelCol = { style: { width: labelWidth } }
const addContractVisible = ref(false)
const form = ref({})
const formRef = ref()
const dateFormRef = ref()
type Key = string | number;
const selectedRowKeys = ref<Key[]>([])
const selectedContract = ref<any[]>([])
const state = reactive({
	contractTable: {
		data: [],
		param: {
			pageNo: 1,
			pageSize: 10000,
			startTime: undefined,
			key: undefined,
			contractNo: undefined
		}
	}
})
const { contractTable } = toRefs(state)
const formRules = {
	routeName: [{ required: true, trigger: 'blur', message: '给拼团线路取个名字' }],
	guideOid: [{ required: true, trigger: 'blur', message: '请选择本社签约导游' }],
	travelOperatorName: [{ required: true, trigger: 'blur', message: '请输入联系人姓名' }],
	travelOperatorPhone: [{ required: true, trigger: 'blur', message: '请输入联系人手机号' }],
	contractDays: [{ required: true, trigger: 'blur', message: '请输入合同天数' }],
	groupTypeName: [{ required: true, trigger: 'blur', message: '散客组团类型不能为空' }],
	touristPeopleNumber: [{ required: true, trigger: 'blur', message: '游客人数不能为空' }],
}
const dateFormat = 'YYYY-MM-DD';
const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
const activeKey = ref('1')
const CloneActiveKey = ref('1')
const guideOption = ref([])
const contractColumns1 = [
	{
		title: '序号',
		dataIndex: 'index',
		key: 'index',
	},
	{
		title: '合同编号',
		dataIndex: 'contractNo',
		key: 'contractNo',
	},
	{
		title: '合同类型',
		dataIndex: 'contractTypeName',
		key: 'contractTypeName',
	},
	{
		title: '内含线路/委托项目',
		dataIndex: 'lineNames',
		key: 'lineNames',
	},
	{
		title: '人数',
		dataIndex: 'touristPeopleNumber',
		key: 'touristPeopleNumber',
	},
	{
		title: '行程日期',
		dataIndex: 'tripDate',
		key: 'tripDate',
	},
	{
		title: '合同签约旅行社',
		dataIndex: 'companyName',
		key: 'companyName',
	},
	{
		title: '签署网点',
		dataIndex: 'storeName',
		key: 'storeName',
	},
	{
		title: '合同费用（元）',
		dataIndex: 'contractAmount',
		key: 'contractAmount',
	},
]
const contractColumns = [
	...contractColumns1,
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		width: 208
	}
]
const feeColumns = [
	{
		title: '序号',
		dataIndex: 'index',
		key: 'index',
	},
	{
		title: '费用类型',
		dataIndex: 'contractNo',
		key: 'contractNo',
	},
	{
		title: '费用生效时间',
		dataIndex: 'lineNames',
		key: 'lineNames',
	},
	{
		title: '单价(元/人）',
		dataIndex: 'touristPeopleNumber',
		key: 'touristPeopleNumber',
	},
	{
		title: '人数（成人）',
		dataIndex: 'itineraryNo',
		key: 'itineraryNo',
	},
	{
		title: '人数（儿童）',
		dataIndex: 'contractEstablish',
		key: 'contractEstablish',
	},
	{
		title: '费用（元）',
		dataIndex: 'creatorName',
		key: 'creatorName',
	},
]
const hotelColumns = [
	{
		title: '序号',
		dataIndex: 'index',
		key: 'index',
	},
	{
		title: '酒店类型',
		dataIndex: 'contractNo',
		key: 'contractNo',
	},
	{
		title: '酒店名称',
		dataIndex: 'lineNames',
		key: 'lineNames',
	},
	{
		title: '房间数量',
		dataIndex: 'touristPeopleNumber',
		key: 'touristPeopleNumber',
	},
	{
		title: '入住时间',
		dataIndex: 'itineraryNo',
		key: 'itineraryNo',
	},
	{
		title: '入住时间',
		dataIndex: 'contractEstablish',
		key: 'contractEstablish',
	},
	{
		title: '单价（元）',
		dataIndex: 'creatorName',
		key: 'creatorName',
	},
	{
		title: '最大可入住人数',
		dataIndex: 'creatorName',
		key: 'creatorName',
	},
	{
		title: '金额（元）',
		dataIndex: 'creatorName',
		key: 'creatorName',
	},
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		width: 208
	}
]
const ticketColumns = [
	{
		title: '序号',
		dataIndex: 'index',
		key: 'index',
	},
	{
		title: '景区名称',
		dataIndex: 'contractNo',
		key: 'contractNo',
	},
	{
		title: '日期',
		dataIndex: 'lineNames',
		key: 'lineNames',
	},
	{
		title: '门票名称',
		dataIndex: 'touristPeopleNumber',
		key: 'touristPeopleNumber',
	},
	{
		title: '单价（元）',
		dataIndex: 'itineraryNo',
		key: 'itineraryNo',
	},
	{
		title: '团队游客人数',
		dataIndex: 'contractEstablish',
		key: 'contractEstablish',
	},
	{
		title: '购票人数',
		dataIndex: 'creatorName',
		key: 'creatorName',
	},
	{
		title: '金额（元）',
		dataIndex: 'creatorName',
		key: 'creatorName',
	},
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		width: 208
	}
]
const productsColumns = [
	{
		title: '序号',
		dataIndex: 'index',
		key: 'index',
	},
	{
		title: '产品名称',
		dataIndex: 'priceName',
		key: 'priceName',
	},
	{
		title: '费用生效时间',
		dataIndex: 'time',
		key: 'time',
	},
	{
		title: '人数（成人）',
		dataIndex: 'adultNumber',
		key: 'adultNumber',
	},
	{
		title: '成人价',
		dataIndex: 'adultPrice',
		key: 'adultPrice',
	},
	{
		title: '人数（儿童）',
		dataIndex: 'childNumber',
		key: 'childNumber',
	},
	{
		title: '儿童价',
		dataIndex: 'childPrice',
		key: 'childPrice',
	},
	{
		title: '总费用（元）',
		dataIndex: 'individualSubtotal',
		key: 'individualSubtotal',
	},
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		width: 208
	}
]
interface CostItem {
	priceName: string;
	adultPrice: string;
	childPrice: string;
	adultNumber: number;
	childNumber: number;
	individualSubtotal: string;
	time: [];
	isEdit: boolean,
	isOperate?: boolean
}
const dataCostSource = ref<CostItem[]>([])
const dateRules = {
	travelData: [
		{
			required: true,
			message: '请选择行程日期',
			trigger: 'change',
		},
	],
}
const addContractConform = () => {
	addContractVisible.value = false
}
const getContract = async () => {
	const res = await api.getContractList(state.contractTable.param)
	if (res) {
		state.contractTable.data = res.content.map((item: any) => {
			item.contractAmount = item.contractAmount / 100
			return {
				...item,
				key: item.oid
			}
		})
	}
}
const addContract = () => {
	addContractVisible.value = true
	getContract()
}
const addContractClose = () => {
	addContractVisible.value = false
	state.contractTable.param.startTime = undefined
	state.contractTable.param.key = undefined
	state.contractTable.param.contractNo = undefined
}
// 行程时间改变事件
const datePickerChange = () => {
	if (form.value.travelData) {
		form.value.startDate = form.value.travelData[0];
		form.value.endDate = form.value.travelData[1];
		const diff = dayjs(form.value.endDate).diff(form.value.startDate, 'hour')
		form.value.groupTypeName = diff <= 24 ? '一日游' : '多日游'
		form.value.groupType = diff <= 24 ? 3 : 4
	} else {
		form.value.startDate = '';
		form.value.endDate = '';
		form.value.groupTypeName = '';
		form.value.groupType = undefined;
	}
}

const getTraveDetail = () => {
	// const traveListData = JSON.parse(sessionStorage.getItem('traveList') as any) || {};
	// console.log(traveListData, 'traveListData')
	if (!route.query.id && !dataOid.value) {
		travelStore.setBaseInfo({});
		travelStore.setGuideList([]);
		travelStore.setTouristList([]);
		travelStore.setTrafficList([]);
		return;
	}
	api.travelManagement
		.getItineraryDetail(
			{
				oid: route.query.id || dataOid.value,
				pageNo: 1,
				pageSize: 100000,
			},
			true
			// isSaveBtn.value
		)
		.then((res: any) => {
			res.basic.teamId = res.basic.itineraryNo;
			res.basic.time = [res.basic.startDate, res.basic.endDate];
			res.basic.touristNum = res.basic.touristCount || 0;
			travelStore.setBaseInfo(res.basic);
			res.attachmentList.length && travelStore.setFileInfo(res.attachmentList);
			travelStore.setGuideList(res.guideList);
			travelStore.setTouristList(
				res.touristList.content.map((it: any) => {
					if (it.specialCertificatePicture instanceof String) {
						it.specialCertificatePicture = it.specialCertificatePicture?.split(',');
					}

					return it;
				})
			);
			res.transportList = res.transportList.map((it: any) => {
				it.time = [it.startDate, it.endDate];
				return it;
			});
			travelStore.setTrafficList(res.transportList);
			res.waitBuyItem.waitBuyHotel = res.waitBuyItem.waitBuyHotel
				? res.waitBuyItem.waitBuyHotel.map((it: any) => {
					it.hotelId = it.productId;
					it.hotelName = it.productName;
					return it;
				})
				: [];
			res.waitBuyItem.waitBuyTicket = res.waitBuyItem.waitBuyTicket
				? res.waitBuyItem.waitBuyTicket.map((it: any) => {
					it.scenicId = it.productId;
					it.scenicName = it.productName;
					return it;
				})
				: [];
			const hotel = [
				...res.waitBuyItem.waitBuyHotel,
				...res.hotelList.map((it: any) => {
					it.orderFee = it.orderFee / 100;
					return it;
				}),
				...travelStore.templateHotel,
			];
			travelStore.hotels = [...hotel] as any;
			travelStore.productList = res.productList;
			travelStore.scenicTickets = [
				...res.waitBuyItem.waitBuyTicket,
				...res.ticketList.map((it: any) => {
					it.unitPrice = it.unitPrice / 100;
					return it;
				}),
				...travelStore.templateTicket,
			] as any;
			travelStore.insuranceStatus = res.insuranceStatus?.toString();
			travelStore.checkInsurance = res.insuranceStatus ? true : false;
			travelStore.teamTime = [res.basic.startDate, res.basic.endDate] as any;
			// travelStore.setDisabled = disDate(res);
			// const dateTime = disTime(res);
			// travelStore.setStarEndHMS = dateTime
			// travelStore.defaultStartTime = new Date(2022, 12, 1, dateTime.start.hour, dateTime.start.min, dateTime.start.second);
			// travelStore.defaultEndTime = new Date(2022, 12, 1, dateTime.end.hour, dateTime.end.min, dateTime.end.second)
			// console.log(travelStore.setStarEndHMS.start, travelStore.setStarEndHMS.end, '-----');
			// travelStore.setDisabledTime = disabledRangeTime(travelStore.setStarEndHMS.start, travelStore.setStarEndHMS.end) as any;
			// route.query.tab && setTimeout(() => (activeKey.value = Number(route.query.tab)));
			// getHealthCode();
		});
};

// 步骤跳转
const nextTep = (val: string) => {
	const a = Promise.all([
		formRef.value?.validateFields(),
		dateFormRef.value?.validate()
	])
	a.then(async () => {
		activeKey.value = val
		if (val === '2') {
			await saveDraft()
			getTraveDetail()
		}
	}).catch((error: Error) => {
		activeKey.value = CloneActiveKey.value
		console.log(error);
	})
}
const tabClick = () => {
	CloneActiveKey.value = cloneDeep(activeKey.value)
}
const deleteContract = (index: number, record: any) => {
	selectedContract.value.splice(index, 1)
	selectedRowKeys.value.splice(index, 1)
	form.value.touristPeopleNumber -= record.touristPeopleNumber
	form.value.touristPeopleNumber = form.value.touristPeopleNumber === 0 ? undefined : form.value.touristPeopleNumber
	form.value.totalExpenses -= record.contractAmount
}
const onSelectChange = (Keys: Key[], selectedRows: any[]) => {
	selectedRowKeys.value = Keys;
	if (selectedRows.length) {
		const select: any = []
		let touristPeopleSum = 0
		let totalExpenses = 0
		selectedRows.forEach((item: any) => {
			touristPeopleSum += item.touristPeopleNumber
			totalExpenses += item.contractAmount
			select.push({
				contractId: item.oid,
				contractType: item.contractType
			})
		})
		form.value.totalExpenses = totalExpenses
		form.value.touristPeopleNumber = touristPeopleSum
		form.value.contracts = select
	} else {
		form.value.touristPeopleNumber = undefined
	}
	selectedContract.value = selectedRows
};
const guideChange = (val: any) => {
	if (val) {
		let guideName
		for (let i = 0; i < guideOption.value.length; i++) {
			const element = guideOption.value[i];
			if (element.oid === form.value.guideOid) {
				guideName = element.guideName
				break
			}
		}
		form.value.guide = {
			guideOid: form.value.guideOid,
			guideName
		}
	}
}
const saveDraft = async () => {
	return new Promise((resolve, reject) => {
		const a = Promise.all([
			formRef.value?.validateFields(),
			dateFormRef.value?.validate()
		])
		a.then(async () => {
			if (isAdd.value) {
				const res = await api.createIndividualItinerary(form.value)
				if (res) {
					dataOid.value = res
					resolve(dataOid.value)
					message.success('保存草稿成功！')
				}
			}
		}).catch((error: Error) => {
			console.log(error);
		})
	})
}

const checkDetails = (id: number) => {

}
// 添加行程费用
const handleCostAdd = () => {
	const newData = {
		isEdit: true,
		isOperate: true,
		priceName: "",
		adultPrice: "",
		childPrice: "",
		adultNumber: 0,
		childNumber: 0,
		individualSubtotal: "",
		time: []
	};
	dataCostSource.value.push(newData);
};
// 删除行程费用
const onCostDelete = (index: number) => {
	dataCostSource.value.splice(index, 1)
};
const save = (obj: any) => {
	obj.isEdit = false
};
const cancel = (obj: any) => {
	obj.isEdit = false
};
const edit = (obj: any) => {
	obj.isEdit = true
};
const getGuideList = async () => {
	let res = await api.travelManagement.getGuideList();
	guideOption.value = res;
}
onMounted(() => {
	getGuideList()
})
</script>

<style scoped lang="scss">
.content_box {
	padding: 20px;
}


.tag {
	margin-bottom: 20px;
	font-size: 16px;
	font-weight: 600;
}

.close_btn {
	cursor: pointer;
}

.form_item_box {
	display: flex;

	.form_item {
		flex: 1;
	}
}

.add_box {
	width: 100%;
	justify-content: end;
	align-items: center;
	display: flex;
	margin-bottom: 10px;
}

.cost_count {
	margin: 10px 0 20px;
	width: inherit;
	height: 60px;
	display: flex;
	line-height: 60px;
	font-size: 16px;
	background: #f2f2f2;

	.cost_item {
		flex: 1;
		text-align: center;

		&:first-child {
			border-right: 1px solid #e1e1e1;
		}
	}
}

.table-area {
	padding: unset
}

.operation {
	text-align: center;
	margin-top: 20px;
}

.append {
	margin-left: 40px;
	cursor: pointer;
	color: #209cd3;
}

.mr40 {
	margin-right: 40px;
}
</style>