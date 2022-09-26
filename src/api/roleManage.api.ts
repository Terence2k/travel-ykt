import { request, commonPath } from '@/utils/index';

// 角色列表
export async function roleList(data: any) {
	return request({
		url: `${commonPath}/customer-service/public/api/sys-role/list`,
		method: 'post',
		data,
		showLoading: true
	});
}

// 新增角色
export async function addRole(data: any) {
	return request({
		url: `${commonPath}/customer-service/public/api/sys-role/save`,
		method: 'post',
		data,
		showLoading: true
	});
}

// 编辑角色
export async function editRole(data: any) {
	return request({
		url: `${commonPath}/customer-service/public/api/sys-role/edit`,
		method: 'post',
		data,
		showLoading: true
	});
}

// 角色详情
export async function roleDetail(id: number) {
	return request({
		url: `${commonPath}/customer-service/public/api/sys-role/detail/${id}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
		method: 'get',
		showLoading: false
	});
}

// 业态范围
export async function businessType() {
	return request({
		url: `${commonPath}/customer-service/public/api/dictionary/dropDownQueryListChild?pid=115`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
		method: 'post',
		showLoading: false
	});
}

// 编辑角色状态
export async function editRoleStatus(data: any) {
	return request({
		url: `${commonPath}/customer-service/public/api/sys-role/editStatus`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
		method: 'post',
    data,
		showLoading: true
	});
}