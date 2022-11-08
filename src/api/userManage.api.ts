import { request, commonPath } from '@/utils/index';

// 用户列表
export async function userList(data: any) {
	return request({
		url: `${commonPath}/customer-service/public/api/sys-user/list`,
		method: 'post',
		data,
		showLoading: true
	});
}

// 角色列表
export async function roleList(data: any) {
	return request({
		url: `${commonPath}/customer-service/public/api/sys-role/list`,
		method: 'post',
		data,
		showLoading: true
	});
}

// 新增用户
export async function addUser(data: any) {
	return request({
		url: `${commonPath}/customer-service/public/api/sys-user/save`,
		method: 'post',
		data,
		showLoading: true
	});
}

// 编辑用户
export async function editUser(data: any) {
	return request({
		url: `${commonPath}/customer-service/public/api/sys-user/edit`,
		method: 'post',
		data,
		showLoading: true
	});
}

// 用户详情
export async function userInfo(id: any) {
	return request({
		url: `${commonPath}/customer-service/public/api/sys-user/detail/${id}`,
		method: 'get',
		showLoading: true
	});
}

// 编辑用户状态
export async function editStatus(data: any) {
	return request({
		url: `${commonPath}/customer-service/public/api/sys-user/editStatus`,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		method: 'post',
		data,
		showLoading: true
	});
}

// 修改密码
export async function editPassWord(data: any) {
	return request({
		url: `${commonPath}/customer-service/public/api/sys-user/editPassWord?oid=${data.oid}&oldPassword=${data.oldPassword}&newPassword=${data.newPassword}`,
		method: 'post',
		showLoading: true
	});
}

// 根据业态查询企业
export async function getCompanyByBusinessType(businessType: string) {
	return request({
		url: `${commonPath}/customer-service/public/api/company/getCompanyByBusinessType?businessType=${businessType}`,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		method: 'post',
		showLoading: false
	});
}

// 检查账号
export async function checkAccount(data: any) {
  return request({
    url: `${commonPath}/customer-service/public/api/sys-user/checkAccount`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'put',
    data,
    showLoading: false
  });
}

// 管理员重置用户密码
export async function adminResetPassword(data: any) {
  return request({
    url: `${commonPath}/customer-service/public/api/sys-user/adminResetPassword`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'put',
    data,
    showLoading: true
  });
}