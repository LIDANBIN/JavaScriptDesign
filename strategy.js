// 策略模式的定义是：定义一系列的算法，把它们一个个封装起来，并且使它们可以相互替换。
// 一个基于策略模式的程序至少由两部分组成。第一个部分是一组策略类，策略类封装了具体的算法，并负责具体的计算过程。
// 第二部分是环境类Context，Context接受客户的请求，随后把请求委托给某一个策略类。

// 1.计算年终奖金
// 方法一：基于传统面向对象语言的模仿
// 首先定义一组策略类
var performanceS = function () { };
performanceS.prototype.calculate = function (salary) {
	return salary * 4;
}
var performanceA = function () { };
performanceA.prototype.calculate = function (salary) {
	return salary * 3;
}
var performanceB = function () { };
performanceB.prototype.calculate = function (salary) {
	return salary * 2;
}
var performanceC = function () { };
performanceC.prototype.calculate = function (salary) {
	return salary * 1;
}
// 接下来定义奖金类Bonus
var Bonus = function () {
	this.salary = null;
	this.strategy = null;
}
Bonus.prototype.setSalary = function (salary) {
	this.salary = salary;
}
Bonus.prototype.setStrategy = function (strategy) {
	this.strategy = strategy;
}
Bonus.prototype.getBonus = function () {
	return this.strategy.calculate(this.salary);
}

// 计算奖金
var bonus = new Bonus();
bonus.setSalary(15000);
bonus.setStrategy(new performanceS());
console.log(bonus.getBonus());

// JavaScript版本的策略模式
var strategies = {
	S: function (salary) {
		return salary * 4;
	},
	A: function (salary) {
		return salary * 3;
	},
	B: function (salary) {
		return salary * 2;
	}
};
var calculateBonus = function (level, salary) {
	return strategies[level](salary);
};
console.log(calculateBonus('S', 20000));
console.log(calculateBonus('A', 15000));

// 2.表单校验

// 先定义一组策略类
var strategies = {
	isNonEmpty: function (value, errorMsg) { // 不为空
		if (value === '') {
			return errorMsg;
		}
	},
	minLength: function (value, length, errorMsg) {
		if (value.length < length) {
			return errorMsg;
		}
	},
	isMobile: function (value, errorMsg) {
		if (!/(^1[3|5|8][0-9]{9})$/.test(value)) {
			return errorMsg;
		}
	}
};

var Validator = function () {
	this.cache = [];
}
Validator.prototype.add = function (dom, rule, errorMsg) {
	var ary = rule.split(':'); // 把策略和参数分开 [strategy, length]
	this.cache.push(function () {
		var strategy = ary.shift(); // 获取策略 [length]
		var value = dom.value; // 获取表单的值
		ary.unshift(value); // [value, length]
		ary.push(errorMsg) // [value, length, errorMsg]
		return strategies[strategy].apply(dom, ary);
	});
};
// 改进 给某种文本输入框添加多种校验规则
Validator.prototype.add = function (dom, rules) {
	var self = this;
	for (let i = 0, rule; rule = rules[i++];) {
		(function (rule) {
			var errorMsg = rule.errorMsg; // 写在这里是为了减少向上查找作用域的次数
			var ary = rule.strategy.split(':');
			self.cache.push(function () {
				var strategy = ary.shift();
				ary.unshift(dom.value);
				ary.push(errorMsg);
				return strategies[strategy].apply(dom, ary);
			})
		})(rule)
	}
}

Validator.prototype.start = function () {
	for (var i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
		var msg = validatorFunc(); // 开始校验，并取得校验后的返回信息
		if (msg) {
			return msg; // 如果有确切的返回值，说明校验没有通过
		}
	}
};

window.onload = function () {
	var registerForm = document.getElementById('registerForm');
	var validataFunc = function () {
		var validator = new Validator(); // 创建一个validator对象
		/*******************添加一些校验规则**************** */
		// validator.add(registerForm.userName, 'isNonEmpty', '用户名不能为空');
		// validator.add(registerForm.passWord, 'minLength:6', '密码长度不能少于6位');
		// validator.add(registerForm.phoneNumber, 'isMobile', '手机号码格式不正确');
		validator.add(registerForm.userName, [
			{ strategy: 'isNonEmpty', errorMsg: '用户名不能为空' },
			{ strategy: 'minLength:10', errorMsg: '用户名长度不能少于10位' }
		]);
		validator.add(registerForm.passWord, [
			{ strategy: 'minLength:6', errorMsg: '用户名长度不能少于6位' }
		]);
		validator.add(registerForm.phoneNumber, [
			{ strategy: 'isMobile', errorMsg: '手机号码格式不正确' },
		]);
		return validator.start(); // 获得校验结果并返回
	}
	registerForm.onsubmit = function () {
		var errorMsg = validataFunc();
		if (errorMsg) {
			alert(errorMsg);
			return false;
		}
	}
}