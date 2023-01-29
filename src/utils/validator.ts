import type { FormInstance } from 'ant-design-vue';
import { Rule } from 'ant-design-vue/es/form';
export const phoneReg = /^1[3456789]\d{9}$/;
// 验证手机号
export async function validPhone(_rule: Rule, value: string) {
	// const reg = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/
	// const reg = /^1[3456789]\d{9}$/
	if (value === '') {
		return Promise.reject('请输入手机号');
	} else if (!phoneReg.test(value)) {
		return Promise.reject('请输入正确的手机号');
	} else {
		return Promise.resolve();
	}
}

// 验证是否整数
export function isIntegerNotMust(rule: any, value: any, callback: any) {
	if (!Number(value)) {
		// callback(new Error('请输入正整数'));
		return Promise.reject('请输入正整数');
	} else {
		const re = /^[0-9]*[1-9][0-9]*$/;
		const rsCheck = re.test(value);
		if (!rsCheck) {
			// callback(new Error('请输入正整数'));
			return Promise.reject('请输入正整数');
		} else {
			// callback();
			return Promise.resolve();
		}
	}
}

//验证是否为正整数
export function isPositiveInteger(rule: any, value: any, callback: any) {
	if (!Number(value)) {
		// callback(new Error('请输入正整数'));
		return Promise.reject('请输入正整数');
	} else {
		const re = /^\+?[1-9][0-9]*$/;
		const rsCheck = re.test(value);
		if (!rsCheck) {
			// callback(new Error('请输入正整数'));
			return Promise.reject('请输入正整数');
		} else {
			// callback();
			return Promise.resolve();
		}
	}
}
// 验证是否是[0-100]的整数
export function isBtnZeroToHundred(rule: any, value: any, callback: any) {
	if (value && ''.includes.call(value, '.')) {
		return Promise.reject('请输入正整形的数字');
	}
	if (!value) {
		return Promise.reject('输入不可为空');
	}
	if (!Number(value)) {
		return Promise.reject('请输入[1,100]之间的数字');
	} else {
		if (value < 0 || value > 100) {
			return Promise.reject('请输入[1,100]之间的数字');
		} else {
			return Promise.resolve();
		}
	}
	// setTimeout(() => {

	// }, 100);
}
export function isTwoDecimalPlaces(rule: any, value: any, callback: any) {
	const reg = /^\d+.?\d{0,2}$/;
	if (!value) {
		return Promise.reject(new Error('请输入价格'));
	} else if (!Number(value)) {
		return Promise.reject(new Error('请输入数字值'));
	} else {
		if (!reg.test(value)) {
			return Promise.reject(new Error('小数点后最多只能输入两位'));
		} else {
			return Promise.resolve();
		}
	}
}

// 验证是否是大于等于0的数
export function isOneHundred(rule: any, value: any, callback: any) {
	if (!value && value != 0) {
		return Promise.reject('输入不可为空');
	}
	console.log(parseFloat(value));
	if (isNaN(parseFloat(value))) {
		return Promise.reject('请输入数字');
	} else {
		if (value < 0) {
			return Promise.reject('请输入大于等于0的数字');
		} else {
			return Promise.resolve();
		}
	}
	// setTimeout(() => {

	// }, 100);
}
// 验证0-1的数，保留以为小数点
export function isOnedecimalpoint(rule: any, value: string, callback: (error?: Error) => void): void {
	if (!value) {
		callback(new Error('请输入0-0.99的中的任意数值,允许保留两位小数点'));
	} else {
		const re = /^[0-0.99]+(\.[0-9]{1,2})?$/;
		const rsCheck = re.test(value);
		if (!rsCheck) {
			callback(new Error('请输入0-0.99的中的任意数值,允许保留两位小数点'));
		} else {
			callback();
		}
	}
}
export function validateRules(rules: any, data: any, key?: string) {
	let rulesRef: any = {};
	if (key) {
		rulesRef[key] = rules;
	} else {
		for (let k in data) {
			rulesRef[k] = rules;
		}
	}
	return rulesRef;
}

export async function validateFields(fromRef: FormInstance) {
	let flag = false;
	try {
		const values = await fromRef.validateFields();
		// console.log('Success:', values);
		flag = true;
	} catch (errorInfo) {
		// console.log('Failed:', errorInfo);
	}
	return flag;
}
