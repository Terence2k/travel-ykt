<template>
	<div class="table-container">
		<div class="header_top">
			<div class="head_title">当前正在变更行程信息，请根据实际需要，调整行程时间，添加或调整需要预订的产品，重新提交审核。</div>
		</div>
		<div class="item-container">
			<div class="title" v-if="tiemformshow == false">
				行程时间
				<span style="margin-left: 40px">{{ startTime }} —— {{ endTime }}</span>
				<span class="time_btn" @click="changTiemshow">修改时间</span>
			</div>
			<div v-else style="margin-top: 20px">
				<a-form :model="timeformState" ref="timeformRef">
					<a-form-item>
						<span slot="label" class="title">行程时间</span>
						<picker
							style="margin-left: 40px"
							v-model="timeformState.startTime"
							value-format="YYYY-MM-DD HH:mm:ss"
							:disabled-hours="() => disabledHours(travelStore.teamTime[0], timeformState.startTime)"
							:disabled-minutes="() => disabledMinutes(travelStore.teamTime[0], timeformState.startTime)"
							:disabled-seconds="() => disabledSeconds(travelStore.teamTime[0], timeformState.startTime)"
							type="datetime"
						/> —— 
						<picker
							v-model="timeformState.endTime"
							value-format="YYYY-MM-DD HH:mm:ss"
							:disabled-hours="() => disabledHours(travelStore.teamTime[1], timeformState.endTime)"
							:disabled-minutes="() => disabledMinutes(travelStore.teamTime[1], timeformState.endTime)"
							:disabled-seconds="() => disabledSeconds(travelStore.teamTime[1], timeformState.endTime)"
							type="datetime"
						/>
						<span class="time_btn" @click="changTiemshow">确定</span>
					</a-form-item>
				</a-form>
			</div>

			<p class="title">酒店住宿</p>
			<CommonTable :columns="hotelColumns" :dataSource="hotelData" :scrollY="false">
				<template #bodyCell="{ column, text, index, record }">
					<template v-if="column.key === 'index'">
						<div>
							{{ index + 1 }}
						</div>
					</template>
					<template v-if="column.key === 'roomName'">
						<div v-html="text"></div>
					</template>
					<template v-if="column.key === 'orderFee'">
						<div>
							{{ accDiv(record.orderFee, 100) }}
						</div>
					</template>
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a class="item" @click="add(record.oid ? 'addHotelPop' : 'productRow', 'addHotelPop', record.oid ? record.oid : null, record)">编辑</a>
							<a class="item" @click="delhotel(index)">删除</a>
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
					<template v-if="column.key === 'orderFee'">
						<div>
							{{ accDiv(record.orderFee, 100) }}
						</div>
					</template>
					<template v-if="column.key === 'unitPrice'">
						<div>
							{{ accDiv(record.unitPrice, 100) }}
						</div>
					</template>
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a class="item" @click="add(record.oid ? 'addTicketPop' : 'productRow', 'addTicketPop', record.oid, record)">编辑</a>
							<a class="item" @click="delticket(index)">删除</a>
						</div>
					</template>
				</template>
			</CommonTable>
			<div class="footer-btn">
				<a-button type="primary" @click="add('addTicketPop', 'addTicketPop')">添加</a-button>
			</div>
		</div>
		<div class="footer"><a-button type="primary" @click="submitReview">提交审核</a-button></div>
	</div>
	<addHotel :productRow="editId.productRow" :hotelId="editId.addHotelPop" v-model="addHotelPop" />
	<addTicket :productRow="editId.productRow" :ticketId="editId.addTicketPop" v-model="addTicketPop" />
</template>
<script lang="ts" setup>
import CommonTable from '@/components/common/CommonTable.vue';
import addHotel from './addHotel.vue';
import addTicket from './addTicket.vue';
import picker from '@/components/common/datePicker.vue';
import {
	disabledRangeTime,
	range,
	isPositiveInteger,
	selectSpecialDateRange,
	isOneHundred,
	disabledHours,
	disabledMinutes,
	disabledSeconds,
} from '@/utils';
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
	ticketColumns,
	addHotelPop,
	addTicketPop,
	hotelColumns,
	add,
	hotelData,
	ticketData,
	editId,
	onSearch,
	submitReview,
	timeformState,
	startTime,
	endTime,
	disabledDate,
	tiemformshow,
	timeformRef,
	delhotel,
	delticket,
	changTiemshow,
	travelStore,
} = useTraveInfo(props, emits);
onMounted(() => {
	onSearch();
});
</script>
<style lang="less" scoped>
::v-deep(.ant-table-selection-column) {
	width: 50px;
}
.header_top {
	width: 100%;
	display: flex;
	justify-content: space-between;
	padding: 20px 16px;
	border-bottom: 1px solid #f1f2f5;
	.head_title {
		font-size: 16px;
		font-family: Microsoft YaHei UI;
		color: #1e2226;
	}
}
.table-container {
	padding: 0 0 20px 0;
	.footer {
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
	color: black;
}
.time_btn {
	margin-left: 40px;
	font-size: 14px;
	cursor: pointer;
	color: rgb(49, 167, 218);
}
.item-container {
	&:first-of-type {
		.title {
			margin-top: 0;
		}
	}
}
</style>
