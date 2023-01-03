<template>
	<BaseModal v-model="dialogVisible" title="添加景区门票" :width="1000" :onOk="handleOk">
		<a-form
			ref="formRef"
			:model="formState"
			autocomplete="off"
			labelAlign="left"
			:label-col="{ span: 3 }"
			:wrapper-col="{ span: 10 }"
		>
			<a-form-item label="选择景区" name="scenicId" :rules="[{ required: true, message: '请选择景区' }]">
				<a-select 
					:disabled="productRow.productId &&
							productRow.productId.toString() ? true : false"
                    v-model:value="formState.scenicId" 
                    placeholder="请选择景区"
                    @change="handleChange">
					<a-select-option 
                        :value="item.ticketId"
						:name="item.ticketName"
                        v-for="item in ticketData.scenicList"
                        :key="item.ticketId">{{item.ticketName}}</a-select-option>
				</a-select>
			</a-form-item>

			<a-form-item label="门票类型" name="ticketType" :rules="[{ required: true, message: '请选择门票类型' }]">
				<a-select
					@change="handelChangeType"
                    v-model:value="formState.ticketType" 
                    placeholder="请选择门票类型">
					<a-select-option 
                        :value="item.data"
						:name="item.typeName"
                        v-for="item in ticketData.ticketType"
                        :key="item.data">{{item.typeName}}</a-select-option>
				</a-select>
			</a-form-item>

			<a-form-item label="入园日期" name="startDate" :rules="[{ required: true, message: '请选择入园日期' }]">
                <!-- <a-date-picker
					:disabled-date="travelStore.setDisabled"
					style="width: 100%"
					v-model:value="formState.startDate"
					format="YYYY-MM-DD"
					value-format="YYYY-MM-DD"
				/> -->
				<datePicker style="width: 100%"
							v-model="formState.startDate"
							placeholder="入园日期"
							:disabled-date="travelStore.setDisabledDate()"
							value-format="YYYY-MM-DD"
							type="date" />
			</a-form-item>

			<a-form-item
				label="选择门票"
				name="ticketId"
				:rules="[{ required: true, message: '请选择门票' }]"
			>
				<a-select @change="changeTicket" v-model:value="formState.ticketId" placeholder="请选择门票">
					<a-select-option 
                        :value="item.oid"
						:name="item.ticketName"
                        v-for="item in ticketData.ticketList"
                        :key="item.oid">{{item.ticketName}}</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item label="行程人数" name="travelName">
				<span>{{travelStore.touristList.length}}人</span>
			</a-form-item>

            <a-form-item label="门票价格" name="travelName">
				<span>{{ticketPrice / 100 || 0}}元</span>
			</a-form-item>

			<div v-if="(formState.ticketType === TicketType.SHOW || formState.ticketType === TicketType.UNITE)">
				<a-form-item
				label="子票详情"
				name="ticketId"
				:rules="[{ required: true, message: '选择座位' }]"
			>
				
				</a-form-item>
				<CommonTable
					v-if="(formState.ticketType === TicketType.UNITE)"
					:columns="columns" 
					:dataSource="ticketData.childTicket" 
					:scrollY="false">
					<template #bodyCell="{ column, text, index, record }">
						<template v-if="column.key === 'action'">
							<a @click="(dialogVisibleTicket = true)">选择座位分区</a>
						</template>
					</template>
				</CommonTable>
				<selectTicket v-if="(formState.ticketType === TicketType.SHOW)"></selectTicket>
			</div>
			<a-form-item
				label=""
			>
				
			</a-form-item>
            <!-- <a-form-item label="入园时段" name="startDate" :rules="[{ required: true, message: '请选择入园时段' }]">
                <a-time-picker
                    style="width: 100%"
					v-model:value="formState.startDate"
					format="HH:mm" valueFormat="HH:mm"
				/>
			</a-form-item> -->

            <!-- <a-form-item label="订票人数" name="count" :rules="[{ required: true, message: '请勾选订票人数' }]">
				<a-input v-model:value="formState.count" disabled placeholder="无需填写，勾选人员名单后自动计算" />
			</a-form-item> -->
            
            <!-- <a-form-item label="免票人数">
				<a-input v-model:value="formState.startDate" disabled placeholder="无需填写，勾选人员名单后自动计算（如符合满16减1政策）" />
			</a-form-item> -->

            <a-form-item label="订单金额">
				<a-input v-model:value="formState.unitPrice" disabled placeholder="无需填写，勾选人员名单后自动计算" />
			</a-form-item>

            <a-form-item label="订单编号">
				<a-input v-model:value="formState.ticketOrderNo" disabled placeholder="无需填写，订单提交后自动生成" />
			</a-form-item>

            <a-form-item label="订单生成时间">
				<a-input v-model:value="formState.createTime" disabled placeholder="无需填写，订单提交后自动生成" />
			</a-form-item>
			
		</a-form>
	</BaseModal>
	<BaseModal v-model="dialogVisibleTicket" title="选择座位分区" :width="900" :onOk="handleOkTicket">
		<selectTicket></selectTicket>
	</BaseModal>
</template>

<script lang="ts" setup>
    
	import BaseModal from '@/components/common/BaseModal.vue';
	import selectTicket from './selectTicket.vue';
    import { useTravelStore } from '@/stores/modules/travelManagement';
	import datePicker from '@/components/common/datePicker.vue';
    import api from '@/api';
	import { cloneDeep, debounce } from 'lodash';
	import { TicketType } from '@/enum';
	import CommonTable from '@/components/common/CommonTable.vue';
	const traveListData = JSON.parse(sessionStorage.getItem('traveList') as any ) || {}
	const route = useRoute()
    const travelStore = useTravelStore()
    const IDCard = computed(() => travelStore.IDCard)
	const formRef = ref()
	const props = defineProps({
		modelValue: {
			type: Boolean,
			default: false,
		},
		ticketId: {
			type: String,
			default: ''
		},
		productRow: {
			type: Object,
			default: {}
		}
	})
	
    const tableData = ref([])
    const ticketData = reactive<{[k:string]: any}>({
        scenicList: [],
        ticketList: [],
		ticketType: [],
		childTicket: []
    })
	const formState = reactive<{[k: string]: any}>({
		ticketId: '',
		startDate: '',
		endData: '',
        count: ''
	});
	const dialogVisibleTicket = ref(false);
	const columns: any = [
		{
            title: '子票名称',
            dataIndex: 'subTicketName',
            key: 'subTicketName',
        },
		{
            title: '票种',
            dataIndex: 'subTicketTypeName',
            key: 'subTicketTypeName',
        },
		{
            title: '可用库存',
            dataIndex: 'subTicketStock',
            key: 'subTicketStock',
        },
		{
            title: '单价（元）',
            dataIndex: 'subTicketPrice',
            key: 'subTicketPrice',
        },
		{
            title: '是否有减扣',
            dataIndex: 'isHasDiscountName',
            key: 'isHasDiscountName',
        },
		// {
        //     title: '操作',
        //     dataIndex: 'action',
        //     key: 'action',
        // },
	]
	const dataSource = ref<any>([{startDate: '123'}]);
	const ticketPrice = ref();
	// computed(() => {
    //     return ticketData.ticketList.filter((it:any) => it.oid === formState.ticketId)[0]?.price
    // })
    const getScenicList = async () => {
        ticketData.scenicList = await api.travelManagement.getScenicList()
    }

	// 获取子票详情
	const getChildTicket = (ticketId: number | string, schoolDate: string) => {
		api.travelManagement.getChildTicket(
			{
				ticketId,
				schoolDate,
			}
		).then((res: any) => {
			ticketData.childTicket = res.map((item: any) => {
				item.subTicketTypeName = ticketData.ticketType.filter((it: any) => it.data === item.subTicketType)[0]?.typeName
				item.subTicketPrice = item.subTicketPrice / 100;
				item.isHasDiscountName = item.isHasDiscount ? '是' : '否';
				return item
			});
		})
	}

	// handelChangeType
	const handelChangeType = async (e: any) => {
		formState.ticketId = ''
		try {
			e && (ticketData.ticketList = await api.travelManagement.getTicketList(formState.scenicId, {ticketType: getTicketInitEnum(e)}))
		} catch (error) {
			ticketData.ticketList = []
		}
		if(e === TicketType.UNITE) {
			formState.ticketId && formState.startDate && getChildTicket(formState.ticketId, formState.startDate)
		}
	}
    
	const handleOk = async (callback: Function) => {
		try {
			let traveListData = JSON.parse(sessionStorage.getItem('traveList') as any) || {}
			await formRef.value.validateFields()
			formState.unitPrice = ticketPrice.value
			formState.itineraryId = route.query.id || traveListData.oid
			formState.peopleCount = travelStore.touristList.length
			if (formState.ticketType === TicketType.UNITE) {
				formState.childTicketIds = ticketData.childTicket.map((it: any) => it.subTicketId)
			} else {
				formState.childTicketIds = []
			}
			const newFormState = cloneDeep(formState)
			newFormState.reservePeopleCount = formState.peopleCount
			newFormState.unitPrice = ticketPrice.value / 100;
			newFormState.totalFee = newFormState.peopleCount * newFormState.unitPrice
			const res = await api.travelManagement.addTicket(formState)
			res && (newFormState.oid = res)
			// travelStore.setTicket(newFormState)
			travelStore.setTicket(newFormState)
			
			callback()
		} catch (errorInfo) {
			callback(false)
		}
		
	};
	const getTicketInitEnum = (key: string) => {
		let data = 0
		key = key?.toString()
		switch(key) {
			case '1':
				data = 1
				break;
			case '2':
				data = 0
				break;
			case '3':
				data = 2
				break;
		}
		return data;
	}
    const handleChange = async (event: number, option:any) => {
		console.log(event, 'event &&event &&event &&event &&')
        formState.ticketId = ''
		formState.scenicName = option.name;
		ticketData.childTicket = [];
		const ticketType = formState.ticketType || option.ticketType
        event && (ticketType || ticketType === 0) && 
		(ticketData.ticketList = await api.travelManagement.getTicketList(event, {ticketType: getTicketInitEnum(ticketType)}))
    }

	const changeTicket = (event: number, option: any) => {
		formState.ticketName = option.name;
	}
	
	const getTicketEnum = (key: string) => {
		let data = 0
		switch(key) {
			case '单票':
				data = 1
				break;
			case '联票':
				data = 2
				break;
			case '演出票':
				data = 3
				break;
		}
		return data;
	}

	// 获取门票类型
	const getTicketType = async () => {
		const res = await api.travelManagement.getTicketType();
		ticketData.initTicketType = res;
		ticketData.ticketType = res.map((item: any) => {
			item.data = getTicketEnum(item.typeName);
			return item;
		});
		ticketData.ticketType = ticketData.ticketType.filter((it: any) => it.data !== TicketType.SHOW)
	}

	const handleOkTicket = () => {

	}

	const emits = defineEmits(['update:modelValue'])
	const dialogVisible = ref(false);
	watch(() => props.modelValue, (newVal) => {
		dialogVisible.value = newVal
	});
	watch(dialogVisible, newVal => {
		console.log(newVal, props.ticketId)
		if (!newVal) {
			formRef.value.resetFields();
			for (let k in formState) {
				formState[k] = '';
			}
		} else {
			
			!props.productRow.productId && props.ticketId && api.travelManagement.ticketDetail(props.ticketId).then((res:any) => {
				handleChange(res.scenicId, {name: res.scenicName, ticketType: res.ticketType})
				for (let k in res) {
					formState[k] = res[k]
				}
			})
			formState.scenicId = props.productRow.productId;
			console.log(props.productRow.productId)
			props.productRow.productId && handleChange(props.productRow.productId, {name: props.productRow.scenicName, ticketType: props.productRow.ticketType})
			if (!props.productRow.productId && !props.ticketId) {
				handleChange(props.productRow.scenicId, {name: props.productRow.scenicName, ticketType: props.productRow.ticketType})
				for (let k in props.productRow) {
					formState[k] = props.productRow[k]
				}
				
			}
		}
		emits('update:modelValue', newVal)
	})

	const getStock = async (ticketId: number | string, endTime: string, startTime: string) => {
		const res = await api.travelManagement.getStock({
			ticketId,
			endTime,
			startTime
		});
		ticketPrice.value = res[0].ticketPrice
	}
	const debounceFun = debounce((ticketId: number | string, endTime: string, startTime: string) => {
		getStock(ticketId, endTime, startTime);
		formState.ticketType === TicketType.UNITE && getChildTicket(ticketId, startTime)
	}, 500);

	watch(
		() => [formState.ticketId, formState.startDate],
		([ticketId, newallDate]) => {
			if (ticketId && newallDate && newallDate) {
				debounceFun(ticketId, newallDate, newallDate);
			}
		}
	);
    getScenicList();
	getTicketType();
</script>

<style lang="less" scoped>
.visable {
	visibility: hidden;
}
.table-area {
    padding: 0;
}
</style>>