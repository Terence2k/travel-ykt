<template>
	<div class="warp">
		<div class="header_top">
			<div class="title" v-if="state.DeatilAudits == true">你的变更申请已于{{state.lastUpdateTime}} 被驳回 ( <span style="color:red">{{state.descriHtm}}</span> ) 您可以重新修改再提交。</div>
			<div class="title" v-else>请根据实际需要，调整行程时间，或已预订的产品，重新提交变更。</div>
			<a-button @click="openEdit" type="primary">进入修改</a-button>
		</div>
		<div class="warp_contant">
			<div class="warp_head">
				<span class="warp_title">行程时间</span>
				<span>{{ state.startDate }} — {{ state.endDate }}</span>
			</div>
		</div>
		<div v-for="item in getOptions(state.Data)">
			<div class="page-title" style="margin-top: 20px">{{ item.title }}<span class="descriptions" v-html="item.descriptions"></span></div>
			<CommonTable :columns="item.columns" :dataSource="item.dataSource" :scrollY="false">
				<template #bodyCell="{ column, text, index, record }">
					<template v-if="column.key === 'index'">
						<div>
							{{ (state.params.pageNo - 1) * state.params.pageSize + (index + 1) }}
						</div>
					</template>
					<template v-if="column.key === 'roomTypeList'">
						<span  v-for="(item,index) in record.roomTypeList" key="index">
							<span style="padding: 0 3px;">{{item.roomTypeName}} </span>
						</span>
					</template>
					<!-- <template v-if="column.key === 'roomTypeList'">
						<div v-for="(item,index) in record.roomTypeList" key="index">
							{{item.roomTypeName}},
						</div>
					</template> -->
					<!-- 时段 -->
					<template v-if="column.key === 'time'">
						<div>{{ record.startDate }} - {{ record.endDate }}</div>
					</template>
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a @click="opendetail(record)">查看订单</a>
						</div>
					</template>
				</template>
			</CommonTable>
		</div>
	</div>
</template>
<script lang="ts" setup>
import CommonTable from '@/components/common/CommonTable.vue';
import api from '@/api';
import { useTravelStore } from '@/stores/modules/travelManagementDetail';
import { getOptions } from './deatli';
import dayjs, { Dayjs } from 'dayjs';

const travelStore = useTravelStore();
const route = useRoute();
const router = useRouter();
const state = reactive({
	params: {
		pageNo: 1,
		pageSize: 10,
	},
	Data: {},
	startDate: {},
	endDate: {},
	descriHtm: '',
	DeatilAudits:false,
	lastUpdateTime:''
});

const opendetail = (record: any) => {};
const openEdit = (data: any) => {
	router.push({
		path: '/travel/take_group/modify_product_edit',
		query: { oid: route.query.oid },
	});
};
const install = () => {
	api.travelManagement
		.getProductChangeAudit(route.query.oid)
		.then((res: any) => {
			if (res.auditRemark) {
				state.descriHtm = res.auditRemark
				state.lastUpdateTime = dayjs(res.lastUpdateTime).format('YYYY-MM-DD HH:mm:ss')
				api.travelManagement.getProductChangeAuditDetail(route.query.oid).then((res: any) => {					
					state.Data = res;
					state.startDate = res.startDate;
					state.endDate = res.endDate;
					travelStore.hotelList = res.newHotelList;
					travelStore.ticketsList = res.newTicketList;
					let dis = null;
					if (res) {
						dis = (current: Dayjs) => {
							return (
								(dayjs(res.startDate) && dayjs(res.startDate) > current && current) ||
								(dayjs(res.endDate) && dayjs(res.endDate).add(0, 'day') < current && current)
							);
						};
					}
					travelStore.setDisabled = dis as any;
					const time: any = [];
					time.push(res.startDate, res.endDate);
					travelStore.teamTime = time;
					 state.DeatilAudits = true
				});
			} else {
				api.travelManagement
					.changDetail({
						oid: route.query.oid,
						pageNo: 1,
						pageSize: 100000,
					})
					.then((res: any) => {
						state.Data = res;
						state.startDate = res.basic.startDate;
						state.endDate = res.basic.endDate;
						travelStore.hotelList = res.hotelList;
						travelStore.ticketsList = res.ticketList;
						let dis = null;
						if (res) {
							dis = (current: Dayjs) => {
								return (
									(dayjs(res.basic.startDate) && dayjs(res.basic.startDate) > current && current) ||
									(dayjs(res.basic.endDate) && dayjs(res.basic.endDate).add(0, 'day') < current && current)
								);
							};
						}
						travelStore.setDisabled = dis as any;
						const time: any = [];
						time.push(res.basic.startDate, res.basic.endDate);
						travelStore.teamTime = time;
					});
			}
		})
		.catch((error: any) => {});
};
install();
</script>
<style lang="less" scoped>
.warp {
	padding: 20px 20px;
	.page-title {
		line-height: 44px;
		font-size: 16px;
		font-weight: bold;
		color: #1e2226;
		.descriptions {
			margin-left: 5px;
		}
	}
	.table-area {
		padding: 0;
	}
	:deep(.qr-code.ant-descriptions-item-content) {
		height: 384px;
		text-align: center;
		color: #9da0a4;
	}
	.header_top {
		width: 100%;
		display: flex;
		justify-content: space-between;
		padding-bottom: 12px;
		border-bottom: 1px solid #f1f2f5;
		.title {
			font-size: 16px;
			font-family: Microsoft YaHei UI;
			color: #1e2226;
		}
	}
	.warp_contant {
		width: 100%;
		padding: 20px 0px 0 0;
		.warp_head {
			font-size: 16px;
			font-family: Microsoft YaHei UI;
			color: #1e2226;
			margin-right: 5px;
			.warp_title {
				font-weight: bold;
				margin-right: 5px;
			}
		}
	}
}
e {
	color: red;
}
</style>
