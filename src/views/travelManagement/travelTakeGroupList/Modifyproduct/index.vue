<template>
	<div class="warp">
		<div class="header_top">
			<div class="title">请根据实际需要，调整行程时间，或已预订的产品，重新提交变更。</div>
			<a-button>进入修改</a-button>
		</div>
		<div class="warp_contant">
			<div class="warp_head">
				<span class="warp_title">行程时间</span>
				<span>2022.10.01 09:00:00 — 2022.10.02 19:00:00</span>
			</div>
		</div>
		<div class="warp_contant">
			<div class="warp_head">
				<span class="warp_title">酒店费用</span>
				<span>（已预订<e>1</e>个酒店，最大可入住人数：<e>30</e>人；房间数量：<e>17</e>；费用总计：<e>12050.00</e>元）</span>
			</div>
            <CommonTable :dataSource="state.tableData" :columns="state.hotelcolumns" rowKey="oid" style="padding: 0;">
				<template #button> </template>
				<template #bodyCell="{ column, text, index, record }">
					<template v-if="column.key === 'index'">
						<div>
							{{ (state.params.pageNo - 1) * state.params.pageSize + (index + 1) }}
						</div>
					</template>
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a>查看订单</a>
						</div>
					</template>
				</template>
			</CommonTable>
		</div>
		<div class="warp_contant">
			<div class="warp_head">
				<span class="warp_title">景区费用</span>
				<span>（已预订<e>1</e>个景区，游玩人数：<e>30</e>人；门票数量：<e>17</e>；费用总计：<e>12050.00</e>元）</span>
			</div>
            <CommonTable :dataSource="state.tableData" :columns="state.ticketcolumns" rowKey="oid" style="padding: 0;">
				<template #button> </template>
				<template #bodyCell="{ column, text, index, record }">
					<template v-if="column.key === 'index'">
						<div>
							{{ (state.params.pageNo - 1) * state.params.pageSize + (index + 1) }}
						</div>
					</template>
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a>查看订单</a>
						</div>
					</template>
				</template>
			</CommonTable>
		</div>
	</div>
</template>
<script lang="ts" setup>
import CommonTable from '@/components/common/CommonTable.vue';

const state = reactive({
	params: {
		pageNo: 1,
		pageSize: 10,
	},
	tableData: '',
	hotelcolumns: [
		{
			title: '酒店名称',
			dataIndex: 'itineraryNo',
			key: 'itineraryNo',
		},
		{
			title: '可入住人数',
			dataIndex: 'routeName',
			key: 'routeName',
		},
		{
			title: '房型',
			dataIndex: 'subTravelName',
			key: 'subTravelName',
		},
		{
			title: '房间数量',
			dataIndex: 'time',
			key: 'time',
		},
		{
			title: '入住天数',
			dataIndex: 'groupTypeStr',
			key: 'groupTypeStr',
		},
		{
			title: '入住时间',
			dataIndex: 'guides',
			key: 'guides',
		},
		{
			title: '离店时间',
			dataIndex: 'touristCount',
			key: 'touristCount',
		},
        {
			title: '费用总计(元)',
			dataIndex: 'touristCount',
			key: 'touristCount',
		},
        {
			title: '订单状态',
			dataIndex: 'touristCount',
			key: 'touristCount',
		},
		{
			title: '操作',
			fixed: 'right',
			key: 'action',
		},
	],
    ticketcolumns:[
        {
            title: ' 序号 ',
            key: 'index',
            width: '80px'
        },
        {
			title: '景区名称',
			dataIndex: 'itineraryNo',
			key: 'itineraryNo',
		},
		{
			title: '游玩日期',
			dataIndex: 'routeName',
			key: 'routeName',
		},
		{
			title: '门店名称',
			dataIndex: 'subTravelName',
			key: 'subTravelName',
		},
		{
			title: '单价(元)',
			dataIndex: 'time',
			key: 'time',
		},
		{
			title: '团队游客人数',
			dataIndex: 'groupTypeStr',
			key: 'groupTypeStr',
		},
		{
			title: '购票人数',
			dataIndex: 'guides',
			key: 'guides',
		},
        {
			title: '费用总计(元)',
			dataIndex: 'touristCount',
			key: 'touristCount',
		},
        {
			title: '订单状态',
			dataIndex: 'touristCount',
			key: 'touristCount',
		},
		{
			title: '操作',
			fixed: 'right',
			key: 'action',
		},
    ]
});

</script>
<style lang="less" scoped>
.warp {
	display: flex;
	flex-wrap: wrap;
	padding: 24px 20px;
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
		padding: 40px 0px;
		.warp_head {
			.warp_title {
				margin-right: 40px;
				font-weight: bold;
			}
		}
	}
}
e {
	color: red;
}
</style>
