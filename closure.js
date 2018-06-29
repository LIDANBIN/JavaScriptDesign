// 利用闭包创建一个数据类型检查工具
var Type = {};
for (var i = 0, type; type = ['String', 'Object', 'Number', 'Array'][i++];) {
	(function (type) {
		Type['is' + type] = function (obj) {
			return Object.prototype.toString.call(obj) === '[object ' + type + ']';
		}
	})(type)
};
console.log(Type.isArray([1, 2, 3]))
console.log(Type.isArray({}))
console.log(Type.isObject([1, 2, 3]))
console.log(Type.isNumber(1))
console.log(Type.isString('string'))

// 利用闭包封装函数
// 计算乘积
var mult = function () {
	var cache = {}
	return function () {
		var args = Array.prototype.join.call(arguments, ',');
		if (cache[args]) {
			return cache[args]
		}
		var a = 1
		for (var i = 0, l = arguments.length; i < l; i++) {
			a = a * arguments[i]
		}
		return cache[args] = a
	}
}();
console.log(mult(1, 2, 3, 4))

// 延续局部变量的寿命
// img

// 单例模式 目的是不创建重复内容
var getSingle = function (fn) {
	var ret;
	return function () {
		console.log(this) // window
		return ret ? ret : ret = fn.apply(this, arguments)
	}
}

var getScirpt = getSingle(function () {
	return document.createElement('script')
})

getScirpt();

// 高阶函数实现AOP，AOP是指把一个函数动态织入到另外一个函数中

// 装饰者模式
Function.prototype.before = function (beforeFn) {
	var _self = this
	console.log('before outer ', this) // func
	return function () {
		console.log('before inner ', this) // window
		beforeFn.apply(this, arguments)
		return _self.apply(this, arguments)
	}
}
Function.prototype.after = function (afterFn) {
	var _self = this
	console.log('after outer', this) // func
	return function () {
		console.log('after inner', this) // window
		var ret = _self.apply(this.arguments)
		afterFn.apply(this, arguments)
		return ret
	}
}

var func = function () {
	console.log(2)
}

func = func.before(function () {
	console.log(1)
}).after(function () {
	console.log(3)
})

func();

// 函数柯里化
// currying又称部分求值，函数接收参数之后不会立即求值，而是继续返回到另一个函数，
// 刚才传入的参数在函数形成的闭包中被保存起来，等到真正需要求值的时候一次性求值
var currying = function (fn) {
	var args = [];
	return function () {
		if (arguments.length === 0) {
			console.log('currying ', this) // window
			return fn.apply(this, args)
		} else {
			[].push.apply(args, arguments);
			return arguments.callee;
		}
	}
}

var cost = (function () {
	var money = 0;
	return function () {
		for (var i = 0, l = arguments.length; i < l; i++) {
			money += arguments[i];
		}
		return money;
	}
})()

var cost = currying(cost)

cost(100);
cost(1000);
console.log(cost());

// uncurrying 把泛化的this过程提取出来
Function.prototype.uncurrying = function () {
	var self = this;
	console.log('uncurrying ', this)
	return function () {
		var obj = Array.prototype.shift.call(arguments);
		return self.apply(obj, arguments);
	};
}
var push = Array.prototype.push.uncurrying();
(function () {
	push(arguments, 4);
	console.log(arguments);
})(1, 2, 3)
// 函数节流

// 分时函数

// 惰性加载函数

function Parent(name) {
	this.name = name;
	this.colors = ["red", "blue", "green"];
}
Parent.prototype.sayName = function () {
	console.log(this.name);
}
function Child(name, age) {
	Parent.call(this, name); // 继承属性
	this.age = age;
}


console.log('inherit------------------------------------')
// 继承方法
Child.prototype = new Parent();
console.log(Child.prototype.constructor)  // Parent
Child.prototype.constructor = Child; // constructor 属性返回对创建此对象的数组函数的引用。
console.log(Child.prototype.constructor) // Child
Child.prototype.sayAge = function () {
	console.log(this.age);
}
var child = new Child("EvanChen", 18);
child.colors.push("black");
console.log(child.colors);// "red","blue","green","black"
child.sayName();// "EvanChen"
child.sayAge();// 18
var kid = new Child("EvanChen666", 20);
console.log(kid.colors);// "red","blue","green"
kid.sayName();// "EvanChen666"
kid.sayAge();// 20
console.log('inherit------------------------------------')
