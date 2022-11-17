<template>
	<div class="table-container">
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
							<a class="item" @click="add(record.oid ? 'addHotelPop' : 'productRow', 'addHotelPop', record.oid || record)">编辑</a>
							<a class="item" @click="del(index)">删除</a>
						</div>
					</template>
				</template>
			</CommonTable>
			<div class="footer-btn">
				<a-button type="primary" @click="add('addHotelPop', 'addHotelPop')">添加</a-button>
			</div>
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

					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a class="item" @click="add(record.oid ? 'addTicketPop' : 'productRow', 'addTicketPop', record.oid || record)">编辑</a>
							<a class="item">删除</a>
						</div>
					</template>
				</template>
			</CommonTable>
			<div class="footer-btn">
				<a-button type="primary" @click="add('addTicketPop', 'addTicketPop')">添加</a-button>
			</div>
		</div>
		<div class="footer"><a-button type="primary">提交审核</a-button></div>
	</div>
	<addHotel :productRow="editId.productRow" :hotelId="editId.addHotelPop" v-model="addHotelPop" />
	<addTicket :productRow="editId.productRow" :ticketId="editId.addTicketPop" v-model="addTicketPop" />
	<!-- <Personnel v-model="selectPersonnelPop" :routeId="gouvyId.id" :isReductionPassed="gouvyId.isReductionPassed"/>
	<reserveTicket :ticketId="editId.reserveTicketPop" v-model="reserveTicketPop" />
	<reserveTicket :ticketId="editId.reserveTicketPop" v-model="reserveTicketPop"  />
	<showTicket :ticketId="showId.showTicketPop" v-model="showTicketPop"/>
	<showHotel :hotelId="showId.showHotelPop" v-model="showHotelPop" /> -->
</template>
<script lang="ts" setup>
import CommonTable from '@/components/common/CommonTable.vue';
import addHotel from './addHotel.vue';
import addTicket from './addTicket.vue';
// import Personnel from './selectPersonnel.vue';
// import reserveTicket from './reserveTicket.vue';
// import showTicket from './showTicket.vue';
// import showHotel from './showHotel.vue';
import { useTraveInfo } from './edit';
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
	del,
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
	isReductionPassed
} = useTraveInfo(props, emits);
onMounted(() => {
	onSearch();
});
</script>
<style lang="less" scoped>
::v-deep(.ant-table-selection-column) {
	width: 50px;
}
.table-container{
	padding: 20px 0;
	.footer{
		width: 100%;
		text-align: center;
	}
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
