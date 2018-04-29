// 1.原型链
// 基本思想：利用原型让一个引用类型继承另外一个引用类型的属性和方法。
// 构造函数，原型，实例之间的关系：每个构造函数都有一个原型对象，原型对象包含一个指向构造函数的指针，而实例都包含一个指向原型对象的内部指针。
// 原型链实现继承例子：
function Parent() {
    this.property = 'parent';
}
Parent.prototype.getParentProperty = function () {
    return this.property;
}
function Child() {
    this.property = 'child';
}
//继承了Parent
Child.prototype = new Parent();
Child.prototype.getChildProperty = function () {
    return this.property;
}
var child = new Child();
console.log(child.getChildProperty());//true

// 2.借用构造函数
// 基本思想：在子类型构造函数的内部调用超类构造函数，通过使用call()和apply()方法可以在新创建的对象上执行构造函数。
// 例子：
function Parent(name, age) {
    this.name = name;
    this.age = age;
    this.colors = ["red", "blue", "green"];
}
function Child(name, age, price) {
    this.price = price;
    Parent.call(this);//继承了SuperType
}
var child = new Child();
child.colors.push("black");
console.log(child.colors);//"red","blue","green","black"
var child2 = new Child();
console.log(child2.colors);//"red","blue","green"

// 3.组合继承
// 基本思想：将原型链和借用构造函数的技术组合在一块，从而发挥两者之长的一种继承模式。
// 例子：
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
// 继承方法
Child.prototype = new Parent();
// Child.prototype.constructor = Child; // constructor 属性返回对创建此对象的数组函数的引用。
Child.prototype.sayAge = function () {
    console.log(this.age);
}
var child = new Child("EvanChen", 18);
child.colors.push("black");
consol.log(child.colors);// "red","blue","green","black"
child.sayName();// "EvanChen"
child.sayAge();// 18
var kid = new Child("EvanChen666", 20);
console.log(kid.colors);// "red","blue","green"
kid.sayName();// "EvanChen666"
kid.sayAge();// 20

// 4.原型式继承
// 基本想法：借助原型可以基于已有的对象创建新对象，同时还不必须因此创建自定义的类型。
// 原型式继承的思想可用以下函数来说明：
function object(o) {
    function F() { }
    F.prototype = o;
    return new F();
}
// 例子：
var person = {
    name: "EvanChen",
    friends: ["Shelby", "Court", "Van"]
};
var anotherPerson = object(person);
anotherPerson.name = "Greg";
anotherPerson.friends.push("Rob");
var yetAnotherPerson = object(person);
yetAnotherPerson.name = "Linda";
yetAnotherPerson.friends.push("Barbie");
console.log(person.friends);//"Shelby","Court","Van","Rob","Barbie"
// ECMAScript5通过新增Object.create()方法规范化了原型式继承，这个方法接收两个参数：
// 一个用作新对象原型的对象和一个作为新对象定义额外属性的对象。
var person = {
    name: "EvanChen",
    friends: ["Shelby", "Court", "Van"]
};
var anotherPerson = Object.create(person);
anotherPerson.name = "Greg";
anotherPerson.friends.push("Rob");
var yetAnotherPerson = Object.create(person);
yetAnotherPerson.name = "Linda";
yetAnotherPerson.friends.push("Barbie");
console.log(person.friends);//"Shelby","Court","Van","Rob","Barbie"

// 5.寄生式继承
// 基本思想：创建一个仅用于封装继承过程的函数，该函数在内部以某种方式来增强对象，最后再像真正是它做了所有工作一样返回对象。
// 例子：
function object(o) {
    var F = function () { };
    F.prototype = o;
    var f = new F();
    return f;
}
function createAnother(original) {
    var clone = object(original); // clone是一个原型是original的空对象
    clone.sayHi = function () {
        alert("hi");
    };
    return clone;
}
var person = {
    name: "EvanChen",
    friends: ["Shelby", "Court", "Van"]
};
var anotherPerson = createAnother(person);
anotherPerson.sayHi();///"hi"

// 6.寄生组合式继承
// 基本思想：通过借用函数来继承属性，通过原型链的混成形式来继承方法
// 其基本模型如下所示：
function object(o) {
    function F() { };
    F.prototype = o;
    return new F();
}
function inheritProperty(subType, superType) {
    var prototype = object(superType.prototype);//创建对象
    prototype.constructor = subType;//增强对象
    subType.prototype = prototype;//指定对象
}
// 例子：
function SuperType(name) {
    this.name = name;
    this.colors = ["red", "blue", "green"];
}
SuperType.prototype.sayName = function () {
    alert(this.name);
};
function SubType(name, age) {
    SuperType.call(this, name);
    this.age = age;
}
inheritProperty(SubType, SuperType);
SubType.prototype.sayAge = function () {
    alert(this.age);
}