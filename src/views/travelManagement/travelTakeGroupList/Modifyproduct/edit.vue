<template>
	<div class="warp">
		<div class="header_top">
			<div class="title">当前正在变更预订产品，以下是您最后一次修改的内容，可重新修改、再次提交审核。</div>
		</div>
		<div class="warp_contant">
			<div class="warp_head">
				<span class="warp_title">行程时间</span>
				<span>2022.10.01 09:00:00 — 2022.10.02 19:00:00</span>
                <a-button class="a_btn" type="link">修改时间</a-button>
                <a-button class="a_btn" type="link">确定</a-button>
			</div>
		</div>
		<div class="warp_contant">
			<div class="warp_head">
				<span class="warp_title">酒店费用</span>
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
			.a_btn{
				margin-left: 40px;
			}
		}
	}
}

</style>
