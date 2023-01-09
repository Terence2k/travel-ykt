<template>
  <div class="content_box">
    <a-tabs v-model:activeKey="activeKey" @change="nextTep">
      <a-tab-pane key="1" tab="行程信息">
        <a-form ref="formRef" :model="form" :rules="formRules" name="addStore" autocomplete="off" :label-col="labelCol"
          :wrapper-col="{ span: 24 }">
          <div class="tag">基本信息</div>
          <div class="disflex">
            <div class="flex1">
              <el-form ref="dateFormRef" :model="form" :rules="dateRules" :label-width="labelWidth"
                label-position="right">
                <el-form-item label="行程日期：" prop="travelData">
                  <picker v-model="form.travelData" @change="datePickerChange" type="daterange"
                    :value-format="dateFormat" start-placeholder="请选择开始时间" end-placeholder="请选择结束时间" style="width:100%">
                  </picker>
                </el-form-item>
              </el-form>
              <!-- <a-form-item name="travelData" label="行程日期">
                <a-range-picker v-model:value="form.travelData" @change="datePickerChange"
                  :placeholder="['请选择开始时间', '请选择结束时间']" :format="dateFormat" :valueFormat="dateFormat"
                  style="width:100%" />
              </a-form-item> -->
              <a-form-item name="entrustTravelId" label="委托旅行社">
                <a-select placeholder="请选择委托旅行社" v-model:value="form.entrustTravelId" allowClear>
                  <a-select-option v-for="item in entrustTravelOption" :value="item.oid" :key="item.oid">{{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item name="touristPeopleNumber" label="游客人数">
                <a-input v-model:value="form.touristPeopleNumber" placeholder="无需填写，输入名单后自动生成" disabled>
                </a-input>
              </a-form-item>
              <a-form-item name="departurePlace" label="出发地">
                <a-input v-model:value="form.departurePlace" placeholder="请填写出发地">
                </a-input>
              </a-form-item>
              <a-form-item name="destination" label="目的地">
                <a-input v-model:value="form.destination" placeholder="请填写目的地">
                </a-input>
              </a-form-item>
              <a-form-item name="returnPlace" label="返回地">
                <a-input v-model:value="form.returnPlace" placeholder="请填写返回地">
                </a-input>
              </a-form-item>
              <a-form-item name="emergencyContact" label="紧急联系人">
                <a-input v-model:value="form.emergencyContact" placeholder="请填写紧急联系人" allowClear>
                </a-input>
              </a-form-item>
              <a-form-item name="emergencyContactPhone" label="紧急联系电话">
                <a-input v-model:value="form.emergencyContactPhone" placeholder="请填写紧急联系电话" allowClear>
                </a-input>
              </a-form-item>
            </div>
            <div class="flex1">
              <a-form-item name="day" label="合同天数">
                <div class="reform">
                  <a-form-item style="flex: 1;" name="contractDays">
                    <div style="display:flex;align-items:center;">
                      <a-input v-model:value.number="form.contractDays" placeholder="请输入合同天数" allowClear>
                      </a-input>
                      <span style="margin:0 10px">天</span>
                    </div>
                  </a-form-item>
                  <a-form-item style="flex: 1;" name="travelNight">
                    <div style="display:flex;align-items:center;">
                      <a-input v-model:value.number="form.travelNight" placeholder="请输入合同夜数" allowClear />
                      <span style="margin-left:10px">夜</span>
                    </div>
                  </a-form-item>
                </div>
              </a-form-item>
              <a-form-item name="deposit" label="合同定金">
                <div style="display:flex;align-items:center;">
                  <a-input v-model:value.number="form.deposit" placeholder="请输入合同定金" style="width:50%">
                  </a-input>
                  <span style="margin:0 10px">元（游客向旅行社支付）</span>
                </div>
              </a-form-item>
              <a-form-item name="liquidatedDamages" label="合同终止违约金">
                <div style="display:flex;align-items:center;">
                  <a-input v-model:value.number="form.liquidatedDamages" placeholder="请输入合同终止违约金" style="width:50%">
                  </a-input>
                  <span style="margin:0 10px">% x 合同总金额（违约方支付）</span>
                </div>
              </a-form-item>
              <a-form-item name="bond" label="黄金周保证金">
                <div style="display:flex;align-items:center;">
                  <a-input v-model:value.number="form.bond" placeholder="请输入黄金周保证金" style="width:50%">
                  </a-input>
                  <span style="margin:0 10px">元（游客向旅行社支付）</span>
                </div>
              </a-form-item>
              <a-form-item name="" label="游客违约则扣罚">
                <div class="reform">
                  <a-form-item style="flex: 1;" name="hotelFine" label="酒店">
                    <div style="display:flex;align-items:center;">
                      <a-input v-model:value.number="form.hotelFine" placeholder="">
                      </a-input>
                      <span style="margin:0 10px">%</span>
                    </div>
                  </a-form-item>
                  <a-form-item style="flex: 1;" name="carRentalFine" label="租车">
                    <div style="display:flex;align-items:center;">
                      <a-input v-model:value.number="form.carRentalFine" placeholder="" />
                      <span style="margin:0 10px">%</span>
                    </div>
                  </a-form-item>
                  <a-form-item style="flex: 1;" name="totalPriceFine" label="总价">
                    <div style="display:flex;align-items:center;">
                      <a-input v-model:value.number="form.totalPriceFine" placeholder="" />
                      <span style="margin-left:10px">%</span>
                    </div>
                  </a-form-item>
                </div>
              </a-form-item>
              <a-form-item name="" label="旅行社违约则扣罚">
                <div class="reform">
                  <a-form-item style="flex: 1;" name="nonPerformanceFine" label="未履约">
                    <div style="display:flex;align-items:center;">
                      <a-input v-model:value.number="form.nonPerformanceFine" placeholder="">
                      </a-input>
                      <span style="margin:0 10px">%</span>
                    </div>
                  </a-form-item>
                  <a-form-item style="flex: 1;" name="nonStandardFine" label="不达标">
                    <div style="display:flex;align-items:center;">
                      <a-input v-model:value.number="form.nonStandardFine" placeholder="" />
                      <span style="margin:0 10px">%</span>
                    </div>
                  </a-form-item>
                  <a-form-item style="flex: 1;" name="entrustFine" label="转委托">
                    <div style="display:flex;align-items:center;">
                      <a-input v-model:value.number="form.entrustFine" placeholder="" />
                      <span style="margin-left:10px">%</span>
                    </div>
                  </a-form-item>
                </div>
              </a-form-item>
              <a-form-item name="disputeResolution" label="争议解决办法">
                <a-select placeholder="请选择争议解决办法" v-model:value="form.disputeResolution" allowClear>
                  <a-select-option v-for="item in disputeResolutionOptions" :value="item.codeValue"
                    :key="item.codeValue">{{
                      item.name
                    }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </div>
          </div>
          <div class="tag">添加委托项目</div>
          <a-table :columns="entrustedProjectColumns" :data-source="dataEntrustedProjectSource" bordered
            :pagination="false">
            <template #bodyCell="{ column, text, record, index }">
              <template v-if="column.dataIndex === 'entrustedProject'">
                <a-input v-model:value="dataEntrustedProjectSource[index][column.dataIndex]" placeholder="请输入委托项目"
                  style="margin: -5px 0" />
              </template>
              <template v-if="column.dataIndex === 'entrustedProjectAmount'">
                <a-input v-model:value.number="dataEntrustedProjectSource[index][column.dataIndex]"
                  placeholder="请输入委托价格" style="margin: -5px 0" />
              </template>
            </template>
          </a-table>
          <div class="tag">添加游客</div>
          <a-table :columns="touristColumns" :data-source="dataTouristSource" bordered :pagination="false">
            <template #headerCell="{ column }">
              <template
                v-if="['certificatesType', 'certificatesNo', 'touristName', 'touristType', 'gender', 'age', 'isHealthy', 'healthyCode', 'isAncientUygur'].includes(column.key)">
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
                        allowClear style="width: 110px">
                        <a-select-option v-for="item in certificatesTypeOption" :value="item.codeValue"
                          :key="item.codeValue">{{ item.name }}
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
                <template v-if="record.isEdit">
                  <a-form ref="formRef4" :model="dataTouristSource[index]" :rules="formRules" autocomplete="off">
                    <a-form-item name="touristType">
                      <a-select placeholder="请选择游客类型" v-model:value="dataTouristSource[index][column.dataIndex]"
                        allowClear>
                        <a-select-option v-for="item in touristTypeOption" :value="item.codeValue"
                          :key="item.codeValue">{{
                            item.name
                          }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-form>
                </template>
                <template v-else>
                  {{ cmpTouristType(text) }}
                </template>
              </template>
              <template v-if="column.dataIndex === 'gender'">
                <template v-if="record.isEdit">
                  <a-form ref="formRef5" :model="dataTouristSource[index]" :rules="formRules" autocomplete="off">
                    <a-form-item name="gender">
                      <a-select placeholder="请选择性别" v-model:value="dataTouristSource[index][column.dataIndex]"
                        allowClear style="width: 80px">
                        <a-select-option v-for="item in genderOption" :value="item.codeValue" :key="item.codeValue">{{
                          item.name
                        }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-form>
                </template>
                <template v-else>
                  {{ text }}
                </template>
              </template>
              <template v-if="column.dataIndex === 'age'">
                <template v-if="record.isEdit">
                  <a-form ref="formRef6" :model="dataTouristSource[index]" :rules="formRules" autocomplete="off">
                    <a-form-item name="age">
                      <a-input placeholder="请输入年龄" v-model:value.number="dataTouristSource[index][column.dataIndex]"
                        style="margin: -5px 0" />
                    </a-form-item>
                  </a-form>
                </template>
                <template v-else>
                  {{ text }}
                </template>
              </template>
              <template v-if="column.dataIndex === 'phone'">
                <template v-if="record.isEdit">
                  <a-form :model="dataTouristSource[index]" autocomplete="off">
                    <a-form-item name="phone">
                      <a-input placeholder="请输入电话号码" v-model:value="dataTouristSource[index][column.dataIndex]"
                        style="margin: -5px 0" />
                    </a-form-item>
                  </a-form>
                </template>
                <template v-else>
                  {{ text }}
                </template>
              </template>
              <template v-if="column.dataIndex === 'isHealthy'">
                <template v-if="record.isEdit">
                  <a-form ref="formRef7" :model="dataTouristSource[index]" :rules="formRules" autocomplete="off">
                    <a-form-item name="isHealthy">
                      <a-select placeholder="请选健康状态" v-model:value="dataTouristSource[index][column.dataIndex]"
                        allowClear style="width: 80px">
                        <a-select-option v-for="item in isHealthyOption" :value="item.codeValue"
                          :key="item.codeValue">{{
                            item.name
                          }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-form>
                </template>
                <template v-else>
                  {{ cmpIsHealthy(text) }}
                </template>
              </template>
              <template v-if="column.dataIndex === 'healthyCode'">
                <template v-if="record.isEdit">
                  <a-form ref="formRef8" :model="dataTouristSource[index]" :rules="formRules" autocomplete="off">
                    <a-form-item name="healthyCode">
                      <a-input placeholder="系统自动生成" v-model:value="dataTouristSource[index][column.dataIndex]" disabled
                        style="margin: -5px 0" />
                    </a-form-item>
                  </a-form>
                </template>
                <template v-else>
                  {{ text }}
                </template>
              </template>
              <template v-if="column.dataIndex === 'isAncientUygur'">
                <template v-if="record.isEdit">
                  <a-form ref="formRef9" :model="dataTouristSource[index]" :rules="formRules" autocomplete="off">
                    <a-form-item name="isAncientUygur">
                      <a-select placeholder="请选择古维费购买状态" v-model:value="dataTouristSource[index][column.dataIndex]"
                        allowClear style="width: 130px">
                        <a-select-option v-for="item in ancientUygurOption" :value="item.codeValue"
                          :key="item.codeValue">{{
                            item.name
                          }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-form>
                </template>
                <template v-else>
                  {{ cmpAncientUygur(text) }}
                </template>
              </template>
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
                <a-select-option v-for="item in dataTouristSource" :value="item.certificatesNo"
                  :key="item.certificatesNo">{{ item.touristName }}
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
            <a-button type="primary" @click="saveDraft('1')" class="mr20">保存草稿</a-button>
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
              <a-input v-if="record.isEdit && record.priceName !== '导游服务费'"
                v-model:value="dataCostSource[index][column.dataIndex]" style="margin: -5px 0" placeholder="输入产品名称" />
              <template v-else>
                {{ text }}
              </template>
            </template>
            <template v-if="column.dataIndex === 'adultPrice'">
              <a-input @change="() => { priceChange(dataCostSource[index]) }" v-if="record.isEdit"
                v-model:value.number="dataCostSource[index][column.dataIndex]" style="margin: -5px 0" placeholder="输入价格" />
              <template v-else>
                {{ text }}
              </template>
            </template>
            <template v-if="column.dataIndex === 'childPrice'">
              <a-input @change="() => { priceChange(dataCostSource[index]) }" v-if="record.isEdit"
                v-model:value.number="dataCostSource[index][column.dataIndex]" style="margin: -5px 0" placeholder="输入价格" />
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
        </div>
        <a-form ref="formRef4" :model="form" :rules="formRules" autocomplete="off">
          <a-form-item name="paymentMethod" label="游客费用支付方式">
            <a-select @change="touristChange" placeholder="选择游客线下的实际支付方式" v-model:value="form.paymentMethod" allowClear
              style="width:20%">
              <a-select-option v-for="item in paymentOptions" :value="item.codeValue" :key="item.codeValue">{{
                item.name
              }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
        <div class="btn_box">
          <div>
            <a-button type="primary" @click="nextTep('1')" class="mr20">上一步</a-button>
            <a-button type="primary" @click="saveDraft" class="mr20">保存草稿</a-button>
            <a-button type="primary" @click="submitVisible = true" :disabled="!hasId">发出签署</a-button>
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
    <p>您即将发起散客合同签署，合同总金额<span class="cred">{{ form.contractAmount }}</span>元。发出后将由游客代表<span class="cred">{{
      form.touristName
    }}</span>通过网页完成签署，签署成功后会同步至12301平台。请确保合同内容无误。
    </p>
  </CommonModal>
  <CommonModal title="散客合同签署结果" v-model:visible="submitResultVisible" @close="submitResultVisible = false"
    :conform-text="'确定'" :is-cancel="false" @conform="submitResultVisible = false">
    <p v-if="true">您已发起散客合同签署。请等待游客代表<span class="cred">{{
      form.touristName
    }}</span>通过网页完成签署，签署后可使用该电子合同发起拼团</p>
    <p v-else>您已完成编号为ljc412211030906308的散客电子合同（来源：门店线下合同）补录，后续您和授权社均可使用该合同发起散客拼团</p>
  </CommonModal>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { CloseOutlined } from '@ant-design/icons-vue';
import { cloneDeep } from 'lodash';
import CommonModal from '@/views/baseInfoManage/dictionary/components/CommonModal.vue';
import { useBusinessManageOption } from '@/stores/modules/businessManage';
import api from '@/api';
import { message } from 'ant-design-vue/es';
import dayjs, { Dayjs } from 'dayjs';
import picker from '@/components/common/datePicker.vue'
import { accDiv, accMul } from '@/utils/compute';
const router = useRouter();
const route = useRoute();
const isRefresh = ref('0')
const back = () => {
  router.push({
    name: 'singleEntrustmentContract',
    params: {
      isRefresh: isRefresh.value
    }
  })
}
const dateFormat = 'YYYY-MM-DD';
const labelWidth = '130px'
const labelCol = { style: { width: labelWidth } }
const formRef = ref()
const dateFormRef = ref()
const formRef1 = ref()
const formRef2 = ref()
const formRef3 = ref()
const formRef4 = ref()
const isAdd = ref(true)
const hasId = ref(false)
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
  otherAgreements: "", //其他约定
  touristName: undefined, //游客姓名
  certificatesNo: undefined, //证件号码
  phone: "", //电话
  certificatesAddress: "",//游客详细住址
  contractAmount: 0,
  paymentMethod: undefined,
  departurePlace: '',
  destination: '',
  returnPlace: '',
  emergencyContact: '',
  emergencyContactPhone: '',
  deposit: '',
  liquidatedDamages: '',
  bond: '',
  hotelFine: '',
  carRentalFine: '',
  totalPriceFine: '',
  nonPerformanceFine: '',
  nonStandardFine: '',
  entrustFine: '',
  disputeResolution: undefined,
  entrustedProject: '',
  entrustedProjectAmount: undefined
})
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
const ancientUygurOption = [
  { codeValue: 1, name: '已购' },
  { codeValue: 0, name: '未够' }
]
const touristTypeOption = [
  { codeValue: 1, name: '成人' },
  { codeValue: 2, name: '儿童' }
]
const paymentOptions = [
  { codeValue: 1, name: '现金' },
  { codeValue: 2, name: '转账' },
  { codeValue: 3, name: '线下支付' },
]
const genderOption = [
  { codeValue: '男', name: '男' },
  { codeValue: '女', name: '女' }
]
const isHealthyOption = [
  { codeValue: 1, name: '是' },
  { codeValue: 0, name: '否' }
]
const disputeResolutionOptions = [
  { codeValue: 1, name: '调解' },
  { codeValue: 2, name: '提交仲裁委员会仲裁' },
  { codeValue: 3, name: '提交人民法院诉讼' }
]
const formRules = {
  paymentMethod: [{ required: true, trigger: 'blur', message: '选择游客线下的实际支付方式' }],
  departurePlace: [{ required: true, trigger: 'blur', message: '请填写出发地' }],
  destination: [{ required: true, trigger: 'blur', message: '请填写目的地' }],
  returnPlace: [{ required: true, trigger: 'blur', message: '请填写返回地' }],
  contractDays: [{ required: true, trigger: 'blur', message: '请输入合同天数' }],
  travelNight: [{ required: true, trigger: 'blur', message: '请输入合同夜数' }],
  travelData: [{ required: true, trigger: 'blur', message: '请选择行程日期' }],
  touristPeopleNumber: [{ required: true, trigger: 'blur', message: '游客人数不能为空' }],
  certificatesType: [{ required: true, trigger: 'blur', message: '请选择身份证件类型' }],
  certificatesNo: [{ required: true, trigger: 'blur', message: '请输入证件号码' }],
  touristName: [{ required: true, trigger: 'blur', message: '请选择游客代表' }],
  phone: [{ required: true, trigger: 'blur', message: '游客代表手机号不能为空' }],
  certificatesAddress: [{ required: true, trigger: 'blur', message: '游客代表地址不能为空' }],
  touristType: [{ required: true, trigger: 'blur', message: '请选择游客类型' }],
  gender: [{ required: true, trigger: 'blur', message: '请选择性别' }],
  age: [{ required: true, trigger: 'blur', message: '请输入年龄' }],
  isHealthy: [{ required: true, trigger: 'blur', message: '请选健康状态' }],
  healthyCode: [{ required: true, trigger: 'blur', message: '健康码不能为空' }],
  isAncientUygur: [{ required: true, trigger: 'blur', message: '请选择古维费购买状态' }],
  emergencyContact: [{ required: true, trigger: 'blur', message: '请填写紧急联系人' }],
  emergencyContactPhone: [{ required: true, trigger: 'blur', message: '请填写紧急联系电话' }],
  deposit: [{ required: true, trigger: 'blur', message: '请输入合同金额' }],
  liquidatedDamages: [{ required: true, trigger: 'blur', message: '请输入合同终止违约金' }],
  bond: [{ required: true, trigger: 'blur', message: '请输入黄金周保证金' }],
  hotelFine: [{ required: true, trigger: 'blur', message: '不能为空' }],
  carRentalFine: [{ required: true, trigger: 'blur', message: '不能为空' }],
  totalPriceFine: [{ required: true, trigger: 'blur', message: '不能为空' }],
  nonPerformanceFine: [{ required: true, trigger: 'blur', message: '不能为空' }],
  nonStandardFine: [{ required: true, trigger: 'blur', message: '不能为空' }],
  entrustFine: [{ required: true, trigger: 'blur', message: '不能为空' }],
  disputeResolution: [{ required: true, trigger: 'blur', message: '请选择争议解决办法' }],
}
const activeKey = ref('1')
const submitVisible = ref(false)
const submitResultVisible = ref(false)
const isShow = ref(true)
const entrustedProjectColumns = [
  {
    title: '委托项目',
    dataIndex: 'entrustedProject',
    key: 'entrustedProject',
  },
  {
    title: '委托价格',
    dataIndex: 'entrustedProjectAmount',
    key: 'entrustedProjectAmount',
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
    title: '性别',
    dataIndex: 'gender',
    key: 'gender',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '电话号码',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: '是否健康',
    dataIndex: 'isHealthy',
    key: 'isHealthy',
  },
  {
    title: '健康码',
    dataIndex: 'healthyCode',
    key: 'healthyCode',
  },
  {
    title: '古维费购买状态',
    dataIndex: 'isAncientUygur',
    key: 'isAncientUygur',
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    fixed: 'right',
    width: 70
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
const dateRules = {
  travelData: [
    {
      required: true,
      message: '请选择行程日期',
      trigger: 'change',
    },
  ],
}
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
// 获取健康状态
const cmpIsHealthy = computed(() => (val: any) => {
  let res
  isHealthyOption.forEach((item: any) => {
    if (item.codeValue == val) {
      res = item.name
    }
  })
  return res
});
// 获取是否代收古维
const cmpAncientUygur = computed(() => (val: any) => {
  let res
  ancientUygurOption.forEach((item: any) => {
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
  adultPrice: undefined | number;
  childPrice: undefined | number;
  adultNumber: undefined | number;
  childNumber: undefined | number;
  individualSubtotal: undefined | number;
  isEdit: boolean;
  isOperate?: boolean;
  computable?: boolean;
}
interface TouristItem {
  certificatesType: undefined | string; //证件类型
  certificatesNo: string; //证件号码
  touristName: string; //游客姓名
  touristType: undefined | number; //游客类型（成人、儿童）
  phone: string; //电话
  // ancientUygurReduction: undefined | number; //古维减免
  // reductionUrl: string; //减免依据附件
  certificatesAddress: string; //游客详细住址
  isRepresentative: number; //是否为游客代表
  age: string; //年龄
  gender: undefined | string; // 性别
  isHealthy: undefined | number; // 是否健康
  isAncientUygur: undefined | number; //是否代收古维
  healthyCode?: string;
  isEdit: boolean;
}
interface EntrustedProjectItem {
  entrustedProject?: string;
  entrustedProjectAmount?: number | undefined;
}
const gwFee = ref<CostItem[]>([])
const dataCostSource = ref<CostItem[]>([])
const dataTouristSource = ref<TouristItem[]>([])
const dataEntrustedProjectSource = ref<EntrustedProjectItem[]>([{
  entrustedProject: '',
  entrustedProjectAmount: undefined
}])
// 添加游客
const handleTouristAdd = () => {
  const newData = {
    isEdit: true,
    certificatesType: "IDENTITY_CARD", //证件类型
    certificatesNo: "", //证件号码
    touristName: "", //游客姓名
    touristType: 1, //游客类型（成人、儿童）
    phone: "", //电话
    // reductionUrl: "", //减免依据附件
    certificatesAddress: "", //游客详细住址
    isRepresentative: 0,//是否为游客代表
    isAncientUygur: 1,
    age: '',
    gender: '男',
    isHealthy: 1,
    healthyCode: ''
  };
  dataTouristSource.value.push(newData);
};
// 删除游客
const onTouristDelete = (index: number) => {
  dataTouristSource.value.splice(index, 1)
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
const getEntrustedFee = () => {
  const entrustedProject = dataEntrustedProjectSource.value[0].entrustedProject
  const entrustedProjectAmount = dataEntrustedProjectSource.value[0].entrustedProjectAmount
  if (entrustedProject && typeof entrustedProjectAmount === 'number') {
    return {
      isEdit: false,
      isOperate: false,
      computable: true,
      priceName: entrustedProject,
      adultPrice: 0,
      childPrice: 0,
      adultNumber: 0,
      childNumber: 0,
      individualSubtotal: entrustedProjectAmount,
    }
  }
}
const guideFee = ref<CostItem>({
  isEdit: true,
  isOperate: true,
  priceName: "导游服务费",
  adultPrice: undefined,
  childPrice: undefined,
  adultNumber: 0,
  childNumber: 0,
  individualSubtotal: 0,
})
const getList = () => {
  const arr: CostItem[] = []
  const entrustedFee = getEntrustedFee()
  if (gwFee.value.length > 0) {
    arr.push(...gwFee.value)
  }
  arr.push(guideFee.value)
  if (entrustedFee) {
    arr.push(entrustedFee)
  }
  return arr
}
const calculateTripFee = () => {
  dataCostSource.value = getList()
  // 计算成人数、儿童数
  let adult = 0
  let child = 0
  let adultNoGw = 0
  let childNoGw = 0
  dataTouristSource.value.forEach((item: TouristItem) => {
    if (item.touristType === 1) {
      // 成人数
      adult += 1
      if (item.isAncientUygur === 0) {
        // 未购古维成人数
        adultNoGw += 1
      }
    } else if (item.touristType === 2) {
      // 儿童数
      child += 1
      if (item.isAncientUygur === 0) {
        // 未购古维儿童数
        childNoGw += 1
      }
    }
  })
  adultNumber.value = adult // 成人数
  childNumber.value = child // 儿童数
  const arr: CostItem[] = []
  // 如果已有行程费用列表，又回到上一步添加游客，需重新计算人数和价格
  // 计算费用
  dataCostSource.value.forEach((item: CostItem) => {
    if (item.priceName === "古维费用") {
      item.adultNumber = adultNoGw
      item.childNumber = childNoGw
    } else {
      item.adultNumber = adult
      item.childNumber = child
    }
    if (!item.computable) {
      rowPrice(item)
    }
    arr.push(item)
  })
  dataCostSource.value = [...arr]
  allPrice()
}
// 步骤跳转
const nextTep = (val: string) => {
  activeKey.value = val
  if (val === '2') {
    calculateTripFee()
  }
}
const saveDraft = (tab?: string) => {
  const a = Promise.all([
    formRef.value?.validateFields(),
    formRef1.value?.validateFields(),
    formRef2.value?.validateFields(),
    formRef3.value?.validateFields(),
    formRef4.value?.validateFields(),
    dateFormRef.value?.validate(),
  ])
  a.then(async () => {
    tab === '1' && calculateTripFee()
    const params = getParams()
    if (isAdd.value) {
      let res = await api.createSingleContract(params)
      if (res) {
        message.success('保存草稿成功！')
        isRefresh.value = '1'
        hasId.value = true
        form.value.oid = res
      } else {
        message.error('保存草稿失败！')
      }
    } else {
      let res = await api.editSingleContract(params)
      if (res) {
        message.success('编辑草稿成功！')
        isRefresh.value = '1'
        hasId.value = true
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
const accMulCost = (arr: CostItem[]) => {
  if (arr?.length > 0) {
    return arr.map((item: CostItem) => {
      item.adultPrice = accMulValue(item.adultPrice)
      item.childPrice = accMulValue(item.childPrice)
      item.individualSubtotal = accMulValue(item.individualSubtotal)
      return item
    })
  } else {
    return []
  }
}
const accMulValue = (value: any) => {
  if (typeof value === 'number') {
    return accMul(value, 100)
  } else {
    return null
  }
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
    otherAgreements, //其他约定
    contractAmount, //行程费用
    paymentMethod,
    departurePlace,
    destination,
    returnPlace,
    emergencyContact,
    emergencyContactPhone,
    deposit,
    liquidatedDamages,
    bond,
    hotelFine,
    carRentalFine,
    totalPriceFine,
    nonPerformanceFine,
    nonStandardFine,
    entrustFine,
    disputeResolution,
  } = form.value
  return {
    oid,
    companyId, //合同创建旅行社id
    contractDays, //合同天数
    travelNight, //合同夜数
    entrustTravelId, //委托旅行社id
    tripStartTime, //合同行程开始时间
    tripEndTime, //合同行程结束时间
    touristPeopleNumber, //游客人数
    otherAgreements, //其他约定
    contractAmount: accMulValue(contractAmount),
    paymentMethod,
    departurePlace,
    destination,
    returnPlace,
    emergencyContact,
    emergencyContactPhone,
    deposit,
    liquidatedDamages,
    bond: accMulValue(bond),
    hotelFine,
    carRentalFine,
    totalPriceFine,
    nonPerformanceFine,
    nonStandardFine,
    entrustFine,
    disputeResolution,
    entrustedProject: dataEntrustedProjectSource.value[0].entrustedProject,
    entrustedProjectAmount: accMulValue(dataEntrustedProjectSource.value[0].entrustedProjectAmount),
    individualContractTouristBos: dataTouristSource.value, // 游客
    individualContractPriceBos: accMulCost(cloneDeep(dataCostSource.value)), // 费用
  }
}
const saveDraftConfirm = async () => {
  const res = await api.releaseSingleContract(form.value.oid)
  if (res) {
    submitResultVisible.value = true
  } else {
    message.error('合同签署失败！')
  }
  submitVisible.value = false
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
  })
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
      }
    }
  }
}
const accDivValue = (value: any) => {
  if (typeof value === 'number') {
    return accDiv(value, 100)
  } else {
    return undefined
  }
}
const getEditDetails = async (oid: any) => {
  const res = await api.getSingleContractDetails(oid)
  if (res) {
    hasId.value = true
    form.value = res
    form.value.bond = accDivValue(form.value.bond)
    form.value.contractAmount = accDivValue(form.value.contractAmount)
    form.value.travelData = [res.tripStartTime, res.tripEndTime]
    dataEntrustedProjectSource.value[0].entrustedProject = res.entrustedProject
    dataEntrustedProjectSource.value[0].entrustedProjectAmount = accDivValue(res.entrustedProjectAmount)
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
    dataCostSource.value = res.individualContractPriceBos.forEach((item: any) => {
      // 只返回导游服务费
      if (item.priceName === '导游服务费') {
        guideFee.value.adultPrice = accDivValue(item.adultPrice)
        guideFee.value.childPrice = accDivValue(item.childPrice)
      }
    })
  }
}
const getComprehensiveProductsList = async () => {
  let gwPrice = 0
  const res = await api.getBasicInfo()
  if (typeof res.price === 'number') {
    gwPrice = accDivValue(res.price);
  }
  const newData = [{
    isEdit: false,
    isOperate: false,
    priceName: "古维费用",
    adultPrice: gwPrice,
    childPrice: gwPrice,
    adultNumber: 0,
    childNumber: 0,
    individualSubtotal: 0,
  }];
  gwFee.value = newData;
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
    if (newVal.name === "addSingleEntrustmentContract") {
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
.cred {
  color: #d9001b;
}

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

.disflex {
  display: flex;
  justify-content: space-around;

  .flex1 {
    flex: 1;
    margin-right: 20px;
  }
}
</style>