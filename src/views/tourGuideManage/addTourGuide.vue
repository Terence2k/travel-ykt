<template>
  <div class="form_box">
    <div class="title">
      <span>
        选择导游
      </span>
      <span class="close_btn" @click="back">
        <close-outlined />
      </span>
    </div>
    <div class="form_body">
      
      <a-form ref="formRef" :model="form" rules="formRules" name="basic" autocomplete="off" labelAlign="left"
        :label-col="{ span: 4 }" :wrapper-col="{ span: 24 }">
        <a-form-item label="姓名" name="guideName">
          <a-auto-complete
            v-model:value="state.tableData.guideName"
            :options="state.tableData.options"
            style="width: 300px"
            @select="onSelect"
            @search="onSearch"
        />
        </a-form-item>
        <a-form-item label="导游证号" name="guideCertificateNo">
          {{ state.tableData.data[0]?.guideCertificateNo }}
        </a-form-item>
        <a-form-item label="身份证号" name="certificateNo">
          {{state.tableData.data[0]?.certificateNo}}
        </a-form-item>
        <a-form-item label="导游电话" name="phone">
          {{state.tableData.data[0]?.phone}}
        </a-form-item>
        <a-form-item label="导游星级" name="guideLevelName">
          {{state.tableData.data[0]?.guideLevelName}}
        </a-form-item>
        <a-form-item label="签约附件" name="signAttachmentList">
          <Upload v-model="state.signAttachmentList" />
        </a-form-item>
      </a-form>
    </div>
    <div class="btn_box">
      <a-button type="primary" @click="submit" style="margin-right:20px" :loading="loading">发送委派邀请</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { CloseOutlined } from '@ant-design/icons-vue';
import api from '@/api';
import Upload from '@/components/common/imageWrapper.vue';
import { message } from 'ant-design-vue';
const router = useRouter();
const route = useRoute();
interface MockVal {
  value: string;
}
const state = reactive({
  tableData: {
    options:[]as any,
    data:[]as any,
    guideName:'',
    total: 0,
    loading: false,
    list:[]as any,
    num:0
  },
  signAttachmentList:''
 
});
const handleChange=()=>{

}
const onSearch=()=>{
  if(state.tableData.guideName)
  {
    api.queryNoSignGuideList({guideName:state.tableData.guideName}).then((res:any)=>{
    state.tableData.list=res
    state.tableData.options=res.map((res:any,index:number)=>{
      return {
        value:res.guideName +' , '+ res.guideCertificateNo,
        row:res
      }
    })
  })
  }else{
    state.tableData.options='';
    state.tableData.data='';
  }
  
}
const onSelect=(value:any)=>{
  let guideCertificateNo=value.split(',')
  state.tableData.guideName=guideCertificateNo[0]
  state.tableData.data=state.tableData.list.filter((i:any)=>i.guideCertificateNo=guideCertificateNo[1])
}
const back = () => {
  router.push({
    name: 'tourGuideList'
  })
}
const form = reactive({})
const loading = ref(false)
const submit = () => {
  if(!state.tableData.guideName)
  {
    message.error('请先选择导游')
    return false
  }
  let data={
    guideId:state.tableData.data[0]?.oid,
    signStartDate:state.tableData.data[0]?.signStartDate,
    signEndDate:state.tableData.data[0]?.signEndDate,
    // signStartDate:'2022-12-01 00:00:00',
    // signEndDate:'2022-12-12 00:00:00',
    signAttachmentList:state.signAttachmentList.split(',')
  }
  // let signAttachmentList=state.signAttachmentList.split(',')
  // console.log(signAttachmentList,'signAttachmentList')
  api.sendSignInvitation(data).then((res:any)=>{
      message.success('发送委派成功')
      router.push({ path: '/travel/tourGuideManage/tourGuideList' });
  })
}

</script>

<style scoped lang="scss">
.form_box {
  position: relative;
  height: 100%;
  width: 100%;
  padding: 24px 20px 0;

  .title {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    font-family: Microsoft YaHei UI;
    font-weight: bold;
    color: #1E2226;
    padding-bottom: 12px;
    border-bottom: 1px solid #F1F2F5;

    .close_btn {
      cursor: pointer;
    }
  }

  .form_body {
    margin-top: 20px;
    width: 60%;
  }

  .btn_box {
    position: absolute;
    bottom: 20px;
  }
}
</style>