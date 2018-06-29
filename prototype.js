// 模拟new的运算过程
function Person(name) {
	this.name = name;
};

Person.prototype.getName = function () {
	console.log(this.name);
};

function objectFactory() {
	var obj = new Object(), // 从Object上克隆一个空的对象
		Constructor = [].shift.call(arguments); // 取得外部传入的构造器，此例为Person
	// console.log(Constructor === Person) // true
	obj.__proto__ = Constructor.prototype; // 指向正确的原型
	var ret = Constructor.apply(obj, arguments);  // 借用外部传入的构造器给obj设置属性
	return typeof ret === 'object' ? ret : obj; // 确保构造器总是会返回一个对象？
};

var a = objectFactory(Person, 'nine');
console.log(a.name) // 'nine'
a.getName(); // 'nine'
console.log(a.__proto__ === Person.prototype); // true
console.log(Object.getPrototypeOf(a) === Person.prototype) // true

/*丢失的this*/
// 利用apply把document当作this传入getId函数
var getId = document.getElementById
// getId('div') // 会抛出异常，因为this为window
document.getElementById = (function (func) {
	return function () {
		return func.apply(document, arguments);
	}
})(document.getElementById);

var getId = document.getElementById
getId('div') // 运行正常

// 有时使用call或apply的目的不在于指定this指向，而是另有用途，比如借用其他对象的方法
// 如果传入的第一个参数为null，函数体内的this会指向默认的宿主对象

Math.max.apply(null, [1, 3, 4, 8]);
// 一种场景是借用构造函数
var A = function (name) {
	this.name = name;
}
var B = function () {
	A.apply(this, arguments);
}
B.prototype.getName = function () {
	return this.name;
}
var b = new B('nine');
console.log(b.getName()); 

// 另一种场景是在操作arguments的时候 往arguments中添加新元素
//v8引擎中的具体实现：
function ArrayPush() {
	var n = TO_UINT32(this.length); // 被push的对象的length
	var m = _ArgumentsLenth(); // push的参数个数
	for (var i = 0; i < m; i++) {
		this[i + n] = _Arguments(i) // 复制元素
	}
	this.length = n + m; // 修正length属性的值
	return this.length;
}
// 由此可见Array.prototype.push实际上是一个属性复制的过程，把参数按照下标一次添加到被push的对象上，顺便修改了这个对象的length属性
// 传入的对象要满足以下两个条件
// 1、对象本身要可以存取属性
// 2、对象的length属性可读写
var len = {};
console.log(len.length) // undefind
Array.prototype.push.call(len, 9)
console.log(len.length) // 1
console.log(len instanceof Array) // flase
console.log(len) // {0: 9, length: 1}

// 模拟Function.prototype.bind实现
Function.prototype.bind = function (context) {
	var self = this // 保存原函数
	return function () {
		self.apply(context, arguments)
	}
}

// 加强版，使得可以往func中预先填入参数
Function.prototype.bind = function () {
	console.log(arguments) // [Object, 1, 4]
	var self = this, // 保留原函数
		context = [].shift.call(arguments), // 需要绑定的this上下文
		args = [].slice.call(arguments) // 剩余的参数转化成数组
	return function () { // 返回一个新的函数
		console.log(arguments) // [2, 5]
		self.apply(context, [].concat.call(args, [].slice.call(arguments)))
		// 执行函数的时候，会把之前传入的context当作新函数体内的this
		// 并且组合两次分别传入的参数，作为新函数的参数
	}
}

var obj = {
	name: 'nine'
}
var func = function (a, b, c, d) {
	console.log(a, b, c, d) // [1, 4, 2, 5]
}.bind(obj, 1, 4)

func(2, 5);