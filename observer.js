// 发布-订阅模式又叫做观察者模式，它定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖它的对象都将得到通知。
// 1、实现一个最简单的发布-订阅模式
var salesOffices = {}; // 定义发布者

salesOffices.clientList = {}; // 缓存列表，存放订阅者的回调函数

salesOffices.listen = function (key, fn) { // 增加订阅者
    if (!this.clientList[key]) { // 如果没有订阅过此类消息，则给此类消息添加一个缓存列表
        this.clientList[key] = [];
    }
    this.clientList.key.push(fn); // 订阅的消息加进消息缓存列表
};

salesOffices.trigger = function () { // 定义发布消息
    var key = Array.prototype.shift.call(arguments) // 取出消息类型
    fns = this.clientList[key]; // 取出该消息对应的回调函数集合
    if (!fns || fns.length === 0) { // 如果没有订阅该消息则返回
        return;
    }
    for (var i = 0, fn; fn = fns[i++];) {
        fn.apply(this, arguments);
    }
};

// 订阅消息
salesOffices.listen('squareMeter88', function (price) {
    console.log('价格: ' + price);
});
salesOffices.listen('squareMeter99', function (price) {
    console.log('价格: ' + price);
});

// 发布消息
salesOffices.trigger('squareMeter88', 10000);
salesOffices.trigger('squareMeter99', 20000);

// 2、发布-订阅模式的通用模式
var event = {
    clientList: {},
    listen: function (key, fn) {
        if (!this.clientList[key]) {
            this.clientList[key] = [];
        }
        this.clientList[key].push(fn);
    },
    trigger: function () {
        var key = Array.prototype.shift.call(arguments),
            fns = this.clientList[key];
        if (!fns || fns.length === 0) {
            return false;
        }
        for (var i = 0, fn; fn = fns[i++];) {
            fn.apply(this, arguments);
        }
    },
    remove: function (key, fn) {
        var fns = this.clientList[key];
        if (!fns) { // 如果此消息类型没有被订阅则直接返回
            return false;
        }
        if (!fn) { // 如果没有传入具体的回调函数则取消此类型的所有订阅
            fns && (fns.length = 0);
        } else {
            for (var l = fns.length; l >= 0; l--) { // 反向遍历订阅的函数回调列表
                var _fn = fns[l];
                if (_fn === fn) {
                    fns.splice(l, 1); // 删除订阅者的回调函数
                }
            }
        }
    }
};
// 定义一个可以给所有的对象都动态安装发布-订阅功能的函数
var installEvent = function (obj) {
    for (var i in event) {
        obj[i] = event[i];
    }
};
var salesOffices = {};
installEvent(salesOffices);

// 3、网站登录
// 使用发布-订阅模式之前
login.succ(function (data) {
    header.setAvatar(data.avatar);
    nav.setAvatar(data.avatar);
    message.refresh();
    cart.refresh();
});


var login = {};
installEvent(login);
// 使用发布-订阅模式之后
$.ajax('http://www.qq.com', function () {
    login.trigger('loginSucc', data);
})
var header = (function () {
    login.listen('loginSucc', function (data) {
        header.setAvatar(data.avatar);
    })
    return {
        setAvatar: function (data) {
            console.log('设置header模块的头像')
        }
    }
})();
var nav = (function () {
    login.listen('loginSucc', function (data) {
        nav.setAvatar(data.avatar);
    })
    return {
        setAvatar: function (data) {
            console.log('设置nav模块的头像')
        }
    }
})();

// 4、全局的发布-订阅对象
