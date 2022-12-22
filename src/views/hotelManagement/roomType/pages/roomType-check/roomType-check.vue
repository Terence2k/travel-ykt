<template>
	<div class="roomType-check-wrapper">
		<div class="title-bar">
			<span v-if="dataSource?.length > 0">当前酒店：{{ state.hotelName }}&nbsp;,&nbsp;提交审核时间：{{ state.submitTime }}</span>
			<template v-else>
				<span>当前酒店：{{ state.hotelName }}&nbsp;,&nbsp;暂无待审核数据</span>
			</template>
		</div>
		<CommonTable :columns="columns" :data-source="dataSource">
			<template #bodyCell="{ column, record, text }">
				<div>
					<template v-if="['roomTypeName', 'price'].includes(column.dataIndex)">
						<div>
							<span>{{ text }}</span>
						</div>
					</template>
					<template v-if="['systemRoomName'].includes(column.dataIndex)">
						<div>
							<span>{{ text }}</span>
						</div>
					</template>
					<template v-if="['roomNum'].includes(column.dataIndex)">
						<div v-if="record?.operationType !== 0">
							<span>{{ text }}</span>
						</div>
						<template v-else>
							<span>0</span>
						</template>
					</template>
					<template v-if="['roomOperateNum'].includes(column.dataIndex)">
						<div v-if="record?.operationType !== 0">
							<span>{{ text }}</span>
						</div>
						<template v-else>
							<span>{{ record?.roomNum }}</span>
						</template>
					</template>
					<template v-if="['roomOccupancyNum'].includes(column.dataIndex)">
						<div>
							<span>{{ text }}</span>
						</div>
					</template>
					<template v-if="column.dataIndex === 'actions'">
						<div class="cell-actions">
							<span>{{ getActionText(record.operationType) }}</span>
						</div>
					</template>
				</div>
			</template>
		</CommonTable>
		<div class="footer">
			<div class="button-container">
				<a-button @click="auditPass" class="button" v-permission="'审核通过'">审核通过</a-button>
				<a-button @click="auditFail" class="button" v-permission="'审核不通过'">审核不通过</a-button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue/es';
import api from '@/api';
import CommonTable from '@/components/common/CommonTable.vue';
import { accDiv } from '@/utils/compute';
const route = useRoute();
const router = useRouter();
const userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
const columns = [
	{
		title: '自定义房型',
		dataIndex: 'roomTypeName',
		key: 'roomTypeName',
		width: '12%',
	},
	{
		title: '系统房型',
		dataIndex: 'systemRoomName',
		key: 'systemRoomName',
		width: '12%',
	},
	{
		title: '诚信指导价',
		dataIndex: 'price',
		key: 'price',
		width: '8%',
	},
	{
		title: '房间原本数量',
		dataIndex: 'roomNum',
		key: 'roomNum',
		width: '8%',
	},
	{
		title: '房间变更数量',
		dataIndex: 'roomOperateNum',
		key: 'roomOperateNum',
		width: '8%',
	},
	{
		title: '房间可入住人数',
		dataIndex: 'roomOccupancyNum',
		key: 'roomOccupancyNum',
		width: '36%',
	},

	{
		title: '操作类型',
		dataIndex: 'actions',
		key: 'actions',
		width: 160,
	},
];
interface DataSourceItem {
	hotelId: string | number;
	key: string | number;
	oid: string | number;
	roomTypeCode?: string | number;
	roomTypeName: string;
	systemRoomName: string;
	price: number;
	roomNum: number;
	roomOccupancyNum: number;
}

const state = reactive({
	hotelId: 0,
	auditOrderId: '',
	hotelName: '',
	submitTime: '',
});

const dataSource: DataSourceItem[] = ref([]);

const initPage = () => {
	api
		.getRoomDetailInfoInAuditStatus(state.hotelId)
		.then((res) => {
			console.info(`id${state.hotelId}审核中的房型信息:`, res);

			if (Array.isArray(res) && res.length > 0) {
				state.auditOrderId = res[0]?.auditOrderId;
				dataSource.value = res.map((item) => {
					return {
						...item,
						price: accDiv(item.price, 100),
						key: item?.oid,
					};
				});
			} else {
				dataSource.value = [];
			}
		})
		.catch((err) => {
			console.error(err);
		});
};

watch(
	() => route,
	(res) => {
		//console.info('eeeeeeeeeeeeeeeeeee', res.params, res.query);
		state.hotelName = res?.query?.hotelName || '';
		state.submitTime = res?.query?.submitTime || '';
		state.hotelId = parseInt(res?.query?.id);
		if (state.hotelId) {
			initPage();
		}
	},
	{
		immediate: true,
	}
);

const auditPass = () => {
	api.getRoleId({ uuid: state.auditOrderId }).then((res) => {
		console.log('getRoleInfo：', res);
		if (Array.isArray(res) && res[0]?.roleId === null && res[0]?.auditBusinessType) {
			const roleId = userInfo.sysRoles[0].oid;
			console.log('任选当前一个用户身份,当前roleId为：', roleId);
			api
				.auditRoomDetailInfo(state.auditOrderId, roleId, res[0]?.auditBusinessType, true)
				.then((res) => {
					console.log('房型审核通过返回：', res);
					message.success('审核成功');
					initPage();
					router.go(-1);
				})
				.catch((err: any) => {
					message.error(err || '审核失败');
				});
		} else if (Array.isArray(res) && res[0]?.roleId && res[0]?.auditBusinessType) {
			console.log('当前roleId为：', res[0]?.roleId);
			api
				.auditRoomDetailInfo(state.auditOrderId, res[0]?.roleId, res[0]?.auditBusinessType, true)
				.then((res) => {
					console.log('房型审核通过返回：', res);
					message.success('审核成功');
					initPage();
					router.go(-1);
				})
				.catch((err: any) => {
					message.error(err || '审核失败');
				});
		} else {
			message.error('当前用户无此权限');
		}
	});
};

const auditFail = () => {
	api.getRoleId({ uuid: state.auditOrderId }).then((res) => {
		console.log('getRoleInfo：', res);
		if (res[0]?.roleId === null && res[0]?.auditBusinessType) {
			const roleId = userInfo.sysRoles[0].oid;
			console.log('任选当前一个用户身份,当前roleId为：', roleId);
			api.auditRoomDetailInfo(state.auditOrderId, roleId, res[0].auditBusinessType, false).then((res) => {
				console.log('房型审核通过返回：', res);
				message.success('审核成功');
				initPage();
				router.go(-1);
			});
		} else if (res[0]?.roleId && res[0]?.auditBusinessType) {
			console.log('当前roleId为：', res[0]?.roleId);
			api.auditRoomDetailInfo(state.auditOrderId, res[0].roleId, res[0].auditBusinessType, false).then((res) => {
				console.log('房型审核通过返回：', res);
				message.success('审核成功');
				router.go(-1);
				initPage();
			});
		} else {
			message.error('当前用户无此权限');
		}
	});
};

const getActionText = (code) => {
	let resultText = '';
	switch (code) {
		case 0:
			resultText = '新增';
			break;
		case 1:
			resultText = '编辑';
			break;
		case 2:
			resultText = '删除';
			break;
	}
	return resultText;
};
</script>

<style lang="less" scoped>
@import './styles/roomType-check.less';
</style>
