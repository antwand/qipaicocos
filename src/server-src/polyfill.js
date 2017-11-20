// 客户端兼容代码
Array.isArray = Array.isArray || function (arr) {
	return Object.prototype.toString.call(arr) === '[object Array]';
};

Object.keys = Object.keys || (function () {
	'use strict';
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString');
	var dontEnums = [
		'toString',
		'toLocaleString',
		'valueOf',
		'hasOwnProperty',
		'isPrototypeOf',
		'propertyIsEnumerable',
		'constructor'
	];
	var dontEnumsLength = dontEnums.length;
	return function (obj) {
		if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
			throw new TypeError('Object.keys called on non-object');
		}
		var result = [], prop, i;
		for (prop in obj) {
			if (hasOwnProperty.call(obj, prop)) {
				result.push(prop);
			}
		}
		if (hasDontEnumBug) {
			for (i = 0; i < dontEnumsLength; i++) {
				if (hasOwnProperty.call(obj, dontEnums[i])) {
					result.push(dontEnums[i]);
				}
			}
		}
		return result;
	};
}());
