<template>
	<BaseModal title="第三方门票退订提醒" v-model="reRecokeAuditCheckVisible">
		<p>{{ reRecokeAuditCheckText }}</p>
		<p>请等待退订完成</p>
		<template v-slot:footer>
			<a-button @click="reRecokeAuditCheckVisible = false">确定</a-button>
			<!-- <a-button @click="toSureRecoke">确定</a-button> -->
		</template>
	</BaseModal>

	<!-- <BaseModal title="第三方门票退订成功" v-model="reRecokeAuditTipsVisible">
		<p>原始行程单中 玉龙雪山索道、印象丽江演出票 已 成功退订。现在可以继续申请原始行程单的撤销。</p>
		<template v-slot:footer>
			<a-button @click="openTips" type="primary">继续撤销</a-button>
		</template>
	</BaseModal> -->

	<BaseModal title="整团撤销提醒" v-model="reRecokeAuditAllsVisible">
		<p>是否直接整团撤销？整团撤销需要组团社计调 、古维管理员审核。审核通过后系统会自动为 您撤销该行程，已冻结金额将返回给组团社。</p>
		<template v-slot:footer>
			<a-button @click="reRecokeAuditAllsVisible = false">取消</a-button>
			<a-button @click="openAllReapply" type="primary">继续撤销</a-button>
		</template>
	</BaseModal>

	<BaseModal title="撤销、重提提醒" v-model="reRecokeAuditVisible">
		<p>是否确认撤销该行程？系统将先自动作废当前 行程单，之后您需要重新填报一条新行程单。 系统会自动记录新行程单与当前行程单的关联</p>
		<template v-slot:footer>
			<a-button @click="reRecokeAuditVisible = false">取消</a-button>
			<a-button @click="openReapply" type="primary">继续</a-button>
		</template>
	</BaseModal>

	<reapply ref="reapplyRef" @finish="successAudit = true" :params="state" />
	<AllRevoke ref="allRevokeRef" />
	<BaseModal title="撤销申请成功" v-model="successAudit">
		<p>
			行程单
			{{ route.currentRoute.value.query.itineraryNo }}
			已提交撤销， 请等待组团社计调、古维管理员依次审核。
		</p>
		<template v-slot:footer>
			<a-button @click="successAudit = false" type="primary">确定</a-button>
		</template>
	</BaseModal>
</template>
<script lang="ts" setup>
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import BaseModal from '@/components/common/BaseModal.vue';
import { message } from 'ant-design-vue';
import { Modal } from 'ant-design-vue';
import api from '@/api/index';
import { AuditStaus } from '@/enum';
import reapply from './components/reapply.vue';
import AllRevoke from './components/allRevoke.vue';

const route = useRouter();
const state = reactive({
	total: 0,
	params: {
		pageNo: 1,
		pageSize: 10,
	},
	tableData: [],
	basicData: {},
	hotelList: [],
	guideList: [],
	ticketList: [],
	touristList: [],
	transportList: [],
	attachmentList: [],
	productList: [],
	guWeiDetail: [],
});
const guide = [
	{
		title: '编号',
		dataIndex: 'index',
		key: 'index',
	},
	{
		title: '导游姓名',
		dataIndex: 'guideName',
		key: 'guideName',
	},
	{
		title: '导游星级',
		dataIndex: 'certificateTypeName',
		key: 'certificateTypeName',
	},
	{
		title: '导游证编号',
		dataIndex: 'guideCertificateNo',
		key: 'guideCertificateNo',
	},
	{
		title: '性别',
		dataIndex: 'genderName',
		key: 'genderName',
	},
	{
		title: '导游电话',
		dataIndex: 'guidePhone',
		key: 'guidePhone',
	},
	{
		title: '已选带团时间',
		dataIndex: 'endDate',
		key: 'endDate',
	},
];
const certificateTypeList = {
	PASSPORT: '护照',
	IDENTITY_CARD: '身份证',
};
const tourist = [
	{
		title: '游客姓名',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: '证件类型',
		dataIndex: 'certificateType',
		key: 'certificateType',
	},
	{
		title: '证件号码',
		dataIndex: 'certificateNo',
		key: 'certificateNo',
	},
	{
		title: '性别',
		dataIndex: 'genderName',
		key: 'genderName',
	},
	{
		title: '联系方式',
		dataIndex: 'phone',
		key: 'phone',
	},
	{
		title: '客源地',
		dataIndex: 'sourceAddressName',
		key: 'sourceAddressName',
	},
	{
		title: '健康码',
		dataIndex: 'codeContent',
		key: 'codeContent',
	},
	{
		title: '中高风险',
		dataIndex: 'healthCodeStatus',
		key: 'healthCodeStatus',
	},
	{
		title: '特殊证件',
		dataIndex: 'discountRuleId',
		key: 'discountRuleId',
	},
];
const trafficInfo = [
	{
		title: '交通类型',
		dataIndex: 'transportationType',
		key: 'transportationType',
	},
	{
		title: '车牌号',
		dataIndex: 'licencePlateNumber',
		key: 'licencePlateNumber',
	},
	{
		title: '车牌颜色',
		dataIndex: 'licencePlateColor',
		key: 'licencePlateColor',
	},
	{
		title: '车企名称',
		dataIndex: 'companyName',
		key: 'companyName',
	},
	{
		title: '核载人数',
		dataIndex: 'approvedLoad',
		key: 'approvedLoad',
	},
	{
		title: '用车时段',
		dataIndex: 'endDate',
		key: 'endDate',
	},
	{
		title: '驾驶员',
		dataIndex: 'driver',
		key: 'driver',
	},
];
const gouvy = [
	{
		title: '费用名称',
		dataIndex: 'touristName',
		key: 'touristName',
	},
	{
		title: '团队游客人数',
		dataIndex: 'certificateTypeName',
		key: 'certificateTypeName',
	},
	{
		title: '应缴人数',
		dataIndex: 'certificateNo',
		key: 'certificateNo',
	},
	{
		title: '应缴总金额（元）',
		dataIndex: 'genderName',
		key: 'genderName',
	},
	{
		title: '是否发起过减免申请',
		dataIndex: 'sourceAddressName',
		key: 'sourceAddressName',
	},
	{
		title: '减免申请是否通过',
		dataIndex: 'discountRuleId',
		key: 'discountRuleId',
	},
	{
		title: '出票状态',
		dataIndex: 'discountRuleId',
		key: 'discountRuleId',
	},
	{
		title: '操作',
		dataIndex: 'action',
		key: 'action',
	},
];
const comprehensive = [
	{
		title: '费用名称',
		dataIndex: 'touristName',
		key: 'touristName',
	},
	{
		title: '结算归属',
		dataIndex: 'certificateTypeName',
		key: 'certificateTypeName',
	},
	{
		title: '收费模式',
		dataIndex: 'certificateNo',
		key: 'certificateNo',
	},
	{
		title: '是否按天收取',
		dataIndex: 'genderName',
		key: 'genderName',
	},
	{
		title: '单价（元）',
		dataIndex: 'sourceAddressName',
		key: 'sourceAddressName',
	},
	{
		title: '人数',
		dataIndex: 'discountRuleId',
		key: 'discountRuleId',
	},
	{
		title: '行程天数',
		dataIndex: 'discountRuleId',
		key: 'discountRuleId',
	},
	{
		title: '总金额（元）',
		dataIndex: 'discountRuleId',
		key: 'discountRuleId',
	},
	{
		title: '操作',
		dataIndex: 'action',
		key: 'action',
	},
];
const hotel = [
	{
		title: '酒店名称',
		dataIndex: 'hotelName',
		key: 'hotelName',
	},
	{
		title: '可入住人数',
		dataIndex: 'limitPeople',
		key: 'limitPeople',
	},
	{
		title: '房型',
		dataIndex: 'roomTypeName',
		key: 'roomTypeName',
	},
	{
		title: '房间数量',
		dataIndex: 'roomCount',
		key: 'roomCount',
	},
	{
		title: '入住天数',
		dataIndex: 'sourceAddressName',
		key: 'sourceAddressName',
	},
	{
		title: '入住时间',
		dataIndex: 'createTime',
		key: 'createTime',
	},
	{
		title: '离店时间',
		dataIndex: 'endDate',
		key: 'endDate',
	},
	{
		title: '费用总计（元）',
		dataIndex: 'orderFee',
		key: 'orderFee',
	},
	{
		title: '订单状态',
		dataIndex: 'orderStatusName',
		key: 'orderStatusName',
	},
];
const scenic = [
	{
		title: '景区名称',
		dataIndex: 'scenicName',
		key: 'scenicName',
	},
	{
		title: '游玩日期',
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
		title: '费用（元）',
		dataIndex: 'unitPrice',
		key: 'unitPrice',
	},
	{
		title: '订单状态',
		dataIndex: 'orderStatusName',
		key: 'orderStatusName',
	},
];
const enclosure = [
	{
		title: '旅行合同',
		dataIndex: '1',
		key: '1',
	},
	{
		title: '委托接待协议',
		dataIndex: '2',
		key: '2',
	},
	{
		title: '包车合同',
		dataIndex: '3',
		key: '3',
	},
	{
		title: '保险单',
		dataIndex: '4',
		key: '4',
	},
];
const reRecokeAuditVisible = ref(false);

const reRecokeAuditTipsVisible = ref(false);

const reRecokeAuditCheckVisible = ref(false);

const reRecokeAuditCheckText = ref('');

const reRecokeAuditAllsVisible = ref(false);

const successAudit = ref(false);

const openTips = () => {
	reRecokeAuditTipsVisible.value = false;
	reRecokeAuditAllsVisible.value = false;
	reRecokeAuditVisible.value = true;
};

//打开弹窗
const allRevokeRef = ref();

const openAllReapply = () => {
	reRecokeAuditAllsVisible.value = false;

	reRecokeAuditVisible.value = false;
	allRevokeRef.value.open();
};
//打开弹窗
const reapplyRef = ref();

const openReapply = () => {
	reRecokeAuditVisible.value = false;
	reapplyRef.value.open(btnStatus.value);
};

const checkPower = async () => {
	let pW = new FormData();

	pW.append('itineraryId', route.currentRoute.value?.query?.id);

	await api.travelManagement.repealNreapplyPage(pW);

	return true;
};

const checkOutSideTicketIsRefund = async () => {
	let pW = new FormData();

	pW.append('itineraryId', route.currentRoute.value?.query?.id);

	await api.travelManagement.checkOutSideTicketIsRefund(pW);

	return true;
};

const btnStatus = ref('');

const toSureRecoke = async () => {
	let params = {
		itineraryId: route.currentRoute.value?.query?.id,
		touristList: state.touristList,
	};
	await api.travelManagement.confirmSubmit(params);
	reRecokeAuditCheckVisible.value = false;
};

const check = async (status: string) => {
	let valid, validTikcer;
	btnStatus.value = status;

	try {
		valid = await checkPower();
		validTikcer = await checkOutSideTicketIsRefund();
		if (valid && validTikcer) {
			console.log('THROUGHT', status);
			btnStatus.value === 'REVOKE' ? (reRecokeAuditVisible.value = true) : (reRecokeAuditAllsVisible.value = true);
		}
	} catch (error: any) {
		// reRecokeAuditCheckText.value = error
		console.log(error, 'error');

		reRecokeAuditCheckText.value = error?.msg;
		reRecokeAuditCheckVisible.value = true;
	}
};

const getCode = {
	'00': '绿码',
	'01': '黄码',
	10: '红码',
};

const initInfo = () => {
	let queryData = {
		oid: route.currentRoute.value?.query?.id,
		pageNo: 1,
		pageSize: 100000,
	};
	api.travelManagement
		.getItineraryDetail(queryData)
		.then((res: any) => {
			state.basicData = res.basic;
			state.hotelList = res.hotelList;
			state.guideList = res.guideList;
			state.ticketList = res.ticketList;
			state.touristList = res.touristList.content;
			state.transportList = res.transportList;
			state.productList = res.productList;
			state.guWeiDetail = res.guWeiDetail;

			let arr = [{ 1: [], 2: [], 3: [], 4: [] }];

			res.attachmentList.map((item) => {
				arr[0][item.attachmentType].push(item);
			});

			state.attachmentList = arr;

			state.touristList.map(async (item) => {
				let res = await api.travelManagement.getHealthCode([{ name: item.name, certificateId: item.certificateNo }]);
				console.log(res[0], 'asdasd', Object.assign(item, res[0]), item);
				let o = Object.assign(item, res[0]);
				return o;
			});
			// state.itineraryDetail = res;
		})
		.catch((err: any) => {
			console.log(err);
		});
};

onMounted(() => {
	initInfo();
});
</script>
<style scoped lang="less"></style>
