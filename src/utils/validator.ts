// 验证是否整数
export function isIntegerNotMust(rule: any, value: any, callback: any) {
	if (!Number(value)) {
		callback(new Error('请输入正整数'));
	} else {
		const re = /^[0-9]*[1-9][0-9]*$/;
		const rsCheck = re.test(value);
		if (!rsCheck) {
			callback(new Error('请输入正整数'));
		} else {
			callback();
		}
	}
}
// 验证是否是[0-100]的小数
export function isBtnZeroToHundred(rule: any, value: any, callback: any) {
	if (!value) {
		return callback(new Error('输入不可以为空'));
	}
	setTimeout(() => {
		if (!Number(value)) {
			callback(new Error('请输入[1,100]之间的数字'));
		} else {
			if (value < 0 || value > 100) {
				callback(new Error('请输入[1,100]之间的数字'));
			} else {
				callback();
			}
		}
	}, 100);
}
