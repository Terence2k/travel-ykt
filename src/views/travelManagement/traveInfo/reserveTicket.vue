<template>
    <BaseModal v-model="dialogVisible" title="选择订票人员" :width="1000" :onOk="reserveTicket">
        <div v-if="dialogVisible">
            <CommonTable row-key="oid" :row-selection="{selectedRowKeys, onChange, getCheckboxProps}" :columns="columns" :dataSource="touristList" :scrollY="false">
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
                            {{ text ? '男' : '女' }}
                        </div>
                    </template>
                    <template v-if="column.key === 'specialCertificateType'">
                        <div>
                            {{ specialId.filter((it: any) => it.codeValue === text)[0]?.name }}
                        </div>
                    </template>
                    <template v-if="column.key === 'specialCertificatePicture'">
                        <div class="d-flex">
                            <CommonImg v-for="url in record.specialCertificatePicture" :key="url" :width="50" :src="url"></CommonImg>
                        </div>
                    </template>
                    <template v-if="column.key === 'healthCode'">
						<span class="green-code" v-if="text === '00'">
							{{CODEVALUE.HEALTHCODE[text]}}
						</span>
						<span class="yellow-code" v-if="text === '01'">
							{{CODEVALUE.HEALTHCODE[text]}}
						</span>
						<span class="red-code" v-if="text === '10'">
							{{CODEVALUE.HEALTHCODE[text]}}
						</span>
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
import CommonImg from '@/components/common/CommonImg.vue';

    const props = defineProps({
		modelValue: {
			type: Boolean,
			default: false,
		},
		ticketId: {
			type: String,
			default: ''
		},
        orderNo: {
            type: String,
			default: ''
        }
	})
    const travelStore = useTravelStore()
    const touristList = ref([]);
    const selectedRowKeys = ref([])// 已预定游客
    const emits = defineEmits(['update:modelValue', 'onSuccess', 'getTravelDetail'])
    const IDCard = computed(() => travelStore.IDCard)
    const specialId = computed(() => travelStore.specialId)
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

    const getScenicTourist = () => {
        api.travelManagement.getScenicTourist({
            orderNo: props.orderNo
        }).then(async (res: any) => {
            selectedRowKeys.value = res.filter((item: any) => item.isReserved).map((it: any) => it.oid)
            console.log(selectedRowKeys.value)
            touristList.value = await travelStore.getHealthCode(res) as any;
        })
    }

    const reserveParams = reactive<{[k: string]: any}>({});

    // const onSelect = (record: any, selected: boolean, selectedRows: any[]) => {
	// 	reserveParams.reservePeopleList = cloneDeep(selectedRows)
    // }
    // const onSelectAll = (selected: any, selectedRows: any, changeRows: any) => {
    //     // console.log(selected, selectedRows, changeRows)
    //     reserveParams.reservePeopleList = cloneDeep(selectedRows)
    // }
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
            props.orderNo && getScenicTourist();
        }
		emits('update:modelValue', newVal)
	})

    const getCheckboxProps = (record: any) => ({
        disabled: record.isReserved
    })

    const onChange = (keys: any, rows: any) => {
        selectedRowKeys.value = keys
        reserveParams.reservePeopleList = rows.map((item: any) => {
            item.gender = item.gender ? 1 : 0;
            return item;
        });
    }

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
                    // travelStore.setTicketStatus(props.ticketId);
                    // travelStore.setTicketResvePeple(reserveParams.reservePeopleList.length);
                    emits('getTravelDetail');
                    message.success('预定成功');
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
    travelStore.getTraveCode(CODEVALUE.TRAVE_CODE.SPECIALID, 'specialId');
</script>
<style lang="scss" scoped>
::v-deep(.ant-image) {
	margin-left: 10px;
}
</style>