<template>
	<div class="table-container">
		<div class="item-container">
			<p class="title">古维管理费</p>
			<CommonTable :columns="gouvyColumns" :dataSource="gouvyDate" :scrollY="false">
				<template #bodyCell="{ column, text, index, record }">
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a class="item">-</a>
						</div>
					</template>
					<template v-if="column.key === 'NumberOfPersonsPayable'">
						<div class="action-btns">
							{{record.NumberOfPersonsPayable}}
							<a class="item" @click="choice('selectPersonnelPop')">选择人数</a>
						</div>
					</template>
					
				</template>
			</CommonTable>
		</div>
		<div class="item-container">
			<p class="title">综费产品</p>
			<CommonTable :columns="columns" :dataSource="allFeesProducts" :scrollY="false">
				<template #bodyCell="{ column, text, index, record }">
					<template v-if="column.key === 'index'">
						<div>
							{{ index + 1 }}
						</div>
					</template>
					<template v-if="column.key === 'feeModel'">
						{{ column.data[text] }}
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

					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a v-if="travelStore.reserveStatus && record.orderStatus == 0" @click="add('reserveTicketPop', record.oid)">预定</a>
							<a v-if="travelStore.teamStatus" class="item" @click="add('addTicketPop', record.oid)">编辑</a>
							<a v-if="travelStore.teamStatus" class="item">删除</a>
							<a class="item" @click="show('showTicketPop', record.oid)">查看</a>
						</div>
					</template>
				</template>
			</CommonTable>
			<div class="footer-btn">
				<a-button type="primary" @click="add('addTicketPop')" v-if="travelStore.teamStatus">添加</a-button>
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
							<a v-if="travelStore.teamStatus" class="item" @click="add('addHotelPop', record.oid)">编辑</a>
							<a v-if="travelStore.teamStatus" class="item" @click="del(index)">删除</a>
							<a class="item" @click="show('showHotelPop', record.oid)">查看</a>
						</div>
					</template>
				</template>
			</CommonTable>
			<div class="footer-btn">
				<a-button type="primary" @click="add('addHotelPop')" v-if="travelStore.teamStatus">添加</a-button>
			</div>
		</div>
	</div>
	<addHotel :hotelId="editId.addHotelPop" v-model="addHotelPop" />
	<addTicket :ticketId="editId.addTicketPop" v-model="addTicketPop" />
	<Personnel v-model="selectPersonnelPop" />
	<reserveTicket :ticketId="editId.reserveTicketPop" v-model="reserveTicketPop"  />
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
	show,
	showHotelPop,
	showTicketPop,
	showId
} = useTraveInfo(props, emits);
</script>
<style lang="less" scoped>
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
