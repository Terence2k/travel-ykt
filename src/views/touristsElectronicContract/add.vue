<template>
  <div class="content_box">
    <a-tabs v-model:activeKey="activeKey" @change="nextTep">
      <a-tab-pane key="1" tab="行程信息">
        <a-form ref="formRef" :model="form" :rules="formRules" name="addStore" autocomplete="off" :label-col="labelCol"
          :wrapper-col="{ span: 10 }">
          <div class="tag">基本信息</div>
          <a-form-item name="day" label="合同天数">
            <div class="reform">
              <a-form-item style="flex: 1;" name="contractDays">
                <div style="display:flex;align-items:center;">
                  <a-input v-model:value.number="form.contractDays" placeholder="请输入合同天数">
                  </a-input>
                  <span style="margin:0 10px">天</span>
                </div>
              </a-form-item>
              <a-form-item style="flex: 1;" name="travelNight">
                <div style="display:flex;align-items:center;">
                  <a-input v-model:value.number="form.travelNight" placeholder="请输入合同夜数" />
                  <span style="margin-left:10px">夜</span>
                </div>
              </a-form-item>
            </div>
          </a-form-item>
          <a-form-item name="entrustTravelId" label="委托旅行社">
            <a-select placeholder="请选择委托旅行社" v-model:value="form.entrustTravelId" allowClear>
              <a-select-option v-for="item in entrustTravelOption" :value="item.oid">{{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item name="travelData" label="行程日期">
            <a-range-picker v-model:value="form.travelData" @change="datePickerChange"
              :placeholder="['请选择开始时间', '请选择结束时间']" :format="dateFormat" :valueFormat="dateFormat" style="width:100%" />
          </a-form-item>
          <a-form-item name="touristPeopleNumber" label="游客人数">
            <a-input v-model:value="form.touristPeopleNumber" placeholder="无需填写，输入名单后自动生成" disabled>
            </a-input>
          </a-form-item>
          <a-form-item name="insuranceBuyMode" label="保险购买方式">
            <a-select placeholder="请选择保险购买方式" v-model:value="form.insuranceBuyMode" allowClear>
              <a-select-option v-for="item in insuranceOption" :value="item.codeValue">{{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item name="contractType" label="散客合同类型">
            <a-select placeholder="请选择散客合同类型" v-model:value="form.contractType" @change="contractOptionChange"
              allowClear>
              <a-select-option v-for="item in contractOption" :value="item.codeValue">{{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item name="contractFileUrl" label="上传附件" v-if="!isShow">
            <Upload v-model="form.contractFileUrl" :maxCount="9" />
            <pdfUpload v-model="form.pdfFileUrl" :maxCount="1" />
          </a-form-item>
          <div class="tag">选择线路</div>
          <a-table :columns="lineColumns" :data-source="dataLineSource" bordered :pagination="false">
            <template #bodyCell="{ column, text, record, index }">
              <template v-if="column.key === 'index'">
                {{ index + 1 }}
              </template>
              <template v-if="column.dataIndex === 'lineId'">
                <a-select v-if="record.isEdit" v-model:value="dataLineSource[index][column.dataIndex]"
                  @change="() => { lineSelectChange(dataLineSource[index]) }" placeholder="请选择可用线路" allowClear>
                  <a-select-option v-for="item in lineOption" :value="item.codeValue">{{ item.name }}
                  </a-select-option>
                </a-select>
                <template v-else>
                  {{ cmplineName(text) }}
                </template>
              </template>
              <template v-if="column.dataIndex === 'lineStartTime'">
                <a-date-picker v-if="record.isEdit" v-model:value="dataLineSource[index][column.dataIndex]"
                  placeholder="请选择开始时间" style="width:100%" :format="dateFormat" :valueFormat="dateFormat" />
                <template v-else>
                  {{ text }}
                </template>
              </template>
              <template v-if="column.dataIndex === 'lineEndTime'">
                <a-date-picker v-if="record.isEdit" v-model:value="dataLineSource[index][column.dataIndex]"
                  placeholder="请选择结束时间" style="width:100%" :format="dateFormat" :valueFormat="dateFormat" />
                <template v-else>
                  {{ text }}
                </template>
              </template>
              <template v-if="['adultPrice', 'childPrice', 'lineDescribe',].includes(column.dataIndex)">
                <a-input v-if="record.isEdit" v-model:value="dataLineSource[index][column.dataIndex]"
                  placeholder="选择线路自动生成" disabled style="margin: -5px 0" />
                <template v-else>
                  {{ text }}
                </template>
              </template>
              <template v-if="column.dataIndex === 'action'">
                <div class="editable-row-operations">
                  <span v-if="record.isEdit">
                    <a @click="save(dataLineSource[index])">确定</a>
                    <a @click="cancel(dataLineSource[index])">取消</a>
                  </span>
                  <span v-else>
                    <a @click="edit(dataLineSource[index])">编辑</a>
                    <a-popconfirm title="确认删除数据？" @confirm="onLineDelete(index)">
                      <a>删除</a>
                    </a-popconfirm>
                  </span>
                </div>
              </template>
            </template>
          </a-table>
          <div class="add_box">
            <a-button @click="handleLineAdd">添加</a-button>
          </div>
          <div class="tag">添加游客</div>
          <a-table :columns="touristColumns" :data-source="dataTouristSource" bordered :pagination="false">
            <template #headerCell="{ column }">
              <template v-if="['certificatesType', 'certificatesNo', 'touristName'].includes(column.key)">
                <span style="color:#ff4d4f">
                  *
                </span>
                {{ column.title }}
              </template>
            </template>
            <template #bodyCell="{ column, text, record, index }">
              <template v-if="column.key === 'index'">
                {{ index + 1 }}
              </template>
              <template v-if="column.dataIndex === 'certificatesType'">
                <template v-if="record.isEdit">
                  <a-form ref="formRef1" :model="dataTouristSource[index]" :rules="formRules" autocomplete="off">
                    <a-form-item name="certificatesType">
                      <a-select placeholder="请选择身份证件类型" v-model:value="dataTouristSource[index][column.dataIndex]"
                        allowClear>
                        <a-select-option v-for="item in certificatesTypeOption" :value="item.codeValue">{{ item.name }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-form>
                </template>
                <template v-else>
                  {{ cmpCertificatesType(text) }}
                </template>
              </template>
              <template v-if="column.dataIndex === 'certificatesNo'">
                <template v-if="record.isEdit">
                  <a-form ref="formRef2" :model="dataTouristSource[index]" :rules="formRules" autocomplete="off">
                    <a-form-item name="certificatesNo">
                      <a-input placeholder="请输入证件号码" @change="() => { certificatesNoChange(dataTouristSource[index]) }"
                        v-model:value="dataTouristSource[index][column.dataIndex]" allowClear style="margin: -5px 0" />
                    </a-form-item>
                  </a-form>
                </template>
                <template v-else>
                  {{ text }}
                </template>
              </template>
              <template v-if="column.dataIndex === 'touristName'">
                <template v-if="record.isEdit">
                  <a-form ref="formRef3" :model="dataTouristSource[index]" :rules="formRules" autocomplete="off">
                    <a-form-item name="touristName">
                      <a-input placeholder="请输入游客姓名" v-model:value="dataTouristSource[index][column.dataIndex]"
                        allowClear style="margin: -5px 0" />
                    </a-form-item>
                  </a-form>
                </template>
                <template v-else>
                  {{ text }}
                </template>
              </template>
              <template v-if="column.dataIndex === 'touristType'">
                <a-select placeholder="请选择游客类型" v-if="record.isEdit"
                  v-model:value="dataTouristSource[index][column.dataIndex]" allowClear>
                  <a-select-option v-for="item in touristTypeOption" :value="item.codeValue">{{ item.name }}
                  </a-select-option>
                </a-select>
                <template v-else>
                  {{ cmpTouristType(text) }}
                </template>
              </template>
              <template v-if="column.dataIndex === 'phone'">
                <a-input placeholder="请输入电话号码" v-if="record.isEdit"
                  v-model:value="dataTouristSource[index][column.dataIndex]" style="margin: -5px 0" />
                <template v-else>
                  {{ text }}
                </template>
              </template>
              <template v-if="column.dataIndex === 'healthyCode'">
                <a-input placeholder="系统自动生成" v-if="record.isEdit"
                  v-model:value="dataTouristSource[index][column.dataIndex]" disabled style="margin: -5px 0" />
                <template v-else>
                  {{ text }}
                </template>
              </template>
              <template v-if="column.dataIndex === 'ancientUygurReduction'">
                <a-select placeholder="请选择是否减免" v-if="record.isEdit"
                  v-model:value="dataTouristSource[index][column.dataIndex]" allowClear>
                  <a-select-option v-for="item in ancientUygurReductionOption" :value="item.codeValue">{{ item.name }}
                  </a-select-option>
                </a-select>
                <template v-else>
                  {{ cmpAncientUygurReduction(text) }}
                </template>
              </template>
              <!-- <template v-if="column.dataIndex === 'reductionUrl'">
                <Upload v-if="editableTouristData[record.key]"
                  v-model="editableTouristData[record.key][column.dataIndex]" :maxCount="3" />
                <template v-else>
                  {{ text }}
                </template>
              </template> -->
              <template v-if="column.dataIndex === 'action'">
                <div class="editable-row-operations">
                  <span v-if="record.isEdit">
                    <a @click="save(dataTouristSource[index])">确定</a>
                    <a @click="cancel(dataTouristSource[index])">取消</a>
                  </span>
                  <span v-else>
                    <a @click="edit(dataTouristSource[index])">编辑</a>
                    <a-popconfirm title="确认删除数据？" @confirm="onTouristDelete(index)">
                      <a>删除</a>
                    </a-popconfirm>
                  </span>
                </div>
              </template>
            </template>
          </a-table>
          <div class="add_box">
            <a-button @click="handleTouristAdd">添加</a-button>
          </div>
          <div v-if="isShow">
            <a-form-item name="touristName" label="游客代表">
              <a-select @change="touristChange" placeholder="请选择游客代表" v-model:value="form.touristName" allowClear>
                <a-select-option v-for="item in dataTouristSource" :value="item.certificatesNo">{{ item.touristName }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item name="certificatesNo" label="游客代表证件">
              <a-input v-model:value="form.certificatesNo" placeholder="无需填写，输入名单后自动生成" disabled>
              </a-input>
            </a-form-item>
            <a-form-item name="phone" label="游客代表手机号">
              <a-input v-model:value="form.phone" placeholder="无需填写，输入名单后自动生成" disabled>
              </a-input>
            </a-form-item>
            <a-form-item name="certificatesAddress" label="游客代表地址">
              <a-input @change="addressChange" v-model:value="form.certificatesAddress" placeholder="请输入游客代表地址">
              </a-input>
            </a-form-item>
          </div>
          <div class="tag">其他约定</div>
          <a-form-item name="otherAgreements" label="" :colon="false" :wrapper-col="{ offset: 0, span: 24 }">
            <a-textarea v-model:value="form.otherAgreements" :rows="4">
            </a-textarea>
          </a-form-item>
        </a-form>
        <div class="btn_box">
          <div>
            <a-button type="primary" @click="saveDraft" class="mr20">保存草稿</a-button>
            <a-button type="primary" @click="nextTep('2')">下一步</a-button>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="行程费用">
        <a-table :columns="costColumns" :data-source="dataCostSource" bordered :pagination="false">
          <template #bodyCell="{ column, text, record, index }">
            <template v-if="column.key === 'index'">
              {{ index + 1 }}
            </template>
            <template v-if="column.dataIndex === 'priceName'">
              <a-input v-if="record.isEdit" v-model:value="dataCostSource[index][column.dataIndex]"
                style="margin: -5px 0" placeholder="输入产品名称" />
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
              <a-input v-if="record.isEdit" v-model:value="dataCostSource[index][column.dataIndex]"
                style="margin: -5px 0" placeholder="自动生成" disabled />
              <template v-else>
                {{ text }}
              </template>
            </template>
            <template v-if="(column.dataIndex === 'action' && record.isOperate)">
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
        </a-table>
        <div class="add_box">
          <div class="cost_count">
            <div class="cost_item">费用合计</div>
            <div class="cost_item">{{ form.contractAmount }}</div>
          </div>
          <a-button @click="handleCostAdd" style="margin-left:20px">添加预订产品</a-button>
        </div>
        <div class="btn_box">
          <div>
            <a-button type="primary" @click="nextTep('1')" class="mr20">上一步</a-button>
            <a-button type="primary" @click="saveDraft" class="mr20">保存草稿</a-button>
            <a-button type="primary" @click="">提交签署</a-button>
          </div>
        </div>
      </a-tab-pane>
      <template #rightExtra>
        <span class="close_btn" @click="back">
          <close-outlined />
        </span>
      </template>
    </a-tabs>
  </div>
  <CommonModal title="散客合同签署确认" v-model:visible="submitVisible" @cancel="submitCancel" @close="submitCancel"
    :conform-text="'确定签署'" @conform="saveDraftConfirm">
    <p>您即将发起编号为ljc412211030906308的散客合同签署，合同总金额 6600.00 元。发出后将由游客代表 张三 通过网页完成签署，签署成功后会同步至12301平台。请确保合同内容无误。</p>
  </CommonModal>
  <CommonModal title="散客合同签署结果" v-model:visible="submitResultVisible" @close="submitResultVisible = false"
    :conform-text="'确定'" :is-cancel="false" @conform="submitResultVisible = false">
    <p v-if="true">您已发起编号为ljc412211030906308的散客合同签署。请等待游客代表 张三 通过网页完成签署，签署后可使用该电子合同发起拼团</p>
    <p v-else>您已完成编号为ljc412211030906308的散客电子合同（来源：门店线下合同）补录，后续您和授权社均可使用该合同发起散客拼团</p>
  </CommonModal>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { CloseOutlined } from '@ant-design/icons-vue';
import Upload from '@/components/common/imageWrapper.vue';
import pdfUpload from '@/components/common/pdfWrapper.vue';
import type { UnwrapRef } from 'vue';
import { cloneDeep } from 'lodash';
import CommonModal from '@/views/baseInfoManage/dictionary/components/CommonModal.vue';
import { useBusinessManageOption } from '@/stores/modules/businessManage';
import api from '@/api';
import { number } from 'vue-types';
import { message } from 'ant-design-vue/es';
const router = useRouter();
const route = useRoute();
const isRefresh = ref('0')
const back = () => {
  router.push({
    name: 'electronicContratList',
    params: {
      isRefresh: isRefresh.value
    }
  })
}
const dateFormat = 'YYYY-MM-DD';
const labelCol = { style: { width: '110px' } }
const formRef = ref()
const formRef1 = ref()
const formRef2 = ref()
const formRef3 = ref()
const isAdd = ref(true)
const form = ref({
  oid: undefined,
  companyId: undefined, //合同创建旅行社id
  contractDays: undefined, //合同天数
  travelNight: undefined, //合同夜数
  entrustTravelId: undefined, //委托旅行社id
  travelData: [], //行程日期
  tripStartTime: "", //合同行程开始时间
  tripEndTime: "", //合同行程结束时间
  touristPeopleNumber: "", //游客人数
  insuranceBuyMode: undefined, //保险购买方式
  contractType: undefined, //合同类型
  contractFileUrl: "", //附件
  otherAgreements: "", //其他约定
  touristName: undefined, //游客姓名
  certificatesNo: undefined, //证件号码
  phone: "", //电话
  certificatesAddress: "",//游客详细住址
  contractAmount: 0,
  pdfFileUrl: ""
})
const comprehensiveProductsList = ref([]) //综费产品
const adultNumber = ref(0)
const childNumber = ref(0)
const businessManageOptions = useBusinessManageOption();
const initOpeion = async () => {
  await businessManageOptions.getCompanyByBusinessType('TRAVEL');
  await businessManageOptions.getBusinessTypeOption('CERTIFICATE_TYPE')
};
const entrustTravelOption = computed(() => businessManageOptions.companyOptions);
const certificatesTypeOption = computed(() => businessManageOptions.businessTypeOption);

const insuranceOption = [
  { codeValue: 1, name: '放弃购买' },
  { codeValue: 2, name: '自行购买' },
  { codeValue: 3, name: '委托旅行社购买' },
]
const touristOption = []
let lineOption = ref([])
const ancientUygurReductionOption = [
  { codeValue: 1, name: '是' },
  { codeValue: 0, name: '否' }
]
const contractOption = [
  { codeValue: 1, name: '线上合同' },
  { codeValue: 2, name: '线下合同（需传附件）' }
]
const touristTypeOption = [
  { codeValue: 1, name: '成人' },
  { codeValue: 2, name: '儿童' }
]
const formRules = {
  contractDays: [{ required: true, trigger: 'blur', message: '请输入合同天数' }],
  travelNight: [{ required: true, trigger: 'blur', message: '请输入合同夜数' }],
  travelData: [{ required: true, trigger: 'blur', message: '请选择行程日期' }],
  touristPeopleNumber: [{ required: true, trigger: 'blur', message: '游客人数不能为空' }],
  insuranceBuyMode: [{ required: true, trigger: 'blur', message: '请选择保险购买方式' }],
  contractType: [{ required: true, trigger: 'blur', message: '请选择散客合同类型' }],
  certificatesType: [{ required: true, trigger: 'blur', message: '请选择身份证件类型' }],
  certificatesNo: [{ required: true, trigger: 'blur', message: '请输入证件号码' }],
  touristName: [{ required: true, trigger: 'blur', message: '请选择游客代表' }],
  phone: [{ required: true, trigger: 'blur', message: '游客代表手机号不能为空' }],
  certificatesAddress: [{ required: true, trigger: 'blur', message: '游客代表地址不能为空' }],
  contractFileUrl: [{ required: true, trigger: 'blur', message: '请上传附件' }]
}
const activeKey = ref('1')
const submitVisible = ref(false)
const submitResultVisible = ref(false)
const isShow = ref(true)
const lineColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '线路名称',
    dataIndex: 'lineId',
    key: 'lineId',
  },
  {
    title: '开始时间',
    dataIndex: 'lineStartTime',
    key: 'lineStartTime',
  },
  {
    title: '结束时间',
    dataIndex: 'lineEndTime',
    key: 'lineEndTime',
  },
  {
    title: '成人价格(元）',
    dataIndex: 'adultPrice',
    key: 'adultPrice',
  },
  {
    title: '小孩价格（元）',
    dataIndex: 'childPrice',
    key: 'childPrice',
  },
  {
    title: '行程描述',
    dataIndex: 'lineDescribe',
    key: 'lineDescribe',
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    fixed: 'right',
    width: 110
  }
]
const touristColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '身份证件类型',
    dataIndex: 'certificatesType',
    key: 'certificatesType',
  },
  {
    title: '证件号码',
    dataIndex: 'certificatesNo',
    key: 'certificatesNo',
  },
  {
    title: '游客姓名',
    dataIndex: 'touristName',
    key: 'touristName',
  },
  {
    title: '游客类型',
    dataIndex: 'touristType',
    key: 'touristType',
  },
  {
    title: '电话号码',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: '健康码状态',
    dataIndex: 'healthyCode',
    key: 'healthyCode',
  },
  {
    title: '古维减免',
    dataIndex: 'ancientUygurReduction',
    key: 'ancientUygurReduction',
  },
  /* {
    title: '减免依据',
    dataIndex: 'reductionUrl',
    key: 'reductionUrl',
  }, */
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    fixed: 'right',
    width: 110
  }
]
const costColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '费用名称',
    dataIndex: 'priceName',
    key: 'priceName',
  },
  {
    title: '成人数量（人）',
    dataIndex: 'adultNumber',
    key: 'adultNumber',
  },
  {
    title: '成人价（元）',
    dataIndex: 'adultPrice',
    key: 'adultPrice',
  },
  {
    title: '儿童数量（人）',
    dataIndex: 'childNumber',
    key: 'childNumber',
  },
  {
    title: '儿童价（元）',
    dataIndex: 'childPrice',
    key: 'childPrice',
  },
  {
    title: '单项小计（元）',
    dataIndex: 'individualSubtotal',
    key: 'individualSubtotal',
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    fixed: 'right',
    width: 110
  }
]
// 根据身份类型id获取身份证类型
const cmpCertificatesType = computed(() => (val: any) => {
  let res
  certificatesTypeOption.value.forEach((item: any) => {
    if (item.codeValue == val) {
      res = item.name
    }
  })
  return res
});
// 获取游客类型
const cmpTouristType = computed(() => (val: any) => {
  let res
  touristTypeOption.forEach((item: any) => {
    if (item.codeValue == val) {
      res = item.name
    }
  })
  return res
});
// 获取减免类型
const cmpAncientUygurReduction = computed(() => (val: any) => {
  let res
  ancientUygurReductionOption.forEach((item: any) => {
    if (item.codeValue == val) {
      res = item.name
    }
  })
  return res
});
// 根据线路id获取线路名称
const cmplineName = computed(() => (val: any) => {
  let res
  lineOption.value.forEach((item: any) => {
    if (item.codeValue == val) {
      res = item.name
    }
  })
  return res
})
// 根据不同合同类型控制不同表单显示
const contractOptionChange = (val: number) => {
  switch (val) {
    case 1:
      isShow.value = true
      form.value.contractFileUrl = ''
      form.value.pdfFileUrl = ''
      break;
    case 2:
      isShow.value = false
      form.value.touristName = undefined
      form.value.phone = ''
      form.value.certificatesAddress = ''
      form.value.certificatesNo = undefined
      touristChange()
      break;
    default:
      isShow.value = true
      touristChange()
      form.value.touristName = undefined
      form.value.phone = ''
      form.value.certificatesAddress = ''
      form.value.certificatesNo = undefined
      form.value.contractFileUrl = ''
      form.value.pdfFileUrl = ''
  }
}
// 行程日期改变事件
const datePickerChange = () => {
  if (form.value.travelData) {
    form.value.tripStartTime = form.value.travelData[0];
    form.value.tripEndTime = form.value.travelData[1];
  } else {
    form.value.tripStartTime = '';
    form.value.tripEndTime = '';
  }
}
interface CostItem {
  priceName: string;
  adultPrice: string;
  childPrice: string;
  adultNumber: number;
  childNumber: number;
  individualSubtotal: string;
  isEdit: boolean,
  isOperate?: boolean
}
interface TouristItem {
  certificatesType: undefined | string; //证件类型
  certificatesNo: string; //证件号码
  touristName: string; //游客姓名
  touristType: undefined | number; //游客类型（成人、儿童）
  phone: string; //电话
  ancientUygurReduction: undefined | number; //古维减免
  // reductionUrl: string; //减免依据附件
  certificatesAddress: string; //游客详细住址
  isRepresentative: number //是否为游客代表
  healthyCode?: string,
  isEdit: boolean,
}
interface LineItem {
  lineId: undefined | number;
  lineName: string;
  lineStartTime: string;
  lineEndTime: string;
  adultPrice: number | string;
  childPrice: number | string;
  lineDescribe: string,
  isEdit: boolean,
}
const dataCostSource = ref<CostItem[]>([])
const dataTouristSource = ref<TouristItem[]>([])
const dataLineSource = ref<LineItem[]>([])
// 添加线路
const handleLineAdd = () => {
  const newData = {
    isEdit: true,
    lineId: undefined,
    lineName: '',
    lineStartTime: '',
    lineEndTime: '',
    adultPrice: '',
    childPrice: '',
    lineDescribe: '',
  };
  dataLineSource.value.push(newData);
};
// 删除线路
const onLineDelete = (index: number) => {
  dataLineSource.value.splice(index, 1)
};
// 添加游客
const handleTouristAdd = () => {
  const newData = {
    isEdit: true,
    certificatesType: undefined, //证件类型
    certificatesNo: "", //证件号码
    touristName: "", //游客姓名
    touristType: 1, //游客类型（成人、儿童）
    phone: "", //电话
    ancientUygurReduction: undefined, //古维减免
    // reductionUrl: "", //减免依据附件
    certificatesAddress: "", //游客详细住址
    isRepresentative: 0 //是否为游客代表
  };
  dataTouristSource.value.push(newData);
};
// 删除游客
const onTouristDelete = (index: number) => {
  dataTouristSource.value.splice(index, 1)
};
// 添加行程费用
const handleCostAdd = () => {
  const newData = {
    isEdit: true,
    isOperate: true,
    priceName: "",
    adultPrice: "",
    childPrice: "",
    adultNumber: adultNumber.value,
    childNumber: childNumber.value,
    individualSubtotal: "",
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
// 步骤跳转
const nextTep = (val: string) => {
  activeKey.value = val
  if (val === '2') {
    // 计算成人数、儿童数
    let adult = 0
    let child = 0
    dataTouristSource.value.forEach((item: any) => {
      if (item.touristType === 1) {
        adult += 1
      } else if (item.touristType === 2) {
        child += 1
      }
    })
    adultNumber.value = adult // 成人数
    childNumber.value = child // 儿童数
    const arr: CostItem[] = []
    // 计算费用
    dataCostSource.value.forEach((item: any) => {
      // 如果已有行程费用列表，又回到上一步添加游客，需重新计算人数和价格
      // 自定义费用流程
      if (item.isOperate) {
        item.adultNumber = adult
        item.childNumber = child
        rowPrice(item)
        arr.push(item)
      }
    })
    dataCostSource.value = [...comprehensiveProductsFeeList(), ...arr]
    allPrice()
  }
}
/* 
收费模式：人数，人数*收费数量
收费模式：价格，直接用价格
然后看是否按天数：是，上面算出的价格*天数；否，使用上面算出的价格 */
const comprehensiveProductsFeeList = () => {
  if (adultNumber.value || childNumber.value) {
    const contractDays = form.value.contractDays !== undefined ? form.value.contractDays : 0
    return comprehensiveProductsList.value.map((item: any) => {
      let adultPrice: string | number = 0
      let childPrice: string | number = 0
      let individualSubtotal = 0
      //feeModel 收费模式: 0-人数 1-价格
      //confirmDailyCharge 是否按天收费: 0-否,1-是
      if (item.feeModel === 1) {
        adultPrice = '/'
        childPrice = '/'
        if (item.confirmDailyCharge === 1) {
          // 如果按天收费要乘上天数
          individualSubtotal = item.feeNumber * contractDays
        } else {
          individualSubtotal = item.feeNumber
        }
      } else if (item.feeModel === 0) {
        // 按照人数收费
        adultPrice = item.feeNumber
        childPrice = item.feeNumber
        if (item.confirmDailyCharge === 1) {
          // 如果按天收费要乘上天数
          individualSubtotal = (adultNumber.value + childNumber.value) * item.feeNumber * contractDays
        } else {
          individualSubtotal = (adultNumber.value + childNumber.value) * item.feeNumber
        }
      }
      return {
        priceName: item.comprehensiveFeeProductName,
        adultNumber: adultNumber.value,
        childNumber: childNumber.value,
        adultPrice,
        childPrice,
        individualSubtotal,
        isEdit: false,
        isOperate: false
      }
    })
  } else {
    return []
  }
}
const saveDraft = () => {
  const a = Promise.all([
    formRef.value?.validateFields(),
    formRef1.value?.validateFields(),
    formRef2.value?.validateFields(),
    formRef3.value?.validateFields()
  ])
  a.then(async () => {
    const params = getParams()
    if (isAdd.value) {
      let res = await api.createIndividualContract(params)
      if (res) {
        message.success('保存草稿成功！')
        isRefresh.value = '1'
        back()
      } else {
        message.error('保存草稿失败！')
      }
    } else {
      let res = await api.editFindIndividualContract(params)
      if (res) {
        message.success('编辑草稿成功！')
        isRefresh.value = '1'
        back()
      } else {
        message.error('编辑草稿失败！')
      }
    }
  }).catch((error: Error) => {
    console.log(error);
  })
}
const submitCancel = () => {
  submitVisible.value = false
}
// 获取提交参数
const getParams = () => {
  let userInfo: any = window.localStorage.getItem('userInfo');
  userInfo = JSON.parse(userInfo);
  const { sysCompany } = userInfo
  form.value.companyId = sysCompany.oid
  const {
    oid,
    companyId, //合同创建旅行社id
    contractDays, //合同天数
    travelNight, //合同夜数
    entrustTravelId, //委托旅行社id
    tripStartTime, //合同行程开始时间
    tripEndTime, //合同行程结束时间
    touristPeopleNumber, //游客人数
    insuranceBuyMode, //保险购买方式
    contractType, //合同类型
    contractFileUrl, //附件
    pdfFileUrl,
    otherAgreements, //其他约定
    contractAmount, //行程费用
  } = form.value
  /* const arr: CostItem[] = []
  // 只上传自定义费用
  dataCostSource.value.forEach((item: any) => {
    if (item.isOperate) {
      arr.push(item)
    }
  }) */
  let fileUrl
  if (contractFileUrl && pdfFileUrl) {
    fileUrl = contractFileUrl + ',' + pdfFileUrl
  } else if (contractFileUrl && !pdfFileUrl) {
    fileUrl = contractFileUrl
  } else if (!contractFileUrl && pdfFileUrl) {
    fileUrl = pdfFileUrl
  }

  return {
    oid,
    companyId, //合同创建旅行社id
    contractDays, //合同天数
    travelNight, //合同夜数
    entrustTravelId, //委托旅行社id
    tripStartTime, //合同行程开始时间
    tripEndTime, //合同行程结束时间
    touristPeopleNumber, //游客人数
    insuranceBuyMode, //保险购买方式
    contractType, //合同类型
    contractFileUrl: fileUrl, //附件
    otherAgreements, //其他约定
    contractAmount: contractAmount * 100,
    individualContractLineBos: dataLineSource.value, // 线路
    individualContractTouristBos: dataTouristSource.value, // 游客
    individualContractPriceBos: dataCostSource.value, // 费用
  }
}
const saveDraftConfirm = async () => {

}
// 获取线路选项
const getLineOptions = async () => {
  let res = await api.selectIndividualLineDropdown()
  lineOption.value = res?.map((item: any) => {
    let adultPrice, childPrice
    item.individualLinePriceVos.forEach((citem: any) => {
      if (citem.priceTypeName === '成人') {
        adultPrice = citem.priceAmount
      } else if (citem.priceTypeName === '小孩') {
        childPrice = citem.priceAmount
      }
    });
    return {
      codeValue: item.oid,
      name: item.lineName,
      lineDescribe: item.lineDescribe,
      adultPrice,
      childPrice,
    }
  })
}
// 游客代表改变事件
const touristChange = () => {
  if (form.value.touristName) {
    dataTouristSource.value.forEach((item: any) => {
      if (item.certificatesNo === form.value.touristName) {
        form.value.phone = item.phone
        form.value.certificatesNo = item.certificatesNo
        item.certificatesAddress = form.value.certificatesAddress
        item.isRepresentative = 1 // 是否为游客代表 1：是、0：否
      } else {
        item.certificatesAddress = ''
        item.isRepresentative = 0
      }
    })
  }
}
// 游客代表地址改变事件
let addresTimer: NodeJS.Timeout
const addressChange = () => {
  addresTimer && clearTimeout(addresTimer)
  addresTimer = setTimeout(async () => {
    dataTouristSource.value.forEach((item: any) => {
      if (item.certificatesNo === form.value.touristName) {
        item.certificatesAddress = form.value.certificatesAddress
      }
    })
  }, 1000)
}
// 根据游客身份证号获取健康码
let timer: NodeJS.Timeout
const certificatesNoChange = (obj: any) => {
  if (obj.certificatesNo) {
    timer && clearTimeout(timer)
    timer = setTimeout(async () => {
      obj.healthyCode = await getHealthyCode([{ certificateId: obj.certificatesNo }])
    }, 2000)
  }
}
const rowPrice = (obj: any) => {
  let adultPrice = obj.adultPrice || 0
  let childPrice = obj.childPrice || 0
  obj.individualSubtotal = Number(adultPrice) * obj.adultNumber + Number(childPrice) * obj.childNumber
}
const allPrice = () => {
  let sum = 0
  dataCostSource.value.forEach((item: any) => {
    if (typeof item.individualSubtotal === 'number') {
      sum += item.individualSubtotal
    }
  })
  form.value.contractAmount = sum
}
// 价格改变事件自动计算总费用
let priceTimer: NodeJS.Timeout
const priceChange = (obj: any) => {
  // form.registeredCapital = form.registeredCapital?.replace(/[^0-9.]/g, '')
  priceTimer && clearTimeout(priceTimer)
  priceTimer = setTimeout(async () => {
    rowPrice(obj)
    allPrice()
  }, 1000)
}
// 线路改变事件
const lineSelectChange = (obj: any) => {
  if (obj.lineId) {
    for (let i = 0, l = lineOption.value.length; i < l; i++) {
      const element = lineOption.value[i];
      if (element.codeValue === obj.lineId) {
        obj.adultPrice = element.adultPrice
        obj.childPrice = element.childPrice
        obj.lineDescribe = element.lineDescribe
        obj.lineName = element.name
        break
      }
    }
  } else {
    obj.adultPrice = undefined
    obj.childPrice = undefined
    obj.lineDescribe = undefined
  }
}
const getHealthyCode = async (data: any) => {
  let res = await api.getHealthyCode(data)
  let code
  if (res) {
    // 00:绿码，01：黄码，10：红码
    switch (res[0].healthCodeStatus) {
      case '00':
        code = '绿码'
        break;
      case '01':
        code = '黄码'
        break;
      case '10':
        code = '红码'
        break;
      default:
        code = '暂无健康码'
    }
  }
  return code
}
// 批量获取健康码
const getHealthyCodes = async (ids: number[]) => {
  let res = await api.getHealthyCode(ids)
  if (res) {
    res.forEach((item: any) => {
      // 00:绿码，01：黄码，10：红码
      switch (item.healthCodeStatus) {
        case '00':
          item.codeName = '绿码'
          break;
        case '01':
          item.codeName = '黄码'
          break;
        case '10':
          item.codeName = '红码'
          break;
        default:
          item.codeName = '暂无健康码'
      }
    })
  }
  return res || []
}
const configCodeName = (certificateCodes: any) => {
  for (let i = 0, l = certificateCodes.length; i < l; i++) {
    const item = certificateCodes[i];
    for (let j = 0, l = dataTouristSource.value.length; j < l; j++) {
      const citem = dataTouristSource.value[j];
      if (item.certificateId === citem.certificatesNo) {
        dataTouristSource.value[j].healthyCode = item.codeName
        break
      }
    }
  }
}
const getEditDetails = async (oid: any) => {
  const res = await api.editFindIndividualContractById(oid)
  if (res) {
    form.value = res
    const files = form.value.contractFileUrl.split(',')
    const contractFileUrl: string[] = []
    const pdfFileUrl: string[] = []
    files.forEach((item: any) => {
      if (['jpg', 'png'].indexOf(item.split('.')[1]) !== -1) {
        contractFileUrl.push(item)
      } else if (['pdf'].indexOf(item.split('.')[1]) !== -1) {
        pdfFileUrl.push(item)
      }
    })
    form.value.contractFileUrl = contractFileUrl.toString()
    form.value.pdfFileUrl = pdfFileUrl.toString()
    form.value.travelData = [res.tripStartTime, res.tripEndTime]
    dataLineSource.value = res.individualContractLineBos.map((item: any) => {
      return {
        isEdit: false,
        ...item,
      }
    })

    dataTouristSource.value = res.individualContractTouristBos.map((item: any) => {
      // 获取游客代表
      if (item.isRepresentative === 1) {
        form.value.touristName = item.touristName
        form.value.phone = item.phone
        form.value.certificatesNo = item.certificatesNo
        form.value.certificatesAddress = item.certificatesAddress
      }
      return {
        isEdit: false,
        ...item
      }
    })
    // 获取身份证列表
    const certificateIds = res.individualContractTouristBos.map((item: any) => {
      return { certificateId: item.certificatesNo }
    })
    // 根据身份证列表查询健康码列表
    const certificateCodes = await getHealthyCodes(certificateIds)
    // 将健康码和游客列表数据关联
    configCodeName(certificateCodes)

    dataCostSource.value = res.individualContractPriceBos.map((item: any) => {
      return {
        isEdit: false,
        isOperate: true,
        ...item,
      }
    })
    allPrice()
    contractOptionChange(form.value.contractType)
  }
}
const getComprehensiveProductsList = async () => {
  const res = await api.findComprehensiveProductsList()
  comprehensiveProductsList.value = res || []
}
onMounted(() => {
  initOpeion()
  getLineOptions()
  getComprehensiveProductsList()
})
watch(
  dataTouristSource,
  () => {
    form.value.touristPeopleNumber = dataTouristSource.value.length || ''
  },
  {
    deep: true
  }
)
watch(
  route,
  (newVal) => {
    if (newVal.name === "addElectronicContrat") {
      if (newVal.query.operation === 'add') {
        isAdd.value = true
      } else if (newVal.query.operation === 'update') {
        isAdd.value = false
        getEditDetails(newVal.query.oid)
      }
    }
  },
  {
    immediate: true,
    deep: true
  }
)

onActivated(() => {
  isRefresh.value = '0'
})
</script>

<style scoped lang="scss">
.reform {
  display: flex;
  justify-content: space-between;
}

.reform .ant-form-item {
  margin: 0;
}

.content_box {
  padding: 20px;
}

.close_btn {
  cursor: pointer;
}

.tag {
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 600;
}

.add_box {
  width: 100%;
  justify-content: end;
  align-items: center;
  display: flex;
  margin: 10px 0;
}

.btn_box {
  display: flex;
  justify-content: center;

  .mr20 {
    margin-right: 20px;
  }
}

.editable-row-operations a {
  margin-right: 8px;
}

.cost_count {
  width: inherit;
  height: 60px;
  display: flex;
  line-height: 60px;
  font-size: 16px;
  background: #f2f2f2;

  .cost_item {
    flex: 1;
    text-align: center;
  }
}
</style>