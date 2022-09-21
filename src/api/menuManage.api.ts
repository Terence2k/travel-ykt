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