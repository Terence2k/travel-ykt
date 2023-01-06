<template>
	<div class="top">
		<p>当前行程单还未发生核销，可以整团撤销作废。</p>
		<section>
			<a-button class="btn" type="primary" @click="check('All')">整团撤销</a-button>
			<!-- <a-button type="primary" @click="check('REVOKE')">撤销重提</a-button> -->
		</section>
	</div>
	<div class="table_box">
		<p class="top-p">行程单ID:{{ state.basicData.itineraryNo }}<span></span></p>
		<table class="info_table" cellpadding="16px" border="1">
			<tr class="row">
				<td class="key">线路名称</td>
				<td class="value" colspan="3">{{ state.basicData.routeName }}</td>
			</tr>
			<tr class="row">
				<td class="key">团队类型</td>
				<td class="value">{{ state.basicData.groupTypeName }}</td>
				<td class="key">散团团队类型</td>
				<td class="value">{{ state.basicData.teamTypeName }}</td>
			</tr>
			<!-- <tr class="row">
				<td class="key">组团社</td>
				<td class="value">{{ state.basicData.travelName }}</td>
				<td class="key">组团社计调</td>
				<td class="value">{{ state.basicData.travelOperatorName + ' ' + state.basicData.travelOperatorPhone }}</td>
			</tr> -->
			<tr class="row">
				<td class="key">行程时间</td>
				<td class="value">{{ state.basicData.travelName }}</td>
				<td class="key">导游</td>
				<td class="value">{{ state.basicData.travelOperatorName + ' ' + state.basicData.travelOperatorPhone }}</td>
			</tr>
			<tr class="row">
				<td class="key">散客拼团社</td>
				<td class="value">{{ state.basicData.subTravelName }}</td>
				<td class="key">中心操作员</td>
				<td class="value">{{ state.basicData.subTravelOperatorName + ' ' + state.basicData.subTravelOperatorPhone }}</td>
			</tr>
			<tr class="row">
				<td class="key">电子合同数量</td>
				<td class="value">{{ state.basicData.touristCount }}</td>
				<td class="key">游客总人数</td>
				<td class="value">{{ state.basicData.touristCount }}</td>
			</tr>
			<tr class="row">
				<td class="key">古维费代收人数</td>
				<td class="value">{{ state.basicData.touristCount }}</td>
				<td class="key">古维费应缴人数</td>
				<td class="value">{{ state.basicData.guWeiCount }}</td>
			</tr>
			<tr class="row">
				<td class="key">行程时间</td>
				<td class="value">{{ state.basicData.startDate + '-' + state.basicData.endDate }}</td>
				<td class="key">综费应缴人数</td>
				<td class="value">{{ state.basicData.productPeopleCount }}</td>
			</tr>
			<tr class="row">
				<td class="key">已添加景区</td>
				<td class="value">{{ state.basicData.ticketCount }}</td>

				<td class="key">已添加酒店</td>
				<!-- <td class="value">{{ state.hotelList.length }}</td> -->
				<td class="value">{{ state.basicData.hotelCount }}</td>
			</tr>
			<tr class="row">
				<td class="key">已添加餐厅</td>
				<td class="value">{{ state.basicData.cateringCount }}</td>
				<td class="key">行程冻结金额(元)</td>
				<td class="value">{{ state.basicData.totalFee / 100 }}</td>
			</tr>
			<tr class="row">
				<td class="key">联系人</td>
				<td class="value">{{ state.basicData.subTravelOperatorName }}</td>
				<td class="key">联系人电话</td>
				<td class="value">{{ state.basicData.travelOperatorPhone }}</td>
			</tr>
			<tr class="row">
				<td class="key">关联行程单</td>
				<td class="value">{{ state.basicData.itineraryNo }}</td>
				<td class="key">保险购买方</td>
				<td class="value">{{ state.basicData.insuranceStatusName }}</td>
			</tr>
			<tr class="row">
				<td class="key">用车车牌</td>
				<td class="value">{{ state.basicData.itineraryNo }}</td>
				<td class="key"></td>
				<td class="value"></td>
			</tr>
		</table>
		<!-- <p class="top-p">导游信息<span></span></p>
		<CommonTable :columns="guide" :dataSource="state.guideList" rowKey="oid" :scrollY="false" style="margin-bottom: 40px; padding: 0px">
			<template #bodyCell="{ column, record, index }">
				<template v-if="column.key === 'index'"> {{ index + 1 }} </template>
				<template v-if="column.key === 'endDate'"> {{ record.startDate }} - {{ record.endDate }} </template>
			</template>
		</CommonTable> -->

		<p class="top-p">游客信息<span></span></p>
		<CommonTable :columns="tourist" :dataSource="state.touristList" rowKey="oid" :scrollY="false" style="margin-bottom: 40px; padding: 0px">
			<template #bodyCell="{ column, record, index }">
				<template v-if="column.key === 'endDate'"> {{ record.startDate }} - {{ record.endDate }} </template>
				<template v-if="column.key === 'certificateType'"> {{ certificateTypeList[record.certificateType] }} </template>
				<template v-if="column.key === 'codeContent'">
					<a-image :src="record.codeContent"></a-image>
				</template>
				<template v-if="column.key === 'healthCodeStatus'">
					{{ getCode[record.healthCodeStatus] }}
				</template>
			</template>
		</CommonTable>
		<p class="top-p">交通信息<span></span></p>
		<CommonTable :columns="trafficInfo" :dataSource="state.transportList" rowKey="oid" :scrollY="false" style="margin-bottom: 40px; padding: 0px">
			<template #bodyCell="{ column, record, index }">
				<template v-if="column.key === 'endDate'"> {{ record.startDate }} - {{ record.endDate }} </template>
			</template>
		</CommonTable>

		<p class="top-p">已选择的合同<span></span></p>
		<CommonTable :columns="contract" :dataSource="state.contract" rowKey="oid" :scrollY="false" style="margin-bottom: 40px; padding: 0px">
			<template #bodyCell="{ column, record, index }">
				<template v-if="column.key === 'index'"> {{ index + 1 }} </template>
				<template v-if="column.key === 'endDate'"> {{ record.startDate }} - {{ record.endDate }} </template>
			</template>
		</CommonTable>
		<p class="top-p">
			古维管理费
			<!-- <span>(共30人,古维待缴人数:25,应缴费用:￥1250.00 订单状态：待出票)</span> -->
		</p>
		<CommonTable :columns="gouvy" :dataSource="state.guWeiDetail" rowKey="oid" :scrollY="false" style="margin-bottom: 40px; padding: 0px">
		</CommonTable>
		<p class="top-p">
			综费产品
			<!-- <span>(费用总计:800.guWeiDetail)</span> -->
		</p>
		<CommonTable :columns="comprehensive" :dataSource="state.productList" rowKey="oid" :scrollY="false" style="margin-bottom: 40px; padding: 0px">
			<template #bodyCell="{ column, record, index }">
				<template v-if="column.key === 'isDaily'">
					{{ record.isDaily ? '是' : '否' }}
				</template>

				<template v-if="column.key === 'unitPrice'">
					<span v-if="typeof record.unitPrice === 'number'">
						{{ record.unitPrice / 100 }}
					</span>
				</template>
				<template v-if="column.key === 'totalFee'">
					<span v-if="typeof record.totalFee === 'number'">
						{{ record.totalFee / 100 }}
					</span>
				</template>
			</template>
		</CommonTable>
		<p class="top-p">
			酒店费用<span>
				<!-- (已预订1个酒店,最大可入住人数:30人;房间数量:17;费用总计:12050.00元) -->
			</span>
		</p>
		<CommonTable :columns="hotel" :dataSource="state.hotelList" rowKey="oid" :scrollY="false" style="margin-bottom: 40px; padding: 0px">
			<template #bodyCell="{ column, record, index }">
				<template v-if="column.key === 'limitPeople'">
					{{ record.roomTypeList[0].limitPeople }}
				</template>
				<template v-if="column.key === 'roomTypeName'">
					{{ record.roomTypeList[0].roomTypeName }}
				</template>
				<template v-if="column.key === 'roomCount'">
					{{ record.roomTypeList[0].roomCount }}
				</template>
				<template v-if="column.key === 'orderFee'">
					<span v-if="typeof record.orderFee === 'number'">
						{{ record.orderFee / 100 }}
					</span>
				</template>
			</template>
		</CommonTable>
		<p class="top-p">
			景区费用<span>
				<!-- (已预订2个景区,游玩人数:30人;门票数量:30;费用总计:1050.00元) -->
			</span>
		</p>
		<CommonTable :columns="scenic" :dataSource="state.ticketList" rowKey="oid" :scrollY="false" style="margin-bottom: 40px; padding: 0px">
			<template #bodyCell="{ column, record, index }">
				<template v-if="column.key === 'unitPrice'">
					<span v-if="typeof record.unitPrice === 'number'">
						{{ record.unitPrice / 100 }}
					</span>
				</template>
			</template>
		</CommonTable>

		<!-- <p class="top-p">已上传的附件</p>
		<CommonTable :columns="enclosure" :dataSource="state.attachmentList" rowKey="oid" :scrollY="false">
			<template #bodyCell="{ column, record, index }">
				<template v-if="column.key === '1'">
					<a-image :src="img.attachmentUrl" :key="img.attachmentUrl" v-for="img in record[1]"></a-image>
				</template>
				<template v-if="column.key === '2'">
					<a-image :src="img.attachmentUrl" :key="img.attachmentUrl" v-for="img in record[2]"></a-image>
				</template>
				<template v-if="column.key === '3'">
					<a-image :src="img.attachmentUrl" :key="img.attachmentUrl" v-for="img in record[3]"></a-image>
				</template>
				<template v-if="column.key === '4'">
					<a-image :src="img.attachmentUrl" :key="img.attachmentUrl" v-for="img in record[4]"></a-image>
				</template>
			</template>
		</CommonTable> -->
	</div>

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
import reapply from './revoke/reapply.vue';
import AllRevoke from './revoke/allRevoke.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
const navigatorBar = useNavigatorBar();

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
		dataIndex: 'guideLevel',
		key: 'guideLevel',
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
		dataIndex: 'feeModelName',
		key: 'feeModelName',
	},
	{
		title: '是否按天收取',
		dataIndex: 'isDaily',
		key: 'isDaily',
	},
	{
		title: '单价（元）',
		dataIndex: 'unitPrice',
		key: 'unitPrice',
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
		title: '总金额（元）',
		dataIndex: 'totalFee',
		key: 'totalFee',
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
const contract = [
	{
		title: '序号',
		dataIndex: 'index',
		key: 'index',
	},
	{
		title: '合同编号',
		dataIndex: 'No',
		key: 'No',
	},
	{
		title: '合同类型',
		dataIndex: 'roomTypeName',
		key: 'roomTypeName',
	},
	{
		title: '内含线路/委托项目',
		dataIndex: 'roomCount',
		key: 'roomCount',
	},
	{
		title: '人数',
		dataIndex: 'sourceAddressName',
		key: 'sourceAddressName',
	},
	{
		title: '行程日期',
		dataIndex: 'createTime',
		key: 'createTime',
	},
	{
		title: '合同签约旅行社',
		dataIndex: 'endDate',
		key: 'endDate',
	},
	{
		title: '签署网点',
		dataIndex: 'orderFee',
		key: 'orderFee',
	},
	{
		title: '合同费用（元)',
		dataIndex: 'orderFee',
		key: 'orderFee',
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

		reRecokeAuditCheckText.value = error?.msg || error;
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
	navigatorBar.setNavigator(['旅行社管理', '散客拼团', '行程详情：' + route.currentRoute.value?.query?.itineraryNo]);
});

onBeforeUnmount(() => {
	navigatorBar.clearNavigator();
});
</script>
<style scoped lang="less">
.table_box {
	max-height: 80vh;
	// padding: 1px 0;
	// overflow: auto;
	width: 95%;
	margin: 0 auto;
	.row {
		width: 100%;
		font-size: 14px;
		font-family: Microsoft YaHei UI;
		font-weight: 400;
		color: #1e2226;
		border: 1px solid #e9e9e9;
		td {
			text-align: center;
		}
	}

	.change_table {
		width: 100%;

		.key,
		.key_hd {
			width: 150px;
		}

		.key_hd {
			background: rgba(245, 247, 250, 0.39);
		}

		.value {
			min-width: 300px;
		}
	}

	.info_table {
		width: 100%;

		.key {
			width: 150px;
			background: rgba(245, 247, 250, 0.39);
		}
		.value {
			min-width: 300px;
		}
		margin-bottom: 20px;
	}
	.top-p {
		font-weight: bold;
		font-size: 18px;
		margin-bottom: 20px;
		margin-left: 10px;
	}
}
.top {
	width: 95%;
	display: flex;
	justify-content: space-between;
	margin: 0 auto;
	border-bottom: 3px solid rgb(121, 121, 121);
	padding: 10px 0px;
	margin-bottom: 10px;
	.btn {
		margin-right: 20px;
	}
}
</style>
