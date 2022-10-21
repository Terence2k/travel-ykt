state.rulesRef = {} const rule = await validateRules(rules, state.editableData, key) for (let k in rule) { state.rulesRef[k] = rule[k] } const res =
await validateFields(state.formRef); import { validateRules, validateFields, generateGuid } from '@/utils'; const rules = { time: [{ required: true,
message: '请选择带团时间' }], guideOid: [{ required: true, message: '请选择导游' }] } rulesRef: { 1: { guideName: [{ required: true, message:
'请选择行程类型' }] } }, 16 讨厌 外婆 建设路 class EventEmitter { constructor() { this.event = {}; } on(name, callBack) { if (!this.event[`${name}`])
{ this.event[`${name}`] = []; } this.event[`${name}`].push(callBack); return this; } off(name, callBack) { if (this.event[`${name}`]) {
this.event[`${name}`] = this.event[`${name}`].filter( (item) => item !== callBack ); } } emit(name, ...args) { if (this.event[`${name}`]) {
this.event[`${name}`].forEach((callBack) => { callBack(...args); }); } } once(name, callBack) { const wrapFn = (...args) => { callBack(...args);
this.off(name, callBack); }; this.on(name, wrapFn); } } 房型库存提示 import { defineStore } from 'pinia'; import { GroupMode, GroupStatus, Gender,
GuideType, FeeModel,insuranceType} from '@/enum'; import api from '@/api/index'; import { cloneDeep } from 'lodash'; import { Field } from '@/type';
interface TraveDataItem { groupType: GroupMode.All | GroupMode.TeamGroup |GroupMode.NoTeamGroup; [k: string]: any } export const traveListParams = {
total: 0, list: [], params: { pageNo: 1, pageSize: 10, status: 0, startDate: '', endDate: '', keyWord: '', keyWordType: 1, groupType: '', time: [] } }
export const useTravelStore = defineStore({ id: 'travel', state: () => ({ // info groupMode: { [GroupMode.All]: '全部', [GroupMode.TeamGroup]:
'协作组团', [GroupMode.NoTeamGroup]: '非协作组团' }, groupStatus: { [GroupStatus.Drafts]: '草稿', [GroupStatus.WaitingGroup]: '待接团',
[GroupStatus.RefuseGroup]: '拒绝接团', // [GroupStatus.WaitRegiment]: '待出团', [GroupStatus.HaveABall]: '已接团', [GroupStatus.WaitingChange]:
'待变更', [GroupStatus.CloseAnAccount]: '已结算', [GroupStatus.Cancellation]: '已撤销', [GroupStatus.Overtime]: '审核超时', }, guideType: {
[GuideType.UnderGuide]: '直属导游', [GuideType.AppointGuide]: '可委派导游' }, genderList: [ { name: '男', codeValue: Gender.Male }, { name: '女',
codeValue: Gender.Madam } ], insuranceList: [ { name: '旅责险', codeValue: insuranceType.brigade }, { name: '意外险', codeValue:
insuranceType.accident } ], IDCard: [], specialId: [], trafficType: [], trafficColor: [], baseInfo: { subTravelOperator: {}, teamType: '', startDate:
'', endDate: '' }, guideList: [], touristList: [], trafficList: [], traveInfo: {}, fileInfo: {}, compositeProducts: [], hotels: [], scenicTickets: [],
teamType: '', feeModel: { [FeeModel.Number]: '人数', [FeeModel.Price]: '价格' }, traveList: { drafts: cloneDeep(traveListParams), waitingGroup:
cloneDeep(traveListParams), haveABall: cloneDeep(traveListParams), refuseGroup: cloneDeep(traveListParams), waitingChange: cloneDeep(traveListParams),
closeAnAccount: cloneDeep(traveListParams), cancellation: cloneDeep(traveListParams), overtime: cloneDeep(traveListParams) }, enterpriseState: [ {
stateName: '未提交', descriptions: '信息不完善，待补充。' }, { stateName: '待审核', descriptions: '已提交信息变更审核，请耐心等待。' }, { stateName:
'审核通过', descriptions: '' }, { stateName: '审核未通过', descriptions: '信息变更申请被驳回！' } ], businessTypeOptions: { 'TRAVEL': { submitFunc:
'submitInformationAudit' }, 'HOTEL': { submitFunc: 'editHotelDetailInfo' }, 'TICKET': { submitFunc: 'changeScenicSpotInformation' } } }), getters: {
// count(): string { // return this.info; // }, }, actions: { async getTravelList(params: object) { let res = await
api.travelManagement.getTravelList(params); res.content = res.content.map((it:TraveDataItem) => { it.time = it.startDate + '-' + it.endDate;
it.groupTypeStr = this.groupMode[it.groupType] return it }) return res }, async getTraveCode(codeValue: string, type: string) { const res = await
api.commonApi.getCodeValue({codeValue}) switch(type) { case 'IDCard' : this.IDCard = res; break; case 'specialId' : this.specialId = res; break; case
'trafficType' : this.trafficType = res; break; case 'trafficColor' : this.trafficColor = res; break; } }, setTouristList(list: any) { this.touristList
= list }, setBaseInfo(data: any) { this.baseInfo = data }, setGuideList(list: any) { this.guideList = list }, setTrafficList(list: any) {
this.trafficList = list }, setTraveInfo(data: any) { this.traveInfo = data }, setFileInfo(data: any) { this.fileInfo = data },
setCompositeProducts(data: any) { this.compositeProducts = data; }, setTeamType(data: any) { this.teamType = data; }, setTraveList(data: any, key:
Field) { this.traveList[key].list = data.content this.traveList[key].total = data.total } }, }); 根据酒店星级id查询已开业的酒店信息
房型审核状态（0.未提交 1.待审核 2.新增审核通过 3.新增审核不通过 4.编辑审核通过 5.编辑审核不通过 6.删除审核通过 7.删除审核不通过） .ant-select-selector
{ position: relative; background-color: #fff; border: 1px solid #d9d9d9; border-radius: 2px; transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355,
1); } localhost:8000/ykt/hotel-service/public/api/hotel-room-type/showAuditRoomType/{1}

<template>
	<div class="roomType-check-wrapper">
		<CommonTable :columns="columns" :data-source="dataSource">
			<template #bodyCell="{ column, record, text }">
				<div>
					<template v-if="['roomTypeName', 'price', 'roomNum'].includes(column.dataIndex)">
						<div>
							<span>{{ text }}</span>
						</div>
					</template>
					<template v-if="['systemRoomName'].includes(column.dataIndex)">
						<div>
							<span>{{ text }}</span>
						</div>
					</template>
					<template v-if="['roomOccupancyNum'].includes(column.dataIndex)">
						<div>
							<span>{{ text }}</span>
						</div>
					</template>
					<template v-if="column.dataIndex === 'actions'">
						<div class="cell-actions">
							<span>{{ getActionText(record.operationType) }}</span>
						</div>
					</template>
				</div>
			</template>
		</CommonTable>
		<div class="footer">
			<div class="button-container">
				<a-button @click="auditPass" class="button">审核通过</a-button>
				<a-button @click="auditFail" class="button">审核不通过</a-button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue/es';
import api from '@/api';
import CommonTable from '@/components/common/CommonTable.vue';
const route = useRoute();
const userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
const columns = [
	{
		title: '自定义房型',
		dataIndex: 'roomTypeName',
		key: 'roomTypeName',
		width: '12%',
	},
	{
		title: '系统房型',
		dataIndex: 'systemRoomName',
		key: 'systemRoomName',
		width: '12%',
	},
	{
		title: '诚信指导价',
		dataIndex: 'price',
		key: 'price',
		width: '8%',
	},
	{
		title: '房间数量',
		dataIndex: 'roomNum',
		key: 'roomNum',
		width: '8%',
	},
	{
		title: '房间可入住人数',
		dataIndex: 'roomOccupancyNum',
		key: 'roomOccupancyNum',
		width: '44%',
	},

	{
		title: '操作类型',
		dataIndex: 'actions',
		key: 'actions',
		width: 160,
	},
];
interface DataSourceItem {
	hotelId: string | number;
	key: string | number;
	oid: string | number;
	roomTypeCode?: string | number;
	roomTypeName: string;
	systemRoomName: string;
	price: number;
	roomNum: number;
	roomOccupancyNum: number;
}

const state = reactive({
	hotelId: 0,
	auditOrderId: '',
});

const dataSource: DataSourceItem[] = ref([]);

const initPage = () => {
	api
		.getRoomDetailInfoInAuditStatus(state.hotelId)
		.then((res) => {
			console.info(`id${state.hotelId}审核中的房型信息:`, res);

			if (Array.isArray(res) && res.length > 0) {
				state.auditOrderId = res[0]?.auditOrderId;
				dataSource.value = res.map((item) => {
					return {
						...item,
						price: item.price / 100,
						key: item?.oid,
					};
				});
			} else {
				dataSource.value = [];
			}
		})
		.catch((err) => {
			console.error(err);
		});
};

watch(
	() => route.query,
	(res) => {
		state.hotelId = res?.id;
		if (state.hotelId) {
			initPage();
		}
	},
	{
		immediate: true,
	}
);

const auditPass = () => {
	api.getRoleId({ uuid: state.auditOrderId }).then((res) => {
		console.log('getRoleInfo：', res);
		if (Array.isArray(res) && res[0]?.roleId === null && res[0]?.auditBusinessType) {
			const roleId = userInfo.sysRoles[0].oid;
			console.log('任选当前一个用户身份,当前roleId为：', roleId);
			api.auditRoomDetailInfo(state.auditOrderId, roleId, res[0]?.auditBusinessType, true).then((res) => {
				console.log('房型审核通过返回：', res);
				initPage();
			});
		} else if (Array.isArray(res) && res[0]?.roleId && res[0]?.auditBusinessType) {
			console.log('当前roleId为：', res[0]?.roleId);
			api.auditRoomDetailInfo(state.auditOrderId, res[0]?.roleId, res[0]?.auditBusinessType, true).then((res) => {
				console.log('房型审核通过返回：', res);
				initPage();
			});
		} else {
			console.log('获取role失败');
		}
	});
};

const auditFail = () => {
	api.getRoleId({ uuid: state.auditOrderId }).then((res) => {
		console.log('getRoleInfo：', res);
		if (res[0]?.roleId === null && res[0]?.auditBusinessType) {
			const roleId = userInfo.sysRoles[0].oid;
			console.log('任选当前一个用户身份,当前roleId为：', roleId);
			api.auditRoomDetailInfo(state.auditOrderId, roleId, res[0].auditBusinessType, false).then((res) => {
				console.log('房型审核通过返回：', res);
				initPage();
			});
		} else if (res[0]?.roleId && res[0]?.auditBusinessType) {
			console.log('当前roleId为：', res[0]?.roleId);
			api.auditRoomDetailInfo(state.auditOrderId, res[0].roleId, res[0].auditBusinessType, false).then((res) => {
				console.log('房型审核通过返回：', res);
				initPage();
			});
		} else {
			console.log('获取role失败');
		}
	});
};

const getActionText = (code) => {
	let resultText = '';
	switch (code) {
		case 0:
			resultText = '新增';
			break;
		case 1:
			resultText = '编辑';
			break;
		case 2:
			resultText = '删除';
			break;
	}
	return resultText;
};
</script>

<style lang="less" scoped>
@import './styles/roomType-check.less';
</style>
