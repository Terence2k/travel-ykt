const vFilterTime = {
	mounted(range, bindings, index) {
		const state = bindings.value;

		vFilterTime.range = range;

		this.bindEvent.call(this, range, index, state);
	},
};

/**
 * 时间段去重
 * 1.获取时间的差值（timestamp）
 * 2.根据两个时间点生成一个具体时间段的list记录
 * 3.新增根据index,把生成的数组放进list
 * 4.编辑根据index,修改list里面的数据
 */

function bindEvent(e, index, state) {
	this.getData.apply(this, [e, index, state]);
}

function getData(e, index) {
	let rangeTime = getAllDateCN(new Date(e[0]), new Date(e[1]));
	// console.log(e, 'getData', hadRange.value, rangeTime);

	if (hadRange.value.length > 0) {
		//存在限制判断

		//判断是否已存入列表，如果是就清空
		if (hadRange.value[index]?.length > 0) {
			hadRange.value[index] = [];
		}

		//判断是否在范围里面
		let isHad = isCurrentRange(rangeTime);

		if (isHad) {
			message.error('已经有重复的日期');

			// 已存在就清空
			formValidate.data.dateList[index].time = [];
		} else {
			// 不存在就存入限制列表里面
			hadRange.value[index] = rangeTime;
		}
	} else {
		//新增无范围限制
		// hadRange.value.push(...range);
		hadRange.value[index] = rangeTime;
	}
}

//获取时间段的时分秒
//由于时分秒一天产生的数据量过大 84600条 ， 判断会出现85600 ^ 85600 高幂算
//所以和产品商量先做成按天算的
function getTwoTimeList(beginTime, endTime) {
	let intervaltime = (new Date(endTime).getTime() - new Date(beginTime).getTime()) / 1000;
	// console.log(intervaltime);

	let timeList = [];

	for (let i = 0; i < intervaltime + 1; i += 60) {
		let time = new Date(beginTime).getTime() + i * 1000;

		timeList.push(time);
	}

	return timeList.map(function (item, index, input) {
		var date = new Date(item + 8 * 3600 * 1000);

		return date.toJSON().substr(0, 19).replace('T', ' ').replace(/-/g, '-').slice(0, 16);
	});
}

function isCurrentRange(arr) {
	let res = false;

	arr.some((item) => {
		res = hadRange.value?.some((arrRange) => {
			return arrRange.includes(item);
		});

		return res;
	});
	return res;
}

//获取时间段的日期
//由于时分秒一天产生的数据量过大 84600条 ， 判断会出现85600 ^ 85600 高幂算
//所以和产品商量先做成按天算的，使用这个方案
function getAllDateCN(startTime, endTime) {
	const date_all = [];
	let i = 0;
	while (endTime.getTime() - startTime.getTime() >= 0) {
		const year = startTime.getFullYear();
		const month = (startTime.getMonth() + 1).toString().padStart(2, '0');
		const day = startTime.getDate().toString().padStart(2, '0');
		date_all[i] = year + '-' + month + '-' + day;
		startTime.setDate(startTime.getDate() + 1);
		i += 1;
	}
	return date_all;
}

function shijianc(timestamp) {
	const time = new Date(timestamp),
		year = time.getFullYear(),
		month = (time.getMonth() + 1).toString().padStart(2, '0'),
		date = time.getDate().toString().padStart(2, '0'),
		hours = time.getHours().toString().padStart(2, '0'),
		minute = time.getMinutes().toString().padStart(2, '0'),
		second = time.getSeconds().toString().padStart(2, '0');

	return year + '-' + month + '-' + date + ' ' + hours + ':' + minute + ':' + second;
}

/**
 * 将时间转换为 `几秒前`、`几分钟前`、`几小时前`、`几天前`
 * @param param 当前时间，new Date() 格式或者字符串时间格式
 * @param format 需要转换的时间格式字符串
 * @description param 10秒：  10 * 1000
 * @description param 1分：   60 * 1000
 * @description param 1小时： 60 * 60 * 1000
 * @description param 24小时：60 * 60 * 24 * 1000
 * @description param 3天：   60 * 60* 24 * 1000 * 3
 * @returns 返回拼接后的时间字符串
 */

function formatPast(param, format = 'YYYY-mm-dd') {
	// 传入格式处理、存储转换值
	let t, s;
	// 获取js 时间戳
	let time = new Date().getTime();
	// 是否是对象
	typeof param === 'string' || 'object' ? (t = new Date(param).getTime()) : (t = param);
	// 当前时间戳 - 传入时间戳
	time = Number.parseInt(`${time - t}`);
	if (time < 10000) {
		// 10秒内
		return '刚刚';
	} else if (time < 60000 && time >= 10000) {
		// 超过10秒少于1分钟内
		s = Math.floor(time / 1000);
		return `${s}秒前`;
	} else if (time < 3600000 && time >= 60000) {
		// 超过1分钟少于1小时
		s = Math.floor(time / 60000);
		return `${s}分钟前`;
	} else if (time < 86400000 && time >= 3600000) {
		// 超过1小时少于24小时
		s = Math.floor(time / 3600000);
		return `${s}小时前`;
	} else if (time < 259200000 && time >= 86400000) {
		// 超过1天少于3天内
		s = Math.floor(time / 86400000);
		return `${s}天前`;
	} else {
		// 超过3天
		const date = typeof param === 'string' || 'object' ? new Date(param) : param;
		return formatDate(date, format);
	}
}
