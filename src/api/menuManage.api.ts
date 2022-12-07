import { request, commonPath } from '@/utils/index';

// 菜单列表
export async function menuList(data: any) {
	return request({
		url: `${commonPath}/customer-service/public/api/menu/tree`,
		method: 'get',
		data,
		showLoading: true
	});
}

// 新增菜单
export async function addMenu(data: any) {
	return request({
		url: `${commonPath}/customer-service/public/api/menu/add`,
		method: 'post',
		data,
		showLoading: true
	});
}

// 编辑菜单
export async function editMenu(data: any) {
	return request({
		url: `${commonPath}/customer-service/public/api/menu/update`,
		method: 'post',
		data,
		showLoading: true
	});
}

// 删除菜单
export async function deleteMenu(id: number) {
	return request({
		url: `${commonPath}/customer-service/public/api/menu/delete/${id}`,
		method: 'delete',
		showLoading: true
	});
}

// 获取按钮编码
export async function getBtnCode() {
	return request({
		url: `${commonPath}/customer-service/public/api/dictionary/dropDownQueryListChild?pid=129`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
		method: 'post',
		showLoading: false
	});
}
// app菜单列表
export async function getSysAppMenus(data: any) {
	return request({
		url: `${commonPath}/customer-service/public/api/menu/getSysAppMenus`,
		method: 'POST',
		data,
		showLoading: true
	});
}
// app菜单编辑
export async function updateAppMenuVo(data: any) {
	return request({
		url: `${commonPath}/customer-service/public/api/menu/updateAppMenuVo`,
		method: 'POST',
		data,
		showLoading: true
	});
}
// app菜单详情
export async function getAppMenuDetail(id: number) {
	return request({
		url: `${commonPath}/customer-service/public/api/menu/getAppMenuDetail/${id}`,
		method: 'GET',
		showLoading: true
	});
}
// app菜单增加
export async function addAppMenuVo(data: any) {
	return request({
		url: `${commonPath}/customer-service/public/api/menu/addAppMenuVo`,
		method: 'POST',
		data,
		showLoading: true
	});
}
// 删除app菜单
export async function deleteAppMenu(id: number) {
	return request({
		url: `${commonPath}/customer-service/public/api/menu/delete/${id}`,
		method: 'delete',
		showLoading: true
	});
}
