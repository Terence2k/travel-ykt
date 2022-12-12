<template>
	<div class="content_box">
		<a-form ref="formRef" :model="form" :rules="formRules" name="addStore" autocomplete="off" :label-col="labelCol"
			:wrapper-col="{ span: 10 }">
			<div class="header">
				<div class="tag mb10">填写基本信息</div>
				<span class="close_btn" @click="back">
					<close-outlined />
				</span>
			</div>
			<div class="form_item_box">
				<div class="form_item">
					<a-form-item name="travelData" label="行程日期">
						<a-range-picker v-model:value="form.travelData" @change="datePickerChange"
							:placeholder="['请选择开始时间', '请选择结束时间']" :valueFormat="dateFormat" style="width:100%" />
					</a-form-item>
					<a-form-item name="entrustTravelId" label="导游">
						<a-select placeholder="请选择本社签约导游" v-model:value="form.entrustTravelId" allowClear>
							<a-select-option v-for="item in guideOption" :value="item.oid">{{ item.name }}
							</a-select-option>
						</a-select>
					</a-form-item>
					<a-form-item name="touristPeopleNumber" label="联系人">
						<a-input v-model:value="form.touristPeopleNumber" placeholder="请输入联系人姓名">
						</a-input>
					</a-form-item>
					<a-form-item name="itineraryNo" label="行程单号">
						<a-input v-model:value="form.itineraryNo" placeholder="无需填写，提交审核后自动生成" disabled>
						</a-input>
					</a-form-item>
				</div>
				<div class="form_item">
					<a-form-item name="touristPeopleNumber" label="自编团号">
						<a-input v-model:value="form.touristPeopleNumber" placeholder="请输入自编团号">
						</a-input>
					</a-form-item>
					<a-form-item name="touristPeopleNumber" label="保险购买申报">
						<a-select placeholder="请选择保险购买情况" v-model:value="form.entrustTravelId" allowClear>
							<a-select-option v-for="item in guideOption" :value="item.oid">{{ item.name }}
							</a-select-option>
						</a-select>
					</a-form-item>
					<a-form-item name="touristPeopleNumber" label="联系人号码">
						<a-input v-model:value="form.touristPeopleNumber" placeholder="请输入联系人手机号">
						</a-input>
					</a-form-item>
					<a-form-item name="touristPeopleNumber" label="游客人数">
						<a-input v-model:value="form.touristPeopleNumber" placeholder="无需填写，选择合同后自动生成" disabled>
						</a-input>
					</a-form-item>
				</div>
			</div>
			<div class="tag">选择合同</div>
			<CommonTable :dataSource="[]" :columns="contractColumns">
				<template #bodyCell="{ column, record, index }">
					<template v-if="column.key === 'index'">
						{{ index + 1 }}
					</template>
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a @click="checkDetails(record.oid)">查看</a>
							<a @click="">删除</a>
						</div>
					</template>
				</template>
			</CommonTable>
			<div class="cost_count">
				<div class="cost_item">费用合计</div>
				<div class="cost_item">{{ 0 }}</div>
			</div>
			<div class="add_box">
				<a-button @click="" type="primary">添加</a-button>
			</div>
			<div class="tag">平台标准管理费用</div>
			<CommonTable :dataSource="[]" :columns="feeColumns">
				<template #bodyCell="{ column, record, index }">
					<template v-if="column.key === 'index'">
						{{ index + 1 }}
					</template>
				</template>
			</CommonTable>
			<div class="cost_count">
				<div class="cost_item">费用合计</div>
				<div class="cost_item">{{ 0 }}</div>
			</div>
			<div class="tag">行程内自酒店预订</div>
			<CommonTable :dataSource="[]" :columns="hotelColumns">
				<template #bodyCell="{ column, record, index }">
					<template v-if="column.key === 'index'">
						{{ index + 1 }}
					</template>
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a @click="">修改</a>
							<a @click="">删除</a>
						</div>
					</template>
				</template>
			</CommonTable>
			<div class="cost_count">
				<div class="cost_item">费用合计</div>
				<div class="cost_item">{{ 0 }}</div>
			</div>
			<div class="add_box">
				<a-button @click="" type="primary">添加</a-button>
			</div>
			<div class="tag">行程内景区门票预订</div>
			<CommonTable :dataSource="[]" :columns="ticketColumns">
				<template #bodyCell="{ column, record, index }">
					<template v-if="column.key === 'index'">
						{{ index + 1 }}
					</template>
					<template v-if="column.key === 'action'">
						<div class="action-btns">
							<a @click="">修改</a>
							<a @click="">删除</a>
						</div>
					</template>
				</template>
			</CommonTable>
			<div class="cost_count">
				<div class="cost_item">费用合计</div>
				<div class="cost_item">{{ 0 }}</div>
			</div>
			<div class="add_box">
				<a-button @click="" type="primary">添加</a-button>
			</div>
			<div class="tag">其他自定义产品预订</div>
			<CommonTable :dataSource="dataCostSource" :columns="productsColumns">
				<template #bodyCell="{ column, text, record, index }">
					<template v-if="column.key === 'index'">
						{{ index + 1 }}
					</template>
					<template v-if="column.dataIndex === 'priceName'">
						<a-input v-if="record.isEdit" v-model:value="dataCostSource[index][column.dataIndex]" style="margin: -5px 0"
							placeholder="输入产品名称" />
						<template v-else>
							{{ text }}
						</template>
					</template>
					<template v-if="column.dataIndex === 'time'">
						<a-range-picker v-if="record.isEdit" v-model:value="dataCostSource[index][column.dataIndex]"
							@change="datePickerChange" :placeholder="['请选择开始时间', '请选择结束时间']" :valueFormat="dateFormat"
							style="width:100%" />
						<template v-else>
							{{ text }}
						</template>
					</template>
					<template v-if="column.dataIndex === 'adultPrice'">
						<a-input @change="() => { priceChange(dataCostSource[index]) }" v-if="record.isEdit"
							v-model:value="dataCostSource[index][column.dataIndex]" style="margin: -5px 0" placeholder="输入价格" />
						<template v-else>
							{{ text }}
						</template>
					</template>
					<template v-if="column.dataIndex === 'childPrice'">
						<a-input @change="() => { priceChange(dataCostSource[index]) }" v-if="record.isEdit"
							v-model:value="dataCostSource[index][column.dataIndex]" style="margin: -5px 0" placeholder="输入价格" />
						<template v-else>
							{{ text }}
						</template>
					</template>
					<template v-if="column.dataIndex === 'individualSubtotal'">
						<a-input v-if="record.isEdit" v-model:value="dataCostSource[index][column.dataIndex]" style="margin: -5px 0"
							placeholder="自动生成" disabled />
						<template v-else>
							{{ text }}
						</template>
					</template>
					<template v-if="(column.dataIndex === 'action')">
						<div class="editable-row-operations">
							<span v-if="record.isEdit">
								<a @click="save(dataCostSource[index])">确定</a>
								<a @click="cancel(dataCostSource[index])">取消</a>
							</span>
							<span v-else>
								<a @click="edit(dataCostSource[index])">编辑</a>
								<a-popconfirm title="确认删除数据？" @confirm="onCostDelete(index)">
									<a>删除</a>
								</a-popconfirm>
							</span>
						</div>
					</template>
				</template>
			</CommonTable>
			<div class="cost_count">
				<div class="cost_item">费用合计</div>
				<div class="cost_item">{{ 0 }}</div>
			</div>
			<div class="add_box">
				<a-button @click="handleCostAdd" type="primary">添加</a-button>
			</div>
		</a-form>
		<div class="operation">
			<a-button @click="" type="primary" style="margin-right:20px">保存草稿</a-button>
			<a-button @click="" type="primary">提交审核</a-button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { CloseOutlined } from '@ant-design/icons-vue';
import CommonTable from '@/components/common/CommonTable.vue'
const router = useRouter();
const route = useRoute();
const isRefresh = ref('0')
const back = () => {
	router.push({
		/* name: 'electronicContratList',
		params: {
			isRefresh: isRefresh.value
		} */
	})
}
const labelCol = { style: { width: '110px' } }
const form = ref({})
const formRules = {
	contractDays: [{ required: true, trigger: 'blur', message: '请输入合同天数' }],
}
const dateFormat = 'YYYY-MM-DD';
const guideOption = []
const contractColumns = [
	{
		title: '序号',
		dataIndex: 'index',
		key: 'index',
	},
	{
		title: '合同编号',
		dataIndex: 'contractNo',
		key: 'contractNo',
	},
	{
		title: '内含线路',
		dataIndex: 'lineNames',
		key: 'lineNames',
	},
	{
		title: '人数',
		dataIndex: 'touristPeopleNumber',
		key: 'touristPeopleNumber',
	},
	{
		title: '行程日期',
		dataIndex: 'itineraryNo',
		key: 'itineraryNo',
	},
	{
		title: '合同签约旅行社',
		dataIndex: 'contractEstablish',
		key: 'contractEstablish',
	},
	{
		title: '签署网点',
		dataIndex: 'creatorName',
		key: 'creatorName',
	},
	{
		title: '游客代表',
		dataIndex: 'contractStatusName',
		key: 'contractStatusName',
	},
	{
		title: '合同费用（元）',
		dataIndex: 'contractAmount',
		key: 'contractAmount',
	},
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		width: 208
	}
]
const feeColumns = [
	{
		title: '序号',
		dataIndex: 'index',
		key: 'index',
	},
	{
		title: '费用类型',
		dataIndex: 'contractNo',
		key: 'contractNo',
	},
	{
		title: '费用生效时间',
		dataIndex: 'lineNames',
		key: 'lineNames',
	},
	{
		title: '单价(元/人）',
		dataIndex: 'touristPeopleNumber',
		key: 'touristPeopleNumber',
	},
	{
		title: '人数（成人）',
		dataIndex: 'itineraryNo',
		key: 'itineraryNo',
	},
	{
		title: '人数（儿童）',
		dataIndex: 'contractEstablish',
		key: 'contractEstablish',
	},
	{
		title: '费用（元）',
		dataIndex: 'creatorName',
		key: 'creatorName',
	},
]
const hotelColumns = [
	{
		title: '序号',
		dataIndex: 'index',
		key: 'index',
	},
	{
		title: '酒店类型',
		dataIndex: 'contractNo',
		key: 'contractNo',
	},
	{
		title: '酒店名称',
		dataIndex: 'lineNames',
		key: 'lineNames',
	},
	{
		title: '房间数量',
		dataIndex: 'touristPeopleNumber',
		key: 'touristPeopleNumber',
	},
	{
		title: '入住时间',
		dataIndex: 'itineraryNo',
		key: 'itineraryNo',
	},
	{
		title: '入住时间',
		dataIndex: 'contractEstablish',
		key: 'contractEstablish',
	},
	{
		title: '单价（元）',
		dataIndex: 'creatorName',
		key: 'creatorName',
	},
	{
		title: '最大可入住人数',
		dataIndex: 'creatorName',
		key: 'creatorName',
	},
	{
		title: '金额（元）',
		dataIndex: 'creatorName',
		key: 'creatorName',
	},
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		width: 208
	}
]
const ticketColumns = [
	{
		title: '序号',
		dataIndex: 'index',
		key: 'index',
	},
	{
		title: '景区名称',
		dataIndex: 'contractNo',
		key: 'contractNo',
	},
	{
		title: '日期',
		dataIndex: 'lineNames',
		key: 'lineNames',
	},
	{
		title: '门票名称',
		dataIndex: 'touristPeopleNumber',
		key: 'touristPeopleNumber',
	},
	{
		title: '单价（元）',
		dataIndex: 'itineraryNo',
		key: 'itineraryNo',
	},
	{
		title: '团队游客人数',
		dataIndex: 'contractEstablish',
		key: 'contractEstablish',
	},
	{
		title: '购票人数',
		dataIndex: 'creatorName',
		key: 'creatorName',
	},
	{
		title: '金额（元）',
		dataIndex: 'creatorName',
		key: 'creatorName',
	},
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		width: 208
	}
]
const productsColumns = [
	{
		title: '序号',
		dataIndex: 'index',
		key: 'index',
	},
	{
		title: '产品名称',
		dataIndex: 'priceName',
		key: 'priceName',
	},
	{
		title: '费用生效时间',
		dataIndex: 'time',
		key: 'time',
	},
	{
		title: '人数（成人）',
		dataIndex: 'adultNumber',
		key: 'adultNumber',
	},
	{
		title: '成人价',
		dataIndex: 'adultPrice',
		key: 'adultPrice',
	},
	{
		title: '人数（儿童）',
		dataIndex: 'childNumber',
		key: 'childNumber',
	},
	{
		title: '儿童价',
		dataIndex: 'childPrice',
		key: 'childPrice',
	},
	{
		title: '总费用（元）',
		dataIndex: 'individualSubtotal',
		key: 'individualSubtotal',
	},
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		width: 208
	}
]
interface CostItem {
	priceName: string;
	adultPrice: string;
	childPrice: string;
	adultNumber: number;
	childNumber: number;
	individualSubtotal: string;
	time: [];
	isEdit: boolean,
	isOperate?: boolean
}
const dataCostSource = ref<CostItem[]>([])
// 行程时间改变事件
const datePickerChange = () => {
	if (form.value.travelData) {
		form.value.tripStartTime = form.value.travelData[0];
		form.value.tripEndTime = form.value.travelData[1];
	} else {
		form.value.tripStartTime = '';
		form.value.tripEndTime = '';
	}
}
const checkDetails = (id: number) => {

}
// 添加行程费用
const handleCostAdd = () => {
	const newData = {
		isEdit: true,
		isOperate: true,
		priceName: "",
		adultPrice: "",
		childPrice: "",
		adultNumber: 0,
		childNumber: 0,
		individualSubtotal: "",
		time: []
	};
	dataCostSource.value.push(newData);
};
// 删除行程费用
const onCostDelete = (index: number) => {
	dataCostSource.value.splice(index, 1)
};
const save = (obj: any) => {
	obj.isEdit = false
};
const cancel = (obj: any) => {
	obj.isEdit = false
};
const edit = (obj: any) => {
	obj.isEdit = true
};
</script>

<style scoped lang="scss">
.content_box {
	padding: 20px;
}

.header {
	display: flex;
	justify-content: space-between;
	margin-bottom: 10px;
	border-bottom: 1px solid #e1e1e1;
}

.tag {
	margin-bottom: 20px;
	font-size: 16px;
	font-weight: 600;
}

.mb10 {
	margin-bottom: 10px;
}

.close_btn {
	cursor: pointer;
}

.form_item_box {
	display: flex;

	.form_item {
		flex: 1;
	}
}

.add_box {
	width: 100%;
	justify-content: end;
	align-items: center;
	display: flex;
	margin-bottom: 10px;
}

.cost_count {
	margin: 10px 0 20px;
	width: inherit;
	height: 60px;
	display: flex;
	line-height: 60px;
	font-size: 16px;
	background: #f2f2f2;

	.cost_item {
		flex: 1;
		text-align: center;

		&:first-child {
			border-right: 1px solid #e1e1e1;
		}
	}
}

.table-area {
	padding: unset
}

.operation {
	text-align: center;
}
</style>