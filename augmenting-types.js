// 通过给所有Function.prototype增加方法来使得该方法对所有函数可用
Function.prototype.method = function (name, func) {
    this.prototype[name] = func
    return this;
};

// 取整
Number.method('integer', function () {
    return Math[this < 0 ? 'ceil' : 'floor'](this);
});

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
        return this.replace(/&([^&;]+);/g, function (a, b) {
            var r = entity[b];
            return typeof r === 'string' ? r : a
        })
    }
}());

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
            result = formula(recur, n);
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
console.log(reg.test("12a3456"));


// console.log(b) // ReferenceError: b is not defined

// let b = 1; // let声明不存在变量提升

var foo = '11' + 2 - '1'
console.log(foo)
console.log(typeof foo)

console.log('null ', null instanceof Object)
console.log(typeof [])

function F1() {
    var tmp = 1;
    this.x = 3;
    console.log(tmp);
    console.log(this.x)
}
var obj = new F1(); // 1 3
console.log(obj.x); // 3
F1();// 1 3 undefind

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
console.log(f.a);
console.log(f.c);
delete F.prototype['a'];
console.log(f.a);
console.log(obj.proto.a);

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