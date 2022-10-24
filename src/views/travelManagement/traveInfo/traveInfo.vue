<template>
	<div class="table-container">
		<div>
			<p class="title">古维管理费</p>
			<CommonTable :columns="gouvyColumns" :dataSource="gouvyDate" :scrollY="false">
				<template #bodyCell="{ column, text, index, record }">
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a class="item" disabled>提交申请</a>
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
		<div>
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
		<div>
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
							<a class="item" @click="editTicke('addTicketPop')">编辑</a>
							<a class="item">删除</a>
						</div>
					</template>
				</template>
			</CommonTable>
			<div class="footer-btn">
				<a-button type="primary" @click="add('addTicketPop')">添加</a-button>
			</div>
		</div>
		<div>
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
							<a class="item" @click="editHolte('addHotelPop')">编辑</a>
							<a class="item" @click="del(index)">删除</a>
						</div>
					</template>
				</template>
			</CommonTable>
			<div class="footer-btn">
				<a-button type="primary" @click="add('addHotelPop')">添加</a-button>
			</div>
		</div>
	</div>
	<addHotel v-model="addHotelPop" />
	<addTicket v-model="addTicketPop" />
	<select v-model="selectPersonnelPop" />
</template>
<script lang="ts" setup>
import CommonTable from '@/components/common/CommonTable.vue';
import addHotel from './addHotel.vue';
import addTicket from './addTicket.vue';
import select from './selectPersonnel.vue';
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
	editHolte,
	choice
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
}
</style>
