<template>
	<div class="table-container">
		<div class="item-container">
			<p class="title">预定酒店</p>
			<CommonTable :columns="hotelColumns" :dataSource="holteDate" :scrollY="false">
				<template #bodyCell="{ column, text, index, record }">
					<template v-if="column.key === 'index'">
						<div>
							{{ index + 1 }}
						</div>
					</template>
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a v-if="travelStore.reserveStatus && record.orderStatus == 0" class="item"
								@click="reserveHotel(record)">预定</a>
							<a v-if="travelStore.teamStatus" class="item"
								@click="add('HOTEL', record.oid ? 'addHotelPop' : 'productRow', 'addHotelPop', index, record.oid || record)">编辑</a>
							<a v-if="travelStore.teamStatus" class="item" @click="delHotel(record, index)">删除</a>
							<a class="item" @click="show('showHotelPop', record.oid)">查看</a>
						</div>
					</template>
				</template>
			</CommonTable>
			<div class="footer-btn">
				<a-button type="primary" @click="add('HOTEL', 'addHotelPop', 'addHotelPop')"
					v-if="travelStore.teamStatus">添加</a-button>
			</div>
		</div>
		<div class="item-container">
			<p class="title">预订景区门票</p>
			<CommonTable :columns="ticketColumns" :dataSource="ticketData" :scrollY="false">
				<template #bodyCell="{ column, text, index, record }">
					<template v-if="column.key === 'index'">
						<div>
							{{ index + 1 }}
						</div>
					</template>

					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<!--  v-if="travelStore.reserveStatus && record.orderStatus == 0" -->
							<a v-if="travelStore.reserveStatus" @click="reserveTicketPeple(record)">预定</a>
							<a v-if="travelStore.teamStatus" class="item"
								@click="add('TICKET', record.oid ? 'addTicketPop' : 'productRow', 'addTicketPop', index, record.oid || record)">编辑</a>
							<a v-if="travelStore.teamStatus" class="item" @click="delTicket(record, index)">删除</a>
							<a class="item" @click="show('showTicketPop', record.oid)">查看</a>
						</div>
					</template>
				</template>
			</CommonTable>
			<div class="footer-btn">
				<a-button type="primary" @click="add('TICKET', 'addTicketPop', 'addTicketPop')"
					v-if="travelStore.teamStatus">添加</a-button>
			</div>
		</div>
		<div class="item-container">
			<p class="title">综费</p>
			<CommonTable ref="tableRef" rowKey="oid"
				:row-selection="{ selectedRowKeys: selectedRowKeys, type: 'radio', onChange: onSelectChange }"
				v-if="allFeesProducts.length > 1" :columns="columns" :dataSource="allFeesProducts" :scrollY="false">
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
	</div>
	<addHotel :productRow="editId.productRow" :hotelId="editId.addHotelPop" v-model="addHotelPop" />
	<addTicket :productRow="editId.productRow" :ticketId="editId.addTicketPop" v-model="addTicketPop" />
	<Personnel v-model="selectPersonnelPop" :routeId="gouvyId.id" :isReductionPassed="gouvyId.isReductionPassed"
		:isInitiateReduction="gouvyId.isInitiateReduction" />
	<!-- <reserveTicket :ticketId="editId.reserveTicketPop" v-model="reserveTicketPop" /> -->
	<reserveTicket :orderNo="editId.orderNo" :ticketId="editId.reserveTicketPop" v-model="reserveTicketPop" />
	<showTicket :ticketId="showId.showTicketPop" v-model="showTicketPop" />
	<showHotel :hotelId="showId.showHotelPop" v-model="showHotelPop" />
</template>
<script lang="ts" setup>
import CommonTable from '@/components/common/CommonTable.vue';
import addHotel from '@/views/travelManagement/traveInfo/addHotel.vue';
import addTicket from '@/views/travelManagement/traveInfo/addTicket.vue';
import Personnel from '@/views/travelManagement/traveInfo/selectPersonnel.vue';
import reserveTicket from '@/views/travelManagement/traveInfo/reserveTicket.vue';
import showTicket from '@/views/travelManagement/traveInfo/showTicket.vue';
import showHotel from '@/views/travelManagement/traveInfo/showHotel.vue';
import { useTraveInfo } from '@/views/travelManagement/traveInfo/traveInfo';
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
	columnsIndex
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
