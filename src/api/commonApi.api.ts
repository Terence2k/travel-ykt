import { request, commonPath } from '@/utils/index';

export const commonApi = {
	getDictionary(data: any) {
		return request({
			url: `${commonPath}/customer-service/public/api/dictionary/listChild`,
			method: 'post',
			data,
			showLoading: true,
		});
	},
	getTeamTypeList(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/team/downTeamType`,
			method: 'post',
			data,
			showLoading: true,
		});
	},
	getCityList(data: any) {
		return request({
			url: `${commonPath}/customer-service/public/api/area/list/${data}`,
			method: 'get',
			showLoading: false,
		});
	},
	getCodeValue(data: any) {
		return request({
			url: `${commonPath}/customer-service/public/api/dictionary/dropDownQueryListChildByCodeValue?codeValue=${data.codeValue}`,
			method: 'post',
			showLoading: false,
		});
	},
	getItem(data: any) {
		return request({
			url: `${commonPath}/travel-agency-service/public/api/team/getItem`,
			method: 'post',
			showLoading: false,
		});
	},
	getHotelStarList(data: any) {
		return request({
			url: `${commonPath}/hotel-service/public/api/hotel-rated/list`,
			method: 'get',
			data,
			showLoading: false,
		});
	},
	getVerifyListType(key: string) {
		return request({
			url: `${commonPath}/customer-service/private/api/dictionary/selectByCodeValueList?codeValue=${key}`,
			method: 'post',
			showLoading: false,
		});
	},
};
