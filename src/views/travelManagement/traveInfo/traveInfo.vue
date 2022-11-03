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
						<div class="action-btns" v-if="travelStore.baseInfo.status !=11 ">
							<span >预计{{ travelStore.touristList.length }}人 </span>
						</div>
						<div v-if="travelStore.baseInfo.status ==11 " >
							<span >预计{{ record.payableNum }}人 </span>
							<a class="item" @click="choice('selectPersonnelPop')" >选择人数</a>
						</div>
					</template>
					<template v-if="column.key === 'payablePrice'">
						<span v-if="travelStore.baseInfo.status !=11 ">{{accMul(travelStore.touristList.length,payablePrice)}}元 </span>
					</template>
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a class="item"></a>
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
							<a v-if="travelStore.reserveStatus" @click="add('reserveTicketPop', record.oid)">预定</a>
							<a v-if="travelStore.teamStatus" class="item" @click="add('addTicketPop', record.oid)">编辑</a>
							<a v-if="travelStore.teamStatus" class="item">删除</a>
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
							<a v-if="travelStore.reserveStatus" class="item" @click="reserveHotel(record)">提交预定</a>
							<a v-if="travelStore.teamStatus" class="item" @click="add('addHotelPop', record.oid)">编辑</a>
							<a v-if="travelStore.teamStatus" class="item" @click="del(index)">删除</a>
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
	<reserveTicket :ticketId="editId.reserveTicketPop" v-model="reserveTicketPop" />
</template>
<script lang="ts" setup>
import CommonTable from '@/components/common/CommonTable.vue';
import addHotel from './addHotel.vue';
import addTicket from './addTicket.vue';
import Personnel from './selectPersonnel.vue';
import reserveTicket from './reserveTicket.vue';
import { useTraveInfo } from './traveInfo';
import { accDiv, accMul } from '@/utils/compute';
import { GroupStatus } from '@/enum';

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
	payablePrice
} = useTraveInfo(props, emits);
onMounted(() => {
	onSearch();
});
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
