import { request, commonPath } from '@/utils/index';

export const commonApi = {
    getDictionary(data: any) {
        return request({
            url: `${commonPath}/customer-service/public/api/dictionary/listChild`,
            method: 'post',
            data,
            showLoading: true
        });
    }
}