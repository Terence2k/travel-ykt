import type { FormInstance } from 'ant-design-vue';

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
// 验证是否是[0-100]的小数
export function isBtnZeroToHundred(rule: any, value: any, callback: any) {
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
// 验证0-1的数，保留以为小数点
export function isOnedecimalpoint(
	rule: any,
	value: string,
	callback: (error?: Error) => void
  ): void {
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
