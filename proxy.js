// 代理模式
// 代理模式是为一个对象提供一个代用品或占位符，以便控制对它的访问。代理分为保护代理和虚拟代理，保护代理：代理B可以帮助A过滤掉一些请求，
// 不合适的请求会直接在代理B处被拒绝掉。虚拟代理：把一些开销很大的对象，延迟到真正需要它的时候才去创建。
// 1.虚拟代理实现图片预加载
// 创建一个普通的本体对象
var myImage = (function () {
	var imgNode = document.createElement('img');
	document.body.appendChild(imgNode);
	return {
		setSrc: function (src) {
			imgNode.src = src;
		}
	}
})();
myImage.setSrc('https://i0.hdslb.com/bfs/face/a26ff2755da5a18496927937d2ad14cd89fec79f.jpg@100w_100h.webp');

// 引入代理对象proxyImage
var myImage = (function () {
	var imgNode = document.createElement('img');
	document.body.appendChild(imgNode);
	return {
		setSrc: function (src) {
			imgNode.src = src;
		}
	}
})();
var proxyImage = (function () {
	var img = new Image();
	img.onload = function () {
		myImage.setSrc(this.src); // this === img
	}
	return {
		setSrc: function (src) {
			myImage.setSrc('http://cdn.uedna.com/201402/1392662594759_1140x0.gif');
			window.setTimeout(function () {
				img.src = src;
			}, 2000)
		}
	}
})();
proxyImage.setSrc('https://i0.hdslb.com/bfs/album/67acb99add41a4ef2df28ecfd229be7e7f2fe802.jpg');

// 2.不用代理的图片预加载函数实现
var MyImage = (function () {
	var imgNode = document.createElement('img');
	document.body.appendChild(imgNode);
	var img = new Image();
	img.onload = function () {
		imgNode.src = this.src;
	}
	return function (src) {
		imgNode.src = 'http://cdn.uedna.com/201402/1392662594759_1140x0.gif';
		img.src = src;
	}
})();
// MyImage('https://i0.hdslb.com/bfs/album/67acb99add41a4ef2df28ecfd229be7e7f2fe802.jpg');

// 代理的意义在于它符合封闭开放原则-单一职责原则
// 面向对象设计的原则：单一职责原则：单一职责原则指的是，就一个类而言，应该仅有一个引起它变化的原因。
// 如果一个对象承担了多项职责，就意味着这个对象将变得巨大，引起它变化的原因可能会有多个。
// 代理和本体实现同一个接口的好处在于：1、用户可以放心的请求代理，他只是关心能否得到想要的结果。2、在任何使用本体的地方都可以替换成使用代理。

// 3、虚拟代理合并http请求
// 当我们选中checkbox的时候，依次往服务器发送了3次同步文件的请求。解决方案是，我们可以通过一个代理函数proxySynchronousFile来收集
// 一段时间之内的请求，然后一次性发送给服务器。
var synchronousFile = function (id) {
	console.log('开始同步文件', id);
}

var proxySynchronousFile = (function () {
	var cache = [], // 保存一段时间内需要同步的id
		timer;
	return function (id) {
		cache.push(id);
		if (timer) { // 保证不会覆盖已经启动的定时器
			return;
		}
		timer = setTimeout(function () {
			synchronousFile(cache.join(',')); // 5秒后向本体发送需要同步的id集合
			cache.length = 0; // 清空id集合
			clearTimeout(timer); // 清空定时器
			timer = null;
		}, 5000)
	}
})();

window.onload = function () {
	var checkboxs = document.getElementsByTagName('input');
	for (var i = 0, checkbox; checkbox = checkboxs[i++];) {
		checkbox.onclick = function () {
			if (this.checked === true) {
				proxySynchronousFile(this.id);
			}
		}
	};
};

// 4、虚拟代理在惰性加载中的应用
// 在js文件加载之前用一个占位的miniConsole代理对象来给用户提前使用，当用户按下F2时执行真正的miniConsole代码
var miniConsole = (function () {
	var cache = [];
	// 定义本体对象
	var handler = function (ev) {
		if (ev.keyCode == 113) {
			var script = document.createElement('script');
			script.onload = function () {
				for (var i = 0, fn; fn = cache[i++];) {
					fn();
				}
			}
			script.src = 'miniConsole.js';
			head[0].appendChild(script);
			var head = document.getElementsByTagName('head');
			document.removeEventListener('keyDown', handler);
		}
	};
	document.addEventListener('keyDown', handler, false);
	// 定义代理对象
	return {
		log: function () {
			var args = arguments;
			cache.push(function () {
				return miniConsole.log.apply(miniConsole, args);
			})
		}
	}
})();

// 5、缓存代理计算乘积
// 本体对象
var mult = function () {
	var a = 1;
	for (var i = 0, l = arguments.length; i < l; i++) {
		a = a * arguments[i];
	}
	return a;
}
// 代理对象
var proxyMult = (function () {
	var cache = {};
	return function () {
		var args = Array.prototype.join.call(arguments, ',');
		if (args in cache) {
			return cache[args];
		}
		return cache[args] = mult.apply(this, arguments);
	}
})();
proxyMult(1, 2, 3, 4);
proxyMult(1, 2, 3, 4);

// 6、缓存代理用于ajax异步请求数据
// 请求数据是一个异步的操作，我们无法直接把计算结果放到缓存代理对象的缓存中，而是要通过回调的方式。

// 7、用高阶函数动态创建代理
// 创建缓存代理的工厂
var createProxyFactory = function (fn) {
	var cache = {};
	return function () {
		var args = Array.prototype.join.call(arguments, ',');
		if (args in cache) {
			return cache[args];
		}
		return cache[args] = fn.apply(this, arguments);
	}
};

proxyMult = createProxyFactory(mult); 