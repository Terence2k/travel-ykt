<template>
    <BaseModal v-model="dialogVisible" title="选择订票人员" :width="1000" :onOk="reserveTicket">
        <div v-if="dialogVisible">
            <CommonTable row-key="oid" :row-selection="{onSelect}" :columns="columns" :dataSource="travelStore.touristList" :scrollY="false">
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
        </div>
    </BaseModal>
</template>
<script lang="ts" setup>
import api from '@/api';
import CommonTable from '@/components/common/CommonTable.vue';
import { useTravelStore } from '@/stores/modules/travelManagement';
import BaseModal from '@/components/common/BaseModal.vue';
import { cloneDeep } from 'lodash';
import { message, Modal } from 'ant-design-vue';
import { createVNode } from 'vue';
import { CheckOutlined } from '@ant-design/icons-vue';
import { CODEVALUE } from '@/constant';
    const props = defineProps({
		modelValue: {
			type: Boolean,
			default: false,
		},
		ticketId: {
			type: String,
			default: ''
		}
	})
    const travelStore = useTravelStore()
    const emits = defineEmits(['update:modelValue'])
    const IDCard = computed(() => travelStore.IDCard)
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
            dataIndex: 'sourceAddressName',
            key: 'sourceAddressName',
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
    const reserveParams = reactive<{[k: string]: any}>({});

    const onSelect = (record: any, selected: boolean, selectedRows: any[]) => {
		reserveParams.reservePeopleList = cloneDeep(selectedRows)
    }
    const dialogVisible = ref(false);
    
    const ticketInfo: any = ref({})
    watch(() => props.modelValue, (newVal) => {
		dialogVisible.value = newVal
        
	});
    watch(dialogVisible, newVal => {
		if (newVal) {
            props.ticketId && api.travelManagement.ticketDetail(props.ticketId).then((res:any) => {
                ticketInfo.value = res
			})
        }
		emits('update:modelValue', newVal)
	})
    const reserveTicket = (callback: Function) => {
		reserveParams.oid = props.ticketId
        if (!reserveParams.reservePeopleList || !reserveParams.reservePeopleList.length) {
            callback(false)
            return message.error('请选择订票人员')
        }
        console.log(reserveParams)
         
        Modal.confirm({
            title: '景区门票确认？',
            icon: createVNode(CheckOutlined),
            content: createVNode('div', { style: 'color: #333;' }, 
                `您即将提交${ticketInfo.value.startDate}日出行
                “${ticketInfo.value.ticketName}”的门票，
                行程人数（${ticketInfo.value.peopleCount}人）
                `),
                // 订票人数（${reserveParams.reservePeopleList.length}人），订单金额（${ticketInfo.value.unitPrice * reserveParams.reservePeopleList.length}元）。请免票人员带好相关证件到线下进行核准，学生证/老年人身份证可以到线下进行差价退款。
            onOk() {
                
                api.travelManagement.reserveTicket(reserveParams).then((res:any) => {
                    travelStore.setTicketStatus(props.ticketId)
                    message.success('预定成功')
                    callback()
                }).catch((err:any) => {
                    callback(false)
                })
            },
            onCancel() {
                callback(false)
                console.log('Cancel');
            },
            class: 'test',
        });
		
	}
    travelStore.getTraveCode(CODEVALUE.TRAVE_CODE.IDCARD, 'IDCard');
</script>
<style lang="scss" scoped>

</style>