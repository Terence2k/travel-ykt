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