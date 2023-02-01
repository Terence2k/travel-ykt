<template>
	<div class="table-area">
		<div class="p">
			<a-tooltip color="cyan">
				<template #title>
					如行程中需要增加游客，需要为新游客发起新的 行程填报，点击添加游客按钮，系统将引导您填 报新行程单。如线下有游客未到，无需删除，最
					终结算时以线下实际核销数据为准。</template
				>
				<span class="d-span">(游客添加规则说明)</span>
			</a-tooltip>
		</div>
		<CommonTable :row-selection="{}" :dataSource="state.tableData.data" :columns="columns" rowKey="oid" :scrollY="false">
			<template #bodyCell="{ column, index, record }">
				<template v-if="column.key === 'healthCodeStatus'">
					<span v-if="record.healthCodeStatus == '00'">绿码</span>
					<span v-else-if="record.healthCodeStatus == '01'">黄码</span>
					<span v-else-if="record.healthCodeStatus == '10'">红码</span>
				</template>
				<template v-if="column.key === 'specialCertificatePicture'">
					<Upload v-model="record.specialCertificatePicture" :maxCount="state.num" v-if="record.specialCertificatePicture != null" disabled />
				</template>
			</template>
		</CommonTable>
		<div class="add-div">
			<a-button type="primary" @click="modelValue = true">添加游客</a-button>
		</div>
		<BaseModal title="添加游客提醒" v-model="modelValue" :width="400" @close="">
			<p>如需添加新游客，需要为新游客填报新的 行程单，原行程单依然有效。系统会自动 记录新行程单与原行程单的关联关系。</p>
			<template v-slot:footer>
				<a-button @click="modelValue = false">取消</a-button>
				<a-button type="primary" @click="newTravel">填报新行程单</a-button>
			</template>
		</BaseModal>
	</div>
</template>

<script setup lang="ts">
import { ref, Ref, computed, watch, toRefs, reactive } from 'vue';
import CommonTable from '@/components/common/CommonTable.vue';
import BaseModal from '@/components/common/BaseModal.vue';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import { useTravelStore } from '@/stores/modules/travelManagement';
import { message } from 'ant-design-vue';
import Upload from '@/components/common/imageWrapper.vue';
import api from '@/api';
import { any, object, string } from 'vue-types';
const route = useRoute();
const dialogVisible = ref(false);
const navigatorBar = useNavigatorBar();
const formValidate: Ref<Record<string, any>> = ref({});
const travelStore = useTravelStore();
const modelValue = ref(false);
const router = useRouter();
const columns = [
	{
		title: '姓名',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: '身份证件类型',
		dataIndex: 'certificateTypeName',
		key: 'certificateTypeName',
	},
	{
		title: '身份证号码',
		dataIndex: 'certificateNo',
		key: 'certificateNo',
	},
	{
		title: '性别',
		dataIndex: 'genderName',
		key: 'genderName',
	},
	{
		title: '客源地',
		dataIndex: 'sourceAddressName',
		key: 'sourceAddressName',
	},
	{
		title: '联系电话',
		dataIndex: 'phone',
		key: 'phone',
	},
	// {
	// 	title: '中高风险地区判断',
	// 	dataIndex: 'specialCertificateTypeName',
	// 	key: 'specialCertificateTypeName',
	// },
	{
		title: '健康码状态',
		dataIndex: 'healthCodeStatus',
		key: 'healthCodeStatus',
	},
	{
		title: '特殊证件类型',
		dataIndex: 'specialCertificateTypeName',
		key: 'specialCertificateTypeName',
	},
	{
		title: '特殊证件照片',
		dataIndex: 'specialCertificatePicture',
		key: 'specialCertificatePicture',
	},
];
const state = reactive({
	tableData: {
		data: [],
	},
	newItineraryId: '',
	num: 0,
});
const auditRef = ref();
const onSearch = () => {
	console.log(route.query.id, '1231313');
	api.travelManagement.listByItinerary(route.query.id).then((res: any) => {
		// 处理显示照片个数
		res.map((i: any, index: number) => {
			if (i.specialCertificatePicture) {
				i.specialCertificatePicture = i.specialCertificatePicture.toString();
				state.num = i.specialCertificatePicture.split(',').length;
			}
		});
		let data = res.map((i: any) => {
			return {
				name: i.name,
				certificateId: i.certificateNo,
			};
		});
		api.travelManagement.getHealthCode(data).then((item: any) => {
			let status = item.map((i: any) => {
				return i.healthCodeStatus;
			});
			state.tableData.data = res.map((it: any, index: number) => {
				it.healthCodeStatus = status[index];
				return it;
			});
		});
	});
};
const newTravel = () => {
	let pW = new FormData();
	pW.append('itineraryId', route.query.id);
	api.travelManagement.changeTouristFillNewItinerary(pW).then((res: any) => {
		router.push({
			path: '/travel/travel_manage/add_travel',
			query: {
				id: res.newItineraryId,
			},
		});
	});
};
onSearch();
</script>

<style lang="less" scoped>
.top {
	display: flex;
	justify-content: space-between;
}
.p {
	width: 90%;
	margin: 10px auto;
	display: flex;
	justify-content: end;
}
.d-span {
	color: rgb(14, 171, 241);
	cursor: pointer;
}
.add-div {
	margin-top: 30px;
	text-align: right;
}
</style>
