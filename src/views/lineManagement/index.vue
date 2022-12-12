<template>
  <search v-model:value="tableData.param" @query="onQuery" v-show="activeKey === '1'"></search>
  <search v-model:value="tableData1.param" @query="onQuery" v-show="activeKey === '2'"></search>
  <div class="tabs_box">
    <a-badge :count="tableData1.total" class="rebadge" v-show="rolesLevel === 1" />
    <a-tabs v-model:activeKey="activeKey" @change="tabsChange">
      <a-tab-pane key="1" tab="已审核" v-if="getTabPermission('已审核')">
        <CommonTable :dataSource="tableData.data" :columns="columns">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'index'">
              {{ index + 1 }}
            </template>
            <template v-if="column.key === 'price'">
              <div v-if="record.individualLinePriceVos?.length > 0">
                <span v-for="(item, index) in record.individualLinePriceVos" :key="index">{{
                    `${item.priceTypeName}价${item.priceAmount}元${(record.individualLinePriceVos.length - 1) === index ? ''
                      : '、'}`
                }}</span>
              </div>
              <div v-else>无</div>
            </template>
            <template v-if="column.key === 'ticketCompany'">
              <div v-if="record.individualLineTicketVos?.length > 0">
                <span v-for="(item, index) in cmpIndividualLineTicketVos(record.individualLineTicketVos)"
                  :key="index">{{
                      `${item}${(cmpIndividualLineTicketVos(record.individualLineTicketVos).length - 1) === index ? ''
                        : '、'}`
                  }}</span>
              </div>
              <div v-else>无</div>
            </template>
            <template v-if="column.key === 'hotelCompany'">
              <div v-if="record.individualLineHotelVos?.length > 0">
                <span v-for="(item, index) in cmpIndividualLineHotelVos(record.individualLineHotelVos)" :key="index">{{
                    `${item}${(cmpIndividualLineHotelVos(record.individualLineHotelVos).length - 1) === index ? ''
                      : '、'}`
                }}</span>
              </div>
              <div v-else>无</div>
            </template>
            <template v-if="column.key === 'cateringCompany'">
              <div v-if="record.individualLineCateringVos?.length > 0">
                <span v-for="(item, index) in cmpIndividualLineCateringVos(record.individualLineCateringVos)"
                  :key="index">{{
                      `${item}${(cmpIndividualLineCateringVos(record.individualLineCateringVos).length - 1) === index ? ''
                        : '、'}`
                  }}</span>
              </div>
              <div v-else>无</div>
            </template>
            <template v-if="column.key === 'action'">
              <div class="action-btns">
                <a @click="checkDetails(record)" v-permission="'已审核_查看'">查看</a>
                <a @click="addOrUpdate({ row: record, handle: 'update' })" v-show="modifyVisible(record.creatorId)"
                  v-permission="'已审核_修改'">修改</a>
                <!-- <a-popconfirm title="是否要禁用该操作员？禁用后该操作员不可再登录一卡通平台。" ok-text="确认" cancel-text="取消"
                  @confirm="disable(0, record.userId)">
                  <a v-show="record.enableSatus">禁用</a>
                </a-popconfirm>
                <a-popconfirm title="是否要启用该操作员？启用后该操作员可恢复登录、散拼业务权限。" ok-text="确认" cancel-text="取消"
                  @confirm="disable(1, record.userId)">
                  <a v-show="!record.enableSatus">启用</a>
                </a-popconfirm> -->
              </div>
            </template>
          </template>
        </CommonTable>
        <div class="buttom_box">
          <div>共 <span style="color:#de0025;">{{ tableData.total }}</span>条线路</div>
          <CommonPagination v-model:current="tableData.param.pageNo" v-model:page-size="tableData.param.pageSize"
            :total="tableData.total" @change="onHandleCurrentChange" @showSizeChange="pageSideChange" />
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="待审核" v-if="getTabPermission('待审核')">
        <CommonTable :dataSource="tableData1.data" :columns="columns1">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'index'">
              {{ index + 1 }}
            </template>
            <template v-if="column.key === 'price'">
              <div v-if="record.individualLinePriceVos?.length > 0">
                <span v-for="(item, index) in record.individualLinePriceVos" :key="index">{{
                    `${item.priceTypeName}价${item.priceAmount}元${(record.individualLinePriceVos.length - 1) === index ? ''
                      : '、'}`
                }}</span>
              </div>
              <div v-else>无</div>
            </template>
            <template v-if="column.key === 'ticketCompany'">
              <div v-if="record.individualLineTicketVos?.length > 0">
                <span v-for="(item, index) in cmpIndividualLineTicketVos(record.individualLineTicketVos)"
                  :key="index">{{
                      `${item}${(cmpIndividualLineTicketVos(record.individualLineTicketVos).length - 1) === index ? ''
                        : '、'}`
                  }}</span>
              </div>
              <div v-else>无</div>
            </template>
            <template v-if="column.key === 'hotelCompany'">
              <div v-if="record.individualLineHotelVos?.length > 0">
                <span v-for="(item, index) in cmpIndividualLineHotelVos(record.individualLineHotelVos)" :key="index">{{
                    `${item}${(cmpIndividualLineHotelVos(record.individualLineHotelVos).length - 1) === index ? ''
                      : '、'}`
                }}</span>
              </div>
              <div v-else>无</div>
            </template>
            <template v-if="column.key === 'cateringCompany'">
              <div v-if="record.individualLineCateringVos?.length > 0">
                <span v-for="(item, index) in cmpIndividualLineCateringVos(record.individualLineCateringVos)"
                  :key="index">{{
                      `${item}${(cmpIndividualLineCateringVos(record.individualLineCateringVos).length - 1) === index ? ''
                        : '、'}`
                  }}</span>
              </div>
              <div v-else>无</div>
            </template>
            <template v-if="column.key === 'action'">
              <div class="action-btns">
                <template v-if="record?.isAudit">
                  <a @click="auditStore(record)" v-permission="'待审核_去审核'">去审核</a>
                </template>
                <a @click="checkDetails(record)" v-permission="'待审核_查看'">查看</a>
              </div>
            </template>
          </template>
        </CommonTable>
        <div class="buttom_box">
          <div>共 <span style="color:#de0025;">{{ tableData1.total }}</span> 条线路</div>
          <CommonPagination v-model:current="tableData1.param.pageNo" v-model:page-size="tableData1.param.pageSize"
            :total="tableData1.total" @change="onHandleCurrentChange1" @showSizeChange="pageSideChange1" />
        </div>
      </a-tab-pane>
      <template #rightExtra>
        <a-button type="primary" @click="addOrUpdate({ handle: 'add' })" v-permission="'创建新路线'">创建新路线</a-button>
      </template>
    </a-tabs>
  </div>

  <CommonModal :title="state.title" v-model:visible="modalVisible" @cancel="cancel" @close="cancel"
    :conform-text="'提交审核'" width="40%" @conform="submitLine">
    <a-form ref="lineRef" :model="form" :rules="formRules" name="addStore" autocomplete="off" :label-col="labelCol"
      :wrapper-col="{ span: 24 }">
      <a-form-item name="lineName" label="线路名称">
        <a-input v-model:value="form.lineName" placeholder="请输入线路名称，30字以内" show-count :maxlength="30">
        </a-input>
      </a-form-item>
      <a-form-item name="lineDescribe" label="线路描述">
        <a-textarea v-model:value="form.lineDescribe" placeholder="请输入线路描述，300字以内" show-count :maxlength="300" />
      </a-form-item>
      <a-form-item label="适用范围" v-if="rolesLevel !== 3 && state.isAdd">
        <a-form-item name="suitableRange" v-if="rolesLevel === 1">
          <a-radio-group v-model:value="form.suitableRange" @change="radioChange">
            <a-radio :style="radioStyle" :value="1">全部旅行社全部门店可用</a-radio>
            <a-radio :style="radioStyle" :value="2">指定旅行社</a-radio>
            <a-radio :style="radioStyle" :value="3">指定门店</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item name="suitableRange" v-if="rolesLevel === 2">
          <a-radio-group v-model:value="form.suitableRange" @change="radioChange">
            <a-radio :style="radioStyle" :value="2">本旅行社</a-radio>
            <a-radio :style="radioStyle" :value="3">指定门店</a-radio>
          </a-radio-group>
        </a-form-item>
        <!-- 角色为门店操作员不用选 -->
        <!-- <a-form-item name="suitableRange" v-if="rolesLevel === 3">
          <a-radio-group v-model:value="form.suitableRange" @change="radioChange">
            <a-radio :style="radioStyle" :value="3">本门店</a-radio>
          </a-radio-group>
        </a-form-item> -->
        <a-form-item name="suitableRangeTravelId" v-show="travelVisible">
          <a-select placeholder="选择旅行社" v-model:value="form.suitableRangeTravelId" allowClear @change="getStoreList">
            <a-select-option v-for="item in TRAVELOptions" :value="item.oid" :key="item.oid">{{
                item.name
            }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="suitableRangeStoreId" v-show="storeVisible">
          <a-select placeholder="选择门店" v-model:value="form.suitableRangeStoreId" allowClear>
            <a-select-option v-for="item in storeOptions" :value="item.oid" :key="item.oid">{{
                item.name
            }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form-item>
      <!-- <a-form-item label="选择线路内商家">
        <a-form-item name="TICKETSelected" label="景区">
          <a-select placeholder="请选择景区" mode="multiple" v-model:value="form.TICKETSelected" allowClear>
            <a-select-option v-for="item in TICKETOptions" :value="item.oid">{{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="HOTELSelected" label="酒店">
          <a-select placeholder="请选择酒店" mode="multiple" v-model:value="form.HOTELSelected" allowClear>
            <a-select-option v-for="item in HOTELOptions" :value="item.oid">{{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="CATERINGSelected" label="餐厅">
          <a-select placeholder="请选择餐厅" mode="multiple" v-model:value="form.CATERINGSelected" allowClear>
            <a-select-option v-for="item in CATERINGOptions" :value="item.oid">{{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form-item> -->
      <a-form-item label="选择线路内商家"></a-form-item>
      <a-form-item v-for="(item, index) in form.TICKETSelected" :key="item.key" :label="index === 0 ? '景区' : ' '"
        :colon="index === 0 ? true : false" :name="['TICKETSelected', index, 'value']" style="margin-bottom: 8px;">
        <div style="display: flex">
          <a-form-item style="flex:1;margin-bottom: 8px;">
            <a-input-number v-model:value="item.day" addon-before="第" addon-after="天" :min="1"
              class="mr8"></a-input-number>
          </a-form-item>
          <a-form-item style="flex:3;margin-bottom: 8px;">
            <a-select placeholder="请选择景区" mode="multiple" v-model:value="item.selectedList" allowClear>
              <a-select-option v-for="item in TICKETOptions" :value="item.oid" :key="item.oid">{{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <MinusCircleOutlined v-if="form.TICKETSelected.length > 1" class="dynamic-delete-button"
            @click="removeSelectedItem(item, form.TICKETSelected)" style="margin-left: 8px;" />
        </div>
      </a-form-item>
      <a-form-item label=" " :colon="false">
        <a-button type="dashed" @click="addSelectedItem(form.TICKETSelected)">
          <PlusOutlined />
          添加
        </a-button>
      </a-form-item>

      <a-form-item v-for="(item, index) in form.HOTELSelected" :key="item.key" :label="index === 0 ? '酒店' : ' '"
        :colon="index === 0 ? true : false" :name="['HOTELSelected', index, 'value']" style="margin-bottom: 8px;">
        <div style="display: flex">
          <a-form-item style="flex:1;margin-bottom: 8px;">
            <a-input-number v-model:value="item.day" addon-before="第" addon-after="天" :min="1"
              class="mr8"></a-input-number>
          </a-form-item>
          <a-form-item style="flex:3;margin-bottom: 8px;">
            <a-select placeholder="请选择酒店" mode="multiple" v-model:value="item.selectedList" allowClear>
              <a-select-option v-for=" item in HOTELOptions" :value="item.oid" :key="item.oid">{{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <MinusCircleOutlined v-if="form.HOTELSelected.length > 1" class="dynamic-delete-button"
            @click="removeSelectedItem(item, form.HOTELSelected)" style="margin-left: 8px;" />
        </div>
      </a-form-item>
      <a-form-item label=" " :colon="false">
        <a-button type="dashed" @click="addSelectedItem(form.HOTELSelected)">
          <PlusOutlined />
          添加
        </a-button>
      </a-form-item>

      <a-form-item v-for="(item, index) in form.CATERINGSelected" :key="item.key" :label="index === 0 ? '餐厅' : ' '"
        :colon="index === 0 ? true : false" :name="['CATERINGSelected', index, 'value']" style="margin-bottom: 8px;">
        <div style="display: flex">
          <a-form-item style="flex:1;margin-bottom: 8px;">
            <a-input-number v-model:value="item.day" addon-before="第" addon-after="天" :min="1"
              class="mr8"></a-input-number>
          </a-form-item>
          <a-form-item style="flex:3;margin-bottom: 8px;">
            <a-select placeholder="请选择餐厅" mode="multiple" v-model:value="item.selectedList" allowClear>
              <a-select-option v-for="item in CATERINGOptions" :value="item.oid" :key="item.oid">{{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <MinusCircleOutlined v-if="form.CATERINGSelected.length > 1" class="dynamic-delete-button"
            @click="removeSelectedItem(item, form.CATERINGSelected)" style="margin-left: 8px;" />
        </div>
      </a-form-item>
      <a-form-item label=" " :colon="false">
        <a-button type="dashed" @click="addSelectedItem(form.CATERINGSelected)">
          <PlusOutlined />
          添加
        </a-button>
      </a-form-item>

      <!-- <a-form-item name="TICKETSelected" label="景区">
          <a-select placeholder="请选择景区" mode="multiple" v-model:value="form.TICKETSelected" allowClear>
            <a-select-option v-for="item in TICKETOptions" :value="item.oid">{{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="HOTELSelected" label="酒店">
          <a-select placeholder="请选择酒店" mode="multiple" v-model:value="form.HOTELSelected" allowClear>
            <a-select-option v-for="item in HOTELOptions" :value="item.oid">{{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="CATERINGSelected" label="餐厅">
          <a-select placeholder="请选择餐厅" mode="multiple" v-model:value="form.CATERINGSelected" allowClear>
            <a-select-option v-for="item in CATERINGOptions" :value="item.oid">{{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item> -->

      <!-- <a-form-item v-for="(domain, index) in form.domains" :key="domain.key" :label="index === 0 ? '包含景区' : ' '"
        :colon="index === 0 ? true : false" :name="['domains', index, 'value']">
        <div style="display: flex">
          <a-select placeholder="请选择一个景区" v-model:value="domain.value" allowClear
            :class="{ mr8: form.domains.length > 1 }" @change="() => (sceneChange(form.domains, sceneOption1))">
            <a-select-option v-for="item in sceneOption1" :value="item.codeValue" :disabled="item.disabled">{{ item.name
            }}
            </a-select-option>
          </a-select>
          <MinusCircleOutlined v-if="form.domains.length > 1" class="dynamic-delete-button"
            @click="removeDomain(domain, form.domains, sceneOption1)" />
        </div>
      </a-form-item>
      <a-form-item label=" " :colon="false">
        <a-button type="dashed" @click="addDomain(form.domains)">
          <PlusOutlined />
          添加
        </a-button>
      </a-form-item> -->
      <!-- <a-form-item v-for="(domain, index) in form.domains1" :key="domain.key" :label="index === 0 ? '包含酒店' : ' '"
        :colon="index === 0 ? true : false" :name="['domains1', index, 'value']">
        <div style="display: flex">
          <a-select placeholder="请选择一个酒店" v-model:value="domain.value" allowClear
            :class="{ mr8: form.domains1.length > 1 }" @change="() => (sceneChange(form.domains1, sceneOption2))">
            <a-select-option v-for="item in sceneOption2" :value="item.codeValue" :disabled="item.disabled">{{ item.name
            }}
            </a-select-option>
          </a-select>
          <MinusCircleOutlined v-if="form.domains1.length > 1" class="dynamic-delete-button"
            @click="removeDomain(domain, form.domains1, sceneOption2)" />
        </div>
      </a-form-item>
      <a-form-item label=" " :colon="false">
        <a-button type="dashed" @click="addDomain(form.domains1)">
          <PlusOutlined />
          添加
        </a-button>
      </a-form-item> -->


      <!-- <div v-for="(domain, index) in form.domains" :key="domain.key" style="display: flex;">
        <a-form-item :label="index === 0 ? '选择线路内商家' : ' '" :colon="index === 0 ? true : false"
          :name="['domains', index, 'value']" :wrapper-col="{ offset: 0, span: 24 }" style="flex: 1">
          <a-select placeholder="请选择业态" v-model:value="domain.value" allowClear @change="">
            <a-select-option v-for="item in businessTypeOption" :value="item.codeValue">{{
                item.name
            }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label=" " :name="['domains', index, 'business']" :colon="false" :label-col="{ offset: 1, }"
          :wrapper-col="{ offset: 0, span: 24 }" :class="{ mr8: form.domains.length > 1 }" style="flex: 1">
          <a-select placeholder="请选择商家" v-model:value="domain.business" allowClear
            @change="() => { sceneChange(form.domains, businessOption(domain.value)) }">
            <a-select-option v-for="item in businessOption(domain.value)" :value="item.codeValue"
              :disabled="item.disabled">{{
                  item.name
              }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <MinusCircleOutlined v-if="form.domains.length > 1" class="dynamic-delete-button"
          @click="removeDomain(domain, form.domains, businessOption(domain.value))" />
      </div>
      <a-form-item label=" " :colon="false">
        <a-button type="dashed" @click="addDomain(form.domains)">
          <PlusOutlined />
          添加
        </a-button>
      </a-form-item> -->

      <!-- <div v-for="(sight, index) in form.sights" :key="sight.key" style="display: flex;">
        <a-form-item :name="['sights', index, 'value']" :label="index === 0 ? '一口价' : ' '"
          :colon="index === 0 ? true : false" :wrapper-col="{ offset: 0, span: 24 }" style="flex: 1">
          <a-select v-model:value="sight.id" @change="sightsChange" allowClear>
            <a-select-option v-for="item in sceneOption3" :value="item.codeValue" :disabled="item.disabled">{{
                item.name
            }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label=" " :name="['sights', index, 'price']" :colon="false" :label-col="{ offset: 1, }"
          :wrapper-col="{ offset: 0, span: 24 }" :class="{ mr8: form.sights.length > 1 }" style="flex: 1">
          <a-input v-model:value="sight.price" />
        </a-form-item>
        <MinusCircleOutlined v-if="form.sights.length > 1" @click="removeSights(sight, form.sights, sceneOption3)"
          class="dynamic-delete-button" />
      </div>
      <a-form-item label=" " :colon="false">
        <a-button type="dashed" @click="addSight(form.sights)">
          <PlusOutlined />
          添加
        </a-button>
      </a-form-item> -->
      <a-form-item label="一口价">
      </a-form-item>
      <a-form-item v-for="item in state.YKJList" :name="item.codeValue" :label="item.name" :key="item.codeValue">
        <a-input v-model:value.number="form[item.codeValue]" placeholder="输入价格">
        </a-input>
      </a-form-item>
      <a-form-item name="enableSatus" label="启用状态" v-show="!state.isAdd">
        <a-radio-group v-model:value="form.enableSatus">
          <a-radio :value="1">启用</a-radio>
          <a-radio :value="0">禁用</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </CommonModal>
  <CommonModal title="查看线路详情" v-model:visible="detailsVisible" :conform-text="'关闭'" @conform="detailsClose"
    @cancel="detailsClose" :is-cancel="false">
    <div class="table_box">
      <table class="info_table" cellpadding="16px" border="1">
        <tr class="row" v-for="(value, key) in cmpDetailsKeys" :key="key">
          <td class="key">{{ value }}</td>
          <td class="value" style="white-space: pre-wrap;">
            {{ detailsForm[key] }}
          </td>
        </tr>
      </table>
    </div>
  </CommonModal>
  <CommonModal title="审核线路" v-model:visible="auditVisible" @cancel="auditCancel" @close="failVisible = true"
    :conform-text="'通过'" :cancel-text="'驳回'" @conform="registerAuditVisible = true">
    提交审核时间：{{ detailsForm.createTime }}
    <div class="table_box">
      <table class="info_table" cellpadding="16px" border="1">
        <tr class="row" v-for="(value, key) in auditKeys" :key="key">
          <td class="key">{{ value }}</td>
          <td class="value" style="white-space: pre-wrap;">{{ detailsForm[key] }}</td>
        </tr>
      </table>
    </div>
  </CommonModal>
  <CommonModal title="线路修改审核" v-model:visible="changeVisible" @cancel="changeCancel" @close="failVisible = true"
    :conform-text="'通过'" :cancel-text="'驳回'" @conform="registerAuditVisible = true" width="50%">
    <div class="table_box">
      提交审核时间：{{ detailsForm.updateTime }}
      <table class="change_table" cellpadding="16px" border="1">
        <tr class="row">
          <th class="key_hd">信息项</th>
          <th class="key_hd">修改前</th>
          <th class="key_hd">修改后</th>
        </tr>
        <tr class="row" v-for="(item, index) in changeKeys" :key="index">
          <td class="key">{{ compareKeys[item] }}</td>
          <td class="value" style="white-space: pre-wrap;">{{ oldArrList[item] }}</td>
          <td class="value" style="white-space: pre-wrap;">{{ newArrList[item] }}</td>
        </tr>
      </table>
    </div>
  </CommonModal>
  <CommonModal :title="registerAuditTitle" v-model:visible="registerAuditVisible" @close="registerAuditVisible = false"
    @conform="registerAuditConform" :conform-text="'确定'" :key="registerAuditTitle + isRegiste">
    <span v-if="isRegiste">
      您即将批准{{ detailsForm['creatorName'] }}创建的散客线路{{ detailsForm['lineName'] }}，审核通过，可用于发起散客电子合同、散客拼团。请仔细确认
    </span>
    <span v-else>
      您即将批准{{ detailsForm['creatorName'] }}修改的散客线路{{ detailsForm['lineName'] }}，审核通过，可用于发起散客电子合同、散客拼团。请仔细确认
    </span>
  </CommonModal>
  <CommonModal :title="failTitle" v-model:visible="failVisible" @close="failClose" @cancel="failClose"
    @conform="failConform" :conform-text="'确定'" :key="failTitle + isRegiste">
    <a-form layout="vertical" ref="failFormRef" :model="failForm" :rules="failFormRules" name="fail-form"
      autocomplete="off" labelAlign="left">
      <a-form-item name="auditRemark" :label="`驳回${detailsForm['creatorName']}的线路${isRegiste ? '创建' : '修改'}，填写驳回理由：`">
        <a-textarea v-model:value="failForm.auditRemark" placeholder="请输入驳回原因" :rows="2">
        </a-textarea>
      </a-form-item>
    </a-form>
  </CommonModal>
</template>

<script setup lang="ts">
import CommonTable from '@/components/common/CommonTable.vue';
import CommonPagination from '@/components/common/CommonPagination.vue';
import search from '@/views/lineManagement/search.vue';
import CommonModal from '@/views/baseInfoManage/dictionary/components/CommonModal.vue';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
import api from '@/api';
import { useRouter, useRoute } from 'vue-router';
import type { Rule } from 'ant-design-vue/es/form';
import { message } from 'ant-design-vue/es';
import { getTabPermission } from '@/utils/util';
import { forEach } from 'lodash';
const router = useRouter();
const route = useRoute();
interface ticketType {
  day: undefined | number;
  selectedList: number[];
  key: number;
}
interface Sights {
  key: number;
  price: string | undefined | number;
  id: string | undefined | number;
}
const state = reactive({
  title: '创建散客拼团线路',
  tableData: {
    data: [],
    total: 0,
    loading: false,
    param: {
      pageNo: 1,
      pageSize: 10,
      suitableRange: undefined,
      lineName: undefined,
      auditStatus: 1, // 已审核
      permissionCode: null, // //查询code（1:旅行社超管、中心操作员,2:门店操作员）——管理角色不传
    },
  },
  tableData1: {
    data: [],
    total: 0,
    loading: false,
    param: {
      pageNo: 1,
      pageSize: 10,
      suitableRange: undefined,
      lineName: undefined,
      auditStatus: 2, // 待审核
      permissionCode: null, // //查询code（1:旅行社超管、中心操作员,2:门店操作员）——管理角色不传
    },
  },
  rolesLevel: 3, // 1:文旅局超管、一卡通超管,2:旅行社超管、中心操作员,3:门店操作员
  modalVisible: false,
  detailsVisible: false,
  auditVisible: false,
  failVisible: false,
  registerAuditVisible: false,
  changeVisible: false,
  isRegiste: true,
  isAdd: true,
  YKJList: [],
  TICKETOptions: [],
  CATERINGOptions: [],
  HOTELOptions: [],
  TRAVELOptions: [],
  storeOptions: [],
  userID: undefined
});
const {
  tableData,
  tableData1,
  rolesLevel,
  modalVisible,
  detailsVisible,
  auditVisible,
  failVisible,
  registerAuditVisible,
  changeVisible,
  isRegiste,
  TICKETOptions,
  CATERINGOptions,
  HOTELOptions,
  TRAVELOptions,
  storeOptions
} = toRefs(state)
const radioStyle = reactive({
  display: 'flex',
  height: '30px',
  lineHeight: '30px',
});
const activeKey = ref('1')
type detailsKeysType = {
  createTime?: string,
  updateTime?: string,
  auditType?: string,
  lineName?: string,
  lineDescribe?: string,
  creatorName?: string,
  suitableRangeName?: string,
  hotelCompanysName?: string,
  cateringCompanysName?: string,
  ticketCompanysName?: string,
  priceTypesName?: string,
  enableSatusName?: string,
  auditStatusName?: string,
  auditStatus?: number,
  informationAuditStatus?: number
}
const detailsForm = ref<detailsKeysType>({})
const commonKeys = {
  lineName: '线路名称',
  lineDescribe: '线路描述',
  creatorName: '创建人',
  suitableRangeName: '适用范围',
  hotelCompanysName: '包含酒店',
  ticketCompanysName: '包含景区',
  cateringCompanysName: '包含餐厅',
  priceTypesName: '一口价',
  enableSatusName: '启用状态',
}
const detailsKeys = {
  ...commonKeys,
  auditStatusName: '审核状态',
}
const auditKeys = {
  auditType: '审核类型',
  ...commonKeys
}
const compareKeys = {
  lineName: '线路名称',
  lineDescribe: '线路描述',
  hotelCompanysName: '包含酒店',
  ticketCompanysName: '包含景区',
  cateringCompanysName: '包含餐厅',
  priceTypesName: '一口价',
  enableSatusName: '启用状态',
}
const form = reactive({
  oid: undefined,
  companyId: undefined,
  suitableRange: undefined, // 适用范围（1.所有  2.本旅行社  3.本门店）
  suitableRangeTravelId: undefined, // 适用范围旅行社企业id
  suitableRangeStoreId: undefined, // 适用范围门店id
  lineName: '',
  lineDescribe: '',
  TICKETSelected: [{
    day: 1,
    selectedList: [],
    key: Date.now(),
  }],
  CATERINGSelected: [{
    day: 1,
    selectedList: [],
    key: Date.now(),
  }],
  HOTELSelected: [{
    day: 1,
    selectedList: [],
    key: Date.now(),
  }],
  enableSatus: 1,
  /* domains: [{
    value: undefined,
    business: undefined,
    key: Date.now(),
  }], 
  domains1: [{
    value: undefined,
    key: Date.now(),
  }],
  sights: [{
    id: undefined,
    price: undefined,
    key: Date.now(),
  }]*/
})
const failForm = reactive({
  auditTypeCode: 21, // 21:创建线路,22:修改线路信息
  auditRemark: '',
  uuid: '',
  roleId: '',
  businessType: '',
  /* 
  2 审核通过
  3 审核不通过
   */
  auditStatus: 2
})
const failFormRules: Record<string, Rule[]> = {
  auditRemark: [{ required: true, trigger: 'blur', message: '请输入驳回原因' }],
}
const lineRef = ref()
const failFormRef = ref()
const formRules = {}
const newArrList = ref<any>({})
const oldArrList = ref<any>({})
const changeKeys = ref<string[]>([])
const labelCol = { style: { width: '110px' } }
const enableOption = [
  { codeValue: 0, name: '本社全部部门可用' },
  { codeValue: 1, name: '仅创建门店可用' },
]
const businessTypeOption = [
  { codeValue: 0, name: '景区' },
  { codeValue: 1, name: '酒店' },
  { codeValue: 2, name: '餐厅' },
]
/* const sceneOption = ref([
  { codeValue: 0, markValue: '0_0', name: '景区1' },
  { codeValue: 1, markValue: '0_1', name: '景区2' },
  { codeValue: 2, markValue: '0_2', name: '景区3' },
  { codeValue: 3, markValue: '0_3', name: '景区4' },
  { codeValue: 4, markValue: '0_4', name: '景区5' },
  { codeValue: 5, markValue: '0_5', name: '景区6' },
  { codeValue: 6, markValue: '0_6', name: '景区7' },
  { codeValue: 7, markValue: '0_7', name: '景区8' },
  { codeValue: 8, markValue: '0_8', name: '景区9' },
])
const restaurantOption = ref([
  { codeValue: 0, markValue: '2_0', name: '餐厅1' },
  { codeValue: 1, markValue: '2_1', name: '餐厅2' },
  { codeValue: 2, markValue: '2_2', name: '餐厅3' },
  { codeValue: 3, markValue: '2_3', name: '餐厅4' },
  { codeValue: 4, markValue: '2_4', name: '餐厅5' },
  { codeValue: 5, markValue: '2_5', name: '餐厅6' },
  { codeValue: 6, markValue: '2_6', name: '餐厅7' },
  { codeValue: 7, markValue: '2_7', name: '餐厅8' },
  { codeValue: 8, markValue: '2_8', name: '餐厅9' },
])
const sceneOption1 = ref([
  { codeValue: 0, name: '景区1' },
  { codeValue: 1, name: '景区2' },
  { codeValue: 2, name: '景区3' },
  { codeValue: 3, name: '景区4' },
  { codeValue: 4, name: '景区5' },
  { codeValue: 5, name: '景区6' },
  { codeValue: 6, name: '景区7' },
  { codeValue: 7, name: '景区8' },
  { codeValue: 8, name: '景区9' },
])
const hotelOption = ref([
  { codeValue: 0, markValue: '1_0', name: '酒店1' },
  { codeValue: 1, markValue: '1_1', name: '酒店2' },
  { codeValue: 2, markValue: '1_2', name: '酒店3' },
  { codeValue: 3, markValue: '1_3', name: '酒店4' },
  { codeValue: 4, markValue: '1_4', name: '酒店5' },
  { codeValue: 5, markValue: '1_5', name: '酒店6' },
  { codeValue: 6, markValue: '1_6', name: '酒店7' },
  { codeValue: 7, markValue: '1_7', name: '酒店8' },
  { codeValue: 8, markValue: '1_8', name: '酒店9' },
])
const sceneOption3 = ref([
  { codeValue: 0, name: '成人价' },
  { codeValue: 1, name: '老人价' },
  { codeValue: 2, name: '儿童价' },
  { codeValue: 3, name: '会员一口价' },
]) */
/* const businessOption = computed(() => (val: number | undefined) => {
  if (val === 0) {
    return sceneOption.value
  } else if (val === 1) {
    return hotelOption.value
  } else if (val === 2) {
    return restaurantOption.value
  } else {
    return []
  }
}) */
const registerAuditTitle = computed(() => {
  return isRegiste.value ? '二次确认' : '二次确认'
})
const failTitle = computed(() => {
  return isRegiste.value ? '驳回确认' : '驳回确认'
})
const travelVisible = computed(() => {
  if (rolesLevel.value === 1) {
    if (form.suitableRange === 3 || form.suitableRange === 2) {
      return true
    }
  } else {
    return false
  }
})
const storeVisible = computed(() => {
  if (rolesLevel.value === 1 || rolesLevel.value === 2) {
    if (form.suitableRange === 3) {
      return true
    }
  } else {
    return false
  }
})
const modifyVisible = computed(() => (id: number) => {
  if (state.rolesLevel === 1) {
    return true
  } else {
    if (state.userID === id) {
      return true
    } else {
      return false
    }
  }
})
const cmpDetailsKeys = computed(() => {
  if (detailsForm.value.auditStatus === 2) {
    return { ...detailsKeys, rejectReason: '驳回原因' }
  } if (detailsForm.value.informationAuditStatus === 3) {
    const obj = { ...detailsKeys, rejectReason: '驳回原因' }
    Reflect.deleteProperty(obj, 'auditStatusName')
    return obj
  } else {
    return detailsKeys
  }
})
const cmpIndividualLineTicketVos = computed(() => (val: any) => {
  if (val?.length) {
    return Array.from(new Set(val.map((item: any) => {
      return item.ticketCompanyName
    })))
  } else {
    return []
  }
})
const cmpIndividualLineHotelVos = computed(() => (val: any) => {
  if (val?.length) {
    return Array.from(new Set(val.map((item: any) => {
      return item.hotelCompanyName
    })))
  } else {
    return []
  }
})
const cmpIndividualLineCateringVos = computed(() => (val: any) => {
  if (val?.length) {
    return Array.from(new Set(val.map((item: any) => {
      return item.cateringCompanyName
    })))
  } else {
    return []
  }
})
const tabsChange = () => { };
const getDetails = async (oid: string | number) => {
  const res = await api.findIndividualLineById(oid)
  if (res) {
    setValue(res)
  }
  return res ? res : {}
}
const checkDetails = async (record: any) => {
  detailsForm.value = await getDetails(record.oid)
  detailsVisible.value = true
}
const detailsClose = () => {
  state.detailsVisible = false
  detailsForm.value = {}
}
const auditCancel = () => {
  state.auditVisible = false
  detailsForm.value = {}
}
const registerAuditConform = async () => {
  // 审核通过
  failForm.auditStatus = 2
  let res = await api.auditCompany(toRaw(failForm))
  if (res) {
    message.success('审核成功！')
    auditVisible.value = false
    registerAuditVisible.value = false
    changeVisible.value = false
    onSearch()
    onAuditSearch()
  } else {
    message.error('审核失败！')
  }
}
const failConform = async () => {
  // 审核不通过
  failFormRef.value.validateFields().then(async () => {
    // 审核不通过
    failForm.auditStatus = 3
    let res = await api.auditCompany(toRaw(failForm))
    if (res) {
      message.success('驳回成功！')
      auditVisible.value = false
      failVisible.value = false
      changeVisible.value = false
      onSearch()
      onAuditSearch()
    } else {
      message.error('驳回失败！')
    }
  })
}
const failClose = () => {
  failFormRef.value.resetFields()
  failVisible.value = false
}
const changeCancel = () => {
  newArrList.value = {}
  oldArrList.value = {}
  changeKeys.value = []
}
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '线路名称',
    dataIndex: 'lineName',
    key: 'lineName',
  },
  {
    title: '一口价',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: '包含景区',
    dataIndex: 'ticketCompany',
    key: 'ticketCompany',
  },
  {
    title: '包含酒店',
    dataIndex: 'hotelCompany',
    key: 'hotelCompany',
  },
  {
    title: '包含餐厅',
    dataIndex: 'cateringCompany',
    key: 'cateringCompany',
  },
  {
    title: '创建人',
    dataIndex: 'creatorName',
    key: 'creatorName',
  },
  {
    title: '适用范围',
    dataIndex: 'suitableRangeName',
    key: 'suitableRangeName',
  },
  {
    title: '启用状态',
    dataIndex: 'enableSatusName',
    key: 'enableSatusName',
  },
  {
    title: '审核结果',
    dataIndex: 'auditStatusName',
    key: 'auditStatusName',
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 208
  },
]
const columns1 = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '线路名称',
    dataIndex: 'lineName',
    key: 'lineName',
  },
  {
    title: '一口价',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: '包含景区',
    dataIndex: 'ticketCompany',
    key: 'ticketCompany',
  },
  {
    title: '包含酒店',
    dataIndex: 'hotelCompany',
    key: 'hotelCompany',
  },
  {
    title: '包含餐厅',
    dataIndex: 'cateringCompany',
    key: 'cateringCompany',
  },
  {
    title: '创建人',
    dataIndex: 'creatorName',
    key: 'creatorName',
  },
  {
    title: '适用范围',
    dataIndex: 'suitableRangeName',
    key: 'suitableRangeName',
  },
  {
    title: '提交时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '审核类型',
    dataIndex: 'auditType',
    key: 'auditType',
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 208
  },
]
const onHandleCurrentChange = (val: number) => {
  state.tableData.param.pageNo = val;
  onSearch();
}
const pageSideChange = (current: number, size: number) => {
  state.tableData.param.pageSize = size;
  onSearch();
}
const onHandleCurrentChange1 = (val: number) => {
  state.tableData1.param.pageNo = val;
  onAuditSearch();
}
const pageSideChange1 = (current: number, size: number) => {
  state.tableData1.param.pageSize = size;
  onAuditSearch();
}
const onSearch = async () => {
  const { content, total } = await api.selectIndividualLineList(state.tableData.param)
  state.tableData.data = content
  state.tableData.total = total
}
const onAuditSearch = async () => {
  const res = await api.selectIndividualLineList(state.tableData1.param)
  const uuids: (string | number)[] = []
  res.content.forEach((item: any) => {
    if (item.auditUuid) {
      uuids.push(item.auditUuid)
    }
  })
  if (uuids.length > 0) {
    let res1 = await api.getAuditButton({ uuIds: uuids })
    if (res1?.length > 0) {
      res.content.forEach((item: any) => {
        res1.forEach((citem: any) => {
          if (item.auditUuid === citem.uuid) {
            item.uuid = citem.uuid
            item.roleId = citem.roleId
            item.auditBusinessType = citem.auditBusinessType
            item.isAudit = true
          }
        })
      })
    }
  }
  state.tableData1.data = res.content
  state.tableData1.total = res.total
}
const onQuery = () => {
  if (activeKey.value === '1') {
    state.tableData.param.pageNo = 1;
    onSearch()
  } else if (activeKey.value === '2') {
    state.tableData1.param.pageNo = 1;
    onAuditSearch()
  }
}
const radioChange = () => {
  form.suitableRangeTravelId = undefined
  form.suitableRangeStoreId = undefined
  if (rolesLevel.value === 2) {
    if (form.suitableRange === 2) {
      form.suitableRangeTravelId = form.companyId
    } else if (form.suitableRange === 3) {
      form.suitableRangeTravelId = form.companyId
      getStoreList()
    }
  }
}
const getParams = () => {
  let {
    oid,
    companyId,
    suitableRange,
    suitableRangeTravelId,
    suitableRangeStoreId,
    lineName,
    lineDescribe,
    TICKETSelected,
    CATERINGSelected,
    HOTELSelected,
    enableSatus
  } = form
  let individualLineTicketBos: { day: number | undefined, ticketCompanyId: number | string, ticketCompanyName: string }[] = []
  let individualLineHotelBos: { day: number, hotelCompanyId: number | string, hotelCompanyName: string }[] = []
  let individualLineCateringBos: { day: number, cateringCompanyId: number | string, cateringCompanyName: string }[] = []
  let individualLinePriceBos: { priceTypeCode: string, priceAmount: number | string }[] = []
  if (TICKETSelected.length > 0) {
    for (let i = 0, l = TICKETSelected.length; i < l; i++) {
      const item = TICKETSelected[i];
      for (let j = 0, l = TICKETOptions.value.length; j < l; j++) {
        const citem = TICKETOptions.value[j];
        if (item.selectedList.includes(citem.oid)) {
          individualLineTicketBos.push({
            day: item.day,
            ticketCompanyId: citem.oid,
            ticketCompanyName: citem.name
          })
        }
      }
    }
  }
  if (HOTELSelected.length > 0) {
    for (let i = 0, l = HOTELSelected.length; i < l; i++) {
      const item = HOTELSelected[i];
      for (let j = 0, l = HOTELOptions.value.length; j < l; j++) {
        const citem = HOTELOptions.value[j];
        if (item.selectedList.includes(citem.oid)) {
          individualLineHotelBos.push({
            day: item.day,
            hotelCompanyId: citem.oid,
            hotelCompanyName: citem.name
          })
        }
      }
    }
  }
  if (CATERINGSelected.length > 0) {
    for (let i = 0, l = CATERINGSelected.length; i < l; i++) {
      const item = CATERINGSelected[i];
      for (let j = 0, l = CATERINGOptions.value.length; j < l; j++) {
        const citem = CATERINGOptions.value[j];
        if (item.selectedList.includes(citem.oid)) {
          individualLineCateringBos.push({
            day: item.day,
            cateringCompanyId: citem.oid,
            cateringCompanyName: citem.name
          })
        }
      }
    }
  }
  if (state.YKJList.length > 0) {
    individualLinePriceBos = state.YKJList.map((item: any) => {
      return { priceTypeCode: item.codeValue, priceAmount: form[item.codeValue], priceTypeName: item.name }
    })
  }
  if (state.rolesLevel === 3) {
    suitableRange = 3
  }
  let params = {
    oid,
    companyId,
    suitableRange,
    suitableRangeTravelId,
    suitableRangeStoreId,
    lineName,
    lineDescribe,
    individualLineTicketBos,
    individualLineHotelBos,
    individualLineCateringBos,
    individualLinePriceBos,
    enableSatus
  }
  return params
}
const submitLine = () => {
  const params = getParams()
  if (state.isAdd) { // 新增
    if (state.rolesLevel === 1) { // 无需审核
      api.createIndividualLineAdmin(params).then((res: any) => {
        message.success('创建线路成功！')
        cancel()
        onSearch()
      }).catch((err: Error) => {
        message.error('出错了！')
      })
    } else if ([2, 3].includes(state.rolesLevel)) { // 需审核 
      api.createIndividualLine(params).then((res: any) => {
        message.success('创建线路成功！请耐心等待审核结果')
        cancel()
        onAuditSearch()
      }).catch((err: Error) => {
        message.error('出错了！')
      })
    }
  } else { // 编辑
    if (state.rolesLevel === 1) { // 无需审核
      api.editIndividualLineAdmin(params).then((res: any) => {
        message.success('编辑线路成功！')
        cancel()
        onSearch()
      }).catch((err: Error) => {
        message.error('出错了！')
      })
    } else if ([2, 3].includes(state.rolesLevel)) { // 需审核 
      api.editIndividualLine(params).then((res: any) => {
        message.success('修改线路成功！请耐心等待审核结果')
        cancel()
        onSearch()
        onAuditSearch()
      }).catch((err: Error) => {
        message.error('出错了！')
      })
    }
  }
}
const cancel = () => {
  lineRef.value.resetFields()
  form.suitableRangeTravelId = undefined
  form.suitableRangeStoreId = undefined
  form.suitableRange = undefined
  form.TICKETSelected = [{
    day: 1,
    selectedList: [],
    key: Date.now(),
  }]
  form.CATERINGSelected = [{
    day: 1,
    selectedList: [],
    key: Date.now(),
  }]
  form.HOTELSelected = [{
    day: 1,
    selectedList: [],
    key: Date.now(),
  }]
  state.modalVisible = false
}
interface addInterface {
  row?: any
  handle: 'update' | 'add'
}
const addOrUpdate = ({ row, handle }: addInterface) => {
  modalVisible.value = true
  if (handle === 'add') {
    state.title = '创建散客拼团线路'
    state.isAdd = true
  } else if (handle === 'update') {
    state.title = '编辑散客拼团线路'
    state.isAdd = false
    getEditDetails(row.oid)
  }
}
const groupBy = (objectArray: any[], property: string) => {
  return objectArray.reduce(function (acc, obj) {
    let key = obj[property]
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(obj)
    return acc
  }, {})
}
const getData = (obj: any, property: string) => {
  if (Object.prototype.toString.call(obj) === '[object Object]') {
    let arr: any[] = []
    const keys = Object.keys(obj)
    keys.forEach((item: any, index: number) => {
      const element = obj[item];
      arr[index] = {
        day: item,
        key: Date.now(),
        selectedList: []
      }
      element.forEach((citem: any, cindex: number) => {
        arr[index].selectedList.push(citem[property])
      })
    })
    return arr
  } else {
    return []
  }
}
const getEditDetails = async (oid: number) => {
  const res = await api.findIndividualLineById(oid)
  if (res) {
    const {
      oid,
      lineName,
      lineDescribe,
      suitableRange,
      suitableRangeTravelId,
      suitableRangeStoreId,
      individualLineCateringBos,
      individualLineHotelBos,
      individualLineTicketBos,
      individualLinePriceBos
    } = res
    form.CATERINGSelected = getData(groupBy(individualLineCateringBos, 'day'), 'cateringCompanyId')
    form.TICKETSelected = getData(groupBy(individualLineTicketBos, 'day'), 'ticketCompanyId')
    form.HOTELSelected = getData(groupBy(individualLineHotelBos, 'day'), 'hotelCompanyId')
    individualLinePriceBos?.forEach((item: any) => {
      form[item.priceTypeCode] = item.priceAmount
    })
    form.oid = oid
    form.lineName = lineName
    form.lineDescribe = lineDescribe
    form.suitableRange = suitableRange
    form.suitableRangeTravelId = suitableRangeTravelId
    form.suitableRangeStoreId = suitableRangeStoreId
  }
}
const auditStore = async (record: any) => {
  failForm.uuid = record.uuid
  failForm.roleId = record.roleId
  failForm.businessType = record.auditBusinessType
  if (record.auditStatus === 0) {
    failForm.auditTypeCode = 21 // 21:创建线路,22:修改线路信息
    isRegiste.value = true
    state.auditVisible = true
    detailsForm.value = await getDetails(record.oid)
  } else if (record.auditStatus === 1 && record.informationAuditStatus === 1) {
    failForm.auditTypeCode = 22 // 21:创建线路,22:修改线路信息
    isRegiste.value = false
    state.changeVisible = true
    detailsForm.value.updateTime = record.updateTime
    detailsForm.value.creatorName = record.creatorName
    getChangeInfo(record.oid)
  }
}
const setString = (normalArr: any, key: string) => {
  const obj = groupBy(normalArr, 'day')
  const keys = Object.keys(obj)
  let resStr = ''
  keys.forEach((item: any) => {
    const day = `第${item}天`
    let nameStr = ''
    obj[item].forEach((citem: any, index: number) => {
      nameStr += `${citem[key]}${(obj[item].length - 1) === index ? '' : '、'}`
    })
    resStr += `${day}\n${nameStr}\n`
  })
  return resStr
}
const setValue = (res: any) => {
  // 餐厅
  if (res.individualLineCateringBos) {
    res.cateringCompanysName = setString(res.individualLineCateringBos, 'cateringCompanyName')
  } else {
    res.cateringCompanysName = '无'
  }
  // 酒店
  if (res.individualLineHotelBos) {
    res.hotelCompanysName = setString(res.individualLineHotelBos, 'hotelCompanyName')
  } else {
    res.hotelCompanysName = '无'
  }
  // 景区
  if (res.individualLineTicketBos) {
    res.ticketCompanysName = setString(res.individualLineTicketBos, 'ticketCompanyName')
  } else {
    res.ticketCompanysName = '无'
  }
  // 一口价
  if (res.individualLinePriceBos) {
    let strArr = ''
    res.individualLinePriceBos.forEach((item: any, index: number) => {
      strArr += `${item.priceTypeName}价：${item.priceAmount}元${(res.individualLinePriceBos.length - 1) === index ? '' : '、'}`
    })
    res.priceTypesName = strArr
  } else {
    res.priceTypesName = '无'
  }
}
const getChangeInfo = async (oid: string | number) => {
  const res = await api.auditIndividualLineInformationContrast(oid)
  const newList = res?.new
  const oldList = res?.old
  const keyList = [
    'lineName',
    'lineDescribe',
    'enableSatusName',
    'cateringCompanysName',
    'hotelCompanysName',
    'priceTypesName',
    'ticketCompanysName'
  ]
  setValue(newList)
  setValue(oldList)
  keyList.forEach((key: string) => {
    if (newList[key] != oldList[key]) {
      newArrList.value[key] = newList[key]
      oldArrList.value[key] = oldList[key]
      changeKeys.value.push(key)
    }
  })
}
const addSelectedItem = (domainsList: ticketType[]) => {
  domainsList.push({
    day: domainsList.length + 1,
    selectedList: [],
    key: Date.now(),
  });
};
const removeSelectedItem = (item: ticketType, domainsList: ticketType[]) => {
  let index = domainsList.indexOf(item);
  if (index !== -1) {
    domainsList.splice(index, 1);
  }
};
const addDomain = (domainsList: Domain[]) => {
  domainsList.push({
    value: undefined,
    business: undefined,
    key: Date.now(),
  });
};
const addSight = (sightsList: Sights[]) => {
  sightsList.push({
    price: undefined,
    id: undefined,
    key: Date.now(),
  });
};
const getUserInfo = () => {
  let userInfo: any = window.localStorage.getItem('userInfo');
  userInfo = JSON.parse(userInfo);
  const { oid, sysCompany, sysRoles } = userInfo
  state.userID = oid
  form.companyId = sysCompany.oid
  const roleCode = sysRoles.map((item: any) => {
    // 文旅局超管、一卡通超管、旅行社超管、中心操作员、门店操作员
    if (['CULTURE_BUREAU_SUPER_ADMIN', 'PLATFORM_SUPER_ADMIN', 'TRAVEL_SUPER_ADMIN', 'CENTER_OPERATOR', 'OUTLET_OPERATOR'].includes(item.roleCode)) {
      return item.roleCode
    }
  })
  if (roleCode.includes('CULTURE_BUREAU_SUPER_ADMIN') || roleCode.includes('PLATFORM_SUPER_ADMIN')) {
    // 文旅局超管、一卡通超管
    state.rolesLevel = 1
  } else if (roleCode.includes('TRAVEL_SUPER_ADMIN') || roleCode.includes('CENTER_OPERATOR')) {
    // 旅行社超管、中心操作员
    state.rolesLevel = 2
    state.tableData.param.permissionCode = 1
    state.tableData1.param.permissionCode = 1
  } else if (roleCode.includes('OUTLET_OPERATOR')) {
    // 门店操作员
    state.rolesLevel = 3
    state.tableData.param.permissionCode = 2
    state.tableData1.param.permissionCode = 2
  }
}
const getYKJ = async () => {
  let res = await api.dropDownQueryListChildByCodeValue('INDIVIDUAL_LINE_PRICE_CODE')
  if (res) {
    state.YKJList = res
  }
}
const getOptions = async () => {
  const resTRAVEL = await api.getCompanyByBusinessType('TRAVEL')
  const resTICKET = await api.getCompanyByBusinessType('TICKET')
  const resCATERING = await api.getCompanyByBusinessType('CATERING')
  const resHOTEL = await api.getCompanyByBusinessType('HOTEL')
  state.TICKETOptions = resTICKET
  state.CATERINGOptions = resCATERING
  state.HOTELOptions = resHOTEL
  state.TRAVELOptions = resTRAVEL
}
const getStoreList = async () => {
  if (form.suitableRangeTravelId && form.suitableRange === 3) {
    const res = await api.individualStoreListByCompanyId(form.suitableRangeTravelId)
    state.storeOptions = res?.map((item: { oid: string | number, storeName: string }) => {
      return {
        oid: item.oid,
        name: item.storeName
      }
    })
  } else {
    state.storeOptions = []
  }
}
/* const setOption = () => {
  sceneOption1.value.forEach(element => {
    element.disabled = false
  });
}
setOption()
const sightsChange = () => {
  let selected: any[] = []
  form.sights.forEach(item => {
    if (item.id !== undefined) {
      selected.push(item.id)
    }
  })
  if (selected.toString()) {
    if (selected.includes(3)) {
      sceneOption3.value.forEach(element => {
        element.disabled = true
      });
    } else {
      sceneOption3.value.forEach(element => {
        if (selected.includes(element.codeValue)) {
          element.disabled = true
        } else {
          if (element.codeValue === 3) {
            element.disabled = true
          } else {
            element.disabled = false
          }
        }
      });
    }
  } else {
    sceneOption3.value.forEach(element => {
      element.disabled = false
    });
  }
}
const sceneChange = (domainsList: Domain[], options: any[]) => {
  let selected: any[] = []
  selected = domainsList.map(item => {
    if (item.business !== undefined) {
      return item.value + '_' + item.business
    }
  })
  options.forEach(element => {
    if (selected.includes(element.markValue)) {
      element.disabled = true
    } else {
      element.disabled = false
    }
  });
}
const sceneDeselect = (val: number | string | undefined, options: any[]) => {
  if (val === undefined) return
  for (let i = 0, l = options.length; i < l; i++) {
    const element = options[i];
    if (element.codeValue === val) {
      options[i].disabled = false
      break
    }
  }
}
const removeDomain = (item: Domain, domainsList: Domain[], options: any[]) => {
  let index = domainsList.indexOf(item);
  if (index !== -1) {
    domainsList.splice(index, 1);
  }
  sceneChange(domainsList, options)
  // sceneDeselect(item.value, options)
};
const removeSights = (item: Sights, domainsList: Sights[], options: any[]) => {
  let index = domainsList.indexOf(item);
  if (index !== -1) {
    domainsList.splice(index, 1);
  }
  sightsChange()
}; */
onMounted(async () => {
  getUserInfo()
  await onSearch()
  await onAuditSearch()
  await getYKJ()
  await getOptions()
})
</script>

<style scoped lang="scss">
:deep(.ant-tabs-tab + .ant-tabs-tab) {
  margin: 0 0 0 60px;
}

.tabs_box {
  position: relative;
  padding: 20px;

  .rebadge {
    position: absolute;
    left: 165px;
    top: 25px;
  }
}

.table-area {
  padding: unset;
}

.buttom_box {
  padding: 0 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}

.dynamic-delete-button:hover {
  color: #777;
}

.mr8 {
  margin-right: 8px;
}

.table_box {
  max-height: 60vh;
  padding: 1px 0;
  overflow: auto;

  .row {
    width: 100%;
    font-size: 14px;
    font-family: Microsoft YaHei UI;
    font-weight: 400;
    color: #1E2226;
    border: 1px solid #E9E9E9;
  }

  .change_table {
    width: 100%;

    .key,
    .key_hd {
      width: 150px;
    }

    .key_hd {
      background: rgba(245, 247, 250, 0.39);
    }

    .value {
      min-width: 300px;
    }
  }

  .info_table {
    width: 100%;

    .key {
      width: 150px;
      background: rgba(245, 247, 250, 0.39);
    }
  }
}
</style>