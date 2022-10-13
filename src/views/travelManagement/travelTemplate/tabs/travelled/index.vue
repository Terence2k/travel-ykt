<template>
	<div class="table-container">
        <div>
            <p class="title">综费产品</p>
            <CommonTable :columns="columns" :dataSource="allFeesProducts" :scrollY="false">
                <template #bodyCell="{ column, text, index, record }">
                    <template v-if="column.key === 'index'">
                        <div>
                            {{index + 1}}
                        </div>
                    </template>
                    <template v-if="column.key === 'feeModel'">
                        {{column.data[text]}}
                    </template>
                </template>
            </CommonTable>
        </div>
        <div>
            <p class="title">景区门票</p>
            <CommonTable :columns="ticketColumns" :dataSource="tableData" :scrollY="false">
                <template #bodyCell="{ column, text, index, record }">
                    <template v-if="column.key === 'index'">
                        <div>
                            {{index + 1}}
                        </div>
                    </template>

                    <template v-if="column.key === 'action'">
                        <div class="action-btns">
                            <a class="item" v-if="!editableData[record.key]"  @click="edit(record.key)">编辑</a>
                            <a class="item" v-else @click="save(record.key)">确定</a>
                            <a class="item">删除</a>
                        </div>
                    </template>
                </template>
            </CommonTable>
            <div class="footer-btn">
                <a-button type="primary" @click="add('addTicketPop')">添加</a-button>
            </div>
        </div>
        <div>
            <p class="title">酒店住宿</p>
            <CommonTable :columns="hotelColumns" :dataSource="tableData" :scrollY="false">
                <template #bodyCell="{ column, text, index, record }">
                    <template v-if="column.key === 'index'">
                        <div>
                            {{index + 1}}
                        </div>
                    </template>

                    <template v-if="column.key === 'action'">
                        <div class="action-btns">
                            <a class="item" v-if="!editableData[record.key]"  @click="edit(record.key)">编辑</a>
                            <a class="item" v-else @click="save(record.key)">确定</a>
                            <a class="item">删除</a>
                        </div>
                    </template>
                </template>
            </CommonTable>
            <div class="footer-btn">
                <a-button type="primary" @click="add('addHotelPop')">添加</a-button>
            </div>
        </div>
		
	</div> 
    <addHotel v-model="addHotelPop" />
    <addTicket v-model="addTicketPop" />
</template>
<script lang="ts" setup>
import CommonTable from '@/components/common/CommonTable.vue';
import addHotel from './addHotel.vue';
import addTicket from './addTicket.vue';
import { useTraveInfo } from './traveInfo';
const props = defineProps({
	onCheck: {
		type: Boolean
	}
})
const emits = defineEmits(['onSuccess'])
const { 
    columns, 
    ticketColumns, 
    addHotelPop, 
    addTicketPop, 
    hotelColumns, 
    tableData, 
    allFeesProducts,
    editableData, 
    edit, 
    save, 
    add } = useTraveInfo(props, emits);

</script>
<style lang="less" scoped>
	.select-guide {
		width: 115px;
		color: #D5D5D5;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.footer-btn {
		display: flex;
		justify-content: flex-end;
		margin: 16px 20px;
	}
    .title {
        font-size: 16px;
        font-weight: bold;
        padding-left: 20px;
    }
</style>