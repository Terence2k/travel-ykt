import { request, commonPath } from '@/utils/index';
const commonPart = `${commonPath}/travel-agency-service/public/api/guide/`

// 导游库查询导游列表 
export function guideRepository(data: any) {
  return request({
    url: `${commonPart}guideRepository/list`,
    method: 'post',
    data,
    showLoading: true
  });
}

// 导游库查询导游列表 
export function editGuideStatus(data: any) {
  return request({
    url: `${commonPart}editStatus?oid=${data.oid}&status=${data.status}`,
    method: 'post',
    showLoading: true
  });
}

// 导游库管理-一键同步导游 
export function synchronizeYjgGuide() {
  return request({
    url: `${commonPart}synchronizeYjgGuide`,
    method: 'put',
    showLoading: false,
    timeout: 0
  });
}