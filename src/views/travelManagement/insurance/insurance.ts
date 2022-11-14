import { cloneDeep } from 'lodash';
import dayjs from 'dayjs';
import type { UnwrapRef } from 'vue';

import { useTravelStore } from '@/stores/modules/travelManagement';
import { validateRules, validateFields, generateGuid } from '@/utils';
import api from '@/api/index';
import { CODEVALUE } from '@/constant'
import { message } from 'ant-design-vue';
interface DataItem {
	certificateType: string;
	healthCode: string;
	sourceAddress: string;
	gender: string;
	insuranceType:string;
	name: string;
	certificateNo: string;
	certificatePicture: string;
	sourceAddressName: string;
	specialCertificateType: string;
	addressId: [],
	specialCertificatePicture: []
}

export function useInsurance(props: any, emits: any): Record<string, any> {
	const travelStore = useTravelStore()
	const route = useRoute();
	const { onCheck } = toRefs(props);
	const IDCard = computed(() => travelStore.IDCard)
	const specialId = computed(() => travelStore.specialId)
	const state = reactive<{editableData: UnwrapRef<Record<string, DataItem>>, [k:string]: any}>({
		formRef: null,
		editableData: {},
		editableData2:{},
		startRef: {},
		cityOptions: [],
		selectKey: ['certificateType', 'gender', 'specialCertificateType','insuranceType'],
		inputKey: ['certificateNo', 'name'],
		inputKey2:[''],
		rulesRef: {},
        onSelect: (record: DataItem, selected: boolean, selectedRows: DataItem[]) => {
            console.log(record, selected, selectedRows);
        },
		tableData: travelStore.touristList,
		tableData2:[],
		columns: [
			{
				title: ' 序号 ',
				key: 'index',
				width: '80px'
			},
			{
				title: '证件类型',
				dataIndex: 'certificateType',
				key: 'certificateType',
				data: IDCard
			},
			{
				title: '证件号码',
				dataIndex: 'certificateNo',
				key: 'certificateNo'
			},
			{
				title: '姓名',
				dataIndex: 'name',
				key: 'name',
			},
			{
				title: '性别',
				dataIndex: 'gender',
				key: 'gender',
				data: travelStore.genderList
			},
			{
				title: '客源地',
				dataIndex: 'addressId',
				key: 'addressId',
			},
			{
				title: '健康状态',
				dataIndex: 'healthCode',
				key: 'healthCode',
			},
            {
				title: '证件图片',
				dataIndex: 'specialCertificatePicture',
				key: 'specialCertificatePicture',
			},
			{
				title: '选择险种',
				dataIndex: 'insuranceType',
				key: 'insuranceType',
				data: travelStore.insuranceList
			},
			{
				title: '操作',
				key: 'action',
				fixed: 'right'
			}
		],
		columns2: [
			{
				title: ' 序号 ',
				key: 'index',
				width: '80px'
			},
			{
				title: '险种',
				dataIndex: 'certificateType',
				key: 'certificateType',
			},
			{
				title: '已购人数',
				dataIndex: 'certificateNo',
				key: 'certificateNo'
			},
			{
				title: '保障天数',
				dataIndex: 'name',
				key: 'name',
			},
			{
				title: '保险生效时间',
				dataIndex: 'gender',
				key: 'gender',
			},
			{
				title: '保险失效时间',
				dataIndex: 'addressId',
				key: 'addressId',
			},
			{
				title: '单价（元）',
				dataIndex: 'healthCode',
				key: 'healthCode',
			},
            {
				title: '全价（元）',
				dataIndex: 'specialCertificatePicture',
				key: 'specialCertificatePicture',
			},
			{
				title: '保险购买渠道',
				dataIndex: 'insuranceType',
				key: 'insuranceType',
			},
			{
				title: '保单编号',
				dataIndex: 'insuranceType',
				key: 'insuranceType',
			},
			{
				title: '操作',
				key: 'action',
				fixed: 'right'
			}
		]
	});

	const methods = {
		
	}
	
	return {
		...toRefs(state),
		...methods
	}
}