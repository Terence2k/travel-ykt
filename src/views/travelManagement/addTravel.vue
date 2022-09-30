<template>
  <div class="trave-contaner">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane 
        v-for="(item, index) in pages" 
        :key="index" 
        :tab="item.label">
        <component @onSuccess="save" :onCheck="check" :is="item.name"></component>
      </a-tab-pane>
    </a-tabs>
		<div class="footer">
      <a-button type="primary" @click="check = !check">保存</a-button>
      <a-button type="primary">发团</a-button>
		</div>
  </div>
</template>
<script lang="ts" setup>
import baseInfo from './baseInfo/baseInfo.vue';
import guideInfo from './guideInfo/guideInfo.vue';
import touristInfo from './touristInfo/touristInfo.vue';
import traveInfo from './traveInfo/traveInfo.vue';
import trafficInfo from './trafficInfo/trafficInfo.vue';
import fileInfo from './fileInfo/fileInfo.vue';
import { debounce } from 'lodash';
import api from '@/api';
import { message } from 'ant-design-vue';
  const activeKey = ref(0);
  const check = ref(false)
  const pages = [
    {
      name: baseInfo,
      label: '基本信息管理'
    },
    {
      name: guideInfo,
      label: '导游信息'
    },
    {
      name: touristInfo,
      label: '游客信息'
    },
    {
      name: trafficInfo,
      label: '交通信息'
    },
    {
      name: traveInfo,
      label: '行程信息'
    },
    {
      name: fileInfo,
      label: '附件上传'
    }
  ]
  let rulesPass = reactive<{[k:string]:any}>([])
  let obj = reactive({
    data: {}
  })
  const save = (e: any) => {
    rulesPass.push(e)
    for (let i = 0; i < rulesPass.length; i++) {
      obj.data = {
        ...obj.data,
        ...rulesPass[i]
      }
    }

  }
  const debounceFun = debounce((val) => {
    console.log(val)
    for (let k in val) {
      if (!val[k]) return
    }
    saveItinerary(val)
    } ,500)
  watch(obj, (newVal) => {
    debounceFun(newVal.data)
    
  })
  const saveItinerary = (val:any) => {
		return api.travelManagement.saveItinerary(
			{
				attachmentParam: val.attachmentParam || {
          "receptionAgreement": "http://test1.jpg",
          "rentCarContract": "http://test2.jpg",
          "travelContract": "http://test.jpg"
        },
				basicParam: val.basicParam || {},
				guideList: val.guideList || [],
				itineraryInfoParam: val.itineraryInfoParam || {},
				touristList: val.touristList || [],
				transportList: val.transportList || []
			}
		).then((res: any) => {
      message.success('新增成功');
    })
	}
</script>
<style lang="less" scoped>
  .trave-contaner {
    height: 100%;
    ::v-deep(.ant-tabs-nav) {
      padding: 16px 20px;
    }
    // ::v-deep(.ant-tabs-content-holder) {
    //   padding: 0 20px;
    // }
    
  }
  
	.footer {
		position: sticky;
		bottom: 0;
		line-height: 64px;
		width: 100%;
		border-top: 1px solid #F1F2F5;
    background-color: #fff;
    padding-left: 16px;
    z-index: 99;
		button:first-of-type {
			margin-right: 16px;
		}
	}
</style>