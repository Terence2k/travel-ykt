import { request, commonPath } from '@/utils/index';
const commonPart = `${commonPath}/customer-service/public/api/notice/`

// pc消息中心公告列表
export function messageCenterPcNoticeList(data: any) {
  return request({
    url: `${commonPart}messageCenterPcNoticeList`,
    method: 'post',
    data,
    showLoading: true
  });
}

// pc消息管理公告列表
export function messageManagePcNoticeList(data: any) {
  return request({
    url: `${commonPart}messageManagePcNoticeList`,
    method: 'post',
    data,
    showLoading: true
  });
}

// 撤销公告
export function revokeNotice(oid: any) {
  return request({
    url: `${commonPart}revokeNotice?oid=${oid}`,
    method: 'post',
    showLoading: true
  });
}

// 新增公告
export function addNotice(data: any) {
  return request({
    url: `${commonPart}addNotice`,
    method: 'post',
    data,
    showLoading: true
  });
}

// 编辑公告
export function editNotice(data: any) {
  return request({
    url: `${commonPart}editNotice`,
    method: 'post',
    data,
    showLoading: true
  });
}

// 审核公告
export function auditNotice(data: any) {
  return request({
    url: `${commonPart}auditNotice`,
    method: 'post',
    data,
    showLoading: true
  });
}

// 公告详情
export function findNoticeDetails(oid: any) {
  return request({
    url: `${commonPart}findNoticeDetails?oid=${oid}`,
    method: 'post',
    showLoading: true
  });
}