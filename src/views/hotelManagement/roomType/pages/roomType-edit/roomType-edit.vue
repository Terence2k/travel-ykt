<template>
	<div class="roomType-edit-wrapper">
		<!-- <a-form ref="formRef" :rules="rulesRef" :model="editableData" autocomplete="off" labelAlign="left"> -->
		<a-form :model="editableData" ref="formRef">
			<CommonTable :columns="columns" :data-source="dataSource">
				<template #bodyCell="{ column, text, record }">
					<template v-if="['roomTypeName'].includes(column.dataIndex)">
						<a-form-item
							v-if="editableData[record.key]"
							:name="[record.key, column.dataIndex]"
							:rules="[{ required: true, trigger: 'blur', message: '自定义房型不能为空' }]"
						>
							<a-input v-if="editableData[record.key]" v-model:value="editableData[record.key][column.dataIndex]" />
						</a-form-item>
						<template v-else>
							<a-input :disabled="true" :defaultValue="text" />
						</template>
					</template>
					<template v-if="['price'].includes(column.dataIndex)">
						<div>
							<a-form-item
								v-if="editableData[record.key]"
								:name="[record.key, column.dataIndex]"
								:rules="[
									{ required: true, validator: isPositiveInteger, trigger: 'blur', message: '当前酒店诚信指导价为0,请先编辑酒店信息补充星级' },
								]"
							>
								<a-input :disabled="true" type="number" v-if="editableData[record.key]" v-model:value="editableData[record.key][column.dataIndex]" />
							</a-form-item>
							<template v-else>
								<a-input :disabled="true" :defaultValue="text" />
							</template>
						</div>
					</template>
					<template v-if="['roomNum'].includes(column.dataIndex)">
						<div>
							<a-form-item
								v-if="editableData[record.key]"
								:name="[record.key, column.dataIndex]"
								:rules="[{ required: true, validator: isPositiveInteger, trigger: 'blur', message: '房间数量必须为正整数' }]"
							>
								<a-input-number
									type="number"
									:disabled="editableData[record.key]?.operationType !== 0"
									v-if="editableData[record.key]"
									v-model:value="editableData[record.key][column.dataIndex]"
									:controls="false"
								>
									<template #addonBefore>
										<a-select
											class="icon-before-container"
											:disabled="editableData[record.key]?.operationType === 0"
											@click="getMaxMinusCount(record)"
											@change="minusNumOptionsChange($event, record)"
											v-model:value="editableData[record.key].minusNum"
											:options="minusNumOptions"
											style="width: 60px"
										>
											<template #suffixIcon>
												<span v-if="!editableData[record.key].minusNum" class="icon-minus">-</span>
											</template>
										</a-select>
									</template>
									<template #addonAfter>
										<a-select
											:disabled="editableData[record.key]?.operationType === 0"
											@change="plusNumOptionsChange($event, record)"
											v-model:value="editableData[record.key].plusNum"
											:options="plusNumOptions"
											style="width: 60px"
										>
											<template #suffixIcon>
												<span v-if="!editableData[record.key].plusNum" class="icon-plus">+</span>
											</template>
										</a-select>
									</template>
								</a-input-number>
							</a-form-item>
							<template v-else>
								<a-input-number :disabled="true" :defaultValue="text">
									<template #addonBefore>
										<a-select class="icon-before-container" :disabled="true" style="width: 60px">
											<template #suffixIcon>
												<span class="icon-minus">-</span>
											</template>
										</a-select>
									</template>
									<template #addonAfter>
										<a-select :disabled="true" style="width: 60px">
											<template #suffixIcon>
												<span class="icon-plus">+</span>
											</template>
										</a-select>
									</template>
								</a-input-number>
							</template>
						</div>
						<!-- <div>
						<a-input type="number" v-if="editableData[record.key]" v-model:value="editableData[record.key][column.dataIndex]" />
						<template v-else>
							<a-input :disabled="true" :defaultValue="text" />
						</template>
					</div> -->
					</template>
					<template v-if="['sysRoomTypeId'].includes(column.dataIndex)">
						<a-form-item
							v-if="editableData[record.key]"
							:name="[record.key, column.dataIndex]"
							:rules="[{ required: true, trigger: 'blur', message: '系统房型不能为空' }]"
						>
							<a-select
								class="systemRoomType-select"
								@change="changeRoomOccupancyNum(editableData[record.key])"
								v-if="editableData[record.key]"
								v-model:value="editableData[record.key][column.dataIndex]"
								:options="systemRoomNameOptions"
							>
							</a-select>
						</a-form-item>
						<template v-else>
							<a-select class="systemRoomType-select" :disabled="true" :value="text" :options="systemRoomNameOptions"> </a-select>
						</template>
					</template>
					<template v-if="['roomOccupancyNum'].includes(column.dataIndex)">
						<div>
							<a-input
								:disabled="true"
								type="number"
								style="width: 16%"
								v-if="editableData[record.key]"
								v-model:value="editableData[record.key][column.dataIndex]"
							/>
							<template v-else>
								<a-input style="width: 16%" :disabled="true" :defaultValue="text" />
							</template>
						</div>
					</template>
					<template v-if="['auditStatus'].includes(column.dataIndex)">
						<div class="cell-auditStatus">
							<span v-if="editableData[record.key]">{{ getAuditStatusText(editableData[record.key]?.auditStatus) }}</span>
							<template v-else>
								<span>{{ getAuditStatusText(parseInt(text)) }}</span>
							</template>
						</div>
					</template>
					<template v-else-if="column.dataIndex === 'actions'">
						<div class="cell-actions">
							<span class="item" @click="edit(record.key)" v-permission="'编辑'">{{ editableData[record.key] ? '取消' : '编辑' }}</span>
							<span class="item" @click="cacheRemoveKey(record.key)" v-permission="'删除'">删除</span>
						</div>
					</template>
				</template>
				<template #summary>
					<a-table-summary-row class="row-summary">
						<a-table-summary-cell></a-table-summary-cell>
						<a-table-summary-cell></a-table-summary-cell>
						<a-table-summary-cell></a-table-summary-cell>
						<a-table-summary-cell></a-table-summary-cell>
						<a-table-summary-cell></a-table-summary-cell>
						<a-table-summary-cell></a-table-summary-cell>
						<a-table-summary-cell class="cell-actions">
							<a-button @click="add" class="button-add" v-permission="'添加'">添加</a-button>
						</a-table-summary-cell>
					</a-table-summary-row>
				</template>
			</CommonTable>
		</a-form>
		<!-- <div class="btn-add-wrapper">
			<a-button @click="add" class="button-add" v-permission="'添加'">添加</a-button>
		</div> -->
		<div class="footer">
			<!-- <a-button @click="saveRoomInfo" class="button-save button">保存</a-button> -->
			<a-button
				html-type="submit"
				:class="{ mdisabled: state.isAuditStatus }"
				:disabled="state.isAuditStatus"
				class="button-submit button"
				@click="saveRoomInfo"
				v-permission="'提交审核'"
				>提交审核</a-button
			>
			<span v-if="state.isAuditStatus" class="tip_not_submit">房型信息正在审核中，暂时不可继续提交</span>
		</div>
		<DelModal :params="{ title: '删除', content: '是否确定删除该房型' }" v-model="delShow" @submit="delSubmit" @cancel="delCancel" />
		<!-- <CommonPagination
			class="pagination-custom"
			:current="tableState.tableData.param.pageNo"
			:page-size="tableState.tableData.param.pageSize"
			:total="tableState.tableData.total"
			@change="onHandleCurrentChange"
			@showSizeChange="pageSideChange"
		>
		</CommonPagination> -->
	</div>
</template>

<script setup lang="ts">
import { toRaw } from 'vue';
import { cloneDeep } from 'lodash';
import { message } from 'ant-design-vue';
import api from '@/api';
import CommonTable from '@/components/common/CommonTable.vue';
import DelModal from '@/components/common/DelModal.vue';
import { accDiv } from '@/utils/compute';
import { isPositiveInteger } from '@/utils/validator';
// import CommonPagination from '@/components/common/CommonPagination.vue';

const route = useRoute();
const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});
const columns = [
	{
		title: '自定义房型',
		dataIndex: 'roomTypeName',
		key: 'roomTypeName',
		width: '12%',
	},
	{
		title: '系统房型',
		dataIndex: 'sysRoomTypeId',
		key: 'sysRoomTypeId',
		width: '10%',
	},
	{
		title: '诚信指导价',
		dataIndex: 'price',
		key: 'price',
		width: '10%',
	},
	{
		title: '房间数量',
		dataIndex: 'roomNum',
		key: 'roomNum',
		width: '17%',
	},
	{
		title: '审核状态',
		dataIndex: 'auditStatus',
		key: 'auditStatus',
		width: '11%',
	},
	{
		title: '房间可入住人数',
		dataIndex: 'roomOccupancyNum',
		key: 'roomOccupancyNum',
		width: '26%',
	},
	{
		title: '操作',
		dataIndex: 'actions',
		key: 'actions',
		fixed: 'right',
		width: '13%',
	},
];
interface DataSourceItem {
	key: string | number;
	auditOrderId: string;
	auditStatus: number;
	hotelId: string | number;
	oid: string | number;
	sysRoomTypeId?: string | number;
	roomTypeName: string;
	systemRoomName: string;
	price: number;
	roomNum: number;
	roomOccupancyNum: number;
}

const formRef = ref();

const delShow = ref();

const removeKey = ref();

const userInfo = JSON.parse(window.localStorage.getItem('userInfo'));

let minusNumOptions = ref<SelectProps['options']>(
	(() => {
		const result = [];
		for (let i = -1; i > -500; i--) {
			result.push({
				value: i,
				label: i.toString(),
			});
		}
		return result;
	})()
);

let plusNumOptions = ref<SelectProps['options']>(
	(() => {
		const result = [];
		for (let i = 1; i < 500; i++) {
			result.push({
				value: i,
				label: `+${i.toString()}`,
			});
		}
		return result;
	})()
);

const dataSource: DataSourceItem[] = ref([]);

const systemRoomData = ref([]);
const systemRoomNameOptions = ref<SelectProps['options']>(systemRoomData);

const state = reactive({
	hotelId: undefined,
	isAuditStatus: false,
	systemRoomAllData: [],
	roomInfoResponse: [],
	roomInfoRequest: [],
	roomOperateData: {},
	price: undefined,
});

const edit = (key: string) => {
	if (editableData[key]) {
		//如果是新增之后取消编辑，那麽直接删除该条数据
		if (editableData[key]?.operationType === 0) {
			dataSource.value = dataSource.value.filter((item) => key !== item.key);
		}
		delete editableData[key];
	} else {
		editableData[key] = cloneDeep(dataSource.value.filter((item) => key === item.key)[0]);
		editableData[key].operationType = 1;
	}
};

const cacheRemoveKey = (key: string) => {
	removeKey.value = key;
	delShow.value = true;
};

const delCancel = () => {
	delShow.value = false;
};

const delSubmit = () => {
	remove(removeKey.value);
	delShow.value = false;
};

const remove = (key: string) => {
	if (editableData[key]) {
		if (key.startsWith('NEW_')) {
			delete editableData[key];
		} else {
			editableData[key].operationType = 2;
		}
	} else {
		editableData[key] = cloneDeep(dataSource.value.filter((item) => key === item.key)[0]);
		editableData[key].operationType = 2;
		editableData[key].roomOperateNum = ~editableData[key].roomNum + 1 || 0;
	}
	dataSource.value = dataSource.value.filter((item) => key !== item.key);
};

const initPage = () => {
	for (let property in editableData) {
		delete editableData[`${property}`];
	}

	const companyId = userInfo?.sysCompany?.oid;

	if (companyId || companyId === 0) {
		api
			.getHotelInfoByCompanyId(companyId)
			.then((res) => {
				console.log('根据企业id获得的酒店信息为：', res);
				state.hotelId = res?.oid;

				api
					.getPriceByHotelId(state.hotelId)
					.then((res) => {
						console.log('诚信指导价：', res?.price);
						state.price = accDiv(res?.price, 100) || '';
					})
					.catch((err: any) => {
						message.error(err?.message || err);
					});
				api
					.getHotelListInEdit()
					.then((res) => {
						// state.hotelId = res?.
						console.info(`id${state.hotelId}房型信息:`, res);

						if (Array.isArray(res) && res.length > 0) {
							state.roomInfoResponse.value = res;
							dataSource.value = res.map((item) => {
								if (item.auditStatus === 1) {
									state.isAuditStatus = true;
								}
								return {
									...item,
									price: accDiv(item.price, 100),
									key: item?.oid,
								};
							});
						} else {
							state.roomInfoResponse.value = [];
							dataSource.value = [];
						}
					})
					.catch((err: any) => {
						message.error(err?.message || err);
					});
			})
			.catch((err: any) => {
				message.error(err?.message || err);
			});
	}

	api
		.getEnableSystemRoomType()
		.then((res) => {
			state.systemRoomAllData = res;
			systemRoomData.value = res.map((item) => {
				return {
					value: item.oid,
					label: item.sysRoomTypeName,
				};
			});
			console.log('systemRoomData', systemRoomData);
		})
		.catch((err: any) => {
			message.error(err?.message || err);
		});
};

const saveRoomInfo = () => {
	formRef.value
		.validateFields()
		.then((res) => {
			console.log('验证结果', res);
			console.info('editableData :', editableData, toRaw(editableData));
			const editableRawData = toRaw(editableData);
			let editableArray = [];
			for (let property in editableRawData) {
				editableArray.push(editableRawData[property]);
			}
			console.info('editableArray', editableArray);
			const result = editableArray
				?.filter((item) => JSON.stringify(item) !== '{}')
				.map((item) => {
					if (item.oid) {
						return {
							oid: item.oid,
							hotelId: item.hotelId ? parseInt(item.hotelId) : undefined,
							roomTypeName: item.roomTypeName,
							sysRoomTypeId: item.sysRoomTypeId,
							roomNum: item.operationType !== 2 ? parseInt(item.roomNum) - parseInt(item.roomOperateNum) : parseInt(item.roomNum),
							roomOccupancyNum: parseInt(item.roomOccupancyNum),
							operationType: parseInt(item.operationType),
							roomOperateNum: parseInt(item.roomOperateNum),
						};
					} else {
						if (item?.key) {
							return {
								hotelId: item.hotelId ? parseInt(item.hotelId) : undefined,
								roomTypeName: item.roomTypeName,
								sysRoomTypeId: item.sysRoomTypeId,
								roomNum: parseInt(item.roomNum),
								roomOccupancyNum: parseInt(item.roomOccupancyNum),
								operationType: parseInt(item.operationType),
								roomOperateNum: parseInt(item.roomOperateNum),
							};
						}
					}
				});

			if (Array.isArray(result) && result.length > 0) {
				console.info('保存的房型信息：', result);
				api
					.editRoomDetailInfo(result)
					.then((res) => {
						console.info('编辑房型信息返回：', res);
						initPage();
						message.success('保存成功');
					})
					.catch((err: any) => {
						message.error(err?.message || err);
					});
			} else {
				message.warn('当前缺少可提交审核的数据');
			}
		})
		.catch((err: any) => {
			console.log(err);
			//message.error(err?.message || err);
		});
};

const add = () => {
	if (state?.isAuditStatus) {
		message.warn('房型信息正在审核中，暂时不可添加新房型');
		return;
	}
	const newData = {
		key: `NEW_${Date.now().toString()}`,
		auditOrderId: '',
		auditStatus: 0,
		hotelId: state?.hotelId ? parseInt(state?.hotelId) : undefined,
		roomTypeCode: systemRoomData?.value[0]?.value || 1,
		roomNum: 1,
		roomOccupancyNum: 0,
		operationType: 0,
		roomOperateNum: 0,
		price: state?.price || 0,
	};
	dataSource.value.push(newData);
	if (editableData[newData.key]) {
		editableData[newData.key].operationType = 0;
	} else {
		editableData[newData.key] = cloneDeep(dataSource.value.filter((item) => newData.key === item.key)[0]);
		editableData[newData.key].operationType = 0;
		const roomOccupancyNum = state.systemRoomAllData.find((item) => item.oid === editableData[newData.key].sysRoomTypeId)?.roomOccupancyNum;

		editableData[newData.key].roomOccupancyNum = roomOccupancyNum;
		newData.roomOccupancyNum = roomOccupancyNum;
		console.log('editableData[newData.key].roomOccupancyNum', state.systemRoomAllData);
	}
};

const changeRoomOccupancyNum = (target) => {
	target.roomOccupancyNum = state.systemRoomAllData.find((item) => item.oid === target.sysRoomTypeId)?.roomOccupancyNum;
};

const minusNumOptionsChange = (val, option) => {
	console.log('minusNumOptionsChange', val, option);
	editableData[option.key].plusNum = 0;
	const originalRoomNum = dataSource?.value?.find((item) => item.key === option.key)?.roomNum;
	editableData[option.key].roomNum = originalRoomNum + parseInt(editableData[option.key].minusNum);
	editableData[option.key].roomOperateNum = parseInt(editableData[option.key].minusNum);
};

const plusNumOptionsChange = (val, option) => {
	console.log('plusNumOptionsChange', val, option);
	editableData[option.key].minusNum = 0;
	const originalRoomNum = dataSource?.value?.find((item) => item.key === option.key)?.roomNum;
	editableData[option.key].roomNum = originalRoomNum + parseInt(editableData[option.key].plusNum);
	editableData[option.key].roomOperateNum = parseInt(editableData[option.key].plusNum);
};

const getAuditStatusText = (auditStatus: number) => {
	let result = '';
	switch (auditStatus) {
		case 0:
			result = '未提交';
			break;
		case 1:
			result = '待审核';
			break;
		case 2:
			result = '新增审核通过';
			break;
		case 3:
			result = '新增审核不通过';
			break;
		case 4:
			result = '编辑审核通过';
			break;
		case 5:
			result = '编辑审核不通过';
			break;
		case 6:
			result = '删除审核通过';
			break;
		case 7:
			result = '删除审核不通过';
			break;
	}
	return result;
};

const getMaxMinusCount = (target: string) => {
	if (target?.operationType !== 0) {
		api
			.getMaxMinusCountOfRoom(target.oid)
			.then((res) => {
				console.log('当前房型的最大可减小数量为：', res);
				editableData[target?.oid].maxMinusCountOfRoom = res;
				const maxCount = ~res;
				minusNumOptions.value = (() => {
					const result = [];
					for (let i = -1; i > maxCount; i--) {
						result.push({
							value: i,
							label: i.toString(),
						});
					}
					return result;
				})();
			})
			.catch((err: any) => {
				minusNumOptions.value = (() => {
					const result = [];
					result.push({
						value: 0,
						label: '0',
					});

					return result;
				})();
				message.error(err?.message || err || '获取最大可减少房间数失败');
			});
	}
};
onMounted(() => {
	initPage();
});
</script>

<style lang="less" scoped>
@import './styles/roomType-edit.less';
</style>
