// 通过给所有Function.prototype增加方法来使得该方法对所有函数可用
Function.prototype.method = function (name, func) {
	this.prototype[name] = func
	return this;
};

// 取整
Number.method('integer', function () {
	return Math[this < 0 ? 'ceil' : 'floor'](this);
});

// console.log(Number.prototype.integer)

// 移除字符串首尾空白
String.method('trim', function () {
	return this.replace(/^\s+|\s+$/g);
});

// 映射字符实体的名字到对应的字符
String.method('deentityify', function () {
	var entity = {
		quot: '"',
		lt: '<',
		gt: '>'
	}
	return function () {	
		return this.replace(/&([^&;]+);/g, function (a, b) { // a表示匹配的子串 b表示第一个括号匹配的字符串
			// console.log(11111, a, b) 
			var r = entity[b];
			return typeof r === 'string' ? r : a
		})
	}
}());

console.log('dfs&lt;'.deentityify()) // dfs<

// 递归计算fibonacci数列
var fibonacci = function (n) {
	return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2)
}

for (var i = 0; i <= 10; i++) {
	fibonacci(i) // 自身调用了442次
}

// 优化
var fibonacci = function () {
	var memo = [0, 1];
	var fib = function (n) {
		var result = memo[n];
		if (typeof result !== 'number') {
			result = fib(n - 1) + fib(n - 2);
			memo[n] = result;
		}
		return result;
	}
	return fib;
}();

for (var i = 0; i <= 10; i++) {
	console.log(fibonacci(i)) // 自身调用了18次
}

// 编写一个函数来构造带记忆功能的函数
var memoizer = function (memo, formula) {
	var recur = function (n) {
		var result = memo[n];
		if (typeof result !== 'number') {
			result = formula(recur, n); // recur(n - 1) + recur(n - 2)
			memo[n] = result;
		}
		return result;
	}
	return recur;
}

var fibonacci = memoizer([0, 1], function (recur, n) {
	return recur(n - 1) + recur(n - 2);
})

// 产生一个可记忆的阶乘函数
var factorial = memoizer([1, 1], function (recur, n) {
	return recur(n) * recur(n - 1);
})

var reg = /[^0-9]/;
console.log(reg.test("12a3456")); // true


// console.log(b) // ReferenceError: b is not defined

// let b = 1; // let声明不存在变量提升

var foo = '11' + 2 - '1'
console.log(foo) // 111
console.log(typeof foo) // number

console.log('null ', null instanceof Object) // null false
console.log(typeof [1]) // object

function F1() {
	var tmp = 1;
	this.x = 3;
	console.log(tmp);
	console.log(this.x)
}
var obj = new F1(); // 1 3
console.log(obj.x); // 3
F1();// 1 3

function Foo() {
	foo.a = function () { console.log(1) };
	this.a = function () { console.log(2) };
	a = 4
	// var a = 5
	console.log(a)
}
// console.log(a) // undefind
Foo.prototype.a = function () { console.log(5) };
Foo.a = function () { console.log(6) };
Foo.a(); // 6
var obj = new Foo(); // 4
console.log(a) // 4
obj.a(); // 2
Foo.a(); // 6

console.log('分割线-----------------------------------------------');
var obj = { proto: { a: 1, b: 2 } }
function F() { };
F.prototype = obj.proto;
var f = new F();
obj.proto.c = 3;
obj.proto = { a: -1, b: -2 };
console.log(f.a); // 1
console.log(f.c); // 3
delete F.prototype['a'];
console.log(f.a); // undefind
console.log(obj.proto.a); // -1

console.log('分割线-----------------------------------------------');
// bar();
var foo = function bar(name) {
	console.log('hello' + name);
	console.log(bar);
}
foo('world');
// console.log(bar);
console.log(foo.toString());
// bar()

console.log('分割线------------------------------------------------')
var a = 10;
function fn() {
	a = 8;
	console.log(this.a); // 8
}
fn(8);

a.name = 'hello'
console.log(a + a.name) // NaN
console.log(a.name) // undefind
console.log(a) // 8
console.log('分割线------------------------------------------------')
// ["1", "2", "3"].map(parseInt)
console.log(null instanceof Object) // false
console.log(undefined instanceof Object) // false
console.log(NaN === NaN) // false
console.log(null === null) // true
console.log(null === undefined) // false
console.log(null == undefined) // true


console.log('正则表达式----------------------------------------')
var reg = /\d\w\d/g; // \d任意的数字 \w任意的数字 字母 下划线
var str = '4a8h7a7k3w8';
var arr = [];
var a;
while (a = reg.exec(str)) {
	console.log(a, reg.lastIndex)
	arr.push(a[0]);
	reg.lastIndex -= 1;
	console.log(reg.lastIndex)
}

var rts = /([?&])_=[^&]*/;
var cacheURL = "http://localhost:8080/qinl/xx.action?_=me";
var result = rts.exec(cacheURL);
console.log(result); // [?_=me, ?]
var s = 'script language="javascript" type=" text/javascript "';
var f = function ($1) {
	return $1.substring(0, 1).toUpperCase() + $1.substring(1);
}
// 传入第二个函数的参数顺序是：每次匹配的文本(这里是单词)，然后顺次是捕获组的值，然后是匹配字符在下标中的位置  
// 最后一个参数表示字符串本身!  
var a = s.replace(/(\b\w+\b)/g, f);
// 打印Script Language="Javascript" Type=" Text/Javascript "  
console.log(a);
// 改进
var f = function ($1, $2, $3) {
	console.log($1, $2, $3);
	//  script s cript
	//  language l anguage
	//  javascript j avascript
	//  type t ype
	//  text t ext
	//  javascript j avascript
	return $2.toUpperCase() + $3;
}
// 传入第二个函数的参数顺序是：每次匹配的文本(这里是单词)，然后顺次是捕获组的值，然后是匹配字符在下标中的位置  
// 最后一个参数表示字符串本身!  
var a = s.replace(/\b(\w)(\w*)\b/g, f);
console.log(a);


var str = '<div class="handleC"/></div></hr><p></p>',
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig
var fun = function ($1, $2, $3) {
	console.log('$1=' + $1, '$2=' + $2, '$3=' + $3); // $1=<div class="handleC"/> $2=div class="handleC" $3=div
	return "<" + $1 + "></" + $2 + ">";
}
// var elem = str.replace(rxhtmlTag, fun);
var elem = str.replace(rxhtmlTag, "<$1></$2>");
console.log(elem); // <div class="handleC"></div>


var rtagName = /<([\w:]+)/ig
console.log(rtagName.exec(str));

console.log('正则表达式----------------------------------------')
// console.log(dom.a);
// (function () {
//     let dom = { 
//         a: function () { 
//             document.querySelemctor("#XXX").childElementNode 
//         } 
//     }
// })();

function aaaa() {}
console.log(aaaa.__proto__ === Function.prototype) // true
console.log(aaaa.prototype.__proto__ === Object.prototype) // true 说明aaaa的原型是空的对象 aaaa原型的原型是Object的原型