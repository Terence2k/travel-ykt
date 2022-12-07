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

			<a-form-item label="入园日期" name="startDate" :rules="[{ required: true, message: '请选择入园日期' }]">
                <a-date-picker
					:disabled-date="travelStore.setDisabled"
					style="width: 100%"
					v-model:value="formState.startDate"
					format="YYYY-MM-DD"
					value-format="YYYY-MM-DD"
				/>
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
				<span>{{ticketPrice}}元</span>
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
				<a-input v-model:value="formState.price" disabled placeholder="无需填写，勾选人员名单后自动计算" />
			</a-form-item>

            <a-form-item label="订单编号">
				<a-input v-model:value="formState.ticketOrderNo" disabled placeholder="无需填写，订单提交后自动生成" />
			</a-form-item>

            <a-form-item label="订单生成时间">
				<a-input v-model:value="formState.createTime" disabled placeholder="无需填写，订单提交后自动生成" />
			</a-form-item>
			
		</a-form>
	</BaseModal>
</template>

<script lang="ts" setup>
    
	import BaseModal from '@/components/common/BaseModal.vue';
    import { useTravelStore } from '@/stores/modules/travelManagement';
    import api from '@/api';
	import { cloneDeep, debounce } from 'lodash';

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
        ticketList: []
    })
	const formState = reactive<{[k: string]: any}>({
		ticketId: '',
		startDate: '',
		endData: '',
        count: ''
	});


	const ticketPrice = computed(() => {
        return ticketData.ticketList.filter((it:any) => it.oid === formState.ticketId)[0]?.price
    })

    const getScenicList = async () => {
        ticketData.scenicList = await api.travelManagement.getScenicList()
    }
    
	const handleOk = async (callback: Function) => {
		try {
			let traveListData = JSON.parse(sessionStorage.getItem('traveList') as any) || {}
			await formRef.value.validateFields()
			formState.unitPrice = ticketPrice.value
			formState.itineraryId = route.query.id || traveListData.oid
			formState.peopleCount = travelStore.touristList.length
			const newFormState = cloneDeep(formState)
			newFormState.reservePeopleCount = formState.peopleCount
			newFormState.totalFee = newFormState.peopleCount * newFormState.unitPrice
			const res = await api.travelManagement.addTicket(formState)
			// travelStore.setTicket(newFormState)
			// travelStore.setTicket(newFormState, res, props.productRow.productId)
			
			callback()
		} catch (errorInfo) {
			callback(false)
		}
		
	};

    const handleChange = async (event: number, option:any) => {
        formState.ticketId = ''
		formState.scenicName = option.name;
        ticketData.ticketList = await api.travelManagement.getTicketList(event)
    }

	const changeTicket = (event: number, option: any) => {
		formState.ticketName = option.name;
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
				handleChange(res.scenicId, {name: res.scenicName})
				for (let k in res) {
					formState[k] = res[k]
				}
			})
			formState.scenicId = props.productRow.productId;
			props.productRow.productId && handleChange(props.productRow.productId, {name: props.productRow.scenicName})
		}
		emits('update:modelValue', newVal)
	})

	const getStock = (ticketId: number | string, endTime: string, startTime: string) => {
		api.travelManagement.getStock({
			ticketId,
			endTime,
			startTime
		})
	}
	const debounceFun = debounce((ticketId: number | string, endTime: string, startTime: string) => {
		getStock(ticketId, endTime, startTime);
	}, 500);

	watch(
		() => [formState.ticketId, formState.startDate],
		([newHotelId, newallDate]) => {
			if (newHotelId && newallDate && newallDate) {
				debounceFun(newHotelId, newallDate, newallDate);
			}
		}
	);
    getScenicList();
</script>

<style lang="less" scoped>
.visable {
	visibility: hidden;
}
.table-area {
    padding: 0;
}
</style>>