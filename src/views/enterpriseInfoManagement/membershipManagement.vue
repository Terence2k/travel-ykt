<template>
  <div class="content_box">
    <div class="check_box">
      <div class="title">
        <span>
          <span v-if="currentState === 0">当前暂未入会，可发起入会申请：</span>
          <span v-else-if="currentState === 1">当前入会申请已提交，请等待审核：</span>
          <span v-else-if="currentState === 2">当前已入会，挂靠集团信息如下：</span>
          <span v-else-if="[-1,3].includes(currentState)">当前入会申请已被驳回，驳回时间：{{ form.updateTime }}。可修改后重新发起申请。</span>
          <span v-else-if="currentState === 4">当前退会申请已提交，请等待审核：</span>
          <span v-else-if="currentState === 5">当前退会申请被驳回，驳回时间：{{ form.updateTime }}。可与当前挂靠集团沟通后重新发起退会申请。</span>
          <span v-else-if="currentState === 6">当前退会申请已通过，通过时间：{{ form.updateTime }}。可重新发起一个入会申请。</span>
        </span>
        <span class="close_btn" @click="back">
          <close-outlined />
        </span>
      </div>
      <div class="form_body">
        <div class="history" v-if="currentState === 2">
          查看更早的入会历史
        </div>
        <div class="form_box">
          <a-form ref="formRef" name="reset-password" :model="form" :rules="formRules" v-bind="layout">
            <a-form-item name="groupId" :label="groupLabel">
              <a-select v-model:value="form.groupId" placeholder="请选择集团" :disabled="formDisable">
                <a-select-option v-for="item in businessOption" :value="item.value" :key="item.value">{{
                item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item name="applicationRemarks" :label="applicationRemarksLabel" v-if="currentState !== 2">
              <a-textarea v-model:value="form.applicationRemarks" placeholder="请输入申请理由" :rows="2"
                :disabled="formDisable">
              </a-textarea>
            </a-form-item>
            <a-form-item name="createTime" label="入会申请时间" v-if="currentState === 2">
              <a-input v-model:value="form.createTime" disabled>
              </a-input>
            </a-form-item>
            <a-form-item name="updateTime" label="入会通过时间" v-if="currentState === 2">
              <a-input v-model:value="form.updateTime" disabled>
              </a-input>
            </a-form-item>
            <a-form-item name="contactName" label="申请联系人">
              <a-input v-model:value="form.contactName" placeholder="请输入申请联系人" disabled>
              </a-input>
            </a-form-item>
            <a-form-item name="phone" label="申请联系人电话">
              <a-input v-model:value="form.phone" placeholder="请输入申请联系人电话" disabled>
              </a-input>
            </a-form-item>
            <a-form-item name="groupContact" label="本社联系人" v-if="currentState === 2">
              <a-input v-model:value="form.groupContact" placeholder="请输入本社联系人" disabled>
              </a-input>
            </a-form-item>
            <a-form-item name="groupPhone" label="本社联系人电话" v-if="currentState === 2">
              <a-input v-model:value="form.groupPhone" placeholder="请输入本社联系人电话" disabled>
              </a-input>
            </a-form-item>
            <a-form-item name="isChecked" label="" :colon="false">
              <a-checkbox-group v-model:value="form.isChecked" :disabled="formDisable">
                <a-checkbox value="1" name="type">我已阅读并同意 <span class="agreement"
                    @click.prevent="agreementClick">《xxxxxxxxxx协议》</span>
                </a-checkbox>
              </a-checkbox-group>
            </a-form-item>
            <a-form-item label="  " :colon="false">
              <a-button type="primary" @click="submit" style="margin-right:20px" :loading="loading"
                v-if="[-1,0].includes(currentState)">提交审核</a-button>
              <a-button type="primary" @click="withdraw" style="margin-right:20px" v-else-if="currentState === 2">申请退会
              </a-button>
              <a-button type="primary" @click="rejectJoin" style="margin-right:20px" v-else-if="currentState === 3">
                重新填写入会申请
              </a-button>
              <a-button type="primary" @click="withdraw" style="margin-right:20px" v-else-if="currentState === 5">
                重新填写退会申请
              </a-button>
              <a-button type="primary" @click="reSubmit" style="margin-right:20px" v-else-if="currentState === 6">
                重新填写入会申请
              </a-button>
            </a-form-item>
          </a-form>
          <!-- <div class="table_box" v-if="currentState === 3">
            <table class="_table" cellpadding="16px" border="1">
              <tr class="row">
                <td class="key">已挂靠集团</td>
                <td class="value"></td>
              </tr>
              <tr class="row">
                <td class="key">入会申请时间</td>
                <td class="value"></td>
              </tr>
              <tr class="row">
                <td class="key">入会通过时间</td>
                <td class="value"></td>
              </tr>
              <tr class="row">
                <td class="key">集团联系人</td>
                <td class="value"></td>
              </tr>
              <tr class="row">
                <td class="key">集团联系人电话</td>
                <td class="value"></td>
              </tr>
              <tr class="row">
                <td class="key">本社联系人</td>
                <td class="value"></td>
              </tr>
              <tr class="row">
                <td class="key">本社联系人电话</td>
                <td class="value"></td>
              </tr>
            </table>
            <div class="history" style="text-align: left">
              合作不愉快？申请退会
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
  <CommonModal title="申请退会" v-model:visible="widthdrawVisible" @close="widthdrawClose" @cancel="widthdrawClose"
    @conform="widthdrawConform" :conform-text="'确定'">
    <a-form ref="widthdrawFormRef" :model="widthdrawForm" :rules="widthdrawFormRules" name="fail-form"
      autocomplete="off" labelAlign="left" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
      <a-form-item name="applicationRemarks" label="退会理由">
        <a-textarea v-model:value="widthdrawForm.applicationRemarks" placeholder="请输入退会理由" :rows="2">
        </a-textarea>
      </a-form-item>
    </a-form>
  </CommonModal>
</template>

<script setup lang="ts">
import CommonModal from '@/views/baseInfoManage/dictionary/components/CommonModal.vue';
import { useRouter, useRoute } from 'vue-router';
import { CloseOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import api from '@/api';
export interface Props {
  id?: number
  phone?: string
  contactName?: string
}
type formType = {
  travelId?: number,
  groupId?: number,
  applicationRemarks?: string,
  contactName?: string,
  phone?: string,
  groupContact?: string,
  groupPhone?: string,
  isChecked?: any[],
  createTime?: string,
  updateTime?: string,
}
const form = reactive<formType>({
  isChecked: []
})
const widthdrawForm = reactive({
  applicationRemarks: '',
  oid: ''
})
const props = defineProps<Props>()
const formRef = ref()
const widthdrawFormRef = ref()
const router = useRouter();
const route = useRoute();
const back = () => {
  router.push({
    name: 'travelEnterpriseInfo'
  })
}
const businessOption = ref([])
const rules = {
  groupId: [{ required: true, trigger: 'blur', message: '请选择集团' }],
  applicationRemarks: [{ required: true, trigger: 'blur', message: '请输入申请理由' }],
  contactName: [{ required: true, trigger: 'blur', message: '请输入申请联系人' }],
  phone: [{ required: true, trigger: 'blur', message: '请输入申请联系人电话' }],
  isChecked: [{ required: true, type: 'array', message: '请勾选协议' }],
}
const widthdrawFormRules = {
  applicationRemarks: [{ required: true, trigger: 'blur', message: '请输入退会理由' }],
}
const loading = ref(false)
let state = reactive({
  currentState: 0,
  widthdrawVisible: false
})
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const { currentState, widthdrawVisible } = toRefs(state)
const formRules = computed(() => {
  if (currentState.value === 0) {
    return rules
  } else {
    return {}
  }
})
/* （1.入会待审核2.入会通过 3.入会拒绝 4 .退会待审核  5.退会拒绝  6.退会通过） */
const formDisable = computed(() => {
  let val
  switch (currentState.value) {
    case -1:
      val = false;
      break;
    case 0:
      val = false;
      form.isChecked = []
      break;
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
      val = true
      form.isChecked = ['1']
      break;
  }
  return val
})
const groupLabel = computed(() => {
  let val
  switch (currentState.value) {
    case -1:
    case 0:
      val = '选择集团';
      break;
    case 1:
    case 3:
      val = '已选择集团'
      break;
    case 2:
    case 4:
    case 5:
      val = '已挂靠集团'
      break;
    case 6:
      val = '已退会集团'
      break;
  }
  return val
})
const applicationRemarksLabel = computed(() => {
  let val
  switch (currentState.value) {
    case -1:
    case 0:
      val = '申请理由';
      break;
    case 1:
    case 3:
    case 4:
      val = '已填申请理由'
      break;
    case 6:
    case 5:
      val = '退会理由'
      break;
  }
  return val
})
const agreementClick = () => { }
const submit = () => {
  formRef.value.validateFields().then(async () => {
    const { travelId, groupId, applicationRemarks } = toRaw(form)
    let res = await api.travelApplyJoin({ travelId, groupId, applicationRemarks })
    if (res) {
      message.success('提交入会申请成功，请耐心等待审核结果！')
      getTravelInfo()
    } else {
      message.error('提交入会申请失败！')
    }
  }).catch((error: Error) => {
    console.log(error);
  })
}
const withdraw = () => {
  widthdrawVisible.value = true
}
const reSubmit = () => {
  currentState.value = 0
  form.groupId = undefined
  form.applicationRemarks = ''
}
const rejectJoin = () => {
  currentState.value = -1
}
const widthdrawConform = () => {
  widthdrawFormRef.value.validateFields().then(async () => {
    let res = await api.travelRetreat(toRaw(widthdrawForm))
    if (res) {
      message.success('提交退会申请成功，请耐心等待审核结果！')
      getTravelInfo()
      widthdrawClose()
    } else {
      message.error('提交退会申请失败！')
    }
  }).catch((err: Error) => { })
}
const widthdrawClose = () => {
  widthdrawFormRef.value.resetFields()
  widthdrawVisible.value = false
}
const getTravelInfo = async () => {
  let {
    applicationRemarks,
    groupId,
    travelContact,
    travelPhone,
    groupContact,
    groupPhone,
    oid,
    state,
    createTime,
    updateTime
  } = await api.findTravelIdByJoinData(props.id)
  if (state) {
    form.applicationRemarks = applicationRemarks
    form.groupId = groupId
    form.phone = travelPhone
    form.contactName = travelContact
    form.groupContact = groupContact
    form.groupPhone = groupPhone
    form.createTime = createTime
    form.updateTime = updateTime
    currentState.value = state
    widthdrawForm.oid = oid
  }
}
const findGroup = async () => {
  let res = await api.findGroup()
  businessOption.value = res.map((item: any) => {
    return {
      name: item.name,
      value: item.oid
    }
  })
  console.log(res);
}
const init = () => {
  form.contactName = JSON.parse(decodeURIComponent(props.contactName))
  form.phone = JSON.parse(decodeURIComponent(props.phone))
  form.travelId = JSON.parse(decodeURIComponent(props.id))
}
onMounted(() => {
  getTravelInfo()
  findGroup()
  init()
})
</script>

<style scoped lang="scss">
.content_box {
  position: relative;
  width: 100%;
  height: 100%;

  .check_box {
    width: 100%;
    padding: 24px 20px;

    .title {
      display: flex;
      justify-content: space-between;
      font-size: 16px;
      font-family: Microsoft YaHei UI;
      // font-weight: bold;
      color: #1E2226;
      padding-bottom: 12px;
      border-bottom: 1px solid #F1F2F5;

      .close_btn {
        cursor: pointer;
      }
    }

    .form_body {
      width: 100%;
      height: 100%;

      .history,
      .agreement {
        width: 100%;
        margin-top: 10px;
        text-align: right;
        cursor: pointer;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #4197EF;
      }

      .form_box {
        padding-top: 20px;
        width: 60%;
      }

      .table_box {
        max-height: 80vh;
        padding: 1px 0;
        overflow: auto;

        ._table {
          width: 100%;

          .row {
            width: 100%;
            font-size: 14px;
            font-family: Microsoft YaHei UI;
            font-weight: 400;
            color: #1E2226;
            border: 1px solid #E9E9E9;

            .key {
              width: 150px;
              background: rgba(245, 247, 250, 0.39);
            }

            .value {
              min-width: 300px;
            }
          }
        }
      }
    }
  }
}
</style>