// 命令模式的意图是把请求封装为对象，从而分离请求的发起者和请求的接收者（执行者）之间的耦合关系。在命令被执行之前，可以预先往命令对象中植入命令的接收者。
var Tv = {
	open: function () {
		console.log('open tv')
	},
	close: function () {
		console.log('close tv')
	}
}

function OpenTvCommand(reciever) {
	this.reciever = reciever;
}

OpenTvCommand.prototype.execute = function () {
	this.reciever.open();
}
OpenTvCommand.prototype.undo = function() {
	this.reciever.close();
}

function setCommand(command) {
	command.execute();
	command.undo();
}

setCommand(new OpenTvCommand(Tv));

