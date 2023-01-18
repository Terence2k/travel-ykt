<template>
  <div class="content_box">
    <a-tabs v-model:activeKey="activeKey" @change="nextTep">
      <a-tab-pane key="1" tab="行程信息">
        <a-form ref="formRef" :model="form" :rules="formRules" name="addStore" autocomplete="off" :label-col="labelCol">
          <div style="width:60%">
            <div class="tag">基本信息</div>
            <a-form-item name="contractType" label="散客合同类型">
              <a-select placeholder="请选择散客合同类型" v-model:value="form.contractType" @change="contractOptionChange"
                allowClear>
                <a-select-option v-for="item in contractOption" :value="item.codeValue" :key="item.codeValue">{{
                  item.name
                }}
                </a-select-option>
              </a-select>
            </a-form-item>
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
            <a-form-item name="entrustTravelId" label="委托旅行社">
              <a-select placeholder="请选择委托旅行社" v-model:value="form.entrustTravelId" allowClear>
                <a-select-option v-for="item in entrustTravelOption" :value="item.oid" :key="item.oid">{{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <!-- <a-form-item name="travelData" label="行程日期">
            <a-range-picker v-model:value="form.travelData" @change="datePickerChange"
              :placeholder="['请选择开始时间', '请选择结束时间']" :format="dateFormat" :valueFormat="dateFormat" style="width:100%" />
            </a-form-item> -->
            <el-form ref="dateFormRef" :model="form" :rules="dateRules" :label-width="labelWidth"
              label-position="right">
              <el-form-item label="行程日期：" prop="travelData">
                <picker v-model="form.travelData" @change="datePickerChange" type="daterange" :value-format="dateFormat"
                  start-placeholder="请选择开始时间" end-placeholder="请选择结束时间" style="width:100%"></picker>
              </el-form-item>
            </el-form>
            <a-form-item name="touristPeopleNumber" label="游客人数">
              <a-input v-model:value="form.touristPeopleNumber" placeholder="无需填写，输入名单后自动生成" disabled>
              </a-input>
            </a-form-item>
            <!-- <a-form-item name="insuranceBuyMode" label="保险购买方式">
            <a-select placeholder="请选择保险购买方式" v-model:value="form.insuranceBuyMode" allowClear>
              <a-select-option v-for="item in insuranceOption" :value="item.codeValue" :key="item.codeValue">{{
                  item.name
              }}
              </a-select-option>
            </a-select>
            </a-form-item> -->
            <a-form-item name="departurePlace" label="出发地">
              <a-input v-model:value="form.departurePlace" placeholder="请填写出发地" allowClear>
              </a-input>
            </a-form-item>
            <a-form-item name="destination" label="目的地">
              <a-input v-model:value="form.destination" placeholder="请填写目的地" allowClear>
              </a-input>
            </a-form-item>
            <a-form-item name="returnPlace" label="返回地">
              <a-input v-model:value="form.returnPlace" placeholder="请填写返回地" allowClear>
              </a-input>
            </a-form-item>
            <a-form-item name="emergencyContact" label="紧急联系人">
              <a-input v-model:value="form.emergencyContact" placeholder="请填写紧急联系人" allowClear>
              </a-input>
            </a-form-item>
            <a-form-item name="emergencyContactPhone" label="紧急联系电话"
              :rules="[{ required: true, trigger: 'blur', validator: (_rule: Rule, value: string) => (validatePhone(form.emergencyContactPhone, true, '请填写紧急联系电话')) }]">
              <a-input v-model:value="form.emergencyContactPhone" placeholder="请填写紧急联系电话" allowClear>
              </a-input>
            </a-form-item>
            <div>
              <a-form-item name="contractFileUrl" label="上传附件" v-if="!isShow">
                <Upload v-model="form.contractFileUrl" :maxCount="9" ref="imgUploadRef" />
              </a-form-item>
              <a-form-item name="pdfFileUrl" label=" " :colon="false" v-if="!isShow">
                <pdfUpload v-model="form.pdfFileUrl" :maxCount="1" ref="pdfUploadRef" />
              </a-form-item>
            </div>
          </div>
          <div class="tag">选择线路</div>
          <a-table :columns="lineColumns" :data-source="dataLineSource" bordered :pagination="false">
            <template #bodyCell="{ column, text, record, index }">
              <template v-if="column.key === 'index'">
                {{ index + 1 }}
              </template>
              <template v-if="column.dataIndex === 'lineId'">
                <a-select v-if="record.isEdit" v-model:value="dataLineSource[index][column.dataIndex]"
                  @change="() => { lineSelectChange(dataLineSource[index]) }" placeholder="请选择可用线路" allowClear>
                  <a-select-option v-for="item in lineOption" :value="item.codeValue" :key="item.codeValue">{{
                    item.name
                  }}
                  </a-select-option>
                </a-select>
                <template v-else>
                  {{ cmplineName(text) }}
                </template>
              </template>
              <template v-if="column.dataIndex === 'lineStartTime'">
                <!-- <a-date-picker v-if="record.isEdit" v-model:value="dataLineSource[index][column.dataIndex]"
                  placeholder="请选择开始时间" style="width:100%" :format="dateFormat" :valueFormat="dateFormat" /> -->
                <picker v-if="record.isEdit" v-model="dataLineSource[index][column.dataIndex]" type="date"
                  :value-format="dateFormat"
                  :disabled-date="(current: Dayjs) => { return disabledDateRange(current, dataLineSource[index]) }"
                  placeholder="请选择开始时间" style="width:100%"></picker>
                <template v-else>
                  {{ text }}
                </template>
              </template>
              <template v-if="column.dataIndex === 'lineEndTime'">
                <!-- <a-date-picker v-if="record.isEdit" v-model:value="dataLineSource[index][column.dataIndex]"
                  placeholder="请选择结束时间" style="width:100%" :format="dateFormat" :valueFormat="dateFormat" /> -->
                <picker v-if="record.isEdit" v-model="dataLineSource[index][column.dataIndex]" type="date"
                  :value-format="dateFormat"
                  :disabled-date="(current: Dayjs) => { return disabledDateRange1(current, dataLineSource[index]) }"
                  placeholder="请选择结束时间" style="width:100%"></picker>
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
                    <a @click="saveLine(dataLineSource[index])">确定</a>
                  </span>
                  <span v-else>
                    <a @click="edit(dataLineSource[index])">编辑</a>
                  </span>
                  <a-popconfirm title="确认删除数据？" @confirm="onLineDelete(index)">
                    <a>删除</a>
                  </a-popconfirm>
                </div>
              </template>
            </template>
          </a-table>
          <div class="add_box">
            <a-button @click="handleLineAdd">添加</a-button>
          </div>
          <div class="tag">添加游客</div>
          <a-table :columns="touristColumns" :data-source="dataTouristSource" bordered :pagination="false"
            :scroll="{ x: '100vw' }">
            <template #headerCell="{ column }">
              <template
                v-if="['certificatesType', 'certificatesNo', 'touristName', 'touristType', 'gender', 'age', 'isHealthy', 'isAncientUygur'].includes(column.key)">
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
                  <a-form-item name="certificatesType"
                    :rules="[{ required: true, trigger: 'change', validator: (_rule: Rule, value: string) => (validateFields(dataTouristSource[index], 'certificatesType')) }]">
                    <a-select placeholder="请选择身份证件类型" v-model:value="dataTouristSource[index][column.dataIndex]"
                      allowClear style="width: 100%">
                      <a-select-option v-for="item in certificatesTypeOption" :value="item.codeValue"
                        :key="item.codeValue">{{ item.name }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </template>
                <template v-else>
                  {{ cmpCertificatesType(text) }}
                </template>
              </template>
              <template v-if="column.dataIndex === 'certificatesNo'">
                <template v-if="record.isEdit">
                  <a-form-item name="certificatesNo"
                    :rules="[{ required: true, trigger: 'blur', validator: (_rule: Rule, value: string) => (validateFields(dataTouristSource[index], 'certificatesNo')) }]">
                    <!-- <a-input placeholder="请输入证件号码" @change="() => { certificatesNoChange(dataTouristSource[index]) }"
                        v-model:value="dataTouristSource[index][column.dataIndex]" allowClear style="margin: -5px 0" /> -->
                    <a-input placeholder="请输入证件号码" v-model:value="dataTouristSource[index][column.dataIndex]" allowClear
                      style="margin: -5px 0" />
                  </a-form-item>
                </template>
                <template v-else>
                  {{ text }}
                </template>
              </template>
              <template v-if="column.dataIndex === 'touristName'">
                <template v-if="record.isEdit">
                  <a-form-item name="touristName"
                    :rules="[{ required: true, trigger: 'blur', validator: (_rule: Rule, value: string) => (validateFields(dataTouristSource[index], 'touristName')) }]">
                    <a-input placeholder="请输入游客姓名" v-model:value="dataTouristSource[index][column.dataIndex]" allowClear
                      style="margin: -5px 0" />
                  </a-form-item>
                </template>
                <template v-else>
                  {{ text }}
                </template>
              </template>
              <template v-if="column.dataIndex === 'touristType'">
                <template v-if="record.isEdit">
                  <a-form-item name="touristType"
                    :rules="[{ required: true, trigger: 'change', validator: (_rule: Rule, value: string) => (validateFields(dataTouristSource[index], 'touristType')) }]">
                    <a-select placeholder="请选择游客类型" v-model:value="dataTouristSource[index][column.dataIndex]"
                      allowClear style="width: 100%">
                      <a-select-option v-for="item in touristTypeOption" :value="item.codeValue"
                        :key="item.codeValue">{{
                          item.name
                        }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </template>
                <template v-else>
                  {{ cmpTouristType(text) }}
                </template>
              </template>
              <template v-if="column.dataIndex === 'gender'">
                <template v-if="record.isEdit">
                  <a-form-item name="gender"
                    :rules="[{ required: true, trigger: 'change', validator: (_rule: Rule, value: string) => (validateFields(dataTouristSource[index], 'gender')) }]">
                    <a-select placeholder="请选择性别" v-model:value="dataTouristSource[index][column.dataIndex]" allowClear
                      style="width: 100%">
                      <a-select-option v-for="item in genderOption" :value="item.codeValue" :key="item.codeValue">{{
                        item.name
                      }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </template>
                <template v-else>
                  {{ text }}
                </template>
              </template>
              <template v-if="column.dataIndex === 'age'">
                <template v-if="record.isEdit">
                  <a-form-item name="age"
                    :rules="[{ required: true, trigger: 'blur', validator: (_rule: Rule, value: string) => (validateFields(dataTouristSource[index], 'age')) }]">
                    <a-input placeholder="请输入年龄" v-model:value.number="dataTouristSource[index][column.dataIndex]"
                      allowClear style="margin: -5px 0" />
                  </a-form-item>
                </template>
                <template v-else>
                  {{ text }}
                </template>
              </template>
              <template v-if="column.dataIndex === 'phone'">
                <template v-if="record.isEdit">
                  <a-form :model="dataTouristSource[index]" autocomplete="off">
                    <a-form-item name="phone"
                      :rules="[{ trigger: 'blur', validator: (_rule: Rule, value: string) => (validatePhone(dataTouristSource[index][column.dataIndex])) }]">
                      <a-input placeholder="请输入电话号码" v-model:value="dataTouristSource[index][column.dataIndex]"
                        allowClear style="margin: -5px 0" />
                    </a-form-item>
                  </a-form>
                </template>
                <template v-else>
                  {{ text }}
                </template>
              </template>
              <template v-if="column.dataIndex === 'isHealthy'">
                <template v-if="record.isEdit">
                  <a-form-item name="isHealthy"
                    :rules="[{ required: true, trigger: 'change', validator: (_rule: Rule, value: string) => (validateFields(dataTouristSource[index], 'isHealthy')) }]">
                    <a-select placeholder="请选健康状态" v-model:value="dataTouristSource[index][column.dataIndex]" allowClear
                      style="width: 100%">
                      <a-select-option v-for="item in isHealthyOption" :value="item.codeValue" :key="item.codeValue">{{
                        item.name
                      }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </template>
                <template v-else>
                  {{ cmpIsHealthy(text) }}
                </template>
              </template>
              <!-- <template v-if="column.dataIndex === 'healthyCode'">
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
              </template> -->
              <template v-if="column.dataIndex === 'isAncientUygur'">
                <template v-if="record.isEdit">
                  <a-form-item name="isAncientUygur"
                    :rules="[{ required: true, trigger: 'change', validator: (_rule: Rule, value: string) => (validateFields(dataTouristSource[index], 'isAncientUygur')) }]">
                    <a-select placeholder="请选择古维费购买状态" v-model:value="dataTouristSource[index][column.dataIndex]"
                      allowClear style="width: 100%">
                      <a-select-option v-for="item in ancientUygurOption" :value="item.codeValue"
                        :key="item.codeValue">{{
                          item.name
                        }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </template>
                <template v-else>
                  {{ cmpAncientUygur(text) }}
                </template>
              </template>
              <!-- <template v-if="column.dataIndex === 'ancientUygurReduction'">
                <a-select placeholder="请选择是否减免" v-if="record.isEdit"
                  v-model:value="dataTouristSource[index][column.dataIndex]" allowClear>
                  <a-select-option v-for="item in ancientUygurReductionOption" :value="item.codeValue"
                    :key="item.codeValue">{{ item.name }}
                  </a-select-option>
                </a-select>
                <template v-else>
                  {{ cmpAncientUygurReduction(text) }}
                </template>
              </template> -->
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
                    <a @click="saveTourist(dataTouristSource[index])">确定</a>
                  </span>
                  <span v-else>
                    <a @click="edit(dataTouristSource[index])">编辑</a>
                  </span>
                  <a-popconfirm title="确认删除数据？" @confirm="onTouristDelete(index)">
                    <a>删除</a>
                  </a-popconfirm>
                </div>
              </template>
            </template>
          </a-table>
          <div class="add_box">
            <a-button @click="handleTouristAdd">添加</a-button>
          </div>
          <div v-if="isShow" style="width:60%">
            <a-form-item name="touristName1" label="游客代表"
              :rules="[{ required: true, trigger: 'change', validator: (_rule: Rule, value: string) => (validateFields(form.touristName, 'touristName1')) }]">
              <a-select @change="touristChange" placeholder="请选择游客代表" v-model:value="form.certificatesNo" allowClear>
                <a-select-option v-for="item in dataTouristSource" :value="item.certificatesNo"
                  :key="item.certificatesNo">{{ item.touristName }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item name="certificatesNo" label="游客代表证件">
              <a-input v-model:value="form.certificatesNo" placeholder="无需填写，输入名单后自动生成" disabled>
              </a-input>
            </a-form-item>
            <a-form-item name="phone" label="游客代表手机号"
              :rules="[{ required: true, trigger: 'blur', validator: (_rule: Rule, value: string) => (validatePhone(form.phone, true, '请填写游客代表手机号')) }]">
              <a-input v-model:value="form.phone" placeholder="请填写游客代表手机号" @change="phoneChange" allowClear>
              </a-input>
            </a-form-item>
            <a-form-item name="certificatesAddress" label="游客代表地址">
              <a-input @change="addressChange" v-model:value="form.certificatesAddress" placeholder="请输入游客代表地址"
                allowClear>
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
              <a-input v-if="record.isEdit && record.isDelete" v-model:value="dataCostSource[index][column.dataIndex]"
                style="margin: -5px 0" placeholder="请输入产品名称" />
              <template v-else>
                {{ text }}
              </template>
            </template>
            <template v-if="column.dataIndex === 'adultPrice'">
              <a-form-item name="adultPrice" v-if="record.isEdit"
                :rules="[{ required: true, trigger: 'blur', validator: (_rule: Rule, value: string) => (validateNumber(dataCostSource[index], 'adultPrice')) }]"
                style="margin-bottom:0">
                <a-input v-set-number="{ key: 'adultPrice', obj: dataCostSource[index] }"
                  v-model:value="dataCostSource[index][column.dataIndex]" style="margin: -5px 0" placeholder="请输入成人价"
                  :autocapitalize="false" />
              </a-form-item>
              <template v-else>
                {{ text }}
              </template>
            </template>
            <template v-if="column.dataIndex === 'childPrice'">
              <a-form-item name="childPrice" v-if="record.isEdit"
                :rules="[{ required: true, trigger: 'blur', validator: (_rule: Rule, value: string) => (validateNumber(dataCostSource[index], 'childPrice')) }]"
                style="margin-bottom:0">
                <a-input v-set-number="{ key: 'childPrice', obj: dataCostSource[index] }"
                  v-model:value="dataCostSource[index][column.dataIndex]" style="margin: -5px 0" placeholder="请输入儿童价"
                  :autocapitalize="false" />
              </a-form-item>
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
                  <a @click="saveCost(dataCostSource[index])">确定</a>
                </span>
                <span v-else>
                  <a @click="edit(dataCostSource[index])">编辑</a>
                </span>
                <a-popconfirm title="确认删除数据？" @confirm="onCostDelete(index)">
                  <a v-if="record.isDelete">删除</a>
                </a-popconfirm>
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
        <a-form ref="formRef4" :model="form" :rules="formRules" autocomplete="off">
          <a-form-item name="paymentMethod" label="游客费用支付方式">
            <a-select placeholder="选择游客线下的实际支付方式" v-model:value="form.paymentMethod" allowClear style="width:20%">
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
            <a-button type="primary" @click="submitClick">{{ submiBtnName }}</a-button>
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
    <p>您已发起散客合同签署。请等待游客代表<span class="cred">{{
      form.touristName
    }}</span>通过网页完成签署，签署后可使用该电子合同发起拼团</p>
  </CommonModal>
  <CommonModal title="散客线上合同签署成功" v-model:visible="submitResultVisible1" @close="submitResultVisible1 = false"
    :conform-text="'确定'" :is-cancel="false" @conform="submitResultVisible1 = false">
    <p>您已完成散客电子合同（来源：门店线下合同）补录，后续您和授权社均可使用该合同发起散客拼团</p>
  </CommonModal>
</template>

<script setup lang="ts">
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router';
import { CloseOutlined } from '@ant-design/icons-vue';
import Upload from '@/components/common/imageWrapper.vue';
import pdfUpload from '@/components/common/pdfWrapper.vue';
import { cloneDeep } from 'lodash';
import CommonModal from '@/views/baseInfoManage/dictionary/components/CommonModal.vue';
import { useBusinessManageOption } from '@/stores/modules/businessManage';
import api from '@/api';
import { message } from 'ant-design-vue/es';
import picker from '@/components/common/datePicker.vue';
import { accDiv, accMul } from '@/utils/compute';
import { getAge, getGenderByIdNumber } from '@/utils';
import type { Rule } from 'ant-design-vue/es/form';
import { useNavigatorBar } from '@/stores/modules/navigatorBar';
import dayjs, { Dayjs } from 'dayjs';
import { getUserInfo } from '@/utils/util';
const userInfo = getUserInfo();
const navigatorBar = useNavigatorBar();
const accDivValue = (value: any) => {
  if (typeof value === 'number') {
    return accDiv(value, 100)
  } else {
    return undefined
  }
}
const accMulValue = (value: any) => {
  if (typeof value === 'number') {
    return accMul(value, 100)
  } else {
    return null
  }
}
const router = useRouter();
const route = useRoute();
const isRefresh = ref('0')
const imgUploadRef = ref()
const pdfUploadRef = ref()
const back = () => {
  imgUploadRef.value?.clearFileList()
  pdfUploadRef.value?.clearFileList()
  router.push({
    name: 'electronicContratList',
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
  pdfFileUrl: "",
  paymentMethod: 1,
  departurePlace: '',
  destination: '',
  returnPlace: '',
  emergencyContact: '',
  emergencyContactPhone: '',
})
const adultNumber = ref(0)
const childNumber = ref(0)
const businessManageOptions = useBusinessManageOption();
const initOpeion = async () => {
  await businessManageOptions.getBusinessTypeOption('CERTIFICATE_TYPE')
};
const entrustTravelOption = ref([])
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
  { codeValue: 0, name: '未购' }
]
const contractOption = [
  { codeValue: 1, name: '线上合同（需传附件）' },
  { codeValue: 2, name: '线下合同' }
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
const validatePhone = async (mobile: string, required: boolean = false, msg?: string) => {
  if (required && !mobile) {
    return Promise.reject(msg);
  } else if (mobile && !/^1[3-9]\d{9}$/.test(mobile)) {
    return Promise.reject('请输入正确的手机号！');
  }
}
const validateNumber = async (obj: any, key: string) => {
  if (['', undefined].includes(obj[key])) {
    return Promise.reject('请输入价格');
  } else {
    if (!isNaN(Number(obj[key]))) {
      priceChange(obj)
      return Promise.resolve();
    } else {
      return Promise.reject('请输入正确的价格');
    }
  }
}
const validateFields = async (obj: any, type: string) => {
  if (type === 'certificatesType') {
    if (obj.certificatesType) {
      return Promise.resolve();
    } else {
      return Promise.reject('请选择身份证件类型');
    }
  } else if (type === 'certificatesNo') {
    if (obj.certificatesNo) {
      if (obj.certificatesType === 'IDENTITY_CARD') {
        if (obj.certificatesNo.length < 18) {
          return Promise.reject('请输入正确的身份证');
        } else {
          obj.age = getAge(obj.certificatesNo)
          const genderType = getGenderByIdNumber(obj.certificatesNo)
          if (genderType === 1) {
            obj.gender = '男'
          } else if (genderType === 0) {
            obj.gender = '女'
          } else {
            obj.gender = undefined
          }
          return Promise.resolve();
        }
      } else if (obj.certificatesType === 'PASSPORT') {
        return Promise.resolve();
      } else if (obj.certificatesType === 'COMPATRIOT_CARD') {
        return Promise.resolve();
      }
    } else {
      return Promise.reject('请输入证件号码');
    }
  } else if (type === 'touristName') {
    if (obj.touristName) {
      return Promise.resolve();
    } else {
      return Promise.reject('请输入游客姓名');
    }
  } else if (type === 'touristType') {
    if (obj.touristType) {
      return Promise.resolve();
    } else {
      return Promise.reject('请选择游客类型');
    }
  } else if (type === 'gender') {
    if (obj.gender) {
      return Promise.resolve();
    } else {
      return Promise.reject('请选择性别');
    }
  } else if (type === 'age') {
    if (obj.age) {
      return Promise.resolve();
    } else {
      return Promise.reject('请输入年龄');
    }
  } else if (type === 'isHealthy') {
    if ([1, 0].includes(obj.isHealthy)) {
      return Promise.resolve();
    } else {
      return Promise.reject('请选健康状态');
    }
  } else if (type === 'isAncientUygur') {
    if ([1, 0].includes(obj.isAncientUygur)) {
      return Promise.resolve();
    } else {
      return Promise.reject('请选择古维费购买状态');
    }
  } else if (type === 'touristName1') {
    if (obj) {
      return Promise.resolve();
    } else {
      return Promise.reject('请选择游客代表');
    }
  }
}
const formRules = {
  paymentMethod: [{ required: true, trigger: 'blur', message: '选择游客线下的实际支付方式' }],
  departurePlace: [{ required: true, trigger: 'blur', message: '请填写出发地' }],
  destination: [{ required: true, trigger: 'blur', message: '请填写目的地' }],
  returnPlace: [{ required: true, trigger: 'blur', message: '请填写返回地' }],
  contractDays: [{ required: true, trigger: 'blur', message: '请输入合同天数' }],
  travelNight: [{ required: true, trigger: 'blur', message: '请输入合同夜数' }],
  travelData: [{ required: true, trigger: 'blur', message: '请选择行程日期' }],
  touristPeopleNumber: [{ required: true, trigger: 'blur', message: '游客人数不能为空' }],
  insuranceBuyMode: [{ required: true, trigger: 'blur', message: '请选择保险购买方式' }],
  contractType: [{ required: true, trigger: 'blur', message: '请选择散客合同类型' }],
  // touristName: [{ required: true, trigger: 'blur', message: '请选择游客代表' }],
  certificatesAddress: [{ required: true, trigger: 'blur', message: '游客代表地址不能为空' }],
  contractFileUrl: [{ required: true, trigger: 'blur', message: '请上传附件' }],
  emergencyContact: [{ required: true, trigger: 'blur', message: '请填写紧急联系人' }],
}
const activeKey = ref('1')
const submitVisible = ref(false)
const submitResultVisible = ref(false)
const submitResultVisible1 = ref(false)
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
    width: 100
  },
  {
    title: '身份证件类型',
    dataIndex: 'certificatesType',
    key: 'certificatesType',
    width: 180
  },
  {
    title: '证件号码',
    dataIndex: 'certificatesNo',
    key: 'certificatesNo',
    width: 220
  },
  {
    title: '游客姓名',
    dataIndex: 'touristName',
    key: 'touristName',
    width: 180
  },
  {
    title: '游客类型',
    dataIndex: 'touristType',
    key: 'touristType',
    width: 180
  },
  {
    title: '性别',
    dataIndex: 'gender',
    key: 'gender',
    width: 180
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    width: 180
  },
  {
    title: '电话号码',
    dataIndex: 'phone',
    key: 'phone',
    width: 180
  },
  {
    title: '是否健康',
    dataIndex: 'isHealthy',
    key: 'isHealthy',
    width: 180
  },
  /* {
    title: '健康码',
    dataIndex: 'healthyCode',
    key: 'healthyCode',
  }, */
  {
    title: '古维费购买状态',
    dataIndex: 'isAncientUygur',
    key: 'isAncientUygur',
    width: 220
  },
  /* {
    title: '古维减免',
    dataIndex: 'ancientUygurReduction',
    key: 'ancientUygurReduction',
  }, */
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
    width: 120
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
const submiBtnName = ref("发出签署")
// 根据不同合同类型控制不同表单显示
const contractOptionChange = (val: number) => {
  switch (val) {
    case 2:
      isShow.value = true
      form.value.contractFileUrl = ''
      form.value.pdfFileUrl = ''
      submiBtnName.value = '发出签署'
      break;
    case 1:
      isShow.value = false
      form.value.touristName = undefined
      form.value.phone = ''
      form.value.certificatesAddress = ''
      form.value.certificatesNo = undefined
      touristChange()
      submiBtnName.value = '提交发布'
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
      submiBtnName.value = '发出签署'
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
  adultPrice: undefined | number;
  childPrice: undefined | number;
  adultNumber: undefined | number;
  childNumber: undefined | number;
  individualSubtotal: undefined | number;
  isEdit: boolean;
  isOperate?: boolean;
  isDelete?: boolean;
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
  // healthyCode?: string;
  isEdit: boolean;
}
interface LineItem {
  lineId: undefined | number;
  lineName: string;
  lineStartTime: string;
  lineEndTime: string;
  adultPrice: number | undefined;
  childPrice: number | undefined;
  lineDescribe: string;
  isEdit: boolean;
}
const gwFee = ref<CostItem[]>([])
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
    adultPrice: undefined,
    childPrice: undefined,
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
    // healthyCode: ''
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
    isDelete: true,
    priceName: "",
    adultPrice: undefined,
    childPrice: undefined,
    adultNumber: adultNumber.value,
    childNumber: childNumber.value,
    individualSubtotal: undefined,
  };
  dataCostSource.value.push(newData);
};
// 删除行程费用
const onCostDelete = (index: number) => {
  dataCostSource.value.splice(index, 1)
};
const saveCost = (obj: any) => {
  const msg = []
  !obj.priceName && msg.push('请输入产品名称')
  if (obj.adultPrice === '' || obj.adultPrice === undefined || obj.adultPrice === null) {
    msg.push('请输入成人价')
  }
  if (obj.childPrice === '' || obj.childPrice === undefined || obj.childPrice === null) {
    msg.push('请输入儿童价')
  }
  if (msg.length > 0) {
    let str = msg.toString()
    str = str.replaceAll(',', '、')
    message.error(str)
  } else {
    obj.isEdit = false
  }
};
const saveLine = (obj: any) => {
  const msg = []
  !obj.lineId && msg.push('请选择可用线路')
  !obj.lineStartTime && msg.push('请选择开始时间')
  !obj.lineEndTime && msg.push('请选择结束时间')
  if (msg.length > 0) {
    let str = msg.toString()
    str = str.replaceAll(',', '、')
    message.error(str)
  } else {
    obj.isEdit = false
  }
}
const saveTourist = (obj: any) => {
  const msg = []
  !obj.certificatesType && msg.push('请选择身份证件类型')
  !obj.certificatesNo && msg.push('请输入证件号码')
  !obj.touristName && msg.push('请输入游客姓名')
  !obj.touristType && msg.push('请选择游客类型')
  !obj.gender && msg.push('请选择性别')
  !obj.age && msg.push('请输入年龄')
  ![1, 0].includes(obj.isHealthy) && msg.push('请选健康状态')
  ![1, 0].includes(obj.isAncientUygur) && msg.push('请选择古维费购买状态')
  if (msg.length > 0) {
    let str = msg.toString()
    str = str.replaceAll(',', '、')
    message.error(str)
  } else {
    obj.isEdit = false
  }
};
const edit = (obj: any) => {
  obj.isEdit = true
};
const getLineFee = () => {
  return dataLineSource.value.map((item: LineItem) => {
    return {
      priceName: item.lineName,
      adultPrice: item.adultPrice,
      childPrice: item.childPrice,
      adultNumber: 0,
      childNumber: 0,
      individualSubtotal: undefined,
      isEdit: false,
      isOperate: false,
      isDelete: false,
    }
  })
}
const guideFee = ref<CostItem>({
  isEdit: false,
  isOperate: true,
  isDelete: false,
  priceName: "导游服务费",
  adultPrice: 0,
  childPrice: 0,
  adultNumber: 0,
  childNumber: 0,
  individualSubtotal: 0,
})
const getList = () => {
  const arr: CostItem[] = []
  const LineFee = getLineFee()
  const customFee = dataCostSource.value.filter((item: CostItem) => {
    if (item.isDelete) {
      return item
    }
  })
  if (gwFee.value.length > 0) {
    arr.push(...gwFee.value)
  }
  // 新增的时候为编辑状态，编辑的时候为非编辑状态，点击编辑再编辑
  if (isAdd.value) {
    guideFee.value.isEdit = true
  } else {
    guideFee.value.isEdit = false
  }
  arr.push(guideFee.value)
  if (LineFee.length > 0) {
    arr.push(...LineFee)
  }
  if (customFee?.length > 0) {
    arr.push(...customFee)
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
    rowPrice(item)
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
const validateList = () => {
  return new Promise((resolve, reject) => {
    const msg = []
    if (dataTouristSource.value.length === 0) {
      msg.push('请添加游客！')
    } else {
      for (let i = 0; i < dataTouristSource.value.length; i++) {
        const element = dataTouristSource.value[i];
        if (element.isEdit) {
          msg.push('请确认游客列表添加的数据！')
          break
        }
      }
    }
    if (dataLineSource.value.length === 0) {
      msg.push('请添加线路！')
    } else {
      for (let i = 0; i < dataLineSource.value.length; i++) {
        const element = dataLineSource.value[i];
        if (element.isEdit) {
          msg.push('请确认线路列表添加的数据！')
          break
        }
      }
    }
    for (let i = 0; i < dataCostSource.value.length; i++) {
      const element = dataCostSource.value[i];
      if (element.isEdit) {
        msg.push('请确认行程费用列表添加的数据！')
        break
      }
    }
    if (msg.length > 0) {
      let str = msg.toString()
      str = str.replaceAll(',', '、')
      message.error(str)
      reject('error')
    } else {
      resolve(true)
    }
  })
}
const saveDraft = (tab?: string, isTip: boolean = true, isRelease: boolean = false) => {
  tab === '1' && calculateTripFee()
  return new Promise(async (resolve, reject) => {
    if (isRelease) {
      const a = Promise.all([
        formRef.value?.validateFields(),
        dateFormRef.value?.validate(),
        validateList()
      ])
      a.then(async () => {
        const params = getParams()
        params.isRelease = isRelease
        if (isAdd.value) {
          let res = await api.createIndividualContract(params)
          if (res) {
            isTip && message.success('保存草稿成功！')
            isRefresh.value = '1'
            isAdd.value = false
            form.value.oid = res
            resolve('down')
          } else {
            isTip && message.error('保存草稿失败！')
            reject('error')
          }
        } else {
          let res = await api.editFindIndividualContract(params)
          if (res) {
            isTip && message.success('编辑草稿成功！')
            isRefresh.value = '1'
            resolve('down')
          } else {
            isTip && message.error('编辑草稿失败！')
            reject('error')
          }
        }
      }).catch((error: Error) => {
        console.log(error);
        reject('error')
      })
    } else {
      const params = getParams()
      params.isRelease = isRelease
      if (isAdd.value) {
        let res = await api.createIndividualContract(params)
        if (res) {
          isTip && message.success('保存草稿成功！')
          isRefresh.value = '1'
          isAdd.value = false
          form.value.oid = res
          resolve('down')
        } else {
          isTip && message.error('保存草稿失败！')
          reject('error')
        }
      } else {
        let res = await api.editFindIndividualContract(params)
        if (res) {
          isTip && message.success('编辑草稿成功！')
          isRefresh.value = '1'
          resolve('down')
        } else {
          isTip && message.error('编辑草稿失败！')
          reject('error')
        }
      }
    }
  })
}
const submitCancel = () => {
  submitVisible.value = false
}
const accMulCost = (arr: any[]) => {
  if (arr?.length > 0) {
    return arr.map((item: any) => {
      item.adultPrice = accMulValue(Number(item.adultPrice))
      item.childPrice = accMulValue(Number(item.childPrice))
      item.individualSubtotal = accMulValue(Number(item.individualSubtotal))
      return item
    })
  } else {
    return []
  }
}
// 获取提交参数
const getParams = () => {
  form.value.companyId = userInfo.sysCompany.oid
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
    paymentMethod,
    departurePlace,
    destination,
    returnPlace,
    emergencyContact,
    emergencyContactPhone,
  } = form.value
  let fileUrl
  if (contractFileUrl && pdfFileUrl) {
    fileUrl = contractFileUrl + ',' + pdfFileUrl
  } else if (contractFileUrl && !pdfFileUrl) {
    fileUrl = contractFileUrl
  } else if (!contractFileUrl && pdfFileUrl) {
    fileUrl = pdfFileUrl
  }
  return {
    paymentMethod,
    departurePlace,
    destination,
    returnPlace,
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
    contractAmount: accMulValue(contractAmount),
    individualContractLineBos: accMulCost(cloneDeep(dataLineSource.value)), // 线路
    individualContractTouristBos: dataTouristSource.value, // 游客
    individualContractPriceBos: accMulCost(cloneDeep(dataCostSource.value)), // 费用
    emergencyContact,
    emergencyContactPhone,
    isRelease: true
  }
}
const saveDraftConfirm = async () => {
  await saveDraft(undefined, false, true)
  const res = await api.releaseContract(form.value.oid)
  if (res) {
    submitResultVisible.value = true
  } else {
    message.error('合同发出签署失败！')
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
// 游客代表手机号改变事件
let phoneTimer: NodeJS.Timeout
const phoneChange = () => {
  phoneTimer && clearTimeout(phoneTimer)
  phoneTimer = setTimeout(async () => {
    dataTouristSource.value.forEach((item: any) => {
      if (item.certificatesNo === form.value.certificatesNo) {
        item.phone = form.value.phone
      }
    })
  }, 1000)
}
// 游客代表改变事件
const touristChange = () => {
  dataTouristSource.value.forEach((item: any) => {
    if (item.certificatesNo === form.value.certificatesNo) {
      form.value.phone = item.phone
      form.value.touristName = item.touristName
      item.certificatesAddress = form.value.certificatesAddress
      item.isRepresentative = 1 // 是否为游客代表 1：是、0：否
    } else {
      item.certificatesAddress = ''
      item.isRepresentative = 0
      form.value.touristName = undefined
    }
  })
}
// 游客代表地址改变事件
let addresTimer: NodeJS.Timeout
const addressChange = () => {
  addresTimer && clearTimeout(addresTimer)
  addresTimer = setTimeout(async () => {
    dataTouristSource.value.forEach((item: any) => {
      if (item.certificatesNo === form.value.certificatesNo) {
        item.certificatesAddress = form.value.certificatesAddress
      }
    })
  }, 1000)
}
/* // 根据游客身份证号获取健康码
let timer: NodeJS.Timeout
const certificatesNoChange = (obj: any) => {
  if (obj.certificatesNo) {
    timer && clearTimeout(timer)
    timer = setTimeout(async () => {
      obj.healthyCode = await getHealthyCode([{ certificateId: obj.certificatesNo }])
    }, 2000)
  }
} */
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
  priceTimer && clearTimeout(priceTimer)
  priceTimer = setTimeout(async () => {
    rowPrice(obj)
    allPrice()
  })
}
// 线路改变事件
const lineSelectChange = (obj: any) => {
  if (obj.lineId) {
    for (let i = 0, l = lineOption.value.length; i < l; i++) {
      const element = lineOption.value[i];
      if (element.codeValue === obj.lineId) {
        obj.adultPrice = accDivValue(element.adultPrice)
        obj.childPrice = accDivValue(element.childPrice)
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
/* const getHealthyCode = async (data: any) => {
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
} */
/* // 批量获取健康码
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
} */
/* const configCodeName = (certificateCodes: any) => {
  for (let i = 0, l = certificateCodes.length; i < l; i++) {
    const item = certificateCodes[i];
    for (let j = 0, l = dataTouristSource.value.length; j < l; j++) {
      const citem = dataTouristSource.value[j];
      if (item.certificateId === citem.certificatesNo) {
        dataTouristSource.value[j].healthyCode = item.codeName
      }
    }
  }
} */
const getEditDetails = async (oid: any) => {
  const res = await api.editFindIndividualContractById(oid)
  if (res) {
    form.value = res
    const files = form.value.contractFileUrl?.split(',')
    const contractFileUrl: string[] = []
    const pdfFileUrl: string[] = []
    files?.forEach((item: any) => {
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
      item.adultPrice = accDivValue(item.adultPrice)
      item.childPrice = accDivValue(item.childPrice)
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
    /* // 获取身份证列表
    const certificateIds = res.individualContractTouristBos.map((item: any) => {
      return { certificateId: item.certificatesNo }
    })
    // 根据身份证列表查询健康码列表
    const certificateCodes = await getHealthyCodes(certificateIds)
    // 将健康码和游客列表数据关联
    configCodeName(certificateCodes) */

    dataCostSource.value = res.individualContractPriceBos.filter((item: any) => {
      // 只返回导游服务费和自定义费用
      if (item.isOperate) {
        item.adultPrice = accDivValue(item.adultPrice)
        item.childPrice = accDivValue(item.childPrice)
        if (item.priceName !== '导游服务费') {
          item.isEdit = false
          item.isDelete = true
          return item
        } else {
          guideFee.value.adultPrice = item.adultPrice
          guideFee.value.childPrice = item.childPrice
        }
      }
    })
    contractOptionChange(form.value.contractType)
  }
}
const submitClick = async () => {
  if (isShow.value) {
    submitVisible.value = true
  } else {
    // 提交发布线上合同
    await saveDraft(undefined, false, true)
    const res = await api.releaseOnlineContract({ oid: form.value.oid, operation: 1 }) //1.发布  2.撤销
    if (res) {
      submitResultVisible1.value = true
    } else {
      message.error('合同提交发布失败！')
    }
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
    isDelete: false,
    priceName: "古维费用",
    adultPrice: gwPrice,
    childPrice: gwPrice,
    adultNumber: 0,
    childNumber: 0,
    individualSubtotal: 0,
  }];
  gwFee.value = newData;
}
const disabledDateRange = (current: Dayjs, obj: any) => {
  if (form.value.tripStartTime && form.value.tripEndTime) {
    if (!obj?.lineEndTime) {
      return current < dayjs(form.value.tripStartTime) || current > dayjs(form.value.tripEndTime);
    } else {
      return current < dayjs(form.value.tripStartTime) || current > dayjs(obj.lineEndTime);
    }
  } else {
    return false
  }
};
const disabledDateRange1 = (current: Dayjs, obj: any) => {
  if (form.value.tripStartTime && form.value.tripEndTime) {
    if (!obj?.lineStartTime) {
      return current < dayjs(form.value.tripStartTime) || current > dayjs(form.value.tripEndTime);
    } else {
      return current < dayjs(obj.lineStartTime) || current > dayjs(form.value.tripEndTime);
    }
  } else {
    return false
  }
};
const getEntrustTravelOption = () => {
  api.getTravelCompany(userInfo.sysCompany.oid).then((res: any) => {
    entrustTravelOption.value = res
  })
}
const getBusinessDetails = async () => {
  const params = { oid: userInfo.sysCompany.oid, businessType: 'TRAVEL' }
  const { individualDeparturePlace, individualReturnPlace } = await api.getBusinessDetails(params)
  form.value.departurePlace = individualDeparturePlace
  form.value.returnPlace = individualReturnPlace
}
onMounted(() => {
  getBusinessDetails()
  getEntrustTravelOption()
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
        navigatorBar.setNavigator(['旅行社管理', '散客电子合同', '新增']);
        isAdd.value = true
      } else if (newVal.query.operation === 'update') {
        navigatorBar.setNavigator(['旅行社管理', '散客电子合同', '编辑']);
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
</style>