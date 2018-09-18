// 高阶函数 P45
// 高阶函数是指至少满足下列条件之一的函数：
// 1、函数可以作为参数被传递
var appendDiv = function (callback) {
	for (var i = 0; i < 100; i++) {
		var div = document.createElement('div');
		div.innerHTML = i;
		document.body.appendChild(div);
		if (typeof callback === 'function') {
			callback(div);
		}
	}
}
appendDiv(function (node) {
	node.style.display = 'none';
})
// 2、函数可以作为返回值输出

// 3、高阶函数实现AOP 动态织入函数 装饰者模式

// 4、高阶函数的其他应用
// currying
// uncurrying
// 函数节流
// 分时函数
// 惰性加载函数