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
									<div @click="getTourist" class="append">查看全部游客</div>
								</div>
							</a-form-item>
							<a-form-item name="licensePlate" label="用车车牌号">
								<a-input v-model:value="form.licensePlate" placeholder="输入车牌号">
								</a-input>
							</a-form-item>
						</div>
					</div>
					<div class="add_box">
						<div class="tag">选择合同</div>
						<div v-if="travelStore.teamStatus">
							<a-button @click="addContract" type="primary">添加</a-button>
						</div>
					</div>
					<CommonTable :dataSource="selectedContract" :columns="contractColumns">
						<template #bodyCell="{ column, record, index }">
							<template v-if="column.key === 'index'">
								{{ index + 1 }}
							</template>
							<template v-if="column.key === 'tripDate'">
								{{ record.tripStartTime + ' - ' + record.tripEndTime }}
							</template>
							<template v-if="column.key === 'action'">
								<div class="action-btns">
									<a @click="checkDetails(record.oid)">查看</a>
									<a @click="deleteContract(index, record)" :class="{ 'disabled': !travelStore.teamStatus }">删除</a>
								</div>
							</template>
						</template>
					</CommonTable>
					<div class="cost_count">
						<div class="cost_item">费用合计</div>
						<div class="cost_item">{{ form.totalExpenses }}</div>
					</div>
				</a-form>
				<div class="operation" v-if="travelStore.teamStatus">
					<a-button @click="saveDraft(true)" type="primary" style="margin-right:20px">保存草稿</a-button>
					<a-button @click="nextTep('2')" type="primary">下一步</a-button>
				</div>
			</a-tab-pane>
			<a-tab-pane key="2" tab="产品预订">
				<traveInfo></traveInfo>
				<div class="operation" v-if="travelStore.teamStatus">
					<a-button @click="saveDraft(true)" type="primary" style="margin-right:20px">保存草稿</a-button>
					<a-button @click="nextTep('1')" type="primary" style="margin-right:20px">上一步</a-button>
					<a-button @click="submitAudit" type="primary">提交审核</a-button>
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
	<CommonModal :title="`全部游客（${touristTable.data.length}人）`" v-model:visible="touristVisible" @close="touristClose"
		@cancel="touristClose" :is-cancel="false" :is-conform="false" width="65%">
		<CommonTable :dataSource="touristTable.data" :columns="touristColumns" :scroll="scroll">
			<template #bodyCell="{ column, record, text, index }">
				<template v-if="column.key === 'index'">
					{{ index + 1 }}
				</template>
				<template v-if="column.key === 'isHealthy'">
					{{ cmpIsHealthy(record.isHealthy) }}
				</template>
				<template v-if="column.key === 'isAncientUygur'">
					{{ cmpIsAncientUygur(record.isAncientUygur) }}
				</template>
				<template v-if="column.key === 'healthyCode'">
					<span :class="cmpHealthyColor(text)">{{ text }}</span>
				</template>
			</template>
		</CommonTable>
	</CommonModal>
	<CommonModal title="提交发团审核" v-model:visible="auditVisible" @close="auditVisible = false"
		@cancel="auditVisible = false" conform-text="确认" @conform="auditConform">
		{{ submitAuditInfo }}
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
import { disabledRangeTime, getAmount } from '@/utils';
const travelStore = useTravelStore();
const router = useRouter();
const route = useRoute();
const isRefresh = ref('0')
const back = () => {
	router.push({
		name: 'individualTouristsGroup',
		params: {
			isRefresh: isRefresh.value
		}
	})
}
const auditVisible = ref(false)
const touristVisible = ref(false)
const isAdd = ref(true)
const scroll = { y: '60vh' }
const labelWidth = '110px'
const labelCol = { style: { width: labelWidth } }
const addContractVisible = ref(false)
type formType = {
	routeName?: string
	guideOid?: number
	travelOperatorName?: string
	itineraryNo?: number
	selfTeamNo?: string
	travelData?: string[]
	groupTypeName?: string
	travelOperatorPhone?: string
	touristPeopleNumber?: number
	licensePlate?: string
	startDate?: string
	endDate?: string
	groupType?: number
	guideName?: string
	guide?: {
		guideOid?: number
		guideName?: string
		guideCertificateNo?: string
		guidePhone?: string
	}
	totalExpenses?: number
	oid?: string
	contracts?: {
		contractId: number,
		contractType: string
	}[]
	compositeProducts?: any[]
}
const form = ref<formType>({})
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
	},
	touristTable: {
		data: [],
	}
})
const { contractTable, touristTable } = toRefs(state)
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
const guideOption = ref<{
	oid: number
	guideName: string
	guideCertificateNo: string
	phone: string
}[]>([])
const touristColumns = [
	{
		title: '序号',
		dataIndex: 'index',
		key: 'index',
	},
	{
		title: '游客姓名',
		dataIndex: 'touristName',
		key: 'touristName',
	},
	{
		title: '身份证件类型',
		dataIndex: 'certificatesTypeName',
		key: 'certificatesTypeName',
	},
	{
		title: '身份证件号码',
		dataIndex: 'certificatesNo',
		key: 'certificatesNo',
	},
	{
		title: '游客类型',
		dataIndex: 'touristTypeName',
		key: 'touristTypeName',
	},
	{
		title: '性别',
		dataIndex: 'gender',
		key: 'gender',
	},
	{
		title: '年龄',
		dataIndex: 'age',
		key: 'age',
	},
	{
		title: '电话号码',
		dataIndex: 'phone',
		key: 'phone',
	},
	{
		title: '是否健康',
		dataIndex: 'isHealthy',
		key: 'isHealthy',
	},
	{
		title: '健康码',
		dataIndex: 'healthyCode',
		key: 'healthyCode',
	},
	{
		title: '古维费购买状态',
		dataIndex: 'isAncientUygur',
		key: 'isAncientUygur',
	},
]
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
const cmpIsHealthy = computed(() => (code: number) => {
	if (code === 1) {
		return '是'
	} else if (code === 0) {
		return '否'
	}
})
const cmpIsAncientUygur = computed(() => (code: number) => {
	if (code === 1) {
		return '已购'
	} else if (code === 0) {
		return '未购'
	}
})
const cmpHealthyColor = computed(() => (text: string) => {
	if (text === '绿码') {
		return 'green_text'
	} else if (text === '黄码') {
		return 'yellow_text'
	} else if (text === '红码') {
		return 'red_text'
	}
})
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
		formRef.value.clearValidate('groupTypeName')
	} else {
		form.value.startDate = '';
		form.value.endDate = '';
		form.value.groupTypeName = '';
		form.value.groupType = undefined;
	}
}
const setBaseInfo = (res: any) => {
	if (res) {
		const {
			routeName,
			groupType,
			groupTypeName,
			travelOperatorName,
			travelOperatorPhone,
			selfTeamNo,
			time,
			touristCount,
			itineraryNo,
			startDate,
			endDate
		} = res.basic
		const guideOid = res.guideList[0]?.guideOid
		const guideName = res.guideList[0]?.guideName
		const guideCertificateNo = res.guideList[0]?.guideCertificateNo
		const guidePhone = res.guideList[0]?.guidePhone
		const licensePlate = res.transportList[0]?.licencePlateNumber
		form.value.routeName = routeName
		form.value.groupType = groupType
		form.value.groupTypeName = groupTypeName
		form.value.travelOperatorName = travelOperatorName
		form.value.travelOperatorPhone = travelOperatorPhone
		form.value.selfTeamNo = selfTeamNo
		form.value.travelData = time
		form.value.touristPeopleNumber = touristCount
		form.value.itineraryNo = itineraryNo
		form.value.guideOid = guideOid
		form.value.licensePlate = licensePlate
		form.value.guideName = guideName
		form.value.startDate = startDate
		form.value.endDate = endDate
		form.value.guide = {
			guideOid,
			guideName,
			guideCertificateNo,
			guidePhone
		}
	}
}
const getTraveDetail = () => {
	travelStore.getItineraryStatus();
	// const traveListData = JSON.parse(sessionStorage.getItem('traveList') as any) || {};
	// console.log(traveListData, 'traveListData')
	if (!form.value.oid) {
		travelStore.setBaseInfo({});
		travelStore.setGuideList([]);
		travelStore.setTouristList([]);
		travelStore.setTrafficList([]);
		return;
	}
	api.travelManagement
		.getItineraryDetail(
			{
				oid: form.value.oid,
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
			setBaseInfo(res)
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
			route.query.tab && setTimeout(() => (activeKey.value = route.query.tab as string));
			if (route.query.tab === '2') {
				const allFeesProducts = travelStore.compositeProducts.map((it: any) => {
					it.peopleCount = travelStore.touristList.length;
					it.unPrice = it.feeNumber;
					it.dayCount = dayjs(travelStore.baseInfo.endDate).diff(travelStore.baseInfo.startDate, 'day');
					it.totalMoney = getAmount(it.confirmDailyCharge, it.feeNumber, it.feeModel);
					return it;
				});
				travelStore.setCompositeProducts(allFeesProducts);
				/* isSaveBtn.value = false;
				check.value = !check.value; */
			}
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
const deleteContract = (index: number, record: { touristPeopleNumber: number, contractAmount: number }) => {
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
		formRef.value.clearValidate('touristPeopleNumber')
	} else {
		form.value.touristPeopleNumber = undefined
	}
	selectedContract.value = selectedRows
};
const guideChange = (val: any) => {
	if (val) {
		let guideName, guideCertificateNo, guidePhone
		for (let i = 0; i < guideOption.value.length; i++) {
			const element = guideOption.value[i];
			if (element.oid === form.value.guideOid) {
				guideName = element.guideName
				guideCertificateNo = element.guideCertificateNo
				guidePhone = element.phone
				break
			}
		}
		form.value.guide = {
			guideOid: form.value.guideOid,
			guideName,
			guideCertificateNo,
			guidePhone
		}
	} else {
		form.value.guide = {
			guideOid: undefined,
			guideName: undefined,
			guideCertificateNo: undefined,
			guidePhone: undefined
		}
	}
}
const editDraft = async (callBack?: any) => {
	form.value.compositeProducts = travelStore.curentProduct
	api.editIndividualTouristsGroup(form.value).then((res: any) => {
		isRefresh.value = '1'
		callBack && callBack(res)
	})
}
const saveDraft = async (showMessage?: boolean) => {
	return new Promise((resolve, reject) => {
		const a = Promise.all([
			formRef.value?.validateFields(),
			dateFormRef.value?.validate()
		])
		a.then(async () => {
			if (isAdd.value) {
				const res = await api.createIndividualItinerary(form.value)
				if (res) {
					sessionStorage.setItem('traveList', JSON.stringify({ oid: res }));
					form.value.oid = res
					isAdd.value = false
					editDraft()
					resolve(res)
					showMessage && message.success('保存草稿成功！')
				}
			} else {
				editDraft((editRes: any) => {
					resolve(editRes)
					showMessage && message.success('保存草稿成功！')
				})
			}
		}).catch((error: Error) => {
			console.log(error);
		})
	})
}
// 批量获取健康码
const getHealthyCodes = async (ids: number[]) => {
	let res = await api.getHealthyCode(ids)
	if (res) {
		res.forEach((item: any) => {
			// 00:绿码，01：黄码，10：红码
			switch (item.healthCodeStatus) {
				case '00':
					item.codeName = '绿码'
					break;
				case '01':
					item.codeName = '黄码'
					break;
				case '10':
					item.codeName = '红码'
					break;
				default:
					item.codeName = '暂无健康码'
			}
		})
	}
	return res || []
}
const configCodeName = (certificateCodes: any, targetArr: any) => {
	for (let i = 0, l = certificateCodes.length; i < l; i++) {
		const item = certificateCodes[i];
		for (let j = 0, l = targetArr.length; j < l; j++) {
			const citem = targetArr[j];
			if (item.certificateId === citem.certificatesNo) {
				targetArr[j].healthyCode = item.codeName
			}
		}
	}
}
const getTourist = async () => {
	if (selectedContract.value.length > 0) {
		let params = selectedContract.value.map((item: any) => {
			return {
				type: item.contractType,
				oid: item.oid
			}
		})
		const res = await api.findIndividualContractTourist(params)
		if (res) {
			// 获取身份证列表
			const certificateIds = res.map((item: any) => {
				return { certificateId: item.certificatesNo }
			})
			// 根据身份证列表查询健康码列表
			const certificateCodes = await getHealthyCodes(certificateIds)
			// 将健康码和游客列表数据关联
			configCodeName(certificateCodes, res)

			touristTable.value.data = res
		} else {
			touristTable.value.data = []
		}
		touristVisible.value = true
	} else {
		message.error('请先选择合同！')
	}
}
const touristClose = () => {
	touristVisible.value = false
}
const auditConform = async () => {
	api.individualSubmitFinanceAudit(form.value.oid).then((res: any) => {
		auditVisible.value = false
		message.success('提交审核成功！')
		isRefresh.value = '2'
		back()
	})
}
const submitAuditInfo = ref('')
const submitAudit = async () => {
	await saveDraft()
	const res = await api.queryIndividualTotalFee(form.value.oid)
	if (res) {
		submitAuditInfo.value = res
		auditVisible.value = true
	}
}
const checkDetails = (id: number) => { }
const getGuideList = async () => {
	let res = await api.travelManagement.getGuideList();
	guideOption.value = res;
}
const getContractDetails = async () => {
	const res = await api.getContractDetails(form.value.oid)
	if (res) {
		selectedContract.value = res
		let keys: number[] = []
		selectedContract.value.forEach((item: any) => {
			keys.push(item.oid)
			item.contractAmount = item.contractAmount && item.contractAmount / 100
		})
		onSelectChange(keys, selectedContract.value)
	}
}
const findByIdTeamType = async () => {
	let allFeesProducts = []
	const res = await api.findIndividualTeamType();

	for (let i = 0; i < res.productVos.length; i++) {
		// 综费产品itemId为4
		if (res.productVos[i].itemId === 4) {
			if (!res.productVos[i].productId) {
				travelStore.isOptional = true;
				const res = await api.travelManagement.comprehensiveFeeProduct({
					pageNo: 1,
					pageSize: 99999,
					status: 1
				});
				allFeesProducts = res.content.map((it: any) => {
					it.isDaily = it.confirmDailyCharge ? true : false;
					it.productName = it.comprehensiveFeeProductName;
					return it;
				});
			} else {
				travelStore.isOptional = false;
				const result = await api.travelManagement.findProductInfo(res.productVos[i].productId)
				result.peopleCount = travelStore.touristList.length;
				result.unPrice = result.feeNumber;
				result.isDaily = result.confirmDailyCharge ? true : false;
				result.productName = result.comprehensiveFeeProductName;
				result.dayCount = dayjs(travelStore.baseInfo.endDate).diff(travelStore.baseInfo.startDate, 'day')
				result.totalMoney = getAmount(
					result.confirmDailyCharge,
					result.feeNumber,
					result.feeModel
				)
				allFeesProducts.push(result)

			}
		} else if (res.productVos[i].itemId === 2) {

		} else if (res.productVos[i].itemId === 1) {

		}

	}
	if (travelStore.productList[0]?.productId) {
		travelStore.curentProduct = allFeesProducts.filter((it: any) => it.oid === travelStore.productList[0].productId);
	} else if (allFeesProducts.length >= 1) {
		console.log(allFeesProducts)
		travelStore.curentProduct = cloneDeep([allFeesProducts[0]]);
	} else {
		travelStore.curentProduct = [];
	}
	travelStore.setCompositeProducts(allFeesProducts);
}
const resetFormFields = () => {
	dateFormRef.value?.resetFields()
	dateFormRef.value?.clearValidate()
	formRef.value?.resetFields()
	isAdd.value = true
	activeKey.value = '1'
	isRefresh.value = '0'
	form.value = {}
	state.contractTable.data = []
	state.contractTable.param.startTime = undefined;
	state.contractTable.param.key = undefined;
	state.contractTable.param.contractNo = undefined;
	state.touristTable.data = []
	selectedRowKeys.value = []
	selectedContract.value = []
	travelStore.hotels = []
	travelStore.productList = []
	travelStore.scenicTickets = []
	travelStore.curentProduct = []
	travelStore.compositeProducts = []
}
watch(
	() => route.query.id,
	(newVal) => {
		if (newVal) {
			form.value.oid = newVal as string
			isAdd.value = false
			getGuideList()
			findByIdTeamType()
			getContractDetails()
			getTraveDetail()
		}
	},
	{ immediate: true })

watch(
	() => route.name,
	(newVal) => {
		if (newVal === 'individualTouristsGroup') {
			resetFormFields()
		}
	},
)
onMounted(() => {
	getGuideList()
	findByIdTeamType()
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
	display: flex;
	justify-content: space-between;
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

.green_text {
	color: #71b621;
}

.yellow_text {
	color: #bfbe26;
}

.red_text {
	color: #d70095;
}
</style>