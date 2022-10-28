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
			<!-- <div>
				<h3>选择订票人员</h3>
                <CommonTable :row-selection="{onSelect}" :columns="columns" :dataSource="travelStore.touristList" :scrollY="false">
                    <template #bodyCell="{ column, text, index, record }">
                        <template v-if="column.key === 'index'">
							<div>
								{{index + 1}}
							</div>
						</template>
                        <template v-if="column.key === 'certificateType'">
							<div>
								{{ IDCard.filter((it: any) => it.codeValue === text)[0]?.name }}
							</div>
						</template>
                        <template v-if="column.key === 'gender'">
							<div>
								{{ travelStore.genderList.filter((it: any) => it.codeValue === text)[0]?.name }}
							</div>
						</template>
                        <template v-if="column.key === 'certificatePicture'">
							<div>
								<img src="" alt="">
							</div>
						</template>
                    </template>
                </CommonTable>
			</div> -->
		</a-form>
	</BaseModal>
</template>

<script lang="ts" setup>
    import CommonTable from '@/components/common/CommonTable.vue';
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
	})
	const columns = [
        {
            title: ' 序号 ',
            key: 'index',
            width: '80px'
        },
        {
            title: '证件类型',
            dataIndex: 'certificateType',
            key: 'certificateType',
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
            key: 'gender'
        },
        {
            title: '客源地',
            dataIndex: 'sourceAddressStr',
            key: 'sourceAddressStr',
        },
        {
            title: '健康状态',
            dataIndex: 'healthCode',
            key: 'healthCode',
        },
        {
            title: '特殊证件类型',
            dataIndex: 'specialCertificateType',
            key: 'specialCertificateType',
        },
        {
            title: '证件图片',
            dataIndex: 'specialCertificatePicture',
            key: 'specialCertificatePicture',
        }
    ]
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
    const onSelect = (record: any, selected: boolean, selectedRows: any[]) => {
        console.log(record, selected, selectedRows);
        const len = selectedRows.length
        formState.count = len ? len : ''
        // formState.feelCount
        formState.moneyCount = len * ticketPrice.value;
    }
	const handleOk = async (callback: Function) => {
		try {
			await formRef.value.validateFields()
			formState.unitPrice = ticketPrice.value
			formState.itineraryId = route.query.id || traveListData.oid
			formState.peopleCount = travelStore.touristList.length
			const newFormState = cloneDeep(formState)
			newFormState.reservePeopleCount = formState.peopleCount
			newFormState.totalFee = newFormState.peopleCount * newFormState.unitPrice
			newFormState.reserveStatusName = '草稿'
			await api.travelManagement.reserveTicket(formState)
			travelStore.setTicket(newFormState)
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
		console.log(newVal)
		if (!newVal) {
			formRef.value.resetFields();
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