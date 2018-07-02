console.log('单例模式---------------------------------------------------')
// 单例模式的定义是：保证一个类仅有一个实例，并提供一个访问它的全局访问点
// 1.简单单例模式
// 特点：不透明，Singleton的使用者必须知道这是一个单例类，跟传统的new XXX的方式来获取对象不同。
var Singleton = function (name) {
	this.name = name;
	this.instance = null;
}
Singleton.prototype.getName = function () {
	console.log(this.name);
}
Singleton.getInstance = function (name) {
	if (!this.instance) {
		this.instance = new Singleton(name);
	}
	return this.instance;
}
var a = Singleton.getInstance('seven1');
var b = Singleton.getInstance('seven2');
console.log(a.name, b.name); // seven1 seven2

// 或者：
var Singleton = function (name) {
	this.name = name;
}
Singleton.prototype.getName = function () {
	console.log(this.name);
}
Singleton.getInstance = (function () {
	var instance = null;
	return function (name) {
		if (!instance) {
			instance = new Singleton(name);
		}
		return instance;
	}
})();
var a = Singleton.getInstance('nine1');
var b = Singleton.getInstance('nine2');
console.log(a.name, b.name) // nine1 nine2

// 2.透明单例模式
// 使用自执行的匿名函数和闭包把instance封装起来，并让这个匿名函数返回真正的Singleton构造方法。
var CreateDiv = (function () {
	var instance;
	var CreateDiv = function (html) { // 真正的Singleton构造方法，可扩展性差
		if (instance) {
			return instance
		}
		this.html = html;
		this.init();
		return instance = this;
	}
	CreateDiv.prototype.init = function () {
		var div = document.createElement('div');
		div.innerHTML = this.html;
		document.body.appendChild(div);
	}
	return CreateDiv;
})();
var div1 = new CreateDiv('singleOne');
var div2 = new CreateDiv('singleTwo');
console.log(div1, div2);

// 3.用代理实现单例模式
// 通过引入【缓存代理】类的方式，把负责管理单例的代码移除出去，使它成为一个普通的创建div的类。
var CreateDiv = function (html) {
	this.html = html;
	this.init();
}
CreateDiv.prototype.init = function () {
	var div = document.createElement('div');
	div.innerHTML = this.html;
	document.body.appendChild(div);
}
// 接下来引入代理类：proxySingletonCreateDiv:
var ProxySingletonCreateDiv = (function () {
	var instance;
	return function (html) {
		if (instance) {
			return instance;
		}
		return instance = new CreateDiv(html);
	}
})();
var div3 = new ProxySingletonCreateDiv('div3');
var div4 = new ProxySingletonCreateDiv('div4');
console.log(div3, div4)

// 以上是传统的单例模式，但JavaScript是一门无类语言，所以传统的单例模式在JavaScript中并不适用。
// 减少全局变量的使用：1.使用命名空间 2.使用闭包封装私有变量

// 4.惰性单例
// 惰性单例是指在需要的时候才创建对象实例。惰性单例在实际开发中非常有用。
// instance对象总是在我们调用Singleton.getInstance的时候才被创建，而不是页面加载好就创建。
// 例子：当click事件触发的时候创建一个div对象
var createLoginLayer = (function () {
	var div;
	return function (html) {
		if (!div) {
			div = document.createElement('div');
			div.innerHTML = html;
			div.style.display = 'none';
			document.body.appendChild(div);
		}
		return div;
	}
})();
document.getElementById('loginBtn').onclick = function () {
	var loginLayer = createLoginLayer('这是一个登录弹窗。');
	loginLayer.style.display = 'block';
}

// 通用的单例模式
// 把创建实例对象的职责和管理单例的职责分别放置在两个方法里。
var getSingle = function (fn) {
	var result;
	return function () {
		return result || (result = fn.apply(this, arguments));
	}
};

var createLoginLayer = function () {
	var div = document.createElement('div');
	div.innerHTML = '这是一个登录弹窗2。';
	// div.innerHTML = html;
	div.style.display = 'none';
	document.body.appendChild(div);
	return div;
};
var createSingleLoginLayer = getSingle(createLoginLayer);
document.getElementById('loginBtn').onclick = function () {
	var loginLayer = createSingleLoginLayer();
	loginLayer.style.display = 'block';
}

// 用例：
var bindEvent = getSingle(function () {
	document.getElementById('div1').onclick = function () {
		console.log('绑定一次。')
	}
	return true; // return一个值是必须的。
})

var render = function () {
	console.log('开始渲染列表。')
	bindEvent()
}

render();
render();
render();
// render函数和bindEvent函数都分别执行了3次，但div只绑定了一个事件。

console.log('单例模式---------------------------------------------------')