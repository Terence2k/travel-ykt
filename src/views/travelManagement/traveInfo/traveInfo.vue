<template>
	<div class="table-container">
		<div class="item-container">
			<p class="title">古维管理费</p>
			<CommonTable :columns="gouvyColumns" :dataSource="gouvyDate" :scrollY="false">
				<template #bodyCell="{ column, text, index, record }">
					<template v-if="column.key === 'touristNum'" > 
						<span v-if="travelStore.baseInfo.status !=11 ">{{ travelStore.touristList.length }}人 </span>
					</template>
					<template v-if="column.key === 'payableNum'">
						<div class="action-btns" v-if="!travelStore.reserveStatus">
							<span >预计{{ travelStore.touristList.length }}人 </span>
						</div>
						<div v-if="travelStore.reserveStatus " >
							<span >预计{{ record.payableNum }}人 </span>
						</div>
					</template>
					<template v-if="column.key === 'payablePrice'">
						<span v-if="!travelStore.reserveStatus ">{{accMul(travelStore.touristList.length,payablePrice)}}元 </span>
						<span v-else>{{accDiv(record.payablePrice,100)}}元 </span>
					</template>
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a class="item" v-if="record.issueStatus==0" @click="choice({selectPersonnelPop:'selectPersonnelPop',id:route.query.id,isReductionPassed:record.isReductionPassed,isInitiateReduction:record.isInitiateReduction})">去出票</a>
							<a class="item" v-if="record.isInitiateReduction==1 && record.isReductionPassed==0"  @click="seeReject('modelValue')">查看驳回原因</a>
							<a class="item" v-if="record.issueStatus==1" @click="see({ticketingValue:'ticketingValue',itineraryId:record.itineraryId})">查看出票情况</a>
						</div>
					</template>
				</template>
			</CommonTable>
		<BaseModal title="查看驳回原因" v-model="modelValue" :width="500">
			<p>古维管理员 {{gouvyDate[0].lastUpdaterName}} 于 {{gouvyDate[0].lastUpdateTime}} 驳回</p>
			<p>驳回原因：{{gouvyDate[0].refuesedReason}}</p>
			<p>您可以重新修改减免申请信息，重新提交审核。</p>
			<template v-slot:footer>
				<a-button @click="modelValue = false">取消</a-button>
			</template>
		</BaseModal>
		<BaseModal title="古维出票记录" v-model="ticketingValue" :width="1000">
			<p>当前古维费已经于 {{ticketingDate.issueTime}} 全部出票。全部游客{{ticketingDate.total}}名,已减免{{ticketingDate.reduceNum}}人,实缴{{ticketingDate.paidNum}}人。</p>
			<CommonTable :columns="ticketingColumns" :dataSource="ticketingDate.touristList" :scrollY="false">
				<template #bodyCell="{ column, text, index, record }">
					<template v-if="column.key === 'actualPrice'">
						<span>{{accDiv(record.actualPrice,100)}}</span>
					</template>
				</template>
			</CommonTable>
			<template v-slot:footer>
					<a-button @click="ticketingValue = false">取消</a-button>
			</template>
		</BaseModal>
		</div>
		<div class="item-container">
			<p class="title">综费产品</p>
			<CommonTable 
				ref="tableRef"
				rowKey="oid" 
				:row-selection="{selectedRowKeys: selectedRowKeys,type: 'radio',onChange: onSelectChange}" 
				v-if="travelStore.isOptional" :columns="columns" 
				:dataSource="allFeesProducts" :scrollY="false">
				<template #bodyCell="{ column, text, index, record }">
					<template v-if="column.key === 'index'">
						<div>
							{{ index + 1 }}
						</div>
					</template>
					<template v-if="column.key === 'feeModel'">
						{{ column.data[text] }}
					</template>

					<template v-if="column.key === 'feeNumber'">
						{{ text / 100 || 0 }}
					</template>

					<template v-if="column.key === 'totalMoney'">
						{{ text / 100 || 0 }}
					</template>
				</template>
			</CommonTable>
			<CommonTable v-else :columns="columns" :dataSource="allFeesProducts" :scrollY="false">
				<template #bodyCell="{ column, text, index, record }">
					<template v-if="column.key === 'index'">
						<div>
							{{ index + 1 }}
						</div>
					</template>
					<template v-if="column.key === 'feeModel'">
						{{ column.data[text] }}
					</template>
					
					<template v-if="column.key === 'feeNumber'">
						{{ text / 100 || 0 }}
					</template>

					<template v-if="column.key === 'totalMoney'">
						{{ text / 100 || 0 }}
					</template>
				</template>
			</CommonTable>
		</div>
		<div class="item-container">
			<p class="title">景区门票</p>
			<CommonTable :columns="ticketColumns" :dataSource="ticketData" :scrollY="false">
				<template #bodyCell="{ column, text, index, record }">
					<template v-if="column.key === 'index'">
						<div>
							{{ index + 1 }}
						</div>
					</template>

					<template v-if="column.key === 'totalFee'">
						<div>
							{{ record.unitPrice * record.reservePeopleCount || 0 }}
						</div>
					</template>

					
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<!--  v-if="travelStore.reserveStatus && record.orderStatus == 0" -->
							<a v-if="travelStore.reserveStatus" @click="reserveTicketPeple(record, index)">预定</a>
							<!--  v-if="travelStore.teamStatus" -->
							<a :class="{'disabled': !travelStore.teamStatus}" class="item" @click="add('TICKET', record.oid ? 'addTicketPop' : 'productRow', 'addTicketPop', index, record.oid || record)">编辑</a>
							<a :class="{'disabled': !travelStore.teamStatus}" class="item" @click="delTicket(record, index)">删除</a>
							<!-- <a class="item" v-if="record.oid" @click="show('showTicketPop', record.oid)">查看</a> -->
						</div>
					</template>
				</template>
			</CommonTable>
			<div class="footer-btn">
				<a-button type="primary" @click="add('TICKET', 'addTicketPop', 'addTicketPop')" v-if="travelStore.teamStatus">添加</a-button>
			</div>
		</div>
		<div class="item-container">
			<p class="title">酒店住宿</p>
			<CommonTable :columns="hotelColumns" :dataSource="holteDate" :scrollY="false">
				<template #bodyCell="{ column, text, index, record }">
					<template v-if="column.key === 'index'">
						<div>
							{{ index + 1 }}
						</div>
					</template>
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a v-if="travelStore.reserveStatus && record.orderStatus == 0" class="item" @click="reserveHotel(record)">预定</a>
							<a :class="{'disabled': !travelStore.teamStatus}" class="item" @click="add('HOTEL', record.oid ? 'addHotelPop' : 'productRow', 'addHotelPop', index, record.oid || record)">编辑</a>
							<a :class="{'disabled': !travelStore.teamStatus}" class="item" @click="delHotel(record, index)">删除</a>
							<!-- <a class="item" v-if="record.oid" @click="show('showHotelPop', record.oid)">查看</a> -->
						</div>
					</template>
				</template>
			</CommonTable>
			<div class="footer-btn">
				<a-button type="primary" @click="add('HOTEL', 'addHotelPop', 'addHotelPop')" v-if="travelStore.teamStatus">添加</a-button>
			</div>
		</div>
	</div>
	<addHotel :productRow="editId.productRow" :hotelId="editId.addHotelPop" v-model="addHotelPop" />
	<addTicket :productRow="editId.productRow" :ticketId="editId.addTicketPop" v-model="addTicketPop" />
	<Personnel v-model="selectPersonnelPop" :routeId="gouvyId.id" :isReductionPassed="gouvyId.isReductionPassed" :isInitiateReduction="gouvyId.isInitiateReduction" />
	<!-- <reserveTicket :ticketId="editId.reserveTicketPop" v-model="reserveTicketPop" /> -->
	<reserveTicket :orderNo="editId.orderNo" :ticketId="editId.reserveTicketPop" v-model="reserveTicketPop"  />
	<showTicket :ticketId="showId.showTicketPop" v-model="showTicketPop"/>
	<showHotel :hotelId="showId.showHotelPop" v-model="showHotelPop" />
</template>
<script lang="ts" setup>
import CommonTable from '@/components/common/CommonTable.vue';
import addHotel from './addHotel.vue';
import addTicket from './addTicket.vue';
import Personnel from './selectPersonnel.vue';
import reserveTicket from './reserveTicket.vue';
import showTicket from './showTicket.vue';
import showHotel from './showHotel.vue';
import { useTraveInfo } from './traveInfo';
import { accDiv, accMul } from '@/utils/compute';
import { GroupStatus } from '@/enum';
import BaseModal from '@/components/common/BaseModal.vue';
const route = useRoute();
const props = defineProps({
	onCheck: {
		type: Boolean,
	},
});
const emits = defineEmits(['onSuccess']);

const {
	columns,
	ticketColumns,
	gouvyColumns,
	addHotelPop,
	addTicketPop,
	selectPersonnelPop,
	hotelColumns,
	tableData,
	allFeesProducts,
	editableData,
	edit,
	save,
	add,
	holteDate,
	ticketData,
	gouvyDate,
	delHotel,
	delTicket,
	choice,
	editId,
	reserveHotel,
	reserveTicketPop,
	travelStore,
	aa,
	onSearch,
	payablePrice,
	show,
	showHotelPop,
	showTicketPop,
	showId,
	gouvyId,
	rowRadioSelection,
	id,
	modelValue,
	seeReject,
	see,
	ticketingValue,
	ticketingColumns,
	ticketingDate,
	isReductionPassed,
	isInitiateReduction,
	selectedRowKeys,
	onSelectChange,
	reserveTicketPeple,
	columnsIndex,
} = useTraveInfo(props, emits);
onMounted(() => {
	onSearch();
});
</script>
<style lang="less" scoped>
::v-deep(.ant-table-selection-column) {
	width: 50px;
}
.select-guide {
	width: 115px;
	color: #d5d5d5;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.footer-btn {
	display: flex;
	justify-content: flex-end;
	margin: 16px 20px;
}
.title {
	font-size: 16px;
	font-weight: bold;
	padding-left: 20px;
	margin-top: 20px;
}
.item-container {
	&:first-of-type {
		.title {
			margin-top: 0;
		}
	}
}
</style>
